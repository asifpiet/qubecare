<script setup>
definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})
// import axios from '@axios';
import {
  emailValidator,
  requiredValidator,
  validUSAPhone
} from '@core/utils/validators';

import { useAuth } from '@/composables/useAuth';
import { hideLoader, showLoader } from '@/utils/showLoader';
import { onBeforeMount, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { VDateInput } from 'vuetify/lib/labs/components.mjs';
import { useStore } from 'vuex';
const store = useStore()
const router = useRouter()
const route = useRoute()
const ability = useAbility()
const isMobile = ref(window.innerWidth <= 768);
const { currentRole, authService } = useAuth()
const isPasswordVisible = ref(false)
const email = ref()
const password = ref()
const isTopLoadingVisible = ref(false);
const isDisabled = ref(true)
const isDialogVisible = ref(false)
const refVForm = ref()
const name = ref()
const last_name = ref()
const termAndCondtiton = ref()
const receviceSMs = ref()
const dob = ref()
const phone = ref()
const isPolicy = ref(false);
const prescreptionRequired = ref(false)
const inavlid = ref(false);
const InvalidCredential = ref()
const errors = ref({
  name: undefined,
  last_name: undefined,
  phone_no: undefined,
  email: undefined,
  password: undefined,
  dob: undefined,
  termAndCondtiton: undefined,
  receviceSMs: undefined,
  isPolicy: undefined,
})

const seetingPlanLogo = ref();
const settingSite = ref();
const gender = ref(null)
const genders = ref([
  { name: 'Male', abbreviation: 'Male' },
  { name: 'Female', abbreviation: 'Female' },
  { name: 'Other', abbreviation: 'Other' },
]);

watch(isPolicy, (newVal) => {
  isTopLoadingVisible.value = false;
  // window.addEventListener('click', closeDialogOnOutsideClick);
});
const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};
// const onSubmit = async () => {
//   refVForm.value?.validate().then(async ({ valid: isValid }) => {
//     console.log('isValid ', isValid)
//     if (isValid) {
//       console.log('Age', calculateAge(dob.value))
//       store.dispatch('updateIsLoading', true)
//       if (calculateAge(dob.value) >= 18) {
//         store.dispatch('updateIsTonalSnackbar', false)
//         store.dispatch('updateErrorMessage', null)
//         await register()
//       } else {
//         store.dispatch('updateIsLoading', false)
//         store.dispatch('updateIsTonalSnackbar', true)
//         store.dispatch('updateErrorMessage', 'You must be 18+')
//       }

//     }

//   })
// }
const closeDialogOnOutsideClick = (event) => {
  // const dialogElement = ref.myDialog.$el;
  // if (!dialogElement.contains(event.target)) {
  //   isDialogVisible.value = false;
    // window.removeEventListener('click', closeDialogOnOutsideClick);
  // }
};
onBeforeMount(() => {
    

})
onMounted(async () => {
  window.addEventListener('resize', checkIfMobile);
})
onUnmounted(() => {
  // window.removeEventListener('click', closeDialogOnOutsideClick);
});

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


const register = async () => {
  inavlid.value = false;
  InvalidCredential.value = null;
  const parts = String(dob.value).split(" ");
  const monthMap = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12"
  };

  // Extract the year, month, and day, and map the month to a number
  const year = parts[3];
  const month = monthMap[parts[1]];
  const day = parts[2].padStart(2, '0');  // Ensure day is two digits

  // Combine into desired format
  const formattedDate = `${year}-${month}-${day}`;
  let dataForm = {
      first_name: name.value,
      last_name: last_name.value,
      preferredPhone: phone.value,
      email: email.value,
      dob: formattedDate,
      gender: gender.value.toLowerCase(),
      password: password.value
  }
  showLoader()
  try {
    await authService.value.register(dataForm);
    await router.push({ name: 'partner-dashboard' });
  } catch (e) {
    console.error('Error Response:', e.response);

    if (e.response?.status === 422) {
      const errorMessages = e.response?._data?.error;
      if (errorMessages) {
        const formattedMessages = Object.values(errorMessages)
          .flat()
          .join(' ');
        addAlert(formattedMessages, 'error');
      } else {
        addAlert('Email or phone number already exist.', 'error');
      }
    } else {
      addAlert(e.response?.data?.message ?? e.message, 'error');
    }
  }


  hideLoader()
};

