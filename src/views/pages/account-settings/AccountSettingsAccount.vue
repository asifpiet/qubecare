<script setup>
import { usePractitionerStore } from '@/stores/practitionerStore';
import avatar1 from '@images/avatars/profile-5.webp';
import { useStore } from 'vuex';

const practitionerStore = usePractitionerStore()
const { currentUser, currentRole } = useAuth()
const store = useStore()
const accessRights = ref();
const analytics = ref();
const replyToEmail = ref();
const chartCoSigner = ref();
const supervisor = ref();
const sendEmail = ref();
const notes = ref();
const copyDetailsFrom = ref();
const selectedTimezone = ref();
const status = ref();
const role_id = ref();
const userData = currentUser;
const accountData = {
  avatarImg: avatar1,
  firstName: 'john',
  lastName: 'Doe',
  email: 'johnDoe@example.com',
  phone: '+1 (917) 543-9876',
  address: '123 Main St, New York, NY 10001',
  state: 'New York',
  zip: '10001',
  country: 'USA',
  language: 'English',
  timezone: '(GMT-11:00) International Date Line West',
  currency: 'USD',
}
const profielImg = ref();
const refInputEl = ref()
const accountDataLocal = ref(structuredClone(accountData))
const slectFile = ref(null)
const isAMPM = ref();
// const resetForm = () => {
//   accountDataLocal.value = structuredClone(accountData)
// }
const timezone1 = ref([]);
const username = ref(null)
const start_time = ref();
const end_time = ref();
const isCurrentPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const currentPassword = ref('')
const adminPassword = ref('')

console.log("currentUser", currentUser.value.id)
const timezoneMap = [
  { title: 'EST', value: 'America/New_York' },
  { title: 'PST', value: 'America/Los_Angeles' },
  { title: 'CST', value: 'America/Chicago' },
  { title: 'MST', value: 'America/Denver' },
  { title: 'UTC', value: 'UTC' },
]


const changeAvatar = (event) => {
  const fileReader = new FileReader();
  const { files } = event.target; // `file.target` was incorrect; should be `event.target`

  if (files && files.length) {
    const file = files[0];
    if (file) {
      slectFile.value = file
    }

    // Check if the file is a valid image (png, jpg, jpeg)
    // const validTypes = ['image/png'];
    // if (!validTypes.includes(file.type)) {
    //   alert("Please upload only PNG file.");
    //   return; // Stop further processing if the file type is not valid
    // }

    // Read the file as a data URL if the type is valid
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        accountDataLocal.value.avatarImg = fileReader.result;
        console.log("Image preview URL:", accountDataLocal.value.avatarImg);
      }
    };
  }
};

const passwordRequirements = [
  'Minimum 8 characters long - the more, the better',
  'At least one lowercase character',
  'At least one number, symbol, or whitespace character',
]

const getLoginUser = async () => {




  await practitionerStore.getPractitionerProfile(currentUser.value.id)
  let profile = practitionerStore.practitionerProfile;
  accountDataLocal.value.avatarImg = '';
  userData.value.avatar = '';
  if (profile.profile_image_url) {
    accountDataLocal.value.avatarImg = profile.profile_image_url;
    userData.value.avatar = profile.profile_image_url;

  }
  // accountDataLocal.value.avatarImg = res.data.profile_image_url;
  accountDataLocal.value.firstName = profile.firstName;
  accountDataLocal.value.lastName = profile.lastName;
  accountDataLocal.value.email = profile.emailAddress;
  accountDataLocal.value.phone = formattedPhone(profile.textMessageNumber);
  username.value = profile.username;
  start_time.value = profile.start_time;
  end_time.value = profile.end_time;
  accessRights.value = profile.accessRights;
  analytics.value = profile.analytics;
  replyToEmail.value = profile.replyToEmail;
  chartCoSigner.value = profile.chartCoSigner;
  supervisor.value = profile.supervisor;
  sendEmail.value = profile.sendEmail;
  role_id.value = profile.role_id;
  notes.value = profile.notes;
  copyDetailsFrom.value = profile.copyDetailsFrom;
  selectedTimezone.value = profile.timezone;
  status.value = profile.status;




}
const onSubmit = async () => {
  if (accountDataLocal.value.avatarImg) {
    profielImg.value = accountDataLocal.value.avatarImg;
  }

  await practitionerStore.updatePractitionerProfile(
    {
      avatarImg: slectFile.value,
      firstName: accountDataLocal.value.firstName,
      lastName: accountDataLocal.value.lastName,
      emailAddress: accountDataLocal.value.email,
      textMessageNumber: accountDataLocal.value.phone,
      timezone: selectedTimezone.value,
      newUserPassword: currentPassword.value,
      adminPassword: adminPassword.value,
      role_id: role_id.value,
      username: username.value,
    },
    currentUser.value.id
  )



}

