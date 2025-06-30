<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { themeConfig } from '@themeConfig'
import { VForm } from 'vuetify/components/VForm'
import { PATIENT_LOGIN_API } from '../../utils/constants'
const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const isPasswordVisible = ref(false)
const route = useRoute()
const router = useRouter()
const ability = useAbility()

const errors = ref({
  email: undefined,
  password: undefined,
})

const refVForm = ref()

const credentials = ref({
  email: 'VNS-admin-34',
  password: '2Uj3Y3fKDgVgLbf',
})

const rememberMe = ref(false)

const handleSubmit  = async () => {
  
  try {
    const res = await $api(PATIENT_LOGIN_API, {
      method: 'POST',
      body: {
        username: credentials.value.email,
        password: credentials.value.password,
      },
      onResponseError({ response }) {
        errors.value = response._data.errors
      },
    })
    console.log(res)
   
    // const res = await login(credentials.value.email, credentials.value.password);
    const { accessToken, userData, userAbilityRules } = res

    useCookie('userAbilityRules').value = userAbilityRules
    ability.update(userAbilityRules)
    useCookie('userData').value = userData
    useCookie('accessToken').value = accessToken
    await nextTick(() => {
      router.replace(route.query.to ? String(route.query.to) : '/QubeAdvance/dashboard')
    })
  } catch (err) {
    console.error(err)
  }
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
    handleSubmit()
  })
}
</script>

<template>
  

  <VRow
    no-gutters
    class="auth-wrapper bg-surface"
  >
    <VCol
      cols="12"
      md="12"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard
        flat border
        :max-width="400"
        class="mt-12 mt-sm-0 pa-4"
      >
      <VCardText>
      
        <div class="auth-logo d-flex align-center gap-x-3">
          <VNodeRenderer :nodes="themeConfig.app.logo" />
          <h1 class="auth-title">
            {{ themeConfig.app.title }}
          </h1>
        </div>
      </VCardText>
        <VCardText>
          <!-- <h4 class="text-h4 mb-1">
          Welcome to <span class="text-capitalize"> {{ themeConfig.app.title }} </span>
          </h4> -->
          <p class="mb-0">
           {{ $t('Please sign-in to your account') }} 
          </p>
        </VCardText>
       
        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="credentials.email"
                  :label="$t('Email')"
                  :placeholder="$t('Email')"
                  type="text"
                  autofocus
                  :rules="[requiredValidator]"
                  :error-messages="errors.email"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="credentials.password"
                  :label="$t('Password')"
                  placeholder="············"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="errors.password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye' : 'tabler-eye-off'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between my-6">
                  <VCheckbox
                    v-model="rememberMe"
                    label="Remember me"
                  />
                  <RouterLink
                    class="text-primary ms-2 mb-1"
                    :to="{ name: 'forgot-password' }"
                  >
                    {{ $t('Forgot Password?') }}
                  </RouterLink>
                </div>

                <VBtn
                  block
                  type="submit"
                >
                  {{ $t('Login') }}
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-center"
              >
                <span>{{ $t('New on our platform?') }}</span>
                <RouterLink
                  class="text-primary ms-1"
                  :to="'/QubeAdvance/register'"
                >
                  {{ $t('Create an account') }}
                </RouterLink>
              </VCol>
              <VCol
                cols="12"
                class="d-flex align-center"
              >
                <!-- <VDivider />
                <span class="mx-4">or</span>
                <VDivider /> -->
              </VCol>

              <!-- auth providers -->
              <!-- <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol> -->
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
