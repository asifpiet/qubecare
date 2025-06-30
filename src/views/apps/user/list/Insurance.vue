<script setup>
import PatientInsuraceCoverage from '@/views/apps/user/list/PatientInsuraceCoverage.vue';
import { useStore } from 'vuex';
const store = useStore()
const isFormValid = ref(false)
const isLoading = ref(false)
const refForm = ref()
const patientInsuranceCoverageModle = ref(false)
const insurance = ref('')
const insuredPlanOrProgramName = ref('')
const insuredIDNumber = ref('')
const insuredGroupNameNo = ref('')
const employersSchoolName = ref('')
const relationshiptoInsured = ref('')
const insuredName = ref('')
const insuredDateOfBirth = ref('')
const insuredGender = ref('')
const coPayment = ref('')
const coInsurance = ref('')
const insuranceDeductible = ref('')
const insuredAddress = ref('')
const insuredCity = ref('')
const insuredState = ref('')
const insuredZip = ref('')
const insuredPhone = ref('')
const payerName = ref('')
const payerID = ref('')
const payerAddress = ref('')
const payerCity = ref('')
const payerState = ref('')
const payerZip = ref('')
const referringProviderName = ref('')
const referringProviderNPI = ref('')
const referringProviderTaxonomy = ref('')
const isAddNewUserDrawerVisible = ref(false)
const demographicData = ref('')
const isTonalSnackbarVisible = ref(false)
const states = ref([
  { name: 'Howland Island', abbreviation: 'UM-84' },
  { name: 'Delaware', abbreviation: 'DE' },
  { name: 'Maryland', abbreviation: 'MD' },
  { name: 'Baker Island', abbreviation: 'UM-81' },
  { name: 'Kingman Reef', abbreviation: 'UM-89' },
  { name: 'New Hampshire', abbreviation: 'NH' },
  { name: 'Wake Island', abbreviation: 'UM-79' },
  { name: 'Kansas', abbreviation: 'KS' },
  { name: 'Texas', abbreviation: 'TX' },
  { name: 'Nebraska', abbreviation: 'NE' },
  { name: 'Vermont', abbreviation: 'VT' },
  { name: 'Jarvis Island', abbreviation: 'UM-86' },
  { name: 'Hawaii', abbreviation: 'HI' },
  { name: 'Guam', abbreviation: 'GU' },
  { name: 'United States Virgin Islands', abbreviation: 'VI' },
  { name: 'Utah', abbreviation: 'UT' },
  { name: 'Oregon', abbreviation: 'OR' },
  { name: 'California', abbreviation: 'CA' },
  { name: 'New Jersey', abbreviation: 'NJ' },
  { name: 'North Dakota', abbreviation: 'ND' },
  { name: 'Kentucky', abbreviation: 'KY' },
  { name: 'Minnesota', abbreviation: 'MN' },
  { name: 'Oklahoma', abbreviation: 'OK' },
  { name: 'Pennsylvania', abbreviation: 'PA' },
  { name: 'New Mexico', abbreviation: 'NM' },
  { name: 'American Samoa', abbreviation: 'AS' },
  { name: 'Illinois', abbreviation: 'IL' },
  { name: 'Michigan', abbreviation: 'MI' },
  { name: 'Virginia', abbreviation: 'VA' },
  { name: 'Johnston Atoll', abbreviation: 'UM-67' },
  { name: 'West Virginia', abbreviation: 'WV' },
  { name: 'Mississippi', abbreviation: 'MS' },
  { name: 'Northern Mariana Islands', abbreviation: 'MP' },
  { name: 'United States Minor Outlying Islands', abbreviation: 'UM' },
  { name: 'Massachusetts', abbreviation: 'MA' },
  { name: 'Connecticut', abbreviation: 'CT' },
  { name: 'Florida', abbreviation: 'FL' },
  { name: 'District of Columbia', abbreviation: 'DC' },
  { name: 'Midway Atoll', abbreviation: 'UM-71' },
  { name: 'Navassa Island', abbreviation: 'UM-76' },
  { name: 'Indiana', abbreviation: 'IN' },
  { name: 'Wisconsin', abbreviation: 'WI' },
  { name: 'Wyoming', abbreviation: 'WY' },
  { name: 'South Carolina', abbreviation: 'SC' },
  { name: 'Arkansas', abbreviation: 'AR' },
  { name: 'South Dakota', abbreviation: 'SD' },
  { name: 'Montana', abbreviation: 'MT' },
  { name: 'North Carolina', abbreviation: 'NC' },
  { name: 'Palmyra Atoll', abbreviation: 'UM-95' },
  { name: 'Puerto Rico', abbreviation: 'PR' },
  { name: 'Colorado', abbreviation: 'CO' },
  { name: 'Missouri', abbreviation: 'MO' },
  { name: 'New York', abbreviation: 'NY' },
  { name: 'Maine', abbreviation: 'ME' },
  { name: 'Tennessee', abbreviation: 'TN' },
  { name: 'Georgia', abbreviation: 'GA' },
  { name: 'Louisiana', abbreviation: 'LA' },
  { name: 'Nevada', abbreviation: 'NV' },
  { name: 'Iowa', abbreviation: 'IA' },
  { name: 'Idaho', abbreviation: 'ID' },
  { name: 'Rhode Island', abbreviation: 'RI' },
  { name: 'Washington', abbreviation: 'WA' },
  { name: 'Ohio', abbreviation: 'OH' },
  // ... (add the rest of the states)
]);
const formatPhoneNumber = () => {
 
  const numericValue = insuredPhone.value.replace(/\D/g, '');

  
  if (numericValue.length <= 10) {
    insuredPhone.value = numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else {
    const truncatedValue = numericValue.slice(0, 10);
    insuredPhone.value = truncatedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
};

const emit = defineEmits([
  'update:isDrawerOpen',
  'userData',
  'customEvent'
])
const CopyFromDemographic = ()=> {
 let demographicData = store.getters.getPatientPorfile;
  insuredPhone.value = demographicData.preferredPhone;
  insuredAddress.value = demographicData.address;
  insuredCity.value = demographicData.city;
  insuredState.value = demographicData.state;
  insuredZip.value = demographicData.zipcode;
}

const patientInsuraceCoverageData = async userData => {
  console.log('UserDataDrawn', userData);
  emit('patientData',userData);
 
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
        insurance:insurance.value,
      insuredPlanOrProgramName:insuredPlanOrProgramName.value,
      insuredIDNumber:insuredIDNumber.value,
      insuredGroupNameNo: insuredGroupNameNo.value,
      employersSchoolName: employersSchoolName.value,
      relationshiptoInsured: relationshiptoInsured.value,
      insuredName: insuredName.vaue,
      insuredDateOfBirth: insuredDateOfBirth.value,
      insuredGender:insuredGender.value,
      coPayment: coPayment.value,
      coInsurance: coInsurance.value,
      insuranceDeductible:insuranceDeductible.value,
      insuredAddress: insuredAddress.value,
      insuredCity:insuredCity.value,
      insuredState:insuredState.value,
      insuredZip:insuredZip.value,
      insuredPhone:insuredPhone.value,
      payerName:payerName.value,
      payerID:payerID.value,
      payerAddress:payerAddress.value,
      payerCity:payerCity.value,
      payerState:payerState.value,
      payerZip:payerZip.value,
      referringProviderName:referringProviderName.value,
      referringProviderNPI:referringProviderNPI.value,
      referringProviderTaxonomy:referringProviderTaxonomy.value,
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
  })
}

