<script setup>
import { useBuilderStore } from '@/stores/builderStore';
import { usePatientStore } from '@/stores/patientStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import { onBeforeMount, onMounted, ref } from 'vue';

const patientStore = usePatientStore()
const practitionerStore = usePractitionerStore()
const builderStore = useBuilderStore()
if (patientStore.appointment_order.builder_id) {
    await builderStore.getUnauthBuilderById(patientStore.appointment_order.builder_id)
    await practitionerStore.getPractitionerProducts()
}

let providerProducts = practitionerStore.products.filter(item => item.provider_id !== null);
const products = ref([...patientStore.appointment_order.items]); // Create a reactive reference
const totalShipping = ref(0)
const totalAmount = ref(0)
const grandTotal = ref(0)
const prescreptionRequired = ref(false)
const isMobile = ref(window.innerWidth <= 768);
const practitioner_fee = ref(0)
const totals = ref({ doctorVisitTotal: 0, otherProductsTotal: 0 })
const props = defineProps({
    hideTotals: {
        type: Boolean,
        required: false,
    },
})
const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};

onBeforeMount(async () => {

    console.log('providerProducts', providerProducts)
    console.log('patientStore.appointment_order', patientStore.appointment_order)
    console.log('patientStore.appointment_order.items', patientStore.appointment_order.items)
    for (let p of practitionerStore.products) {
        const matchedProduct = patientStore.appointment_order.items.find(item => item.product_id === p.wp_pro_id || item.product_id === p.id);
        p.variation_id = matchedProduct ? matchedProduct.variation_id : null;

    }



    const finalArray = patientStore.appointment_order.items.map(cartItem => {
        const matchedProduct = practitionerStore.products.find(plan => plan.wp_pro_id === cartItem.product_id || plan.id === cartItem.product_id);
        if (matchedProduct) {
            return {
                ...matchedProduct,
                formattedPrice: productTotal(matchedProduct),
                qty: cartItem.qty ?? 1,
                subscription: cartItem.subscription ?? false,
                onetime: cartItem.onetime ?? true,
                variation_id: cartItem.variation_id ?? null
            };
        }
        return null;
    }).filter(item => item !== null);
    console.log('finalArray', finalArray)
    products.value = finalArray;
    // First pass: Check if prescription is required
    products.value
        .filter(product => product.status === 'active')
        .forEach(product => {
            if (product.prescription) {
                prescreptionRequired.value = true;
            }
        });
    // Second pass: Calculate totals
    products.value.forEach(product => {
        if (product.status === 'active') {
            let price = 0;
            console.log('product.variation?.variations', product.variation?.variations, product.variation_id, product.variation?.variations[product.variation_id])
            if (product.variation?.variations && product.variation_id && product.variation?.variations[product.variation_id]) {
                price = product.qty * parseFloat(product.variation?.variations[product.variation_id].price);
            } else {
                price = parseFloat(product.price);
            }

            product.price = price

            product.formattedPrice = productTotal(product);
            const shippingPrice = parseFloat(0);
            totalShipping.value += product.qty * shippingPrice;

            // Update totalAmount
            if (price > 0) {
                if (product.variation?.variations && product.variation_id && product.variation?.variations[product.variation_id]) {
                    totalAmount.value += product.qty * parseFloat(product.variation?.variations[product.variation_id].price);
                } else {
                    totalAmount.value += product.qty * price;
                }
            }
        }
    });
    console.log('products ', products.value)
    products.value = products.value.filter(product => product.pro_name !== "Doctor Visit");
    // Add Doctor Visit product if prescription is required
    if (prescreptionRequired.value) {
        products.value = products.value.filter(product => product.pro_name !== "Doctor Visit - Prescription");
        const appointment = builderStore.layout.find(item => item.title === "Appointment");
        practitioner_fee.value = appointment?.config?.practitioner_fee ?? "0";
        const doctorVisitExists = products.value.some(
            (item) => item.name === "Doctor Visit" && item.status === 'active'
        );

        if (!doctorVisitExists) {
            if (practitioner_fee.value > 0) {
                let pId = Math.floor(Math.random() * 100000)
                const newProduct = {
                    id: pId,
                    pro_name: "Doctor Visit",
                    description: "Consultation fee charged by the doctor.",
                    price: practitioner_fee.value,
                    formattedPrice: productTotalPreReq(1, practitioner_fee.value),
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
                    status: 'active',
                    vartions: null,
                    variation_id: null,
                    wp_pro_id: pId
                };
                products.value.push(newProduct);
            }
        }
    }

    console.log('products > ', products.value)

    if (props.hideTotals) {

        products.value = products.value.filter(product => product.pro_name !== "Doctor Visit");
        console.log('props.hideTotals', props.hideTotals, products.value)
    }

});

