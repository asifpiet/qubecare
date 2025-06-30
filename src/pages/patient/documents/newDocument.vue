<script setup>
import { usePatientStore } from '@/stores/patientStore';
const { currentUser, currentRole } = useAuth()
const patientStore = usePatientStore()
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  }
})
const isFormValid = ref(false)
const refForm = ref()
const description = ref()
const selectedDocument = ref()
const fileName = ref()

const isTextMessageDialogVisible = ref(true);
const selectedFile = ref(null);

const documentsType = [
  'Advance Directive/CCD',
  'Lab Report',
  'Advance Directive/CCDA',
  'Advance Directive/CCR',
  'Advance Directive/CCR',
  'Eye Module/FHIR Export Document',
  'Invoices',
  'Medical Record',
  'Patient ID card',
  'Patient Photograph'
];
const closeNavigationDrawer = () => {
  isTextMessageDialogVisible.value = false;
}

const emit = defineEmits([
  'update:isDrawerOpen',
  'closePoup'
])

const onSubmit = async () => {
  refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      let data = {
        id: currentUser.value.id,
        image_title: fileName.value,
        document: selectedFile.value,
        description: description.value,
        type: 'file_url'
      }
      console.log(data)
      patientStore.addPatientDocument(
        data,
        currentUser.value.id
      )
      emit('closePoup', false)
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
      })
    } else { }
  })

}
const handleFileChange = (file) => {
  const { files } = file.target
  if (files && files.length) {
    selectedFile.value = files[0];
    fileName.value = files[0].name;
    console.log("zxc", selectedFile.value);
  }
};
const selectedFiles = ref([]);
// handle select event, and store the selected items
const handleSelect = (selection) => {
  selectedFiles.value = selection
}
// then with a button click, you can get the selected items easily
// you can add this method to the click event of a button. 
const handleButtonClick = () => {
  console.log(selectedFiles.value);
}
</script>
<template>


  <VForm ref="refForm" v-model="isFormValid">
    <VRow>


      <VCol cols="6" style="display: none;">
        <AppSelect v-model="selectedDocument" label="Document Type" placeholder="Document Type"
          :items="documentsType" />

      </VCol>

      <VCol cols="12">
        <v-file-input v-model="selectedFile" label="Upload Document" @change="handleFileChange"></v-file-input>
      </VCol>
      <VCol cols="12">
        <v-textarea v-model="description" label="Description" placeholder="Description" rows="5" />
      </VCol>



      <VCol cols="12">
        <VBtn @click="onSubmit" class="me-3">
          Save
        </VBtn>
        <VBtn type="reset" variant="tonal" color="error" class="ml-3" @click="closeNavigationDrawer">
          Close
        </VBtn>
      </VCol>
    </VRow>
  </VForm>

</template>
