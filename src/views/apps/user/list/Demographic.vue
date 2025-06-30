<script setup>
import avatar1 from '@images/avatars/avatar-1.png';
import { useStore } from 'vuex';
const store = useStore()
const isLoading = ref(false)
const isFormValid = ref(false)
const refForm = ref()
const fullName = ref('')
const firstName = ref('')
const middleName = ref('')
const lastName = ref('')
const preferredName = ref('')
const email = ref('')
const preferredContactMethod = ref('')
const contactMethod = ref('')
const personalID = ref('')
const dateOfBirth = ref('')
const sexatBirth = ref('Male')
const genderIdentity = ref('')
const race = ref('')
const pronoun = ref('')
const AgeGroup = ref('')
const preferredPhone = ref('')
const alternativePhone = ref('')
const textmsgNumber = ref('')
const address = ref('')
const city = ref('')
const state = ref('')
const zipcode = ref('')
const primaryPractitioner = ref('')
const guardian = ref('')
const emergencyContactNumber = ref('')
const emergencyContactNameRelation = ref('')
const patientMaritalStatus = ref('')
const primaryCarePhysician = ref('')
const occupation = ref('')
const referredBy = ref('')
const PatientNote = ref('')
const isportalAccess = ref(false)
const status = ref(false)
const refInputEl = ref()
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

const accountData = {
  avatarImg: avatar1
}

const accountDataLocal = ref(structuredClone(accountData))

const emit = defineEmits([
  'update:isDrawerOpen',
  'userData',
  'customEvent'
])

const resetAvatar = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg
}

const closeNavigationDrawer = () => {
  emit('customEvent', false)  
}

