<script setup>
definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})
import 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBdqGrpK1HLNCZJueD7g3uUlKcLEDM_MmQ&libraries=places';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Cart from './components/cart.vue';
const store = useStore()
const router = useRouter()
const route = useRoute()
let builderData = JSON.parse(localStorage.getItem('builderData'));
const practitioner_fee = ref(0)
const isMobile = ref(window.innerWidth <= 768); // Assuming mobile width is less than or equal to 768px
const patient_id = localStorage.getItem('patient_id')
const access_token = localStorage.getItem('access_token');

const isTonalSnackbarVisible = ref(false)
const patientResponse = ref(false)
const isLoadingVisible = ref(false)
const paymentForm = ref()
const cardNumber = ref('')
const expiry = ref('')
const cvv = ref('')
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const address = ref('')
const apt = ref('')
const city = ref('')
const state = ref('')
const zipcode = ref('')
const billingaddress = ref('')
const billingapt = ref('')
const billingcity = ref('')
const billingstate = ref('')
const billingzipcode = ref('')
const termAndCondtiton = ref(true)
const billingSection = ref(false)
const schedule_consultant = ref(true)
const order_complete = ref(false);
const planName = ref(null)
const planAmount = ref(null)
const list_one_title = ref(null)
const list_sub_title = ref(null)
const list_two_title = ref(null)
const prescription_required = ref(null)
const shipping_price = ref(null)
const confirmPopup = ref(false)
const verifiedAddress = ref(null);
const suggestedStreet = ref(null);
const suggestedCity = ref(null);
const suggestedState = ref(null);
const suggestedZip = ref(null);
const suggestedAddress = ref(null);
const selectedAddress = ref('notsuggested')
const typedAddress = ref(null)
const seetingPlanLogo = ref();
const products = JSON.parse(localStorage.getItem('cart_products'));
const patientData = JSON.parse(localStorage.getItem('patient_data'));
let nextPage = localStorage.getItem('next_page');
const totalShipping = ref(0)
const totalAmount = ref(0)
const grandTotal = ref(0)
const prescreptionRequired = ref(false)
const paymentPopup = ref(false)
const paymentPopupText = ref(null)
const states = ref([
    { name: 'Alabama', abbreviation: 'AL' },
    { name: 'Alaska', abbreviation: 'AK' },
    { name: 'Arizona', abbreviation: 'AZ' },
    { name: 'Arkansas', abbreviation: 'AR' },
    { name: 'Howland Island', abbreviation: 'UM-84' },
    { name: 'Delaware', abbreviation: 'DE' },
    { name: 'Maryland', abbreviation: 'MD' },
    { name: 'Baker Island', abbreviation: 'UM-81' },
    { name: 'Kingman Reef', abbreviation: 'UM-89' },
    { name: 'New Hampshire', abbreviation: 'NH' },
    { name: 'Wake Island', abbreviation: 'UM-79' },
    { name: 'Kansas', abbreviation: 'KS' },
    { name: 'Texas', abbreviation: 'TX' },
    { name: 'Nebraska', abbreviation: 'NE' },
    { name: 'Vermont', abbreviation: 'VT' },
    { name: 'Jarvis Island', abbreviation: 'UM-86' },
    { name: 'Hawaii', abbreviation: 'HI' },
    { name: 'Guam', abbreviation: 'GU' },
    { name: 'United States Virgin Islands', abbreviation: 'VI' },
    { name: 'Utah', abbreviation: 'UT' },
    { name: 'Oregon', abbreviation: 'OR' },
    { name: 'California', abbreviation: 'CA' },
    { name: 'New Jersey', abbreviation: 'NJ' },
    { name: 'North Dakota', abbreviation: 'ND' },
    { name: 'Kentucky', abbreviation: 'KY' },
    { name: 'Minnesota', abbreviation: 'MN' },
    { name: 'Oklahoma', abbreviation: 'OK' },
    { name: 'Pennsylvania', abbreviation: 'PA' },
    { name: 'New Mexico', abbreviation: 'NM' },
    { name: 'American Samoa', abbreviation: 'AS' },
    { name: 'Illinois', abbreviation: 'IL' },
    { name: 'Michigan', abbreviation: 'MI' },
    { name: 'Virginia', abbreviation: 'VA' },
    { name: 'Johnston Atoll', abbreviation: 'UM-67' },
    { name: 'West Virginia', abbreviation: 'WV' },
    { name: 'Mississippi', abbreviation: 'MS' },
    { name: 'Northern Mariana Islands', abbreviation: 'MP' },
    { name: 'United States Minor Outlying Islands', abbreviation: 'UM' },
    { name: 'Massachusetts', abbreviation: 'MA' },
    { name: 'Connecticut', abbreviation: 'CT' },
    { name: 'Florida', abbreviation: 'FL' },
    { name: 'District of Columbia', abbreviation: 'DC' },
    { name: 'Midway Atoll', abbreviation: 'UM-71' },
    { name: 'Navassa Island', abbreviation: 'UM-76' },
    { name: 'Indiana', abbreviation: 'IN' },
    { name: 'Wisconsin', abbreviation: 'WI' },
    { name: 'Wyoming', abbreviation: 'WY' },
    { name: 'South Carolina', abbreviation: 'SC' },
    { name: 'Arkansas', abbreviation: 'AR' },
    { name: 'South Dakota', abbreviation: 'SD' },
    { name: 'Montana', abbreviation: 'MT' },
    { name: 'North Carolina', abbreviation: 'NC' },
    { name: 'Palmyra Atoll', abbreviation: 'UM-95' },
    { name: 'Puerto Rico', abbreviation: 'PR' },
    { name: 'Colorado', abbreviation: 'CO' },
    { name: 'Missouri', abbreviation: 'MO' },
    { name: 'New York', abbreviation: 'NY' },
    { name: 'Maine', abbreviation: 'ME' },
    { name: 'Tennessee', abbreviation: 'TN' },
    { name: 'Georgia', abbreviation: 'GA' },
    { name: 'Louisiana', abbreviation: 'LA' },
    { name: 'Nevada', abbreviation: 'NV' },
    { name: 'Iowa', abbreviation: 'IA' },
    { name: 'Idaho', abbreviation: 'ID' },
    { name: 'Rhode Island', abbreviation: 'RI' },
    { name: 'Washington', abbreviation: 'WA' },
    { name: 'Ohio', abbreviation: 'OH' },
    // ... (add the rest of the states)
]);
const sortedStates = computed(() => {
    return states.value.slice().sort((a, b) => {
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
  if(builderData.patientFlow.length == 1)
  {
      console.log('builderData.patientFlow',builderData.patientFlow)
      localStorage.setItem('builderData',JSON.stringify(updatePatientFlow(builderData, nextPage)))
      builderData = JSON.parse(localStorage.getItem('builderData'))
      localStorage.setItem('next_page','thankyou')
      nextPage = localStorage.getItem('next_page');
  }
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
        if(price > 0 && product.status === 'active')
        totalAmount.value += product.qty * price;

    });
    let options = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };
    if(prescreptionRequired.value)
    {
        practitioner_fee.value = builderData.practitioner_fee
    }
    grandTotal.value = new Intl.NumberFormat('en-US', options).format(parseFloat(totalAmount.value) + parseFloat(totalShipping.value));
    totalAmount.value = new Intl.NumberFormat('en-US', options).format(totalAmount.value);
    totalShipping.value = new Intl.NumberFormat('en-US', options).format(totalShipping.value);
    

})
onMounted(async () => {
    window.addEventListener('resize', checkIfMobile);
    const b1 = document.querySelector('.bg-custom-color');
    if (b1) {
        b1.style.background = builderData.bg_color;
    }
    const bt = document.querySelector('.v-btn.bg-primary');
    if (bt) {
        console.log(bt);
        bt.style.setProperty('background-color', builderData.btn_color, 'important');
    }
})
// Detach event listener on component unmount
onUnmounted(() => {
    window.removeEventListener('resize', checkIfMobile);
});
const updatePatientFlow = (obj, itemToExclude) => {
  return {
        ...obj,  // Spread the original object
        patientFlow: obj.patientFlow.filter(item => item !== itemToExclude)  // Update patientFlow
    };
}
const productTotalPreReq = (price) => {
    let options = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };
    return new Intl.NumberFormat('en-US', options).format(parseFloat(price));
};
const productTotal = (product) => {
    let options = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };
    return new Intl.NumberFormat('en-US', options).format(product.qty * parseFloat(product.price));
};
const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};


