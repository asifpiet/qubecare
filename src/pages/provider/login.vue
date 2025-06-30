<script setup>
import { disconnectKitt } from '@/composables/kitt';
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
import { VForm } from 'vuetify/components/VForm';
import { useStore } from 'vuex';
const showAssistant = ref(false);
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
// const ability = useAbility()
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
onMounted(() => {
  setRouterInstances(router, route);
});

onUnmounted(() => {
  if (isAIAssistantActive.value) {
    disconnectKitt();
    isAIAssistantActive.value = false;
  }
});
const rememberMe = ref(false)
const startAIAssistant = async () => {

  if (!isAIAssistantActive.value) {
    //aiAssistant = initAIAssistant(aiAssistantButton.value.$el || aiAssistantButton.value);
    isAIAssistantActive.value = true;
    await nextTick(() => {
      router.replace(route.query.to ? String(route.query.to) : '/provider/agent')
    })
  }
}

const stopAIAssistant = () => {
  if (isAIAssistantActive.value) {
    console.log('Stopping AI Assistant...')
    disconnectKitt();
    isAIAssistantActive.value = false;
  }
}


const handleSubmit = async () => {

  try {
    showLoader()
    await authService.value.login(credentials.value.email, credentials.value.password)
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
    // store.commit('setErrorMsg', true)
    addAlert(err.response?._data?.message ?? err.message, 'error')
    // store.commit('setShowMsg', err.response?._data?.message ?? err.message)
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

  <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
    :languages="themeConfig.app.i18n.langConfig" class="language-btn" />
  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol cols="12" md="12" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat border :max-width="400" class="mt-12 mt-sm-0 pa-4">
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
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField v-model="credentials.email" :label="$t('Username')" :placeholder="$t('Username')"
                  type="text" autofocus :rules="[requiredValidator]" :error-messages="errors.email" />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField v-model="credentials.password" :label="$t('Password')" placeholder="············"
                  :rules="[requiredValidator]" :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="errors.password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye' : 'tabler-eye-off'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />

                <div class="d-flex align-center flex-wrap justify-space-between my-6">
                  <VCheckbox v-model="rememberMe" :label="$t('Remember me')" />
                  <RouterLink class="text-primary ms-2 mb-1" :to="{ name: 'provider-forgot-password' }">
                    {{ $t("Forgot Password?") }}

                  </RouterLink>
                </div>

                <VBtn block type="submit">
                  {{ $t("Login") }}
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol cols="12" class="text-center">
                <span> {{ $t("New on our platform?") }} </span>
                <RouterLink class="text-primary ms-1" :to="{ name: 'provider-register' }">
                  {{ $t("Create an account") }}




                </RouterLink>
                <!--   <VBtn block ref="aiAssistantButton" @click="startAIAssistant" v-if="!isAIAssistantActive" style="">
                  {{ $t("Register with AI Agent") }}
                </VBtn>
                <VBtn block @click="stopAIAssistant" color="error" v-else>
                  {{ $t("Stop with AI Agent") }}
                </VBtn> !-->

              </VCol>
              <VCol cols="12" class="text-center">
                <AIAssistant :enabled="showAssistant" />
              </VCol>
            </VRow>
          </VForm>
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
