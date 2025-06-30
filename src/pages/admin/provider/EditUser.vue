<script setup>

import { useRoleStore } from '@/stores/roleStore';
import { useUserStore } from '@/stores/userStore';
import { statesList } from '@/utils/states';
import avatar1 from '@images/avatars/avatar-1.png';
import { useStore } from 'vuex';
const store = useStore()

const roleStore = useRoleStore()
const userStore = useUserStore()
const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
  editUser: {
    type: Object,
    required: true,
  }

})
const states = statesList;
const refInputEl = ref()
const refVForm = ref(null)
const slectFile = ref(null)
const city = ref()
const state = ref()
const zipcode = ref()
const gender = ref()
const dob = ref()
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const textMessageNumber = ref('');
const accessRights = ref({
  admin: true,
  practitioner: false,
  patientPortal: false,
});
const chartCoSigner = ref(null);
const replyToEmail = ref(null);
const supervisor = ref(null);
const copyDetailsFrom = ref(null);
const analytics = ref(null);
const username = ref('');
const adminPassword = ref('');
const newUserPassword = ref('');
const isPasswordVisible = ref(false)
const sendEmail = ref(false);
const coSignerOptions = ref([]);
const emailOptions = ref([]);
const supervisorOptions = ref([]);
const copyOptions = ref([]);
const role = ref(null);
const roleList = ref([]);
const userType = ref();
const profielImg = ref();
const accountData = {
  avatarImg: avatar1,
}
const accountDataLocal = ref(structuredClone(accountData))
await roleStore.getRoles()

const getPractionerUser = computed(async () => {
  console.log('>>', props.userData)
  const practitionerUsers = props.userData;
  console.log(practitionerUsers);
  if (props.userData) {
    coSignerOptions.value = practitionerUsers // Replace with actual options    
    supervisorOptions.value = practitionerUsers // Replace with actual options  
    copyOptions.value = practitionerUsers // Replace with actual options  
  }
})
// Options for selects  

const analyticOptions = [
  { value: 'None', text: 'None' },
  { value: 'All Reports', text: 'All Reports' },
]; // Options for the Analytic Access dropdown  

// Validation rules  
const requiredValidator = (value) => !!value || 'This field is required.';
const emailValidator = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'A valid email address is required.';
const emit = defineEmits(['submit'])
const changeAvatar = (event) => {
  const fileReader = new FileReader();
  const { files } = event.target; // `file.target` was incorrect; should be `event.target`

  if (files && files.length) {
    const file = files[0];
    if (file) {
      slectFile.value = file
    }
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        accountDataLocal.value.avatarImg = fileReader.result;
        profielImg.value = fileReader.result;
        console.log("Image preview URL:", accountDataLocal.value.avatarImg);
      }
    };
  }
};
const submitForm = async () => {
  const { valid } = await refVForm.value.validate()
  console.log(valid)
  if (valid) {
    await userStore.saveUser(
      {
        avatarImg: slectFile.value,
        firstName: firstName.value,
        lastName: lastName.value,
        emailAddress: email.value,
        dateOfBirth: dob.value,
        city: city.value,
        state: state.value,
        zipcode: zipcode.value,
        gender: gender.value,
        textMessageNumber: textMessageNumber.value,
        accessRights: accessRights.value,
        chartCoSigner: chartCoSigner.value,
        replyToEmail: replyToEmail.value,
        supervisor: supervisor.value,
        copyDetailsFrom: copyDetailsFrom.value,
        sendEmail: sendEmail.value,
        analytics: analytics.value,
        newUserPassword: newUserPassword.value,
        adminPassword: adminPassword.value,
        username: username.value,
        role_id: role.value,
        type: userType.value
      },
      props.editUser.id
    )

    resetForm();
    emit('submit', 'success')
  } else {
    console.error('Form is invalid');
  }
};

const cancelForm = () => {
  resetForm();
  console.log('Form canceled');
};

const getCurrentDate = () => {
  const today = new Date();
  console.log("today", today);
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;
  return `${month}-${day}-${year}`;
};

