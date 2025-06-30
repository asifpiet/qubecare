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
import { onBeforeMount, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

const { currentUser, currentRole, logout } = useAuth()
const affiliateStore = useAffiliateStore()
const userData = currentUser;
const router = useRouter();

const cart = ref([]);
const allProducts = ref([]); // Store all products
const products = ref([]); // Store filtered/paginated products
const searchQuery = ref('');
const selectedCategory = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(3); // Adjust as needed
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

// Categories for filtering
const categories = ref([
    { id: '', name: 'All Peptides', active: true },
    { id: 'weight', name: 'Weight Management', active: false },
    { id: 'performance', name: 'Performance', active: false },
    { id: 'longevity', name: 'Longevity', active: false },
    { id: 'healing', name: 'Healing', active: false },
    { id: 'skin', name: 'Skin Care', active: false }
]);

// Computed property for filtering products
const filteredProducts = computed(() => {
    let result = allProducts.value;

    // Apply search filter
    if (searchQuery.value.trim() !== '') {
        const query = searchQuery.value.toLowerCase().trim();
        result = result.filter(product =>
            product.name.toLowerCase().includes(query) ||
            (product.description && product.description.toLowerCase().includes(query)) ||
            (product.provider_name && product.provider_name.toLowerCase().includes(query))
        );
    }

    // Apply category filter
    if (selectedCategory.value !== '') {
        result = result.filter(product => product.category === selectedCategory.value);
    }

    return result;
});

// Computed property for pagination
const totalPages = computed(() => {
    return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
});

// Method to get paginated products
const getPaginatedProducts = () => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    products.value = filteredProducts.value.slice(startIndex, endIndex);
};

// Method to change page
const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

// Method to handle category selection
const selectCategory = (category) => {
    categories.value.forEach(cat => cat.active = false);
    const selectedCat = categories.value.find(cat => cat.id === category.id);
    if (selectedCat) {
        selectedCat.active = true;
        selectedCategory.value = category.id;
    }
    currentPage.value = 1; // Reset to first page on category change
};

// Watch for changes that should trigger pagination updates
watch([filteredProducts, currentPage], () => {
    getPaginatedProducts();
});

// Watch for changes in search query to reset pagination
watch(searchQuery, () => {
    currentPage.value = 1;
});

