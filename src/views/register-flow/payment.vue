<script setup>
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})
import { patientAuthService } from '@/services/auth/patientAuthService';
import { useBuilderStore } from '@/stores/builderStore';
import { usePatientRegStore } from '@/stores/patientRegStore';
import { statesList } from '@/utils/states';
import NavBarI18n from '@core/components/I18n.vue';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBdqGrpK1HLNCZJueD7g3uUlKcLEDM_MmQ&libraries=places';
import Cart from './components/cart.vue';
const emit = defineEmits(['completed']);
const patientRegStore = usePatientRegStore()
const builderStore = useBuilderStore()

const currentUser = await patientAuthService.fetchProfile();
const isMobile = ref(window.innerWidth <= 768); // Assuming mobile width is less than or equal to 768px

const isLoadingVisible = ref(false)
const paymentForm = ref()
const cardNumber = ref('')
const expiry = ref('')
const cvv = ref('')

const address = ref('')
const apt = ref('')
const city = ref('')
const state = ref('')
const zipcode = ref('')
const billingaddress = ref('')
const billingapt = ref('')
const billingcity = ref('')
const billingSection = ref(false)
const confirmPopup = ref(false)
const verifiedAddress = ref(null);
const suggestedStreet = ref(null);
const suggestedCity = ref(null);
const suggestedState = ref(null);
const suggestedZip = ref(null);
const suggestedAddress = ref(null);
const selectedAddress = ref('notsuggested')
const typedAddress = ref(null)
let products = patientRegStore.cart_products;
const totalShipping = ref(0)
const totalAmount = ref(0)
const grandTotal = ref(0)
const prescreptionRequired = ref(false)
const paymentPopup = ref(false)
const paymentPopupText = ref(null)
const practitioner_fee = ref(0)
const totals = ref({ doctorVisitTotal: 0, otherProductsTotal: 0 })
const disableSubmit = ref(false)
const states = statesList;
const sortedStates = computed(() => {
    return states.slice().sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
});
const errors = ref({
    address: undefined,
    city: undefined,
    state: undefined,
    zipcode: undefined,
    country: undefined,

})
onBeforeMount(async () => {
    totalAmount.value = 0;
    totalShipping.value = 0;

    // First pass: Check if prescription is required
    products.forEach(product => {
        if (product.status === 'active' && product.prescription === 1) {
            prescreptionRequired.value = true;
        }
    });

    // Second pass: Calculate totals
    products.forEach(product => {
        if (product.status === 'active') {
            let price = 0;
            let shippingPrice = 0;

            if (product.vartions && product.variation_id) {
                price = product.qty * product.vartions[product.variation_id].price
            } else {
                price = parseFloat(product.price);
            }

            product.price = price

            // Update totalShipping
            totalShipping.value += product.qty * shippingPrice;

            // Update totalAmount
            if (price > 0) {
                if (product.vartions && product.variation_id) {
                    totalAmount.value += product.qty * product.vartions[product.variation_id].price;
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
        const doctorVisitExists = products.some(
            (item) => item.name === "Doctor Visit" && item.status === 'active'
        );

        if (!doctorVisitExists) {
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
            products.push(newProduct);
        }
    }

    console.log('products >? ', products)

    // Format totals
    const options = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };
    grandTotal.value = new Intl.NumberFormat('en-US', options).format(parseFloat(totalAmount.value) + parseFloat(totalShipping.value));
    totalAmount.value = new Intl.NumberFormat('en-US', options).format(totalAmount.value);
    totalShipping.value = new Intl.NumberFormat('en-US', options).format(totalShipping.value);
});

onMounted(async () => {

    totals.value = products.reduce((acc, product) => {
        const totalPrice = parseFloat(product.price) * product.qty;

        if (product.name === "Doctor Visit") {
            acc.doctorVisitTotal += totalPrice;
        } else {
            acc.otherProductsTotal += totalPrice;
        }

        return acc;
    }, { doctorVisitTotal: 0, otherProductsTotal: 0 });

    console.log('totals', totals.value.doctorVisitTotal, totals.value.otherProductsTotal)
    window.addEventListener('resize', checkIfMobile);

})
// Detach event listener on component unmount
onUnmounted(() => {
    window.removeEventListener('resize', checkIfMobile);
});
const productTotal = (product) => {
    let options = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };

    if (product.vartions && product.variation_id) {
        return new Intl.NumberFormat('en-US', options).format(product.qty * parseFloat(product.vartions[product.variation_id].price));
    } else {
        return new Intl.NumberFormat('en-US', options).format(product.qty * parseFloat(product.price));
    }
};

const productTotalPreReq = (qty, price, format = true) => {
    const options = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };
    if (!format)
        return qty * parseFloat(price);
    return new Intl.NumberFormat('en-US', options).format(qty * parseFloat(price));
};
const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};

