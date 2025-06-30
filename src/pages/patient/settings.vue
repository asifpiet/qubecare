<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Patient Settings View',
  },
})
import avatar1 from '@images/avatars/profile-5.webp';

import { usePatientStore } from '@/stores/patientStore';
const { currentUser, currentRole, logout } = useAuth()
const patientStore = usePatientStore()
patientStore.unloadPatient()
patientStore.getPatientMe(currentUser.value.id)
const isFormValid = ref(false)
const refForm = ref()
const avatarImage = ref();
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


const timezoneMap = [
  { title: 'EST', value: 'America/New_York' },
  { title: 'PST', value: 'America/Los_Angeles' },
  { title: 'CST', value: 'America/Chicago' },
  { title: 'MST', value: 'America/Denver' },
  { title: 'UTC', value: 'UTC' },
]

const profielImg = ref();
const id = ref(null);
const refInputEl = ref()
const accountData = {
  avatarImg: avatar1,
}
const accountDataLocal = ref(structuredClone(accountData))
const isNewPasswordVisible = ref(false)
const changeAvatar = async (event) => {
  const fileReader = new FileReader();
  const { files } = event.target; // Corrected file reference

  if (files && files.length) {
    const file = files[0];

    // Check if the file is a valid image (png, jpg, jpeg)
    const validTypes = ['image/png'];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a PNG.");
      return; // Stop further processing if the file type is not valid
    }

    avatarImage.value = file; // Assuming `avatarImage` is a ref
    console.log("Selected file:", file);

    // Read the file as a data URL (for preview)
    fileReader.readAsDataURL(file);
    fileReader.onload = async () => {
      if (typeof fileReader.result === 'string') {

        accountDataLocal.value.avatarImg = fileReader.result;
        patientStore.demographic.profilePicture = fileReader.result;
        console.log("Image preview URL:", fileReader.result);
        try {
          const formData = new FormData();
          formData.append('image', file); // Append the actual file (not base64 string)
          patientStore.changeAvatar(formData, currentUser.value.id);
        } catch (error) {
          console.error("Error updating profile image:", error);
        }
      }
    };

    // Handle fileReader errors
    fileReader.onerror = () => {
      console.error("Error reading file:", fileReader.error);
      alert("An error occurred while reading the file.");
    };
  }
};
const passwordRequirements = [
  'Minimum 8 characters long - the more, the better',
  'At least one lowercase character',
  'At least one number, symbol, or whitespace character',
]
const onSubmit = async () => {
  refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      await patientStore.updatePatientMe(currentUser.value.id)
    }
  })
}



