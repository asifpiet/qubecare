<script setup>
import { disconnectKitt, initAIAssistant, setRouterInstances } from '@/composables/kitt';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const route = useRoute();
const router = useRouter();
const isAIAssistantActive = ref(false);
const aiAssistantButton = ref(null);
const isLoading = ref(true);
const statusMessage = ref('Calling AI agent...');
let aiAssistant = null;

onMounted(() => {
  setRouterInstances(router, route);

  // Start AI assistant automatically when page loads
  nextTick(() => {
    startAIAssistant();

  });
});

onUnmounted(() => {
  if (isAIAssistantActive.value) {
    disconnectKitt();
    isAIAssistantActive.value = false;
  }
});

const startAIAssistant = async () => {
  statusMessage.value = 'Calling AI agent...';
  isLoading.value = true;

  if (!isAIAssistantActive.value) {
    try {
      await nextTick();
      aiAssistant = initAIAssistant(aiAssistantButton.value.$el || aiAssistantButton.value);
      isAIAssistantActive.value = true;
      statusMessage.value = 'AI agent connected successfully';
    } catch (error) {
      statusMessage.value = `Failed to connect to AI agent: ${error.message}`;
      console.error('AI agent connection error:', error);
    } finally {
      isLoading.value = false;
    }
  }
}

const stopAIAssistant = async () => {
  if (isAIAssistantActive.value) {
    await disconnectKitt();
    isAIAssistantActive.value = false;
    statusMessage.value = 'AI agent disconnected';
    await nextTick(() => {
      router.replace(route.query.to ? String(route.query.to) : '/provider/login')
    })
  }
}
</script>

<template>
  <VContainer>
    <VCard class="mb-6">
      <VCardTitle class="text-h5">AI Agent Connection</VCardTitle>
      <VCardText>
        <div class="d-flex flex-column align-center">
          <VProgressCircular v-if="isLoading" indeterminate color="primary" size="64" class="mb-4"></VProgressCircular>

          <div ref="aiAssistantButton" class="d-flex justify-center align-center mb-4">
            <VIcon v-if="isAIAssistantActive" icon="tabler-robot" color="success" size="64" class="animate-pulse">
            </VIcon>
            <VIcon v-else icon="tabler-robot-off" color="error" size="64"></VIcon>
          </div>

          <VAlert :color="isAIAssistantActive ? 'success' : 'info'" class="mb-4 text-center" variant="tonal">
            {{ statusMessage }}
          </VAlert>

          <div class="d-flex gap-4">
            <VBtn v-if="!isAIAssistantActive" color="primary" @click="startAIAssistant" :loading="isLoading"
              prepend-icon="tabler-phone-call">
              Call AI Agent
            </VBtn>

            <VBtn v-else color="error" @click="stopAIAssistant" prepend-icon="tabler-phone-off">
              Stop AI Agent
            </VBtn>

            <VBtn variant="outlined" to="/" prepend-icon="tabler-arrow-left">
              Back to Home
            </VBtn>
          </div>
        </div>
      </VCardText>
    </VCard>

    <VCard>
      <VCardTitle class="text-h6">AI Agent Instructions</VCardTitle>
      <VCardText>
        <p>The AI agent is now active and ready to assist you. You can:</p>
        <VList>
          <VListItem prepend-icon="tabler-message-circle">
            <VListItemTitle>Ask questions about our services</VListItemTitle>
          </VListItem>
          <VListItem prepend-icon="tabler-calendar">
            <VListItemTitle>Get help with scheduling appointments</VListItemTitle>
          </VListItem>
          <VListItem prepend-icon="tabler-file-description">
            <VListItemTitle>Complete registration forms with assistance</VListItemTitle>
          </VListItem>
          <VListItem prepend-icon="tabler-help">
            <VListItemTitle>Troubleshoot common issues</VListItemTitle>
          </VListItem>
        </VList>
        <p class="mt-4">To end the conversation, simply click the "Stop AI Agent" button above.</p>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}
</style>
