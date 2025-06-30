<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant';
import pages401 from '@images/pages/401.png';
import miscMaskDark from '@images/pages/misc-mask-dark.png';
import miscMaskLight from '@images/pages/misc-mask-light.png';
const router = useRouter()
const ability = useAbility()
const { currentRole, isAuthenticated } = useAuth()

// TODO: Get type from backend
const userData = useCookie('userData')
definePage({
  alias: '/pages/misc/not-authorized',
  meta: {
    layout: 'blank',
    public: true,
  },
})

// Function to handle "Back To Home" button click
const handleBackToHome = () => {
  console.log('currentRole.value', currentRole.value, isAuthenticated.value, userData);
  if (isAuthenticated.value) {
    // Redirect based on user role
    switch (currentRole.value) {
      case 'provider':
        router.push('/provider/dashboard')
        break
      case 'patient':
        router.push('/patient/dashboard')
        break
      case 'partner':
        router.push('/partner/dashboard')
        break
      case 'affiliate':
        router.push('/affiliate/dashboard')
        break
      case 'admin':
        router.push('/admin/provider')
        break
      default:
        router.push('/')
    }
  } else {
    // If not authenticated, redirect to login page
    router.push('/provider/login')
  }
}

onMounted(async () => {
  if (localStorage.getItem('userAbilityRules')) {
    const userAbilityRules = JSON.parse(localStorage.getItem('userAbilityRules'));
    console.log('userAbilityRules exists:', userAbilityRules);
  } else {
    // Remove "accessToken" from cookie
    // useCookie('accessToken').value = null

    // Remove "userData" from cookie
    // userData.value = null
    // localStorage.removeItem('userAbilityRules')
    // Redirect to login page
    // Remove "userAbilities" from cookie
    // useCookie('userAbilityRules').value = null

    // Reset ability to initial ability
    // ability.update([])
    // await router.push('/provider/login')
  }
})
const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader status-code="401" title="You are not authorized! 🔐"
      description="You don’t have permission to access this page. Go Home!." />

    <VBtn class="mb-11" @click="handleBackToHome">
      Back To Home
    </VBtn>

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg :src="pages401" alt="not autorized" :max-height="$vuetify.display.smAndDown ? 350 : 500" class="mx-auto" />
    </div>

    <img class="misc-footer-img d-none d-md-block" :src="authThemeMask" alt="misc-footer-img" height="320">
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";
</style>
