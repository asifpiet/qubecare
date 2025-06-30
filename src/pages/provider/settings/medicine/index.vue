<script setup>
import { usePatientStore } from '@/stores/patientStore';
import { useProviderStore } from '@/stores/providerStore';
const patientStore = usePatientStore()
const providerStore = useProviderStore()
const isExistDelete = ref(false)
const props = defineProps({
    patient: {
        type: Object,
        required: true,
    }
})

const isFormValid = ref(false)
const refForm = ref()
const fileName = ref()

const isTextMessageDialogVisible = ref(true);
const selectedFile = ref(null);

const emit = defineEmits([
    'update:isDrawerOpen',
    'closePoup'
])

const checkfile = (uploadFile) => {
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']; // Valid MIME types for .xlsx and .csv files
    const fileExtension = uploadFile.name.split('.').pop().toLowerCase(); // Get file extension

    // Check if the file type is valid
    if (!validTypes.includes(uploadFile.type) && !['xlsx', 'csv'].includes(fileExtension)) {
        alert("Please upload only .xlsx or .csv files.");
        selectedFile.value = '';
        return; // Stop further processing if the file type is not valid
    }
}
const handleFileChange = (file) => {
    const { files } = file.target; // Get the files from the input
    if (files && files.length) {
        const selectedFile = files[0]; // Get the first selected file
        checkfile(selectedFile);
        selectedFile.value = selectedFile;
        fileName.value = selectedFile.name;

        console.log("Selected File:", selectedFile);
    }
};

const onSubmit = async () => {
    refForm.value?.validate().then(async ({ valid }) => {
        if (valid) {
            isExistDelete.value = isExistDelete.value == true ? 1 : 0;
            // Check file before uploading
            checkfile(selectedFile.value);

            // Perform the file upload or data handling
            await providerStore.importxls(selectedFile.value, isExistDelete.value);

            // Clear the file input (reset the model) after submission
            selectedFile.value = null; // Reset selected file in the model

            // Optionally, reset the file input field itself if it's a file input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) {
                fileInput.value = ''; // Clear the actual file input field
            }
        } else {
            // Handle invalid form state
        }
    });
}

const downloadMedicineExcel = () => {
    const link = document.createElement('a');
    link.href = '/sample.xlsx'; // Adjust path as needed
    link.setAttribute('download', 'sample.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};



</script>
<template>

    <VCard :title="$t('Medicine')" width="600">
        <template #title>
            <div class="d-flex justify-space-between align-center w-100">
                <span>{{ $t('Medicine') }}</span>
                <div class="d-flex align-center">
                    <span class="me-2 text-caption text--secondary">{{ $t('Download Sample') }}</span>
                    <VBtn icon @click="downloadMedicineExcel" :title="$t('Download Sample')">
                        <VIcon>tabler-download</VIcon>
                    </VBtn>
                </div>
            </div>
        </template>
        <VCardText>
            <VForm ref="refForm" v-model="isFormValid">
                <VRow>
                    <VCardSubtitle>{{ $t('Import only .csv or .xlxs file') }}</VCardSubtitle>
                    <VCol cols="12">
                        <v-file-input v-model="selectedFile" :label="$t('Upload Document')" @change="handleFileChange"
                            :rules="[requiredValidator]"></v-file-input>
                    </VCol>
                    <VCol cols="12">
                        <VCheckbox v-model="isExistDelete" :label="$t('Delete Existing')" />
                    </VCol>

                    <VCol cols="12">
                        <VBtn @click="onSubmit" class="me-3">
                            {{ $t('Import') }}
                        </VBtn>
                    </VCol>
                </VRow>
            </VForm>
        </VCardText>
    </VCard>

</template>
