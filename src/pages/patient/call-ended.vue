<script setup>
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant';
import miscMaskDark from '@images/pages/misc-mask-dark.png';
import miscMaskLight from '@images/pages/misc-mask-light.png';

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)
onMounted(async () => {
    sessionStorage.removeItem('patientRegStore')
});

const goToDashboard = () => {
    window.location.href = 'https://peptidewebmd.com';
};
</script>

<template>
    <div class="misc-wrapper">
        <div style="z-index: 9; ">
            <!-- 👉 Title and subtitle -->
            <div class="text-center mb-4">
                <h4 class="text-h4 font-weight-medium mb-2">
                    Thankyou for calling our provider. 🎉
                </h4>
                <p class="text-body-1 mb-6">
                    In case you have any questions, please reach out to support at
                    <a href="mailto:support@peptidewebmd.com">support@peptidewebmd.com</a> or refer to
                    the FAQs.
                </p>

                <VCol cols="12" class="pt-3 mb-4 text-center">
                    <RouterLink to="/patient/dashboard">

                        <VBtn class="text-capitalize">
                            <b>Go to Dashboard</b>
                        </VBtn>
                    </RouterLink>
                </VCol>
            </div>
        </div>



        <img class="misc-footer-img d-none d-md-block" :src="authThemeMask" alt="misc-footer-img" height="320">
    </div>
</template>

<style lang="scss" scoped>
@use "@core/scss/template/pages/misc.scss";

.misc-email-input {
    max-inline-size: 22.75rem;
    min-inline-size: 14.75rem;
}

.misc-form {
    margin-block-end: 4rem;
}

@media screen and (max-width: 575.98px) {
    .misc-form {
        margin-block-end: 3rem;
    }
}
</style>
