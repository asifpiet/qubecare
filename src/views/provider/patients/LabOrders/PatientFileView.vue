<script setup>
import { ref } from 'vue';
import { useLaborderStore } from '@/stores/laborderStore';

const laborderStore = useLaborderStore();
const props = defineProps({
    itemProps: {
        type: Object,
        required: false,
    },
});

// Track panel states
const panels = ref([0]); // First panel open by default

// Function to determine file type icon based on mime_type
const getFileIcon = (file) => {
  // Get mime_type from image_data
  const mimeType = file?.image_data?.mime_type || '';
  const fileName = file?.file_name || '';
  
  // Map mime types to icons
  const mimeTypeIcons = {
    'application/pdf': 'tabler-file-type-pdf',
    'application/msword': 'tabler-file-type-doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'tabler-file-type-doc',
    'application/vnd.ms-excel': 'tabler-file-type-xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'tabler-file-type-xls',
    'text/csv': 'tabler-file-type-csv',
    'application/vnd.ms-powerpoint': 'tabler-file-type-ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'tabler-file-type-ppt',
    'text/plain': 'tabler-file-text',
    'application/zip': 'tabler-file-zip',
    'application/x-rar-compressed': 'tabler-file-zip',
    'audio/mpeg': 'tabler-file-music',
    'video/mp4': 'tabler-file-video',
    'image/jpeg': 'tabler-file-image',
    'image/png': 'tabler-file-image',
    'image/gif': 'tabler-file-image',
    'image/svg+xml': 'tabler-file-vector',
  };
  
  // If we have a match for the mime type, use it
  if (mimeTypeIcons[mimeType]) {
    return mimeTypeIcons[mimeType];
  }
  
  // Fallback to extension-based detection
  const extension = fileName.split('.').pop().toLowerCase();
  
  const fileTypeIcons = {
    pdf: 'tabler-file-type-pdf',
    doc: 'tabler-file-type-doc',
    docx: 'tabler-file-type-doc',
    xls: 'tabler-file-type-xls',
    xlsx: 'tabler-file-type-xls',
    csv: 'tabler-file-type-csv',
    ppt: 'tabler-file-type-ppt',
    pptx: 'tabler-file-type-ppt',
    txt: 'tabler-file-text',
    zip: 'tabler-file-zip',
    rar: 'tabler-file-zip',
    mp3: 'tabler-file-music',
    mp4: 'tabler-file-video',
    jpg: 'tabler-file-image',
    jpeg: 'tabler-file-image',
    png: 'tabler-file-image',
    gif: 'tabler-file-image',
    svg: 'tabler-file-vector',
  };
  
  return fileTypeIcons[extension] || 'tabler-file';
};

// Function to determine if file is an image based on mime_type
const isImageFile = (file) => {
  const mimeType = file?.image_data?.mime_type || '';
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml'];
  
  if (imageTypes.includes(mimeType)) {
    return true;
  }
  
  // Fallback to extension check
  const fileName = file?.file_name || '';
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  const extension = fileName.split('.').pop().toLowerCase();
  return imageExtensions.includes(extension);
};

// Function to determine if file is a PDF based on mime_type
const isPdfFile = (file) => {
  const mimeType = file?.image_data?.mime_type || '';
  
  if (mimeType === 'application/pdf') {
    return true;
  }
  
  // Fallback to extension check
  const fileName = file?.file_name || '';
  return fileName.toLowerCase().endsWith('.pdf');
};

// Function to open file in new tab
const openFile = (fileViewUrl) => {
  window.open(fileViewUrl, '_blank');
};