onMounted(async () => {
    totals.value = products.value.reduce((acc, product) => {
        const totalPrice = parseFloat(product.price) * product.qty;

        if (product.pro_name === "Doctor Visit") {
            acc.doctorVisitTotal += totalPrice;
        } else {
            acc.otherProductsTotal += totalPrice;
        }

        return acc;
    }, { doctorVisitTotal: 0, otherProductsTotal: 0 });
    console.log('totals', totals.value.doctorVisitTotal, totals.value.otherProductsTotal)
    const options = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };
    grandTotal.value = new Intl.NumberFormat('en-US', options).format(parseFloat(totalAmount.value) + parseFloat(totalShipping.value));
    totalAmount.value = new Intl.NumberFormat('en-US', options).format(totalAmount.value);
    totalShipping.value = new Intl.NumberFormat('en-US', options).format(totalShipping.value);
    window.addEventListener('resize', checkIfMobile);
});

const productTotalPreReq = (qty, price, format = true) => {
    const options = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };
    if (!format)
        return qty * parseFloat(price);
    return new Intl.NumberFormat('en-US', options).format(qty * parseFloat(price));
};

const productTotal = (product) => {
    const options = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };
    if (product.variation?.variations && product.variation_id && product.variation?.variations[product.variation_id]) {
        return new Intl.NumberFormat('en-US', options).format(product.qty * parseFloat(product.variation?.variations[product.variation_id].price ?? product.price));
    } else {
        return new Intl.NumberFormat('en-US', options).format(product.qty * parseFloat(product.price));
    }
};
</script>

<template>
    <div :class="isMobile ? '' : 'auth-card pa-2 card-margin'" style="min-width: 90%;border: none;box-shadow: none;"
        color="" v-if="products.length > 0">
        <v-card-text class="bg-custom" style="padding-left: 10px;padding-right: 10px;border-radius: 8px;">
            <h3 class="mb-3" style="font-size: 19px 700;color: #3d3d3d;">{{ $t('Order Details') }}
            </h3>
            <!-- <v-divider></v-divider> -->
            <v-list class="bg-transparent text-yellow-theme-button">
                <v-list-item-group>
                    <div v-for="product in products" :key="product.id">
                        <v-list-item v-if="product.status === 'active'" class="border-t py-3"
                            style="padding-left: 0px;">
                            <v-list-item-content>
                                <v-list-item-title style="font-size: 15px!important;font-weight: 600;">
                                    {{ product.pro_name }}
                                    <span
                                        v-if="product.variation?.variations && product.variation_id && product.variation?.variations[product.variation_id]">
                                        {{ product.variation?.variations[product.variation_id].pa_variants }}
                                    </span>
                                    <span class="float-right ml-2" v-if="!props.hideTotals"
                                        :class="{ 'line-through': product.prescription && product.pro_name !== 'Doctor Visit' }">
                                        {{ product.formattedPrice }}
                                    </span>
                                    <span class="float-right ml-2" v-if="props.hideTotals">
                                        {{ product.formattedPrice }}
                                    </span>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </div>
                    <VDivider v-if="!props.hideTotals"></VDivider>
                    <v-list-item style="padding-top: 10px;padding-bottom: 10px;padding-left: 0px;"
                        v-if="!props.hideTotals">
                        <v-list-item-content>
                            <v-list-item-title style="font-size: 18px!important;font-family: sans-serif; margin-bottom: 10px;" v-if="patientStore.appointment_order.discounted_amount && patientStore.appointment_order.discounted_amount > 0">
                                <span style="padding-top: 10px;padding-bottom: 10px;"><b>{{ $t('Discount') }}</b></span>
                                <span class="float-right ml-2">&nbsp;<b>{{ productTotalPreReq(1, patientStore.appointment_order.discounted_amount) }}</b></span>
                            </v-list-item-title>
                            <v-list-item-title style="font-size: 18px!important;font-family: sans-serif;">
                                <span style="padding-top: 10px;padding-bottom: 10px;"><b>{{ $t('Total') }}</b></span>
                                <span class="float-right ml-2">&nbsp;<b>{{ prescreptionRequired ? productTotalPreReq(1,
                                    (totals.doctorVisitTotal - patientStore.appointment_order.discounted_amount)) :
                                    productTotalPreReq(1, (totals.otherProductsTotal - patientStore.appointment_order.discounted_amount)) }}</b></span>
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-card-text>
    </div>
</template>

<style>
#note {
    color: white;
    padding-top: 20px !important;
    background: #49A38C;
    border-radius: 8px;
    font-weight: 500;
    font-size: 13px;
}

.bg-transparent {
    background-color: transparent !important;
}

.line-through {
    text-decoration: line-through;
}
</style>