onBeforeMount(async () => {
    showLoader()
    let pros = await $api(GET_AFFILIATE_PRODUCTS_LIST, {
        method: 'GET',
        onResponseError({ response }) {
            console.error('Error in plans API:', response);
        }
    });

    // Assign products and filter valid ones
    allProducts.value = pros.data.filter(
        item => item.provider_id !== null
            // && item.practitioner_id !== null
            && item.builder_id !== null
    );

    // Initialize paginated products
    getPaginatedProducts();

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
    link.value = `${baseURL}/patient/review-cart?bid=${btoa(builderId.value)}&cart=${base64Encoded}&af_ref=${btoa(userData.value?.email)}`;

    // Generate QR code for the link
    try {
        qrCodeSrc.value = await QRCode.toDataURL(link.value);
    } catch (error) {
        console.error('Error generating QR code:', error);
    }
};

const openAppointmentDialog = async (product) => {
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

    link.value = `/affiliate/review-cart?bid=${btoa(builderId.value)}&cart=${base64Encoded}&af_ref=${btoa(userData.value?.email)}`;
    router.replace(link.value)
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

const getInitials = (name) => {
    console.log('name', name)
    if (!name) return ''; // Handle empty input
    const words = name.trim().split(' '); // Split the name into words
    return words.map(word => word.charAt(0).toUpperCase()).join('');
}
</script>
<template>
    <main class="main-content">
        <!-- Main Products Section -->
        <div class="setup-card">
            <div class="setup-header">
                <div class="setup-title">
                    <i class="fas fa-flask"></i>{{ $t('Products') }}
                </div>
            </div>

            <!-- Search and Filter Controls -->
            <div class="filter-controls">
                <div class="search-input">
                    <i class="fas fa-search"></i>
                    <input type="text" :placeholder="$t('Search peptide products...')" v-model="searchQuery">
                </div>

                <div class="category-dropdown">
                    <select>
                        <option value="">{{ $t('Select Health Issue') }}</option>
                        <option value="weightloss">{{ $t('Weight Loss') }}</option>
                        <option value="antiaging">{{ $t('Anti-Aging') }}</option>
                        <option value="hormonal">{{ $t('Hormonal Balance') }}</option>
                        <option value="muscle">{{ $t('Muscle Growth') }}</option>
                        <option value="recovery">{{ $t('Recovery & Healing') }}</option>
                        <option value="immune">{{ $t('Immune Support') }}</option>
                        <option value="cognitive">{{ $t('Cognitive Function') }}</option>
                    </select>
                </div>
            </div>

            <!-- Category Pills -->
            <!-- <div class="category-pills">
                <div class="category-pill active">All Peptides</div>
                <div class="category-pill">Weight Management</div>
                <div class="category-pill">Performance</div>
                <div class="category-pill">Longevity</div>
                <div class="category-pill">Healing</div>
                <div class="category-pill">Skin Care</div>
            </div> -->


            <!-- Product Grid -->
            <div class="product-grid">
                <!-- Product 1 -->
                <div class="product-card" v-for="product in products" :key="product.id">
                    <div class="product-image">
                        <!-- <img src="/api/placeholder/400/300" alt="BPC-157"> -->
                        <div class="commission-badge">${{ product.price }} {{ $t('Commission') }}</div>
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">{{ product.name }}</h3>
                        <p class="product-description" v-if="product.description">{{ product.description }}</p>

                        <div class="provider-info">
                            <div class="provider-avatar">{{ getInitials(product.provider_name) }}</div>
                            <div class="provider-name">{{ product.provider_name }}</div>
                        </div>

                        <div class="product-footer">
                            <div class="price-commission">
                                <div class="product-price">${{ product.actual_price }}</div>
                                <div class="commission-text">
                                    {{ $t('Fixed') }} ${{ product.price }} {{ $t('commission per referral') }}</div>
                            </div>
                        </div>
                        <div style="min-height: 39px;">
                            <div v-if="product.variations">
                                <v-select v-model="product.variation_id" :items="Object.entries(product.variations).map(([key, variation]) => ({
                                    value: Number(key),
                                    title: variation.pa_variants
                                }))" item-title="title" item-value="value" class="mt-2" label="Select Variation"
                                    density="compact"></v-select>
                            </div>
                        </div>
                        <div class="product-actions">
                            <VBtn class="book-btn" :disabled="product.variations && !product.variation_id"
                                @click="openAppointmentDialog(product)">{{ $t('Book Appointment') }}
                            </VBtn>
                            <VBtn class="refer-btn" @click="[isDialogOpen = true, openProductDialog(product)]"
                                variant="outlined" :disabled="product.variations && !product.variation_id">
                                {{ $t('Refer Patient') }}
                            </VBtn>
                            <!-- <VBtn class="refer-btn" @click="openCartDialog(product)" variant="outlined"
                                :disabled="product.variations && !product.variation_id">{{ $t('Add to cart') }}</VBtn> -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="pagination">
                <div class="pagination-item" @click="changePage(currentPage - 1)"
                    :class="{ disabled: currentPage === 1 }">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <div class="pagination-item" v-for="page in totalPages" :key="page" @click="changePage(page)"
                    :class="{ active: currentPage === page }">
                    {{ page }}
                </div>
                <div class="pagination-item" @click="changePage(currentPage + 1)"
                    :class="{ disabled: currentPage === totalPages }">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        </div>
        <!-- Dialog -->
        <v-dialog v-model="isDialogOpen" max-width="500">
            <v-card>
                <v-card-title class="text-h5 px-6 py-4">Referral Link & QR Code</v-card-title>
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
                <v-card-actions class="px-6 py-4">
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

                                <AppSelect v-model="patientId" label="Patient" :items="patientsList" item-value="id"
                                    item-title="name" placeholder="Select a patient" :rules="[requiredValidator]" />
                            </VCol>
                            <!-- 👉 Title -->
                            <VCol cols="12">
                                <AppTextField v-model="title" :label="$t('Title')" placeholder="Meeting with Jane"
                                    :rules="[requiredValidator]" disabled />
                            </VCol>

                            <VCol cols="12">

                                <AppSelect v-model="date" label="Date" :placeholder="$t('Select Date')"
                                    :items="allowedDates" :rules="[requiredValidator]"
                                    :disabled="allowedDates.length === 0" />
                            </VCol>
                            <VCol cols="6">
                                <AppSelect v-model="start_time" :label="$t('Start')" placeholder=""
                                    :items="providerSlots" item-value='start_time' item-title="start_time"
                                    :rules="[requiredValidator]" />
                            </VCol>

                            <!-- 👉 End date -->
                            <VCol cols="6">
                                <AppSelect v-model="end_time" :label="$t('End')" placeholder="" :items="providerSlots"
                                    item-value='end_time' item-title="end_time" :rules="[requiredValidator]" />
                            </VCol>


                            <VCol cols="12">
                                <AppSelect v-model="service" :label="$t('Service')" :placeholder="$t('Select Service')"
                                    :items="services" item-value="value" item-title="label" />
                            </VCol>

                            <VCol cols="12">
                                <AppSelect v-model="status" :label="$t('Status')" :placeholder="$t('Select Status')"
                                    :items="eventStatuses" item-value="value" item-title="label"
                                    :rules="[requiredValidator]" />
                            </VCol>


                            <VCol cols="12">
                                <AppSelect v-model="room" :label="$t('Room')" :placeholder="$t('Select Room')"
                                    :items="rooms" item-value="value" item-title="label" />
                            </VCol>

                            <!-- 👉 Location -->
                            <VCol cols="12">
                                <AppSelect v-model="location" :label="$t('Location')"
                                    :placeholder="$t('Select Location')" :items="locationsList" item-value="id"
                                    item-title="name" :rules="[requiredValidator]" />
                            </VCol>

                            <VCol cols="12">
                                <AppSelect v-model="appointment_type" :label="$t('Appointment Type')"
                                    :placeholder="$t('Select Appointment Type')" :items="appointmentTypes"
                                    item-value="value" item-title="label" />
                            </VCol>

                            <VCol cols="12">
                                <AppSelect v-model="payment_type" :label="$t('Payment Type')"
                                    :placeholder="$t('Select Payment Type')" :items="paymentTypes" item-value="value"
                                    item-title="label" />
                            </VCol>



                            <!-- 👉 Description -->
                            <VCol cols="12">
                                <AppTextarea v-model="notes" :label="$t('Description')"
                                    :placeholder="$t('Meeting description')" />
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
                        {{ $t('Submit') }}
                    </VBtn>
                    <VBtn @click="isDialogAppointmentShow = false">
                        {{ $t('Close') }}
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
                                <AppSelect v-model="patientId" :label="$t('Patient')" :items="patientsList"
                                    item-value="id" item-title="name" :placeholder="$t('Select a patient')" />
                            </VCol>
                            <VCol cols="12" md="12">
                                <VTextField v-model="address" :label="$t('Address')" :rules="[requiredValidator]"
                                    density="comfortable" />
                            </VCol>
                            <VCol cols="12" md="12">
                                <VTextField v-model="apt" :label="$t('APT/Suite #')" density="comfortable" />
                            </VCol>
                        </VRow>
                        <VRow>
                            <VCol cols="12" md="4">
                                <VTextField v-model="city" :label="$t('City')" :rules="[requiredValidator]"
                                    density="comfortable" />
                            </VCol>
                            <VCol cols="12" md="5">
                                <v-autocomplete clearable v-model="state" :label="$t('Select State')"
                                    :items="sortedStates" item-title="name" item-value="abbreviation"
                                    :rules="[requiredValidator]" :error-messages="errors.state" density="comfortable">
                                </v-autocomplete>
                            </VCol>
                            <VCol cols="12" md="3">
                                <VTextField type="number" v-model="zipcode" :rules="[requiredValidator]"
                                    :label="$t('ZipCode')" density="comfortable" />
                            </VCol>
                        </VRow>
                        <div class="mb-3">
                            <h4 class="mb-2 mt-4">
                                {{ $t('Card Information') }} &nbsp;<VIcon>mdi-credit-card</VIcon>
                            </h4>
                        </div>
                        <VRow>
                            <VCol cols="12" lg="12" md="12">
                                <VTextField v-model="cardNumber" :label="$t('Credit Card Number*')"
                                    :rules="[requiredValidator, cardNumberValidator]" placeholder="xxxxxxxxxxxxxxxx"
                                    @input="cardNumberFormat" density="comfortable" />
                            </VCol>
                            <VCol cols="12" lg="6" md="6">
                                <VTextField v-model="expiry" :label="$t('Expiration Date*')"
                                    :rules="[requiredValidator, expiryValidator]" placeholder="MM/YY"
                                    @input="formatExpiry" density="comfortable" />
                            </VCol>
                            <VCol cols="12" lg="6" md="6">
                                <VTextField v-model="cvv" :rules="[requiredValidator, cvvValidator]" :label="$t('CVV*')"
                                    maxlength="3" @input="handleCVVInput" density="comfortable" />
                            </VCol>
                        </VRow>
                    </VForm>
                </VCardText>
                <VCardText class="d-flex flex-wrap gap-3">
                    <VSpacer />
                    <VBtn class="px-4 mb-2" color="primary" variant="flat" @click="corfirmFun"
                        :disabled="!(patientId && address && city && state && zipcode)">
                        {{ $t('Checkout') }}</VBtn>
                    <VBtn @click="isDialogCartShow = false">
                        {{ $t('Close') }}
                    </VBtn>
                </VCardText>
            </VCard>
        </VDialog>
        <VDialog v-model="confirmPopup" refs="myDialog" persistent width="500">
            <v-card>
                <v-card-text>
                    <div class="mt-2 mb-2">
                        <small>{{ $t('Select the correct address that match your current address') }}</small>
                    </div>

                    <v-radio-group v-model="selectedAddress" :rules="[requiredValidator]"
                        v-if="typedAddress || suggestedAddress">
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
    </main>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f8fafc;
    color: #333333;
    background-image:
        radial-gradient(circle at 20% 30%, rgba(21, 110, 77, 0.05) 0%, transparent 400px),
        radial-gradient(circle at 80% 70%, rgba(21, 110, 77, 0.05) 0%, transparent 400px),
        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%);
}

