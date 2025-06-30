<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Affiliate Products View',
  },
})

import { useAffiliateStore } from '@/stores/affiliateStore';
import { hideLoader, showLoader } from '@/utils/showLoader'
import { statesList } from '@/utils/states';
import 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBdqGrpK1HLNCZJueD7g3uUlKcLEDM_MmQ&libraries=places';
import QRCode from 'qrcode'; // Import the QR code library
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

const { currentUser, currentRole, logout } = useAuth()
const affiliateStore = useAffiliateStore()
const userData = currentUser;
const router = useRouter();

const cart = ref([]);
const products = ref([]);
const appointmentForm = ref()
const providerId = ref(null);
const snackbar = ref(false);
const link = ref(null);
const qrCodeSrc = ref(null); // To store the generated QR code data URL
const practitioners = ref([])
const patientsList = ref([])
const locationsList = ref([])
const providerSlots = ref([])
const providerAvailbleDates = ref([])
const allowedDates = ref([]);

const practitionerId = ref(null)
const builderId = ref(null)
const practitionerFee = ref(null)
const patientId = ref(null)
const title = ref(null)
const date = ref(null)
const start_time = ref(null)
const end_time = ref(null)
const service = ref(null)
const status = ref(null)
const room = ref(null)
const location = ref(null)
const appointment_type = ref(null)
const payment_type = ref(null)
const notes = ref(null)

const eventStatuses = [
  { value: "ON_TIME", label: "On Time" },
  { value: "CHECKED_IN", label: "Checked In" },
  { value: "CONFIRMED", label: "CONFIRMED" },
  { value: "READY_FOR_PROVIDER", label: "Ready for Provider" },
  { value: "WITH_PROVIDER", label: "With Provider" },
  { value: "NOTE_COMPLETE", label: "Note Complete" },
  { value: "CHECKED_OUT", label: "Checked Out" },
  { value: "BILLING_DONE", label: "Billing Done" },
  { value: "DELAYED", label: "Delayed" },
  { value: "TENTATIVE", label: "Tentative" },
  { value: "RESCHEDULED", label: "Rescheduled" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "CANCELLATION_LATE", label: "Cancelled - Late" },
  { value: "CANCELLATION_BY_PROVIDER", label: "Cancelled - By Provider" },
  { value: "NO_SHOW", label: "No Show" }
];

const services = [
  { value: "Test", label: "Test" },
];

const rooms = [
  { value: "9722", label: "Doctor Room One" },
  { value: "9725", label: "Test room 1" },
  { value: "10319", label: "Asif Test" }
];

const appointmentTypes = [
  { value: "INITIAL_CONSULT", label: "New Patient (Initial Visit)" },
  { value: "FOLLOW_UP", label: "Returning Patient (Follow up)", selected: true }
];

const paymentTypes = [
  { value: "Cash Only", label: "Cash Only" },
  { value: "Insurance Only", label: "Insurance Only" },
  { value: "Cash and Insurance", label: "Cash and Insurance" },
  { value: "Auto", label: "Auto" },
  { value: "Workers", label: "Workers" },
  { value: "Prepaid", label: "Prepaid" }
];

const paymentForm = ref()
const builderData = ref(null)
const practitioner_fee = ref(0)
const address = ref('')
const apt = ref('')
const city = ref('')
const state = ref('')
const zipcode = ref('')
const confirmPopup = ref(false)
const verifiedAddress = ref(null);
const suggestedStreet = ref(null);
const suggestedCity = ref(null);
const suggestedState = ref(null);
const suggestedZip = ref(null);
const suggestedAddress = ref(null);
const selectedAddress = ref('notsuggested')
const typedAddress = ref(null)
const totalShipping = ref(0)
const totalAmount = ref(0)
const grandTotal = ref(0)
const prescreptionRequired = ref(false)
const paymentPopup = ref(false)
const paymentPopupText = ref(null)
const states = statesList
const sortedStates = computed(() => {
  return states.slice().sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
});
const cardNumber = ref('')
const expiry = ref('')
const cvv = ref('')
const errors = ref({
  address: undefined,
  city: undefined,
  state: undefined,
  zipcode: undefined,
  country: undefined,

})

