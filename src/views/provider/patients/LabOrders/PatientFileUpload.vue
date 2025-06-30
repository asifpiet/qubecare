<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
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

// State management for files
const testFiles = reactive({});
const isUploading = ref({});
const uploadError = ref({});
const uploadSuccess = ref({});
const uploadedTests = ref([]); // Track which tests have been successfully uploaded
const existingFiles = ref({}); // Track files that already exist for each test

// Initialize data on component mount
onMounted(() => {
  initializeTestData();
});

// Initialize test data including checking for existing files
const initializeTestData = () => {
  if (props.itemProps && props.itemProps.items) {
    props.itemProps.items.forEach(test => {
      // Initialize file upload structures
      testFiles[test.test_id] = [{ files: [] }];
      isUploading.value[test.test_id] = false;
      uploadError.value[test.test_id] = null;
      uploadSuccess.value[test.test_id] = false;
      
      // Check for existing files
      if (test.files && test.files.length > 0) {
        existingFiles.value[test.test_id] = test.files;
        // Add to uploaded tests array for badge display
        if (!uploadedTests.value.includes(test.test_id)) {
          uploadedTests.value.push(test.test_id);
        }
      } else {
        existingFiles.value[test.test_id] = [];
      }
    });
  }
};

// Make sure testFiles is initialized for all tests
const ensureTestFilesInitialized = (testId) => {
  if (!testFiles[testId] || !Array.isArray(testFiles[testId])) {
    testFiles[testId] = [{ files: [] }];
  }
  return testFiles[testId];
};

// Add new file upload field
const addMoreFiles = (testId) => {
  if (!testFiles[testId]) {
    testFiles[testId] = [];
  }
  testFiles[testId].push({ files: [] });
};

// Handle file change
const handleFileChange = (testId, index, event) => {
  const files = event.target.files;
  testFiles[testId][index].files = Array.from(files);
};

// Upload files for a specific test
const uploadFiles = async (itemId, testId, testName) => {
  // Reset status
  uploadError.value[testId] = null;
  uploadSuccess.value[testId] = false;
  isUploading.value[testId] = true;
  
  try {
    // Build FormData
    const formData = new FormData();
    let filesCount = 0;
    let fileName = 1;
    
    // Add files to FormData
    testFiles[testId].forEach((fileGroup, index) => {
      fileGroup.files.forEach((file, fileIndex) => {
        // You can structure your file names as needed for your API
        formData.append(`file${fileName}`, file);
        filesCount++;
        fileName++;
      });
    });
    
    // Add test metadata
    formData.append('item_id', itemId);
    formData.append('test_id', testId);
    formData.append('files_count', filesCount.toString());
    
    // For debugging - view what's in the FormData
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    const result = await laborderStore.savePatientLaborderFiles(formData);

    console.log('Upload successful:', result);
    uploadSuccess.value[testId] = true;
    
    // Add to uploaded tests array
    if (!uploadedTests.value.includes(testId)) {
      uploadedTests.value.push(testId);
    }
    
    // Update existingFiles with newly uploaded files
    if (result && result.files) {
      existingFiles.value[testId] = result.files;
    }
    
    // Clear files after successful upload - RESET FILE INPUTS
    clearTestFiles(testId);
    
    // Reset the actual file input elements in the DOM
    resetFileInputs();
    
  } catch (error) {
    console.error('Upload failed:', error);
    uploadError.value[testId] = error.message || 'Upload failed';
  } finally {
    isUploading.value[testId] = false;
  }
};

// Reset all file input elements in the DOM
const resetFileInputs = () => {
  // Use nextTick to ensure the DOM has updated
  nextTick(() => {
    // Find all file input elements and reset them
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      input.value = '';
    });
  });
};

// Clear all files for a specific test
const clearTestFiles = (testId) => {
  // Reset to initial state with one empty file group
  testFiles[testId] = [{ files: [] }];
};

// Remove file group
const removeFileGroup = (testId, index) => {
  if (testFiles[testId].length > 1) {
    testFiles[testId].splice(index, 1);
  } else {
    // If it's the last file group, just clear the files
    testFiles[testId][0].files = [];
  }
};

// Check if a test has files (either uploaded this session or existing)
const isTestUploaded = (testId) => {
  return uploadedTests.value.includes(testId);
};

// Open file in new tab for viewing
const viewFile = (url) => {
  window.open(url, '_blank');
};

