<script setup>
import { useAuth } from '@/composables/useAuth'
import { usePatientStore } from '@/stores/patientStore'
import AddMessage from '@/views/apps/patient/textMessage/AddMessage.vue'
import { onMounted, ref } from 'vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
const patientStore = usePatientStore()
const { currentUser } = useAuth()

const isTextMessageDialogVisible = ref(false)
const messageContainer = ref(null)
const subjectsList = ref([])
const activeSubject = ref(null)
const message = ref('')
const refVForm = ref()

const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
  isDrawerOpen: {
    type: Boolean,
    required: true,
  }
})

const emit = defineEmits(['update:isDrawerOpen', 'patientData'])
watch(
  () => props.isDrawerOpen,
  async (isOpen) => {
    if (isOpen) {
      console.log('Drawer opened');
      patientStore.messagesListBySubject = []
      activeSubject.value = null;
      subjectsList.value = []
      await loadSubjects();
    }
  }
);
// Load subjects on mount
onMounted(async () => {
  console.log('test')
  await loadSubjects()
})

const loadSubjects = async () => {
  // Assuming your store has a method to fetch subjects
  await patientStore.getMessagesList(props.patient.id)
  subjectsList.value = patientStore.messagesList
}
const reversedMessages = computed(() => {
  return [...(patientStore.messagesListBySubject?.messages || [])].reverse()
})
const scrollToBottom = () => {
  setTimeout(() => {
    if (messageContainer.value) {
      const scrollElement = messageContainer.value.$el || messageContainer.value
      console.log(patientStore.messagesListBySubject.messages.length)
      if (patientStore.messagesListBySubject.messages.length > 2) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      } else {
        scrollElement.scrollTop = 0
      }

    }
  }, 100)
}

const openSubjectMessages = async (subject) => {
  activeSubject.value = subject
  await patientStore.getMessagBySubject(subject.id)
  scrollToBottom()
}

const sendMessage = async (event) => {
  const { valid } = await refVForm.value.validate()
  if (event?.type === 'submit') {
    event.preventDefault()
  }
  if (valid && message.value?.trim()) {
    const data = {
      subject: activeSubject.value.subject,
      message: message.value,
      patient_id: Number(props.patient.id),
      with_name: currentUser.value.fullName
    }

    await patientStore.AddMessageOnBaseSubject(data, activeSubject.value.id)
    await patientStore.getMessagBySubject(activeSubject.value.id)
    message.value = ''
    await loadSubjects() // Refresh subjects list to update message counts
    scrollToBottom()
  }
}

const handleUserSubmit = async (msg) => {
  await loadSubjects()
  if (msg === 'success') {
    isTextMessageDialogVisible.value = false
    await loadSubjects()
  } else if (msg === 'cancel') {
    isTextMessageDialogVisible.value = false
  }
}

const formatCustomDateTime = (dateTime) => {
  if (!dateTime) return '';
  const date = new Date(dateTime);

  // Extract parts of the date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Format hours to 12-hour format with AM/PM
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = String(hours % 12 || 12).padStart(2, '0');

  // Construct the desired format
  return `${month}-${day}-${year}, ${formattedHours}:${minutes} ${period}`;
};
const formatCustomDate = (dateTime) => {
  if (!dateTime) return '';
  const date = new Date(dateTime);

  // Extract parts of the date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Format hours to 12-hour format with AM/PM
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = String(hours % 12 || 12).padStart(2, '0');

  // Construct the desired format
  return `${month}-${day}-${year}`;
};
const isCurrentUser = (messageSender) => {
  return messageSender === currentUser.value.fullName
}
</script>

