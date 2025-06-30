<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Affiliate Products View',
    },
})

import { patientAuthService } from '@/services/auth/patientAuthService';
import { useBuilderStore } from '@/stores/builderStore';
import { usePatientRegStore } from '@/stores/patientRegStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import { statesList } from '@/utils/states';
import {
    emailValidator,
    requiredValidator,
    validUSAPhone
} from '@core/utils/validators';
import debounce from 'lodash.debounce';
// import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
// import { themeConfig } from '@themeConfig';
import Cart from '@/views/register-flow/components/cart-new.vue';
import Steps from '@/views/register-flow/components/steps.vue';
import 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBdqGrpK1HLNCZJueD7g3uUlKcLEDM_MmQ&libraries=places';
import { useRoute, useRouter } from 'vue-router';

const emit = defineEmits(['completed']);
const companyEmail = import.meta.env.VITE_COMPANY_EMAIL ?? 'support@peptidewebmd.com';
const route = useRoute();
const router = useRouter();
const patientRegStore = usePatientRegStore()
const builderStore = useBuilderStore()
const practitionerStore = usePractitionerStore()

const bid = atob(route.query.bid);
patientRegStore.patient.affiliate_email = route.query.af_ref ? atob(route.query.af_ref) : null
await builderStore.getUnauthBuilderById(bid)
console.log('builderStore.layout', builderStore.layout)
patientRegStore.patient.provider_id = builderStore.provider_id
await patientRegStore.getProductByProviderId(builderStore.provider_id)

practitionerStore.getPractitionerInfoUnAuth(builderStore.provider_id)
console.log('>>', practitionerStore.practitioner)
if (localStorage.getItem('patientRegStore')) {
    let data = JSON.parse(atob(localStorage.getItem('patientRegStore')))
    patientRegStore.setState(data)
}
const { currentUser, currentRole, logout } = useAuth()

const practitioner_fee = ref(0)
const isMobile = ref(window.innerWidth <= 768); // Assuming mobile width is less than or equal to 768px

const isPasswordVisible = ref(false)
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
const subscriptionRequired = ref(false)
const paymentPopup = ref(false)
const paymentPopupText = ref(null)
const disableSubmit = ref(false)
const states = statesList;
const patientId = ref(patientRegStore.patient.id ?? null)
const rememberMe = ref(false)
const sortedStates = computed(() => {
    return states.slice().sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
});
const totals = ref({ doctorVisitTotal: 0, otherProductsTotal: 0 })
const errors = ref({
    address: undefined,
    city: undefined,
    state: undefined,
    zipcode: undefined,
    country: undefined,

})

