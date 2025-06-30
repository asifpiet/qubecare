<script setup>
import { useAuth } from '@/composables/useAuth'
import { useMessageStore } from '@/stores/messageStore'
import { usePatientStore } from '@/stores/patientStore'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { onBeforeMount, onMounted, ref } from 'vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
const patientStore = usePatientStore()
const messageStore = useMessageStore()
const { currentUser, isAuthenticated } = useAuth()
const accessToken = useCookie('accessToken').value;
const messageContainer = ref(null)
const usersList = ref([])
const activeSubject = ref(null)
const message = ref('')
const messageUreadCount = ref(0)
const refVForm = ref()
const props = defineProps({
  patient: {
    type: Object,
    required: false,
  },
})
await messageStore.getUserByAppoimnet(props.patient.appointment_id)
console.log(messageStore.getUserAppoimnet)
onBeforeMount(async () => {
  if (props.patient.patient_view) {
    currentUser.value = { ...props.patient }
  }
  console.log(props.patient)
})
const initPusherListeners = async () => {
  // Configure Pusher
  // window.Pusher = Pusher
  // window.Echo = new Echo({
  //   broadcaster: 'pusher',
  //   key: import.meta.env.VITE_PUSHER_APP_KEY,
  //   cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  //   forceTLS: true
  // })
  const apiEndpoint = BASE_URL;
  window.Pusher = Pusher;
  const key = import.meta.env.VITE_PUSHER_APP_KEY;
  const cluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;
  window.Echo = new Echo({
    broadcaster: 'pusher',

    key: key,
    cluster: cluster,
    forceTLS: true,
    authEndpoint: `${apiEndpoint}${PATIENT_BROADCAST_API}`,
    auth: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        AccessToken: `${accessToken}`
      },
    },
  });
  console.log(`message-${props.patient.id}-${activeSubject.value.id}`)
  if (props.patient.user_type == 'patient') {
    window.Echo.private(`message-${props.patient.id}-${activeSubject.value.id}`)
      .listen('OnNewMessage', async (event) => {
        console.log('New message received: ' + JSON.stringify(event));
        const messageExists = messageStore.messageList.some(val => val.id === event.id);
        if (!messageExists) {
          messageStore.messageList.push(event);

          messageStore.messageList.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }
        scrollToBottom();
      });
    window.Echo.private(`message-uread-${props.patient.id}-${activeSubject.value.id}`)
      .listen('UnreadMessages', async (event) => {
        console.log('message: ' + JSON.stringify(event));
        messageUreadCount.value = event.unread_count
      })
  }

  // Listen for new messages

}

// Load subjects on mount
onMounted(async () => {




  await messageStore.loadUsersPatient()
  if (props.patient) {
    openSubjectMessages(messageStore.getUserAppoimnet)
  }
  await initPusherListeners()
})

onUnmounted(() => {
  // Clean up Pusher listeners
  if (window.Echo) {
    window.Echo.leave(`chat.${currentUser.value.id}`)
  }
})


const scrollToBottom = () => {
  setTimeout(() => {
    if (messageContainer.value) {
      const scrollElement = messageContainer.value.$el || messageContainer.value
      console.log(messageStore.messageList)
      if (messageStore.messageList.length > 2) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      } else {
        scrollElement.scrollTop = 0
      }

    }
  }, 100)
}

const openSubjectMessages = async (subject) => {
  console.log(subject)
  messageStore.messageList = []

  activeSubject.value = subject
  await messageStore.getMessagesByUserPatient(subject.id)
  scrollToBottom()
  await messageStore.loadUsersPatient()
}

