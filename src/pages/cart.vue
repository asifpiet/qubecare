<script setup>
import { useBuilderStore } from '@/stores/builderStore';
import { usePatientRegStore } from '@/stores/patientRegStore';
import LoginSignup from '@/views/register-flow/login-signup.vue';
import { useRoute } from 'vue-router';
const components = {
    login: LoginSignup
}
const builderStore = useBuilderStore()
const patientRegStore = usePatientRegStore()

definePage({
    meta: {
        layout: 'blank',
        public: true
    },
})
const route = useRoute();
const bid = atob(route.query.bid);
// const builder = ref(null)
const cartEncoded = ref(
    {
        "gender": "Male",
        "doctor_visit": "89.00",
        "products": [
            {
                "product_id": 14,
                "qty": 1,
                "subscription": true,
                "onetime": false
            },
            {
                "product_id": 15,
                "qty": 1,
                "subscription": true,
                "onetime": false
            },
            {
                "product_id": 17,
                "qty": 1,
                "subscription": false,
                "onetime": true
            }
        ]
    }
);
const cartJson = ref()
// const cart = route.query.cart
patientRegStore.currentIndex = 0
patientRegStore.affiliate = route.query.af_ref ? atob(route.query.af_ref) : null
builderStore.getUnauthBuilderById(bid)
onBeforeMount(async () => {
    // builder.value = {
    //     id: builderStore.id,
    //     name: builderStore.name,
    //     data: builderStore.layout,
    //     provider_id: builderStore.provider_id,
    // }
    // if (cart) {
    //     await patientRegStore.getProductByProviderId(builderStore.provider_id)
    //     const encodedCart = encodeCartJson();
    //     console.log('Encoded:', encodedCart);

    //     decodeCartJson(cart);
    //     console.log('Decoded:', cartJson.value);

    //     const finalArray = cartJson.value.map(cartItem => {
    //         const matchedProduct = patientRegStore.products.find(plan => plan.id === cartItem.product_id);
    //         if (matchedProduct) {
    //             return {
    //                 ...matchedProduct,
    //                 qty: cartItem.qty,
    //                 subscription: cartItem.subscription,
    //                 onetime: cartItem.onetime
    //             };
    //         }
    //         return null;
    //     }).filter(item => item !== null);

    //     patientRegStore.cart_products = finalArray;
    // }
});

onMounted(async () => { })

const onCompleted = () => {

}

const encodeCartJson = () => {
    const jsonStr = JSON.stringify(cartEncoded.value);
    const encodedStr = btoa(jsonStr);
    return encodedStr;
}

const decodeCartJson = (encodedStr) => {
    const jsonStr = atob(encodedStr);
    const decodedJson = JSON.parse(jsonStr);
    cartJson.value = decodedJson.products;
}
</script>
<template>
    <component :is="components[builderStore.layout[patientRegStore.currentIndex]?.type]"></component>
</template>
