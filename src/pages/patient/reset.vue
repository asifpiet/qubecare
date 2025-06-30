<script setup>
definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})
import { usePatientStore } from '@/stores/patientStore';
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant';
import authV2ForgotPasswordIllustrationDark from '@images/pages/auth-v2-forgot-password-illustration-dark.png';
import authV2ForgotPasswordIllustrationLight from '@images/pages/auth-v2-forgot-password-illustration-light.png';
import authV2MaskDark from '@images/pages/misc-mask-dark.png';
import authV2MaskLight from '@images/pages/misc-mask-light.png';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';

const patientStore = usePatientStore()
const router = useRouter()
const route = useRoute()
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const authThemeImg = useGenerateImageVariant(authV2ForgotPasswordIllustrationLight, authV2ForgotPasswordIllustrationDark)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const errors = ref({
  passcode: undefined,
});
const refVForm = ref()


const onSubmit = async () => {

  refVForm.value?.validate().then(async ({ valid: isValid }) => {
    console.log('isValid ', isValid)
    if (isValid) {
      // showLoader()
      try {

        await patientStore.resetPassword();
        router.replace(route.query.to ? String(route.query.to) : '/patient/login')
        addAlert('Password has been successfully reset.', 'success');
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
      // hideLoader()

    }

  })
}


</script>

<template>
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
            {{ $t('Reset Password') }}
          </h4>

        </VCardText>

        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField v-model="patientStore.passwordReset.passcode"
                  :rules="[requiredValidator, passcodeValidator]" :error-messages="errors.passcode" autofocus
                  :label="$t('Passcode')" type="number" maxlength="8" placeholder="1234" />
              </VCol>

              <VCol cols="12">
                <VTextField v-model="patientStore.passwordReset.password" :label="$t('Password')"
                  placeholder="············" :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye' : 'tabler-eye-off '"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />
              </VCol>
              <VCol cols="12">
                <VTextField v-model="patientStore.passwordReset.password_confirmation" :label="$t('Confirm Password')"
                  placeholder="············" :rules="[requiredValidator]"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye' : 'tabler-eye-off '"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />
              </VCol>



              <!-- Reset link -->
              <VCol cols="12">
                <VBtn block type="submit">
                  {{ $t('Reset') }}
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
