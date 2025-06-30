<script setup>

import { themes } from '@/plugins/vuetify/theme';
import { useFormsStore } from '@/stores/formsStore';
import { useMessageStore } from '@/stores/messageStore';
import { usePatientStore } from '@/stores/patientStore';
import ChatActiveChatUserProfileSidebarContent from '@/views/apps/chat/ChatActiveChatUserProfileSidebarContent.vue';
import ChatLeftSidebarContent from '@/views/apps/chat/ChatLeftSidebarContent.vue';
import ChatLog from '@/views/apps/chat/ChatLog.vue';
import ChatUserProfileSidebarContent from '@/views/apps/chat/ChatUserProfileSidebarContent.vue';
import { useChat } from '@/views/apps/chat/useChat';
import { useChatStore } from '@/views/apps/chat/useChatStore';
import { onMounted } from 'vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import {
  useDisplay,
  useTheme,
} from 'vuetify';
const messageStore = useMessageStore()
const patientStore = usePatientStore()
const { currentUser, isAuthenticated } = useAuth()
const props = defineProps({
  user: {
    type: Object,
    required: false,
  },
})
const formsStore = useFormsStore()
const attachments = ref([])
const previewAttachments = ref([])
const isFormRequet = ref(false);
const link = ref(null);
const intakeFormRef = ref()
const intakeFormId = ref(null)
definePage({
  meta: {
    layoutWrapperClasses: 'layout-content-height-fixed', action: 'read',
    subject: 'Dashboard View',
  }
})


// composables
const vuetifyDisplays = useDisplay()
const store = useChatStore()
const { isLeftSidebarOpen } = useResponsiveLeftSidebar(vuetifyDisplays.smAndDown)
const { resolveAvatarBadgeVariant } = useChat()

// Perfect scrollbar
const chatLogPS = ref()
const previewUrl = ref(null)
const scrollToBottomInChatLog = () => {

  const scrollEl = chatLogPS.value.$el || chatLogPS.value

  scrollEl.scrollTop = scrollEl.scrollHeight
}

// Search query
const q = ref('')

watch(q, val => store.fetchChatsAndContacts(val), { immediate: true })

// Open Sidebar in smAndDown when "start conversation" is clicked
const startConversation = () => {
  if (vuetifyDisplays.mdAndUp.value)
    return
  isLeftSidebarOpen.value = true
}
onBeforeMount(async () => {

  if (currentUser.value.user_type == 'patient' && props.user) {
    await messageStore.getUserByAppoimnet(props.user.appointment_id)
    //console.log(messageStore.getUserAppoimnet)
    openChatOfContact(messageStore.getUserAppoimnet.id)
  } else {

    if (props.user) {
      //openChatOfContact(props.user.id)
      nextTick(() => {
        scrollToBottomInChatLog()
      })
    }
  }
  //await store.unreadMsag()
  //console.log(' store.unreadMsg', store.unreadMsg)
  //await initPusherListeners()
})
onMounted(async () => {
  console.log('dfdfdfd', currentUser.value.user_type)
  await store.setChatLogPS(chatLogPS.value);
  if (currentUser.value.user_type != 'patient') {
    await formsStore.getFormByType('charting-forms')
  }

})
onUnmounted(() => {
  const { currentUser } = GLOBAL_VARIABLE.useAuth
  if (currentUser.value.user_type == 'patient') {
    window.Echo.leave(`notification-patient-${currentUser.value.id}`);
  } else {
    window.Echo.leave(`notification-user-${currentUser.value.id}`);
  }
});
// Chat message
const msg = ref('')

const sendMessage = async () => {
  console.log(store.msg, attachments.value.length);
  console.log(store.msg, attachments.value.length);
  if (store.msg == 'null' && attachments.value.length === 0)
    return
  if (await store.sendMsg(store.msg, attachments.value)) {
    // Reset message input
    console.log('Before clearing:', previewAttachments.value);

    store.msg = '';
    previewAttachments.value = [];
    attachments.value = [];


    console.log('After clearing:', previewAttachments.value);
  }



  // Scroll to bottom
  nextTick(() => {
    scrollToBottomInChatLog()
  })
}

const openChatOfContact = async (userId) => {
  await store.getChat(userId)

  // Reset message input
  msg.value = ''

  // Set unseenMsgs to 0
  const contact = store.chatsContacts.find(c => c.id === userId)
  if (contact)
    contact.chat.unseenMsgs = 0

  // if smAndDown =>  Close Chat & Contacts left sidebar
  if (vuetifyDisplays.smAndDown.value)
    isLeftSidebarOpen.value = false

  // Scroll to bottom
  nextTick(() => {
    scrollToBottomInChatLog()
  })
}

// User profile sidebar
const isUserProfileSidebarOpen = ref(false)

// Active chat user profile sidebar
const isActiveChatUserProfileSidebarOpen = ref(false)

