<script setup>
definePage({
  meta: {
    layout: 'blank',
    public: true
  },
})
import { LOGIN_PATIENT_API } from '../../utils/constants';
import DefinedSteps from './components/DefinedSteps.vue';
// import { useAppAbility } from '@/plugins/casl/useAppAbility';
import {
    emailValidator,
    requiredValidator
} from '@core/utils/validators';
import { onBeforeMount, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
const store = useStore()
const router = useRouter()
const route = useRoute()
const ability = useAbility()
const isMobile = ref(window.innerWidth <= 768);
const emailExist = ref(false)
const isTopLoadingVisible = ref(false);
const isLoadingVisible = ref(false)
const refVForm = ref()
const email = ref()
const password = ref(null)
const isPolicy = ref(false);
const user_role = ref();
const seetingPlanLogo = ref();
const settingSite = ref();
const isPasswordVisible = ref(false)
const canLogin = ref(false)
const inavlid = ref(false);
const InvalidCredential = ref()
const passwordCheck = ref(false)
const products = JSON.parse(localStorage.getItem('cart_products'));
const builderData = JSON.parse(localStorage.getItem('builderData'));
let preSelectedProducts = products.length
const prescreptionRequired = ref(false)
const errors = ref({
    password: undefined,
    email: undefined,
})
watch(isPolicy, (newVal) => {
    isTopLoadingVisible.value = false;
});
const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};
const onSubmit = async () => {

    refVForm.value?.validate().then(async ({ valid: isValid }) => {
        console.log('isValid ', isValid)
        if (isValid) {
            store.dispatch('updateIsTonalSnackbar', false)
            store.dispatch('updateErrorMessage', null)
            if (!canLogin.value) {



                await registerPatient()



            } else {
                passwordCheck.value = false
                await loginPatient()
            }


            // await register()
            // console.log(store.getters.getErrors.email)
            // if (!store.getters.getErrors.email) {
            //     await savePlan()
            //     router.replace(route.query.to && route.query.to != '/register' ? String(route.query.to) : 'book-appointment')
            // }
        }

    })
}

onBeforeMount(async () => {
    
    products.forEach(product => {
        if (product.is_prescription_required == 1) {

            prescreptionRequired.value = true
        } else {

            prescreptionRequired.value = false
        }
    });
})
onMounted(async () => {
    localStorage.setItem('next_page',builderData.patientFlow[0])
    console.log(builderData)
    window.addEventListener('resize', checkIfMobile);
    const b1 = document.querySelector('.bg-custom-color');
    if (b1) {
        b1.style.background = builderData.bg_color;
    }
    const bt = document.querySelector('.v-btn.bg-primary');
    if (bt) {
        console.log(bt);
        bt.style.setProperty('background-color', builderData.btn_color, 'important');
    }

    
})
onUnmounted(() => {
});

const registerPatient = async () => {
    errors.value = [];
    store.dispatch('updateIsLoading', true)
    isLoadingVisible.value = true;
    emailExist.value = false
    canLogin.value = false
    let emailRes = await store.dispatch('checkPatientEmail',{ email: email.value})

    if (emailRes.message.trim() === "Exists") {
        console.log(emailRes.message)
            emailExist.value = true
            canLogin.value = true
            localStorage.setItem('exist', true)
    } else {
        console.log('not ',emailRes.message)
        localStorage.setItem('email', email.value)
        localStorage.setItem('exist', false)
        emailExist.value = false
        canLogin.value = false
        passwordCheck.value = true


        if (password.value) {
            localStorage.setItem('password', password.value)
            router.replace(route.query.to ? String(route.query.to) : '/'+builderData.theme_name+'/register')
        }

    }

    

};

const loginPatient = async () => {
    store.dispatch('updateIsLoading', true)
    InvalidCredential.value = '';
    isLoadingVisible.value = true;
    try {
        const res = await $api(LOGIN_PATIENT_API, {
            method: 'POST',
            body: {
                email: email.value,
                password: password.value,
            },
            onResponseError({ response }) {
                store.dispatch('updateIsLoading', false);
                console.log('Response Error', response);
                inavlid.value = true;
                InvalidCredential.value = "Sorry, that email or password didn't work.";
                isLoadingVisible.value = false;
            }
        });

        if (res) {
            localStorage.setItem('patient_data', JSON.stringify(res.userData));
            localStorage.setItem('uuid', JSON.stringify(res.userData.uuid));
            localStorage.setItem("patient_id", res.userData.id);
            localStorage.setItem("patient_name", res.userData.fname+" "+res.userData.lname);
            // const { accessToken, userData, userAbilityRules,permissions } = res
            // const userAbilities = transformPermissions(permissions);
            // console.log('userAbilities login',userAbilities)
     
            // localStorage.setItem('userAbilityRules',JSON.stringify(userAbilities))
            // useCookie('userAbilityRules').value = userAbilities;
            // ability.update(userAbilities);
            // useCookie('userData').value = userData
            // useCookie('accessToken').value = accessToken
            store.dispatch('updateIsLoading', false);
            store.dispatch("savePatientPorfile", res.userData);
            
            if(preSelectedProducts>0)
            {
                router.replace(route.query.to ? String(route.query.to) : '/'+builderData.theme_name+'/'+builderData.patientFlow[0])
            }else{
                router.replace(route.query.to ? String(route.query.to) : '/'+builderData.theme_name+'/product-selection')
            }
        }
    } catch (error) {
        console.error('Login Error', error);
        store.dispatch('updateIsLoading', false);
        inavlid.value = true;
        InvalidCredential.value = "Sorry, that email or password didn't work.";
        isLoadingVisible.value = false;
    }

};



