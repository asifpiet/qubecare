<script setup>
import CalenderSync from '@/pages/provider/calendar-sync.vue';
import Category from '@/pages/provider/category/index.vue';
import PaymentMethod from '@/pages/provider/PaymentMethod.vue';
import productsList from '@/pages/provider/products/index.vue';
import formsShow from '@/pages/provider/settings/forms/FormTabs.vue';
import WibSiteSetting from '@/pages/provider/settings/website-setting/index.vue';
import { useAuthStore } from '@/stores/authStore';
import { useRegisterSetupStore } from '@/stores/registerSetupStore';
import { addAlert } from '@/utils/showLoader';
import loadSignature from '@/views/apps/patient/Intake/app.js';
import NavBarI18n from '@core/components/I18n.vue';
import { useConfigStore } from '@core/stores/config';
import { themeConfig } from '@themeConfig';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
const { t } = useI18n();
const { currentUser, isAuthenticated } = useAuth()
const providerStore = useRegisterSetupStore()
const authStore = useAuthStore()
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const search = ref('')
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);
const paymentFormData = ref({ paymentMethod: 'stripe', apiKey: '', apiSecret: '' });
const itemsPerPage = ref(5);
const validationError = ref(false);
const validationMessage = ref('');
const accessToken = getCurrentAccessToken()
const router = useRouter()
const storeApi = useStore()
const wizardSetup = ref();
const signature = ref(null);
const route = useRoute();
const totalSteps = ref(6);
const completedSteps = ref(0);
definePage({
  meta: {
    layout: 'default',
    public: false,
  },
})

const store = useConfigStore()

store.skin = 'default'

const iconsSteps = [
  {
    title: 'Company Setting',
    subtitle: 'Setup Company setting',
  },
  {
    title: 'Setup Form',
    subtitle: 'Setup Multiple Form',
  },
  {
    title: 'Categories',
    subtitle: 'Add Categories',
  },
  {
    title: 'Products',
    subtitle: 'Add Products',
  },
  {
    title: 'Signature',
    subtitle: 'Add your signature',
  },
  {
    title: 'Payment Method',
    subtitle: 'Setup for Payment Method',
  },
  {
    title: 'Sync Google Calendar',
    subtitle: 'Setup for Google Calendar',
  },

]


const currentTab = ref('document-forms');

const handleTabChange = (tab) => {
  currentTab.value = tab;
  // Any other logic you need when tab changes
};

const currentStep = ref(0)
const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)
const isCurrentStepValid = ref(true)
const setupForm = ref('')

const isDialogVisible = ref(false)
const signaturePadRef = ref(null);
const signatureData = ref(null)
const signatureInputData = ref(null)
watch(signaturePadRef, (newValue) => {
  if (newValue) {
    console.log('Signature Pad Ref:', newValue.children[0].children[0]);
    if (!newValue.children[0].children[0].attrs) {
      newValue.children[0].children[0].attrs = {};
    }
    newValue.children[0].children[0].width = 1200;
    newValue.children[0].children[0].height = 150;
    loadSignature(newValue, currentUser.value, signatureData);
  }
}, { immediate: true });
onMounted(async () => {
  console.log('ddd', accessToken)
  if (signaturePadRef.value) {

    // if (!newValue.children[0].children[0].attrs) {
    //   newValue.children[0].children[0].attrs = {};
    // }
    // newValue.children[0].children[0].attrs.width = 750;
    // newValue.children[0].children[0].attrs.height = 150;
    // loadSignature(signaturePadRef.value, currentUser.value, signatureData);
  }
  if (!accessToken) {
    await router.push('/provider/login')
  } else {
    await providerStore.getWizardStup()
    wizardSetup.value = await providerStore.wizardStup
    if (wizardSetup.value.method) {
      paymentFormData.value.paymentMethod = wizardSetup.value.method.name
      paymentFormData.value.apiKey = wizardSetup.value.method.config.apiKey
      paymentFormData.value.apiSecret = wizardSetup.value.method.config.apiSecret
    }

    console.log(wizardSetup.value.on_your_domain)
    console.log(wizardSetup.value.on_your_domain)
    if (wizardSetup.value.on_your_domain == 1) {
      currentStep.value = 0
    } else {


      if (wizardSetup.value.total_form == 0) {
        currentStep.value = 1
      }
      else if (wizardSetup.value.product_cate_count == 0) {
        currentStep.value = 2
      }
      else if (wizardSetup.value.product_count == 0) {
        currentStep.value = 3
      }
      else if (wizardSetup.value.signature_count == 0) {

        currentStep.value = 4
      }
      else if (!wizardSetup.value.payment_method_setup) {
        currentStep.value = 5
      }
      else if (!wizardSetup.value.sync_google_account) {
        currentStep.value = 6
      }
      else {
        // await router.push({ name: 'provider-calendar' })
        currentStep.value = 1
      }

    }

    if (wizardSetup.value.total_form > 0) {
        completedSteps.value++
      }
    if (wizardSetup.value.product_cate_count > 0) {
      completedSteps.value++
    }
    if (wizardSetup.value.product_count > 0) {
      completedSteps.value++
    }
    if (wizardSetup.value.signature_count > 0) {
      completedSteps.value++
    }
    if (wizardSetup.value.payment_method_setup) {
      completedSteps.value++
    }
    if (wizardSetup.value.sync_google_account) {
      completedSteps.value++
    }

  }

})

