<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Affiliate Products View',
    },
})
import { useBuilderStore } from '@/stores/builderStore';
import { usePatientRegStore } from '@/stores/patientRegStore';
import debounce from 'lodash.debounce';
import { useRoute, useRouter } from 'vue-router';

const builderStore = useBuilderStore()
const patientRegStore = usePatientRegStore()

const showComponent = ref(true)
const route = useRoute();
const router = useRouter();

const bid = atob(route.query.bid);
localStorage.removeItem('patientRegStore')
patientRegStore.setState(null)

patientRegStore.patient.affiliate_email = route.query.af_ref ? atob(route.query.af_ref) : null
await builderStore.getUnauthBuilderById(bid)
console.log('builderStore.layout', builderStore.layout)
patientRegStore.patient.provider_id = builderStore.provider_id
await patientRegStore.getProductByProviderId(builderStore.provider_id)

patientRegStore.$subscribe(debounce((mutation, state) => {


    localStorage.setItem('patientRegStore', safeBtoa(JSON.stringify(state)))
    console.log('tracked!', localStorage.getItem('patientRegStore'))
    //     router.replace({ path: route.fullPath, query: { ...route.query, state: btoa(JSON.stringify(state)) } })
}))

onMounted(async () => {
    if (route.query.cart)
        router.replace('/affiliate/product-selection?bid=' + route.query.bid + '&cart=' + route.query.cart + '&af_ref=' + route.query.af_ref)
    else
        router.replace('/affiliate/product-selection')
})



</script>
<template></template>