const corfirmFun = async () => {


    if (address.value && city.value && state.value && zipcode.value)
        typedAddress.value = address.value + ' ' + city.value + ' ' + state.value + ' ' + zipcode.value
    if (address.value)
        await verfiFyAddress(address.value);
    console.log('selectedAddress.value', selectedAddress.value)
    if (selectedAddress.value === 'notsuggested') {
        if (typedAddress.value) {
            const addressParts = typedAddress.value.split(' ');
            address.value = addressParts.slice(0, -3).join(' ');
            apt.value = addressParts.slice(0, -3).join(' ');
            city.value = addressParts[addressParts.length - 3];
            state.value = addressParts[addressParts.length - 2];
            zipcode.value = addressParts[addressParts.length - 1];
        }

        await validatePayment()
        return
    }
    confirmPopup.value = true;
}
const validatePayment = async () => {
    const { valid: isValid } = await paymentForm.value?.validate();
    console.log('isValid ', isValid);
    if (isValid) {
        disableSubmit.value = true
        await saveOrderInfo()
        disableSubmit.value = false
        emit('completed');

        // if (patientRegStore.paymentProcessed) {
        //     paymentPopupText.value = "Your payment for $" + parseFloat(grandTotal.value.replace(/[^0-9.-]+/g, "")) + " was successful"
        //     paymentPopup.value = patientRegStore.paymentProcessed
        //     setTimeout(() => {
        //         emit('completed');
        //     }, 5000);

        // }
    }
};