const sendMessage = async (event) => {
  const { valid } = await refVForm.value.validate()
  if (event?.type === 'submit') {
    event.preventDefault()
  }

  let data = {}
  if (valid && message.value?.trim()) {
    if (props.patient.user_type == 'patient') {
      data = {
        content: message.value,
        provider_id: activeSubject.value.id
      }
    } else {
      data = {
        content: message.value,
        patient_id: activeSubject.value.id
      }
    }

    await messageStore.sendMessagePatient(data)
    message.value = ''
    //await messageStore.loadUsers()
    // Reload messages and users list
    //await messageStore.getMessagesByUser(activeSubject.value.id)
    // await Promise.all([
    //   messageStore.getMessagesByUser(activeSubject.value.id),
    //   messageStore.loadUsers()
    // ])

    scrollToBottom()
  }
}

const isCurrentUser = (messageSender) => {
  return messageSender === props.patient.user_type
}
</script>

<template>

  <div class="d-flex" style="height: calc(100vh - 60px);">
    <!-- Subjects Sidebar -->
    <div class="chat-list-sidebar" style="width: 320px; border-right: 1px solid #e0e0e0;" v-if="!props.patient">
      <h5 class="chat-contact-header text-primary text-h5">
        Chats
      </h5>
      <VDivider />
      <PerfectScrollbar class="subjects-scrollbar" :options="{ wheelPropagation: false }">


        <VListItem v-for="user in messageStore.usersList" :key="user.id" :active="activeSubject?.id === user.id"
          @click="openSubjectMessages(user)">
          <VListItemTitle>
            <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex align-center gap-x-4 position-relative">
                <VAvatar size="34" :variant="!user.profilePictureUrl ? 'primary' : undefined"
                  :color="!user.profilePictureUrl ? 'primary' : undefined">
                  <VImg v-if="user.profilePictureUrl" :src="user.profilePictureUrl" />
                  <span v-else>{{ avatarText(user.FullName) }} </span>
                </VAvatar>

                <div class="d-flex flex-column">
                  <div class="d-flex align-center gap-x-2">
                    <h6 class="text-base">{{ user.FullName }}</h6>

                  </div>
                  <span class="text-caption text-medium-emphasis text-truncate" style="max-width: 200px;">
                    {{ user.lastMessageContent || 'No messages yet' }}
                  </span>
                </div>
              </div>

              <div class="text-caption text-medium-emphasis" v-if="user.lastMessageDate">
                {{ dateFormat(user.lastMessageDate) }}
              </div>
              <div class="unread-badge text-caption text-white bg-primary rounded-circle px-1"
                style="min-width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center;">
                {{ user.unreadMessages }}
              </div>
            </div>
          </VListItemTitle>
        </VListItem>
        <span v-show="messageStore.usersList.length <= 0" class="no-chat-items-text text-disabled">No chats
          found</span>
      </PerfectScrollbar>
    </div>

    <!-- Messages Area -->

    <div class="messages-area" style="flex-grow: 1; display: flex; flex-direction: column;">
      <template v-if="activeSubject">
        <div class="px-4 py-2 border-bottom">

          <div class="d-flex align-center gap-x-4 mb-3" v-if="!props.patient">
            <VAvatar size="34" :variant="!activeSubject.profilePictureUrl ? 'primary' : undefined"
              :color="!activeSubject.profilePictureUrl ? 'primary' : undefined">
              <VImg v-if="activeSubject.profilePictureUrl" :src="activeSubject.profilePictureUrl" />
              <span v-else>{{ avatarText(activeSubject.FullName) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              <h6 class="text-base">
                {{ activeSubject.FullName }}
              </h6>

            </div>
          </div>
          <div class="d-flex align-center gap-x-4 mb-3" v-if="props.patient">
            <VAvatar size="34" :variant="!activeSubject.profilePictureUrl ? 'primary' : undefined"
              :color="!activeSubject.profilePictureUrl ? 'primary' : undefined">
              <VImg v-if="activeSubject.profilePictureUrl" :src="activeSubject.profilePictureUrl" />
              <span v-else>{{ avatarText(activeSubject.FullName) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              <h6 class="text-base">
                {{ activeSubject.FullName }}
              </h6>

            </div>
          </div>
          <VDivider />
        </div>
        <PerfectScrollbar ref="messageContainer" class="custom-scrollbar messages-container">
          <div class="messages-content" style="height: calc(100vh - 54px);">
            <template v-for="(msg, index) in messageStore.messageList" :key="index">


              <div class="message-wrapper pa-3 mb-4 d-flex"
                :class="isCurrentUser(msg.sender_type) ? 'justify-end' : 'justify-start'">
                <div class="d-flex flex-column"
                  :class="isCurrentUser(msg.sender_type) ? 'align-items-end' : 'align-items-start'">
                  <!-- Message Bubble -->
                  <div :class="[
                    'message-bubble pa-3 rounded-lg mb-1',
                    isCurrentUser(msg.sender_type) ? 'bg-primary text-white' : 'bg-grey-lighten-3 text-black'
                  ]" style="max-width: 100%;">
                    <div class="message-text text-start">{{ msg.message }}</div>

                  </div>

                  <!-- Time on the right side -->
                  <div class="message-time text-caption text-medium-emphasis float-right">
                    {{ dateTimeFormat(msg.created_at, "hh:mm A") }}
                  </div>
                </div>
              </div>
            </template>
          </div>
        </PerfectScrollbar>
        <div class="message-input px-4 py-3 border-top mb-3">
          <VForm ref="refVForm" @submit.prevent="sendMessage">
            <VTextField v-model="message" :placeholder="$t('Type your message...')"
              :rules="[v => !!v || 'Message is required']" hide-details density="comfortable" class="message-input">
              <template #append>
                <VBtn color="primary" icon @click="sendMessage">
                  <VIcon>tabler-send</VIcon>
                </VBtn>
              </template>
            </VTextField>
          </VForm>
        </div>
      </template>

      <div v-else class="d-flex h-100 align-center justify-center flex-column" style="height: 100%;">
        <VAvatar size="98" variant="tonal" color="primary" class="mb-4">
          <VIcon size="50" class="rounded-0" icon="tabler-message-2" />
        </VAvatar>
        <div class="text-medium-emphasis">

          Start conversation with the people by selecting one of the contact on left
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.subject-sidebar {
  background-color: #f8f9fa;
}

.message-bubble {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-input :deep(.v-field__append-inner) {
  padding-top: 0;
}

.v-list-item--active {
  background-color: rgb(var(--v-theme-primary), 0.1);
}

.subjects-scrollbar {
  height: 100%;
}

/* Hide scrollbar by default */
.subjects-scrollbar :deep(.ps__rail-y) {
  opacity: 0;
  transition: opacity 0.2s ease;
}

/* Show scrollbar on hover */
.subjects-scrollbar:hover :deep(.ps__rail-y) {
  opacity: 1;
}

/* Optional: Style the scrollbar for better visibility */
.subjects-scrollbar :deep(.ps__rail-y) {
  width: 6px;
  background-color: transparent;
}

.subjects-scrollbar :deep(.ps__thumb-y) {
  width: 6px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

/* Optional: Darken the scrollbar on hover */
.subjects-scrollbar :deep(.ps__rail-y):hover .ps__thumb-y {
  background-color: rgba(0, 0, 0, 0.35);
}

.message-details {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
  width: 100%;
  max-width: 400px;
  /* Adjust this value based on your needs */
  margin: 0 auto;
}

.divider-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 1rem;
}

.details-content {
  white-space: nowrap;
  padding: 0 8px;
  text-align: center;
}

.divider-line {
  height: 1px;
  flex: 1;
  background-color: rgba(0, 0, 0, 0.3);
}

.text-uppercase {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.separator {
  opacity: 0.7;
}

.message-bubble {
  border-radius: 12px;
  width: 100%;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
}

.message {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.message-content {
  display: flex;
  align-items: flex-end;
  max-width: 100%;
}

.message-bubble {
  max-width: 60%;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-message .message-bubble {
  background-color: #007bff;
  color: #fff;
}

.message-time {
  margin-left: 0.5rem;
  font-size: 0.8rem;
  color: #999;
}
</style>
