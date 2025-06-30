<script setup>
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})


import { usePatientCompanyScripts } from '@/composables/useCompanyScripts';
import { useBuilderStore } from '@/stores/builderStore';
import { usePatientRegStore } from '@/stores/patientRegStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import { addAlert } from '@/utils/showLoader';
import NavBarI18n from '@core/components/I18n.vue';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import debounce from 'lodash.debounce';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const builderStore = useBuilderStore()
const patientRegStore = usePatientRegStore()
const practitionerStore = usePractitionerStore()
const { initializeCompanyScripts } = usePatientCompanyScripts()

practitionerStore.getPractitionerInfoUnAuth(builderStore.provider_id)
patientRegStore.patient.provider_id = builderStore.provider_id
console.log('>>', practitionerStore.practitioner)

if (localStorage.getItem('patientRegStore')) {
    let data = JSON.parse(atob(localStorage.getItem('patientRegStore')))
    patientRegStore.setState(data)
}
const visibility = ref('hidden')
const route = useRoute();
const router = useRouter();
const bid = atob(route.query.bid);
const products = ref([])
const pcart = route.query.cart
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
patientRegStore.patient.affiliate_email = route.query.af_ref ? atob(route.query.af_ref) : null
await builderStore.getUnauthBuilderById(bid)
console.log('builderStore.layout', builderStore.layout)
await patientRegStore.getProductByProviderId(builderStore.provider_id)

products.value = patientRegStore.products.filter(item => item.provider_id !== null && item.status === 'active');

// Initialize company scripts after practitioner data is loaded
watch(() => practitionerStore.practitioner, (practitioner) => {
    if (practitioner && practitioner.company) {
        console.log('Practitioner company data loaded, injecting scripts:', practitioner.company)
        initializeCompanyScripts()
    }
}, { immediate: true })

const encodeCartJson = () => {
    const jsonStr = JSON.stringify(cartEncoded.value);
    const encodedStr = btoa(jsonStr);
    return encodedStr;
}

const decodeCartJson = (encodedStr) => {
    const jsonStr = atob(encodedStr);
    const decodedJson = JSON.parse(jsonStr);
    cartJson.value = decodedJson.products;
    console.log('decodedJson', decodedJson)
    patientRegStore.wp_order_id = decodedJson.wp_order_id ?? null
    console.log('decodedJson', decodedJson.wp_order_id, patientRegStore.wp_order_id)
}
onBeforeMount(async () => {
    if (pcart) {
        const encodedCart = encodeCartJson();
        console.log('Encoded:', encodedCart);

        decodeCartJson(pcart);
        console.log('Decoded:', cartJson.value, patientRegStore.products);

        for (let p of patientRegStore.products) {
            const matchedProduct = cartJson.value.find(item =>
                (item.site_product_id ?? item.product_id) == (p.wp_pro_id || p.id)
            );

            p.variation_id = matchedProduct
                ? (matchedProduct.site_variation_id !== null && matchedProduct.site_variation_id !== undefined
                    ? matchedProduct.site_variation_id
                    : matchedProduct.variation_id ?? null)
                : null;

            console.log('Final variation_id:', matchedProduct, p.variation_id);
        }

        const finalArray = cartJson.value.map(cartItem => {
            const matchedProduct = patientRegStore.products.find(plan =>
                String(plan.wp_pro_id ?? plan.id) === String(cartItem.site_product_id ?? cartItem.product_id)
            );

            console.log('matchedProduct', matchedProduct);
            if (matchedProduct) {
                return {
                    ...matchedProduct,
                    site_product_id: cartItem.site_product_id ? cartItem.site_product_id : cartItem.product_id,
                    qty: cartItem.qty,
                    subscription: cartItem.subscription,
                    onetime: cartItem.onetime,
                    variation_id: cartItem.site_variation_id ?? cartItem.variation_id ?? null // Ensuring fallback
                };
            }
            return null;
        }).filter(item => item !== null);

        console.log('finalArray', finalArray)
        patientRegStore.cart_products = finalArray.filter(product => product.status === 'active');

        let url = `/patient/payment?bid=${route.query.bid}`;

        if (route.query.cart) url += `&cart=${route.query.cart}`;

        if (patientRegStore.patient.affiliate_email) url += `&af_ref=${btoa(patientRegStore.patient.affiliate_email)}`;
        router.replace(url);
    } else {
        visibility.value = 'unset'
    }
});

onMounted(async () => {

});

