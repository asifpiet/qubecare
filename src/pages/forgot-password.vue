<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2ForgotPasswordIllustrationDark from '@images/pages/auth-v2-forgot-password-illustration-dark.png'
import authV2ForgotPasswordIllustrationLight from '@images/pages/auth-v2-forgot-password-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'

const email = ref('')
const authThemeImg = useGenerateImageVariant(authV2ForgotPasswordIllustrationLight, authV2ForgotPasswordIllustrationDark)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})
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
            {{ $t("Forgot Password?") }}

          </h4>
          <p class="mb-0">
            {{ $t("Enter your email and we'll send you instructions to reset your password") }}

          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="() => { }">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField v-model="email" autofocus :label="$t('Email')" type="email" :placeholder="$t('Email')" />
              </VCol>

              <!-- Reset link -->
              <VCol cols="12">
                <VBtn block type="submit">
                  {{ $t("Send Reset Link") }}

                </VBtn>
                <VCol cols="12">
                  <RouterLink class="d-flex align-center justify-center" :to="{ name: 'provider-login' }">
                    <VIcon icon="tabler-chevron-left" size="20" class="me-1 flip-in-rtl" />
                    <span>{{ $t("Back to login") }}</span>
                  </RouterLink>
                </VCol>
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