const ispatientInsuranceCoverage = () => {
  patientInsuranceCoverageModle.value = false;
}
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
      Insurance created.
    </VSnackbar>
    <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- 👉 Full name -->
              <VCol cols="6">
                <AppTextField
                  v-model="insurance"
                  
                  label="Insurance"
                  placeholder="Insurance"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="insuredPlanOrProgramName"
                  
                  label="Insured Plan or Program Name"
                  placeholder="Insured Plan or Program Name"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  type="number"
                  v-model="insuredIDNumber"
                  
                  label="Insured ID Number"
                  placeholder="Insured ID Number"
                />
              </VCol>

              <!-- 👉 Username -->
              <VCol cols="6">
                <AppTextField
                  type="number"
                  v-model="insuredGroupNameNo"
                  
                  label="Insured Group Name/No"
                  placeholder="Insured Group Name/No"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="6">
                <AppTextField
                  v-model="employersSchoolName"
                  
                  label="Employers/School Name"
                  placeholder="Employers/School Name"
                />
              </VCol>

              <!-- 👉 company -->
              

              <!-- 👉 Country -->
              <VCol cols="6">
                <AppSelect
                  v-model="relationshiptoInsured"
                  label="Relationship to Insured"
                  placeholder="Relationship to Insured"
                  
                   :items="['Self', 'Spouse', 'Child', 'Other']"
                />
              </VCol>

              <!-- 👉 Contact -->
              <VCol cols="6">
                <AppTextField
                  v-model="insuredName"
                  
                  label="Insured Name"
                  placeholder="Insured Name"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="insuredDateOfBirth"
                  type="date"
                  
                  label="Insured Date of Birth(mm/dd/yyyy)"
                  placeholder="Insured Date of Birth"
                />
              </VCol>

              <!-- 👉 Role -->
              <VCol cols="6">
                <AppSelect
                  v-model="insuredGender"
                  label="Insured Gender"
                  placeholder="Insured Gender"
                  
                  :items="['Male', 'Female', 'Other']"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="coPayment"
                  
                  label="Co Payment$"
                  placeholder="Co Payment$"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="coInsurance"
                  
                  label="Co-Insurance%"
                  placeholder="Co-Insurance%"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="insuranceDeductible"
                  
                  label="Inusurance Deductible"
                  placeholder="Deductible"
                />
              </VCol>
              <VCol cols="12">
              <VBtn @click="CopyFromDemographic">
                  Copy From Demographic
                </VBtn>
              </VCol>
              <VCol cols="12">
                <AppTextField
                  v-model="insuredAddress"
                  
                  label="Insured Address"
                  placeholder="Insured Address"
                />
              </VCol>

              <VCol cols="4">
                <AppTextField
                  v-model="insuredCity"
                  
                  label="Insured City"
                  placeholder="Insured City"
                />
              </VCol>
              <!-- 👉 Plan -->
              <VCol cols="4">
                <AppSelect
                  v-model="insuredState"
                  label="Insured State"
                  placeholder="State"
                  
                  :items="states"
                   item-title="name"
                    item-value="abbreviation"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="insuredZip"
                  
                  label="Insured Zip"
                  placeholder="Insured Zip"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="insuredPhone"
                  pattern="^\(\d{3}\) \d{3}-\d{4}$"
                  :rules="[validUSAPhone]"
                  label="Insured Phone"
                  max="14"
                  @input="formatPhoneNumber" 
                  placeholder="i.e. (000) 000-0000"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="payerName"
                  
                  label="Payer Name"
                  placeholder="Payer Name"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="payerID"
                  
                  label="Payer ID"
                  placeholder="Payer ID"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="payerAddress"
                  
                  label="Payer Address"
                  placeholder="Payer Address"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="payerCity"
                  
                  label="Payer City"
                  placeholder="Payer City"
                />
              </VCol>
              <VCol cols="6">
                <AppSelect
                  v-model="payerState"
                  label="Payer State"
                  placeholder="Payer State"
                  
                  :items="states"
                   item-title="name"
                    item-value="abbreviation"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="payerZip"
                  
                  label="Payer Zip"
                  placeholder="Payer Zip"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="referringProviderName"
                  
                  label="Referring Provider Name (Only Name)"
                  placeholder="Referring Provider Name"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="referringProviderNPI"
                  
                  label="Referring Provider NPI"
                  placeholder="Referring Provider NPI
"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="referringProviderTaxonomy"
                  
                  label="Referring Provider Taxonomy"
                  placeholder="Referring Provider Taxonomy
"
                />
              </VCol>
              
               <VCol cols="12">
              <VBtn  class="me-3"
                prepend-icon="tabler-plus"
                @click="patientInsuranceCoverageModle = true"
              >
               Patient Insurace Coverage
              </VBtn>
             
              </VCol> 
               <VDialog
                  v-model="patientInsuranceCoverageModle"
                  width="700"
                >
                <DialogCloseBtn @click="patientInsuranceCoverageModle = false" />
                  <PatientInsuraceCoverage  
                    @patientInsuranceCoverage=patientInsuraceCoverageData
                    @customEvent="ispatientInsuranceCoverage"
                  />
               </VDialog>

               <VCol cols="12">
                <VBtn
                 @click="saveAndClose"
                  class="me-3"
                >
                  Save and Close
                </VBtn>
                <VBtn
                  @click="saveOnly"
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
