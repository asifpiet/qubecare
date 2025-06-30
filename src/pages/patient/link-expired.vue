<script setup>
definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant';
import pages401 from '@images/pages/401.png';
import miscMaskDark from '@images/pages/misc-mask-dark.png';
import miscMaskLight from '@images/pages/misc-mask-light.png';

const router = useRouter();
const route = useRoute();
const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark);

// Get error message from query parameter if available
const errorMessage = computed(() => route.query.message || 'Your link has expired or is invalid.');

// Function to go back to login
const goToLogin = () => {
  router.replace('/patient/login');
};
</script>

<template>
  <div class="misc-wrapper">
    <div style="z-index: 9;">
      <!-- Title and subtitle -->
      <div class="text-center mb-4">
        <h4 class="text-h4 font-weight-medium mb-2">
          Link Expired 🔒
        </h4>
        <p class="text-body-1 mb-6">
          Appointment Link expired. Please contact your doctor for more details.
        </p>

        <VBtn class="mb-6" @click="goToLogin">
          Go to Login
        </VBtn>
      </div>
    </div>

    <!-- Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg :src="pages401" alt="link expired" :max-height="$vuetify.display.smAndDown ? 350 : 500" class="mx-auto" />
    </div>

    <img class="misc-footer-img d-none d-md-block" :src="authThemeMask" alt="misc-footer-img" height="320">
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";
</style>