const changeAvatar = file => {
  const fileReader = new FileReader()
  const { files } = file.target
  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string')
        accountDataLocal.value.avatarImg = fileReader.result
      console.log("asds",accountDataLocal.value.avatarImg);
    }
  }
}
const formatPhoneNumber = (inputValue) => {
  const numericValue = inputValue.replace(/\D/g, '');
  if (numericValue.length <= 10) {
    return numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else {
    const truncatedValue = numericValue.slice(0, 10);
    return truncatedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
};

const updatePhone = (field, event) => {
  const formattedValue = formatPhoneNumber(event.target.value);
  if (field === 'preferredPhone') {
    preferredPhone.value = formattedValue;
  } else if (field === 'alternativePhone') {
    alternativePhone.value = formattedValue;
  } else if (field === 'textmsgNumber') {
    textmsgNumber.value = formattedValue;
  }
  else if (field === 'emergencyContactNumber') {
    emergencyContactNumber.value = formattedValue;
  }
};

const resetForm = () => {
  firstName.value = null;
  lastName.value=  null;
}

const saveAndClose = ()=> {
  onSubmit('saveClose')
  emit('update:isDrawerOpen', false)
}
const saveOnly = ()=> {
  onSubmit('save')
  emit('update:isDrawerOpen', true)
}

const onSubmit = async(trigger) => {
  isLoading.value = true
  refForm.value?.validate().then(async({ valid }) => {
    if (valid) {
      console.log('lastnae',lastName.value);
      emit('patientData', {
        // id: store.getters.getPatientPorfile.patientId,
        checkIsFormOpen: trigger,
        firstName:firstName.value,
        lastName:lastName.value,
        fullName: firstName.value+' '+lastName.value,
        middleName: middleName.value,
        preferredName: preferredName.value,
        email: email.value,
        contactMethod: contactMethod.value,
        personalID: personalID.value,
        dateOfBirth: dateOfBirth.value,
        sexatBirth: sexatBirth.value,
        genderIdentity: genderIdentity.value,
        race: race.value,
        pronoun: pronoun.value,
        ageGroup: AgeGroup.value,
        preferredPhone: preferredPhone.value,
        alternativePhone: alternativePhone.value,
        textmsgNumber: textmsgNumber.value,
        address: address.value,
        city: city.value,
        state: state.value,
        zipcode: zipcode.value,
        primaryPractitioner: primaryPractitioner.value,
        primaryCarePhysician: primaryCarePhysician.value,
        guardian: guardian.value,
        emergencyContactNumber: emergencyContactNumber.value,
        emergencyContactNameRelation: emergencyContactNameRelation.value,
        patientMaritalStatus: patientMaritalStatus.value,
        occupation: occupation.value,
        referredBy: referredBy.value,
        patientNote: PatientNote.value,
        status:status.value,
        isportalAccess: isportalAccess.value
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
    }else{
      isLoading.value = false;
    }
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
      Profile saved.
    </VSnackbar>
      <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            size="100"
            class="me-6"
            :image="accountDataLocal.avatarImg"
          />

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-4">
            <div class="d-flex flex-wrap gap-4">
              <VBtn
                color="primary"
                size="small"
                @click="refInputEl?.click()"
              >
                <VIcon
                  icon="tabler-cloud-upload"
                  class="d-sm-none"
                />
                <span class="d-none d-sm-block">Upload new photo</span>
              </VBtn>

              <input
                ref="refInputEl"
                type="file"
                name="file"
                accept=".jpeg,.png,.jpg,GIF"
                hidden
                @input="changeAvatar"
              >

              <VBtn
                type="reset"
                size="small"
                color="secondary"
                variant="tonal"
                @click="resetAvatar"
              >
                <span class="d-none d-sm-block">Reset</span>
                <VIcon
                  icon="tabler-refresh"
                  class="d-sm-none"
                />
              </VBtn>
            </div>

            <p class="text-body-1 mb-0">
              Allowed JPG, GIF or PNG. Max size of 800K
            </p>
          </form>
        </VCardText>
         <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>
              
              <!-- 👉 Full name -->
              <VCol cols="6">
                <AppTextField
                  v-model="firstName"
                  :rules="[requiredValidator]"
                  label="First Name"
                  placeholder="First Name"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="middleName"
                  label="Middle Name"
                  placeholder="Middle Name"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="lastName"
                  :rules="[requiredValidator]"
                  label="Last Name"
                  placeholder="Last Name"
                />
              </VCol>

              <!-- 👉 Username -->
              <VCol cols="6">
                <AppTextField
                  v-model="preferredName"
                  label="Preferred Name"
                  placeholder="preferred Name"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="6">
                <AppTextField
                  v-model="email"
                  :rules="[emailValidator]"
                  label="Email"
                  placeholder="johndoe@email.com"
                />
              </VCol>

              <!-- 👉 company -->
              

              <!-- 👉 Country -->
              <VCol cols="6">
                <AppSelect
                  v-model="contactMethod"
                  label="Contact Method"
                  placeholder="Contact Method"
                  :items="['Pre Contact Method', 'Email', 'Phone', 'Email/Phone']"
                />
              </VCol>

              <!-- 👉 Contact -->
              <VCol cols="6">
                <AppTextField
                  v-model="personalID"
                  type="number"
                  label="Personal ID"
                  placeholder="Personal ID"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="dateOfBirth"
                  type="date"
                  :rules="[requiredValidator]"
                  label="Date Of Birth"
                  placeholder="Date Of Birth"
                />
              </VCol>

              <!-- 👉 Role -->
              <VCol cols="6">
                <AppSelect
                  v-model="sexatBirth"
                  label="Sex at Birth"
                  placeholder="sexatBirth"
                  :items="['Male', 'Female', 'Other']"
                />
              </VCol>

              <!-- 👉 Plan -->
              <VCol cols="6">
                <AppSelect
                  v-model="genderIdentity"
                  label="Gender Identity"
                  placeholder="Gender Identity"
                  :items="['Choose Not to disclose',
                    'Male',
                    'Female', 
                    'FTM(Female-to-male/Transgender Male/Trans Man)',
                    'MTF(Male-to-female/Transgender Female/Trans Women)',
                    'Genderqueer',
                    'Unknown'
                ]"
                />
              </VCol>

              <VCol cols="6">
                <AppSelect
                  v-model="race"
                  label="Race (Optinal)"
                  placeholder="Race (Optinal)"
                  :items="['American Indian or Alaska Native', 'Asian', 'Black or African Amercian', 'White', 'Hispanic or Latino', 'Native Hawaiian or Other Pacfic Islander', 'Unknown']"
                />
              </VCol>

              <VCol cols="6">
                <AppSelect
                  v-model="pronoun"
                  label="Pronoun"
                  placeholder="Pronoun"
                  :items="['He', 'She', 'They', 'Unknown']"
                />
              </VCol>
              <VCol cols="6">
                <AppSelect
                  v-model="AgeGroup"
                  label="Age Group"
                  placeholder="AgeGroup"
                  :items="['Child', 'Adult']"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="preferredPhone"
                  pattern="^\(\d{3}\) \d{3}-\d{4}$"
                  :rules="[requiredValidator, validUSAPhone]"
                  label="Preferred Phone"
                  max="14"
                  @input="(e) => updatePhone('preferredPhone', e)"
                  placeholder="i.e. (000) 000-0000"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="alternativePhone"
                  pattern="^\(\d{3}\) \d{3}-\d{4}$"
                  :rules="[validUSAPhone]"
                  label="Alternative Phone"
                  max="14"
                  @input="(e) => updatePhone('alternativePhone', e)"
                  placeholder="i.e. (000) 000-0000"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="textmsgNumber"
                  pattern="^\(\d{3}\) \d{3}-\d{4}$"
                  :rules="[validUSAPhone]"
                  label="Text Msg Number"
                  max="14"
                  @input="(e) => updatePhone('textmsgNumber', e)"
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
                <VCol cols="6">
                <AppTextField
                  v-model="city"
                  :rules="[requiredValidator]"
                  label="City"
                  placeholder="City"
                />
                </VCol>
                <VCol cols="6">
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
              <VCol cols="6">
                <AppTextField
                  v-model="zipcode"
                  type="number"
                  :rules="[requiredValidator]"
                  label="Zipcode"
                  placeholder="Zipcode"
                />
                </VCol>
              <VCol cols="6">
                <AppSelect
                  v-model="primaryPractitioner"
                  label="Primary Practitioner"
                  placeholder="Primary Practitioner"
                  :items="['David Robison', 'Patient Testing']"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="primaryCarePhysician"
                  label="Primary Care Physician"
                  placeholder="Primary Care Physician"
                />
                </VCol>

                <VCol cols="6">
                <AppTextField
                  v-model="guardian"
                  label="Guardian"
                  placeholder="Guardian"
                />
                </VCol>

                <VCol cols="6">
                <AppTextField
                  v-model="emergencyContactNumber"
                  pattern="^\(\d{3}\) \d{3}-\d{4}$"
                  :rules="[validUSAPhone]"
                  label="Emergency Contact Number"
                  max="14"
                  @input="(e) => updatePhone('emergencyContactNumber', e)" 
                  placeholder="i.e. (000) 000-0000"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="emergencyContactNameRelation"
                  label="Emergency Contact Name Relation"
                  placeholder="Emergency Contact Name Relation"
                />
                </VCol>

                <VCol cols="6">
                <AppSelect
                  v-model="patientMaritalStatus"
                  label="Patient Marital Status"
                  placeholder="Patient Marital Status"
                  :items="['Single', 'Married', 'Divorced', 'Seperated', 'Widow', 'Cohabitating', 'Partner', 'Other']"
                />
              </VCol>
              <VCol cols="6">
                <AppSelect
                  v-model="occupation"
                  label="Occupation"
                  placeholder="Occupation"
                  :items="['Occupation', 'Employed', 'UnEmployed', 'Full Time Student', 'Part Time Student', 'Retired']"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="referredBy"
                  label="Referred By"
                  placeholder="Referred By"
                />
                </VCol>

                <VCol cols="12">
                    <v-textarea
                  v-model="PatientNote"
                  label="PatientNotes"
                  rows="5"
                  placeholder="PatientNotes"
                />
                </VCol>
                <VCol cols="6">
                <VCheckbox
                  v-model="isportalAccess"
                  label="Access To Patient Portal"
                />
                </VCol>
                <VCol cols="6">
                <VCheckbox
                  v-model="status"
                  label="InActive"
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
