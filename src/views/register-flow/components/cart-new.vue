<script setup>
import { useBuilderStore } from '@/stores/builderStore';
import { usePatientRegStore } from '@/stores/patientRegStore';
import { computed, onBeforeMount, onMounted, ref } from 'vue';

const builderStore = useBuilderStore()
const patientRegStore = usePatientRegStore()
const products = ref([...patientRegStore.cart_products]); // Create a reactive reference
const totalShipping = ref(0)
const totalAmount = ref(0)
const grandTotal = ref(0)
const prescreptionRequired = ref(false)
const isMobile = ref(window.innerWidth <= 768);
const totals = ref({ doctorVisitTotal: 0, otherProductsTotal: 0 })
const practitioner_fee = ref(0)
const subscriptionRequired = ref(false)
const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};

// Coupon related variables
const couponCode = ref('');
const appliedCoupon = ref(null);
const isCouponLoading = ref(false);
const couponError = ref('');
const discountAmount = ref(0);

// Calculate the discount amount based on the applied coupon
const calculateDiscount = () => {
    if (!appliedCoupon.value) return 0;

    const subtotal = totals.value.doctorVisitTotal + totals.value.otherProductsTotal;
    let discount = 0;

    if (appliedCoupon.value.type === 'percentage') {
        discount = subtotal * (parseFloat(appliedCoupon.value.discount_amount) / 100);
        // Check if discount exceeds max_discount
        if (appliedCoupon.value.max_discount && discount > parseFloat(appliedCoupon.value.max_discount)) {
            discount = parseFloat(appliedCoupon.value.max_discount);
        }
    } else if (appliedCoupon.value.type === 'fixed') {
        discount = parseFloat(appliedCoupon.value.discount_amount);
        // Ensure discount doesn't exceed the subtotal
        if (discount > subtotal) {
            discount = subtotal;
        }
    }

    return discount;
};

// Computed property for final total after discount
const finalTotal = computed(() => {
    const subtotal = totals.value.doctorVisitTotal + totals.value.otherProductsTotal;
    return subtotal - discountAmount.value;
});

// Apply coupon function
const applyCoupon = async () => {
    if (!couponCode.value) {
        couponError.value = 'Please enter a coupon code';
        return;
    }

    couponError.value = '';
    isCouponLoading.value = true;

    try {
        const response = await $api(VALIDATE_COUPON_API, {
            method: 'POST',
            body: {
                promo_code: couponCode.value,
                provider_id: builderStore.provider_id
            }
        });
        console.log('response', response);
        if (response.success) {
            appliedCoupon.value = response.promo_data;
            discountAmount.value = calculateDiscount();
            couponCode.value = ''; // Clear the input field

            // Store the applied coupon in patient registration store for later use
            patientRegStore.appliedCoupon = appliedCoupon.value;
            patientRegStore.discountAmount = discountAmount.value;
        } else if(!response.success && response.promo_code) {
            couponError.value = response.promo_code[0] || 'Invalid coupon code';
            appliedCoupon.value = null;
            discountAmount.value = 0;
        }else{
            couponError.value = response.data.error || 'Invalid coupon code';
            appliedCoupon.value = null;
            discountAmount.value = 0;
        }
        
    } catch (error) {
        console.error('Error applying coupon:', error);
        couponError.value = error.response?.data?.error || 'Failed to apply coupon';
        appliedCoupon.value = null;
        discountAmount.value = 0;
    } finally {
        isCouponLoading.value = false;
    }
};

// Remove applied coupon
const removeCoupon = () => {
    appliedCoupon.value = null;
    discountAmount.value = 0;
    couponError.value = '';
    patientRegStore.appliedCoupon = null;
    patientRegStore.discountAmount = 0;
};