// const register = async () => {
//   inavlid.value = false;
//   InvalidCredential.value = null;
//   const parts = String(dob.value).split(" ");
//   const monthMap = {
//     Jan: "01",
//     Feb: "02",
//     Mar: "03",
//     Apr: "04",
//     May: "05",
//     Jun: "06",
//     Jul: "07",
//     Aug: "08",
//     Sep: "09",
//     Oct: "10",
//     Nov: "11",
//     Dec: "12"
//   };

//   // Extract the year, month, and day, and map the month to a number
//   const year = parts[3];
//   const month = monthMap[parts[1]];
//   const day = parts[2].padStart(2, '0');  // Ensure day is two digits

//   // Combine into desired format
//   const formattedDate = `${year}-${month}-${day}`;
//   console.log("Gender", gender.value, dob.value);

//   try {
//     const res = await $api(REGISTER_PATIENT, {
//       method: 'POST',
//       body: {
//         first_name: name.value,
//         last_name: last_name.value,
//         preferredPhone: phone.value,
//         email: email.value,
//         dob: formattedDate,
//         gender: gender.value.toLowerCase(),
//         password: password.value
//         },
//       onResponseError({ response }) {
//         store.dispatch('updateIsLoading', false);
//         console.log('Response Error', response);
//         if (response._data.error) {
//           inavlid.value = true;
//           InvalidCredential.value = Object.values(response._data.error).flat().join(", ");
//         }
//       }
//     });

//     console.log("Register", res);
//     if(res && res.error){
//         inavlid.value = true;
//         store.dispatch('updateIsTonalSnackbar', true);
//         store.dispatch('updateErrorMessage', res.error);
//         store.dispatch('updateIsLoading', false);
//     }
//     else {
//       const { accessToken, userData, userAbilityRules } = res;
//       const userAbilities = transformPermissions(permissions.value);
//       console.log('userAbilities login', userAbilities);

//       localStorage.setItem('userAbilityRules', JSON.stringify(userAbilities));
//       useCookie('userAbilityRules').value = userAbilities;
//       ability.update(userAbilities);
//       useCookie('userData').value = userData;
//       useCookie('accessToken').value = accessToken;
//       localStorage.setItem('LoginUserId', userData.id)
//       localStorage.setItem('LoginUserUUId', userData.uuid)
//       localStorage.setItem('providerId', '9d4523ee-9e73-4cf0-a4cf-32d8a579e8b7')
//       store.dispatch("savePartnerPorfile", res.userData);
//       store.dispatch('updateIsLoading', false);

//       store.dispatch('updateSuccessIsTonalSnackbar', true);
//       store.dispatch('updateErrorMessage', 'Registered Successfully!');

//         await nextTick(() => {
//                router.replace(route.query.to ? String(route.query.to) : '/patient/dashboard')
//         })
        
//     }
//   } catch (e) {
//     console.log('Error', e);
//     inavlid.value = true;
//     store.dispatch('updateIsTonalSnackbar', true);
//     store.dispatch('updateErrorMessage', 'Something went wrong!');
    
//     if (e._data?.error) {
//       inavlid.value = true;
//       InvalidCredential.value = Object.values(e._data.error).flat().join(", ");
//     }
    
//     store.dispatch("updateErrors", e?._data?.error);
//     store.dispatch("updateIsLoading", false);
//   }
// };

const onSubmit = async () => {
  refVForm.value?.validate().then(async ({ valid: isValid }) => {
    console.log('isValid ', isValid)
    if (isValid) {
      console.log('Age', calculateAge(dob.value))
      if (calculateAge(dob.value) >= 18) {
        await register()
      } else {
        addAlert('You must be 18+', 'error')
      }

    }

  })
}


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
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};


</script>

