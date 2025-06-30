<script setup>
import avatar1 from '@images/avatars/avatar-1.png';
import { useStore } from 'vuex';
const store = useStore()
const userData = useCookie('userData');
let affiliateId = userData.value?.id
const isLoading = ref(false)
const isFormValid = ref(false)
const refForm = ref()
const avatar = ref()
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
const refInputEl = ref()
const isportalAccess = ref(false)
const status = ref(false)
const isTonalSnackbarVisible = ref(false)
const practitionerOptions = ref([]);
const username = ref()
const password = ref()
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

onMounted(async () => {
  await store.dispatch('updateIsLoading', true)
  // const { data } = await useApi(createUrl(GET_USERS_LIST));  
  // Commit the fetched user data to Vuex 
  // store.commit('setUser', data.value.userList);
  const usersFromStore = store.getters.getUserList;
  console.log(usersFromStore)
  practitionerOptions.value = usersFromStore.map(user => ({
    ...user,
    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
  }));
  console.log("practitionerOptions", practitionerOptions.value)
  await store.dispatch('updateIsLoading', false)
})

const showEditData = computed((async) => {
  console.log("getEditPatientProfileTest", store.getters.getPatientPorfile);
  let patient = store.getters.getPatientPorfile;
  if (patient) {
    if (store.getters.getPatientPorfile.isportalAccess == 1) {
      isportalAccess.value = true;
    }
    firstName.value = store.getters.getPatientPorfile.firstName
    lastName.value = store.getters.getPatientPorfile.lastName
    email.value = patient.email
    dateOfBirth.value = patient.dateOfBirth
    sexatBirth.value = patient.sexatBirth
    preferredPhone.value = patient.preferredPhone

    // username.value = patient.username,
    password.value = patient.password,
      status.value = patient.status
  }



})

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
const file = ref(null);
const closeNavigationDrawer = () => {
  emit('customEvent', false)
}


const changeAvatar = async (event) => {
  const selectedFile = event.target.files[0];
  if (!selectedFile) {
    console.warn("No file selected.");
    return;
  }

  file.value = selectedFile;
  avatar.value = selectedFile;
  console.log("Selected file:", selectedFile);

  // Generate a preview for the selected file
  const fileReader = new FileReader();
  fileReader.onload = () => {
    if (typeof fileReader.result === 'string') {
      accountDataLocal.value.avatarImg = fileReader.result;
      avatar.value = accountDataLocal.value.avatarImg;
      console.log("Avatar image preview updated:", accountDataLocal.value.avatarImg);
    }
  };

  fileReader.readAsDataURL(selectedFile);

  // Proceed with the upload
  let pid = store.getters.getPatientPorfile?.patientId;
  if (!pid) {
    console.error("Patient ID not found in store.");
    return;
  }

  const formData = new FormData();
  formData.append('document', selectedFile);

  try {
    console.log("Uploading avatar...");
    await store.dispatch('updatePatientAvater', {
      formData,
      patientId: pid,
    });
    console.log("Avatar uploaded successfully.");
  } catch (error) {
    console.error("Failed to upload avatar:", error);
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

const saveAndClose = () => {
  onSubmit('saveClose')
  emit('update:isDrawerOpen', false)
}
const saveOnly = () => {
  onSubmit('save')
  emit('update:isDrawerOpen', true)
}
const onSubmit = async (trigger) => {
  isLoading.value = true
  refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      if (store.getters.getPatientPorfile.patient_id) {
        emit('patientData', {
          checkIsFormOpen: trigger,
          id: store.getters.getPatientPorfile.patient_id,
          firstName: firstName.value,
          lastName: lastName.value,
          fullName: firstName.value + ' ' + lastName.value,
          email: email.value,
          dob: dateOfBirth.value,
          gender: sexatBirth.value,
          preferredPhone: preferredPhone.value,
          // username:username.value,
          password: password.value,
          affiliate_id: affiliateId,
          isportalAccess: isportalAccess.value
        })
      } else {
        emit('patientData', {
          checkIsFormOpen: trigger,
          id: store.getters.getPatientPorfile.patient_id,
          firstName: firstName.value,
          lastName: lastName.value,
          fullName: firstName.value + ' ' + lastName.value,
          email: email.value,
          dob: dateOfBirth.value,
          sexatBirth: sexatBirth.value,
          preferredPhone: preferredPhone.value,
          // username:username.value,
          password: password.value,
          affiliate_id: affiliateId,
          isportalAccess: isportalAccess.value
        })
      }
      isTonalSnackbarVisible.value = true;
      isLoading.value = false;

    }
  })
  isLoading.value = false;
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


  <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
    <VRow>

      <!-- 👉 Full name -->
      <VCol cols="6">
        <AppTextField v-model="firstName" :rules="[requiredValidator]" :label="$t('First Name')"
          :placeholder="$t('First Name')" />
      </VCol>
      <VCol cols="6">
        <AppTextField v-model="lastName" :rules="[requiredValidator]" :label="$t('Last Name')"
          :placeholder="$t('Last Name')" />
      </VCol>

      <!-- 👉 Email -->
      <VCol cols="6">
        <AppTextField v-model="email" :rules="[emailValidator, requiredValidator]" :label="$t('Email')"
          :placeholder="$t('johndoe@email.com')" />
      </VCol>
      <VCol cols="6">
        <AppTextField v-model="dateOfBirth" type="date" :rules="[requiredValidator]" :label="$t('Date Of Birth')"
          :placeholder="$t('Date Of Birth')" />
      </VCol>

      <!-- 👉 Role -->
      <VCol cols="6">
        <AppSelect v-model="sexatBirth" :label="$t('Sex at Birth')" :placeholder="$t('Sex at Birth')"
          :rules="[requiredValidator]" :items="['Male', 'Female', 'Other']" />
      </VCol>

      <VCol cols="6">
        <AppTextField v-model="preferredPhone" pattern="^\(\d{3}\) \d{3}-\d{4}$"
          :rules="[requiredValidator, validUSAPhone]" :label="$t('Preferred Phone')" max="14"
          @input="(e) => updatePhone('preferredPhone', e)" placeholder="i.e. (000) 000-0000" />
      </VCol>
      <VCol cols="12">
        <AppTextField v-model="password" :label="$t('Password')" placeholder="Password" />
      </VCol>
      <VCol cols="12">
        <VCheckbox v-model="isportalAccess" :label="$t('Access To Patient Portal')" />
      </VCol>

      <!-- 👉 Submit and Cancel -->
      <VCol cols="12">
        <VBtn @click="saveAndClose" class="me-3">
          {{ $t('Save and Close') }}
        </VBtn>
        <VBtn @click="saveOnly" class="me-3">
          {{ $t('Save') }}
        </VBtn>
        <VBtn type="reset" variant="tonal" color="error" class="me-3 mt-1" @click="closeNavigationDrawer">

          {{ $t('Close') }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
