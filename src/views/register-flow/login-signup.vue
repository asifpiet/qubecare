<script setup>
definePage({
    meta: {
        layout: 'blank',
        public: true
    },
})

import { usePatientRegStore } from '@/stores/patientRegStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import CheckEmail from './check-email.vue';
// import DefinedSteps from './components/DefinedSteps.vue';
import Login from './login.vue';
import Register from './signup.vue';

const practitionerStore = usePractitionerStore()
const appName = import.meta.env.VITE_APP_NAME ?? 'Peptide WebMD';
const emit = defineEmits(['completed']);
const patientRegStore = usePatientRegStore()

const isMobile = ref(window.innerWidth <= 768);


const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};

onMounted(async () => {
    window.addEventListener('resize', checkIfMobile);
})

watch(
    () => practitionerStore.practitioner?.company?.logo,
    (newLogo) => {
        if (newLogo) {
            themeConfig.app.logo = h('div', { innerHTML: `<img src="${newLogo}" alt="Logo" style="width:160px;">` });
        }
    },
    { immediate: true } // Trigger the watcher immediately on component mount
);
const logo = computed(() => {
    console.log(practitionerStore.practitioner)
    return themeConfig.app.logo;
});
</script>

<template>
    <VRow style="margin: 0px;position: relative;top:60px;"
        :style="isMobile ? { marginTop: '0px' } : { marginTop: '0px' }" class="bg-custom">
        <VCol cols="12" class="px-8 py-8">
            <VCard>
                <VRow style="">
                    <VCol cols="12" md="6" class="" :class="isMobile ? '' : 'align-center justify-center pa-4'"
                        style="max-width: 450px; margin: auto;background-color: white !important;">

                        <div class="auth-card pa-2 rounded-5" style="" :class="isMobile ? '' : ''">
                            <div class="text-center">
                                <VNodeRenderer :nodes="logo" />
                            </div>
                            <div>
                                <CheckEmail v-if="patientRegStore.currentState === 'checklogin'"></CheckEmail>
                                <Login v-if="patientRegStore.currentState === 'login'" @completed="emit('completed')">
                                </Login>
                                <Register v-if="patientRegStore.currentState === 'register'"
                                    @completed="emit('completed')">
                                </Register>

                            </div>
                        </div>
                        <!-- </div> -->
                    </VCol>
                    <VCol cols="12" md="6" class="bg-custom" v-if="!isMobile"
                        :class="isMobile ? '' : 'd-flex align-center justify-center pa-0'">
                        <img src="/images/doctor-patient.png" class="full-image" />
                    </VCol>
                </VRow>
            </VCard>
        </VCol>
    </VRow>
    <!-- </div> -->
    <!-- <Footer></Footer> -->
</template>
<style scoped>
.full-image {
    width: 100%;
    height: calc(30px + 90vh);
    object-fit: cover;
    /* Ensures full visibility */
    max-width: 100%;
}

@media only screen and (max-width: 768px) {
    .card-wid {
        max-width: 600px !important;
        min-width: auto !important;
    }

    .col-order-1 {
        order: 2;
    }

    .col-order-2 {
        order: 1;
    }
}

@media (min-width: 960px) and (max-width: 1200px) {
    .card-wid {
        min-width: auto !important;
    }
}

@media only screen and (min-width: 769px) {
    .col-order-1 {
        order: 1;
    }

    .col-order-2 {
        order: 2;
    }
}

.total-font {
    font-size: 20px;
    margin-bottom: 5px;
}

.bg-custom {
    background: #F3F3F3;
}



.bg-white bg-change-bk .current-plan {
    border: 2px solid rgb(var(--v-theme-primary));
}

.cut-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: line-through;
    text-decoration-color: red;
    text-decoration-thickness: 1px;
}

.plan-card {
    margin: 0rem;
    margin-bottom: 0;
}

.card-wid {
    min-width: 600px;
}

.layout-wrapper {
    justify-content: center;
}

.error-message {
    color: #ff2f2f;
    font-size: 15px;
}
</style>

<style>
.v-card.v-card--flat.v-theme--light.v-card--density-default.v-card--variant-elevated.text-center.search-header.rounded-0 {
    block-size: 357px;
    inset-block-start: -185px;
}

body {
    display: block !important;
}

a.nav-link.fw-medium {
    color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}

.light-style .layout-navbar .menu-text {
    color: #5d596c !important;
}

span.app-brand-text.demo.menu-text.fw-bold.ms-2.ps-1 {
    color: #5d596c !important;
}

.navbar.landing-navbar {
    border-color: rgba(255, 255, 255, 68%) !important;
    background: white;
    margin: 0;
    border-radius: 0;
    box-shadow: 0px 10px 10px #00000029;
}

.landing-footer .footer-top {
    background-color: #1C5580;
    border-radius: none !important;
    /* background: url("/assets/img/front-pages/backgrounds/footer-bg-dark.png"); */
}

.footer-bottom.py-3 {
    background-color: #282c3e;
}

.light-style .landing-footer .footer-link,
.light-style .landing-footer .footer-text {
    color: #d3d4dc !important;
}

.light-style .landing-footer .footer-link,
.light-style .landing-footer .footer-text {
    color: #d3d4dc;
}

a.footer-link {
    color: #d3d4dc;
}

.light-style .landing-footer .footer-title {
    color: #fff;
}

.footer-title {
    color: #fff;
}

.footer-text {
    color: #d3d4dc;
}

@media (max-width: 355px) {
    .first-section-pt {
        margin-block-start: -121px !important;
    }
}

.logo-img {
    display: block;
    position: relative;
    margin: 0 auto;
}

/* // @use "@core/scss/template/pages/page-auth.scss"; */
</style>
