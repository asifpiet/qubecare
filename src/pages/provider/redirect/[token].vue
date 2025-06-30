<script setup>
import { useAuth } from '@/composables/useAuth';
import { addAlert, hideLoader, showLoader } from '@/utils/showLoader';
import NavBarI18n from '@core/components/I18n.vue';
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant';
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png';
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png';
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png';
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png';
import authV2MaskDark from '@images/pages/misc-mask-dark.png';
import authV2MaskLight from '@images/pages/misc-mask-light.png';
import { themeConfig } from '@themeConfig';
import { useStore } from 'vuex';

const showAssistant = ref(true);
const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const aiAssistantButton = ref(null);
let aiAssistant = null;
definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})
const store = useStore()
const isPasswordVisible = ref(false)
const route = useRoute()
const router = useRouter()
const { currentUser, currentRole, authService } = useAuth()
const isAIAssistantActive = ref(false);
const errors = ref({
  email: undefined,
  password: undefined,
})

const refVForm = ref()

const credentials = ref({
  email: '',
  password: '',
})

const isProcessingToken = ref(true);
const tokenError = ref(null);

// Function to set tokens in cookies
const setTokens = (accessToken) => {
  const providerAccessTokenCookie = useCookie('provider-accessToken');
  providerAccessTokenCookie.value = accessToken;
}

// Process the token from the route parameter
const processToken = async () => {
  try {
    showLoader();
    const token = route.params.token;

    if (!token) {
      throw new Error('No token provided');
    }
    setTokens(token);

    // Fetch user profile
    let profile = await authService.value.fetchProfile();
    if (profile.userData.user_type === 'provider') {
      router.replace('/provider/calendar');
    } else {
      router.replace('/provider/dashboard');
    }
    // Call API to validate and process the token
    // const response = await $api(`/emr/validate-token/${token}`, {
    //   method: 'GET',
    // });

    // if (response && response.accessToken) {
    //   // Set the access token
    //   setTokens(response.accessToken);

    //   // Fetch user profile
    //   let profile = await authService.value.fetchProfile();

    //   // Redirect based on user type

    // } else {
    //   throw new Error('Invalid or expired token');
    // }
  } catch (error) {
    tokenError.value = error.message || 'Failed to process authentication token';
    addAlert(tokenError.value, 'error');
    console.error('Token processing error:', error);
  } finally {
    hideLoader();
    isProcessingToken.value = false;
  }
};

onMounted(() => {
  // Process the token when component is mounted
  processToken();
});

onUnmounted(() => {
  // Cleanup if needed
});

const rememberMe = ref(false)

const handleSubmit = async () => {
  try {
    showLoader()
    await authService.value.providerLoginAcctoken(credentials.value.email, credentials.value.password)
    let profile = await authService.value.fetchProfile()
    hideLoader()

    console.log('Login Successful', profile.userData.user_type)
    await nextTick(() => {
      if (profile.userData.user_type === 'provider')
        router.replace(route.query.to ? String(route.query.to) : '/provider/calendar')
      else
        router.replace(route.query.to ? String(route.query.to) : '/provider/dashboard')
    })
  } catch (err) {
    hideLoader()
    addAlert(err.response?._data?.message ?? err.message, 'error')
    console.error(err)
  }
}




</script>

<template>
  <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
    :languages="themeConfig.app.i18n.langConfig" class="language-btn" />

  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol cols="12" md="12" class="auth-card-v2 d-flex align-center justify-center">
      <!-- Show loading or error message while processing token -->
      <VCard v-if="isProcessingToken" flat border :max-width="400" class="mt-12 mt-sm-0 pa-4">
        <VCardText class="text-center">
          <VProgressCircular indeterminate color="primary" />
          <p class="mt-4">{{ $t("Processing authentication token...") }}</p>
        </VCardText>
      </VCard>

      <!-- Show error message if token processing failed -->
      <VCard v-else-if="tokenError" flat border :max-width="400" class="mt-12 mt-sm-0 pa-4">
        <VCardText class="text-center">
          <VIcon size="48" color="error" icon="tabler-alert-circle" />
          <p class="mt-4">{{ $t("Authentication failed") }}</p>
          <p class="text-caption">{{ tokenError }}</p>
          <VBtn class="mt-4" to="/provider/login">
            {{ $t("Go to Login") }}
          </VBtn>
        </VCardText>
      </VCard>

      <!-- Show login form as fallback if needed -->
      <VCard v-else flat border :max-width="400" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <div class="auth-logo pt-1 py-5 d-flex justify-content-center align-items-center text-center gap-x-3">
            <VNodeRenderer :nodes="themeConfig.app.logo" />
            <h1 class="auth-title">
              {{ themeConfig.app.title }}
            </h1>
          </div>
        </VCardText>
        <VCardText>
          <p class="mb-0">
            {{ $t("Please sign-in to your account") }}
          </p>
        </VCardText>

        <VCardText>

        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
@use "@core/scss/template/pages/page-auth.scss";

.language-btn {
  position: absolute;
  right: 0;
}
</style>
