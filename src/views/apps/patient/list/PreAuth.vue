<script setup>
import { useStore } from 'vuex';
const store = useStore()
const isFormValid = ref(false)
const refForm = ref()
const isLoading = ref(false)
const isTonalSnackbarVisible = ref(false)
const emit = defineEmits([
  'update:isDrawerOpen',
  'userData',
  'customEvent'
])

// Field data structure
const formFields = ref([
  { authorization: '', startDate: '', endDate: '', visits: '', amount: '', notes: '' }
]);

const addNewFields = () => {
  formFields.value.push({ authorization: '', startDate: '', endDate: '', visits: '', amount: '', notes: '',  });
};

// Delete a specific set of fields
const deleteFields = (index) => {
  if (formFields.value.length > 1) {
    formFields.value.splice(index, 1);
  }
};

const closeNavigationDrawer = () => {
  emit('customEvent', false)  
}
const saveAndClose = ()=> {
  onSubmit('saveClose')
  emit('update:isDrawerOpen', false)
}

const saveOnly = ()=> {
  onSubmit('save')
  emit('update:isDrawerOpen', true)
}

const onSubmit = (trigger) => {
  isLoading.value = true;
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('patientData', {
        id: store.getters.getPatientPorfile.patientId,
        checkIsFormOpen: trigger,
        preAuth: formFields.value,
      })
      isTonalSnackbarVisible.value = true;
      isLoading.value = false;
      if(trigger == 'saveClose')
      {
        emit('UpdateTab', true)
        nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
        })
      }
    }
    isLoading.value = false;
  });
};
</script>
<template>
  <VDialog v-model="isLoading" width="110" height="150" color="primary">
        <VCardText class="" style="color: white !important;">
          <div class="demo-space-x">
            <VProgressCircular :size="40" color="primary" indeterminate />
          </div>
        </VCardText>
      </VDialog>
      <VSnackbar
      v-model="isTonalSnackbarVisible"
      location="top end"
      variant="flat"
      color="success"
    >
      Profile updated succesfully
    </VSnackbar>
  <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
    <VRow v-for="(field, index) in formFields" :key="index">
      <VCol cols="4">
        <AppTextField v-model="field.authorization" label="Authorization" placeholder="Authorization" />
      </VCol>
      
      <VCol cols="4">
        <AppTextField v-model="field.startDate" type="date" label="Start Date" placeholder="Start Date" />
      </VCol>
      
      <VCol cols="4">
        <AppTextField v-model="field.endDate" type="date" label="End Date" placeholder="End Date" />
      </VCol>
      
      <VCol cols="4">
        <AppTextField v-model="field.visits" label="#Visits" placeholder="#Visits" />
      </VCol>
      
      <VCol cols="4">
        <AppTextField v-model="field.amount" label="$Amount" placeholder="$Amount" />
      </VCol>
      
      <VCol cols="4">
        <AppTextField v-model="field.notes" label="Notes" placeholder="Notes" />
      </VCol>

      <VCol cols="12" v-if="index > 0" class="d-flex justify-end">
        <VBtn @click="deleteFields(index)" color="error" class="mb-3">Delete</VBtn>
      </VCol>
    </VRow>
    
    <VCol cols="12">
      <VBtn @click="addNewFields" class="mb-3"> + Add More</VBtn>
    </VCol>

    <VCol cols="12">
      <VBtn
                 @click="saveAndClose"
                  class="me-3"
                >
                  Submit
                </VBtn>
                <!-- <VBtn
                  @click="saveOnly"
                 class="me-3"
                
                >
                Save
                </VBtn> -->
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="error"
                  class="ml-0"
                  @click="closeNavigationDrawer"
                >
                Close
                </VBtn>
    </VCol>
  </VForm>
</template>