// Download file
const downloadFile = (url, fileName) => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
        :title="$t('Upload Lab Test Files')"
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
                  v-if="isTestUploaded(test.test_id)"
                  color="success"
                  size="small"
                  class="ml-2"
                >
                  Uploaded
                </VChip>
              </div>
            </VExpansionPanelTitle>
            
            <VExpansionPanelText>
              <!-- Display existing files if any -->
              <div v-if="existingFiles[test.test_id] && existingFiles[test.test_id].length > 0" class="existing-files mb-4">
                <div class="text-subtitle-1 mb-2">Uploaded Files</div>
                <VCard variant="outlined" class="pa-0">
                  <div 
                    v-for="file in existingFiles[test.test_id]" 
                    :key="file.id"
                    class="d-flex align-center justify-space-between py-0"
                  >
                    <div class="d-flex align-center">
                      <VIcon class="mr-2">{{ file.image_data.mime_type.includes('pdf') ? 'mdi-file-pdf-box' : 'mdi-file-document' }}</VIcon>
                      <span>{{ file.file_name }}</span>
                    </div>
                    <div>
                      <VBtn
                        icon
                        variant="text"
                        color="primary"
                        size="small"
                        @click="viewFile(file.view_file)"
                        class="mr-1"
                      >
                        <VIcon>tabler-eye</VIcon>
                      </VBtn>
                      <VBtn
                        icon
                        variant="text"
                        color="primary"
                        size="small"
                        @click="downloadFile(file.download_url, file.file_name)"
                      >
                        <VIcon>tabler-download</VIcon>
                      </VBtn>
                    </div>
                  </div>
                </VCard>
              </div>

              <div class="test-files-container">
                <div 
                  v-for="(fileGroup, groupIndex) in testFiles[test.test_id]" 
                  :key="`${test.test_id}-${groupIndex}`"
                  class="file-group mb-4 pa-3 border rounded"
                >
                  <div class="d-flex align-center justify-space-between mb-2">
                    <!-- <span class="text-subtitle-2">File {{ groupIndex + 1 }}</span> -->
                    <VBtn
                      v-if="testFiles[test.test_id].length > 1"
                      density="compact"
                      icon
                      variant="text"
                      color="error"
                      @click="removeFileGroup(test.test_id, groupIndex)"
                    >
                      <VIcon>tabler-trash</VIcon>
                    </VBtn>
                  </div>
                  
                  <VFileInput
                    :key="`file-input-${test.test_id}-${groupIndex}`"
                    :label="`Select Files for ${test.test_name}`"
                    multiple
                    variant="outlined"
                    density="compact"
                    prepend-icon="tabler-paperclip"
                    :hint="fileGroup.files.length > 0 ? `${fileGroup.files.length} files selected` : 'No files selected'"
                    persistent-hint
                    @update:model-value="(files) => fileGroup.files = files || []"
                    v-model="fileGroup.files"
                  ></VFileInput>
                  
                  <div v-if="fileGroup.files && fileGroup.files.length > 0" class="selected-files mt-2">
                    <VChip
                      v-for="(file, fileIndex) in fileGroup.files"
                      :key="`file-${groupIndex}-${fileIndex}`"
                      class="ma-1"
                      closable
                      @click:close="fileGroup.files.splice(fileIndex, 1)"
                    >
                      {{ file.name }}
                    </VChip>
                  </div>
                </div>
                
                <div class="actions mt-2">
                  <VBtn
                    prepend-icon="mdi-plus"
                    variant="outlined"
                    color="primary"
                    size="small"
                    @click="addMoreFiles(test.test_id)"
                    class="mb-4"
                  >
                    Add More Files
                  </VBtn>
                </div>
                
                <VBtn
                  block
                  @click="uploadFiles(test.id, test.test_id, test.test_name)"
                  :disabled="!(ensureTestFilesInitialized(test.test_id).some(fg => fg.files && fg.files.length > 0)) || isUploading[test.test_id]"
                  :loading="isUploading[test.test_id]"
                >
                  <span v-if="!isUploading[test.test_id]">Upload Files for {{ test.test_name }}</span>
                  <span v-else>Uploading...</span>
                </VBtn>
                
                <VAlert
                  v-if="uploadError[test.test_id]"
                  type="error"
                  variant="tonal"
                  class="mt-2"
                  closable
                  @click:close="uploadError[test.test_id] = null"
                >
                  {{ uploadError[test.test_id] }}
                </VAlert>
                
                <VAlert
                  v-if="uploadSuccess[test.test_id]"
                  type="success"
                  variant="tonal"
                  class="mt-2"
                  closable
                  @click:close="uploadSuccess[test.test_id] = false"
                >
                  Files successfully uploaded!
                </VAlert>
              </div>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </div>
    </div>
  </VNavigationDrawer>
</template>

<style scoped>
.file-group {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.selected-files, .existing-files {
  max-height: 150px;
  overflow-y: auto;
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
</style>