.dashboard {
    display: flex;
    min-height: 100vh;
}

.setup-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
    margin-bottom: 40px;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.8);
}

.setup-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 7px;
    background: linear-gradient(135deg, #0e5238 0%, #156e4d 100%);
}

.setup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.setup-title {
    font-size: 20px;
    font-weight: 600;
    color: #333333;
    display: flex;
    align-items: center;
}

.setup-title i {
    margin-right: 15px;
    color: #156e4d;
    font-size: 24px;
}

/* Filter Controls */
.filter-controls {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
}

.search-input {
    flex: 1;
    position: relative;
}

.search-input input {
    width: 100%;
    padding: 16px 20px 16px 50px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    color: #333333;
    transition: all 0.3s;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.03);
}

.search-input input:focus {
    outline: none;
    border-color: #156e4d;
    box-shadow: 0 10px 30px rgba(21, 110, 77, 0.1);
}

.search-input i {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    font-size: 18px;
}

.category-dropdown {
    min-width: 240px;
    position: relative;
}

.category-dropdown select {
    width: 100%;
    padding: 16px 20px;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    color: #333333;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: white;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 15px center;
    background-size: 20px;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.03);
}

.category-dropdown select:focus {
    outline: none;
    border-color: #156e4d;
    box-shadow: 0 10px 30px rgba(21, 110, 77, 0.1);
}

