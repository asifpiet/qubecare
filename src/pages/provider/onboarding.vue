<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Provider On Boarding View',
  },
})
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
import { useConfigStore } from '@core/stores/config';
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
const essentialSetupRemaining = ref(0);
const practiceConfigurationRemaining = ref(0);
const optionalFeaturesRemaining = ref(0);
const showCategoriesSetup = ref(false);
const showProductsSetup = ref(false);
const showPaymentSetup = ref(false);
const showSignaturePad = ref(false);
const showSetupForms = ref(false);
const showGoogleSetup = ref(false);

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

    if (wizardSetup.value.total_form > 0) completedSteps.value++; else practiceConfigurationRemaining.value++;
    if (wizardSetup.value.product_cate_count > 0) completedSteps.value++; else essentialSetupRemaining.value++;
    if (wizardSetup.value.product_count > 0) completedSteps.value++; else essentialSetupRemaining.value++;
    if (wizardSetup.value.signature_count > 0) completedSteps.value++; else practiceConfigurationRemaining.value++;
    if (wizardSetup.value.payment_method_setup) completedSteps.value++; else essentialSetupRemaining.value++;
    if (wizardSetup.value.sync_google_account) completedSteps.value++; else optionalFeaturesRemaining.value++;

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
  wizardSetup.value.signature_count = 1
  completedSteps.value++;
  signaturePad.value = false
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
    showPaymentSetup.value = false
    wizardSetup.value.payment_method_setup = true
    completedSteps.value++;

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
  console.log('category > ',data)
  if(data){
    await providerStore.getWizardStup()
    wizardSetup.value = providerStore.wizardStup
    isDialogVisible.value = data
    completedSteps.value++;
  }
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
        <!-- Onboarding Categories -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Essential Setup -->
                <div class="glass-card rounded-lg">
                    <div class="border-b border-gray-200 px-6 py-4">
                        <h3 class="font-semibold text-gray-800 flex items-center text-lg">
                            <div class="bg-gradient-to-br from-red-400 to-pink-500 p-2 rounded-lg mr-3 shadow-md">
                                <i class="fas fa-exclamation-triangle text-white"></i>
                            </div>
                            {{ $t('Essential Setup') }}
                            <span class="ml-auto bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full" v-if="essentialSetupRemaining > 0">{{ essentialSetupRemaining }} {{ $t('remaining') }}</span>
                        </h3>
                    </div>
                    <div class="p-6 space-y-4">

                        <div class="task-row p-4 flex items-center" :class="wizardSetup && wizardSetup.product_cate_count > 0 ? 'completed' : 'in-progress'">
                            <div class="step-indicator mr-4" :class="{'step-complete': wizardSetup && wizardSetup.product_cate_count > 0, 'step-pending': !wizardSetup || wizardSetup.product_cate_count <= 0}">
                                <i v-if="wizardSetup && wizardSetup.product_cate_count > 0" class="fas fa-check text-sm"></i>
                                <template v-else>1</template>
                            </div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-800">{{ $t('Create Categories') }}</div>
                                <div class="text-sm text-gray-600">{{ $t('Add the categories for products') }}</div>
                            </div>
                            <span v-if="wizardSetup && wizardSetup.product_cate_count > 0" class="text-green-600 text-sm font-medium">{{ $t('Complete') }}</span>
                            <button v-else class="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors" @click="showCategoriesSetup = true">{{ $t('Setup') }}</button>
                        </div>

                        <div class="task-row p-4 flex items-center" :class="wizardSetup && wizardSetup.product_count > 0 ? 'completed' : 'in-progress'">
                            <div class="step-indicator mr-4" :class="{'step-complete': wizardSetup && wizardSetup.product_count > 0, 'step-pending': !wizardSetup || wizardSetup.product_count <= 0}">
                                <i v-if="wizardSetup && wizardSetup.product_count > 0" class="fas fa-check text-sm"></i>
                                <template v-else>2</template>
                            </div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-800">{{ $t('Add Products') }}</div>
                                <div class="text-sm text-gray-600">{{ $t('Add your products for patients') }}</div>
                            </div>
                            <span v-if="wizardSetup && wizardSetup.product_count > 0" class="text-green-600 text-sm font-medium">{{ $t('Complete') }}</span>
                            <button v-else class="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors" @click="showProductsSetup = true">{{ $t('Setup') }}</button>
                        </div>

                        <div class="task-row p-4 flex items-center" :class="{'completed': wizardSetup && wizardSetup.payment_method_setup}">
                            <div class="step-indicator mr-4" :class="{'step-complete': wizardSetup && wizardSetup.payment_method_setup, 'step-pending': !wizardSetup || !wizardSetup.payment_method_setup}">
                                <i v-if="wizardSetup && wizardSetup.payment_method_setup" class="fas fa-check text-sm"></i>
                                <template v-else>3</template>
                            </div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-800">{{ $t('Payment Processing') }}</div>
                                <div class="text-sm text-gray-600">{{ $t('Set up payment methods and billing') }}</div>
                            </div>
                            <span v-if="wizardSetup && wizardSetup.payment_method_setup" class="text-green-600 text-sm font-medium">{{ $t('Complete') }}</span>
                            <button v-else class="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors" @click="showPaymentSetup = true">{{ $t('Configure') }}</button>
                        </div>
                        
                        <div class="task-row p-4 flex items-center">
                            <div class="step-indicator step-pending mr-4">4</div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-800">{{ $t('Connect EHR System') }}</div>
                                <div class="text-sm text-gray-600">{{ $t('Integrate with your existing electronic health records') }}</div>
                            </div>
                            <button class="text-gray-400 text-sm">{{ $t('Coming Soon') }}</button>
                        </div>
                        
                        <div class="task-row p-4 flex items-center">
                            <div class="step-indicator step-pending mr-4">5</div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-800">{{ $t('Insurance Integration') }}</div>
                                <div class="text-sm text-gray-600">{{ $t('Connect with insurance providers') }}</div>
                            </div>
                            <button class="text-gray-400 text-sm">{{ $t('Coming Soon') }}</button>
                        </div>
                    </div>
                </div>

                <!-- Practice Configuration -->
                <div class="glass-card rounded-lg">
                    <div class="border-b border-gray-200 px-6 py-4">
                        <h3 class="font-semibold text-gray-800 flex items-center text-lg">
                            <div class="bg-gradient-to-br from-blue-400 to-cyan-500 p-2 rounded-lg mr-3 shadow-md">
                                <i class="fas fa-cog text-white"></i>
                            </div>
                            {{ $t('Practice Configuration') }}
                            <span class="ml-auto bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full" v-if="practiceConfigurationRemaining > 0">{{ practiceConfigurationRemaining }} {{ $t('remaining') }}</span>
                        </h3>
                    </div>
                    <div class="p-6 space-y-4">
                        <div class="task-row completed p-4 flex items-center">
                            <div class="step-indicator step-complete mr-4">
                                <i class="fas fa-check text-sm"></i>
                            </div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-800">{{ $t('Practice Information') }}</div>
                                <div class="text-sm text-gray-600">{{ $t('Basic practice details and contact info') }}</div>
                            </div>
                            <span class="text-green-600 text-sm font-medium">{{ $t('Complete') }}</span>
                        </div>

                        <div class="task-row p-4 flex items-center" :class="wizardSetup && wizardSetup.total_form > 0 ? 'completed' : 'in-progress'">
                            <div class="step-indicator mr-4" :class="{'step-complete': wizardSetup && wizardSetup.total_form > 0, 'step-pending': !wizardSetup || wizardSetup.total_form <= 0}">
                                <i v-if="wizardSetup && wizardSetup.total_form > 0" class="fas fa-check text-sm"></i>
                                <template v-else>2</template>
                            </div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-800">{{ $t('Setup Forms') }}</div>
                                <div class="text-sm text-gray-600">{{ $t('Create your customized forms for patient information') }}</div>
                            </div>
                            <span v-if="wizardSetup && wizardSetup.total_form > 0" class="text-green-600 text-sm font-medium">{{ $t('Complete') }}</span>
                            <button v-else class="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors" @click="showSetupForms = true">{{ $t('Setup') }}</button>
                        </div>

                        <div class="task-row p-4 flex items-center" :class="{'completed': wizardSetup && wizardSetup.signature_count > 0}">
                            <div class="step-indicator mr-4" :class="{'step-complete': wizardSetup && wizardSetup.signature_count > 0, 'step-pending': !wizardSetup || wizardSetup.signature_count <= 0}">
                                <i v-if="wizardSetup && wizardSetup.signature_count > 0" class="fas fa-check text-sm"></i>
                                <template v-else>3</template>
                            </div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-800">{{ $t('Add Signature') }}</div>
                                <div class="text-sm text-gray-600">{{ $t('For prescribing medicine and consults add your signature') }}</div>
                            </div>
                            <span v-if="wizardSetup && wizardSetup.signature_count > 0" class="text-green-600 text-sm font-medium">{{ $t('Complete') }}</span>
                            <button v-else class="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors" @click="showSignaturePad = true">{{ $t('Setup') }}</button>
                        </div>

                    </div>
                </div>
                
                <!-- Optional Features -->
                <div class="glass-card rounded-lg">
                    <div class="border-b border-gray-200 px-6 py-4">
                        <h3 class="font-semibold text-gray-800 flex items-center text-lg">
                            <div class="bg-gradient-to-br from-green-400 to-emerald-500 p-2 rounded-lg mr-3 shadow-md">
                                <i class="fas fa-star text-white"></i>
                            </div>
                            {{ $t('Optional Features') }}
                            <span class="ml-auto bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full" v-if="optionalFeaturesRemaining > 0">{{ optionalFeaturesRemaining }} {{ $t('remaining') }}</span>
                        </h3>
                    </div>
                    <div class="p-6 space-y-4">

                        <div class="task-row p-4 flex items-center" :class="{'completed': wizardSetup && wizardSetup.sync_google_account}">
                            <div class="step-indicator mr-4" :class="{'step-complete': wizardSetup && wizardSetup.sync_google_account, 'step-pending': !wizardSetup || !wizardSetup.sync_google_account}">
                                <i v-if="wizardSetup && wizardSetup.sync_google_account" class="fas fa-check text-sm"></i>
                                <template v-else>1</template>
                            </div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-800">{{ $t('Sync Google Calendar') }}</div>
                                <div class="text-sm text-gray-600">{{ $t('Add your appointments to your Google calendar') }}</div>
                            </div>
                            <span v-if="wizardSetup && wizardSetup.sync_google_account" class="text-green-600 text-sm font-medium">{{ $t('Complete') }}</span>
                            <button v-else class="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors" @click="showGoogleSetup = true">{{ $t('Setup') }}</button>
                        </div>

                        <div class="task-row completed p-4 flex items-center">
                            <div class="step-indicator step-complete mr-4">
                                <i class="fas fa-check text-sm"></i>
                            </div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-800">{{ $t('Online Booking') }}</div>
                                <div class="text-sm text-gray-600">{{ $t('Allow patients to book appointments online') }}</div>
                            </div>
                            <span class="text-green-600 text-sm font-medium">{{ $t('Complete') }}</span>
                        </div>

                        <div class="task-row completed p-4 flex items-center">
                            <div class="step-indicator step-complete mr-4">
                                <i class="fas fa-check text-sm"></i>
                            </div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-800">{{ $t('Telehealth Setup') }}</div>
                                <div class="text-sm text-gray-600">{{ $t('Configure video consultation features') }}</div>
                            </div>
                            <span class="text-green-600 text-sm font-medium">{{ $t('Complete') }}</span>
                        </div>

                    </div>
                </div>

                <!-- Marketing & Growth -->
                <div class="glass-card rounded-lg">
                    <div class="border-b border-gray-200 px-6 py-4">
                        <h3 class="font-semibold text-gray-800 flex items-center text-lg">
                            <div class="bg-gradient-to-br from-purple-400 to-indigo-500 p-2 rounded-lg mr-3 shadow-md">
                                <i class="fas fa-chart-line text-white"></i>
                            </div>
                            {{ $t('Marketing & Growth') }}
                            <span class="ml-auto bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">{{ $t('Optional') }}</span>
                        </h3>
                    </div>
                    <div class="p-6 space-y-4">

                        <div class="task-row p-4 flex items-center">
                            <div class="step-indicator step-pending mr-4">1</div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-800">{{ $t('Practice Website') }}</div>
                                <div class="text-sm text-gray-600">{{ $t('Create a professional website for your practice') }}</div>
                            </div>
                            <button class="text-gray-400 text-sm">{{ $t('Coming Soon') }}</button>
                        </div>

                        <div class="task-row p-4 flex items-center">
                            <div class="step-indicator step-pending mr-4">2</div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-800">{{ $t('Social Media Integration') }}</div>
                                <div class="text-sm text-gray-600">{{ $t('Connect your social media accounts') }}</div>
                            </div>
                            <button class="text-gray-400 text-sm">{{ $t('Coming Soon') }}</button>
                        </div>
                        
                    </div>
                </div>
            </div>

            <!-- Quick Tips -->
            <div class="mt-8 glass-card rounded-lg">
                <div class="border-b border-gray-200 px-6 py-4">
                    <h3 class="font-semibold text-gray-800 flex items-center text-lg">
                        <div class="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg mr-3 shadow-md">
                            <i class="fas fa-lightbulb text-white"></i>
                        </div>
                        {{ $t('Quick Tips') }}
                    </h3>
                </div>
                <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div class="text-blue-600 font-medium text-sm mb-2">💡 {{ $t('Pro Tip') }}</div>
                        <div class="text-sm text-gray-700">{{ $t('Complete essential setup first to start seeing patients quickly.') }}</div>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div class="text-green-600 font-medium text-sm mb-2">🚀 {{ $t('Getting Started') }}</div>
                        <div class="text-sm text-gray-700">{{ $t('Use Addy AI to automate repetitive setup tasks and save time.') }}</div>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div class="text-purple-600 font-medium text-sm mb-2">📈 {{ $t('Growth') }}</div>
                        <div class="text-sm text-gray-700">{{ $t('Set up optional features later as your practice grows and evolves.') }}</div>
                    </div>
                </div>
            </div>
      </div>
    <!-- </VContainer> -->

    <!-- Setup Form Dialog -->
    <VNavigationDrawer
      v-model="showSetupForms"
      temporary
      :width="800"
      location="end"
      class="scrollable-content"
    >
      <!-- Dialog close btn -->
      <AppDrawerHeaderSection
        :title="$t('Setup Form')"
        subtitle="$t('Setup Information')"
        @cancel="showSetupForms = false"
      />

      <VDivider />

      <PerfectScrollbar :options="{ wheelPropagation: false }">
        <VCard flat>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VAlert color="error" v-if="validationError">
                  {{ validationMessage }}
                </VAlert>
              </VCol>
              <VCol cols="12" md="12">
                <formsShow :initial-tab="currentTab" @update:activeTab="handleTabChange" @handleDialog="handleDialogVisible"/>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </PerfectScrollbar>
    </VNavigationDrawer>

    <!-- Category Dialog -->
    <VNavigationDrawer
      v-model="showCategoriesSetup"
      temporary
      :width="800"
      location="end"
      class="scrollable-content"
    >
      <!-- Dialog close btn -->
      <AppDrawerHeaderSection
        :title="$t('Category')"
        subtitle="$t('Setup Information')"
        @cancel="showCategoriesSetup = false"
      />

      <VDivider />

      <PerfectScrollbar :options="{ wheelPropagation: false }">
        <VCard flat>
          <VCardText>
            <VRow>
              <VCol cols="12" md="12">
                <Category @handleDialog="handleDialogVisible" />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </PerfectScrollbar>
    </VNavigationDrawer>

    <!-- Products Dialog -->
    <VNavigationDrawer
      v-model="showProductsSetup"
      temporary
      :width="800"
      location="end"
      class="scrollable-content"
    >
      <!-- Dialog close btn -->
      <AppDrawerHeaderSection
        :title="$t('Products')"
        subtitle="$t('Setup Information')"
        @cancel="showProductsSetup = false"
      />

      <VDivider />

      <PerfectScrollbar :options="{ wheelPropagation: false }">
        <VCard flat>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VAlert color="error" v-if="validationError">
                  {{ validationMessage }}
                </VAlert>
              </VCol>
              <VCol cols="12" md="12">
                <productsList @handleDialog="handleDialogVisible" />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </PerfectScrollbar>
    </VNavigationDrawer>

    <!-- Signature Dialog -->
    <VNavigationDrawer
      v-model="showSignaturePad"
      temporary
      :width="800"
      location="end"
      class="scrollable-content"
    >
      <!-- Dialog close btn -->
      <AppDrawerHeaderSection
        :title="$t('Signature')"
        subtitle="$t('Create Your Signature')"
        @cancel="showSignaturePad = false"
      />

      <VDivider />

      <PerfectScrollbar :options="{ wheelPropagation: false }">
        <VCard flat>
          <VCardText>
            <VRow>
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
          </VCardText>
        </VCard>
      </PerfectScrollbar>
    </VNavigationDrawer>
    
    <!-- Payment Method Dialog -->
    <VNavigationDrawer
      v-model="showPaymentSetup"
      temporary
      :width="800"
      location="end"
      class="scrollable-content"
    >
      <!-- Dialog close btn -->
      <AppDrawerHeaderSection
        :title="$t('Payment Method')"
        subtitle="$t('Setup Payment Method')"
        @cancel="showPaymentSetup = false"
      />

      <VDivider />

      <PerfectScrollbar :options="{ wheelPropagation: false }">
        <VCard flat>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VAlert color="error" v-if="validationError">
                  {{ validationMessage }}
                </VAlert>
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
          </VCardText>
        </VCard>
      </PerfectScrollbar>
    </VNavigationDrawer>

    <!-- Google Calendar Dialog -->
    <VNavigationDrawer
      v-model="showGoogleSetup"
      temporary
      :width="800"
      location="end"
      class="scrollable-content"
    >
      <!-- Dialog close btn -->
      <AppDrawerHeaderSection
        :title="$t('Google Calendar')"
        subtitle="$t('Setup Google Calendar')"
        @cancel="showGoogleSetup = false"
      />

      <VDivider />

      <PerfectScrollbar :options="{ wheelPropagation: false }">
        <VCard flat>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VAlert color="error" v-if="validationError">
                  {{ validationMessage }}
                </VAlert>
              </VCol>
              <VCol cols="12" md="12">
                <CalenderSync />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </PerfectScrollbar>
    </VNavigationDrawer>

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
.step-indicator {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.step-pending {
    background: #e5e7eb;
    color: #6b7280;
}

.step-progress {
    background: linear-gradient(45deg, #F59E0B, #f97316);
    color: white;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.step-complete {
    background: linear-gradient(45deg, #10B981, #059669);
    color: white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.task-row {
    transition: all 0.3s ease;
    border-radius: 8px;
    margin: 4px 0;
}

.task-row:hover {
    background: #f8fafc;
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.task-row.completed {
    background: linear-gradient(90deg, #f0fdf4 0%, #dcfce7 100%);
}

.task-row.in-progress {
    background: linear-gradient(90deg, #fffbeb 0%, #fef3c7 100%);
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
