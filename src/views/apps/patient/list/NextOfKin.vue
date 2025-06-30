<script setup>
import { usePatientStore } from '@/stores/patientStore';

const patientStore = usePatientStore()
// const nextofkin = patientStore.nextofkin
const isFormValid = ref(false)
const isLoading = ref(false)
const refForm = ref()
const isTonalSnackbarVisible = ref(false)
const states = statesList;

const updatePhone = (field, event) => {
  const formattedValue = formatPhoneNumber(event.target.value);
  if (field === 'nextkinPhone') {
    patientStore.nextofkin.nextkinPhone = formattedValue;
  }
};


const formatPhoneNumber = (inputValue) => {
  const numericValue = inputValue.replace(/\D/g, '');
  if (numericValue.length <= 10) {
    return numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else {
    const truncatedValue = numericValue.slice(0, 10);
    return truncatedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
};



const saveAndClose = async () => {
  if (await onSubmit())
    patientStore.isDrawerOpen = false
}


const onSubmit = async () => {
  isLoading.value = true;
  return refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      return patientStore.saveNextofkin()



    } else {
      return false;
    }
  })

}
// const onSubmit = async () => {
//   return refForm.value?.validate().then(async ({ valid }) => {
//       await patientStore.saveNextofkin()
//       console.log('x', x);
//       return x;

//       // if (trigger == 'saveClose') {

//       //   emit('UpdateTab', true)
//       //   nextTick(() => {
//       //     refForm.value?.reset()
//       //     refForm.value?.resetValidation()
//       //     isLoading.value = false;
//       //     patientStore.isDrawerOpen = false
//       //   })
//       // }
//     }
//     else {
//       return false;
//     }
//   })
// }

const CopyFromDemographic = () => {
  patientStore.copyNextFromDemographic()
}
</script>
<template>

  <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
    <VRow>
      <VCol cols="12" class="text-right">
        <VBtn @click="CopyFromDemographic" size="small">
          {{ $t('Copy From Demographic') }}

        </VBtn>
      </VCol>

      <VCol cols="4">
        <AppSelect v-model="patientStore.nextofkin.nextKinRelation" :label="$t('Relationship')" class="field-required"
          :placeholder="$t('Relationship')" :rules="[requiredValidator]"
          :items="['Self', 'Spouse', 'Child', 'Other']" />
      </VCol>
      <!-- 👉 Full name -->
      <VCol cols="4">
        <AppTextField v-model="patientStore.nextofkin.nextkinFirstName" :rules="[requiredValidator]"
          :label="$t('First Name')" class="field-required" :placeholder="$t('First Name')" />
      </VCol>

      <VCol cols="4">
        <AppTextField v-model="patientStore.nextofkin.nextkinLastName" :rules="[requiredValidator]"
          :label="$t('Last Name')" class="field-required" :placeholder="$t('Last Name')" />
      </VCol>





      <VCol cols="6">
        <AppTextField v-model="patientStore.nextofkin.nextkinPhone" pattern="^\(\d{3}\) \d{3}-\d{4}$"
          :rules="[requiredValidator, validUSAPhone]" :label="$t('Phone')" class="field-required" max="14"
          placeholder="i.e. (000) 000-0000" @input="(e) => updatePhone('nextkinPhone', e)" />
      </VCol>

      <VCol cols="6">
        <AppTextField v-model="patientStore.nextofkin.nextkinAddress" :rules="[requiredValidator]"
          :label="$t('Address')" class="field-required" :placeholder="$t('Address')" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="patientStore.nextofkin.nextkinCity" :rules="[requiredValidator]" :label="$t('City')"
          class="field-required" :placeholder="$t('City')" />
      </VCol>
      <VCol cols="4">
        <AppSelect v-model="patientStore.nextofkin.nextkinState" :label="$t('State')" class="field-required"
          :placeholder="$t('State')" :rules="[requiredValidator]" :items="states" item-title="name"
          item-value="abbreviation" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="patientStore.nextofkin.nextkinZipCode" type="number" :rules="[requiredValidator]"
          :label="$t('Zipcode')" class="field-required" :placeholder="$t('Zipcode')" />
      </VCol>

      <VCol cols="12">
        <VCheckbox v-model="patientStore.nextofkin.nextKinGuarantor"
          :label="$t('Is also the Guarantor (financially responsible). If unchecked, patient is the Guarantor')" />
      </VCol>


      <!-- 👉 Submit and Cancel -->
      <VCol cols="12">
        <VBtn @click="saveAndClose" class="me-3">
          {{ $t('Save and Close') }}
        </VBtn>
        <VBtn @click="onSubmit" class="me-3">
          {{ $t('Save') }}
        </VBtn>
        <VBtn type="reset" variant="tonal" color="error" class="me-3 mt-1" @click="patientStore.isDrawerOpen = false">
          {{ $t('Close') }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
<style scoped>
/* Target the asterisk in labels */
:deep(.field-required)>label:after {
  content: '*';
  color: rgb(var(--v-theme-error));

}
</style>