const saveOrderInfo = async () => {
    products = products.filter(product => product.name !== "Doctor Visit");
    const productIds = products.map(product => ({
        product_id: product.site_product_id ? product.wp_pro_id : product.id,
        qty: product.qty,
        subscription: product.subscription,
        onetime: product.onetime,
        variation_id: product.variation_id,
        price: product.vartions && product.variation_id ? product.vartions[product.variation_id].price : product.price
    }));
    console.log('saveOrderInfo', productIds);
    isLoadingVisible.value = true;
    let addressVal = null
    let cityVal = null
    let stateVal = null
    let zipcodeVal = null
    if (selectedAddress.value == 'suggested') {
        addressVal = suggestedAddress.value
        cityVal = suggestedCity.value
        stateVal = suggestedState.value
        zipcodeVal = suggestedZip.value
    } else {
        addressVal = address.value
        cityVal = city.value
        stateVal = state.value
        zipcodeVal = zipcode.value
    }

    let [month, year] = expiry.value.split("/");

    year = year.length === 2 ? (year >= "50" ? "19" + year : "20" + year) : year;
    let affiliate = localStorage.getItem("affiliate")
    if (affiliate === 'null')
        affiliate = null

    // Properly parse the currency strings by removing non-numeric characters
    const shippingAmount = parseFloat(totalShipping.value.replace(/[^0-9.-]+/g, ""));
    const amount = parseFloat(totalAmount.value.replace(/[^0-9.-]+/g, ""));

    console.log({
        patient_id: currentUser.userData.id,
        shipping_address1: addressVal,
        shipping_address2: apt.value,
        shipping_city: cityVal,
        shipping_state: stateVal,
        shipping_zipcode: zipcodeVal,
        shipping_country: 'United States',
        shipping_amount: shippingAmount,
        total_amount: prescreptionRequired.value ? totals.value.doctorVisitTotal : totals.value.otherProductsTotal,
        items: productIds,
        card_number: cardNumber.value,
        cvv: cvv.value,
        expiration_month: month,
        expiration_year: year,
        affiliate_email: affiliate ? affiliate : null,
        prescreption_required: prescreptionRequired.value,
        practitioner_fee: practitioner_fee.value,
        provider_id: builderStore.provider_id,
        appointment_id: patientRegStore.appointment.id,
        builder_id: builderStore.id
    })

    await patientRegStore.saveOrder(
        {
            patient_id: currentUser.userData.id,
            shipping_address1: addressVal,
            shipping_address2: apt.value,
            shipping_city: cityVal,
            shipping_state: stateVal,
            shipping_zipcode: zipcodeVal,
            shipping_country: 'United States',
            shipping_amount: shippingAmount,
            total_amount: prescreptionRequired.value ? totals.value.doctorVisitTotal : totals.value.otherProductsTotal,
            items: productIds,
            card_number: cardNumber.value,
            cvv: cvv.value,
            expiration_month: month,
            expiration_year: year,
            affiliate_email: affiliate ? affiliate : null,
            prescreption_required: prescreptionRequired.value,
            practitioner_fee: practitioner_fee.value,
            provider_id: builderStore.provider_id,
            appointment_id: patientRegStore.appointment.id,
            builder_id: builderStore.id
        }
    )
}
const verfiFyAddress = async (address) => {
    isLoadingVisible.value = true;
    suggestedAddress.value = null
    let addressT = address
    // let addressT = '11 pinewood Pi'
    let cityt = 'BOWLING GREEN'
    let statet = 'KY'
    let zipt = '42101'
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: addressT }, (results, status) => {
        if (status === 'OK' && results.length > 0) {
            verifiedAddress.value = results[0];
        } else {
            console.error('Geocode was not successful for the following reason:', status);
            verifiedAddress.value = null;
        }
        console.log(verifiedAddress.value)
        suggestedStreet.value = getStreetAddress()
        suggestedCity.value = getAddressComponent('locality')
        suggestedState.value = getAddressComponent('administrative_area_level_1', true)
        suggestedZip.value = getAddressComponent('postal_code')
        if (suggestedStreet.value && suggestedCity.value && suggestedState.value && suggestedZip.value)
            suggestedAddress.value = `${suggestedStreet.value}, ${suggestedCity.value}, ${suggestedState.value} ${suggestedZip.value}`;
        console.log(suggestedAddress.value)
        console.log('street : ', getStreetAddress())
        console.log('city : ', getAddressComponent('locality'))
        console.log('state : ', getAddressComponent('administrative_area_level_1'))
        console.log('zip : ', getAddressComponent('postal_code'))
        isLoadingVisible.value = false;
    })
}
const getStreetAddress = () => {
    if (!verifiedAddress.value) return '';
    return verifiedAddress.value.formatted_address.split(',')[0];
};
const getAddressComponent = (type, shortname) => {
    if (!verifiedAddress.value) return '';
    for (const component of verifiedAddress.value.address_components) {
        if (component.types.includes(type)) {
            if (shortname) {
                return component.short_name
            } else {
                return component.long_name;
            }

        }
    }
    return '';
};
const cardNumberFormat = () => {
    cardNumber.value = cardNumber.value.replace(/\D/g, '').substring(0, 16);

};
const formatExpiry = () => {
    // Automatically format the input to MM/YY format
    expiry.value = expiry.value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d{2})/, '$1/$2');
};
const handleCVVInput = () => {
    // Remove non-digit characters from input
    cvv.value = cvv.value.replace(/\D/g, '');
};
watch(selectedAddress, (newValue) => {
    console.log('selectedAddress.value', selectedAddress.value)
    if (newValue === 'suggested') {

        address.value = suggestedStreet.value;
        apt.value = suggestedStreet.value;
        city.value = suggestedCity.value;
        state.value = suggestedState.value;
        zipcode.value = suggestedZip.value;

    } else if (newValue === 'notsuggested') {

        const addressParts = typedAddress.value.split(' ');
        address.value = addressParts.slice(0, -3).join(' ');
        apt.value = addressParts.slice(0, -3).join(' ');
        city.value = addressParts[addressParts.length - 3];
        state.value = addressParts[addressParts.length - 2];
        zipcode.value = addressParts[addressParts.length - 1];
    }
});
</script>
<template>

    <v-dialog v-model="paymentPopup" width="auto">
        <v-card max-width="400" prepend-icon="mdi-checkbox-marked-circle" :text=paymentPopupText
            title="Payment Success">
        </v-card>
    </v-dialog>
    <div class="text-center"
        style="padding: 15px 10px 10px 10px; border-bottom: 1px solid #c0c0c0b0;position: fixed; width: 100%; z-index: 1004;background: white;">
        <VNodeRenderer :nodes="themeConfig.app.logo" />
    </div>

    <VRow
        style="min-height: 100dvh; margin: 0; display: flex; justify-content: center; align-items: center;position: relative;top: 60px;"
        class="bg-custom">
        <VCol cols="12" :class="isMobile ? 'px-2' : 'px-8 py-8'">
            <!-- Main Card -->

            <VCard class="d-flex align-center" style="min-height: calc(0px + 90vh);">
                <VRow>
                    <div class="tex-right">
                        <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
                            :languages="themeConfig.app.i18n.langConfig" class="language" />
                    </div>
                    <VCol cols="12" md="6" class="bg-white d-flex align-center justify-center"
                        :class="isMobile ? '' : 'pa-4'">
                        <!-- Form Container -->
                        <div class="d-flex justify-center" style="padding: 20px; max-width: 450px;">
                            <VForm ref="paymentForm" @submit.prevent="() => { }">
                                <div class="mb-3">
                                    <h3 class="text-left mb-0">{{ $t('Shipping Information') }}</h3>
                                    <small>{{ $t('Please provide your shipping details.') }}'</small>
                                </div>
                                <VRow>
                                    <VCol cols="12" md="12">
                                        <VTextField v-model="address" :label="$t('Address')"
                                            :rules="[requiredValidator]" density="comfortable" />
                                    </VCol>
                                    <VCol cols="12" md="12">
                                        <VTextField v-model="apt" :label="$t('APT/Suite #')" density="comfortable" />
                                    </VCol>
                                </VRow>
                                <VRow>
                                    <VCol cols="12" md="12">
                                        <VTextField v-model="city" :label="$t('City')" :rules="[requiredValidator]"
                                            density="comfortable" />
                                    </VCol>
                                    <VCol cols="12" md="6">
                                        <v-autocomplete clearable v-model="state" :label="$t('Select State')"
                                            :items="sortedStates" item-title="name" item-value="abbreviation"
                                            :rules="[requiredValidator]" :error-messages="errors.state"
                                            density="comfortable"></v-autocomplete>
                                    </VCol>
                                    <VCol cols="12" md="6">
                                        <VTextField type="number" v-model="zipcode" :rules="[requiredValidator]"
                                            :label="$t('Zip Code')" density="comfortable" />
                                    </VCol>
                                </VRow>
                                <div class="mb-3">
                                    <h3 class="mb-0 mt-4">
                                        {{ $t('Payment') }} &nbsp;
                                        <!-- <VIcon>tabler-credit-card</VIcon> -->
                                    </h3>
                                    <small>{{ $t('Please provide your card details for payment.') }}</small>
                                </div>
                                <VRow>
                                    <VCol cols="12" lg="12" md="12">
                                        <VTextField v-model="cardNumber" :label="$t('Credit Card Number')"
                                            :rules="[requiredValidator, cardNumberValidator]"
                                            placeholder="xxxxxxxxxxxxxxxx" @input="cardNumberFormat"
                                            density="comfortable" />
                                    </VCol>
                                    <VCol cols="12" lg="6" md="6">
                                        <VTextField v-model="expiry" :label="$t('Expiration Date')"
                                            :rules="[requiredValidator, expiryValidator]" placeholder="MM/YY"
                                            @input="formatExpiry" density="comfortable" />
                                    </VCol>
                                    <VCol cols="12" lg="6" md="6">
                                        <VTextField v-model="cvv" :rules="[requiredValidator, cvvValidator]"
                                            :label="$t('CVV')" maxlength="3" @input="handleCVVInput"
                                            density="comfortable" />
                                    </VCol>
                                </VRow>
                                <v-card class="px-2 mt-2 mb-2" flat v-if="billingSection">
                                    <h3 class="mb-3">{{ $t('Billing Information') }}</h3>
                                    <VRow>
                                        <VCol cols="12" md="6">
                                            <VTextField v-model="billingaddress" :label="$t('Address')"
                                                :rules="[requiredValidator]" density="comfortable" />
                                        </VCol>
                                        <VCol cols="12" md="6">
                                            <VTextField v-model="billingapt" :label="$t('APT/Suite #')"
                                                density="comfortable" />
                                        </VCol>
                                    </VRow>
                                    <VRow>
                                        <VCol cols="12" md="6">
                                            <VTextField v-model="billingcity" :label="$t('City')"
                                                :rules="[requiredValidator]" density="comfortable" />
                                        </VCol>
                                    </VRow>
                                </v-card>
                                <div class="text-center mb-2 mt-4">
                                    <VBtn class="px-4 mb-2" color="primary" variant="flat" block @click="corfirmFun"
                                        :disabled="disableSubmit">
                                        {{ $t('Checkout') }}
                                    </VBtn>
                                </div>
                                <VDialog v-model="confirmPopup" refs="myDialog" persistent width="500">
                                    <v-card>
                                        <v-card-text>
                                            <div class="mt-2 mb-2">
                                                <small>
                                                    {{ $t(`Select the correct address that match your current address`)
                                                    }}
                                                </small>
                                            </div>

                                            <v-radio-group v-model="selectedAddress" :rules="[requiredValidator]"
                                                v-if="typedAddress || suggestedAddress">
                                                <v-radio :label="suggestedAddress" v-if="suggestedAddress"
                                                    value="suggested"></v-radio>
                                                <v-radio :label="typedAddress" value="notsuggested"
                                                    v-if="typedAddress"></v-radio>
                                            </v-radio-group>
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn type="submit" text="Confirm" @click="validatePayment"
                                                :disabled="disableSubmit"></v-btn>
                                            <v-btn text="Close" @click="confirmPopup = false"></v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </VDialog>
                            </VForm>
                        </div>
                    </VCol>
                    <VCol cols="12" md="6" class="bg-white d-flex align-center justify-center"
                        :class="isMobile ? '' : 'pa-4'">
                        <!-- Cart Container -->
                        <Cart></Cart>
                    </VCol>
                </VRow>
            </VCard>
        </VCol>

    </VRow>