const completedPercentageSteps = computed(() => {
  const result = (completedSteps.value / totalSteps.value) * 100
  return Number.isInteger(result) ? result : parseFloat(result.toFixed(2))
})
const onSubmitSignature = async () => {
  if (!signatureData.value) {
    addAlert('Please provide a valid signature before submitting the form.', 'error'); // Or use a better notification system
    return; // Stop the form submission
  }
  await providerStore.saveSignature(signatureData.value)
  console.log(signatureData.value)
}
const onSubmit = async () => {
  let validate = false

  if (!paymentFormData.value.apiKey && !paymentFormData.value.apiSecret) {
    paymentFormData.value.apiKeyValidation = true
    paymentFormData.value.apiSecretValidation = true
    return validate = true
  } else {
    paymentFormData.value.apiKeyValidation = false
    paymentFormData.value.apiSecretValidation = false
    console.log(paymentFormData.value)
    await providerStore.savePaymentMethod(paymentFormData.value) //storeApi.dispatch('savePaymentMethod', paymentFormData.value)
    await providerStore.getWizardStup()
    wizardSetup.value = providerStore.wizardStup

    // if (wizardSetup.value.intake_question_count > 0
    //   || wizardSetup.value.consent_form_count > 0
    //   || wizardSetup.value.questiories_form_count > 0
    //   || wizardSetup.value.product_cate_count > 0
    //   || wizardSetup.value.product_count > 0
    //   || wizardSetup.value.affliate_product_count > 0
    //   || wizardSetup.value.sync_google_account
    //   || wizardSetup.value.payment_method_setup
    // ) {
    //   await router.push({name:'dashboards-logistics'})
    // }
  }

}
const completeSetup = async () => {

  // await storeApi.dispatch('wizardStup')
  // wizardSetup.value = await storeApi.getters.getWizardSetup
  await providerStore.completSetup(1)
  authStore.clearUser('provider')
  await router.push({ name: 'provider-calendar' })

}
const handleDialogVisible = async (data) => {
  console.log(data)
  await providerStore.getWizardStup()
  wizardSetup.value = providerStore.wizardStup
  isDialogVisible.value = data
}



