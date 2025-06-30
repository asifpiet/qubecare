<script setup>
definePage({
    meta: {
        layout: 'blank',
        public: true
    },
})
import { useBuilderStore } from '@/stores/builderStore';
import { usePatientRegStore } from '@/stores/patientRegStore';
import { useRoute, useRouter } from 'vue-router';


const builderStore = useBuilderStore()
const patientRegStore = usePatientRegStore()

const showComponent = ref(true)
const route = useRoute();
const router = useRouter();

const bid = atob(route.query.bid);


patientRegStore.patient.affiliate_email = route.query.af_ref ? atob(route.query.af_ref) : null
await builderStore.getUnauthBuilderById(bid)
console.log('builderStore.layout', builderStore.layout)
patientRegStore.patient.provider_id = builderStore.provider_id
await patientRegStore.getProductByProviderId(builderStore.provider_id)

onMounted(async () => {

    let url = `/patient/products?bid=${route.query.bid}`;

    if (route.query.cart) url += `&cart=${route.query.cart}`;

    if (patientRegStore.patient.affiliate_email) url += `&af_ref=${btoa(patientRegStore.patient.affiliate_email)}`;
    router.replace(url);
})



</script>
<template></template>