onBeforeMount(async () => {
  showLoader()
  let pros = await $api(GET_AFFILIATE_PRODUCTS_LIST, {
    method: 'GET',
    onResponseError({ response }) {
      console.error('Error in plans API:', response);
    }
  });
  products.value = pros.data.filter(
    item => item.provider_id !== null
      // && item.practitioner_id !== null
      && item.builder_id !== null
  );

  hideLoader()
});

const selectedProduct = ref(null);
const isDialogOpen = ref(false);
const isDialogAppointmentShow = ref(false)
const isDialogCartShow = ref(false)

const openProductDialog = async (product) => {
  let cartItem = {}
  cart.value = []
  selectedProduct.value = product;
  providerId.value = product.provider_id;
  practitionerId.value = product.practitioner_id;
  builderId.value = product.builder_id
  practitionerFee.value = product.practitioner_fee
  console.log('product.practitioner_id', product.practitioner_id, providerId.value)
  cartItem = {
    qty: 1,
    product_id: product.product_id,
    subscription: false,
    onetime: true,
    variation_id: product.variation_id,
    price: product.variations && product.variation_id ? product.variations[product.variation_id].price : product.price
  };
  cart.value.push(cartItem);
  const finalObject = {
    gender: 'Male',
    products: cart.value,
  };
  const jsonString = JSON.stringify(finalObject);
  const base64Encoded = btoa(jsonString);
  const baseURL = `${window.location.protocol}//${window.location.host}${router.options.history.base}`;
  link.value = `${baseURL}/cart?bid=${btoa(builderId.value)}&cart=${base64Encoded}&af_ref=${btoa(userData.value?.email)}`;

  // Generate QR code for the link
  try {
    qrCodeSrc.value = await QRCode.toDataURL(link.value);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
};

const openAppointmentDialog = async (product) => {
  isDialogAppointmentShow.value = true
  openProductDialog(product)
  patientsList.value = []

  let patRec = await getPatients()
  patientsList.value = patRec

  let slotRec = await getSlots()
  console.log('slotRec', slotRec)

  providerAvailbleDates.value = slotRec
  // allowedDates.value  = providerAvailbleDates.value.map(entry => entry.date);  
  // let data = providerAvailbleDates.value.find(data => data.date === date.value);
  // if (data && data.slots) {
  //   providerSlots.value=data.slots
  //   console.log('providerSlots',providerSlots.value)

  // }
  // To get array of dates (keys)
  allowedDates.value = Object.keys(providerAvailbleDates.value);



  locationsList.value = await getLocations()

};

const openCartDialog = async (product) => {
  isDialogCartShow.value = true
  openProductDialog(product)
  let patRec = await getPatients()
  patientsList.value = patRec


  var price = 0
  if (product.prescription === 1 && !prescreptionRequired.value) {
    prescreptionRequired.value = true
    price = parseFloat(practitionerFee.value);
  } else if (product.prescription === 1 && prescreptionRequired.value) {
    price = parseFloat(0);
  }
  else {
    price = parseFloat(product.actual_price);
  }

  product.actual_price = productTotal(product)
  const shippingPrice = parseFloat(0);
  totalShipping.value += 1 * shippingPrice;

  if (price > 0)
    totalAmount.value += 1 * price;

  let options = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };
  if (prescreptionRequired.value) {
    practitioner_fee.value = practitionerFee.value
  }
  grandTotal.value = new Intl.NumberFormat('en-US', options).format(parseFloat(totalAmount.value) + parseFloat(totalShipping.value));
  totalAmount.value = new Intl.NumberFormat('en-US', options).format(totalAmount.value);
  totalShipping.value = new Intl.NumberFormat('en-US', options).format(totalShipping.value);
};

const productTotal = (product) => {
  let options = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };
  return new Intl.NumberFormat('en-US', options).format(product.qty * parseFloat(product.price));
};

const getPatients = async () => {
  return await $api(GET_AFFILIATE_PATIENTS_LIST + '/' + userData.value?.id, {
    method: 'GET',
    onResponseError({ response }) {
      console.error('Error in pt API:', response);
    }
  });
}
const getSlots = async () => {
  const currentMonth = new Date().getMonth() + 1;
  return await $api(GET_AVAILABLE_SLOTS_DATA + '/' + practitionerId.value, {
    method: 'POST',
    body: {
      month: currentMonth,
      timezone: 'EST'
    },
    onResponseError({ response }) {
      console.error('Error in pt API:', response);
    }
  });
};