<template>

    <VRow
    style="min-height: 101.7dvh; max-height: 101.7dvh; margin: 0px;"
    :style="isMobile ? { marginTop: '90px' } : { marginTop: '0px' }"
        
    >
        <!-- <VCol cols="12" md="6" class="bg-custom col-order-1"
            :class="isMobile ? '' : 'auth-wrapper d-flex align-center justify-center pa-4'">
            <DefinedSteps></DefinedSteps>
        </VCol> -->
      <VCol cols="12" md="12" class="bg-custom-color"
            :class="isMobile ? '' : 'd-flex align-center justify-center pa-4'"
        >
        <VCard  class="auth-card pa-2 rounded-5" style="" :class="isMobile ? '' : 'card-wid'">
          <VCardItem class="py-2">
              <h4 class="text-h4 mb-1 text-left mb-0">
                Register
              </h4>
            <VDialog v-model="store.getters.getIsLoading" width="110" height="150" color="primary">

              <VCardText class="" style="color: white !important;">
                <div class="demo-space-x">
                  <VProgressCircular :size="40" color="primary" indeterminate />
                </div>
              </VCardText>

            </VDialog>
            <VSnackbar v-model="store.getters.getIsTonalSnackbarVisible" :timeout="5000" location="top end" variant="flat"
              color="red">
              {{ store.getters.getErrorMessage }}
            </VSnackbar>
          </VCardItem>
          <VCardText>

            <VForm ref="refVForm" @submit.prevent="onSubmit">
              <VRow>
                <VCol cols="12" md="12">
                  <VTextField v-model="email" label="Email Address" type="email" :rules="[requiredValidator, emailValidator]"
                    :error-messages="errors.email" density="comfortable" />
                </VCol>
                <VCol cols="12">
                  <VTextField v-model="password" label="Password" placeholder="············" 
                  :rules="[requiredValidator]" :type="isPasswordVisible ? 'text' : 'password'" 
                  :append-inner-icon="isPasswordVisible ? 'bx-show' : 'bx-hide'"  :error-messages="errors.password"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="name" label="First Name" type="text" :rules="[requiredValidator]"
                    :error-messages="errors.name" density="comfortable" />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="last_name" label="Last Name" type="text" :rules="[requiredValidator]"
                    :error-messages="errors.last_name" density="comfortable" />
                </VCol>
              </VRow>
              <VRow>
                <VCol cols="12" md="4">
                  <v-select v-model="gender" label="Gender" :items="genders" item-title="name" item-value="abbreviation"
                    :rules="[requiredValidator]" :error-messages="errors.gender" density="comfortable">
                  </v-select>
                </VCol>
                <VCol cols="12" md="4">
                  <VTextField v-model="phone" label="Phone Number" pattern="^\(\d{3}\) \d{3}-\d{4}$"
                    :rules="[requiredValidator, validUSAPhone]" :error-messages="errors.phone_no"
                    placeholder="i.e. (000) 000-0000" @input="formatPhoneNumber" max="14" density="comfortable" />
                </VCol>
                <VCol cols="12" md="4">
                    <v-date-input
                      v-model="dob"
                      :max="getCurrentDate()"
                      :rules="[requiredValidator]" :error-messages="errors.dob"
                      label="Date of Birth"
                      placeholder="Date of Birth"
                      prepend-icon=""
                      variant="outlined"
                      density="comfortable"
                      ok-text="OK"
                      cancel-text="Cancel"
                    ></v-date-input>
                </VCol>

              </VRow>

              <VRow>
                <VCol cols="v-col" class="pb-0 pt-0">
                  <VCheckbox v-model="termAndCondtiton" :error-messages="errors.termAndCondtiton"
                    :rules="[requiredValidator]" label="I agree to the Terms and Conditions" />
                  <VCheckbox v-model="receviceSMs" :error-messages="errors.receviceSMs" :rules="[requiredValidator]"
                    label="I agree to receive SMS and Email Notifications." />
                  <div class="d-flex align-items-center">
                    <div>
                      <VCheckbox v-model="isPolicy" ></VCheckbox>
                    </div>
                    <div>
                      <span class="text-muted" style="cursor: pointer;position: relative;">
                        I agree to the <a href="#">Privacy Policy</a>
                      </span>
                    </div>
                  </div>

                </VCol>
                
                <VCol class="text-center" cols="12">
                  <p class="error-message" v-if="inavlid">{{ InvalidCredential }}</p>
                  <VBtn type="submit" class="text-center px-5" block>
                    Register
                  </VBtn>
                </VCol>

                <VCol cols="12" class="text-right">
                  <span>Already have account? </span>
                  <router-link :to="'/patient/login'" class="text-primary underline">Sign In</router-link>

                </VCol>
              </VRow>


              <VRow>
                <VDialog v-model="isDialogVisible" ref="myDialog" persistent width="500">
                  
                  <VCard title="">
                    <v-row>
                      <v-col class="pb-2">
                        <VCardText class="pb-0">
                          <h3>Policies</h3>
                        </VCardText>
                      </v-col>
                      <v-col class="text-right pt-0">
                        <v-btn icon color="transparent" small @click="[isDialogVisible = false, isPolicy = false]">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>

                      </v-col>
                    </v-row>
                    <VCardText class="pt-0">
                      This Privacy Policy describes how {{ settingSite.domain_name }}, Inc. collects
                      and
                      uses Personal Data
                      about
                      you through the
                      use of our Website, mobile applications, and through email, text, and other
                      electronic communications
                      between you and {{ settingSite.domain_name }}, Inc.
                    </VCardText>

                    <VCardText class="text-end pt-1">
                      <VBtn @click="[isDialogVisible = false, isPolicy = true, isDisabled = false]">
                        I accept
                      </VBtn>
                    </VCardText>
                  </VCard>
                </VDialog>
              </VRow>
            </VForm>

          </VCardText>
        </VCard>
      </VCol>
    </VRow>