console.log('currentUser', currentUser.value)
onBeforeMount(async () => {
    // First pass: Check if prescription is required
    products.forEach(product => {
        if (product.status === 'active' && product.prescription === 1) {
            prescreptionRequired.value = true;
        }
        if(product.subscription && product.subscription === 'true') subscriptionRequired.value  = true
    });

    // Second pass: Calculate totals
    products.forEach(product => {
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

    // Add Doctor Visit product if prescription is required
    if (prescreptionRequired.value) {
        const appointment = builderStore.layout.find(item => item.title === "Appointment");
        practitioner_fee.value = appointment?.config?.practitioner_fee ?? "0";
        const doctorVisitExists = products.some(
            (item) => item.name === "Doctor Visit" && item.status === 'active'
        );

        if (!doctorVisitExists) {
            if(practitioner_fee.value > 0 && !subscriptionRequired.value){
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
    }

    console.log('products >? ', products)


});

onMounted(async () => {
    window.addEventListener('resize', checkIfMobile);
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

    // Format totals
    const options = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };
    grandTotal.value = new Intl.NumberFormat('en-US', options).format(parseFloat(totalAmount.value) + parseFloat(totalShipping.value));
    totalAmount.value = new Intl.NumberFormat('en-US', options).format(totalAmount.value);
    totalShipping.value = new Intl.NumberFormat('en-US', options).format(totalShipping.value);

    console.log('totalAmount', totalAmount.value)

})
// Detach event listener on component unmount
onUnmounted(() => {
    window.removeEventListener('resize', checkIfMobile);
});

const formatPhoneNumber = () => {
    const numericValue = patientRegStore.patient.phone_no.replace(/\D/g, '');
    if (numericValue.length <= 10) {
        patientRegStore.patient.phone_no = numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else {
        const truncatedValue = numericValue.slice(0, 10);
        patientRegStore.patient.phone_no = truncatedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
};

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

const encodeBase64Unicode = (obj) => {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}

const validatePayment = async () => {
    const { valid: isValid } = await paymentForm.value?.validate();
    console.log('isValid ', isValid);
    if (isValid) {
        disableSubmit.value = true
        try{
            await saveOrderInfo()
            disableSubmit.value = false
            if(!patientId.value) return
            router.replace('/affiliate/schedule?bid=' + route.query.bid + '&cart=' + encodeBase64Unicode(patientRegStore.cart_products)+ '&af_ref=' + route.query.af_ref)
        } catch (error) {
            disableSubmit.value = false
            addAlert('Something went wrong, Order not processed!', 'error')
            hideLoader()
            console.error('Error in API:', error.response || error.message || error);
        }

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
    console.log('saveOrderInfo', productIds, products);
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

    

    // Properly parse the currency strings by removing non-numeric characters
    const shippingAmount = parseFloat(totalShipping.value.replace(/[^0-9.-]+/g, ""));
    const amount = parseFloat(totalAmount.value.replace(/[^0-9.-]+/g, ""));

    if(!patientRegStore.patientExist)
    {
        await signup()
   
    }

    if(!patientId.value) { 
        console.log('patientId.value',patientId.value); 
        patientRegStore.currentState = 'login'
        isLoggedIn.value = true
        hideLoader()
        return
    }

    console.log({
        patient_id: patientId.value,
        shipping_address1: addressVal,
        shipping_address2: apt.value,
        shipping_city: cityVal,
        shipping_state: stateVal,
        shipping_zipcode: zipcodeVal,
        shipping_country: 'United States',
        shipping_amount: shippingAmount,
        total_amount: prescreptionRequired.value && practitioner_fee.value > 0 && !subscriptionRequired.value  ? totals.value.doctorVisitTotal : totals.value.otherProductsTotal,
        items: productIds,
        affiliate_email: patientRegStore.patient.affiliate_email,
        prescreption_required: prescreptionRequired.value,
        practitioner_fee: practitioner_fee.value,
        provider_id: builderStore.provider_id,
        appointment_id: patientRegStore.appointment.id,
        wp_order_id: null
    })
    const formsArr = builderStore.layout.filter(item => item.type === 'forms' || item.type === 'comboforms');
    
    await patientRegStore.saveAffiliateOrder(
        {
            patient_id: patientId.value,
            shipping_address1: addressVal,
            shipping_address2: apt.value,
            shipping_city: cityVal,
            shipping_state: stateVal,
            shipping_zipcode: zipcodeVal,
            shipping_country: 'United States',
            shipping_amount: shippingAmount,
            total_amount: prescreptionRequired.value && practitioner_fee.value > 0 && !subscriptionRequired.value  ? totals.value.doctorVisitTotal : totals.value.otherProductsTotal,
            items: productIds,
            affiliate_email: patientRegStore.patient.affiliate_email,
            prescreption_required: prescreptionRequired.value,
            practitioner_fee: practitioner_fee.value,
            provider_id: builderStore.provider_id,
            appointment_id: patientRegStore.appointment.id,
            pending_task: formsArr.length > 0 ? true : false,
            builder_id: bid,
            wp_order_id: null

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

const changeEmailSignUp = () => {
    patientRegStore.currentState = null
};

const isLoggedIn = computed(() => patientRegStore.currentState === 'login')

const onEmailBlur = async () => {
    if (patientRegStore.currentState !== 'loggedin') {
        if(patientRegStore.patient.email)
            await patientRegStore.checkPatientEmail()
        // if (patientRegStore.currentState === 'register' && !patientRegStore.patientExist) signup()
    }

}

const login = async () => {

    if (patientRegStore.patient.email && patientRegStore.patient.password) {


        showLoader()
        try {
            let resp = await patientAuthService.justLogin(patientRegStore.patient.email, patientRegStore.patient.password)
            patientId.value = resp.userData.id
            patientRegStore.patient.id = patientId.value
            patientRegStore.patient.first_name = resp.userData.fname
            patientRegStore.patient.last_name = resp.userData.lname
            patientRegStore.patient.email = resp.userData.email
            patientRegStore.patient.phone_no = resp.userData.preferred_phone
            address.value = resp.userData.address
            city.value = resp.userData.city
            state.value = resp.userData.state
            zipcode.value = resp.userData.zipcode
            patientRegStore.currentState = 'loggedin'
        } catch (e) {
            addAlert(e.response?._data?.message ?? 'Something went wrong', 'error')
        }
        hideLoader()


    }


}

const signup = async () => {
    console.log(patientRegStore.patient.first_name,
        patientRegStore.patient.last_name,
        patientRegStore.patient.email,
        patientRegStore.patient.phone_no)
    if (
        patientRegStore.patient.first_name &&
        patientRegStore.patient.last_name &&
        patientRegStore.patient.email &&
        patientRegStore.patient.phone_no
    ) {
        if (patientRegStore.currentState === 'register') {


            patientRegStore.patient.provider_id = builderStore.provider_id

            showLoader()
            try {
                let resp = await patientAuthService.justRegister(patientRegStore.patient)
                if(resp?.error === 'email already exist.') {
                    patientRegStore.currentState = 'login'
                    isLoggedIn.value = true
                    hideLoader()
                    return
                }
                patientId.value = resp.userData.id
                patientRegStore.patient.id = patientId.value
                patientRegStore.currentState = 'register'

            } catch (e) {
                console.log('e',e)
                if (e.response?.data?.errors) {
                    Object.values(e.response.data.errors).forEach((error) => {
                        addAlert(error, 'error');
                    });
                    } else if(e.response?.error) {
                        addAlert(e.response?.error, 'error');
                    }else{
                    addAlert(e.response?.data?.message ?? 'Something went wrong', 'error');
                    }
            }
            hideLoader()
        }

    }
}

const safeBtoa = (str) => {
    return btoa(unescape(encodeURIComponent(str)));
}

patientRegStore.$subscribe(debounce((mutation, state) => {

    localStorage.setItem('patientRegStore', safeBtoa(JSON.stringify(state)))

}))

</script>
<template>
    <div style="background-color: white;">
        <v-dialog v-model="paymentPopup" width="auto">
            <v-card max-width="400" prepend-icon="mdi-checkbox-marked-circle" :text=paymentPopupText
                title="Payment Success">
            </v-card>
        </v-dialog>
        <div style="position: relative;">
            <Steps currentStep="Payment"></Steps>
        </div>
        <VContainer>
            <VRow style="display: flex; justify-content: center; align-items: center;position: relative;" class="">

                <VCol cols="12" :class="isMobile ? 'px-2' : 'px-8 py-8 mt-6'">
                    <!-- Main Card -->
                    <VForm ref="paymentForm" @submit.prevent="() => { }">
                        <div class="d-flex align-center" style="min-height: calc(0px + 90vh);">
                            <VRow :class="isMobile ? 'mt-5' : ''">
                                <VDivider v-if="!isMobile"></VDivider>
                                <VCol cols="12" md="6" class="col-order-1" :class="isMobile ? '' : 'px-0 pr-10 pt-10'"
                                    :style="isMobile ? '' : 'border-right: 1px solid #e1e1e1;'">
                                    <div :class="isMobile ? 'custom-card' : ''">
                                        <div class="mb-6">
                                            <h3 class="text-left mb-0 custom-color custom-heading"
                                                v-if="patientRegStore.currentState === 'register' || patientRegStore.currentState === 'checklogin' || !patientRegStore.currentState">
                                                {{ $t('Create Your') }} Peptide WebMD {{ $t('Account') }}</h3>
                                            <h3 class="text-left mb-0 custom-color custom-heading"
                                                v-if="patientRegStore.currentState === 'loggedin' || patientRegStore.currentState === 'login'">
                                                {{ $t(`You’ve got an account, please login`) }}</h3>
                                            <small
                                                v-if="patientRegStore.currentState === 'loggedin' || patientRegStore.currentState === 'register' || patientRegStore.currentState === 'login'">
                                                <span>{{ $t('This is not your email?') }} </span>
                                                <span>
                                                    <a class=" cursor-pointer" @click="changeEmailSignUp()">{{
                                                        $t('(Change)') }}</a>
                                                </span>
                                            </small>
                                        </div>
                                        <VRow>
                                            <VCol cols="12" md="6">
                                                <label>{{ $t('First Name') }}</label>
                                                <VTextField v-model="patientRegStore.patient.first_name" label=""
                                                    type="text" :rules="[requiredValidator]"
                                                    :error-messages="errors.name" density="comfortable" />
                                            </VCol>
                                            <VCol cols="12" md="6">
                                                <label>{{ $t('Last Name') }} </label>
                                                <VTextField v-model="patientRegStore.patient.last_name" label=""
                                                    type="text" :rules="[requiredValidator]"
                                                    :error-messages="errors.last_name" density="comfortable" />
                                            </VCol>
                                            <VCol cols="12" md="12">
                                                <label>{{ $t('Email Address') }}</label>
                                                <VTextField v-model="patientRegStore.patient.email" label=""
                                                    type="email" :rules="[requiredValidator, emailValidator]"
                                                    :error-messages="errors.email" density="comfortable"
                                                    @blur="onEmailBlur"
                                                    :disabled="patientRegStore.currentState === 'loggedin'" />
                                            </VCol>
                                            <VCol cols="12" md="12">
                                                <label>{{ $t('Phone Number') }} </label>
                                                <VTextField v-model="patientRegStore.patient.phone_no" label=""
                                                    pattern="^\(\d{3}\) \d{3}-\d{4}$"
                                                    :rules="[requiredValidator, validUSAPhone]"
                                                    :error-messages="errors.phone"
                                                    :placeholder="$t('For notifications & verification')"
                                                    @input="formatPhoneNumber" max="14" density="comfortable"
                                                     />
                                            </VCol>
                                        </VRow>
                                        <p class="mt-4 disclaimer"
                                            v-if="patientRegStore.currentState === 'register' || patientRegStore.currentState === 'checklogin' || !patientRegStore.currentState">
                                            {{ $t(`Your account will be automatically created, and login credentials
                                            will be sent to your email.`) }}</p>
                                        <!-- Form Container -->
                                    </div>
                                    <div class="mt-10">
                                        <div :class="isMobile ? 'custom-card' : ''">
                                            <div class="mb-3">
                                                <h3 class="text-left mb-0 custom-color custom-heading">
                                                    {{ $t('Shipping Information') }}
                                                </h3>
                                                <small>{{ $t('Please provide your shipping details.') }}</small>
                                            </div>
                                            <VRow>
                                                <VCol cols="12" md="12">
                                                    <VTextField v-model="address" :label="$t('Address')"
                                                        :rules="[requiredValidator]" density="comfortable" />
                                                </VCol>
                                                <VCol cols="12" md="12">
                                                    <VTextField v-model="apt" :label="$t('APT/Suite #')"
                                                        density="comfortable" />
                                                </VCol>
                                            </VRow>
                                            <VRow>
                                                <VCol cols="12" md="12">
                                                    <VTextField v-model="city" :label="$t('City')"
                                                        :rules="[requiredValidator]" density="comfortable" />
                                                </VCol>
                                                <VCol cols="12" md="6">
                                                    <v-autocomplete clearable v-model="state"
                                                        :label="$t('Select State')" :items="sortedStates"
                                                        item-title="name" item-value="abbreviation"
                                                        :rules="[requiredValidator]" :error-messages="errors.state"
                                                        density="comfortable"></v-autocomplete>
                                                </VCol>
                                                <VCol cols="12" md="6">
                                                    <VTextField type="number" v-model="zipcode"
                                                        :rules="[requiredValidator]" :label="$t('Zip Code')"
                                                        density="comfortable" />
                                                </VCol>
                                            </VRow>
                                        </div>
                                    </div>
                                    <div class="mt-4" v-if="isMobile">
                                        <div class="text-center mb-2 mt-6">
                                            <VBtn class="px-4 mb-6" color="primary" variant="flat" block size="large"
                                                @click="corfirmFun" :disabled="disableSubmit">
                                                {{ $t('Confirm & Pay') }} {{ prescreptionRequired  && practitioner_fee > 0 && !subscriptionRequired ? productTotalPreReq(1, totals.doctorVisitTotal) : productTotalPreReq(1, totals.otherProductsTotal) }}
                                            </VBtn>
                                            <!-- <a class="custom-color mt-4" href="#">Need Help?</a> -->
                                        </div>
                                        <p class="disclaimer">
                                            {{ $t('Your doctor will review your medical history before approving the prescription.') }}
                                            {{ $t('If the prescription is not approved, the peptide charge will not be billed.') }}
                                        </p>
                                    </div>

                                </VCol>
                                <VCol cols="12" md="6" class="col-order-2" :class="isMobile ? '' : 'px-0 pl-10 pt-10'">

                                    <h3 class="text-left mb-0 custom-color custom-heading mb-4"
                                        :class="isMobile ? '' : ''" v-if="!isMobile">
                                        {{ $t('Order Summary') }}</h3>
                                    <!-- Cart Container -->
                                    <Cart></Cart>
                                    <div v-if="!isMobile">
                                        <div class="text-center mb-2 mt-6">
                                            <VBtn class="px-4 mb-6" color="primary" variant="flat" block size="large"
                                                @click="corfirmFun" :disabled="disableSubmit">
                                                {{ $t('Confirm & Pay') }} 
                                                    {{ prescreptionRequired  && practitioner_fee > 0 && !subscriptionRequired ? productTotalPreReq(1, totals.doctorVisitTotal) : productTotalPreReq(1, totals.otherProductsTotal) }}
                                            </VBtn>
                                            <!-- <a class="custom-color mt-4" href="#">Need Help?</a> -->
                                        </div>
                                        <p class="disclaimer">
                                            {{ $t('Your doctor will review your medical history before approving the prescription.') }}
                                            {{ $t('If the prescription is not approved, the peptide charge will not be billed.') }}
                                        </p>

                                    </div>
                                </VCol>

                            </VRow>
                        </div>
                    </VForm>
                </VCol>

            </VRow>
        </VContainer>

        <v-dialog v-model="isLoggedIn" width="500" content-class="scrollable-dialog">
            <v-card class="pa-4">
                <!-- Login Form -->
                <v-form>
                    <v-card-text class="px-0 py-1">
                        <!-- Header -->
                        <div class="text-center pt-6 pb-2">
                            <h2 class="custom-color">{{ $t('Welcome Back!') }}</h2>
                        </div>
                        <v-card-subtitle class="text-center pb-4">
                            {{ $t('Please log in to continue your purchase') }}
                        </v-card-subtitle>

                        <!-- Existing account alert -->
                        <v-alert border="start" border-color="primary" variant="tonal" color="primary" class="mb-4">
                            <div class="font-weight-medium mb-1">{{ $t('Existing Account Detected') }} </div>
                            <div class="text-body-2">
                                {{ $t(`We've detected that`) }} <strong>{{ patientRegStore.patient.email }}</strong>
                                {{ $t(`is already registered with us.`) }}
                                {{ $t(`Please sign in to access your saved information and continue your order.`) }}

                            </div>
                        </v-alert>

                        <!-- Email Field -->
                        <div class="mb-3">
                            <label class="text-body-1 font-weight-medium mb-1 d-block">{{ $t('Email Address') }}</label>
                            <VTextField v-model="patientRegStore.patient.email" label="" type="email"
                                :rules="[requiredValidator, emailValidator]" :error-messages="errors.email"
                                density="comfortable" @blur="onEmailBlur"
                                :readonly="patientRegStore.currentState === 'loggedin'" />
                        </div>

                        <!-- Password Field -->
                        <div class="mb-2">
                            <label class="text-body-1 font-weight-medium mb-1 d-block">{{ $t('Password') }}</label>
                            <VTextField v-model="patientRegStore.patient.password" label="" placeholder="············"
                                :rules="[requiredValidator]" :type="isPasswordVisible ? 'text' : 'password'"
                                :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                                @click:append-inner="isPasswordVisible = !isPasswordVisible"
                                prepend-inner-icon="tabler-lock" />
                        </div>

                        <!-- Remember me and Forgot password -->
                        <div class="d-flex justify-space-between align-center my-2">
                            <v-checkbox v-model="rememberMe" :label="$t('Remember me')" density="compact"
                                hide-details></v-checkbox>
                            <router-link :to="'/patient/forgot'" class="forgot-password" target="_blank"
                                rel="noopener noreferrer">
                                {{ $t('Forgot Password?') }}
                            </router-link>
                        </div>

                        <!-- Login Button -->
                        <v-btn size="large" block class="mt-4" rounded="lg" height="50" @click="login">
                            {{ $t('Log In & Continue Checkout') }}
                        </v-btn>

                        <!-- Create new account link -->
                        <div class="text-center mt-3">
                            <VBtn @click="patientRegStore.currentState = 'register'" variant="text">
                                {{ $t('Create a new account') }}
                            </VBtn>
                        </div>
                    </v-card-text>
                </v-form>


            </v-card>
        </v-dialog>

    </div>
</template>
<style scoped>
::v-deep(.progress-container){
    margin-bottom: 0px;
}
.bg-light-blue-lighten-5 {
    background-color: #f0f8ff !important;
}

.card-icons {
    display: flex;
    gap: 12px;
    margin-top: 20px;
}

.card-icon {
    width: 40px;
    height: 25px;
    background-color: #f5f5f5;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}

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

/* // @use "@core/scss/template/pages/page-auth.scss"; */
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