const validateAndNext = async (tab) => {
  console.log(wizardSetup.value, tab)
  // if (currentStep.value === 0 && !setupForm.value) {  
  //   validationError.value = true; // Set validation error  
  //    validationMessage.value='Please Select Form type'
  //   // Optionally, you can show a message to the user

  await providerStore.getWizardStup()
  wizardSetup.value = providerStore.wizardStup
  // } else { 
  validationError.value = false; // Clear the error if validation passes  

  if (tab == 0) {
    console.log(wizardSetup.value.company.logo)
    if (wizardSetup.value.company.logo == null || wizardSetup.value.company.logo == '') {

      addAlert('Please Upload Logo!', 'error')

    } else {
      currentStep.value++;
    }
  }
  if (tab == 1) {
    currentStep.value++;



  }
  if (tab == 2) {
    if (wizardSetup.value.product_cate_count == 0) {

      addAlert('Please add at least one catagory', 'error')


    } else {
      // const query = { ...route.query };
      // delete query.tab;
      // await router.push({ name: 'provider-register-setup' ,query: Object.keys(query).length ? query : undefined})
      currentStep.value++;
    }

  }
  if (tab == 3) {
    if (wizardSetup.value.product_count == 0) {
      addAlert('Please add at least one product', 'error')


    } else {
      currentStep.value++;
    }

  }
  if (tab == 4) {
    if (!signatureData.value) {
      addAlert('Please provide a valid signature before submitting the form.', 'error'); // Or use a better notification system
      return; // Stop the form submission
    } else {
      currentStep.value++;
    }

  }
  if (tab == 5) {
    if (!wizardSetup.value.payment_method_setup) {
      addAlert('Please Setup Payment method', 'error')

    } else {
      currentStep.value++;
    }

  }
  // Move to the next step  
  // }  
};
const skipControle = async () => {


  currentStep.value++;
  if (currentStep.value == 3) {
    currentStep.value = currentStep.value + 1;
  }
  // const query = { ...route.query };
  //     delete query.tab;
  //     await router.push({ name: 'provider-register-setup' ,query: Object.keys(query).length ? query : undefined})
  console.log(currentStep.value)
};


const translatedSteps = computed(() => {
  return iconsSteps.map(step => ({
    ...step,
    title: t(step.title),
    subtitle: t(step.subtitle)
  }));
});

</script>

