<script setup>
definePage({
    meta: {
        layout: 'blank',
        public: true
    },
})
import DefaultTheme from '@/components/DefaultTheme.vue';
import { useBuilderStore } from '@/stores/builderStore';
import { usePatientRegStore } from '@/stores/patientRegStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import { showLoader } from '@/utils/showLoader';
import Appointment from '@/views/register-flow/appointment.vue';
import Blank from '@/views/register-flow/blank.vue';
import CategoryForm from '@/views/register-flow/categoryForm.vue';
import Form from '@/views/register-flow/form.vue';
import ComboForms from '@/views/register-flow/comboforms.vue';
import MultipleForms from '@/views/register-flow/multipleforms.vue';
import LoginSignup from '@/views/register-flow/login-signup.vue';
import Payment from '@/views/register-flow/payment.vue';
import ProductForm from '@/views/register-flow/productForm.vue';
import Products from '@/views/register-flow/products.vue';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import debounce from 'lodash.debounce';
import { nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePatientCompanyScripts } from '@/composables/useCompanyScripts';

const components = {
    login: LoginSignup,
    products: Products,
    appointment: Appointment,
    payment: Payment,
    forms: Form,
    blank: Blank,
    productForm: ProductForm,
    categoryForm: CategoryForm,
    comboforms: ComboForms,
    multipleforms: MultipleForms,
}
const builderStore = useBuilderStore()
const patientRegStore = usePatientRegStore()
const practitionerStore = usePractitionerStore()
const { initializeCompanyScripts } = usePatientCompanyScripts()

const showComponent = ref(true)
const route = useRoute();
const router = useRouter();

const bid = atob(route.query.bid);
// const builder = ref(null)
// const cart = route.query.cart
patientRegStore.currentIndex = 0
if (sessionStorage.getItem('patientRegStore')) {
    let data = JSON.parse(atob(sessionStorage.getItem('patientRegStore')))
    patientRegStore.setState(data)
}

patientRegStore.patient.affiliate = route.query.af_ref ? atob(route.query.af_ref) : null
await builderStore.getUnauthBuilderById(bid)
console.log('builderStore.layout', builderStore.layout)
await patientRegStore.getProductByProviderId(builderStore.provider_id)

practitionerStore.getPractitionerInfoUnAuth(builderStore.provider_id)
console.log('>>', practitionerStore.practitioner)

// Initialize company scripts after practitioner data is loaded
watch(() => practitionerStore.practitioner, (practitioner) => {
    if (practitioner && practitioner.company) {
        console.log('Practitioner company data loaded, injecting scripts:', practitioner.company)
        initializeCompanyScripts()
    }
}, { immediate: true })

onMounted(async () => { })

const onCompleted = () => {
    patientRegStore.currentIndex++
    showLoader()

    nextTick(() => {
        hideLoader()

        if (patientRegStore.currentIndex >= builderStore.layout.length) {
            router.replace(route.query.to ? String(route.query.to) : '/patient/thankyou')

        }
    })
}

const safeBtoa = (str) => {
    return btoa(unescape(encodeURIComponent(str)));
}

patientRegStore.$subscribe(debounce((mutation, state) => {


    sessionStorage.setItem('patientRegStore', safeBtoa(JSON.stringify(state)))
    console.log('tracked!', sessionStorage.getItem('patientRegStore'))
    //     router.replace({ path: route.fullPath, query: { ...route.query, state: btoa(JSON.stringify(state)) } })
}))
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
<script type="text/javascript">
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/6797ddc6825083258e0bb97c/1iikjkk78';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
})();
</script>
<template>
    <DefaultTheme>
        <div class="text-center"
            style="padding: 15px 10px 10px 10px; border-bottom: 1px solid #c0c0c0b0;position: fixed; width: 100%; z-index: 9;background: white;">
            <VNodeRenderer :nodes="logo" />
        </div>
        <div v-if="showComponent">
            <component @completed="onCompleted"
                :is="components[builderStore.layout[patientRegStore.currentIndex]?.type]"
                :data="builderStore.layout[patientRegStore.currentIndex]"
                v-if="!!builderStore.layout[patientRegStore.currentIndex]" :showNav="true">
            </component>
        </div>
    </DefaultTheme>
</template>