// file input
const refInputEl = ref()
const { name } = useTheme()

const chatContentContainerBg = computed(() => {
  let color = 'transparent'
  if (themes)
    color = themes?.[name.value].colors?.background

  return color
})



function removeAttachment(index) {
  const attachment = attachments.value[index];
  // Revoke the object URL for the image preview to free memory
  if (attachment.previewUrl) {
    URL.revokeObjectURL(attachment.previewUrl);
    URL.revokeObjectURL(previewAttachments.previewUrl);
  }

  // Remove the attachment from the array
  attachments.value.splice(index, 1);
  previewAttachments.value.splice(index, 1);
  console.log("Remaining attachments:", attachments.value, previewAttachments.value);
}

// function handleFileChange(event) {
//   const files = Array.from(event.target.files)

//   files.forEach(file => {

//     store.attachments.push({
//       file, // original File object
//       name: file.name,
//       size: file.size,
//       type: file.type,
//     })
//   })

//   // Reset input so the same file can be selected again
//   refInputEl.value.value = null
// }

function handleFileChange(event) {
  const files = Array.from(event.target.files);

  files.forEach(file => {
    // Add all files to attachments
    attachments.value.push(file);

    // Handle file preview based on type
    if (file.type.startsWith('image/')) {
      // For images (png, jpg, etc.)
      const previewUrl = URL.createObjectURL(file);
      previewAttachments.value.push({
        file: file,
        previewUrl: previewUrl,
        type: 'image'
      });
    } else if (file.type === 'application/pdf') {
      // For PDF files
      previewAttachments.value.push({
        file: file,
        type: 'pdf',
        name: file.name
      });
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel') {
      // For Excel files
      previewAttachments.value.push({
        file: file,
        type: 'excel',
        name: file.name
      });
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword') {
      // For Word documents
      previewAttachments.value.push({
        file: file,
        type: 'word',
        name: file.name
      });
    } else {
      // For other file types
      previewAttachments.value.push({
        file: file,
        type: 'other',
        name: file.name
      });
    }
  });

  console.log("previewAttachments", previewAttachments.value);

  // Reset the file input
  refInputEl.value.value = null;
}

const sendFormRequest = async () => {
  const { valid } = await intakeFormRef.value.validate()
  console.log(valid)
  if (valid) {
    console.log("user", props.user);
    let data = {

      patient_id: currentUser.value.id,
      form_id: intakeFormId.value,
      request_name: '',
      status: 'pending'
    }
    console.log("data", data);
    let resp = await patientStore.sendFormRequest(data);
    console.log("resp", resp);
    if (resp.link) {
      link.value = resp.link;
      store.msg = (store.msg || '') + resp.link;
      sendMessage();
      link.value = '';
      isFormRequet.value = false;
      intakeFormId.value = '';
    }

    addAlert('Request saved successfully', 'success')
  }
};

const copyLink = () => {
  if (link.value) {
    navigator.clipboard.writeText(link.value)
      .then(() => {
        // Optionally, show a success message (you can replace this with your preferred notification method)
        alert('Link copied to clipboard!')
        link.value = '';
        isFormRequet.value = false;
        intakeFormId.value = '';
      })
      .catch(err => {
        // Handle error (you can also show an error message to the user)
        console.error('Failed to copy text: ', err)
      })
  }
}
const handlePaste = (event) => {
  // Access clipboard items
  const items = event.clipboardData.items

  // Iterate over each item in the clipboard
  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    // If the item is an image, process it
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        // Add to attachments
        attachments.value.push(file)

        // Create preview URL for the image
        const previewUrl = URL.createObjectURL(file)

        // Store in previewAttachments
        previewAttachments.value.push({
          file: file,
          previewUrl: previewUrl,
          type: 'image'
        })
      }
    }
  }
}

document.addEventListener('paste', handlePaste)
</script>