<template>
  <!-- <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
    :languages="themeConfig.app.i18n.langConfig" class="language-btn" /> -->
  <div class="checkout-page">

    <!-- <VContainer> -->

      <div class="checkout-card">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ $t('Practice Onboarding') }}</h1>
                <p class="text-gray-600">{{ $t('Complete these steps to fully set up your practice') }}</p>
            </div>
            <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full"><span id="onboarding-progress-text">{{ completedPercentageSteps }}% {{ $t('Complete') }} ({{  completedSteps }}/{{ totalSteps }})</span></span>
                <div class="w-40 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full progress-bar" id="onboarding-progress-bar" :style="`width: ${completedPercentageSteps}%`"></div>
                </div>
            </div>
        </div>
        <div class="glass-card border-l-4 border-blue-500 mb-8 rounded-lg">
            <div class="p-6 flex items-center">
                <div class="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-lg h-12 w-12 flex items-center justify-center mr-4 shadow-lg">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-800 mb-1">{{ $t('Let Addy help you complete setup') }}</h3>
                    <p class="text-gray-600 text-sm">{{ $t('I can guide you through each step and automate parts of the onboarding process.') }}</p>
                </div>
                <button class="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                    {{ $t('Start Guided Setup') }}
                </button>
            </div>
        </div>
        <!-- <h5 class="text-h5 font-weight-bold mb-12"
          style="text-align: center; color:rgb(var(--v-theme-primary)) !important">
          <VIcon icon="tabler-settings" end class="flip-in-rtl" />{{ $t('Complete Your Setup') }}
        </h5> -->
        <div class="mb-6">
          <AppStepper v-model:current-step="currentStep" :items="translatedSteps"
            :is-active-step-valid="isCurrentStepValid" />
        </div>

        <VCard>
          <VCardText>
            <!-- 👉 stepper content -->
            <VForm>
              <VWindow v-model="currentStep" class="disable-tab-transition">

                <VWindowItem>
                  <VRow>
                    <VCol cols="12">
                      <h6 class="text-h6 font-weight-medium">
                        {{ $t('Company Setting') }}
                      </h6>
                      <p class="mb-0">
                        {{ $t('Setup Company Setting') }}
                      </p>
                    </VCol>
                    <VCol cols="12">
                      <VAlert color="error" v-if="validationError">
                        {{ validationMessage }}
                      </VAlert>

                    </VCol>
                    <VCol cols="12" md="12">

                      <WibSiteSetting @handleDialog="handleDialogVisible" />
                    </VCol>


                  </VRow>
                </VWindowItem>
                <VWindowItem>
                  <VRow>
                    <VCol cols="12">
                      <h6 class="text-h6 font-weight-medium">
                        {{ $t('Setup Form') }}
                      </h6>
                      <p class="mb-0">
                        {{ $t('Setup Multiple Form') }}

                      </p>
                    </VCol>
                    <VCol cols="12">
                      <VAlert color="error" v-if="validationError">
                        {{ validationMessage }}
                      </VAlert>

                    </VCol>



                    <VCol cols="12" md="12">

                      <formsShow :initial-tab="currentTab" @update:activeTab="handleTabChange" />
                      <!-- <listIntakeQuestion v-if="setupForm == 'Intake Question Form'" :user-form="setupForm"
                        :isDialogVisible="isDialogVisible" @handleDialog="handleDialogVisible" />

                      <listConsentForm v-if="setupForm == 'Consent Form'" :user-form="setupForm"
                        :isDialogVisible="isDialogVisible" @handleDialog="handleDialogVisible" />
                      <questionersList v-if="setupForm == 'Questioners Form For Product'" :user-form="setupForm"
                        :isDialogVisible="isDialogVisible" @handleDialog="handleDialogVisible" /> -->



                    </VCol>
                  </VRow>
                </VWindowItem>
                <VWindowItem>
                  <VRow>
                    <VCol cols="12">
                      <h6 class="text-h6 font-weight-medium">

                        {{ $t('Category') }}
                      </h6>
                      <p class="mb-0">
                        {{ $t('Setup Information') }}

                      </p>
                    </VCol>

                    <VCol cols="12" md="12">
                      <Category @handleDialog="handleDialogVisible" />
                    </VCol>





                  </VRow>
                </VWindowItem>
                <VWindowItem>
                  <VRow>
                    <VCol cols="12">
                      <h6 class="text-h6 font-weight-medium">
                        {{ $t('Products') }}

                      </h6>
                      <p class="mb-0">
                        {{ $t('Setup Information') }}

                      </p>
                    </VCol>
                    <VCol cols="12">
                      <VAlert color="error" v-if="validationError">
                        {{ validationMessage }}
                      </VAlert>

                    </VCol>
                    <VCol cols="12" md="12">
                      <productsList @handleDialog="handleDialogVisible" />
                    </VCol>





                  </VRow>
                </VWindowItem>

                <VWindowItem>
                  <VRow>
                    <VCol cols="12">
                      <h6 class="text-h6 font-weight-medium">
                        {{ $t('Signature') }}
                      </h6>
                      <p class="mb-0">
                        {{ $t('Create Your Signature') }}

                      </p>
                    </VCol>
                    <VCol cols="12">
                      <VAlert color="error" v-if="validationError">
                        {{ validationMessage }}
                      </VAlert>

                    </VCol>
                    <VCol cols="12" md="12">
                      <signature-pad ref="signaturePadRef" class="signature-pad">
                        <div class="canvas-wrapper">
                          <canvas></canvas>
                          <input type="hidden" v-model="signatureInputData" class="signature-hidden-input" />
                        </div>
                        <div class="signature-pad--footer">
                          <div class="signature-pad--actions">
                            <div class="column">
                              <button type="button" class="button clear" data-action="clear">{{ $t('Clear') }}</button>
                            </div>
                          </div>
                        </div>
                      </signature-pad>

                    </VCol>
                    <VCol cols="12" md="12">
                      <VBtn color="success" @click="onSubmitSignature">
                        {{ $t('Save') }}
                      </VBtn>
                    </VCol>

                  </VRow>
                </VWindowItem>


                <VWindowItem>
                  <VRow>
                    <VCol cols="12">
                      <h6 class="text-h6 font-weight-medium">
                        {{ $t('Payment Method') }}

                      </h6>
                      <p class="mb-0">
                        {{ $t('Setup Payment Method') }}

                      </p>
                    </VCol>
                    <VCol cols="12">
                      <div v-if="validationError" style="color: red;">{{ validationMessage }}</div>
                    </VCol>
                    <VCol cols="12" md="12">

                      <PaymentMethod :payment-data="paymentFormData" />

                    </VCol>
                    <VCol cols="12" md="12">
                      <VBtn color="success" @click="onSubmit">
                        {{ $t('Save Payment Config') }}

                      </VBtn>
                    </VCol>
                  </VRow>
                </VWindowItem>

                <VWindowItem>
                  <VRow>
                    <VCol cols="12">
                      <h6 class="text-h6 font-weight-medium">
                        {{ $t('Google Calendar') }}

                      </h6>
                      <p class="mb-0">
                        {{ $t('Setup Google Calendar') }}

                      </p>
                    </VCol>

                    <VCol cols="12">
                      <div v-if="validationError" style="color: red;">{{ validationMessage }}</div>
                    </VCol>

                    <VCol cols="12" md="12">
                      <CalenderSync />
                    </VCol>


                  </VRow>
                </VWindowItem>
              </VWindow>


            </VForm>
          </VCardText>
          <!-- <VDialog
    v-model="isDialogVisible"
    max-width="800"
  >

    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />
    <intakeQuestion v-if="setupForm=='Intake Question Form'" @submit="handleUserSubmit"/>
    <consentForm v-if="setupForm=='Consent Form'" @submit="handleUserSubmit"/>
    <AddQuestioneries v-if="setupForm=='Questioners Form For Product'" @submit="handleUserSubmit"/>
    
    </VDialog> -->
        </VCard>
        <div class="d-flex flex-wrap gap-4 justify-between mt-8">
          <VBtn color="secondary" variant="tonal" :disabled="currentStep === 0" @click="currentStep--">
            <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
            {{ $t('Previous') }}

          </VBtn>

          <div class="ml-auto"> <!-- Add this wrapper -->
            <VBtn v-if="currentStep != 0 && currentStep < iconsSteps.length - 1" color="primary" @click="skipControle">
              {{ $t('Skip') }}

              <VIcon icon="tabler-skip-forward" end class="flip-in-rtl" />
            </VBtn>
          </div>

          <VBtn v-if="iconsSteps.length - 1 === currentStep" color="success" @click="completeSetup">
            {{ $t('Complete Setup') }}

          </VBtn>

          <VBtn v-else @click="validateAndNext(currentStep)">
            {{ $t('Next') }}

            <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
          </VBtn>
        </div>
      </div>
    <!-- </VContainer> -->

  </div>
