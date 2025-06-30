<script setup>
// import PatientInsuraceCoverage from '@/views/apps/user/list/PatientInsuraceCoverage.vue';
import { usePatientStore } from '@/stores/patientStore';

const patientStore = usePatientStore()
const isFormValid = ref(false)
const isLoading = ref(false)
const refForm = ref()

const isTonalSnackbarVisible = ref(false)
const states = statesList;
const formatPhoneNumber = () => {

  const numericValue = patientStore.insurance.insuredPhone.replace(/\D/g, '');


  if (numericValue.length <= 10) {
    patientStore.insurance.insuredPhone = numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else {
    const truncatedValue = numericValue.slice(0, 10);
    patientStore.insurance.insuredPhone = truncatedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
};

const CopyFromDemographic = () => {
  patientStore.copyInsuranceFromDemographic()
}

const saveAndClose = async () => {
  if (await onSubmit())
    patientStore.isDrawerOpen = false
}

const onSubmit = async (trigger) => {
  isLoading.value = true;
  return refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      patientStore.saveInsurance()
      isTonalSnackbarVisible.value = true;
      isLoading.value = false;
      if (trigger == 'saveClose') {
        emit('UpdateTab', true)
        nextTick(() => {
          refForm.value?.reset()
          refForm.value?.resetValidation()
        })
      }
    }
    return false;
  })
}