const toggleCart = (product) => {
    const productIndex = patientRegStore.cart_products.findIndex(item => item.id === product.id);
    if (productIndex !== -1) {
        patientRegStore.cart_products.splice(productIndex, 1);
    } else {

        const productWithDefaults = {
            ...product,
            site_product_id: product.wp_pro_id ?? product.id,
            qty: 1,
            subscription: product.subscription || false,
            onetime: product.onetime || true,
            variation_id: product.variation_id ?? null,
        };
        patientRegStore.cart_products.push(productWithDefaults);
    }
};

const isInCart = (productId) => {
    return patientRegStore.cart_products.some(item => item.id === productId);
};

const encodeBase64Unicode = (obj) => {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}
const showCart = () => {
    console.log('cartCount', patientRegStore.cart_products.length)
    // alert('Cart contains: ' + cart.value.map(item => item.name).join(', '));
    if (patientRegStore.cart_products.length > 0) {

        let url = '/patient/payment?bid=' + route.query.bid + '&cart=' + encodeBase64Unicode(patientRegStore.cart_products);

        if (patientRegStore.patient.affiliate_email) url += `&af_ref=${btoa(patientRegStore.patient.affiliate_email)}`;

        router.replace(url);
    } else {
        addAlert('Select a product', 'error')
    }

};

const safeBtoa = (str) => {
    return btoa(unescape(encodeURIComponent(str)));
}

patientRegStore.$subscribe(debounce((mutation, state) => {


    localStorage.setItem('patientRegStore', safeBtoa(JSON.stringify(state)))
    console.log('tracked!', localStorage.getItem('patientRegStore'))
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

<template>
    <div style="background-color: white;">
        <div :style="{ visibility: visibility }">
            <div class="text-center"
                style="padding: 15px 10px 10px 10px; border-bottom: 1px solid #c0c0c0b0;position: fixed; width: 100%; z-index: 1004;background: white;">
                <VNodeRenderer :nodes="logo" />
            </div>
            <div class="language-dropdown">
                <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
                    :languages="themeConfig.app.i18n.langConfig" class="language" />
            </div>
            <v-container>
                <v-row class="mb-2" style="margin-top: 60px;">
                    <VCol cols="12" md="12">
                        <div class="float-right">
                            <v-badge :content="patientRegStore.cart_products.length" color="primary" class="ml-2">
                                <span class="caption">{{ $t('Items in Cart') }} &nbsp;&nbsp;</span>
                            </v-badge>
                        </div>
                    </VCol>
                    <v-col v-for="product in products" :key="product.id" cols="12" md="4">
                        <v-card>
                            <!-- <v-img :src="product.image || 'https://via.placeholder.com/150'" height="200px" class="w-100"
                        cover></v-img> -->
                            <v-card-title>
                                <v-row>
                                    <v-col class="text-start">{{ product.name }}</v-col>
                                </v-row>
                            </v-card-title>
                            <v-card-text v-if="product.vartions">
                                <v-select v-model="product.variation_id" :items="Object.entries(product.vartions).map(([key, variation]) => ({
                                    value: Number(key),
                                    title: variation.pa_variants
                                }))" item-title="title" item-value="value" label="Select Variation"
                                    density="compact"></v-select>
                            </v-card-text>
                            <!-- <v-card-subtitle class="mb-4">{{ product.description }}</v-card-subtitle> -->
                            <div class="text-center" style="margin: 10px;">
                                <v-btn @click="toggleCart(product)" :color="isInCart(product.id) ? 'error' : 'primary'"
                                    class="mb-4" :title="isInCart(product.id) ? 'Remove from cart' : 'Add to cart'"
                                    rounded block :disabled="product.vartions && !product.variation_id">
                                    <VIcon start
                                        :icon="isInCart(product.id) ? 'tabler-shopping-cart-minus' : 'tabler-shopping-cart-plus'" />
                                    ${{
                                        product.price }}
                                </v-btn>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
                <v-divider></v-divider>

                <div class="mt-4 float-right">
                    <v-btn @click="showCart" color="success">{{ $t('Next') }}</v-btn>
                </div>
            </v-container>
        </div>
    </div>
</template>
<style scoped>
.bg-custom {
    background: #f5fbf9;
}
</style>
<style scoped>
.language-dropdown {
    position: fixed;
    top: 10px;
    /* Adjust the distance from the top */
    right: 10px;
    /* Adjust the distance from the right */
    z-index: 100000;
    /* Ensure it's above other content */
}

.language-dropdown .language {
    cursor: pointer;
    padding: 5px 10px;
    background-color: transparent;
    /* border-radius: 5px; */
    /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); */
}

.language-dropdown .language:hover {
    /* background-color: #f0f0f0; */
}
</style>