/* Category Pills */
.category-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 30px;
}

.category-pill {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    padding: 8px 18px;
    font-size: 14px;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.3s;
}

.category-pill:hover {
    background: rgba(21, 110, 77, 0.05);
    color: #156e4d;
    border-color: #156e4d;
}

.category-pill.active {
    background: #156e4d;
    color: white;
    border-color: #156e4d;
    box-shadow: 0 5px 15px rgba(21, 110, 77, 0.15);
}

/* Product Grid */
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
    margin-bottom: 30px;
}

.product-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.product-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
}

.product-image {
    height: 180px;
    background: #1d8e63;
    position: relative;
    overflow: hidden;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.commission-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 183, 77, 0.9);
    color: white;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 10px;
    border-radius: 20px;
    z-index: 1;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.product-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.product-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #333333;
}

.product-description {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 15px;
    flex-grow: 1;
}

.provider-info {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e5e7eb;
}

.provider-avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #1d8e63;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    margin-right: 12px;
}

.provider-name {
    font-size: 14px;
    font-weight: 500;
}

.product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* margin-top: auto; */
}

.price-commission {
    display: flex;
    flex-direction: column;
}

.product-price {
    font-weight: 700;
    font-size: 18px;
    color: #156e4d;
}

.commission-text {
    font-size: 12px;
    color: #6b7280;
}

