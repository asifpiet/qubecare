<script setup>
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})
import { useAuth } from '@/composables/useAuth';
import { hideLoader, showLoader } from '@/utils/showLoader';
import NavBarI18n from '@core/components/I18n.vue';
import {
    emailValidator,
    requiredValidator
} from '@core/utils/validators';
import { themeConfig } from '@themeConfig';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter()
const route = useRoute()
const { currentRole, authService } = useAuth()
const isMobile = ref(window.innerWidth <= 768);
const refVForm = ref()
const email = ref()
const password = ref(null)
const isPasswordVisible = ref(false)
const inavlid = ref(false);
const InvalidCredential = ref()
const errors = ref({
    password: undefined,
    email: undefined,
})

const handleSubmit = async () => {

    try {
        showLoader()
        await authService.value.login(email.value, password.value)
        hideLoader()
        await nextTick(() => {
            router.replace(route.query.to ? String(route.query.to) : '/patient/dashboard')
        })
    } catch (err) {
        hideLoader()
        if (err.response?.status === 401) {
            addAlert('Incorrect email or password', 'error');
        } else {
            // Handle other errors
            addAlert(err.response?._data?.message ?? err.message, 'error');
        }
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
    :languages="themeConfig.app.i18n.langConfig" class="language" />
    <VRow style="min-height: 101.7dvh; max-height: 101.7dvh; margin: 0px;"
        :style="isMobile ? { marginTop: '90px' } : { marginTop: '0px' }">
        <VCol cols="12" md="12" class="" :class="isMobile ? '' : 'd-flex align-center justify-center pa-4'">
            <VCard class="auth-card pa-2 rounded-5" style="" :class="isMobile ? '' : 'card-wid'">
                <VCardItem class="py-2">
                    <VCardText class="px-0">
                        <h5 class="text-h5 mb-1">
                            {{ $t('Hey There, Welcome Back!') }}
                        </h5>
                        <small> {{ $t('Please sign-in to your account') }}</small>
                    </VCardText>
                </VCardItem>
                <VCardText>

                    <VForm ref="refVForm" @submit.prevent="onSubmit">
                        <VRow>
                            <VCol cols="12" md="12">
                                <VTextField v-model="email" :label="$t('Email Address')" type="email"
                                    :rules="[requiredValidator, emailValidator]" :error-messages="errors.email"
                                    density="comfortable" />

                            </VCol>
                            <VCol cols="12">
                                <VTextField v-model="password" :label="$t('Password')" placeholder="············"
                                    :rules="[requiredValidator]" :type="isPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isPasswordVisible ? 'bx-show' : 'bx-hide'"
                                    @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                            </VCol>
                            <VCol cols="12" class="pt-0 pb-0" md="6" sm="12">
                                <router-link :to="'/patient/forgot'" class="text-primary underline">
                                    {{ $t('Forgot Password?') }}</router-link>

                            </VCol>

                        </VRow>

                        <VRow>
                            <VCol class="text-center" cols="12">
                                <p class="error-message" v-if="inavlid">{{ InvalidCredential }}</p>
                                <!-- Can Login and proceed -->
                                <VBtn type="submit" class="text-center px-5" block>
                                    {{ $t('Login') }}
                                </VBtn>
                            </VCol>

                            <!-- <VCol cols="12" class="pt-0 pb-0 text-right" md="12" sm="12">
                                <span>Don't have account? </span>
                                <router-link :to="'/patient/register'" class="text-primary underline">Sign Up</router-link>

                            </VCol> -->
                        </VRow>


                        <VRow>
                        </VRow>
                    </VForm>

                </VCardText>
            </VCard>
            <!-- </div> -->
        </VCol>
    </VRow>
    <!-- </div> -->
    <!-- <Footer></Footer> -->
</template>
<style scoped>
.language{
  position:relative;
   /* left:100%;
   right:30%;
   top:10; */
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
    width: 600px;
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
.bg-custom-color {
    background: #00A68B;
}

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