</template>
<style scoped>
@media only screen and (max-width: 768px) {
  .second-card{
    margin-top: 20px;
  }
  .card-wid {
    max-width: 500px !important;
    min-width: auto !important;
  }

  .col-order-1 {
    order: 2;
  }

  .col-order-2 {
    order: 1;
  }
}

@media only screen and (min-width: 769px) {
  .col-order-1 {
    order: 1;
  }

  .col-order-2 {
    order: 2;
  }
}

.container-padding{
  padding: 0px;
}
.card-margin{
    margin: 30px;
  }

.total-font {
  font-size: 20px;
  margin-bottom: 5px;
}

.bg-custom {
  background: #F3F3F3;
}

.bg-custom-color {
  background: #E0F0E3;
}

.bg-white bg-change-bk .current-plan {
  border: 2px solid rgb(var(--v-theme-primary));
}

.cut-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: line-through;
  text-decoration-color: red;
  text-decoration-thickness: 1px;
}

.plan-card {
  margin: 0rem;
  margin-bottom: 0;
}

.card-wid {
  min-width: 500px;
}

.layout-wrapper {
  justify-content: center;
}

.error-message {
  color: #ff2f2f;
  font-size: 15px;
}
</style>
<style>
.bg-custom {
    background: #F3F3F3;
}

.bg-custom-color {
    background: #E0F0E3;
}

.total-font {
  font-size: 20px;
  margin-bottom: 5px;
}

.current-plan {
  border: 2px solid rgb(var(--v-theme-primary));
}

.cut-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: line-through;
  text-decoration-color: red;
  text-decoration-thickness: 1px;
}

.plan-card {
  margin: 9rem;
  margin-bottom: 0;
}

.v-card.v-card--flat.v-theme--light.v-card--density-default.v-card--variant-elevated.text-center.search-header.rounded-0 {
  block-size: 357px;
  inset-block-start: -185px;
}

body {
  display: block !important;
}

a.nav-link.fw-medium {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}

.light-style .layout-navbar .menu-text {
  color: #5d596c !important;
}

span.app-brand-text.demo.menu-text.fw-bold.ms-2.ps-1 {
  color: #5d596c !important;
}

