<script setup>
import { useStore } from 'vuex';
const store = useStore()
const isFormValid = ref(false)
const refForm = ref()
const isLoading = ref(false)
const isTonalSnackbarVisible = ref(false)
const patientInsuranceCoverageModle = ref(false)
const secInsurance = ref('')
const secInsuredPlanORProgramName = ref('')
const secInsuredIDNumber = ref('')
const secInsuredGroupNameNo = ref('')
const secEmployersSchoolName = ref('')
const secRelationshipToInsured = ref('')
const secInsuredName = ref('')
const secInsuredDateOfBirth = ref('')
const secGender = ref('')
const secInsuredAddress = ref('')
const secInsuredCity = ref('')
const secSelectState = ref('')
const secInsuredZip = ref('')
const secInsuredPhone = ref('')
const secPayerName = ref('')
const secPayerID = ref('')
const secPayerAddress = ref('')
const secPayerCity = ref('')
const secPayerState = ref('')
const secZip = ref('')

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
 
  const numericValue = secInsuredPhone.value.replace(/\D/g, '');

  
  if (numericValue.length <= 10) {
    secInsuredPhone.value = numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else {
    const truncatedValue = numericValue.slice(0, 10);
    secInsuredPhone.value = truncatedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
};
const emit = defineEmits([
  'update:isDrawerOpen',
  'userData',
  'customEvent'
])
const CopyFromDemographic = ()=> {
 let demographicData = store.getters.getPatientPorfile;
  secInsuredPhone.value = demographicData.preferredPhone;
  secInsuredAddress.value = demographicData.address;
  secInsuredCity.value = demographicData.city;
  secSelectState.value = demographicData.state;
  secInsuredZip.value = demographicData.zipcode;
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
        secInsurance: secInsurance.value,
        secInsuredPlanORProgramName: secInsuredPlanORProgramName.value,
        secInsuredIDNumber: secInsuredIDNumber.value,
        secInsuredGroupNameNo: secInsuredGroupNameNo.value,
        secEmployersSchoolName: secEmployersSchoolName.value,
        secRelationshipToInsured: secRelationshipToInsured.value,
        secInsuredName: secInsuredName.value,
        secInsuredDateOfBirth: secInsuredDateOfBirth.value,
        secGender: secGender.value,
        secInsuredAddress: secInsuredAddress.value,
        secInsuredCity: secInsuredCity.value,
        secSelectState: secSelectState.value,
        secInsuredZip: secInsuredZip.value,
        secInsuredPhone: secInsuredPhone.value,
        secPayerName: secPayerName.value,
        secPayerID: secPayerID.value,
        secPayerAddress: secPayerAddress.value,
        secPayerCity: secPayerCity.value,
        secPayerState: secPayerState.value,
        secZip: secZip.value,
        
      })
      isTonalSnackbarVisible.value = true;
      isLoading.value = false;
    }
    isLoading.value = false;
  })
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
      Sec Insurance created.
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
                  v-model="secInsurance"
                  
                  label="Sec Insurance"
                  placeholder="Sec Insurance"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="secInsuredPlanORProgramName"
                  
                  label="Sec Insured Plan OR Program Name"
                  placeholder="Sec Insured Plan OR Program Name"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  
                  v-model="secInsuredIDNumber"
                  
                  label="Sec Insured ID Number"
                  placeholder="Sec Insured ID Number"
                />
              </VCol>

              <!-- 👉 Username -->
              <VCol cols="6">
                <AppTextField
                  v-model="secInsuredGroupNameNo"
                  
                  label="Sec Insured Group Name/No"
                  placeholder="Sec Insured Group Name/No"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="6">
                <AppTextField
                  v-model="secEmployersSchoolName"
                  
                  label="Sec Employers/School Name"
                  placeholder="Sec Employers/School Name"
                />
              </VCol>

              <!-- 👉 company -->
              

              <!-- 👉 Country -->
              <VCol cols="6">
                <AppSelect
                  v-model="secRelationshipToInsured"
                  label="Sec Relationship to Insured"
                  placeholder="Sec Relationship to Insured"
                  
                   :items="['Self', 'Spouse', 'Child', 'Other']"
                />
              </VCol>   

              <!-- 👉 Contact -->
              <VCol cols="6">
                <AppTextField
                  v-model="secInsuredName"
                  
                  label="Sec Insured Name"
                  placeholder="Sec Insured Name"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="secInsuredDateOfBirth"
                  type="date"
                  
                  label="Sec Insured Date of Birth(mm/dd/yyyy)"
                  placeholder="Sec Insured Date of Birth"
                />
              </VCol>

              <!-- 👉 Role -->
              <VCol cols="6">
                <AppSelect
                  v-model="secGender"
                  label="Sec Gender"
                  placeholder="Sec Gender"
                  
                  :items="['Male', 'Female', 'Other']"
                />
              </VCol>

              <VCol cols="12">
                <VBtn @click="CopyFromDemographic">
                  Copy From Demographics
                </VBtn>
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="secInsuredAddress"
                  
                  label="Sec Insured Address"
                  placeholder="Sec Insured Address"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="secInsuredCity"
                  
                  label="Sec Insured City"
                  placeholder="Sec Insured City"
                />
              </VCol>
              <!-- 👉 Plan -->
              <VCol cols="6">
                <AppSelect
                  v-model="secSelectState"
                  label="Sec Select State"
                  placeholder="Sec Select State"
                  
                  :items="states"
                   item-title="name"
                    item-value="abbreviation"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="secInsuredZip"
                  
                  label="Sec Insured Zip"
                  placeholder="Sec Insured Zip"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="secInsuredPhone"
                  pattern="^\(\d{3}\) \d{3}-\d{4}$"
                  :rules="[requiredValidator, validUSAPhone]"
                  label="Sec Insured Phone"
                  max="14"
                  @input="formatPhoneNumber" 
                  placeholder="i.e. (000) 000-0000"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="secPayerName"
                  
                  label="Sec Payer Name"
                  placeholder="Sec Payer Name"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="secPayerID"
                  
                  label="Sec Payer ID"
                  placeholder="Sec Payer ID"
                />
              </VCol>
              <VCol cols="12">
                <AppTextField
                  v-model="secPayerAddress"
                  
                  label="Sec Payer Address"
                  placeholder="Sec Payer Address"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="secPayerCity"
                  
                  label="Sec Payer City"
                  placeholder="Sec Payer City"
                />
              </VCol>
              <VCol cols="6">
                <AppSelect
                  v-model="secPayerState"
                  label="Sec Payer State"
                  placeholder="Sec Payer State"
                  
                  :items="states"
                   item-title="name"
                    item-value="abbreviation"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="secZip"
                  
                  label="Sec Zip"
                  placeholder="Sec Zip"
                />
              </VCol>
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