</template>
<style scoped>
@media only screen and (max-width: 768px) {
    .second-card {
        margin-top: 20px;
    }

    .card-wid {
        max-width: 600px !important;
        min-width: auto !important;
    }

    .col-order-1 {
        order: 2;
    }

    .col-order-2 {
        order: 1;
    }
}

@media only screen and (min-width: 769px) {
    .col-order-1 {
        order: 1;
    }

    .col-order-2 {
        order: 2;
    }
}

.container-padding {
    padding: 0px;
}

.card-margin {
    margin: 30px;
}

.total-font {
    font-size: 20px;
    margin-bottom: 5px;
}

.bg-white bg-change-bk .current-plan {
    border: 2px solid rgb(var(--v-theme-primary));
}

.cut-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: line-through;
    text-decoration-color: red;
    text-decoration-thickness: 1px;
}

.plan-card {
    margin: 0rem;
    margin-bottom: 0;
}

.card-wid {
    min-width: 600px;
}

.layout-wrapper {
    justify-content: center;
}

.error-message {
    color: #ff2f2f;
    font-size: 15px;
}
</style>
<style>
.total-font {
    font-size: 20px;
    margin-bottom: 5px;
}

.current-plan {
    border: 2px solid rgb(var(--v-theme-primary));
}

.cut-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: line-through;
    text-decoration-color: red;
    text-decoration-thickness: 1px;
}

