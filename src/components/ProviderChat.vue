<template>
  <div class="support-chat-container">
    <!-- Vertical Support Button -->
    <v-btn :color="chatOpen ? 'grey' : 'primary'" class="vertical-support-button" elevation="4" @click="toggleChat">
      <span class="vertical-text">Messages</span>
    </v-btn>

    <!-- Chat Box Container -->
    <v-card v-show="chatOpen" class="chat-box" max-width="400" elevation="8">
      <v-toolbar color="primary" dark flat dense class="compact-toolbar pt-1">
        <v-toolbar-title class="text-subtitle-1" style="color:#f5f5f5">Messages</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon small @click="toggleChat">
          <v-icon size="18" style="color:#f5f5f5">tabler-x</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="chat-messages pa-4">
        <div class="messages-container">
          <div v-if="providerStore.ProviderChat.length > 0" v-for="(chat, index) in providerStore.ProviderChat"
            :key="index" class="message mb-3 support-message message-wrapper">
            <v-chip color="grey lighten-3" text-color="black" class="message-chip" :id="chat.id">
              {{ chat.message }}
            </v-chip>
            <v-btn icon size="x-small" class="delete-btn" @click="removeMessage(chat.id)">
              <v-icon size="14" color="red">tabler-x</v-icon>
            </v-btn>
          </div>
          <div v-else class="no-messages-container">
            <p class="text-center text-subtitle-1 text-grey">No messages to display</p>
          </div>
        </div>

      </v-card-text>

      <v-divider></v-divider>
    </v-card>
  </div>
</template>

<script setup>
import { useProviderStore } from '@/stores/providerStore';
import { ref, watch } from 'vue';
const providerStore = useProviderStore()


// State
const chatOpen = ref(false);

const emit = defineEmits(['chat-opened', 'chat-closed']);

function toggleChat() {
  chatOpen.value = !chatOpen.value;

  if (chatOpen.value) {
    emit('chat-opened');
  } else {
    emit('chat-closed');
  }
}

watch(() => providerStore.ProviderChat, (val) => {
  if (!val) {
    toggleChat()
  }
})



const removeMessage = (id) => {
  console.log('removeid', id);
  providerStore.ProviderChat = providerStore.ProviderChat.filter(msg => msg.id !== id)
}


defineExpose({ removeMessage })
</script>

<style scoped>
.support-chat-container {
  position: relative;
  z-index: 1001;
}

.vertical-support-button {
  position: fixed !important;
  top: 50% !important;
  right: 0px !important;
  transform: translateY(-50%) !important;
  z-index: 1001;
  height: 110px !important;
  min-width: 32px !important;
  border-radius: 4px 0 0 4px !important;
  padding: 0 !important;
}

.message-wrapper {
  position: relative;
  margin-bottom: 12px;
  padding-right: 24px;
}

.delete-btn {
  position: absolute;
  top: -5px;
  right: 12px;
  z-index: 2;
}

.vertical-text {
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  text-transform: none;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
}

.chat-box {
  position: fixed;
  top: 50%;
  right: 0px;
  transform: translateY(-45%);
  width: 350px;
  height: 500px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  z-index: 10001111;
}

.compact-toolbar {
  min-height: 42px !important;
}

.compact-toolbar :deep(.v-toolbar__content) {
  height: 36px !important;
  padding: 0 8px 0 0px;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: calc(100% - 36px);
  /* adjusted for smaller toolbar */
  padding: 16px;
}

.messages-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.no-messages-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

.support-message {
  align-self: flex-start;
  align-items: flex-start;
}

.message-chip {
  max-width: 100%;
  height: auto !important;
  white-space: normal !important;
  word-wrap: break-word;
  word-break: break-word;
  padding: 8px 12px;
  line-height: 1.5;
}

/* Added animation for smoother opening/closing */
.chat-box {
  transition: opacity 0.3s ease;
}
</style>
