<script setup>
definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})
import { usePatientStore } from '@/stores/patientStore';
import NavBarI18n from '@core/components/I18n.vue';
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant';
import authV2ForgotPasswordIllustrationDark from '@images/pages/auth-v2-forgot-password-illustration-dark.png';
import authV2ForgotPasswordIllustrationLight from '@images/pages/auth-v2-forgot-password-illustration-light.png';
import authV2MaskDark from '@images/pages/misc-mask-dark.png';
import authV2MaskLight from '@images/pages/misc-mask-light.png';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
const email = ref('')
const patientStore = usePatientStore()
const router = useRouter()
const route = useRoute()
const authThemeImg = useGenerateImageVariant(authV2ForgotPasswordIllustrationLight, authV2ForgotPasswordIllustrationDark)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const errors = ref({
  email: undefined,
});
const refVForm = ref()

const onSubmit = async () => {

  refVForm.value?.validate().then(async ({ valid: isValid }) => {
    console.log('isValid ', isValid)
    if (isValid) {
      showLoader()
      try {

        await patientStore.forgotPassword(email.value);
        router.replace(route.query.to ? String(route.query.to) : '/patient/reset')
        addAlert('Password reset passcode has been sent to your email.', 'success');
      } catch (e) {
        console.error('Error Response:', e.response);

        if (e.response?.status === 422) {
          const errorMessages = e.response?._data?.errors;
          if (errorMessages) {
            const formattedMessages = Object.values(errorMessages)
              .flat()
              .join(' ');
            addAlert(formattedMessages, 'error');
          } else {
            addAlert('something went wrong.', 'error');
          }
        }
        else if (e.response?.status === 400) {
          console.log('404', e.response?._data?.message, e.response?.data?.message ?? e.message);
          addAlert(e.response?._data?.message, 'error');
        }
        else {
          console.log('else', e.message, e.response);
          addAlert(e.response?._data?.message ?? e.message, 'error');
        }

      }
      hideLoader()

    }
  })
}
</script>

<template>
  <div class="language-dropdown">
      <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
                  :languages="themeConfig.app.i18n.langConfig" 
                  class="language" />
    </div>
  <VRow class="auth-wrapper bg-surface" no-gutters>
    <VCol cols="12" md="12" class="d-flex align-center justify-center">
      <VCard flat border :max-width="400" class="mt-12 mt-sm-0 pa-4">

        <div class="auth-logo pt-1 py-5 d-flex justify-content-center align-items-center text-center gap-x-3">
          <VNodeRenderer :nodes="themeConfig.app.logo" />
          <h1 class="auth-title">
            {{ themeConfig.app.title }}
          </h1>
        </div>


        <VCardText>
          <h4 class="text-h4 mb-1 pt-9">
            {{ $t('Forgot Password?') }}
          </h4>
          <p class="mb-0">
            {{ $t(`Enter your email and we'll send you instructions to reset your password`) }}
          </p>
        </VCardText>

        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField v-model="email" :rules="[requiredValidator, emailValidator]"
                  :error-messages="errors.email" autofocus :label="$t('Email')" type="email"
                  :placeholder="$t('Email')" />
              </VCol>

              <!-- Reset link -->
              <VCol cols="12">
                <VBtn block type="submit">
                  {{ $t('Send Passcode') }}
                </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <RouterLink class="d-flex align-center justify-center" :to="'/patient/login'">
                  <VIcon icon="tabler-chevron-left" size="20" class="me-1 flip-in-rtl" />
                  <span>{{ $t('Back to login') }}</span>
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
<style scoped>
.language-dropdown {
  position: fixed;
  top: 10px;  /* Adjust the distance from the top */
  right: 10px; /* Adjust the distance from the right */
  z-index: 1000; /* Ensure it's above other content */
}

.language-dropdown .language {
  cursor: pointer;
  padding: 5px 10px;
  background-color: transparent;
  /* border-radius: 5px; */
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); */
}

.language-dropdown .language:hover {
  /* background-color: #f0f0f0; */
}
</style>
