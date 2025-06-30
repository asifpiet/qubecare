<script setup>
import { useStore } from 'vuex';
const store = useStore()
const isFormValid = ref(false)
const isLoading = ref(false)
const refForm = ref()
const relationship = ref('')
const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const address = ref('')
const city = ref('')
const state = ref('')
const zip = ref('')
const demographicData = ref('')
const isTonalSnackbarVisible = ref(false)
const isGuarantor = ref(false)
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
    relationship.value = store.getters.getPatientPorfile.nextKinRelation
    firstName.value = store.getters.getPatientPorfile.nextkinFirstName
    lastName.value =  store.getters.getPatientPorfile.nextkinLastName
    phone.value = store.getters.getPatientPorfile.nextkinPhone
    address.value = patient.nextkinAddress
    city.value = patient.nextkinCity
    state.value = patient.nextkinState
    zip.value = patient.nextkinZipCode
    isGuarantor.value = patient.nextKinGuarantor;
    if(patient.nextKinGuarantor == 1){
      isGuarantor.value = true;
    }
  }
})

const formatPhoneNumber = () => {
  // Remove non-numeric characters from the input
  const numericValue = phone.value.replace(/\D/g, '');

  // Apply formatting logic
  if (numericValue.length <= 10) {
    phone.value = numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else {
    // Limit the input to a maximum of 14 characters
    const truncatedValue = numericValue.slice(0, 10);
    phone.value = truncatedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
};

const emit = defineEmits([
  'update:isDrawerOpen',
  'userData',
  'customEvent'
])



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
  console.log('patientId', store.getters.getPatientPorfile.patientId);
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('patientData', {
        id: store.getters.getPatientPorfile.patientId,
        checkIsFormOpen: trigger,
        nextKinRelation: relationship.value,
        nextkinFirstName: firstName.value,
        nextkinLastName: lastName.value,
        nextkinPhone: phone.value,
        nextkinAddress: address.value,
        nextkinCity: city.value,
        nextkinState: state.value,
        nextkinZipCode: zip.value,
        nextKinGuarantor:isGuarantor.value
      })
      isTonalSnackbarVisible.value = true;
      isLoading.value = false;
      // nextTick(() => {
      //   refForm.value?.reset()
      //   refForm.value?.resetValidation()
      // })
    }
    isLoading.value = false;
  })
}

const CopyFromDemographic = ()=> {
 let demographicData = store.getters.getPatientPorfile;
  firstName.value = demographicData.firstName;
  lastName.value = demographicData.lastName;
  phone.value = demographicData.preferredPhone;
  address.value = demographicData.address;
  city.value = demographicData.city;
  state.value = demographicData.state;
  zip.value = demographicData.zipcode;
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
      NextKin updated.
    </VSnackbar>
    <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <VCol cols="12">
                <VBtn @click="CopyFromDemographic">
                  Copy From Demographic
                </VBtn>
              </VCol>
              <VCol cols="4">
                <AppSelect
                  v-model="relationship"
                  label="Relationship"
                  placeholder="Relationship"
                  :rules="[requiredValidator]"
                  :items="['Self', 'Spouse', 'Child', 'Other']"
                />
              </VCol>
              <!-- 👉 Full name -->
              <VCol cols="4">
                <AppTextField
                  v-model="firstName"
                  :rules="[requiredValidator]"
                  label="First Name"
                  placeholder="First Name"
                />
              </VCol>
              
              <VCol cols="4">
                <AppTextField
                  v-model="lastName"
                  :rules="[requiredValidator]"
                  label="Last Name"
                  placeholder="Last Name"
                />
              </VCol>

              

             
             
              <VCol cols="6">
                <AppTextField
                  v-model="phone"
                  pattern="^\(\d{3}\) \d{3}-\d{4}$"
                  :rules="[requiredValidator, validUSAPhone]"
                  label="Phone"
                  max="14"
                  @input="formatPhoneNumber" 
                  placeholder="i.e. (000) 000-0000"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="address"
                  :rules="[requiredValidator]"
                  label="Address"
                  placeholder="Address"
                />
                </VCol>
                <VCol cols="4">
                <AppTextField
                  v-model="city"
                  :rules="[requiredValidator]"
                  label="City"
                  placeholder="City"
                />
                </VCol>
                <VCol cols="4">
                <AppSelect
                  v-model="state"
                  label="State"
                  placeholder="State"
                  :rules="[requiredValidator]"
                  :items="states"
                   item-title="name"
                    item-value="abbreviation"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="zip"
                  type="number"
                  :rules="[requiredValidator]"
                  label="Zipcode"
                  placeholder="Zipcode"
                />
                </VCol>

                <VCol cols="12">
                <VCheckbox
                  v-model="isGuarantor"
                  label=" Is also the Guarantor (financially responsible). If unchecked, patient is the Guarantor."
                />
                </VCol>
             

              <!-- 👉 Submit and Cancel -->
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