.plan-card {
    margin: 9rem;
    margin-bottom: 0;
}

.v-card.v-card--flat.v-theme--light.v-card--density-default.v-card--variant-elevated.text-center.search-header.rounded-0 {
    block-size: 357px;
    inset-block-start: -185px;
}

body {
    display: block !important;
}

a.nav-link.fw-medium {
    color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}

.light-style .layout-navbar .menu-text {
    color: #5d596c !important;
}

span.app-brand-text.demo.menu-text.fw-bold.ms-2.ps-1 {
    color: #5d596c !important;
}

.navbar.landing-navbar {
    border-color: rgba(255, 255, 255, 68%) !important;
    background: white;
    margin: 0;
    border-radius: 0;
    box-shadow: 0px 10px 10px #00000029;
}

.landing-footer .footer-top {
    background-color: #1C5580;
    border-radius: none !important;
    /* background: url("/assets/img/front-pages/backgrounds/footer-bg-dark.png"); */
}

.footer-bottom.py-3 {
    background-color: #282c3e;
}

.light-style .landing-footer .footer-link,
.light-style .landing-footer .footer-text {
    color: #d3d4dc !important;
}

.light-style .landing-footer .footer-link,
.light-style .landing-footer .footer-text {
    color: #d3d4dc;
}

a.footer-link {
    color: #d3d4dc;
}

.light-style .landing-footer .footer-title {
    color: #fff;
}

.footer-title {
    color: #fff;
}

.footer-text {
    color: #d3d4dc;
}

@media (max-width: 355px) {
    .first-section-pt {
        margin-block-start: -121px !important;
    }
}

.logo-img {
    display: block;
    position: relative;
    margin: 0 auto;
}

.language {
    position: absolute;
    top: 0;
    left: 90%;
}

/* // @use "@core/scss/template/pages/page-auth.scss"; */
</style>