const changeEmail = () => {
    canLogin.value = false
    InvalidCredential.value = null
    password.value = null

};
const changeEmailSignUp = () => {
    canLogin.value = false
    passwordCheck.value = false
};
</script>

<template>
    <VRow
    style="min-height: 101.7dvh; max-height: 101.7dvh; margin: 0px;"
    :style="isMobile ? { marginTop: '90px' } : { marginTop: '0px' }"
    >
        <VCol cols="12" md="6" class="bg-custom col-order-1"
            :class="isMobile ? '' : 'auth-wrapper d-flex align-center justify-center pa-4'">
            <DefinedSteps></DefinedSteps>
        </VCol>
        <VCol cols="12" md="6" class="bg-custom-color col-order-2"
            :class="isMobile ? '' : 'auth-wrapper d-flex align-center justify-center pa-4'">
            <VCard class="auth-card pa-2 rounded-5" style="" :class="isMobile ? '' : 'card-wid'">
                <VCardItem class="py-2">
                    <VCardText class="p-0">
                        <h5 class="text-h5 mb-1 text-left">
                            Welcome! Need Our MD?
                        </h5>
                        <p v-if="canLogin">That's great, you've got an account! Welcome back!</p>
                        <p v-if="!canLogin">You'll need an account. Let get you setup!
                        </p>
                    </VCardText>

                    <VSnackbar v-model="store.getters.getIsTonalSnackbarVisible" :timeout="5000" location="top end"
                        variant="flat" color="red">
                        {{ store.getters.getErrorMessage }}
                    </VSnackbar>
                </VCardItem>
                <VCardText>

                    <VForm ref="refVForm" @submit.prevent="onSubmit">
                        <VRow>

                            <VCol cols="12" md="12" class="pb-0" v-if="canLogin">
                                <div class="float-right">
                                    <span style="color: #b1c3d5;">This is not your email? </span><span><a
                                            class=" cursor-pointer" @click="changeEmail()">(Change)</a></span>
                                </div>

                            </VCol>
                            <VCol cols="12" md="12" class="pb-0" v-if="passwordCheck">
                                <div class="float-right">
                                    <span style="color: #b1c3d5;">This is not your email? </span><span><a
                                            class=" cursor-pointer" @click="changeEmailSignUp()">(Change)</a></span>
                                </div>

                            </VCol>
                            <VCol cols="12" md="12" v-if="canLogin">
                                <VTextField v-model="email" label="Email Address" type="email"
                                    :rules="[requiredValidator,emailValidator]" :error-messages="errors.email"
                                    density="comfortable" :disabled="canLogin" />

                            </VCol>

                            <VCol cols="12" md="12" v-if="!canLogin">
                                <VTextField v-model="email" label="Email Address" type="email"
                                    :rules="[requiredValidator,emailValidator]" :error-messages="errors.email"
                                    density="comfortable" :disabled="passwordCheck" />
                            </VCol>
                            <VCol cols="12" v-if="canLogin">
                                <VTextField v-model="password" label="Password" placeholder="············"
                                    :rules="[requiredValidator]" :type="isPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isPasswordVisible ? 'bx-show' : 'bx-hide'"
                                    @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                            </VCol>
                            <VCol cols="12" class="pt-0 pb-0" v-if="canLogin">
                                <router-link :to="'/'+builderData.theme_name+'/forgot'" class="text-primary underline">Forgot Password?</router-link>

                            </VCol>
                            <VCol cols="12" v-if="passwordCheck">
                                <VTextField v-model="password" label="Password" placeholder="············"
                                    :rules="[requiredValidator]" :type="isPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isPasswordVisible ? 'bx-show' : 'bx-hide'"
                                    @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                            </VCol>
                        </VRow>

                        <VRow>
                            <VCol class="text-center" cols="12">
                                <p class="error-message" v-if="inavlid">{{ InvalidCredential }}</p>
                                <VBtn v-if="!canLogin" type="submit" class="text-center px-5" block>
                                    Continue
                                </VBtn>
                                <!-- Can Login and proceed -->
                                <VBtn v-if="canLogin" type="submit" class="text-center px-5" block>
                                    Continue
                                </VBtn>
                            </VCol>
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
@media (min-width: 960px) and (max-width: 1200px){
    .card-wid{
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
