<script setup>
import { useStore } from 'vuex';
const store = useStore()
const textTemplate = ref();
const isLoading = ref(false)
const isFormValid = ref(false)
const refForm = ref()
const message = ref();
const fullName = ref();
const today = ref(new Date());
const isTextMessageDialogVisible = ref(true);
const closeNavigationDrawer = () => {
    isTextMessageDialogVisible.value = false;  
}
const emit = defineEmits([
  'update:isDrawerOpen',
])

const onSubmit = async() => {
  isLoading.value = true
  refForm.value?.validate().then(async({ valid }) => {
    if (valid) {
    //   console.log('lastnae',lastName.value);
      
      emit('textMessage', {
        id: store.getters.getPatientPorfile.patientId,
        textMessage:[
          ...store.getters.getPatientPorfile.textMessage,
          {
          message: message.value,
          date: today.value,
          sentTo:'112313'
        }
          
      ]
        
      })
        isLoading.value = false;
        nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
        closeNavigationDrawer();  
        })
    }else{
      isLoading.value = false;
    }
  })
  
}
</script>
<template>
    
            <VForm
                ref="refForm"
                v-model="isFormValid"
            >
            <VRow>
               
            
             
              <VCol cols="12">
                <AppSelect
                  v-model="textTemplate"
                  :rules="[requiredValidator]"
                  label="Text Template"
                  placeholder="Text Template"
                  :items="['Template1', 'Template2', 'Template3', 'Template4']"
                />
              </VCol>
              
              <VCol cols="12">
                <v-textarea
                  v-model="message"
                  label="Message*"
                  :rules="[requiredValidator]"
                  rows="5"
                  placeholder="Message*"
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