.product-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    margin-top: 15px;
}

.book-btn {
    background: #156e4d !important;
    border: none;
    /* padding: 10px 0; */
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    width: 100%;
    text-align: center;
}

.book-btn:hover {
    background: #0e5238 !important;
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(21, 110, 77, 0.2);
}

.refer-btn {
    background: transparent;
    color: #156e4d;
    border: 1px solid #156e4d;
    padding: 10px 0;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    width: 100%;
    text-align: center;
}

.refer-btn:hover {
    background: rgba(21, 110, 77, 0.05);
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(21, 110, 77, 0.1);
}

/* Stats Section */
.stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-block {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: all 0.3s;
}

.stat-block:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
}

.stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 15px;
    background: linear-gradient(135deg, #0e5238 0%, #156e4d 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: white;
    margin-bottom: 15px;
}

.stat-value {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 5px;
    color: #156e4d;
}

.stat-label {
    font-size: 14px;
    color: #6b7280;
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 40px;
}

.pagination-item {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.3s;
}

.pagination-item:hover {
    background: rgba(21, 110, 77, 0.05);
    border-color: #156e4d;
    color: #156e4d;
}

.pagination-item.active {
    background: #156e4d;
    color: white;
    border-color: #156e4d;
    box-shadow: 0 5px 15px rgba(21, 110, 77, 0.15);
}

/* Responsive Media Queries */
@media (max-width: 1200px) {
    .main-content {
        padding: 0px;
        /* padding-top: calc(60px + 30px); */
    }

    .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
    }
}

@media (max-width: 992px) {
    .sidebar {
        width: 80px;
    }

    .logo-text,
    .nav-text,
    .nav-category {
        display: none;
    }

    /* .main-content {
        margin-left: 80px;
        width: calc(100% - 80px);
    } */

    .header {
        left: 80px;
    }

    .nav-link {
        justify-content: center;
        padding: 14px 5px;
    }

    .nav-icon {
        margin-right: 0;
    }

    .setup-card {
        padding: 25px;
    }

    .setup-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }

    .filter-controls {
        flex-direction: column;
    }
}

@media (max-width: 768px) {
    .main-content {
        padding: 0px;
        /* padding-top: calc(60px + 20px); */
    }

    .product-grid {
        grid-template-columns: 1fr;
    }

    .stats-container {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 576px) {
    .header {
        padding: 0 20px;
    }

    .page-title {
        font-size: 18px;
    }

    .stats-container {
        grid-template-columns: 1fr;
    }
}
</style>
