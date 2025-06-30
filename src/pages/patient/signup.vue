<script setup>
definePage({
  meta: {
    layout: 'blank',
    public: true
  },
})

import { patientAuthService } from '@/services/auth/patientAuthService'
import { useBuilderStore } from '@/stores/builderStore'
import { usePatientRegStore } from '@/stores/patientRegStore'
import { usePractitionerStore } from '@/stores/practitionerStore'
import NavBarI18n from '@core/components/I18n.vue'
import {
    emailValidator,
    requiredValidator,
    validUSAPhone
} from '@core/utils/validators'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import debounce from 'lodash.debounce'
import { computed, h, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const emit = defineEmits(['completed']);
const route = useRoute()
const router = useRouter()
const patientRegStore = usePatientRegStore()
const builderStore = useBuilderStore()
const practitionerStore = usePractitionerStore()

const bid = atob(route.query.bid)
patientRegStore.patient.affiliate_email = route.query.af_ref ? atob(route.query.af_ref) : null
patientRegStore.patient.provider_id = builderStore.provider_id

await builderStore.getUnauthBuilderById(bid)
await patientRegStore.getProductByProviderId(builderStore.provider_id)
practitionerStore.getPractitionerInfoUnAuth(builderStore.provider_id)

if (localStorage.getItem('patientRegStore')) {
  let data = JSON.parse(atob(localStorage.getItem('patientRegStore')))
  patientRegStore.setState(data)
}

const isMobile = ref(window.innerWidth <= 768)
const isPasswordVisible = ref(false)
const formRef = ref(null)
const patientId = ref(null)
const rememberMe = ref(false)
const disableSubmit = ref(false)

const errors = ref({})

onMounted(() => {
  window.addEventListener('resize', checkIfMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile)
})

const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

const formatPhoneNumber = () => {
  const numericValue = patientRegStore.patient.phone_no.replace(/\D/g, '')
  if (numericValue.length <= 10) {
    patientRegStore.patient.phone_no = numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  } else {
    const truncatedValue = numericValue.slice(0, 10)
    patientRegStore.patient.phone_no = truncatedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  }
}

const submitForm = async () => {
  const { valid: isValid } = await formRef.value?.validate()
  if (isValid) {
    disableSubmit.value = true
    await signup()
    disableSubmit.value = false
    if (!patientId.value) return
    router.replace('/patient/dashboard')
  }
}

const signup = async () => {
  
    patientRegStore.patient.provider_id = builderStore.provider_id

    showLoader()
    try {
    const resp = await patientAuthService.register(patientRegStore.patient)
    if (resp?.error === 'email already exist.') {
        addAlert(resp?.error, 'error')
        hideLoader()
        return
    }
    patientId.value = resp.userData.id
    patientRegStore.patient.id = patientId.value
    patientRegStore.currentState = 'register'
    } catch (e) {
    if (e.response?.data?.errors) {
        Object.values(e.response.data.errors).forEach(error => addAlert(error, 'error'))
    } else {
        addAlert(e.response?.data?.message ?? 'Something went wrong', 'error')
    }
    }
    hideLoader()
}

const safeBtoa = str => btoa(unescape(encodeURIComponent(str)))

patientRegStore.$subscribe(
  debounce((_, state) => {
    localStorage.setItem('patientRegStore', safeBtoa(JSON.stringify(state)))
  })
)


watch(
    () => practitionerStore.practitioner?.company?.logo,
    (newLogo) => {
        if (newLogo) {
            themeConfig.app.logo = h('div', { innerHTML: `<img src="${newLogo}" alt="Logo" style="width:160px;">` });
        }
    },
    { immediate: true } // Trigger the watcher immediately on component mount
);
const logo = computed(() => {
    console.log(practitionerStore.practitioner)
    return themeConfig.app.logo;
});
</script>

<template>
    <div class="main-container">
      <!-- Top Bar -->
      <div class="top-bar">
        <VNodeRenderer :nodes="logo" />
      </div>
  
      <!-- Language Dropdown -->
      <div class="language-dropdown">
        <NavBarI18n
          v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
          :languages="themeConfig.app.i18n.langConfig"
          class="language"
        />
      </div>
  
      <!-- Centered Form Wrapper -->
      <div class="center-wrapper">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="6" lg="5">
              <v-card class="pa-6" outlined>
                <h3 class="mb-6 text-h5 font-weight-medium text-primary">
                  {{ $t('Create Your') }} {{ $t('Account') }}
                </h3>
                <v-form ref="formRef" @submit.prevent="() => { }">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="patientRegStore.patient.first_name"
                        :label="$t('First Name')"
                        :rules="[requiredValidator]"
                        density="comfortable"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="patientRegStore.patient.last_name"
                        :label="$t('Last Name')"
                        :rules="[requiredValidator]"
                        density="comfortable"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="patientRegStore.patient.email"
                        :label="$t('Email Address')"
                        :rules="[requiredValidator, emailValidator]"
                        density="comfortable"
                        :disabled="patientRegStore.currentState === 'loggedin'"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="patientRegStore.patient.phone_no"
                        :label="$t('Phone Number')"
                        pattern="^\(\d{3}\) \d{3}-\d{4}$"
                        :rules="[requiredValidator, validUSAPhone]"
                        density="comfortable"
                        :placeholder="$t('For notifications & verification')"
                        @input="formatPhoneNumber"
                        maxlength="14"
                      />
                    </v-col>
                  </v-row>
                  <p class="mt-4 text-caption text-grey">
                    {{
                      $t(
                        'Your account will be automatically created, and login credentials will be sent to your email.'
                      )
                    }}
                  </p>
                  <v-btn
                    type="submit"
                    :text="$t('Signup')"
                    class="mt-5"
                    color="primary"
                    block
                    :disabled="disableSubmit"
                    @click="submitForm"
                  />
                    <div class="text-right mt-4" >
                        <span>Already have account? </span>
                        <router-link :to="'/patient/login'" class="text-primary underline">Login</router-link>

                    </div>
                </v-form>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </template>
  
  <style scoped>
  .main-container {
    background-color: white;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .top-bar {
    padding: 15px 10px 10px;
    border-bottom: 1px solid #c0c0c0b0;
    position: fixed;
    width: 100%;
    z-index: 1004;
    background: white;
    text-align: center;
    height: 60px;
  }
  
  .language-dropdown {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1005;
  }
  
  .language-dropdown .language {
    cursor: pointer;
    padding: 5px 10px;
    background-color: transparent;
  }
  
  /* Wrapper that fills remaining height and centers content */
  .center-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 60px; /* height of fixed top bar */
  }
  </style>
  
