<script setup>
import { useChatStore } from '@/views/apps/chat/useChatStore'

const store = useChatStore()

const contact = computed(() => ({
  id: store.activeChat?.contact.id,
  avatar: store.activeChat?.contact.avatar,
}))

const resolveFeedbackIcon = feedback => {
  if (feedback.isSeen)
    return {
      icon: 'tabler-checks',
      color: 'success',
    }
  else if (feedback.isDelivered)
    return {
      icon: 'tabler-checks',
      color: undefined,
    }
  else
    return {
      icon: 'tabler-check',
      color: undefined,
    }
}

// Helper function for file icons
const getFileIcon = (extension) => {
  // Return appropriate icon based on file extension
  const iconMap = {
    pdf: 'tabler-file-type-pdf',
    doc: 'tabler-file-type-doc',
    docx: 'tabler-file-type-doc',
    xls: 'tabler-file-type-xls',
    xlsx: 'tabler-file-type-xls',
    ppt: 'tabler-file-type-ppt',
    pptx: 'tabler-file-type-ppt',
    // Add more mappings as needed
  }

  return iconMap[extension.toLowerCase()] || 'tabler-file'
}

// Fixed download function that ensures the file is actually downloaded
const downloadFile = (file) => {
  try {
    // Create a URL using fetch to get the file
    fetch(file.url + '/' + file.storedName)
      .then(response => response.blob())
      .then(blob => {
        // Create an object URL for the blob
        const blobUrl = URL.createObjectURL(blob)

        // Create a download link
        const downloadLink = document.createElement('a')
        downloadLink.href = blobUrl
        downloadLink.download = file.originalName

        // Append link to body, click it, and remove it
        document.body.appendChild(downloadLink)
        downloadLink.click()

        // Clean up
        setTimeout(() => {
          document.body.removeChild(downloadLink)
          URL.revokeObjectURL(blobUrl)
        }, 100)
      })
      .catch(error => {
        console.error('Download failed:', error)
        // Fallback method if fetch fails
        directDownloadFallback(file)
      })
  } catch (error) {
    console.error('Error in download function:', error)
    // Fallback method if there's an error
    directDownloadFallback(file)
  }
}

// Fallback download method using anchor element directly
const directDownloadFallback = (file) => {
  const downloadLink = document.createElement('a')
  downloadLink.href = file.url + '/' + file.storedName
  downloadLink.setAttribute('download', file.originalName)
  downloadLink.setAttribute('target', '_blank')
  downloadLink.style.display = 'none'
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}

// Function to view/preview the file in a new tab
const viewFile = (file) => {
  window.open(file.url + '/' + file.storedName, '_blank')
}

const msgGroups = computed(() => {
  let messages = []
  const _msgGroups = []
  if (store.activeChat.chat) {
    console.log(store.activeChat.chat)
    messages = store.activeChat.chat.messages
    if (messages.length > 0) {
      let msgSenderId = messages[0].senderId
      let msgGroup = {
        senderId: msgSenderId,
        messages: [],
      }
      messages.forEach((msg, index) => {
        if (msgSenderId === msg.senderId) {
          // Include files array in the message data if present
          msgGroup.messages.push({
            message: msg.message,
            time: msg.time,
            feedback: msg.feedback,
            type: msg.type || 'text',
            files: msg.files || []
          })
        } else {
          msgSenderId = msg.senderId
          _msgGroups.push(msgGroup)
          msgGroup = {
            senderId: msg.senderId,
            messages: [{
              message: msg.message,
              time: msg.time,
              feedback: msg.feedback,
              type: msg.type || 'text',
              files: msg.files || []
            }],
          }
        }
        if (index === messages.length - 1)
          _msgGroups.push(msgGroup)
      })
    }
  }

  return _msgGroups
})

const convertLinksToHTML = (text) => {
  if (!text) return ''

  // Regular expression to match URLs
  // This regex matches http/https links, as well as "www." domains and standard domain.com patterns
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?(?:\/[^\s]*)?)/g

  // Replace URLs with HTML anchor tags
  return text.replace(urlRegex, (match) => {
    let url = match

    // Add https:// prefix if it doesn't exist (for www. or domain.com matches)
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-decoration-underline" style="color: inherit;">${match}</a>`
  })
}
</script>

