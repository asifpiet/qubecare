<script setup>
import { useBuilderStore } from '@/stores/builderStore';
import { usePatientRegStore } from '@/stores/patientRegStore';
import { onBeforeMount, onMounted, ref } from 'vue';

const builderStore = useBuilderStore()
const patientRegStore = usePatientRegStore()
const products = ref([...patientRegStore.cart_products]); // Create a reactive reference
const totalShipping = ref(0)
const totalAmount = ref(0)
const grandTotal = ref(0)
const prescreptionRequired = ref(false)
const isMobile = ref(window.innerWidth <= 768);
const practitioner_fee = ref(0)
const totals = ref({ doctorVisitTotal: 0, otherProductsTotal: 0 })
const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};

onBeforeMount(async () => {
    // First pass: Check if prescription is required
    products.value
        .filter(product => product.status === 'active')
        .forEach(product => {
            if (product.prescription === 1) {
                prescreptionRequired.value = true;
            }
        });



    // Second pass: Calculate totals
    products.value.forEach(product => {
        if (product.status === 'active') {
            let price = 0;

            if (product.prescription === 1) {
                price = parseFloat(product.price);
            } else if (product.prescription === 0) {
                if (product.vartions && product.variation_id) {
                    price = product.qty * product.vartions[product.variation_id].price
                } else {
                    price = parseFloat(product.price);
                }
            }

            product.formattedPrice = productTotal(product);
            const shippingPrice = parseFloat(0);
            totalShipping.value += product.qty * shippingPrice;

            // Update totalAmount
            if (price > 0) {
                if (product.vartions && product.variation_id) {
                    totalAmount.value += product.qty * product.vartions[product.variation_id].price
                } else {
                    totalAmount.value += product.qty * price;
                }
            }
        }
    });

    // Add Doctor Visit product if prescription is required
    if (prescreptionRequired.value) {
        const appointment = builderStore.layout.find(item => item.title === "Appointment");

        practitioner_fee.value = appointment?.config?.practitioner_fee ?? "0";
        const doctorVisitExists = products.value.some(
            (item) => item.name === "Doctor Visit" && item.status === 'active'
        );

        if (!doctorVisitExists) {
            console.log('appointment', appointment, practitioner_fee.value)
            let pId = Math.floor(Math.random() * 100000)
            const newProduct = {
                id: pId,
                name: "Doctor Visit",
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

    console.log('products > ', products.value)
});

onMounted(async () => {
    totals.value = products.value.reduce((acc, product) => {
        const totalPrice = parseFloat(product.price) * product.qty;

        if (product.name === "Doctor Visit") {
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
    if (product.vartions && product.variation_id) {
        return new Intl.NumberFormat('en-US', options).format(product.qty * parseFloat(product.vartions[product.variation_id].price));
    } else {
        return new Intl.NumberFormat('en-US', options).format(product.qty * parseFloat(product.price));
    }
};

const removeSpecialSymbols = (text) => {
    return text.replace(/[^a-zA-Z0-9-\s]/g, "")
}
</script>

<template>
    <div :class="isMobile ? '' : 'auth-card pa-2 card-margin'" style="min-width: 90%;border: none;box-shadow: none;"
        color="">
        <v-card-text class="bg-custom" style="padding-left: 30px;min-height: 350px;border-radius: 8px;">
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
                                    {{ removeSpecialSymbols(product.name) }}
                                    <span v-if="product.vartions && product.variation_id">
                                        {{ product.vartions[product.variation_id].pa_variants }}
                                    </span>
                                    <span class="float-right ml-2"
                                        :class="{ 'line-through': product.prescription === 1 && product.name !== 'Doctor Visit' }">
                                        {{ product.formattedPrice }}
                                    </span>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>


                    </div>
                    <VDivider></VDivider>
                    <v-list-item style="padding-top: 10px;padding-bottom: 10px;padding-left: 0px;">
                        <v-list-item-content>
                            <v-list-item-title style="font-size: 18px!important;font-family: sans-serif;">
                                <span style="padding-top: 10px;padding-bottom: 10px;"><b>{{ $t('Total') }}</b></span>
                                <span class="float-right ml-2">&nbsp;<b>{{ prescreptionRequired ? productTotalPreReq(1,
                                    totals.doctorVisitTotal) : productTotalPreReq(1, totals.otherProductsTotal)
                                        }}</b></span>
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-card-text>
        <v-card-text class="mt-4" id="note">
            {{ $t(`Important Note: At this time, you will only be charged for the doctor's visit.`) }}
            {{ $t(`After your consultation, we receive the prescription, your order will be automatically processed,`)
            }}
            {{ $t('and your card will be charged for the cost of the medication.') }}


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