</template>

<style lang="scss" scoped>
.glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(148, 163, 184, 0.15);
    box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 10px 10px -5px rgba(15, 23, 42, 0.04);
}
.progress-bar {
    background: linear-gradient(90deg, #3B82F6 0%, #10B981 100%);
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.checkout-card {
  margin-block: 0rem 5.25rem;
}


.language-btn {
  position: absolute;
  right: 0;
}

@media (max-width: 960px) and (min-width: 600px) {
  .checkout-page {
    .v-container {
      padding-inline: 2rem !important;
    }
  }
}

@media (max-width: 600px) {
  .checkout-card {
    margin-block-start: 6rem;
  }
}
</style>
<style scoped>
::v-deep(.canvas-wrapper canvas) {
  border: 1px dashed #49a38c;
  border-radius: 5px;
}

:deep(.signature-pad) {
  width: 100%;
  height: 148px;
  cursor: crosshair;
  touch-action: none;
  user-select: none;
}

:deep(.signature-pad-container) {
  position: relative;
  width: 100%;
  height: 148px;
  border: 1px dashed #49a38c;
  border-radius: 4px;
  background-color: white;
  margin-bottom: 16px;
}

:deep(.canvas-wrapper) {
  width: 100%;
  height: 100%;
  position: relative;
}

:deep(.canvas-wrapper canvas) {
  width: 100%;
  height: 100%;
}

:deep(.signature-pad--footer) {
  position: absolute;
  bottom: 15px;
  right: 3px;
}

:deep(.signature-pad--actions .clear) {
  background-color: white;
  border: 1px solid #49a38c;
  color: #49a38c;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
}

:deep(.signature-pad--actions .clear:hover) {
  background-color: #e9f5f2;
}

:deep(.signature-placeholder) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #7f8c8d;
  font-size: 14px;
  pointer-events: none;
  opacity: 0.7;
}
</style>