const getLocations = async () => {
  return await $api(GET_AFFILIATE_LOCATIONS_LIST + '/' + providerId.value, {
    method: 'GET',
    onResponseError({ response }) {
      console.error('Error in API:', response);
    }
  });
};

const closeProductDialog = () => {
  isDialogOpen.value = false;
  isDialogAppointmentShow.value = false
};

const copyLink = () => {
  navigator.clipboard.writeText(link.value).then(() => {
    snackbar.value = true;
  });
};
const formatDateTime = (date, startTime, endTime) => {
  // Parse date and time strings into components
  const dateStr = new Date(date).toISOString().split('T')[0]; // Get the date part of the ISO string
  const [startHour, startMinute] = parseTime(startTime);
  const [endHour, endMinute] = parseTime(endTime);

  // Create UTC Date objects with correct time components
  const start = new Date(Date.UTC(
    new Date(dateStr).getUTCFullYear(),
    new Date(dateStr).getUTCMonth(),
    new Date(dateStr).getUTCDate(),
    startHour,
    startMinute
  ));

  const end = new Date(Date.UTC(
    new Date(dateStr).getUTCFullYear(),
    new Date(dateStr).getUTCMonth(),
    new Date(dateStr).getUTCDate(),
    endHour,
    endMinute
  ));

  // Format to ISO string in UTC
  const formattedStart = start.toISOString();
  const formattedEnd = end.toISOString();

  return {
    start: formattedStart,
    end: formattedEnd
  };
};
const parseTime = (timeString) => {
  const [time, modifier] = timeString.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') hours = '0';
  if (modifier === 'pm') hours = parseInt(hours, 10) + 12;
  return [parseInt(hours, 10), parseInt(minutes, 10)];
};

const handleSubmit = () => {
  appointmentForm.value?.validate().then(async ({ valid }) => {
    // let result = formatDateTime(date, start_time,end_time);
    // event.value.start = result.start
    // event.value.end = result.end
    if (valid) {
      await saveAppointment()
      allowedDates.value = []
    }
  })
}

watch(
  () => patientId.value,
  (newPatientId) => {
    const selectedUser = patientsList.value.find((user) => user.id === newPatientId);
    if (selectedUser) {
      title.value = selectedUser.name; // Update title based on the selected user
    } else {

      title.value = ''; // Clear title if no user is selected
    }
  }
);


const saveAppointment = async () => {
  showLoader()
  try {
    const res = await $api(SAVE_AFFILIATE_APPOINTMENT + '/' + patientId.value, {
      method: 'POST',
      body: {
        practitioner_id: practitionerId.value,
        patient_id: patientId.value,
        title: title.value,
        date: date.value,
        start_time: start_time.value,
        end_time: end_time.value,
        status: status.value,
        service: service.value,
        location: 4,
        room: room.value,
        appointment_type: appointment_type.value,
        payment_type: payment_type.value,
        notes: notes.value,
        affiliate_id: userData.value?.id
      },
      onResponseError({ response }) {
        addAlert('Something went wrong', 'error')

      },
    })
    addAlert('Appointment booked successfully', 'success')
    isDialogAppointmentShow.value = false
    practitionerId.value = null
    patientId.value = null
    title.value = null
    date.value = null
    start_time.value = null
    end_time.value = null
    status.value = null
    service.value = null
    location.value = null
    room.value = null
    appointment_type.value = null
    payment_type.value = null
    notes.value = null
    hideLoader()
  } catch (error) {
    hideLoader()
    if (error.response && error.response.status === 400) {
      addAlert('Slot is already booked', 'error')
    } else {
      addAlert('Something went wrong', 'error')
    }
    console.error('Error in API:', error);
  }
};

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


    if (affiliateStore.paymentProcessed) {
      paymentPopupText.value = "Your payment for $" + parseFloat(totalAmount.value.replace(/[^0-9.-]+/g, "")) + " was successful"
      paymentPopup.value = affiliateStore.paymentProcessed
      setTimeout(() => {
        affiliateStore.paymentProcessed = false
        paymentPopup.value = false
      }, 5000)
    }

  }
};