getLoginUser();

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
}

const time = [
  '12:00 AM',
  '12:30 AM',
  '01:00 AM',
  '01:30 AM',
  '02:00 AM',
  '02:30 AM',
  '03:00 AM',
  '03:30 AM',
  '04:00 AM',
  '04:30 AM',
  '05:00 AM',
  '05:30 AM',
]


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
    accountDataLocal.value.phone = formattedValue;
  }
};
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar rounded size="100" class="me-6" :image="accountDataLocal.avatarImg" />

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-4">
            <div class="d-flex flex-wrap gap-4">
              <VBtn color="primary" size="small" @click="refInputEl?.click()">
                <VIcon icon="tabler-cloud-upload" class="d-sm-none" />
                <span class="d-none d-sm-block">{{ $t('Upload new photo') }}</span>
              </VBtn>

              <input ref="refInputEl" type="file" name="file" accept=".jpeg,.png,.jpg,GIF" hidden @input="changeAvatar">

              <!-- <VBtn type="reset" size="small" color="secondary" variant="tonal" @click="resetAvatar">
                <span class="d-none d-sm-block">{{ $t('Reset') }}</span>
                <VIcon icon="tabler-refresh" class="d-sm-none" />
              </VBtn> -->
            </div>

            <p class="text-body-1 mb-0">
              {{ $t('Allowed Only PNG. Max size of 800K') }}

            </p>
          </form>
        </VCardText>

        <VCardText class="pt-2">
          <!-- 👉 Form -->
          <VForm class="mt-3">
            <VRow>
              <!-- 👉 First Name -->
              <VCol md="6" cols="12">
                <AppTextField v-model="accountDataLocal.firstName" :placeholder="$t('First Name')"
                  :label="$t('First Name')" />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol md="6" cols="12">
                <AppTextField v-model="accountDataLocal.lastName" :placeholder="$t('Last Name')"
                  :label="$t('Last Name')" />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="12" md="6">
                <AppTextField v-model="accountDataLocal.email" :label="$t('Email')" :placeholder="$t('Email')"
                  type="email" />
              </VCol>

              <!-- 👉 Organization -->
              <!-- 👉 Phone -->
              <VCol cols="12" md="6">
                <AppTextField v-model="accountDataLocal.phone" pattern="^\(\d{3}\) \d{3}-\d{4}$"
                  :rules="[requiredValidator, validUSAPhone]" :label="$t('Phone Number')" max="14"
                  @input="(e) => updatePhone('preferredPhone', e)" placeholder="i.e. (000) 000-0000" />
              </VCol>

              <VCol cols="12" md="6">
                <AppSelect v-model="selectedTimezone" :label="$t('Timezone')" :placeholder="$t('Timezone')"
                  :rules="[requiredValidator]" :items="timezoneMap" item-title="title" item-value="value" />
              </VCol>

              <VCol cols="12"> {{ $t('Change Password') }} </VCol>
              <VCol md="6" cols="12">
                <AppTextField v-model="username" :placeholder="$t('Username')" :label="$t('Username')" readonly />
              </VCol>
              <VCol cols="12" md="6">
                <!-- 👉 current password -->
                <AppTextField v-model="currentPassword" :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCurrentPasswordVisible ? 'tabler-eye' : 'tabler-eye-off '"
                  :label="$t('Password')" autocomplete="on" placeholder="············"
                  @click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible" />
              </VCol>




              <VCol cols="12" md="6">
                <!-- 👉 new password -->
                <AppTextField v-model="adminPassword" :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'tabler-eye' : 'tabler-eye-off '"
                  :label="$t('Admin Password')" autocomplete="on" placeholder="············"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible" />
              </VCol>


              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn @click="onSubmit"> {{ $t('Update') }}</VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>


</template>
