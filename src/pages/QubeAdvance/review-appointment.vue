<script setup>
definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})
import moment from "moment";
import ProviderInfo from "./components/ProviderInfo.vue";

import { onBeforeMount, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();
const route = useRoute();
const isLoadingVisible = ref(false);
const loginuser = ref("");
const email = ref("");
const phoneNumber = ref("");
const address = ref("");
const city = ref("");
const state = ref("");
const zip_code = ref("");
const country = ref("");
const fullAddress = ref("");
const dob = ref("");
const gender = ref("");
const height = ref("");
const weight = ref("");
const scheduleDate = ref("");
const scheduleTime = ref("");
const isTimeSlot = ref("");
const timeZone = ref("");
const timeDifference = ref();
const timeUntilMeeting = ref("");
const seetingPlanLogo = ref();
const patient_id = localStorage.getItem("patient_id");
const access_token = localStorage.getItem("access_token");
let nextPage = localStorage.getItem('next_page');
const appointmentDetails = JSON.parse(
    localStorage.getItem("patient_appointment_details")
);
const timezoneMap = {
    'EST': 'America/New_York',
    'PST': 'America/Los_Angeles',
    'CST': 'America/Chicago',
    'MST': 'America/Denver'
};
let builderData = JSON.parse(localStorage.getItem('builderData'));
onBeforeMount(async () => {
    if(builderData.patientFlow.length == 1)
    {
        console.log('builderData.patientFlow',builderData.patientFlow)
        localStorage.setItem('builderData',JSON.stringify(updatePatientFlow(builderData, nextPage)))
        builderData = JSON.parse(localStorage.getItem('builderData'))
        localStorage.setItem('next_page','thankyou')
        nextPage = localStorage.getItem('next_page');
    }
    store.dispatch("updateIsLoading", true);
    fullAddress.value =
        (address.value ? address.value + ", " : "") +
        (city.value ? city.value + ", " : "") +
        (state.value ? state.value + " " : "") +
        (zip_code.value ? zip_code.value + ", " : "") +
        (country.value ? country.value : "");

    timeZone.value = appointmentDetails.timezone;
    isTimeSlot.value = appointmentDetails.appointment_time;

    const time = moment(isTimeSlot.value, "HH:mm:ss");
    scheduleTime.value = time.format("HH:mm a");
    timeDifference.value = store.getters.getTimeDiff;
    console.log("time", scheduleTime.value);

    // let dateString = store.getters.getPatient.dob;
    // let parts = dateString.split("-");
    // dob.value = `${parts[1]}-${parts[2]}-${parts[0]}`;

    const appointment_date = new Date(appointmentDetails.appointment_date);
    scheduleDate.value = formatDate(appointmentDetails.appointment_date);
    console.log('formatWithTimeZone',formatDate(appointmentDetails.appointment_date))
    store.dispatch("updateIsLoading", false);
});
const formatDate = (dateStr) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const [year, month, day] = dateStr.split("-");
  const formattedDate = `${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
  
  return formattedDate;
};
onMounted(async () => {
    const b1 = document.querySelector('.bg-custom-color');
    if (b1) {
        b1.style.background = builderData.bg_color;
    }
    const bt = document.querySelector('.v-btn.bg-primary');
    if (bt) {
        console.log(bt);
        bt.style.setProperty('background-color', builderData.btn_color, 'important');
    }
});
const backFun = () => {
    store.dispatch("updateIsLoading", true);
    router.replace(route.query.to ? String(route.query.to) : '/'+builderData.theme_name+'/Appointment')
};
const convertTimeBasedOnContext = (time12hr, time24hr) => {
    // Extracting the AM/PM part from the 12-hour format
    const period = time12hr.slice(-2); // 'AM' or 'PM'

    // Extracting the hour part from both time strings
    let hour12 = parseInt(time12hr.slice(0, 2), 10);
    let hour24 = parseInt(time24hr.slice(0, 2), 10);

    // Adjusting the 24-hour time based on the 12-hour format's AM/PM
    if (period === "PM" && hour12 !== 12) {
        // If it's PM and not 12 PM, add 12 to match 24-hour format
        hour24 = (hour24 % 12) + 12;
    } else if (period === "AM" && hour12 === 12) {
        // If it's 12 AM, it should be 00 in 24-hour format
        hour24 = 0;
    }

    // Construct new 24-hour time string
    let newTime24hr = hour24.toString().padStart(2, "0") + time24hr.slice(2);

    return newTime24hr;
};
const formatTime = (time, minutesToAdd = 0) => {
  // Convert "07:00:00" to a Date object for easier manipulation
  const [hours, minutes, seconds] = time.split(':').map(Number);
  let date = new Date();
  date.setHours(hours, minutes + minutesToAdd, seconds);

  // Format the date to 12-hour time with AM/PM
  let hoursFormatted = date.getHours() % 12 || 12;
  let minutesFormatted = String(date.getMinutes()).padStart(2, '0');
  let ampm = date.getHours() >= 12 ? 'PM' : 'AM';

  return `${hoursFormatted}:${minutesFormatted} ${ampm}`;
}
const confirmFun = async () => {
    store.dispatch("updateIsLoading", true);
    let startTime = convertTimeBasedOnContext(
            appointmentDetails.timeSlotString,
            appointmentDetails.appointment_time
        )
    await store.dispatch("savePatientAppointment", {

        practitioner_id: builderData.practitioner_id,
        patient_id: localStorage.getItem('patient_id'),
        title: localStorage.getItem('patient_name'),
        date: appointmentDetails.appointment_date,
        start_time: formatTime(startTime),
        end_time: formatTime(startTime,15),
        status: 'CONFIRMED',
        service: 'appointment',
        location: 4,
        room: 'Room 1',
        appointment_type: 'New Patient (Initial Visit)',
        payment_type: 'Cash Olny',
        notes: '',
    });

    // if (!store.getters.getErrorMessage) {
    //     if (localStorage.getItem("patient_appointment_id")) {
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
            
    //     }
    // }

    store.dispatch("updateIsLoading", false);
};
const updatePatientFlow = (obj, itemToExclude) => {
  return {
        ...obj,  // Spread the original object
        patientFlow: obj.patientFlow.filter(item => item !== itemToExclude)  // Update patientFlow
    };
}
</script>

<template>
    <VRow style="min-height: 101.7dvh; max-height: 101.7dvh; margin: 0px;"
    :style="isMobile ? { marginTop: '90px' } : { marginTop: '0px' }">
        <VCol cols="12" md="6" class="bg-custom col-order-1"
            :class="isMobile ? '' : 'auth-wrapper d-flex align-center justify-center pa-4'">
            <ProviderInfo></ProviderInfo>
        </VCol>
        <VCol
            cols="12"
            md="6"
            class="bg-custom-color col-order-2"
            :class="
                isMobile
                    ? ''
                    : 'auth-wrapper d-flex align-center justify-center pa-4'
            "
        >
            <VCard
                class="auth-card pa-2 rounded-5"
                style=""
                :class="isMobile ? '' : 'card-wid'"
            >
                <VRow>
                    <VCol cols="12" lg="12" md="12">
                        <router-link
                            to="/"
                            class="text-center mb-2 mt-2"
                            style="
                                width: 100%;
                                position: relative;
                                display: block;
                                padding-top: 20px;
                            "
                        >
                            <span class="text-center">
                                <!-- <VImg
                                    :src="seetingPlanLogo"
                                    width="250"
                                    height="50"
                                    class="logo-img"
                                /> -->
                            </span>
                        </router-link>
                    </VCol>
                </VRow>
                <div class="text-left">
                    <h5 class="text-h5 pricing-title mb-0 mt-4" style="padding-left: 10px;">
                        {{ $t('Confirm Appointment') }}
                    </h5>
                    <div class="v-col v-col-12 w-100 pb-0">
                        <p class="mb-0">
                           
                            {{ $t(`Your appointment has been successfully scheduled for`) }}  {{ $t('{formatedDate}', { 'formatedDate': appointmentDetails.formatedDateString }) }} {{ $t('at')}} 
                             {{ $t('{timeSlotFormated}', { 'timeSlotFormated': appointmentDetails.timeSlotFormatedString }) }}.  {{ $t(`If you have any questions or need further assistance, please don't hesitate to reach out.`) }}
                            
                        </p>
                        <p class="mb-0">
                            {{ $t('We will email you the telehealth instructions shortly. Please confirm your appointment by clicking the button below.') }}
                        </p>
                    </div>
                </div>
                <!-- <VCol class="pt-0 pb-0">
                    <VCardText class="rounded-0 pt-0 pb-0" style="">
                        <v-list class="align-self-center">
                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-icon icon="tabler-users"></v-icon>
                                </template>
                                <v-list-item-title class="text-wrap">
                                    {{ loginuser }}</v-list-item-title
                                >
                            </v-list-item>
                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-icon icon="mdi-calendar"></v-icon>
                                </template>
                                <v-list-item-title class="text-wrap"
                                    >{{ scheduleDate }}
                                </v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-icon icon="mdi-clock"></v-icon>
                                </template>
                                <v-list-item-title class="text-wrap"
                                    >{{ appointmentDetails.timeSlotString }}
                                </v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-icon icon="mdi-world"></v-icon>
                                </template>
                                <v-list-item-title class="text-wrap"
                                    >{{ timeZone }}
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </VCardText>
                </VCol> -->
                <VCol cols="12 pt-4 pb-4" class="text-center">
                    <!-- <RouterLink to="/book-appointment"> -->
                    <VBtn
                        @click="confirmFun"
                        class="text-capitalize mb-2 text-white"
                        block
                        >{{ $t('Confirm') }}</VBtn
                    >
                    <VBtn
                        @click="backFun"
                        class="text-capitalize"
                        color="grey"
                        block
                        >{{ $t('Back') }}</VBtn
                    >
                    <!-- </RouterLink> -->
                    <!-- <RouterLink to="/additional-information"> -->

                    <!-- </RouterLink> -->
                </VCol>
            </VCard>
        </VCol>
    </VRow>

    <!-- </v-main> -->
    <!-- </v-app> -->
</template>

<style lang="scss" scoped>
@use "@core/scss/template/pages/page-auth.scss";

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

.v-list-item--density-default.v-list-item--one-line {
    min-height: 30px !important;
}

.logo-img {
    display: block;
    position: relative;
    margin: 0 auto;
}
</style>
<style scoped>
@media only screen and (max-width: 768px) {
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
    max-width: 600px;
}

.layout-wrapper {
    justify-content: center;
}

.error-message {
    color: #ff2f2f;
    font-size: 15px;
}
</style>