onBeforeMount(async () => {
    // First pass: Check if prescription is required
    products.value
        .filter(product => product.status === 'active')
        .forEach(product => {
            if (product.prescription === 1) {
                prescreptionRequired.value = true;
            }
            console.log('product.subscription', product.subscription)
            if (product.subscription && product.subscription === 'true') subscriptionRequired.value = true
        });



    // Second pass: Calculate totals
    products.value.forEach(product => {
        if (product.status === 'active') {
            let price = 0;

            if (product.vartions && product.variation_id) {
                price = product.qty * product.vartions[product.variation_id].price
            } else {
                price = parseFloat(product.price);
            }

            product.price = price

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
    console.log('subscriptionRequired.value', subscriptionRequired.value)
    // Add Doctor Visit product if prescription is required
    if (prescreptionRequired.value && !subscriptionRequired.value) {
        console.log('subscriptionRequired.value >', subscriptionRequired.value)
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
    }

    console.log('products > ', products.value)

    // Check if there's a previously applied coupon in the store
    if (patientRegStore.appliedCoupon) {
        appliedCoupon.value = patientRegStore.appliedCoupon;
        discountAmount.value = patientRegStore.discountAmount || calculateDiscount();
    }
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

    // Recalculate discount if coupon is applied
    if (appliedCoupon.value) {
        discountAmount.value = calculateDiscount();
    }
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
    <VCard :class="isMobile ? 'pl-2 pr-2' : 'auth-card pa-2'" class="d-flex flex-column custom-card">
        <h5 class="custom-color" style="font-size: 16px!important;font-weight: 700;" v-if="isMobile">Order Summary </h5>
        <v-card-text class="flex-grow-1 pt-0" :class="isMobile ? 'pl-0 pr-0 pb-0' : 'px-4'"
            style="min-height: 210px; border-radius: 8px;">
            <v-list class="bg-transparent text-yellow-theme-button">
                <v-list-item-group>
                    <div v-for="product in products" :key="product.id">
                        <v-list-item v-if="product.status === 'active'" class="py-5 border-b px-0">
                            <v-list-item-content>
                                <v-list-item-title style="font-size: 16px!important;font-weight: 700;">

                                    <span>{{ removeSpecialSymbols(product.name) }}</span>

                                    <span class="float-right ml-2">
                                        {{ product.formattedPrice }}
                                    </span>
                                    <small class="item-description" v-if="product.vartions && product.variation_id">
                                        <br><span v-if="product.subscription && product.subscription === 'true'">
                                            Monthly Subscription,&nbsp;</span>30-day supply, <span>{{
                                                product.vartions[product.variation_id].pa_variants
                                            }}
                                            dosage</span>
                                    </small>
                                    <small class="item-description" v-if="product.name === 'Doctor Visit'"><br>{{
                                        $t('Professional medical review') }}</small>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </div>
                </v-list-item-group>
            </v-list>
        </v-card-text>
        <!-- Total Amount at the Bottom -->
        <v-card-text class="" style="padding-top: 10px; padding-bottom: 10px; font-size: 18px;"
            :class="isMobile ? 'pl-0 pr-0' : 'px-4'">
            <VList>
                <v-list-item class="py-4 px-0" style="padding-top: 10px;padding-bottom: 10px;">
                    <v-list-item-content>
                        <v-list-item-title style="font-size: 16px!important;font-weight: 400;">
                            <span style="padding-top: 10px;padding-bottom: 10px;">{{ $t('Subtotal') }}</span>
                            <span class="float-right ml-2">{{
                                productTotalPreReq(1, (totals.otherProductsTotal + totals.doctorVisitTotal)) }}</span>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <!-- Discount row (only shown when coupon is applied) -->
                <v-list-item v-if="appliedCoupon" class="py-4 px-0" style="padding-top: 10px;padding-bottom: 10px;">
                    <v-list-item-content>
                        <v-list-item-title style="font-size: 16px!important;font-weight: 400;">
                            <span style="padding-top: 10px;padding-bottom: 10px;">{{ $t('Discount') }}</span>
                            <span class="float-right ml-2 text-success">-{{ productTotalPreReq(1, discountAmount)
                                }}</span>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item class="py-5 px-0" style="padding-top: 10px;padding-bottom: 10px;">
                    <v-list-item-content>
                        <v-list-item-title style="font-size: 16px!important;font-weight: 400;">
                            <span style="padding-top: 10px;padding-bottom: 10px;">{{ $t('Prescription Processing')
                                }}</span>
                            <span class="float-right ml-2">{{
                                productTotalPreReq(1, 0) }}</span>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <VDivider></VDivider>
                <v-list-item class="px-0" style="padding-top: 10px;padding-bottom: 10px;">
                    <v-list-item-content>
                        <v-list-item-title style="font-size: 18px!important;font-weight: 700;">
                            <span style="padding-top: 10px;padding-bottom: 10px;">{{ $t('Total') }}</span>
                            <span class="float-right ml-2">{{
                                productTotalPreReq(1, appliedCoupon ? finalTotal : (totals.doctorVisitTotal +
                                    totals.otherProductsTotal)) }}</span>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </VList>
        </v-card-text>
    </VCard>

    <!-- Billing Timeline Card -->
    <VCard :class="isMobile ? 'pl-2 pr-2' : 'auth-card pa-2 '" class="d-flex flex-column mt-4 custom-card">
        <v-card-text :class="isMobile ? 'px-0 py-0' : 'px-4'">
            <h5 class="custom-color" style="font-size: 16px!important;font-weight: 700;">{{ $t('Billing Timeline') }}
            </h5>
            <VList>
                <v-list-item class="py-3 px-0" :class="isMobile ? 'mb-0' : 'mb-4'">
                    <v-list-item-content>
                        <v-list-item-title style="font-size: 16px!important;font-weight: 700;">
                            {{ $t('Billed Now') }}
                            <span class="float-right ml-2">
                                {{ prescreptionRequired && practitioner_fee > 0 && !subscriptionRequired ?
                                    productTotalPreReq(1, appliedCoupon && prescreptionRequired ?
                                        Math.max(0, totals.doctorVisitTotal - discountAmount) : totals.doctorVisitTotal) :
                                    productTotalPreReq(1, appliedCoupon ? Math.max(0, totals.otherProductsTotal -
                                        discountAmount) : totals.otherProductsTotal) }}
                            </span>
                            <br>
                            <small class="item-description">{{ prescreptionRequired && practitioner_fee > 0 &&
                                !subscriptionRequired ? '' :
                                $t('Medication Cost') }}</small>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <template v-if="prescreptionRequired && practitioner_fee > 0 && !subscriptionRequired">
                    <VDivider></VDivider>
                    <v-list-item class="py-3 px-0" :class="isMobile ? 'mb-0' : 'mb-4'">
                        <v-list-item-content>
                            <v-list-item-title style="font-size: 16px!important;font-weight: 700;">
                                {{ $t('Billed After Approval') }}
                                <span class="float-right ml-2">
                                    {{ productTotalPreReq(1, appliedCoupon && !prescreptionRequired ?
                                        Math.max(0, totals.otherProductsTotal - discountAmount) : totals.otherProductsTotal)
                                    }}
                                </span>
                                <br>
                                <small class="item-description">{{ $t('Medication Cost') }}</small>
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
            </VList>
        </v-card-text>
    </VCard>

    <!-- Coupon Code Section -->
    <VCard class="coupon-input-card" variant="outlined">
        <v-card-text>
            <div v-if="!appliedCoupon" class="d-flex align-center">
                <v-text-field v-model="couponCode" label="Coupon Code" variant="outlined" density="compact" hide-details
                    class="flex-grow-1 mr-2">
                    <template #prepend-inner>
                        <VIcon icon="tabler-ticket" size="20" />
                    </template>
                </v-text-field>
                <v-btn color="primary" :loading="isCouponLoading" :disabled="isCouponLoading" @click="applyCoupon">
                    Apply
                </v-btn>
            </div>
            <div v-else class="d-flex align-center justify-space-between py-2">
                <div>
                    <v-chip color="success" class="mr-2">
                        {{ appliedCoupon.code }}
                    </v-chip>
                    <span class="text-success">Coupon applied</span>
                </div>
                <v-btn size="small" variant="text" color="error" @click="removeCoupon">
                    Remove
                </v-btn>
            </div>
            <p v-if="couponError" class="text-error mt-1">{{ couponError }}</p>
        </v-card-text>
    </VCard>
</template>


<style scoped>
.coupon-input-card {
  border: 1px dashed rgb(var(--v-theme-primary)) !important;
  background: rgba(var(--v-theme-primary), 0.04);
}
#note {
    color: white;
    padding-top: 20px !important;
    background: #49a38c;
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

.border-b {
    border-bottom: 1px solid silver;
}

.text-success {
    color: #4caf50 !important;
}

.text-error {
    color: #f44336;
    font-size: 12px;
}
</style>
