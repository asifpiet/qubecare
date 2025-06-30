<script setup>
import LiveKit from '@/components/LiveKit.vue';
import { useCompanyScripts } from '@/composables/useCompanyScripts';
import { useAppStore } from '@/stores/appStore';
import { useCallStore } from '@/stores/callStore';
import ScrollToTop from '@core/components/ScrollToTop.vue';
import initCore from '@core/initCore';
import {
  initConfigStore,
  useConfigStore,
} from '@core/stores/config';
import { hexToRgb } from '@core/utils/colorConverter';
import { watch } from 'vue';
import { useTheme } from 'vuetify';
import { useStore } from 'vuex';
import { removeAlert } from './utils/showLoader';

const useAuthObj = useAuth()
const appStore = useAppStore()
const callStore = useCallStore()
const store = useStore()
const router = useRouter()
const { global } = useTheme()
const { initializeCompanyScripts } = useCompanyScripts()
GLOBAL_VARIABLE.useAuth = useAuthObj
// ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()


const configStore = useConfigStore()
GLOBAL_VARIABLE.ability = useAbility()
const closeSnackbar = async () => {

  if (store.getters.getSuccessMsg) {
    store.commit('setSuccessMsg', false)
  } else {
    store.commit('setErrorMsg', false)
  }
}
onMounted(() => {
  const tailwindLink = document.createElement('link')
  tailwindLink.rel = 'stylesheet'
  tailwindLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css'
  document.head.appendChild(tailwindLink)

  const fontAwesomeScript = document.createElement('script')
  fontAwesomeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js'
  fontAwesomeScript.defer = true
  document.head.appendChild(fontAwesomeScript)
  window.addEventListener('vue-router-navigate', (event) => {
    if (event.detail && event.detail.path) {
      router.push(event.detail.path);
    }
  });


  window.EddieConfig = {

    getMetaData() {
      const accessToken = getCurrentAccessToken();
      return { accessToken: accessToken }
    }
  }
  // const script = document.createElement('script');
  // script.src = "https://bug.qubecare.ai/script.js";
  // document.head.appendChild(script);
  let scriptElement = document.createElement('script');
  scriptElement.src = 'https://adi.qubecare.ai/adi/script.js';
  document.body.appendChild(scriptElement);

  // Initialize company scripts after authentication is ready
  if (useAuthObj.isAuthenticated.value) {
    initializeCompanyScripts()
  }
})

// Watch for authentication changes to inject scripts when user logs in
watch(() => useAuthObj.isAuthenticated.value, (isAuthenticated) => {
  if (isAuthenticated) {
    initializeCompanyScripts()
  }
}, { immediate: false })

</script>

<template>
  <VProgressLinear indeterminate color="primary" style="position: fixed; z-index: 99999999; top: 0;"
    v-if="appStore.showLoader" height="3" />

  <VSnackbar @update:model-value="removeAlert(alert)" v-for="(alert, index) in appStore.alerts" :key="index"
    :model-value="alert.show" :timeout="5000" location="top end" variant="flat" :color="alert.type">
    <template #default>
      <VIcon class="tabler-checkbox" /> {{ alert.message }}

      <VIcon @click="alert.show = false" class="tabler-x clickable-icon" aria-label="Close Snackbar"
        style="cursor: pointer; margin-left: 10px; float: right;" />

    </template>
  </VSnackbar>

  <VDialog :model-value="store.getters.getIsLoading" width="110" height="150" color="primary">
    <VCardText class="" style="color: white !important;">
      <div class="demo-space-x">
        <VProgressCircular :size="40" color="primary" indeterminate />
      </div>
    </VCardText>
  </VDialog>

  <VSnackbar :model-value="store.getters.getSuccessMsg" :timeout="5000" location="top end" variant="flat"
    color="success">
    <template #default>
      <VIcon class="tabler-checkbox" /> {{ store.getters.getShowMsg }}

      <VIcon @click="closeSnackbar" class="tabler-x clickable-icon" aria-label="Close Snackbar"
        style="cursor: pointer; margin-left: 10px; float: right;" />

    </template>
  </VSnackbar>
  <VSnackbar :model-value="store.getters.getErrorMsg" :timeout="5000" location="top end" variant="flat" color="error">
    <template #default>
      <VIcon class="tabler-exclamation-circle" /> {{ store.getters.getShowMsg }}

      <VIcon @click="closeSnackbar" class="tabler-x clickable-icon" aria-label="Close Snackbar"
        style="cursor: pointer; margin-left: 10px; float: right;" />

    </template>
  </VSnackbar>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />
      <ScrollToTop />
    </VApp>
  </VLocaleProvider>
  <LiveKit :isCallComponent="callStore.teleport"></LiveKit>

</template>
<style>
/* Eddie AI Assistant Avatar Styling */
.eddie-assistant-avatar-container {

  height: 50px !important;
  width: 50px !important;

}
</style>