const resetAvatar = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg
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
onMounted(async () => {
  firstName.value = props.editUser.firstName;
  lastName.value = props.editUser.lastName;
  email.value = props.editUser.emailAddress;
  dob.value = props.editUser.dateOfBirth;
  city.value = props.editUser.city;
  state.value = props.editUser.state;
  zipcode.value = props.editUser.zipcode;
  gender.value = props.editUser.gender;
  textMessageNumber.value = props.editUser.textMessageNumber ? formatPhoneNumber(props.editUser.textMessageNumber) : '';
  accessRights.value = {
    admin: props.editUser.accessRights.admin,
    practitioner: props.editUser.accessRights.practitioner,
    patientPortal: props.editUser.accessRights.patientPortal,
  };
  chartCoSigner.value = props.editUser.chartCoSigner;
  replyToEmail.value = props.editUser.replyToEmail;
  supervisor.value = props.editUser.supervisor;
  copyDetailsFrom.value = props.editUser.copyDetailsFrom;
  analytics.value = props.editUser.analytics;
  sendEmail.value = props.editUser.sendEmail;
  role.value = props.editUser.role_id
  username.value = props.editUser.username;
  userType.value = props.editUser.type;
  newUserPassword.value = '';
  adminPassword.value = '';
  accountDataLocal.value.avatarImg = props.editUser.avatarImg
  roleList.value = roleStore.roles
})
const updatePhone = (field, event) => {
  const formattedValue = formatPhoneNumber(event.target.value);
  if (field === 'phoneNumber') {
    textMessageNumber.value = formattedValue;
  } else {

  }
};
const resetForm = () => {
  firstName.value = '';
  lastName.value = '';
  email.value = '';
  textMessageNumber.value = '';
  accessRights.value = {
    admin: false,
    practitioner: false,
    patientPortal: false,
  };
  chartCoSigner.value = null;
  replyToEmail.value = null;
  supervisor.value = null;
  copyDetailsFrom.value = null;
  username.value = '';
  newUserPassword.value = '';
  adminPassword.value = '';
  analytics.value = null;
  sendEmail.value = false;
};


