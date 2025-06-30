<script setup>
import { onBeforeMount, onMounted, ref } from 'vue';
const products = JSON.parse(localStorage.getItem('cart_products'));
let builderData = JSON.parse(localStorage.getItem('builderData'));
const totalShipping = ref(0)
const totalAmount = ref(0)
const grandTotal = ref(0)
const prescreptionRequired = ref(false)
const isMobile = ref(window.innerWidth <= 768);
const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};
onBeforeMount(async () => {
    products.forEach(product => {
        var price = 0
        if(product.status === 'active' && product.prescription === 1 && !prescreptionRequired.value)
        {
            prescreptionRequired.value = true
            price = parseFloat(builderData.practitioner_fee);
        }else if(product.status === 'active' && product.prescription === 1 && prescreptionRequired.value) {
            price = parseFloat(0);
        }
        else{
            price = parseFloat(product.price);
        }
        
        product.price = productTotal(product)
        const shippingPrice = parseFloat(0);
        totalShipping.value += product.qty * shippingPrice;
        console.log('price',price)
        if(price > 0 && product.status === 'active' )
        totalAmount.value += product.qty * price;

    });
    if(prescreptionRequired.value){
        let newProduct = {
            id: Math.floor(Math.random() * 100000), // Random ID
            name: "Doctor Visit",
            description: "Consultation fee charged by the doctor.",
            price: productTotalPreReq(1,builderData.practitioner_fee),
            image: null,
            in_take_form_id: null,
            questiioneries_form_id: null,
            category_name: "Consultation",
            category_id: null,
            category_intake_form_id: null,
            category_questiioneries_form_id: null,
            provider_id: null,
            prescription: 0,
            qty: 1,
            subscription: false,
            onetime: true,
            status: 'active'
        };
        products.push(newProduct);
    }
    console.log('products',products)
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
</script>
<template>
    <VCard class="bg-transparent" :class="isMobile ? '' : 'auth-card pa-2 card-margin'" style="min-width: 90%;border: none;box-shadow: none;" color="">
        <v-card-text style="padding-left: 30px;">
            <h4 style="font-weight: 700;font-size: 20px;font-family: system-ui;color: black;">Order Details</h4>
            <v-list class="bg-transparent text-yellow-theme-button">
                <v-list-item-group>
                    <div v-for="product in products" :key="product.id">
                    <v-list-item v-if="product.status === 'active'" style="padding-left: 0px;">
                        <v-list-item-content>
                            <v-list-item-title style="font-size: 18px!important;font-family: sans-serif;">
                                {{ product.name }}
                                <span 
                                    class="float-right ml-2" 
                                    :class="{ 'line-through': product.prescription === 1 }"
                                >
                                    {{ product.price }}
                                </span>
                            </v-list-item-title>
                            <!-- <v-list-item-subtitle class="text-yellow-theme-button">Qty: {{ product.qty
                                }}</v-list-item-subtitle> -->
                        </v-list-item-content>
                    </v-list-item>
                    </div>
                    <v-list-item style="padding-top: 10px;padding-bottom: 10px;padding-left: 0px;">
                        <v-list-item-content>
                            <v-list-item-title style="font-size: 18px!important;font-family: sans-serif;">
                                <span style="padding-top: 10px;padding-bottom: 10px;"><b>Total</b></span>
                                <span class="float-right ml-2" style="border-top: 1px solid silver;border-bottom: 1px solid silver;padding-top: 10px;padding-bottom: 10px;padding-left: 50px;">&nbsp;<b>{{ grandTotal }}</b></span>
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-card-text>
        <!-- <v-divider></v-divider> -->
        <v-card-text>
            <v-row justify="end">
                <v-col cols="auto">
                    <h4 class="text-yellow-theme-button total-font" style="display: none;"><span class="mr-2">Sub Total:</span> <span
                            class="float-right">{{
        totalAmount }}</span>
                    </h4>
                    <h4 class="text-yellow-theme-button total-font" style="display: none;"><span class="mr-2">Shipping:</span> <span
                            class="float-right">{{
        totalShipping
                            }}</span></h4>
                    <h4 class="text-yellow-theme-button total-font" style="display: none;"><span class="mr-2">Order Total:</span> <span
                            class="float-right">{{
                            grandTotal
                            }}</span></h4>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text class="mt-4" style="color: black;font-family: system-ui;">
        <b>Note: At this time, you will only be charged for the doctor visit. After the consultation, once we receive the prescription, your order will be automatically processed, and your card will be charged for the cost of the medication.</b>
    </v-card-text>
    </VCard>
</template>
<style>
.bg-transparent{
    background-color: transparent !important;
}
.line-through {
    text-decoration: line-through;
}
</style>