<template>
  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="emit('update:isDrawerOpen', $event)">

    <AppDrawerHeaderSection  :title="$t('Notes') + ' (' + props.patient.demographic.fullName + ')'" 
      @cancel="emit('update:isDrawerOpen', false)" />


    <div class="d-flex" style="height: calc(100vh - 64px);">
      <!-- Subjects Sidebar -->
      <div class="subject-sidebar" style="width: 300px; border-right: 1px solid #e0e0e0;">
        <div class="pa-4">
          <VBtn block color="primary" @click="isTextMessageDialogVisible = true">
            {{ $t('Add Notes') }}
          </VBtn>
        </div>
        <PerfectScrollbar class="subjects-scrollbar" :options="{ wheelPropagation: false }">
          <VList lines="two" :select-strategy="'classic'">
            <VListItem v-for="subject in subjectsList" :key="subject.id" :active="activeSubject?.id === subject.id"
              @click="openSubjectMessages(subject)">
              <VListItemTitle>
                {{ subject.subject }}
              </VListItemTitle>
              <VListItemSubtitle>
                {{ dateFormat(subject.date) }} • {{ subject.with_name }}
                <div v-if="subject.unread_message" class="text-primary" style="display: none;">
                  {{ subject.unread_message }}  {{ $t('unread') }} 
                </div>
              </VListItemSubtitle>
            </VListItem>
          </VList>
        </PerfectScrollbar>
      </div>

      <!-- Messages Area -->

      <div class="messages-area" style="flex-grow: 1; display: flex; flex-direction: column;">
        <template v-if="activeSubject">
          <div class="px-4 py-2 border-bottom">
            <div class="text-h6">{{ activeSubject.subject }}</div>
            <VDivider />
          </div>
          <PerfectScrollbar ref="messageContainer" class="custom-scrollbar messages-container">
            <div class="messages-content" style="height: calc(100vh - 54px);">
              <template v-for="(msg, index) in patientStore.messagesListBySubject?.messages" :key="index">
                <div class="message-wrapper pa-3 mb-4">
                  <div class="d-flex flex-column align-center" style="width: 100%;">
                    <!-- Message Bubble -->
                    <div :class="[
                      'message-bubble pa-3 rounded-lg',
                      isCurrentUser(msg.message_by) ? 'bg-grey-lighten-3' : 'bg-grey-lighten-3'
                    ]" style="max-width: 85%;">
                      <div class="message-text text-start">{{ msg.text }}</div>
                    </div>

                    <!-- Centered Message Details with Full Divider Lines -->
                    <div class="message-details text-caption mt-1 text-medium-emphasis">
                      <div class="divider-container">
                        <div class="divider-line"></div>
                        <div class="details-content">
                          <span>{{ dateTimeFormat(msg.created_at,"MM-DD-YYYY hh:mm A") }}</span>
                          <span class="mx-2 separator">|</span>
                          <span class="text-uppercase">{{ msg.message_by }}</span>
                        </div>
                        <div class="divider-line"></div>
                      </div>
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

        <div v-else class="d-flex align-center justify-center" style="height: 100%;">
          <div class="text-medium-emphasis">
            {{ $t('Select a conversation to start messaging') }}
          </div>
        </div>
      </div>

    </div>

    <!-- New Message Dialog -->
    <VNavigationDrawer v-model="isTextMessageDialogVisible" temporary :width="800" location="end"
        class="scrollable-content">
        <AppDrawerHeaderSection  :title="$t('New Notes') + ' (' + props.patient.demographic.fullName + ')'"  
          @cancel="isTextMessageDialogVisible = false" />
          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <VCardText>
              <AddMessage v-if="$can('read', 'Messages Add')" :patient="props.patient" @submit="handleUserSubmit" />
          </VCardText>
        </PerfectScrollbar>
    </VNavigationDrawer>
    <!-- <VDialog v-model="isTextMessageDialogVisible" width="800">
      <DialogCloseBtn @click="isTextMessageDialogVisible = false" />
      <VCard title="New Notes">
        <VCardText>
          <AddMessage v-if="$can('read', 'Messages Add')" :patient="props.patient" @submit="handleUserSubmit" />
        </VCardText>
      </VCard>
    </VDialog> -->

  </VNavigationDrawer>
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
</style>
