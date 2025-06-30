<script setup>
definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})
import moment from 'moment-timezone';
import { onBeforeMount, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import ProviderInfo from './components/ProviderInfo.vue';
const store = useStore()
const router = useRouter()
const route = useRoute()
const isMobile = ref(window.innerWidth <= 768); // Assuming mobile width is less than or equal to 768px

const breadcrumbs = ref([
    { title: 'Register', disabled: false, href: '/register' },
    { title: 'Book Appointment', disabled: true }, // Current page, so no href
]);
const isTonalSnackbarVisible = ref(false)
const patientResponse = ref(false)
const isLoadingVisible = ref(false)
const infoVForm = ref();
const email = ref();
const name = ref();

const showTimeSlots = ref(false)
const isTimeSlot = ref()
const timeSlotString = ref()
const selectTimeZone = ref(null)
const timezone = ref([]);
const filterDate = ref([]);
const calanderFormatedDate = ref();
const calanderSelectedDate = ref();
const scheduleDate = ref();
const selectTimeSlot = ref();
const chooseDate = ref([]);
const isAMPM = ref(false);
const additionalButtonsShown = ref(new Array(5).fill(false));
const orderDate = ref();
const errorMessage = ref()
const drawer = ref()
const timeZoneChanged = ref(false)
const timezonePopup = ref(false)
const showCalendar = ref(true)
const patient_id = localStorage.getItem('patient_id')
const access_token = localStorage.getItem('access_token');
const slotTime = ref(null)
const appointmentDetails = JSON.parse(localStorage.getItem('patient_appointment_details'))
const storedTimeZone = ref(null)
const storedAppointmentDate = ref(null)
const storedAppointmentTime = ref(null)
const storedSlotTime = ref(null)
const seetingPlanLogo = ref();
const dateKeys = ref([])
const monthNumber = ref(null);
const timezoneMap = {
    'EST': 'America/New_York',
    'PST': 'America/Los_Angeles',
    'CST': 'America/Chicago',
    'MST': 'America/Denver'
};
const builderData = JSON.parse(localStorage.getItem('builderData'));
const practitionerData = ref(null)
onBeforeMount(async () => {

    store.dispatch('updateIsLoading', true)
    let practitionerDataApi = await $api(GET_PRACTITIONER_DATA_BY_UUID+'/'+builderData.practitioner_id, {
                        method: 'GET',
                        onResponseError({ response }) {
                            console.error('Error in practitioner API:', response);
                        }
                    });
    practitionerData.value = practitionerDataApi.data
    console.log(practitionerData.value)
    if (appointmentDetails) {
        selectTimeZone.value = appointmentDetails.timezone
        calanderFormatedDate.value = appointmentDetails.appointment_date
        isTimeSlot.value = appointmentDetails.appointment_time
        slotTime.value = appointmentDetails.timeSlotString

        storedTimeZone.value = appointmentDetails.timezone
        storedAppointmentDate.value = appointmentDetails.appointment_date
        storedAppointmentTime.value = appointmentDetails.appointment_time
        storedSlotTime.value = appointmentDetails.timeSlotString
    }

    if (selectTimeZone.value || calanderFormatedDate.value || isTimeSlot.value || slotTime.value) {

        if (calanderFormatedDate.value)
            await getAvailableSlots(calanderFormatedDate.value)
        if (slotTime.value) {
            const entries = Object.entries(chooseDate.value)
            for (const [index, [key, tempSlot]] of entries.entries()) {
                if ( moment(tempSlot.start_time).tz('UTC').format('hh:mm A') == slotTime.value)
                    timeSlot(index, tempSlot)
            }
        }
    }
    if (!selectTimeZone.value) {
        // selectTimeZone.value = moment.tz.guess();
        // List of allowed IANA timezones
        const allowedTimezones = Object.values(timezoneMap);

        // Get the guessed timezone
        let guessedTimezone = moment.tz.guess();

        // Check if the guessed timezone is in the allowed list, fallback to EST if not
        if (!allowedTimezones.includes(guessedTimezone)) {
            guessedTimezone = 'America/New_York'; // Fallback to EST
        }
        const selectedAbbreviation = Object.keys(timezoneMap).find(key => timezoneMap[key] === guessedTimezone) || 'EST';
        // Set the initial selected timezone
        selectTimeZone.value = selectedAbbreviation;

        console.log('Current Timezone:', selectTimeZone.value);
    }
    //Calendly API
    let currentDate = null
    if(scheduleDate.value) currentDate = new Date(scheduleDate.value); else currentDate = new Date();
    monthNumber.value = currentDate.getMonth() + 1;
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate);
    console.log('month loaded',monthName,monthNumber.value)
    await store.dispatch('getCalendlyAvailableSlots', {
        month: monthNumber.value,
        timezone:selectTimeZone.value
    })
    dateKeys.value = Object.keys(store.getters.getCalendlyAvailableTImes ?? JSON.parse(localStorage.getItem('getCalendlyAvailableTImes')));
    console.log('>>>dateKeys>>',dateKeys.value);
    // let availableSlots = [];
    // availableSlots = store.getters.getCalendlyAvailableTImes.map(item => item.start_time + ':00');
    // console.log('//////availableSlots/////',availableSlots);
    store.dispatch('updateIsLoading', false)

})
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
    window.addEventListener('resize', checkIfMobile);

    const timezones = reactive(
        Object.entries(timezoneMap).map(([abbreviation, timezone]) => {
            const offset = moment.tz(timezone).utcOffset();
            const offsetHours = Math.abs(Math.floor(offset / 60));
            const offsetMinutes = Math.abs(offset % 60);
            const offsetSign = offset < 0 ? '-' : '+';
            const formattedOffset = `${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
            const now = moment().tz(timezone);
            const nowformattedOffset = now.format('Z');
            const nowformattedTimezone = now.format('z');
            const formattedTime = now.format('hh:mm A');

            if (isAMPM.value == false) {
                return {
                    name: abbreviation,
                    abbreviation: abbreviation,
                };
            } else {
                return {
                    name: `${abbreviation} (${nowformattedOffset})`,
                    abbreviation: abbreviation,
                };
            }
        })
    );

    timezone.value = timezones;

    
})
// Detach event listener on component unmount
onUnmounted(() => {
    window.removeEventListener('resize', checkIfMobile);
});
const changeTimeZone = () => {
    timeZoneChanged.value = true
    timezonePopup.value = true
}
const changeDate = () => {
    showCalendar.value = true
}
const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};
const handleDateInput = async () => {
    console.log('handleDateInput')
    if (!calanderSelectedDate.value) {
        isTonalSnackbarVisible.value = true
        errorMessage.value = 'Please select any date from calander';
        return
    }
    timeZoneChanged.value = false
    timezonePopup.value = false
    chooseDate.value = [];
    isLoadingVisible.value = true;
    drawer.value = !drawer.value
    // scheduleDate.value = '';
    console.log("calanderDate", calanderSelectedDate.value);

    console.log(access_token);
    const selectedDate = new Date(calanderSelectedDate.value);
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-indexed
    const day = selectedDate.getDate().toString().padStart(2, '0');
    calanderFormatedDate.value = `${year}-${month}-${day}`;
    orderDate.value = `${month}-${day}-${year}`;
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(calanderSelectedDate.value);
    scheduleDate.value = formattedDate;
    console.log("formattedDate", calanderFormatedDate.value, formattedDate);
    const tempDate = new Date(formattedDate);
    const tempMonth = tempDate.getMonth();
    const tempMonthNumber = tempMonth + 1;
    if (calanderFormatedDate.value) {
        await getAvailableSlots(calanderFormatedDate.value)
        await store.dispatch('getCalendlyAvailableSlots', {
            month: tempMonthNumber,
            timezone:selectTimeZone.value
        })
        dateKeys.value = Object.keys(store.getters.getCalendlyAvailableTImes ?? JSON.parse(localStorage.getItem('getCalendlyAvailableTImes')));
    } else {
        chooseDate.value = [];
    }
};
const monthUpdate = async(event) => {
    const currentYear = new Date().getFullYear();
    const monthName = getMonthName(event+1, currentYear); 
    console.log('month updated',monthName)
    await store.dispatch('getCalendlyAvailableSlots', {
        month: event+1,
        timezone:selectTimeZone.value
    })
    dateKeys.value = Object.keys(store.getters.getCalendlyAvailableTImes ?? JSON.parse(localStorage.getItem('getCalendlyAvailableTImes')));
};
const getMonthName = (monthNumber, year = new Date().getFullYear()) => {
    const date = new Date(year, monthNumber - 1);
    return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
}
const getFormattedDatetimes = (date) => {
  // Ensure the date is in the format "YYYY-MM-DD"
  const formattedDate = date.replace(/\//g, '-');
  let obj = [];
  if(!store.getters.getCalendlyAvailableTImes)
    obj = JSON.parse(localStorage.getItem('getCalendlyAvailableTImes'))
    else
    obj = store.getters.getCalendlyAvailableTImes 
  console.log('//////formattedDate',formattedDate,obj)
  // Check if the date exists in the object
  if (obj.hasOwnProperty(formattedDate)) {
    // If it does, map over the array and return formatted_datetime values
    return obj[formattedDate].map(item => item.formatted_datetime);
  } else {
    // If the date doesn't exist, return an empty array
    return [];
  }
}
const getAvailableSlots = async (date) => {
    console.log('access_token', access_token)
    await store.dispatch('updateSelectedTimezone', selectTimeZone.value)

    let currentDate = null
    if(scheduleDate.value) currentDate = new Date(scheduleDate.value); else currentDate = new Date();
    monthNumber.value = currentDate.getMonth() + 1;
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate);
    console.log('month loaded',monthName,monthNumber.value)
    // await store.dispatch('getCalendlyAvailableSlots', {
    //     month: monthNumber.value,
    //     timezone:selectTimeZone.value
    // })

    console.log('My Slots >>>>>',getFormattedDatetimes(date));

    
    // chooseDate.value = getTimeSlotsForDate(getFormattedDatetimes(date), date, scheduleTime);
    chooseDate.value = store.getters.getCalendlyAvailableTImes[date]?? JSON.parse(localStorage.getItem('getCalendlyAvailableTImes'))[date]
    console.log('>>>Slots--', chooseDate.value)
    // getTimeSlots(chooseDate.value, scheduleTime);
    console.log(filteredSlots.value)
    if (filteredSlots.value) {
        showCalendar.value = false
    } else {
        isTonalSnackbarVisible.value = true
        errorMessage.value = 'No Slots Availabe'
    }

}
const getTimeSlotsForDate = (timeSlots, date, scheduleTime,timezone = 'EST') => {
    timezone = timezoneMap[timezone] || timezone;
    console.log('timezone',timezone)
    // Define the start and end time in the specified timezone
    const startTime = moment.tz(`${date} 00:00:00`, 'YYYY-MM-DD HH:mm:ss', timezone);
    const endTime = moment.tz(`${date} 23:59:00`, 'YYYY-MM-DD HH:mm:ss', timezone);
    const formattedSlots = {};

    for (const [key, value] of Object.entries(timeSlots)) {
        const slotTime = moment.tz(value, 'YYYY-MM-DD HH:mm:ss', timezone);

        // if (slotTime.isSameOrAfter(startTime) && slotTime.isSameOrBefore(endTime)) {
            formattedSlots[key] = slotTime.format('hh:mm A');
        // }
    }

    return formattedSlots;
};
const getTimeSlots = (availableSlot, timezone) => {

    let offestTimeZone = timezone;
    // console.log('timezone', offestTimeZone);
    // Get the current time in the specified timezone
    const now = moment();

    // Define the time slots (adjust as needed)
    const timeSlots = availableSlot;

    // Initialize an array to store the current time slots
    const convertedSlots = {};

    // Convert each time slot to the specified timezone
    for (const [key, value] of Object.entries(availableSlot)) {

        let slot = value;
        // console.log('slot', slot);
        const concateDate = calanderFormatedDate.value + ' ' + slot;
        // console.log('concateDate', concateDate);

        const originalTime = moment.utc(concateDate, 'YYYY-MM-DD HH:mm:ss');
        // console.log("originalTime", originalTime.format('YYYY-MM-DD HH:mm:ss'));
        const convertedTime = originalTime.tz(timezone);
        let converted_date = convertedTime.format('YYYY-MM-DD');
        // console.log("convertedTime", convertedTime.format('YYYY-MM-DD HH:mm:ss'));
        if (converted_date == calanderFormatedDate.value) {
            if (isAMPM.value) {
                convertedSlots[key] = convertedTime.format('HH:mm');
            } else {
                convertedSlots[key] = convertedTime.format('hh:mm A');
            }

        }
        // const convertedTimee = moment.utc(concateDate, 'HH:mm:ss').utcOffset(offsetSign * offsetMinutes);


        // console.log(`Converted timee (${offestTimeZone}): ${convertedTime.format('HH:mm:ss')}`);
        // let start_date = moment.utc(concateDate + " 00:00:00", "YYYY-MM-DD HH:mm:ss").utcOffset(timezoneComponents[0]).format("YYYY-MM-DD HH:mm:ss");
    }
    // console.log('convertedSlots', convertedSlots);
    chooseDate.value = convertedSlots;
    // console.log('convertedSlots', convertedSlots);
    // console.log('chooseDate', chooseDate.value);
    // Return the converted time slots
    return convertedSlots;
};
const timeSlot = (index, selectedTime) => {
    console.log('selectedTime', index, selectedTime,additionalButtonsShown.value)
    selectTimeSlot.value = selectedTime
    // Reset visibility of the last shown additional buttons
    const lastShownIndex = additionalButtonsShown.value.findIndex((shown) => shown);
    if (lastShownIndex !== -1) {
        additionalButtonsShown.value[lastShownIndex] = false;
    }

    // Toggle the visibility of the additional buttons for the clicked time slot
    additionalButtonsShown.value[index] = true;
};

const nextButton = async () => {
    // console.log('nextButton', timeSlot);
    // const [time, period] = timeSlot.split(' ');
    // const [hours, minutes] = time.split(':').map(Number);
    // let totalSeconds = (hours % 12)  3600 + minutes  60;
    // console.log("period", period);
    // if (period.toLowerCase() === 'pm') {
    //     totalSeconds += 12 * 3600;
    // }
    // selectTimeSlot.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    // selectTimeSlot.value = timeSlot;
    // isCalander.value = false;
    // isScheduleEvent.value = true;

    await scheduleEvent()


    // Handle the logic for the "Next" button, if needed
    // console.log(`Next button clicked for ${index}:00 pm`);
};
const handleSwitchChange = async () => {
    timezone.value = [];
    if (isAMPM.value == false) {
        const timezones = reactive(moment.tz.names().map(timezone => {
            const offset = moment.tz(timezone).utcOffset();
            const offsetHours = Math.abs(Math.floor(offset / 60));
            const offsetMinutes = Math.abs(offset % 60);
            const offsetSign = offset < 0 ? '-' : '+';
            const formattedOffset = `${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
            const now = moment().tz(timezone);
            const nowformattedOffset = now.format('Z');
            const nowformattedTimezone = now.format('z');
            const formattedTime = now.format('hh:mm A');
            return {
                name: timezone + ' (' + formattedTime + ') ',
                abbreviation: timezone
            };
        }));
        timezone.value = timezones;

    } else {
        const timezones = reactive(moment.tz.names().map(timezone => {
            const offset = moment.tz(timezone).utcOffset();
            const offsetHours = Math.abs(Math.floor(offset / 60));
            const offsetMinutes = Math.abs(offset % 60);
            const offsetSign = offset < 0 ? '-' : '+';
            const formattedOffset = `${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
            const now = moment().tz(timezone);
            const nowformattedOffset = now.format('Z');
            const nowformattedTimezone = now.format('z');
            const formattedTime = now.format('hh:mm A');
            return {
                name: timezone + ' (' + formattedTime + ') ',
                abbreviation: timezone
            };
        }));


        timezone.value = timezones;
    }
    await handleDateInput();

}



const scheduleEvent = async () => {
    isTimeSlot.value = '';
    isLoadingVisible.value = true;
    // if (isAMPM.value) { //24 hours
    //     isTimeSlot.value = selectTimeSlot.value + ":00"
    // } else { //Am pm
    //     let timeString = selectTimeSlot.value;
    //     timeSlotString.value = timeString
    //     console.log("timeSlot", timeString);
    //     let timeMoment = moment(timeString, 'hh:mm A');
    //     isTimeSlot.value = timeMoment.format('hh:mm:ss');

    //     // console.log("formattedTimeAsif", isTimeSlot.value);
    // }

    console.log('', calanderFormatedDate.value, isTimeSlot.value)
    if (!selectTimeSlot.value || isTimeSlot.value == 'Invalid date') {
        isLoadingVisible.value = false;
        isTonalSnackbarVisible.value = true;
        errorMessage.value = "Please select a time slot"
        return

    }
    if (storedTimeZone.value == selectTimeZone.value
        && storedAppointmentDate.value == calanderFormatedDate.value
        && storedAppointmentTime.value == selectTimeSlot.value.start_time) {
        isLoadingVisible.value = true;
        router.replace(route.query.to ? String(route.query.to) : '/'+builderData.theme_name+'/review-appointment')

    } else {
        console.log('>>>>>get URl',calanderFormatedDate.value,isTimeSlot.value,getSchedulingUrl(store.getters.getCalendlyAvailableTImes,calanderFormatedDate.value,isTimeSlot.value))
        let apptData = {
            appointment_date:  moment(selectTimeSlot.value.start_time).tz('UTC').format('YYYY-MM-DD'),
            appointment_time: moment(selectTimeSlot.value.start_time).tz('UTC').format('HH:mm:ss'),
            timezone: selectTimeZone.value,
            timeSlotString: moment(selectTimeSlot.value.start_time).tz('UTC').format('hh:mm A'),
            timeSlotFormatedString: moment(selectTimeSlot.value.formatted_datetime, 'YYYY-MM-DD HH:mm:ss').format('hh:mm A'),
            formatedDateString: moment(calanderFormatedDate.value, 'YYYY-MM-DD HH:mm:ss').format('MM-DD-YYYY')
        }
        console.log('>>>apptData',apptData,selectTimeSlot.value.start_time) 
        localStorage.setItem('patient_appointment_details', JSON.stringify(apptData))
        // console.log(JSON.parse(localStorage.getItem('patient_appointment_details'))) 
        
        router.replace(route.query.to ? String(route.query.to) : '/'+builderData.theme_name+'/review-appointment')

    }



}
const normalizeTime = (dateTime) => {
    // Split the date and time
    const [date, time] = dateTime.split(' ');
    
    // Split time into hours, minutes, and seconds
    let [hours, minutes, seconds] = time.split(':');
    
    // Remove leading zero from hours if present
    hours = hours.replace(/^0+/, '');

    // Return the normalized date and time string
    return `${date} ${hours}:${minutes}:${seconds}`;
}

const getSchedulingUrl = (records, date, time) => {
    // Normalize the input time to match the format in records
    const targetDateTime = normalizeTime(`${date} ${time}`);
    
    // Check if the given date exists in the records
    if (records[date]) {
        // Loop through the array of objects for the given date
        for (let record of records[date]) {
            // Normalize the record's formatted_datetime for comparison
            const recordDateTime = normalizeTime(record.formatted_datetime);
            
            // Compare the normalized formatted_datetime with the target datetime
            if (recordDateTime === targetDateTime) {
                // Return the scheduling URL if a match is found
                return record.scheduling_url;
            }
        }
    }
    
    // Return null if no matching record is found
    return null;
}
// const openSchedulingURL = (date, time) => {
//     console.log('date, time',date, time,time.slice(0,5),store.getters.getCalendlyAvailableTImes)
//     return new Promise((resolve) => {
//         const dateTime = `${date} ${time.slice(0,5)}`;
//         const record = store.getters.getCalendlyAvailableTImes.find(item => item.start_time === dateTime);

//         if (record && record.scheduling_url) {
//             const newWindow = window.open(record.scheduling_url, '_blank');
            
//             // Set up an interval to check if the window has been closed
//             const checkWindow = setInterval(() => {
//                 if (newWindow.closed) {
//                     clearInterval(checkWindow);
//                     resolve();
//                 }
//             }, 1000);
//         } else {
//             console.log('No matching record found.');
//             resolve(); // Resolve immediately if no matching record
//         }
//     });
// };
const minDate = computed(() => {

// const today = new Date();
// const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
// return tomorrow;

// Replace selectTimeZone with the actual variable containing the timezone

let tz = timezoneMap[selectTimeZone.value] || 'America/New_York';

const today = moment().tz(tz);
console.log('today EST >>>', today.format(), tz, selectTimeZone.value);

const tomorrow = today.add(0, 'day');
console.log('tomorrow EST >>>', tomorrow.format());

return tomorrow.format('YYYY-MM-DD'); // Returns date in YYYY-MM-DD format

});

const allowedDates = computed(async () => {
    return dateKeys
});


const maxDate = computed(() => {
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    return new Date(
        threeMonthsLater.getFullYear(),
        threeMonthsLater.getMonth(),
        threeMonthsLater.getDate()
    );
});
const filteredSlots = computed(() => {
    filterDate.value = []
    console.log('here', calanderSelectedDate.value)
    const today = new Date();
    const todayDateString = today.toISOString().substr(0, 10); // Get today's date in YYYY-MM-DD format
    // console.log("todayDateString", todayDateString);

    if (!storedAppointmentDate.value || calanderSelectedDate.value) {
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }).format(calanderSelectedDate.value);
        scheduleDate.value = formattedDate;

    } else {
        const date = moment(storedAppointmentDate.value);
        scheduleDate.value = date.format('dddd, MMMM D, YYYY');
    }
    let isTodaySlotAvailable = false;
    const entries = Object.entries(chooseDate.value);
    console.log("entries", entries,chooseDate.value);
    for (const [_, slotValue] of entries) {
        if (calanderFormatedDate.value === todayDateString) {
            console.log('if');
            filterDate.value.push(slotValue);
        } else {
            console.log('else');
            showCalendar.value = true;
            return chooseDate.value;
        }
    }
    return filterDate.value

});
const backFun = () => {
    store.dispatch('updateIsLoading', true)
    router.replace(route.query.to && route.query.to != '/book-appointment' ? String(route.query.to) : '/register')
}
</script>

<template>
    <VRow style="min-height: 101.7dvh; max-height: 101.7dvh; margin: 0px;"
    :style="isMobile ? { marginTop: '90px' } : { marginTop: '0px' }">
        <VCol cols="12" md="6" class="bg-custom col-order-1"
            :class="isMobile ? '' : 'auth-wrapper d-flex align-center justify-center pa-4'">
            <ProviderInfo></ProviderInfo>
        </VCol>
        <VCol cols="12" md="6" class="bg-custom-color col-order-2"
            :class="isMobile ? '' : 'auth-wrapper d-flex align-center justify-center pa-4'">
            <VCard class="auth-card pa-2 rounded-5" style="" :class="isMobile ? '' : 'card-wid'">
                
                <div class="rounded-top">

                    <VRow class="">
                        <VCol cols="12" md="12">
                            <div class="text-center">
                                <h2 class="mb-1 text-center mb-4">
                                    {{ $t('Book Your TeleHealth Doctor Appointment') }}
                                </h2>
                            </div>
                        </VCol>
                        <VCol cols="12" md="12">
                            <div class="auth- align-center justify-center" :class="isMobile ? '' : 'pa-4'">
                                <VCard style="background: no-repeat;box-shadow: none;">

                                    <VRow class="">
                                        <VCol cols="12" md="12">
                                            <div>
                                                <strong>{{ $t('Timezone:') }} </strong> <span>{{ selectTimeZone }}</span>
                                            </div>
                                            <div class="text-right pt-2 pb-2">
                                                <a class="mb-2" @click="changeTimeZone"
                                                    style="cursor: pointer;text-decoration: underline; color: blue;">
                                                     {{ $t('Change Timezone:') }} </a>
                                            </div>
                                            <VRow>
                                                <v-col cols="12" md="12" v-if="!showCalendar">
                                                    <v-btn class="mb-2 " @click="changeDate" v-if="!showCalendar"
                                                        block>  {{ $t('Change Date:') }}</v-btn>
                                                </v-col>
                                            </VRow>
                                            <!-- </v-container> -->
                                        </VCol>
                                    </VRow>
                                    <VRow :class="isMobile ? '' : 'px-2'" v-if="showCalendar">
                                        <VCol cols="12" md="12">
                                            <v-flex>
                                                <v-date-picker color="rgb(var(--v-theme-yellow-theme-button))"
                                                    v-model="calanderSelectedDate" @update:modelValue="handleDateInput"
                                                    :min="minDate" :max="maxDate" width="100%"
                                                    hide-header :allowed-dates="dateKeys" @update:month="monthUpdate"></v-date-picker>


                                            </v-flex>


                                        </VCol>

                                    </VRow>
                                    <VRow :class="isMobile ? '' : 'px-2'" v-if="!showCalendar">
                                        <v-col cols="12" md="12" class="text-center tslot-date pl-4">
                                            <p class="text-center mb-3">{{ scheduleDate }}</p>
                                            <div class="text-center">
                                                <div v-if="!filteredSlots || filteredSlots.length == 0">
                                                    <h4 class="text-center text-danger">{{ $t('No slot available')}}  </h4>
                                                </div>
                                                <span v-else class=" mr-2"
                                                    v-for="(   choosetimeframes, index   ) in filteredSlots   "
                                                    :key="index">
                                                    <v-btn @click="timeSlot(index, choosetimeframes)"
                                                        class="mb-2 px-3 py-2" variant="outlined"
                                                        v-if="!additionalButtonsShown[index]"
                                                        color="rgb(var(--v-theme-yellow-theme-button))">
                                                        {{ moment(choosetimeframes.formatted_datetime, 'YYYY-MM-DD HH:mm:ss').format('hh:mm A') }}
                                                    </v-btn>

                                                    <span v-if="additionalButtonsShown[index]">
                                                        <v-btn class="mb-2 px-3 py-2">{{ moment(choosetimeframes.formatted_datetime, 'YYYY-MM-DD HH:mm:ss').format('hh:mm A')
                                                            }}</v-btn>
                                                    </span>

                                                </span>

                                            </div>
                                        </v-col>

                                    </VRow>
                                    <VRow>
                                        <VCol cols="12" md="12" class="text-center" v-if="!showCalendar">
                                            <VBtn
                                                class=" text-capitalize text-white d-grid waves-effect waves-light px-4" variant="flat"
                                                @click="nextButton()" block>
                                                Next</VBtn>
                                        </VCol>
                                    </VRow>
                                </VCard>
                            </div>
                        </VCol>

                        <VCol cols="12" md="12">
                            <VDialog v-model="timezonePopup" refs="myDialog" persistent width="500">

                  
                                <v-card title="Change Time Zone">
                                    <v-card-text v-if="timeZoneChanged">
                                        <VRow>
                                            <v-col cols="12" md="12">
                                                <v-autocomplete label="Time Zone" v-model="selectTimeZone"
                                                    style="column-gap: 0px;" :items="timezone" item-title="name"
                                                    item-value="abbreviation"
                                                    @update:modelValue="handleDateInput"></v-autocomplete>
                                            </v-col>
                                        </VRow>

                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>

                                        <v-btn text="Close" @click="timezonePopup = false"></v-btn>
                                    </v-card-actions>
                                </v-card>
                            </VDialog>
                        </VCol>

                    </VRow>

                </div>
            </VCard>
        </VCol>
    </VRow>

</template>
<style scoped>
.v-date-picker >>> .v-date-picker-controls__month-btn,
.v-date-picker >>> .v-date-picker-controls__mode-btn {
    display: none;
}
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
<style lang="scss">
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

.card-title {
    font-family: "Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
}

.logo-img {
    display: block;
    position: relative;
    margin: 0 auto;
}



// @media (min-width: 280px) and (max-width: 768px) {
.v-date-picker-month__day .v-btn {
    --v-btn-height: 20px !important;
}

.v-date-picker-month__day {
    height: auto !important;
    width: auto !important;
}

.v-date-picker-month {
    min-width: 100% !important;
}

.bg-primary {
    background-color: rgb(var(--v-theme-grey-900)) !important;
}

.text-primary {
    color: rgb(var(--v-theme-yellow)) !important;
}

// }
</style>