const saveOrderInfo = async () => {
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

  showLoader()
  affiliateStore.paymentProcessed = false
  try {
    await $api(SAVE_AFFILIATE_PATIENT_ORDER + '/' + userData.value?.id, {
      method: 'POST',
      body: {
        patient_id: patientId.value,
        shipping_address1: addressVal,
        shipping_address2: apt.value,
        shipping_city: cityVal,
        shipping_state: stateVal,
        shipping_zipcode: zipcodeVal,
        shipping_country: 'United States',
        shipping_amount: parseFloat(totalShipping.value.replace(/[^0-9.-]+/g, "")),
        total_amount: parseFloat(totalAmount.value.replace(/[^0-9.-]+/g, "")),
        items: cart.value,
        card_number: cardNumber.value,
        cvv: cvv.value,
        expiration_month: month,
        expiration_year: year,
        affiliate_email: userData.value?.email,
        prescreption_required: prescreptionRequired.value,
        practitioner_fee: practitioner_fee.value,
        provider_id: providerId.value,

      },
      onResponseError({ response }) {
        addAlert('Something went wrong', 'error')

      },
    })
    affiliateStore.paymentProcessed = true
    addAlert('Order placed successfully', 'success')
    confirmPopup.value = false
    isDialogCartShow.value = false
    hideLoader()
  } catch (error) {
    hideLoader()
    addAlert('Something went wrong', 'error')
    console.log('Error in API:', error);
  }

}
const verfiFyAddress = async (address) => {
  showLoader()
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
    hideLoader()
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
watch(date, (newValue) => {
  // To find slots for a specific date
  let data = providerAvailbleDates.value[newValue];
  if (data) {
    providerSlots.value = data.map(record =>
      record.formatted_datetime.split(' ')[1] + ' ' + record.formatted_datetime.split(' ')[2]
    );
    console.log('providerSlots', providerSlots.value);
  }
})

watch(start_time, (newValue) => {
  end_time.value = addMinutesToTime(newValue)
});

function addMinutesToTime(timeStr) {
  if (timeStr) {
    // Parse the time string
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    // Create a date object with the time
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + 30); // Add 30 minutes

    // Format the time back to 12-hour format
    let newHours = date.getHours();
    let newMinutes = date.getMinutes();
    let newPeriod = period;

    // Adjust period if hours changed
    if (hours === 11 && newHours === 12) {
      newPeriod = 'PM';
    } else if (hours === 12 && newHours === 1) {
      newPeriod = 'AM';
    }

    // Format hours back to 12-hour format
    if (newHours > 12) {
      newHours -= 12;
    }

    // Add leading zeros
    const formattedHours = String(newHours).padStart(2, '0');
    const formattedMinutes = String(newMinutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes} ${newPeriod}`;
  }
  return null
}
</script>

<template>
  <v-dialog v-model="paymentPopup" width="auto">
    <v-card max-width="400" prepend-icon="mdi-checkbox-marked-circle" :text=paymentPopupText title="Payment Success">
    </v-card>
  </v-dialog>
  <v-container>
    <v-snackbar v-model="snackbar" timeout="2000">
      Copied to clipboard!
    </v-snackbar>

    <v-row>
      <v-col cols="12" md="4" v-for="product in products" :key="product.id">
        <v-card style="min-height: 215px;">
          <!-- <v-img
            :src="product.image || 'https://via.placeholder.com/150'"
            height="200px"
            class="w-100"
            cover
          ></v-img> -->
          <div style="min-height: 125px;">
            <v-card-title>
              <v-row class="mt-2">
                <v-col class="text-start">{{ product.name }}</v-col>

              </v-row>
              <v-row class="mt-0">
                <v-col class="text-start" style="padding-top:0px"><small style="font-size: 12px;">By {{
                  product.provider_name }}</small></v-col>
                <v-col class="text-end font-weight-bold" style="padding-top:3px">
                  <VBadge :content="'$' + product.price" location="top start">
                    <VChip color="info" size="small">
                      <!-- <VIcon
                      start
                      icon="tabler-star"
                    /> -->
                      Commission
                    </VChip>
                  </VBadge>
                </v-col>
              </v-row>
              <!-- <v-row>
              <v-col class="text-start">
                <VBadge :content="'$'+product.price">
                  <VChip color="primary">
                    <VIcon
                      start
                      icon="tabler-star"
                    />
                    Comission
                  </VChip>
                </VBadge>
              </v-col>
              <v-col class="text-end font-weight-bold">${{ product.price }}</v-col>
            </v-row> -->
            </v-card-title>
            <!-- <v-card-subtitle style="min-height: 90px;max-height: 132px;">{{ product.description }}</v-card-subtitle> -->
            <v-card-text class="pb-0" v-if="product.variations">
              <v-select v-model="product.variation_id" :items="Object.entries(product.variations).map(([key, variation]) => ({
                value: Number(key),
                title: variation.pa_variants
              }))" item-title="title" item-value="value" label="Select Variation" density="compact"></v-select>
            </v-card-text>
          </div>
          <div style="margin: 10px; text-align: center">
            <v-btn @click="[isDialogOpen = true, openProductDialog(product)]" color="secondary" class="mt-4 mr-2"
              icon="tabler-share" rounded :disabled="product.variations && !product.variation_id">

            </v-btn>
            <v-btn @click="openAppointmentDialog(product)" color="primary" class="mt-4 mr-2">
              Book Appointment
            </v-btn>
            <v-btn @click="openCartDialog(product)" color="success" class="mt-4" icon="tabler-shopping-cart" rounded
              :disabled="product.variations && !product.variation_id">

            </v-btn>

          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog -->
    <v-dialog v-model="isDialogOpen" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Referral Link & QR Code</v-card-title>
        <v-card-text>
          <p><strong>Referral Link:</strong></p>
          <div class="d-flex gap-4 align-center flex-wrap">
            <AppTextField v-model="link" label="" readonly />
            <div class="d-flex align-self-end gap-x-2">
              <VBtn @click="copyLink" icon class="rounded" color="secondary" title="Copy Link">
                <VIcon color="white" icon="tabler-copy" />
              </VBtn>
            </div>
          </div>
          <p class="mt-2"><strong>QR Code:</strong></p>
          <v-img v-if="qrCodeSrc" :src="qrCodeSrc" max-height="200"></v-img>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="closeProductDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <VDialog v-model="isDialogAppointmentShow" class="v-dialog-sm">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogAppointmentShow = false" />

      <VCard title="Book Appointment">
        <VCardText>
          <VForm ref="appointmentForm" @submit.prevent="">
            <VRow>
              <VCol cols="12">

                <AppSelect v-model="patientId" label="Patient" :items="patientsList" item-value="id" item-title="name"
                  placeholder="Select a patient" :rules="[requiredValidator]" />
              </VCol>
              <!-- 👉 Title -->
              <VCol cols="12">
                <AppTextField v-model="title" label="Title" placeholder="Meeting with Jane" :rules="[requiredValidator]"
                  disabled />
              </VCol>

              <VCol cols="12">

                <AppSelect v-model="date" label="Date" placeholder="Select Date" :items="allowedDates"
                  :rules="[requiredValidator]" :disabled="allowedDates.length === 0" />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="start_time" label="Start" placeholder="" :items="providerSlots"
                  item-value='start_time' item-title="start_time" :rules="[requiredValidator]" />
              </VCol>

              <!-- 👉 End date -->
              <VCol cols="6">
                <AppSelect v-model="end_time" label="End" placeholder="" :items="providerSlots" item-value='end_time'
                  item-title="end_time" :rules="[requiredValidator]" />
              </VCol>


              <VCol cols="12">
                <AppSelect v-model="service" label="Service" placeholder="Select Service" :items="services"
                  item-value="value" item-title="label" />
              </VCol>

              <VCol cols="12">
                <AppSelect v-model="status" label="Status" placeholder="Select Status" :items="eventStatuses"
                  item-value="value" item-title="label" :rules="[requiredValidator]" />
              </VCol>


              <VCol cols="12">
                <AppSelect v-model="room" label="Room" placeholder="Select Room" :items="rooms" item-value="value"
                  item-title="label" />
              </VCol>

              <!-- 👉 Location -->
              <VCol cols="12">
                <AppSelect v-model="location" label="Location" placeholder="Select Location" :items="locationsList"
                  item-value="id" item-title="name" :rules="[requiredValidator]" />
              </VCol>

              <VCol cols="12">
                <AppSelect v-model="appointment_type" label="Appointment Type" placeholder="Select Appointment Type"
                  :items="appointmentTypes" item-value="value" item-title="label" />
              </VCol>

              <VCol cols="12">
                <AppSelect v-model="payment_type" label="Payment Type" placeholder="Select Payment Type"
                  :items="paymentTypes" item-value="value" item-title="label" />
              </VCol>



              <!-- 👉 Description -->
              <VCol cols="12">
                <AppTextarea v-model="notes" label="Description" placeholder="Meeting description" />
              </VCol>

              <!-- 👉 Form buttons -->
              <!-- <VCol cols="12">
                
              </VCol> -->
            </VRow>
          </VForm>
        </VCardText>
        <VCardText class="d-flex flex-wrap gap-3">
          <VSpacer />
          <VBtn @click="handleSubmit" class="me-3">
            Submit
          </VBtn>
          <VBtn @click="isDialogAppointmentShow = false">
            Close
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <VDialog v-model="isDialogCartShow" class="v-dialog-sm">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogCartShow = false" />

      <VCard title="Shipping Information"
        subtitle="Please provide shipping details below so that we can promptly send the product:">
        <VCardText>
          <VForm ref="paymentForm" @submit.prevent="validatePayment">
            <VRow>
              <VCol cols="12">
                <AppSelect v-model="patientId" label="Patient" :items="patientsList" item-value="id" item-title="name"
                  placeholder="Select a patient" />
              </VCol>
              <VCol cols="12" md="12">
                <VTextField v-model="address" label="Address" :rules="[requiredValidator]" density="comfortable" />
              </VCol>
              <VCol cols="12" md="12">
                <VTextField v-model="apt" label="APT/Suite #" density="comfortable" />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12" md="4">
                <VTextField v-model="city" label="City" :rules="[requiredValidator]" density="comfortable" />
              </VCol>
              <VCol cols="12" md="5">
                <v-autocomplete clearable v-model="state" label="Select State" :items="sortedStates" item-title="name"
                  item-value="abbreviation" :rules="[requiredValidator]" :error-messages="errors.state"
                  density="comfortable">
                </v-autocomplete>
              </VCol>
              <VCol cols="12" md="3">
                <VTextField type="number" v-model="zipcode" :rules="[requiredValidator]" label="ZipCode"
                  density="comfortable" />
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
                  :rules="[requiredValidator, cardNumberValidator]" placeholder="xxxxxxxxxxxxxxxx"
                  @input="cardNumberFormat" density="comfortable" />
              </VCol>
              <VCol cols="12" lg="6" md="6">
                <VTextField v-model="expiry" label="Expiration Date*" :rules="[requiredValidator, expiryValidator]"
                  placeholder="MM/YY" @input="formatExpiry" density="comfortable" />
              </VCol>
              <VCol cols="12" lg="6" md="6">
                <VTextField v-model="cvv" :rules="[requiredValidator, cvvValidator]" label="CVV*" maxlength="3"
                  @input="handleCVVInput" density="comfortable" />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardText class="d-flex flex-wrap gap-3">
          <VSpacer />
          <VBtn class="px-4 mb-2" color="primary" variant="flat" @click="corfirmFun"
            :disabled="!(patientId && address && city && state && zipcode)">
            Checkout</VBtn>
          <VBtn @click="isDialogCartShow = false">
            Close
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <VDialog v-model="confirmPopup" refs="myDialog" persistent width="500">
      <v-card>
        <v-card-text>
          <div class="mt-2 mb-2">
            <small>Select the correct address that match your current
              address</small>
          </div>

          <v-radio-group v-model="selectedAddress" :rules="[requiredValidator]" v-if="typedAddress || suggestedAddress">
            <v-radio :label="suggestedAddress" v-if="suggestedAddress" value="suggested"></v-radio>
            <v-radio :label="typedAddress" value="notsuggested" v-if="typedAddress"></v-radio>
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
  </v-container>
</template>
<style>
.v-card-subtitle {
  white-space: inherit;
}
</style>