const billingAddressShow = () => {
    if (billingSection.value == false) {
        billingSection.value = true;
    } else {
        billingSection.value = false;
    }

}
const corfirmFun = async () => {
    confirmPopup.value = true;
    if (address.value && city.value && state.value && zipcode.value)
        typedAddress.value = address.value + ' ' + city.value + ' ' + state.value + ' ' + zipcode.value
    if (address.value)
        await verfiFyAddress(address.value);
}
const validatePayment = async () => {
    const { valid: isValid } = await paymentForm.value?.validate();
    console.log('isValid ', isValid);
    if (isValid) {
        await saveOrderInfo()
        
        if (store.getters.getShowMsg) {
        if (store.getters.getPaymentProcessed) {
          paymentPopupText.value = "Your payment for $"+parseFloat(grandTotal.value.replace(/[^0-9.-]+/g, ""))+" was successful"
          paymentPopup.value = store.getters.getPaymentProcessed
          setTimeout(() => {
            if(builderData.patientFlow.length > 0){
              localStorage.setItem('builderData',JSON.stringify(updatePatientFlow(builderData, nextPage)))
              let builder = JSON.parse(localStorage.getItem('builderData'))
              localStorage.setItem('next_page',builder.patientFlow[0]? builder.patientFlow[0]:[])
              console.log('/'+builder.theme_name+'/'+builder.patientFlow[0])
              router.replace(route.query.to ? String(route.query.to) : '/'+builder.theme_name+'/'+builder.patientFlow[0])
            }else{
                console.log( '/'+builderData.theme_name+'/thankyou')
                router.replace(route.query.to ? String(route.query.to) : '/'+builderData.theme_name+'/thankyou')
            }
          }, 5000)
        }
      }
    }
};