<template>
  <VLayout class="chat-app-layout" style="z-index: 0; height: calc(100vh - 150px);">
    <!-- 👉 user profile sidebar -->
    <VNavigationDrawer v-model="isUserProfileSidebarOpen" temporary touchless absolute class="user-profile-sidebar"
      location="start" width="370">
      <ChatUserProfileSidebarContent @close="isUserProfileSidebarOpen = false" />
    </VNavigationDrawer>

    <!-- 👉 Active Chat sidebar -->
    <VNavigationDrawer v-model="isActiveChatUserProfileSidebarOpen" width="374" absolute temporary location="end"
      touchless class="active-chat-user-profile-sidebar">
      <ChatActiveChatUserProfileSidebarContent @close="isActiveChatUserProfileSidebarOpen = false" />
    </VNavigationDrawer>

    <!-- 👉 Left sidebar   -->
    <VNavigationDrawer v-model="isLeftSidebarOpen" absolute touchless location="start" width="370"
      :temporary="$vuetify.display.smAndDown" class="chat-list-sidebar" :permanent="$vuetify.display.mdAndUp"
      v-if="!props.user">
      <ChatLeftSidebarContent v-model:isDrawerOpen="isLeftSidebarOpen" v-model:search="q"
        @open-chat-of-contact="openChatOfContact" @show-user-profile="isUserProfileSidebarOpen = true"
        @close="isLeftSidebarOpen = false" v-if="!props.user" />
    </VNavigationDrawer>

    <!-- 👉 Chat content -->
    <VMain class="chat-content-container">
      <!-- 👉 Right content: Active Chat -->
      <div v-if="store.activeChat" class="d-flex flex-column h-100">
        <!-- 👉 Active chat header -->
        <div class="active-chat-header d-flex align-center text-medium-emphasis bg-surface">
          <!-- Sidebar toggler -->
          <IconBtn class="d-md-none me-3" @click="isLeftSidebarOpen = true">
            <VIcon icon="tabler-menu-2" />
          </IconBtn>

          <!-- avatar -->
          <div class="d-flex align-center cursor-pointer" @click="isActiveChatUserProfileSidebarOpen = true">
            <VBadge dot location="bottom right" offset-x="3" offset-y="0"
              :color="resolveAvatarBadgeVariant(store.activeChat.contact.status)" bordered>
              <VAvatar size="40" :variant="!store.activeChat.contact.avatar ? 'tonal' : undefined"
                :color="!store.activeChat.contact.avatar ? resolveAvatarBadgeVariant(store.activeChat.contact.status) : undefined"
                class="cursor-pointer">
                <VImg v-if="store.activeChat.contact.avatar" :src="store.activeChat.contact.avatar"
                  :alt="store.activeChat.contact.fullName" />
                <span v-else>{{ avatarText(store.activeChat.contact.fullName) }}</span>
              </VAvatar>
            </VBadge>

            <div class="flex-grow-1 ms-4 overflow-hidden">
              <div class="text-h6 mb-0 font-weight-regular">
                {{ store.activeChat.contact.fullName }}
              </div>
              <p class="text-truncate mb-0 text-body-2">
                {{ store.activeChat.contact.role }}
              </p>
            </div>
          </div>

          <VSpacer />

          <!-- Header right content -->
          <div class="d-sm-flex align-center d-none text-medium-emphasis" style="display: none;">
            <IconBtn style="display: none;">
              <VIcon icon="tabler-phone" />
            </IconBtn>
            <IconBtn style="display: none;">
              <VIcon icon="tabler-video" />
            </IconBtn>
            <IconBtn style="display: none;">
              <VIcon icon="tabler-search" />
            </IconBtn>
            <IconBtn style="display: none;">
              <VIcon icon="tabler-dots-vertical" />
            </IconBtn>
          </div>
        </div>

        <VDivider />

        <!-- Chat log -->
        <PerfectScrollbar ref="chatLogPS" tag="ul" :options="{ wheelPropagation: false }" class="flex-grow-1">
          <ChatLog />
        </PerfectScrollbar>

        <!-- Message form -->
        <VForm class="chat-log-message-form mb-5 mx-5" @submit.prevent="sendMessage" enctype="multipart/form-data">
          <!-- Text input field at the top -->
          <VTextField :key="store.activeChat?.contact.id" v-model="store.msg" variant="solo" density="default"
            @update:model-value="store.msg = $event" class="chat-message-input"
            :placeholder="$t('Type your message1...')" autofocus>
            <div class="d-flex justify-end mt-2" v-if="currentUser.user_type == 'patient'">
              <IconBtn @click="refInputEl?.click()">
                <VIcon icon="tabler-paperclip" size="22" />
              </IconBtn>
            </div>
            <template #append-inner>
              <div class="d-flex gap-1 align-center">
                <!-- Send message button -->
                <IconBtn @click="sendMessage">
                  <VIcon icon="tabler-send" />
                </IconBtn>
              </div>
            </template>
            <div class="demo-space-x" v-if="currentUser.user_type == 'provider'">
              <VMenu transition="scale-transition">
                <template #activator="{ props }">
                  <IconBtn v-bind="props">
                    <VIcon icon="tabler-paperclip" size="22" />
                  </IconBtn>
                </template>

                <VList>
                  <VListItem @click="refInputEl?.click()">
                    <VListItemContent>
                      <VListItemTitle>Attachment</VListItemTitle>
                    </VListItemContent>
                  </VListItem>

                  <VListItem @click="isFormRequet = true">
                    <VListItemContent>
                      <VListItemTitle>Form Request {{ props.user }}</VListItemTitle>
                    </VListItemContent>
                  </VListItem>
                </VList>
              </VMenu>
            </div>
          </VTextField>

          <!-- Attachment controls and previews below the text field -->
          <div class="d-flex flex-column mt-2" v-if="previewAttachments.length > 0">
            <!-- Image previews section -->
            <div class="d-flex flex-wrap gap-2 mb-2">
              <div v-for="(attachment, index) in previewAttachments" :key="index"
                class="d-flex flex-column align-center position-relative">

                <!-- Image Preview -->
                <template v-if="attachment.previewUrl && attachment.type === 'image'">
                  <img :src="attachment.previewUrl" alt="preview"
                    style="width: auto; height: 100px; object-fit: cover; border-radius: 4px;" class="mb-1" />
                </template>


                <!-- File Name with Remove Button -->
                <div class="d-flex align-center mt-1">
                  <span class="text-caption text-truncate" style="max-width: 100%;">
                    {{ attachment.file.name }}
                  </span>
                  <IconBtn @click="removeAttachment(index)" class="ms-1">
                    <VIcon icon="tabler-x" size="18" />
                  </IconBtn>
                </div>
              </div>
            </div>
          </div>

          <!-- Attachment button always visible -->


          <!-- Hidden file input -->
          <input ref="refInputEl" @change="handleFileChange" type="file" multiple name="file"
            accept=".jpeg,.png,.jpg,.gif,.pdf, .csv, .xlsx" hidden>
        </VForm>
      </div>

      <!-- 👉 Start conversation -->
      <div v-else class="d-flex h-100 align-center justify-center flex-column">
        <VAvatar size="98" variant="tonal" color="primary" class="mb-4">
          <VIcon size="50" class="rounded-0" icon="tabler-message-2" />
        </VAvatar>
        <VBtn v-if="$vuetify.display.smAndDown" rounded="pill" @click="startConversation">
          {{ $t('Start Conversation') }}
        </VBtn>

        <p v-else style="max-inline-size: 40ch; text-wrap: balance;" class="text-center text-disabled">
          {{ $t('Start connecting with the people by selecting one of the contact on left') }}
        </p>
      </div>
    </VMain>


    <VDialog v-model="isFormRequet" max-width="600">
      <DialogCloseBtn @click="[isFormRequet = !isFormRequet, intakeFormId = null]" />
      <VCard :title="$t('Form Request')">
        <VCardText>
          <VForm ref="intakeFormRef">
            <!-- <VRow v-if="link">
              <VCol cols="9">
                <AppTextField v-model="link" readonly></AppTextField>
              </VCol>
              <VCol cols="3">
                <VBtn class="" @click="copyLink">{{ $t('Copy Link') }}</VBtn>
              </VCol>
            </VRow> -->
            <VRow>
              <VCol cols="9">
                <AppSelect v-model="intakeFormId" :label="$t('Select Intake Form')" placeholder=""
                  :items="formsStore.forms" item-value="id" item-title="name" :rules="[requiredValidator]" />
              </VCol>
              <VCol cols="3">
                <VBtn class="mt-6" @click="sendFormRequest">{{ $t('Send Request') }}</VBtn>
              </VCol>
            </VRow>
          </VForm>




        </VCardText>
      </VCard>
    </VDialog>
  </VLayout>
