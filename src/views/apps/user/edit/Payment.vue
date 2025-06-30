<script setup>
import { useStore } from 'vuex';
const store = useStore()
const isFormValid = ref(false)
const refForm = ref()
const isLoading = ref(false)
const isTonalSnackbarVisible = ref(false)
const patientInsuranceCoverageModle = ref(false)
const cardholderFirstname = ref('')
const cardholderLastname = ref('')
const cardNumber = ref('')
const securityCode = ref('')
const expiration = ref('')
const billingAddress = ref('')
const billingCity = ref('')
const billingState = ref('')
const billingPostalCode = ref('')
const billingCountry = ref('')
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
const showEditData = computed(() =>{
  console.log("getPatientProfile",store.getters.getPatientPorfile);
  let patient = store.getters.getPatientPorfile;
  if(patient){
    cardholderFirstname.value = store.getters.getPatientPorfile.cardholderFirstname
    cardholderLastname.value = store.getters.getPatientPorfile.cardholderLastname
    cardNumber.value =  store.getters.getPatientPorfile.cardNumber
    securityCode.value = store.getters.getPatientPorfile.securityCode
    expiration.value = store.getters.getPatientPorfile.expiration
    billingAddress.value = patient.billingAddress
    billingCity.value = patient.billingCity
    billingState.value = patient.billingState
    billingPostalCode.value = patient.billingPostalCode
    billingCountry.value = patient.billingCountry
  }
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'userData',
  'customEvent'
])

const CopyFromDemographic = ()=> {
 let demographicData = store.getters.getPatientPorfile;
  billingAddress.value = demographicData.address;
  billingCity.value = demographicData.city;
  billingState.value = demographicData.state;
  billingPostalCode.value = demographicData.zipcode;
}

const formatExpiry = () => {
    // Automatically format the input to MM/YY format
    expiration.value = expiration.value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d{2})/, '$1/$2');
}
const handleCVVInput = () => {
    // Remove non-digit characters from input
    securityCode.value = securityCode.value.replace(/\D/g, '');
}

const cardNumberFormat = () => {
    cardNumber.value = cardNumber.value.replace(/\D/g, '').substring(0, 16);

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
        cardholderFirstname: cardholderFirstname.value,
        cardholderLastname: cardholderLastname.value,
        cardNumber: cardNumber.value,
        securityCode: securityCode.value,
        expiration: expiration.value,
        billingAddress: billingAddress.value,
        billingCity: billingCity.value,
        billingState: billingState.value,
        billingPostalCode: billingPostalCode.value,
        billingCountry: billingCountry.value
      })
      isTonalSnackbarVisible.value = true;
      isLoading.value = false;
    }
    isLoading.value = false;
  })
}

</script>
<template>
  <div v-if="showEditData"></div>
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
      Payment updated.
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
                  v-model="cardholderFirstname"
                  
                  label="Cardholder Firstname"
                  placeholder="Cardholder Firstname"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="cardholderLastname"
                  
                  label="Cardholder Lastname"
                  placeholder="Cardholder Lastname"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  
                  v-model="cardNumber"
                  :rules="[cardNumberValidator]"
                  label="Card Number"
                  placeholder="xxxxxxxxxxxxxxxx"
                  @input="cardNumberFormat" 
                />
            </VCol>

              <!-- 👉 Username -->
              <VCol cols="6">
                <AppTextField
                  v-model="securityCode"
                  :rules="[cvvValidator]"
                  label="Security Code"
                  placeholder="Security Code"
                  @input="handleCVVInput"
                  maxlength="3"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="6">
                <AppTextField
                  v-model="expiration"
                  :rules="[expiryValidator]"
                  label="Expiration"
                  placeholder="Expiration"
                   @input="formatExpiry"
                />
              </VCol>

              <VCol cols="12">
                <VBtn @click="CopyFromDemographic">
                  Copy From Demographics
                </VBtn>
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="billingAddress"
                  
                  label="Billing Address"
                  placeholder="Billing Address"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="billingCity"
                  
                  label="Billing Address City"
                  placeholder="Billing Address City"
                />
              </VCol>

              <!-- 👉 company -->
              

              <!-- 👉 Country -->
              <VCol cols="6">
                <AppSelect
                  v-model="billingState"
                  label="Address State"
                  placeholder="Address State"
                  
                  :items="states"
                   item-title="name"
                    item-value="abbreviation"
                />
              </VCol>   

              <!-- 👉 Contact -->
              <VCol cols="6">
                <AppTextField
                  v-model="billingPostalCode"
                  
                  label="Billing Address Postal Code"
                  placeholder="Billing Address Postal Code"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="billingCountry"
                  
                  label="Billing Address Country"
                  placeholder="Billing Address Country"
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