const formattedPhone = (number) => {
  const cleaned = ('' + number).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return number;
};
// reset avatar image'
const resetAvatar = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg
  patientStore.demographic.profilePicture = accountData.avatarImg
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
    patientStore.demographic.preferredPhone = formattedValue;
  } else if (field === 'alternativePhone') {
    patientStore.demographic.alternativePhone = formattedValue;
  } else if (field === 'textmsgNumber') {
    patientStore.demographic.textmsgNumber = formattedValue;
  }
  else if (field === 'emergencyContactNumber') {
    patientStore.demographic.emergencyContactNumber = formattedValue;
  }
};
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar rounded size="100" class="me-6"
            :image="patientStore.demographic.profilePicture || accountDataLocal.avatarImg" />

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-4">
            <div class="d-flex flex-wrap gap-4">
              <VBtn color="primary" size="small" @click="refInputEl?.click()">
                <VIcon icon="tabler-cloud-upload" class="d-sm-none" />
                <span class="d-none d-sm-block">{{ $t('Upload new photo') }}</span>
              </VBtn>

              <input ref="refInputEl" type="file" name="file" accept=".jpeg,.png,.jpg,GIF" hidden @input="changeAvatar">

              <VBtn type="reset" size="small" color="secondary" variant="tonal" @click="resetAvatar">
                <span class="d-none d-sm-block">{{ $t('Reset') }}</span>
                <VIcon icon="tabler-refresh" class="d-sm-none" />
              </VBtn>
            </div>

            <p class="text-body-1 mb-0">
              {{ $t('Allowed Only PNG. Max size of 800K') }}

            </p>
          </form>
        </VCardText>

        <VCardText class="pt-2">
          <!-- 👉 Form -->
          <VForm class="mt-3" ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <!-- 👉 First Name -->
              <VCol md="6" cols="12">
                <AppTextField v-model="patientStore.demographic.firstName" :rules="[requiredValidator]"
                  :placeholder="$t('First Name')" :label="$t('First Name')" />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol md="6" cols="12">
                <AppTextField v-model="patientStore.demographic.lastName" :rules="[requiredValidator]"
                  :placeholder="$t('Last Name')" :label="$t('Last Name')" />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="12" md="6">
                <AppTextField v-model="patientStore.demographic.email" :rules="[requiredValidator]" :label="$t('Email')"
                  :placeholder="$t('Email')" type="email" />
              </VCol>

              <!-- 👉 Organization -->
              <!-- 👉 Phone -->
              <VCol cols="12" md="6">
                <AppTextField v-model="patientStore.demographic.preferredPhone" pattern="^\(\d{3}\) \d{3}-\d{4}$"
                  :rules="[requiredValidator, validUSAPhone]" :label="$t('Phone Number')" max="14"
                  @input="(e) => updatePhone('preferredPhone', e)" placeholder="i.e. (000) 000-0000" />
              </VCol>

              <VCol cols="6">
                <AppSelect v-model="patientStore.demographic.contactMethod" :rules="[requiredValidator]"
                  :label="$t('Contact Method')" :placeholder="$t('Contact Method')"
                  :items="['Pre Contact Method', 'Email', 'Phone', 'Email/Phone']" />
              </VCol>
              <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.dateOfBirth" type="date" :rules="[requiredValidator]"
                  :label="$t('Date Of Birth')" :placeholder="$t('Date Of Birth')" />
              </VCol>

              <!-- 👉 Role -->
              <VCol cols="6">
                <AppSelect v-model="patientStore.demographic.sexatBirth" :rules="[requiredValidator]"
                  :label="$t('Sex at Birth')" :placeholder="$t('Sex at Birth')" :items="['Male', 'Female', 'Other']" />
              </VCol>

              <VCol cols="12" md="6">
                <AppSelect v-model="patientStore.demographic.timezone" :label="$t('Timezone')"
                  :placeholder="$t('Timezone')" :rules="[requiredValidator]" :items="timezoneMap" item-title="title"
                  item-value="value" />
              </VCol>

              <VCol cols="6">
                <AppSelect v-model="patientStore.demographic.genderIdentity" :rules="[requiredValidator]"
                  :label="$t('Gender Identity')" :placeholder="$t('Gender Identity')" :items="['Choose Not to disclose',
                    'Male',
                    'Female',
                    'FTM(Female-to-male/Transgender Male/Trans Man)',
                    'MTF(Male-to-female/Transgender Female/Trans Women)',
                    'Genderqueer',
                    'Unknown'
                  ]" />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="patientStore.demographic.ageGroup" :rules="[requiredValidator]"
                  :label="$t('Age Group')" :placeholder="$t('AgeGroup')" :items="['Child', 'Adult']" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.alternativePhone" pattern="^\(\d{3}\) \d{3}-\d{4}$"
                  :rules="[validUSAPhone, requiredValidator]" :label="$t('Alternative Phone')" max="14"
                  @input="(e) => updatePhone('alternativePhone', e)" placeholder="i.e. (000) 000-0000" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.address" :rules="[requiredValidator]"
                  :label="$t('Address')" :placeholder="$t('Address')" />
              </VCol>
              <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.city" :rules="[requiredValidator]" :label="$t('City')"
                  :placeholder="$t('City')" />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="patientStore.demographic.state" :label="$t('State')" :placeholder="$t('State')"
                  :rules="[requiredValidator]" :items="states" item-title="name" item-value="abbreviation" />
              </VCol>
              <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.zipcode" type="number" :rules="[requiredValidator]"
                  :label="$t('Zipcode')" :placeholder="$t('Zipcode')" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.primaryCarePhysician"
                  :label="$t('Primary Care Physician')" :placeholder="$t('Primary Care Physician')"
                  :rules="[requiredValidator]" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.emergencyContactNumber"
                  pattern="^\(\d{3}\) \d{3}-\d{4}$" :rules="[validUSAPhone, requiredValidator]"
                  :label="$t('Emergency Contact Number')" max="14"
                  @input="(e) => updatePhone('emergencyContactNumber', e)" placeholder="i.e. (000) 000-0000" />
              </VCol>
              <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.emergencyContactNameRelation"
                  :label="$t('Emergency Contact Name Relation')" :placeholder="$t('Emergency Contact Name Relation')"
                  :rules="[requiredValidator]" />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="patientStore.demographic.race" :rules="[requiredValidator]"
                  :label="$t('Race (Optinal)')" :placeholder="$t('Race (Optinal)')"
                  :items="['American Indian or Alaska Native', 'Asian', 'Black or African Amercian', 'White', 'Hispanic or Latino', 'Native Hawaiian or Other Pacfic Islander', 'Unknown']" />
              </VCol>

              <VCol cols="6">
                <AppSelect v-model="patientStore.demographic.patientMaritalStatus" :label="$t('Patient Marital Status')"
                  :rules="[requiredValidator]" :placeholder="$t('Patient Marital Status')"
                  :items="['Single', 'Married', 'Divorced', 'Seperated', 'Widow', 'Cohabitating', 'Partner', 'Other']" />
              </VCol>

              <VCol cols="12">
                <v-textarea v-model="patientStore.demographic.patientNote" :rules="[requiredValidator]"
                  :label="$t('PatientNotes')" rows="5" :placeholder="$t('PatientNotes')" />
              </VCol>

              <VCol cols="12">{{ $t('Change Password') }} </VCol>


              <VCol cols="12" md="6">
                <!-- 👉 current password -->
                <AppTextField v-model="patientStore.demographic.password"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'tabler-eye' : 'tabler-eye-off '"
                  :label="$t('New Password')" autocomplete="on" placeholder="············"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible" />
              </VCol>





              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn type="submit">{{ $t('Update') }}</VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>


</template>