// Function to download file
const downloadFile = (fileDownloadUrl, fileName) => {
  const link = document.createElement('a');
  link.href = fileDownloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Show preview modal
const showPreview = ref(false);
const previewFile = ref(null);

const openPreview = (file) => {
  previewFile.value = file;
  showPreview.value = true;
};

const closePreview = () => {
  showPreview.value = false;
  previewFile.value = null;
};

// Check if a test has files
const hasFiles = (test) => {
  return test && test.files && test.files.length > 0;
};
</script>

<template>
  <VNavigationDrawer 
    temporary 
    :width="800" 
    location="end" 
    class="drawer-container"
    @update:model-value="laborderStore.isDrawerOpen = false" 
    :model-value="laborderStore.isDrawerOpen"
  >
    <div class="d-flex flex-column h-100">
      <AppDrawerHeaderSection 
        :title="$t('View Lab Test Results')"
        @cancel="laborderStore.isDrawerOpen = false" 
      />

      <VDivider />

      <!-- Use v-container with overflow-y-auto instead of PerfectScrollbar -->
      <div class="flex-grow-1 overflow-y-auto pa-4">
        
        <VExpansionPanels v-model="panels" multiple>
          <VExpansionPanel
            v-for="(test, index) in props.itemProps?.items"
            :key="test.test_id"
            :value="index"
          >
            <VExpansionPanelTitle>
              <div class="d-flex align-center justify-space-between w-100">
                <span>{{ test.test_name }}</span>
                <VChip
                  v-if="hasFiles(test)"
                  color="primary"
                  size="small"
                  class="ml-2"
                >
                  {{ test.files.length }} {{ test.files.length === 1 ? 'File' : 'Files' }}
                </VChip>
              </div>
            </VExpansionPanelTitle>
            
            <VExpansionPanelText>
              <!-- Files container -->
              <div v-if="hasFiles(test)" class="files-container">
                <VRow>
                  <VCol 
                    v-for="(file, fileIndex) in test.files" 
                    :key="`file-${test.test_id}-${fileIndex}`"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="4"
                  >
                    <VCard 
                      class="file-card"
                      variant="outlined"
                    >
                      <!-- Preview area -->
                      <div 
                        class="file-preview pa-2 d-flex align-center justify-center" 
                        @click="openPreview(file)"
                      >
                        <!-- Image preview for image files -->
                        <VImg
                          v-if="isImageFile(file)"
                          :src="file.view_file"
                          :alt="file.file_name"
                          cover
                          height="120"
                          class="rounded"
                        />
                        
                        <!-- PDF preview -->
                        <div v-else-if="isPdfFile(file)" class="pdf-preview">
                          <VIcon size="48" color="red">tabler-file-type-pdf</VIcon>
                          <div class="pdf-label">PDF</div>
                        </div>
                        
                        <!-- Other file types -->
                        <div v-else class="file-icon-container">
                          <VIcon size="48" :icon="getFileIcon(file)"></VIcon>
                        </div>
                      </div>
                      
                      <!-- File info -->
                      <VCardText class="pt-1 pb-1">
                        <div class="text-truncate d-block">{{ file.file_name }}</div>
                        <div class="text-caption text-grey" v-if="file.image_data?.size">
                          {{ (file.image_data.size / 1024).toFixed(1) }} KB
                        </div>
                      </VCardText>
                      
                      <!-- Actions -->
                      <VDivider></VDivider>
                      <VCardActions>
                        <VBtn
                          variant="text"
                          density="comfortable"
                          size="small"
                          @click="openFile(file.view_file)"
                        >
                          <VIcon size="small" start>tabler-eye</VIcon>
                          View
                        </VBtn>
                        
                        <VSpacer></VSpacer>
                        
                        <VBtn
                          variant="text"
                          density="comfortable"
                          size="small"
                          @click="downloadFile(file.download_url, file.file_name)"
                        >
                          <VIcon size="small" start>tabler-download</VIcon>
                          Download
                        </VBtn>
                      </VCardActions>
                    </VCard>
                  </VCol>
                </VRow>
              </div>
              
              <!-- No files message -->
              <div v-else class="no-files-container d-flex align-center justify-center">
                <div class="text-center py-8">
                  <VIcon size="48" color="grey">tabler-file-off</VIcon>
                  <div class="text-body-1 text-grey mt-2">No files available!</div>
                </div>
              </div>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </div>
    </div>
  </VNavigationDrawer>
  
  <!-- File Preview Modal -->
  <VDialog
    v-model="showPreview"
    fullscreen
    :scrim="true"
    transition="dialog-bottom-transition"
  >
    <VCard>
      <VToolbar>
        <VBtn icon @click="closePreview">
          <VIcon icon="tabler-x" />
        </VBtn>
        <VToolbarTitle>{{ previewFile?.file_name }}</VToolbarTitle>
        <VSpacer></VSpacer>
        <VBtn 
          @click="previewFile && downloadFile(previewFile.download_url, previewFile.file_name)"
        >
          <VIcon icon="tabler-download" />
        </VBtn>
      </VToolbar>
      
      <VCardText class="pa-0 preview-container">
        <div v-if="previewFile" class="d-flex justify-center align-center preview-content">
          <!-- Image preview -->
          <VImg
            v-if="previewFile && isImageFile(previewFile)"
            :src="previewFile.view_file"
            :alt="previewFile.file_name"
            contain
            class="preview-image"
          />
          
          <!-- PDF preview -->
          <iframe
            v-else-if="previewFile && isPdfFile(previewFile)"
            :src="previewFile.view_file"
            width="100%"
            height="100%"
            frameborder="0"
            class="pdf-iframe"
          ></iframe>
          
          <!-- Other file types -->
          <div v-else class="file-not-previewable d-flex flex-column align-center justify-center">
            <VIcon size="72" :icon="previewFile && getFileIcon(previewFile)"></VIcon>
            <div class="mt-4 text-body-1">
              This file type cannot be previewed. Please download to view.
            </div>
            <VBtn
              class="mt-6"
              color="primary"
              @click="previewFile && downloadFile(previewFile.download_url, previewFile.file_name)"
            >
              Download File
            </VBtn>
          </div>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped>
/* Files display styles */
.file-card {
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.file-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.file-preview {
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  height: 120px;
  cursor: pointer;
  overflow: hidden;
}

.file-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.pdf-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pdf-label {
  margin-top: 6px;
  font-weight: bold;
  color: red;
}

/* Preview modal styles */
.preview-container {
  height: calc(100vh - 64px);
  background-color: #f5f5f5;
}

.preview-content {
  height: 100%;
  width: 100%;
}

.preview-image {
  max-height: 100%;
  max-width: 100%;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
}

.file-not-previewable {
  height: 100%;
  padding: 2rem;
  text-align: center;
}

/* Additional styles for better scrolling */
.drawer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.overflow-y-auto {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* For smoother scrolling on iOS */
}

/* Ensure the drawer content takes up available height */
.h-100 {
  height: 100%;
}

/* No files message */
.no-files-container {
  min-height: 150px;
}
</style>