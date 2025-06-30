<script setup>
import { useStore } from 'vuex';
const store = useStore()
const isLoading = ref(false)
const isFormValid = ref(false)
const selectedDocument = ref()
const refForm = ref()
const filterDocument = ref([])
const description = ref()
const image_title = ref()
const date = ref()
const fileName = ref()
const selectedFile = ref()
const isTextMessageDialogVisible = ref(true);
const closeNavigationDrawer = () => {
    isTextMessageDialogVisible.value = false;  
}
const props = defineProps({
    editDocumentData: {
    type: Array,
  }
});

const editDocument = computed(async() => {
  let document =  props.editDocumentData[0];

  if(props.editDocumentData[0]){
    image_title.value =  document.image_title;
    selectedDocument.value =  document.type;
    description.value =  document.description;
  }
   return true;
});

const editorInit = ref({
  height: 500,
  menubar: false,
  plugins: 'link image code',
  toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | code'
});
const emit = defineEmits([
  'update:isDrawerOpen',
])

const documentsType = [
  'Bill - Invoice/Receipt/Super-Bill',
  'Consult Scan',
  'Intake Form',
  'Medical Record',
  'Past Medical History',
  'Prescription (Rx)',
  'Protocol',
  'Refill Request',
  'Specialist Notes',
  'Treatment Note',
  'Therapy Note',
  'Video Consult',
  'Chiropractic',
  'Consent Form',
  'Allergy',
  'Body Composition',
  'BIA',
  'HRV/DPA',
  'Lab Requisition',
  'Lab Result',
  'MEAD, Five Element',
  'MRI',
  'Scan',
  'Thermometry',
  'Toxins',
  'X-Ray',
  'Imaging (Other)',
  'Zyto',
  'Dental',
  'Eligibility',
  'Email',
  'Eye',
  'HEP - Home Exercise Program',
  'Hyperbaric',
  'ID Card',
  'Insurance Card',
  'Letters',
  'Patient Photo',
  'Picture Before',
  'Picture After',
  'Patient Communication',
  'Polarity',
  'Pricing',
  'IV/Injection',
  'Procedure',
  'Prolo/PRP',
  'Neural Therapy',
  'Psychology',
  'Record Requests',
  'Other',
  'Questionnaire'
];

const onSubmit = async() => {
  isLoading.value = true
  refForm.value?.validate().then(async({ valid }) => {
    if (valid) {
    //   console.log('lastnae',lastName.value);
      
      await store.dispatch('updateDocument',{
        id: store.getters.getPatientPorfile.patientId,
        documents:[
          // ...store.getters.getPatientPorfile.documents,
          {
            id:props.editDocumentData[0].id,
            type:selectedDocument.value,
            date:props.editDocumentData[0].date,
            image_title:image_title.value,
            // image:image_title.value,
            description:description.value
          }
        ]
      })
        isLoading.value = false;
        emit('closePoup', false)
        nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
        })
    }else{
        
      isLoading.value = false;
    }
  })
  
}
</script>
<template>
            <div v-if="editDocument"></div>
            <VForm
                ref="refForm"
                v-model="isFormValid"
            >
            <VRow>
              <VCol cols="6">
                <AppTextField
                  v-model="image_title"
                  
                  label="Title"
                  placeholder="Title"
                 
                  
                />
              </VCol>
              <VCol cols="6">
                <AppSelect
                    v-model="selectedDocument"
                    label="Document Type"
                    placeholder="Document Type"
                   :items="documentsType"
                  
                />
              
              </VCol>
                <VCol cols="12">
                <v-textarea
                  v-model="description"
                  label="Description"
                  placeholder="Description"
                  rows="5"
                />
                </VCol>

               

                
                <VCol cols="12">
                <VBtn
                  @click="onSubmit"
                 class="me-3"
                
                >
                Save
                </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="error"
                  class="ml-3"
                  @click="closeNavigationDrawer"
                >
                Close
                </VBtn>
              </VCol>
            </VRow>
        </VForm>        
         
</template>