</script>
<template>
  <!-- <VCard title=""> -->
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

          <VBtn type="reset" size="small" color="secondary" variant="tonal" @click="resetAvatar">
            <span class="d-none d-sm-block"> {{ $t('Reset') }}</span>
            <VIcon icon="tabler-refresh" class="d-sm-none" />
          </VBtn>
        </div>

        <p class="text-body-1 mb-0">
          {{ $t('Allowed Only PNG. Max size of 800K') }}

        </p>
      </form>
    </VCardText>
    <VCardText>
      <VForm class="mt-2" ref="refVForm">
        <VRow>

          <VCol cols="6">
            <AppTextField v-model="firstName" :label="$t('First Name')" :placeholder="$t('First Name')"
              :rules="[requiredValidator]" />
          </VCol>

          <VCol cols="6">
            <AppTextField v-model="lastName" :label="$t('Last Name')" :placeholder="$t('Last Name')"
              :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="6">
            <AppTextField type="date" v-model="dob" :max="getCurrentDate()" :label="$t('Date of Birth')"
              :rules="[requiredValidator]" />
          </VCol>

          <VCol cols="6">
            <AppTextField v-model="email" :label="$t('Email Address')" :placeholder="$t('Email Address')"
              :rules="[emailValidator]" />
          </VCol>

          <VCol cols="4">
            <AppTextField v-model="city" :label="$t('City')" :placeholder="$t('City')" :rules="[requiredValidator]" />
          </VCol>


          <VCol cols="4">
            <AppSelect v-model="state" :label="$t('State')" :placeholder="$t('State')" :rules="[requiredValidator]"
              :items="states" item-title="name" item-value="abbreviation" />
          </VCol>

          <VCol cols="4">
            <AppTextField v-model="zipcode" :label="$t('Zipcode')" :placeholder="$t('Zipcode')"
              :rules="[requiredValidator]" />
          </VCol>


          <VCol cols="6">
            <AppTextField v-model="textMessageNumber" pattern="^\(\d{3}\) \d{3}-\d{4}$"
              :rules="[requiredValidator, validUSAPhone]" :label="$t('Text Message Number')"
              :hint="$t('For Password Reset')" max="14" @input="(e) => updatePhone('phoneNumber', e)"
              placeholder="i.e. (000) 000-0000" />


          </VCol>

          <VCol cols="6">
            <AppSelect v-model="gender" :label="$t('Gender')" :placeholder="$t('Gender')" :rules="[requiredValidator]"
              :items="['Male', 'Female']" />
          </VCol>
          <VCol cols="12" md="6">
            <AppTextField v-model="username" :label="$t('Username')" :placeholder="$t('Username')" readonly />
          </VCol>
          <VCol cols="12" md="6">
            <AppTextField v-model="newUserPassword" :label="$t('Password')" placeholder="············"
              :type="isPasswordVisible ? 'text' : 'password'"
              :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
              @click:append-inner="isPasswordVisible = !isPasswordVisible" />
          </VCol>
          <VCol cols="12" md="12">
            <AppTextField v-model="adminPassword" :label="$t('Admin Password')" placeholder="············"
              :type="isPasswordVisible ? 'text' : 'password'"
              :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="6">

            <AppSelect v-model="userType" :label="$t('User Type')"
              :items="[{ title: 'Admin', value: 'admin' }, { title: 'Practitioner', value: 'practitioner' }]"
              item-title="title" item-value="value" :placeholder="$t('Select User Type')"
              :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="6">
            <AppSelect v-model="role" :label="$t('Role')" :items="roleList" item-title="name" item-value="id"
              :placeholder="$t('Role')" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="6" style="display: none;">
            <h4> {{ $t('Access Rights') }}</h4>
            <VRow>
              <VCol cols="6">
                <VCheckbox v-model="accessRights.admin" :label="$t('ADMIN')" />
              </VCol>
              <VCol cols="6">
                <VCheckbox v-model="accessRights.practitioner" :label="$t('PRACTITIONER')" />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <VCheckbox v-model="accessRights.patientPortal" :label="$t('Patient Portal Messaging')" />
              </VCol>
            </VRow>
          </VCol>


          <VCol cols="6">
            <AppSelect v-model="analytics" :label="$t('ANALYTIC')" :items="analyticOptions" item-title="text"
              item-value="value" :placeholder="$t('Select Analytic Level')" />
          </VCol>



          <VCol cols="6" v-if="getPractionerUser" style="display: none;">
            <AppSelect v-model="chartCoSigner" :label="$t('Chart Co - Signer')" :items="coSignerOptions"
              item-title="fullName" item-value="id" />
          </VCol>

          <VCol cols="6">
            <AppTextField v-model="replyToEmail" :label="$t('Reply To Email')" :rules="[emailValidator]" />
          </VCol>

          <VCol cols="6" style="display: none;">
            <AppSelect v-model="supervisor" :label="$t('Supervisor')" :items="supervisorOptions" item-title="fullName"
              item-value="id" />
          </VCol>

          <VCol cols="6" style="display: none;">
            <AppSelect v-model="copyDetailsFrom" :label="$t('Copy Details From')" :items="copyOptions"
              item-title="fullName" item-value="id" />
          </VCol>

          <VCol cols="12">
            <VCheckbox v-model="sendEmail" :label="$t('Send email to notify the new user')" />
          </VCol>

          <VCol cols="12">
            <VBtn color="primary" @click="submitForm" class="mr-2">{{ $t('Submit') }}</VBtn>
            <VBtn color="secondary" @click="cancelForm">{{ $t('Cancel') }}</VBtn>
          </VCol>
        </VRow>

        <div class="notes">
          <p> {{ $t('Notes') }}:</p>
          <p>{{ $t('Passwords can be set/reset by email or text on the Login page. An admin will have access to patient consult records.') }}
          </p>
        </div>
      </VForm>
    </VCardText>
  <!-- </VCard> -->
</template>
<style scoped>
.notes {
  margin-top: 20px;
  font-size: 0.9em;
  color: #555;
  background: #eee;
  padding: 10px;
}
</style>
