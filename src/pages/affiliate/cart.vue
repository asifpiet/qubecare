<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Affiliate Products View',
  },
})

import { onBeforeMount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const userData = useCookie('userData')
const products = JSON.parse(localStorage.getItem('cart_products'));
const totalShipping = ref(0)
const totalAmount = ref(0)
const grandTotal = ref(0)
const prescreptionRequired = ref(false)
const snackbar = ref(false);
const isMobile = ref(window.innerWidth <= 768);
const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};
const providerId = ref(null)
onBeforeMount(async () => {
    products.forEach(product => {
        var price = 0
        prescreptionRequired.value = false
        price = parseFloat(product.price);
        product.price = productTotal(product)
        const shippingPrice = parseFloat(0);
        totalShipping.value += product.qty * shippingPrice;
        totalAmount.value += product.qty * price;
        providerId.value = product.provider_id

    });
})
onMounted(async () => {


    let options = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };
    grandTotal.value = new Intl.NumberFormat('en-US', options).format(parseFloat(totalAmount.value) + parseFloat(totalShipping.value));
    // grandTotal.value = new Intl.NumberFormat('en-US', options).format(parseFloat(labKits[0].amount));
    totalAmount.value = new Intl.NumberFormat('en-US', options).format(totalAmount.value);
    totalShipping.value = new Intl.NumberFormat('en-US', options).format(totalShipping.value);
    window.addEventListener('resize', checkIfMobile);
});
const productTotalPreReq = (qty, price) => {
    let options = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };
    return new Intl.NumberFormat('en-US', options).format(qty * parseFloat(price));
};
const productTotal = (product) => {
    let options = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };
    return new Intl.NumberFormat('en-US', options).format(product.qty * parseFloat(product.price));
};

const copyLink = () => {
    const transformedArray = products.map(item => ({
        product_id: item.id,
        qty: item.qty,
        subscription: item.subscription,
        onetime: item.onetime
    }));
    const finalObject = {
        gender: "Male",
        products: transformedArray
    };
    const jsonString = JSON.stringify(finalObject);
    const base64Encoded = btoa(jsonString);
    console.log('jsonString',jsonString,base64Encoded)
    let baseURL = `${window.location.protocol}//${window.location.host}${router.options.history.base}`;
    let link = baseURL+'/cart?pid='+providerId.value+'&cart='+base64Encoded+'&af_ref='+btoa(userData.value?.email)

    navigator.clipboard.writeText(link).then(() => {
        snackbar.value = true; // Show success message
    });
};
</script>
<template>
    <v-snackbar v-model="snackbar" timeout="2000">
    Copied to clipboard!
    </v-snackbar>
    <VRow>
        <VCol cols="12" md="12">
            <VCard class="" :class="isMobile ? '' : 'auth-card pa-2 card-margin'" style="min-width: 90%;border: none;box-shadow: none;" color="">
                <v-card-text style="padding-left: 30px;">
                    <h4 style="font-weight: 700;font-size: 20px;font-family: system-ui;color: black;">{{ $t('Order Details') }}</h4>
                    <v-list class="bg-transparent text-yellow-theme-button">
                    <v-list-item-group>
                        <v-list-item v-for="product in products" :key="product.id" style="padding-left: 0px;">
                        <v-list-item-content>
                            <v-list-item-title style="font-size: 18px!important;font-family: sans-serif;">
                            {{ product.name }}
                            <span class="float-right ml-2">{{ product.price }}</span>
                            </v-list-item-title>
                        </v-list-item-content>
                        </v-list-item>
                        <v-list-item style="padding-top: 10px;padding-bottom: 10px;padding-left: 0px;">
                        <v-list-item-content>
                            <v-list-item-title style="font-size: 18px!important;font-family: sans-serif;">
                            <span style="padding-top: 10px;padding-bottom: 10px;"><b>{{ $t('Total') }}</b></span>
                            <span class="float-right ml-2" style="border-top: 1px solid silver;border-bottom: 1px solid silver;padding-top: 10px;padding-bottom: 10px;padding-left: 50px;">&nbsp;<b>{{ grandTotal }}</b></span>
                            </v-list-item-title>
                        </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                    </v-list>
                </v-card-text>

                <v-card-text>
                    <v-row justify="end">
                    <v-col cols="auto">
                        <VBtn color="primary">{{ $t('Checkout')}}</VBtn>
                    </v-col>
                    </v-row>
                    <v-row justify="end" class="mt-2">
                    <v-col cols="auto">
                        <VBtn color="secondary" outlined @click="copyLink">{{ $t('Copy Link') }}</VBtn>
                    </v-col>
                    </v-row>
                </v-card-text>
            </VCard>

        </VCol>
    </VRow>
</template>
<style>

</style>