<template>
  <div class="chat-log pa-6">
    <div v-for="(msgGrp, index) in msgGroups" :key="msgGrp.senderId + String(index)"
      class="chat-group d-flex align-start" :class="[{
        'flex-row-reverse': msgGrp.senderId !== contact.id,
        'mb-6': msgGroups.length - 1 !== index,
      }]">
      <div class="chat-avatar" :class="msgGrp.senderId !== contact.id ? 'ms-4' : 'me-4'">
        <VAvatar size="32">
          <VImg :src="msgGrp.senderId === contact.id ? contact.avatar : store.profileUser?.avatar" />
        </VAvatar>
      </div>
      <div class="chat-body d-inline-flex flex-column"
        :class="msgGrp.senderId !== contact.id ? 'align-end' : 'align-start'">
        <div v-for="(msgData, msgIndex) in msgGrp.messages" :key="msgData.time"
          class="chat-content py-2 px-4 elevation-2" style="background-color: rgb(var(--v-theme-surface));" :class="[
            msgGrp.senderId === contact.id ? 'chat-left' : 'bg-primary text-white chat-right',
            msgGrp.messages.length - 1 !== msgIndex ? 'mb-2' : 'mb-1',
          ]">
          <!-- Text message content -->
          <p v-if="msgData.message" class="mb-0 text-base" v-html="convertLinksToHTML(msgData.message || '')"></p>

          <!-- Image attachments section - shown when files are present -->
          <div v-if="msgData.type === 'file' && msgData.files && msgData.files.length > 0"
            class="chat-attachments mt-2 pt-2 border-t">
            <div class="d-flex flex-wrap gap-2">
              <div v-for="(file, fileIndex) in msgData.files" :key="fileIndex" class="attachment-item">
                <!-- Show image preview if it's an image type -->
                <div v-if="file.mimeType && file.mimeType.startsWith('image/')"
                  class="attachment-image position-relative">
                  <img :src="file.url + '/' + file.storedName" :alt="file.originalName" class="rounded"
                    style="max-width: 100%; max-height: 120px; object-fit: cover;" @click="viewFile(file)" />

                  <!-- File name and download button for images -->
                  <div class="d-flex align-center justify-space-between mt-1 px-1 w-100">
                    <span class="text-caption text-truncate" style="max-width: 100%;"
                      :class="{ 'text-white': msgGrp.senderId !== contact.id }">
                      {{ file.originalName }}
                    </span>
                    <v-btn icon size="small" :color="msgGrp.senderId !== contact.id ? 'white' : 'primary'"
                      variant="text" @click.stop="downloadFile(file)">
                      <v-icon size="16">tabler-download</v-icon>
                    </v-btn>
                  </div>
                </div>

                <!-- Display non-image file as an icon with name -->
                <div v-else class="attachment-file d-flex align-center pa-1">
                  <v-icon :class="{ 'text-white': msgGrp.senderId !== contact.id }" class="me-1">
                    {{ getFileIcon(file.extension) }}
                  </v-icon>
                  <span class="text-caption text-truncate" style="max-width: 100%;"
                    :class="{ 'text-white': msgGrp.senderId !== contact.id }">
                    {{ file.originalName }}
                  </span>

                  <!-- Download button for files - always visible -->
                  <v-btn icon size="small" class="ms-auto" :color="msgGrp.senderId !== contact.id ? 'white' : 'primary'"
                    variant="text" @click="downloadFile(file)">
                    <v-icon size="16">tabler-download</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Message time and status indicators -->
        <div :class="{ 'text-right': msgGrp.senderId !== contact.id }">
          <VIcon v-if="msgGrp.senderId !== contact.id" size="16"
            :color="resolveFeedbackIcon(msgGrp.messages[msgGrp.messages.length - 1].feedback).color">
            {{ resolveFeedbackIcon(msgGrp.messages[msgGrp.messages.length - 1].feedback).icon }}
          </VIcon>
          <span class="text-sm ms-2 text-disabled">{{ formatDate(msgGrp.messages[msgGrp.messages.length - 1].time, {
            hour: 'numeric', minute: 'numeric'
          }) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.chat-log {
  .chat-body {
    max-inline-size: calc(100% - 6.75rem);

    .chat-content {
      border-end-end-radius: 6px;
      border-end-start-radius: 6px;

      p {
        overflow-wrap: anywhere;
      }

      &.chat-left {
        border-start-end-radius: 6px;
      }

      &.chat-right {
        border-start-start-radius: 6px;
      }

      .chat-attachments {
        border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

        .attachment-image {
          position: relative;

          img {
            transition: transform 0.2s;
            cursor: pointer;

            &:hover {
              transform: scale(1.05);
            }
          }
        }

        .attachment-file {
          background-color: rgba(var(--v-theme-on-surface), 0.04);
          border-radius: 4px;

          .v-btn {
            opacity: 1;
            /* Always visible */
          }
        }
      }
    }
  }
}
</style>