.navbar.landing-navbar {
  border-color: rgba(255, 255, 255, 68%) !important;
  background: white;
  margin: 0;
  border-radius: 0;
  box-shadow: 0px 10px 10px #00000029;
}

.landing-footer .footer-top {
  background-color: #1C5580;
  border-radius: none !important;
  /* background: url("/assets/img/front-pages/backgrounds/footer-bg-dark.png"); */
}

.footer-bottom.py-3 {
  background-color: #282c3e;
}

.light-style .landing-footer .footer-link,
.light-style .landing-footer .footer-text {
  color: #d3d4dc !important;
}

.light-style .landing-footer .footer-link,
.light-style .landing-footer .footer-text {
  color: #d3d4dc;
}

a.footer-link {
  color: #d3d4dc;
}

.light-style .landing-footer .footer-title {
  color: #fff;
}

.footer-title {
  color: #fff;
}

.footer-text {
  color: #d3d4dc;
}

@media (max-width: 355px) {
  .first-section-pt {
    margin-block-start: -121px !important;
  }
}

.logo-img {
  display: block;
  position: relative;
  margin: 0 auto;
}

/* // @use "@core/scss/template/pages/page-auth.scss"; */
</style>
<style scoped>
@media only screen and (max-width: 768px) {
    .card-wid {
        max-width: 500px !important;
        min-width: auto !important;
    }

    .col-order-1 {
        order: 2;
    }

    .col-order-2 {
        order: 1;
    }
}
@media (min-width: 960px) and (max-width: 1200px){
    .card-wid{
        min-width: auto !important;
    }
}
@media only screen and (min-width: 769px) {
    .col-order-1 {
        order: 1;
    }

    .col-order-2 {
        order: 2;
    }
}

.total-font {
    font-size: 20px;
    margin-bottom: 5px;
}

.bg-custom {
    background: #F3F3F3;
}



.bg-white bg-change-bk .current-plan {
    border: 2px solid rgb(var(--v-theme-primary));
}

.cut-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: line-through;
    text-decoration-color: red;
    text-decoration-thickness: 1px;
}

.plan-card {
    margin: 0rem;
    margin-bottom: 0;
}

.card-wid {
    width: 500px;
}

.layout-wrapper {
    justify-content: center;
}

.error-message {
    color: #ff2f2f;
    font-size: 15px;
}
</style>

<style>


.bg-custom-color {
    background: #E0F0E3;
}
.v-card.v-card--flat.v-theme--light.v-card--density-default.v-card--variant-elevated.text-center.search-header.rounded-0 {
    block-size: 357px;
    inset-block-start: -185px;
}

body {
    display: block !important;
}

a.nav-link.fw-medium {
    color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}

.light-style .layout-navbar .menu-text {
    color: #5d596c !important;
}

span.app-brand-text.demo.menu-text.fw-bold.ms-2.ps-1 {
    color: #5d596c !important;
}

.navbar.landing-navbar {
    border-color: rgba(255, 255, 255, 68%) !important;
    background: white;
    margin: 0;
    border-radius: 0;
    box-shadow: 0px 10px 10px #00000029;
}

.landing-footer .footer-top {
    background-color: #1C5580;
    border-radius: none !important;
    /* background: url("/assets/img/front-pages/backgrounds/footer-bg-dark.png"); */
}

.footer-bottom.py-3 {
    background-color: #282c3e;
}

.light-style .landing-footer .footer-link,
.light-style .landing-footer .footer-text {
    color: #d3d4dc !important;
}

.light-style .landing-footer .footer-link,
.light-style .landing-footer .footer-text {
    color: #d3d4dc;
}

a.footer-link {
    color: #d3d4dc;
}

.light-style .landing-footer .footer-title {
    color: #fff;
}

.footer-title {
    color: #fff;
}

.footer-text {
    color: #d3d4dc;
}

@media (max-width: 355px) {
    .first-section-pt {
        margin-block-start: -121px !important;
    }
}

.logo-img {
    display: block;
    position: relative;
    margin: 0 auto;
}

/* // @use "@core/scss/template/pages/page-auth.scss"; */
</style>