</script>
<template>
  <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
    <VRow>
      <!-- 👉 Full name -->
      <VCol cols="6">
        <AppTextField v-model="patientStore.insurance.insuredPlanOrProgramName" :label="$t('Insurance')"
          :placeholder="$t('Insurance')" />
      </VCol>
      <VCol cols="6">
        <AppTextField v-model="patientStore.insurance.insuredPlanOrProgramName"
          :label="$t('Insured Plan or Program Name')" :placeholder="$t('Insured Plan or Program Name')" />
      </VCol>
      <VCol cols="6">
        <AppTextField type="number" v-model="patientStore.insurance.insuredIDNumber" :label="$t('Insured ID Number')"
          :placeholder="$t('Insured ID Number')" />
      </VCol>

      <!-- 👉 Username -->
      <VCol cols="6">
        <AppTextField type="number" v-model="patientStore.insurance.insuredGroupNameNo"
          :label="$t('Insured Group Name/No')" :placeholder="$t('Insured Group Name/No')" />
      </VCol>

      <!-- 👉 Email -->
      <VCol cols="6">
        <AppTextField :rules="[requiredValidator]" v-model="patientStore.insurance.employersSchoolName"
          :label="$t('Employers/School Name')" class="field-required" :placeholder="$t('Employers/School Name')" />
      </VCol>

      <!-- 👉 company -->


      <!-- 👉 Country -->
      <VCol cols="6">
        <AppSelect v-model="patientStore.insurance.relationshiptoInsured" :label="$t('Relationship to Insured')"
          :placeholder="$t('Relationship to Insured')" :items="['Self', 'Spouse', 'Child', 'Other']" />
      </VCol>

      <!-- 👉 Contact -->
      <VCol cols="6">
        <AppTextField v-model="patientStore.insurance.insuredPlanOrProgramName" :label="$t('Insured Name')"
          :placeholder="$t('Insured Name')" />
      </VCol>
      <VCol cols="6">
        <AppTextField v-model="patientStore.insurance.insuredDateOfBirth" type="date"
          :label="$t('Insured Date of Birth(mm/dd/yyyy)')" :placeholder="$t('Insured Date of Birth')" />
      </VCol>

      <!-- 👉 Role -->
      <VCol cols="6">
        <AppSelect v-model="patientStore.insurance.insuredGender" :label="$t('Insured Gender')" class="field-required"
          :rules="[requiredValidator]" :items="['Male', 'Female', 'Other']" />
      </VCol>

      <VCol cols="6">
        <AppTextField v-model="patientStore.insurance.coPayment" :label="$t('Co Payment$')"
          :placeholder="$t('Co Payment$')" />
      </VCol>
      <VCol cols="6">
        <AppTextField v-model="patientStore.insurance.coInsurance" :label="$t('Co-Insurance%')"
          :placeholder="$t('Co-Insurance%')" />
      </VCol>

      <VCol cols="6">
        <AppTextField v-model="patientStore.insurance.insuranceDeductible" :label="$t('Insurance Deductible')"
          :placeholder="$t('Deductible')" />
      </VCol>
      <VCol cols="12">
        <VBtn @click="CopyFromDemographic" size="small">
          {{ $t('Copy From Demographic') }}
        </VBtn>
      </VCol>
      <VCol cols="12">
        <AppTextField v-model="patientStore.insurance.insuredAddress" :rules="[requiredValidator]"
          :label="$t('Insured Address')" class="field-required" :placeholder="$t('Insured Address')" />
      </VCol>

      <VCol cols="4">
        <AppTextField v-model="patientStore.insurance.insuredCity" :rules="[requiredValidator]"
          :label="$t('Insured City')" class="field-required" :placeholder="$t('Insured City')" />
      </VCol>
      <!-- 👉 Plan -->
      <VCol cols="4">
        <AppSelect v-model="patientStore.insurance.insuredState" :rules="[requiredValidator]"
          :label="$t('Insured State')" class="field-required" :placeholder="$t('State')" :items="states"
          item-title="name" item-value="abbreviation" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="patientStore.insurance.insuredZip" :rules="[requiredValidator]"
          :label="$t('Insured Zip')" class="field-required" :placeholder="$t('Insured Zip')" />
      </VCol>

      <VCol cols="6">
        <AppTextField v-model="patientStore.insurance.insuredPhone" pattern="^\(\d{3}\) \d{3}-\d{4}$"
          :rules="[validUSAPhone]" :label="$t('Insured Phone')" max="14" @input="formatPhoneNumber"
          placeholder="i.e. (000) 000-0000" />
      </VCol>

      <VCol cols="6">
        <AppTextField v-model="patientStore.insurance.payerName" :label="$t('Payer Name')"
          :placeholder="$t('Payer Name')" />
      </VCol>

      <VCol cols="6">
        <AppTextField v-model="patientStore.insurance.payerID" :label="$t('Payer ID')" :placeholder="$t('Payer ID')" />
      </VCol>
      <VCol cols="6">
        <AppTextField v-model="patientStore.insurance.payerAddress" :label="$t('Payer Address')"
          :placeholder="$t('Payer Address')" />
      </VCol>

      <VCol cols="6">
        <AppTextField v-model="patientStore.insurance.payerCity" :label="$t('Payer City')"
          :placeholder="$t('Payer City')" />
      </VCol>
      <VCol cols="6">
        <AppSelect v-model="patientStore.insurance.payerState" :label="$t('Payer State')"
          :placeholder="$t('Payer State')" :items="states" item-title="name" item-value="abbreviation" />
      </VCol>

      <VCol cols="6">
        <AppTextField v-model="patientStore.insurance.payerZip" :label="$t('Payer Zip')"
          :placeholder="$t('Payer Zip')" />
      </VCol>

      <VCol cols="6">
        <AppTextField v-model="patientStore.insurance.referringProviderName"
          :label="$t('Referring Provider Name (Only Name)')" :placeholder="$t('Referring Provider Name')" />
      </VCol>

      <VCol cols="6">
        <AppTextField v-model="patientStore.insurance.referringProviderNPI" :label="$t('Referring Provider NPI')"
          :placeholder="$t('Referring Provider NPI')
            " />
      </VCol>
      <VCol cols="6">
        <AppTextField v-model="patientStore.insurance.referringProviderTaxonomy"
          :label="$t('Referring Provider Taxonomy')" :placeholder="$t('Referring Provider Taxonomy')
            " />
      </VCol>

      <!-- <VCol cols="12"> -->
      <!-- <VBtn  class="me-3"
                prepend-icon="tabler-plus"
                @click="patientInsuranceCoverageModle = true"
              >
               Patient Insurace Coverage
              </VBtn> -->

      <!-- </VCol>  -->
      <!-- <VDialog
                  v-model="patientInsuranceCoverageModle"
                  width="700"
                >
                <DialogCloseBtn @click="patientInsuranceCoverageModle = false" />
                  <PatientInsuraceCoverage  
                    @patientInsuranceCoverage=patientInsuraceCoverageData
                    @customEvent="ispatientInsuranceCoverage"
                  />
               </VDialog> -->

      <VCol cols="12">
        <VBtn @click="saveAndClose" class="me-3">
          {{ $t('Save and Close') }}
        </VBtn>
        <!-- <VBtn
                  @click="saveOnly"
                 class="me-3"
                
                >
                Save
                </VBtn> -->
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
