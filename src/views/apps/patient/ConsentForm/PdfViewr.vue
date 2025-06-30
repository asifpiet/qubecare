<script setup>
import { ref } from 'vue'

const props = defineProps({
  pdfUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'PDF Viewer'
  }
})

const emit = defineEmits(['update:isOpen'])

const closeDialog = () => {
  emit('update:isOpen', false)
}

const loading = ref(true)
const scale = ref(1)

const zoomIn = () => {
  scale.value = Math.min(scale.value + 0.2, 3)
}

const zoomOut = () => {
  scale.value = Math.max(scale.value - 0.2, 0.5)
}

const resetZoom = () => {
  scale.value = 1
}

const handleLoad = () => {
  loading.value = false
}
const pdfBlobUrl = ref('');
const formattedPdfUrl = ref(`${props.pdfUrl}#toolbar=1&pagemode=none`)
const fetchPdf = async () => {
  loading.value = true
  const accessToken = getCurrentAccessToken() //useCookie('accessToken').value;
  try {
    const response = await fetch(formattedPdfUrl.value, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Send token in the header
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch PDF');
    }

    const blob = await response.blob();
    pdfBlobUrl.value = URL.createObjectURL(blob); // Create a Blob URL
  } catch (error) {
    console.error('Error fetching PDF:', error);
  }
  loading.value = false
};
onMounted(() => {
  fetchPdf();
});
</script>

<template>

  <VCard>


    <!-- Loading Indicator -->
    <VOverlay v-model="loading" class="align-center justify-center">
      <VProgressCircular indeterminate size="64" />
    </VOverlay>

    <!-- PDF Viewer -->
    <VCard class="pdf-container">
      <iframe :src="pdfBlobUrl" :style="{
        transform: `scale(${scale})`,
        transformOrigin: 'top center'
      }" width="100%" height="100%" @load="handleLoad" frameborder="0" class="pdf-iframe" />
    </VCard>
  </VCard>

</template>

<style scoped>
.pdf-container {
  height: calc(100vh - 64px);
  overflow: auto;
  position: relative;
  display: flex;
  justify-content: center;
}

.pdf-iframe {
  border: none;
  transition: transform 0.2s ease;
}
</style>