</template>

<style lang="scss">
@use "@styles/variables/vuetify";
@use "@core/scss/base/mixins";
@use "@layouts/styles/mixins" as layoutsMixins;

// Variables
$chat-app-header-height: 76px;

// Placeholders
%chat-header {
  display: flex;
  align-items: center;
  min-block-size: $chat-app-header-height;
  padding-inline: 1.5rem;
}

.chat-start-conversation-btn {
  cursor: default;
}

.chat-app-layout {
  border-radius: vuetify.$card-border-radius;

  @include mixins.elevation(vuetify.$card-elevation);

  $sel-chat-app-layout: &;

  @at-root {
    .skin--bordered {
      @include mixins.bordered-skin($sel-chat-app-layout);
    }
  }

  .active-chat-user-profile-sidebar,
  .user-profile-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }

  .chat-list-header,
  .active-chat-header {
    @extend %chat-header;
  }

  .chat-list-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }
}

.chat-content-container {
  /* stylelint-disable-next-line value-keyword-case */
  background-color: v-bind(chatContentContainerBg);

  // Adjust the padding so text field height stays 48px
  .chat-message-input {
    .v-field__input {
      font-size: 0.9375rem !important;
      line-height: 1.375rem !important;
      padding-block: 0.6rem 0.5rem;
    }

    .v-field__append-inner {
      align-items: center;
      padding-block-start: 0;
    }

    .v-field--appended {
      padding-inline-end: 8px;
    }
  }
}

.chat-user-profile-badge {
  .v-badge__badge {
    /* stylelint-disable liberty/use-logical-spec */
    min-width: 12px !important;
    height: 0.75rem;
    /* stylelint-enable liberty/use-logical-spec */
  }
}
</style>