const updatePatientAddress = async () => {
    console.log('updatePatientAddress');
    // await store.dispatch('updatePatientAddress', {
    //     address: address.value,
    //     city: city.value,
    //     state: state.value,
    //     zip_code: zipcode.value,
    //     country: 'United States',
    // })
}
const saveOrderInfo = async () => {
    const productIds = products.map(product => ({ product_id: product.id, qty: product.qty, subscription: product.subscription, onetime: product.onetime }));
    console.log('saveOrderInfo',productIds);
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
    if(affiliate === 'null')
      affiliate = null
    await store.dispatch('saveShippingInformation', {
        uuid: patientData.uuid,
        patient_id: localStorage.getItem("patient_id"),
        shipping_address1: addressVal,
        shipping_address2: apt.value,
        shipping_city: cityVal,
        shipping_state: stateVal,
        shipping_zipcode: zipcodeVal,
        shipping_country: 'United States',
        shipping_amount: parseFloat(totalShipping.value.replace(/[^0-9.-]+/g, "")),
        total_amount: parseFloat(totalAmount.value.replace(/[^0-9.-]+/g, "")),
        items: productIds,
        card_number: cardNumber.value,
        cvv: cvv.value,
        expiration_month: month,
        expiration_year: year,
        affiliate_email: affiliate ? affiliate : null,
        prescreption_required: prescreptionRequired.value,
        practitioner_fee:practitioner_fee.value,
        provider_id: builderData.builder_provider_id

    })

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
    console.log('selectedAddress.value',selectedAddress.value)
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
    <v-dialog
      v-model="paymentPopup"
      width="auto"
    >
      <v-card
        max-width="400"
        prepend-icon="mdi-checkbox-marked-circle"
        :text=paymentPopupText
        title="Payment Success"
      >
      </v-card>
    </v-dialog>
    <VRow
    style="min-height: 101.7dvh; max-height: 101.7dvh; margin: 0px;"
    :style="isMobile ? { marginTop: '90px' } : { marginTop: '0px' }"
    >
        <VCol cols="12" md="6" class="bg-custom col-order-1"
            :class="isMobile ? '' : 'auth-wrapper d-flex align-center justify-center pa-4'">
            <Cart></Cart>
        </VCol>
        <VCol cols="12" md="6" class="bg-custom-color col-order-2"
            :class="isMobile ? '' : 'auth-wrapper d-flex align-center justify-center pa-4'">
            <VCard>
                <VCardText>
                    <VForm ref="paymentForm" @submit.prevent="() => { }">
                        <div class="mb-3">
                            <h5 class="text-h5 mb-1 text-left mb-4">Shipping Information</h5>
                            <small>Please provide your shipping details below so that we can
                                promptly send you
                                the
                                product</small>
                        </div>
                        <VRow>
                            <VCol cols="12" md="12">
                                <VTextField v-model="address" label="Address" :rules="[requiredValidator]"
                                    density="comfortable" />
                            </VCol>
                            <VCol cols="12" md="12">
                                <VTextField v-model="apt" label="APT/Suite #" density="comfortable" />
                            </VCol>
                        </VRow>
                        <VRow>
                            <VCol cols="12" md="4">
                                <VTextField v-model="city" label="City" :rules="[requiredValidator]"
                                    density="comfortable" />
                            </VCol>
                            <VCol cols="12" md="5">
                                <v-autocomplete clearable v-model="state" label="Select State"
                                    :items="sortedStates" item-title="name" item-value="abbreviation"
                                    :rules="[requiredValidator]" :error-messages="errors.state"
                                    density="comfortable">
                                </v-autocomplete>
                            </VCol>
                            <VCol cols="12" md="3">
                                <VTextField type="number" v-model="zipcode" :rules="[requiredValidator]"
                                    label="ZipCode" density="comfortable" />
                            </VCol>
                        </VRow>
                        <div class="mb-3">
                            <h4 class="mb-2 mt-4">
                                Card Information &nbsp;<VIcon>mdi-credit-card</VIcon>
                            </h4>
                        </div>
                        <VRow>
                            <VCol cols="12" lg="12" md="12">
                                <VTextField v-model="cardNumber" label="Credit Card Number*"
                                    :rules="[requiredValidator, cardNumberValidator]"
                                    placeholder="xxxxxxxxxxxxxxxx" @input="cardNumberFormat"
                                    density="comfortable" />
                            </VCol>
                            <VCol cols="12" lg="6" md="6">
                                <VTextField v-model="expiry" label="Expiration Date*"
                                    :rules="[requiredValidator, expiryValidator]" placeholder="MM/YY"
                                    @input="formatExpiry" density="comfortable" />
                            </VCol>
                            <VCol cols="12" lg="6" md="6">
                                <VTextField v-model="cvv" :rules="[requiredValidator, cvvValidator]"
                                    label="CVV*" maxlength="3" @input="handleCVVInput" density="comfortable" />
                            </VCol>
                        </VRow>
                        <v-card class="px-2 mt-2 mb-2" flat v-if="billingSection">
                            <h3 class="mb-3">Billing Information</h3>
                            <VRow>
                                <VCol cols="12" md="6">
                                    <VTextField v-model="billingaddress" label="Address"
                                        :rules="[requiredValidator]" density="comfortable" />
                                </VCol>
                                <VCol cols="12" md="6">
                                    <VTextField v-model="billingapt" label="APT/Suite #"
                                        density="comfortable" />
                                </VCol>
                            </VRow>
                            <VRow>
                                <VCol cols="12" md="6">
                                    <VTextField v-model="billingcity" label="City" :rules="[requiredValidator]"
                                        density="comfortable" />
                                </VCol>
                            </VRow>
                        </v-card>
                        <div class="text-center mb-2 mt-4">
                            <VBtn class="px-4 mb-2" color="primary" variant="flat" block @click="corfirmFun">
                                Checkout</VBtn>

                        </div>
                        <VDialog v-model="confirmPopup" refs="myDialog" persistent width="500">
                            <v-card>
                                <v-card-text>
                                    <div class="mt-2 mb-2">
                                        <small>Select the correct address that match your current
                                            address</small>
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
                                    <v-btn type="submit" text="Confirm" @click="validatePayment"></v-btn>
                                    <v-btn text="Close" @click="confirmPopup = false"></v-btn>
                                </v-card-actions>
                            </v-card>
                            <!-- </template> -->
                        </VDialog>
                    </VForm>
                </VCardText>
            </VCard>
        </VCol>
    </VRow>
</template>
<style scoped>
@media only screen and (max-width: 768px) {
  .second-card{
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
.container-padding{
  padding: 0px;
}
.card-margin{
    margin: 30px;
  }

.total-font {
  font-size: 20px;
  margin-bottom: 5px;
}

.bg-custom {
  background: #F3F3F3;
}

.bg-custom-color {
  background: #E0F0E3;
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

.bg-custom {
    background: #F3F3F3;
}

.bg-custom-color {
    background: #E0F0E3;
}

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
