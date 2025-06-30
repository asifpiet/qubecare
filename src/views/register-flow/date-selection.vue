<script setup>
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})
import { usePatientRegStore } from '@/stores/patientRegStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import { addAlert } from '@/utils/showLoader';
import moment from 'moment-timezone';
import { DatePicker } from 'v-calendar';
import { ref } from 'vue';
const practitionerStore = usePractitionerStore()
const patientRegStore = usePatientRegStore()

const emit = defineEmits(['completed']);

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
})

const visibility = ref('hidden')
const isMobile = ref(window.innerWidth <= 768);
const timezoneMap = {
    'EST': 'America/New_York',
    'PST': 'America/Los_Angeles',
    'CST': 'America/Chicago',
    'MST': 'America/Denver'
};
const dateKeys = ref([])
const calanderSelectedDate = ref(null)
const showCalendar = ref(true)
const timeZoneChanged = ref(false)
const timezonePopup = ref(false)
const chooseDate = ref([]);
const selectTimeSlot = ref();
const additionalButtonsShown = ref(new Array(5).fill(false));
const scheduleDate = ref();
const calanderFormatedDate = ref();
const filterDate = ref([]);
const slotTime = ref(null)
const state = inject('appointment-state')

const currentDate = new Date();
const currentMonth = ref(currentDate.getMonth() + 1); // JavaScript months are 0-indexed
const currentYear = ref(currentDate.getFullYear());

const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};

const getSolts = async () => {
    await practitionerStore.getSlots({
        month: patientRegStore.appointment.month,
        timezone: patientRegStore.appointment.timezone
    }, props.data.config.practitioners[0])
}

const timeSlot = (index, selectedTime) => {
    console.log('selectedTime', index, selectedTime, additionalButtonsShown.value)
    selectTimeSlot.value = selectedTime
    // Reset visibility of the last shown additional buttons
    const lastShownIndex = additionalButtonsShown.value.findIndex((shown) => shown);
    if (lastShownIndex !== -1) {
        additionalButtonsShown.value[lastShownIndex] = false;
    }

    // Toggle the visibility of the additional buttons for the clicked time slot
    additionalButtonsShown.value[index] = true;
};

const timezones = Object.entries(timezoneMap).map(([abbreviation, timezone]) => {
    return {
        name: abbreviation,
        abbreviation: abbreviation,
    };
})


if (!patientRegStore.appointment.month) {
    patientRegStore.appointment.month = moment().format('MM')
}

if (patientRegStore.appointment.appointment_date) {
    calanderSelectedDate.value = new Date(patientRegStore.appointment.appointment_date)
}


if (patientRegStore.appointment.timeSlotString) {
    chooseDate.value = practitionerStore.slots[patientRegStore.appointment.appointment_date] ?? []
    const entries = Object.entries(chooseDate.value)
    console.log('patientRegStore.appointment.timeSlotString', patientRegStore.appointment.timeSlotString, entries)
    for (const [index, [key, tempSlot]] of entries.entries()) {
        console.log("Existing timeslot", moment(tempSlot.start_time).tz('UTC').format('hh:mm A'), patientRegStore.appointment.timeSlotString)
        if (moment(tempSlot.start_time).tz('UTC').format('hh:mm A') == patientRegStore.appointment.timeSlotString)
            timeSlot(index, tempSlot)
    }
}

if (!patientRegStore.appointment.timezone) {
    const allowedTimezones = Object.values(timezoneMap);
    let guessedTimezone = moment.tz.guess();
    if (!allowedTimezones.includes(guessedTimezone)) {
        guessedTimezone = 'America/New_York'; // Fallback to EST
    }
    const selectedAbbreviation = Object.keys(timezoneMap).find(key => timezoneMap[key] === guessedTimezone) || 'EST';
    patientRegStore.appointment.timezone = selectedAbbreviation;
}

// watch(() => calanderSelectedDate.value, (date) => {
//     patientRegStore.appointment.appointment_date = moment(date).format('YYYY-MM-DD')
//     patientRegStore.appointment.month = moment(date).format('MM')
//     getSolts()
// })

getSolts()
dateKeys.value = Object.keys(practitionerStore.slots) ?? [];
onMounted(async () => {
    window.addEventListener('resize', checkIfMobile);

    // Preselect date and time if store has values
    if (patientRegStore.appointment.appointment_date) {
        await handleDateInput(true);
        if (patientRegStore.appointment.timeSlotString) {
            const entries = Object.entries(chooseDate.value)
            for (const [index, [key, tempSlot]] of entries.entries()) {
                if (moment(tempSlot.start_time).tz('UTC').format('hh:mm A') == patientRegStore.appointment.timeSlotString)
                    timeSlot(index, tempSlot)
            }
        }
    }

    visibility.value = 'unset'
});
onUnmounted(() => {
    window.removeEventListener('resize', checkIfMobile);
});



const filteredSlots = computed(() => {
    filterDate.value = []
    console.log('here', calanderSelectedDate.value)
    const today = new Date();
    const todayDateString = today.toISOString().substr(0, 10); // Get today's date in YYYY-MM-DD format
    // console.log("todayDateString", todayDateString);

    if (!patientRegStore.appointment.appointment_date || calanderSelectedDate.value) {
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }).format(calanderSelectedDate.value);
        scheduleDate.value = formattedDate;

    } else {
        const date = moment(patientRegStore.appointment.appointment_date);
        scheduleDate.value = date.format('dddd, MMMM D, YYYY');
    }
    let isTodaySlotAvailable = false;
    const entries = Object.entries(chooseDate.value);
    for (const [_, slotValue] of entries) {
        if (calanderFormatedDate.value === todayDateString) {

            filterDate.value.push(slotValue);
        } else {
            showCalendar.value = true;
            return chooseDate.value;
        }
    }
    return filterDate.value

});


const changeTimeZone = () => {
    timeZoneChanged.value = true
    timezonePopup.value = true

    selectTimeSlot.value = null;
    additionalButtonsShown.value = new Array(5).fill(false);
}
const minDate = computed(() => {
    let tz = timezoneMap[patientRegStore.appointment.timezone] || 'America/New_York';
    const today = moment().tz(tz);
    return today.format('YYYY-MM-DD');
});

const minDateNew = computed(() => {
    return new Date()
});

const maxDate = computed(() => {
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    return threeMonthsLater;
});

// Add a function to determine which dates should be disabled
const allowedDates = (date) => {
    return isDateAvailable(date);
};
watch(() => practitionerStore.slots, () => {
    // If the currently selected date has no slots, reset it
    if (calanderSelectedDate.value && !isDateAvailable(calanderSelectedDate.value)) {
        calanderSelectedDate.value = null;
        showCalendar.value = true;
    }
}, { deep: true });

// Update the month handler to fetch slots for the new month
const monthUpdate = async (newMonth) => {
    console.log('newMonth', moment(newMonth[0].month).format('MM'))
    patientRegStore.appointment.month = moment(newMonth[0].month).format('MM');
    await getSolts();
    console.log(disabledDates.value, attributes.value)
};

watch(() => patientRegStore.appointment.timezone, async (newTimezone) => {
    if (newTimezone && calanderSelectedDate.value) {
        await handleDateInput(true); // Pass true to indicate it's a timezone change
    }
});
const handleDateInput = async (CalendarDay, MouseEvent, isTimezoneChange = false) => {
    console.log('calanderSelectedDate', CalendarDay)
    if (CalendarDay.isDisabled) return
    calanderSelectedDate.value = CalendarDay.date
    if (!calanderSelectedDate.value) {
        await getSolts();
        dateKeys.value = Object.keys(practitionerStore.slots) ?? [];
        timezonePopup.value = false
        console.log('calanderSelectedDate.value', disabledDates.value, attributes.value)
        return
    };

    if (!isDateAvailable(calanderSelectedDate.value)) {
        addAlert('No slots available for selected date', 'error');
        return;
    }

    timeZoneChanged.value = false;
    timezonePopup.value = false;
    chooseDate.value = [];

    const selectedDate = new Date(calanderSelectedDate.value);
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = selectedDate.getDate().toString().padStart(2, '0');
    calanderFormatedDate.value = `${year}-${month}-${day}`;

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(selectedDate);

    scheduleDate.value = formattedDate;
    patientRegStore.appointment.month = selectedDate.getMonth() + 1;

    if (isTimezoneChange) {
        await getSolts();
        dateKeys.value = Object.keys(practitionerStore.slots) ?? [];
    }

    if (calanderFormatedDate.value) {
        await getAvailableSlots(calanderFormatedDate.value);
    }

    if (isTimezoneChange) {
        selectTimeSlot.value = null;
        additionalButtonsShown.value = new Array(5).fill(false);
    }
};
const getAvailableSlots = async (date) => {

    let currentDate = null
    // patientRegStore.appointment.timezone = selectTimeZone.value
    if (scheduleDate.value) currentDate = new Date(scheduleDate.value); else currentDate = new Date();
    patientRegStore.appointment.month = currentDate.getMonth() + 1;
    chooseDate.value = practitionerStore.slots[date] ?? []
    if (filteredSlots.value) {
        showCalendar.value = false
    } else {
        addAlert('No Slots Availabe', 'error')
    }

}
const isDateAvailable = (date) => {
    // Convert the date to YYYY-MM-DD format
    const formattedDate = moment(date).format('YYYY-MM-DD');

    // Check if there are slots available for this date in the store
    return practitionerStore.slots &&
        practitionerStore.slots[formattedDate] &&
        practitionerStore.slots[formattedDate].length > 0;
};
const nextButton = async () => {
    // await scheduleEvent()
    if (!selectTimeSlot.value) { addAlert('Select Time Slot', 'error'); return }
    let apptData = {
        appointment_date: moment(selectTimeSlot.value.start_time).tz('UTC').format('YYYY-MM-DD'),
        appointment_time: moment(selectTimeSlot.value.start_time).tz('UTC').format('HH:mm:ss'),
        timezone: patientRegStore.appointment.timezone,
        timeSlotString: moment(selectTimeSlot.value.start_time).tz('UTC').format('hh:mm A'),
        timeSlotFormatedString: moment(selectTimeSlot.value.formatted_datetime, 'YYYY-MM-DD hh:mm A').format('hh:mm A'),
        formatted_datetime: selectTimeSlot.value.formatted_datetime,
        formatedDateString: moment(calanderFormatedDate.value, 'YYYY-MM-DD hh:mm A').format('MM-DD-YYYY'),
        start_time: selectTimeSlot.value.start_time
    }
    patientRegStore.setAppointment(apptData)
    state.value = 'review-appointment'
    console.log('apptData', apptData)
};

const formatTimeSlot = (data) => {
    return moment(data, 'YYYY-MM-DD hh:mm A').format('hh:mm A');
}

const disabledDates = computed(() => {
    const daysInMonth = new Date(currentYear.value, currentMonth.value, 0).getDate();
    const allDates = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear.value, currentMonth.value - 1, day);
        allDates.push(formatDate(date));
    }
    return allDates.filter(date => !isDateAvailable(date));
});

const attributes = computed(() => {
    const daysInMonth = new Date(currentYear.value, currentMonth.value, 0).getDate();
    const allDates = [];
    const today = new Date();
    const formattedToday = formatDate(today);

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear.value, currentMonth.value - 1, day);
        allDates.push(formatDate(date));
    }

    return [
        {
            highlight: {
                style: {
                    backgroundColor: '#00A68B',
                    color: 'white',
                },
            },
            dates: allDates.filter(date => isDateAvailable(date)),
        },
        {
            key: 'today',
            dot: {
                color: 'red',
            },

            highlight: {
                style: {
                    backgroundColor: '#00A68B',
                    color: 'white',
                },
            },
            dates: [formattedToday]
        }
    ];
});
const onUpdateFromPage = async (month) => {
    currentMonth.value = month[0].month.toString().padStart(2, '0');
    // currentYear.value = year;
    console.log('month', month, month[0].month.toString().padStart(2, '0'))
    patientRegStore.appointment.month = currentMonth.value,
        await getSolts()
};
</script>
<template>

    <div class="auth-card pa-2 rounded-5" :style="[isMobile ? { marginTop: '0px' } : { marginTop: '0px' }]"
        :class="isMobile ? '' : ''">
        <div class="rounded-top">

            <VRow class="">
                <VCol cols="12" md="12">
                    <div class="d-flex justify-content-between align-items-center w-100">
                        <div class="d-flex align-items-center flex-grow-1">
                            <h4 class="mb-1 mt-1">
                                <!-- <span v-if="showCalendar">Select your preferred date</span>
                            <span v-if="!showCalendar">Select your preferred time</span> -->
                                <span>{{ $t('Select Date & Time') }}</span>
                            </h4>
                        </div>
                        <div class="ms-auto">
                            <strong>{{ $t('Timezone:') }} </strong>
                            <span>
                                <a class="mb-2" @click="changeTimeZone" style="cursor: pointer; color: #282828;">
                                    <VIcon icon="tabler-world" size="small"></VIcon>
                                    {{ patientRegStore.appointment.timezone }}
                                    &nbsp;
                                    <VIcon icon="tabler-caret-down"></VIcon>
                                </a>
                            </span>
                        </div>
                    </div>
                    <div class="" :class="isMobile ? '' : 'pa-4'">

                        <VRow :class="isMobile ? '' : 'px-2'" v-if="showCalendar">
                            <VCol cols="12" md="12" class="d-flex justify-center">
                                <!-- <v-date-picker color="rgb(var(--v-theme-yellow-theme-button))"
                                            v-model="calanderSelectedDate" @update:modelValue="handleDateInput"
                                            :min="minDate" :max="maxDate" width="100%" hide-header
                                            @update:month="monthUpdate" :allowed-dates="allowedDates"></v-date-picker> -->
                                <!-- <div style="max-width: 400px;"> -->
                                <DatePicker @dayclick="handleDateInput" :min="minDate" :max="maxDate"
                                    :disabled-dates="disabledDates" @update:from-page="onUpdateFromPage"
                                    @did-move="onUpdateFromPage" :attributes="attributes" expanded
                                    style="border: none; background: transparent;" />
                                <!-- </div> -->


                            </VCol>

                        </VRow>
                        <VRow :class="isMobile ? '' : 'px-2'" v-if="!showCalendar">
                            <v-col cols="12" md="12" class="text-center tslot-date" :class="isMobile ? 'px-2' : 'px-0'">
                                <a class="text-center mb-3 d-block" type="button" @click="showCalendar = true"
                                    style="color: #004600;">
                                    {{ scheduleDate }}
                                </a>
                                <div class="d-flex flex-wrap justify-content-center gap-2">
                                    <div v-if="!filteredSlots || filteredSlots.length == 0">
                                        <h4 class="text-center text-danger">{{ $t('No slot available') }}</h4>
                                    </div>
                                    <template v-else>
                                        <div v-for="(choosetimeframes, index) in filteredSlots" :key="index"
                                            class="time-slot-wrapper">
                                            <v-btn @click="timeSlot(index, choosetimeframes)" class="mb-2 px-3 py-2"
                                                variant="outlined" v-if="!additionalButtonsShown[index]"
                                                color="rgb(var(--v-theme-yellow-theme-button))">
                                                {{ formatTimeSlot(choosetimeframes.formatted_datetime) }}
                                            </v-btn>

                                            <v-btn v-if="additionalButtonsShown[index]" class="mb-2 px-3 py-2">
                                                {{ formatTimeSlot(choosetimeframes.formatted_datetime) }}
                                            </v-btn>
                                        </div>
                                    </template>
                                </div>
                            </v-col>
                        </VRow>
                        <VRow>
                            <VCol cols="12" md="12" class="text-center" v-if="!showCalendar">
                                <VBtn class=" text-capitalize text-white d-grid waves-effect waves-light px-4 w-50"
                                    variant="flat" @click="nextButton()" rounded="lg">
                                    {{ $t('Next') }}</VBtn>
                            </VCol>
                        </VRow>
                    </div>
                </VCol>

                <VCol cols="12" md="12">
                    <VDialog v-model="timezonePopup" refs="myDialog" persistent width="500">


                        <v-card title="Change Time Zone"22>
                            <v-card-text v-if="timeZoneChanged">
                                <VRow>
                                    <v-col cols="12" md="12">
                                        <v-autocomplete label="Time Zone" v-model="patientRegStore.appointment.timezone"
                                            style="column-gap: 0px;" :items="timezones" item-title="name"
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
    </div>
</template>
<style scoped>
/* Add new styles for calendar active dates */
:deep(.v-date-picker-month__day button.v-btn:not(.v-btn--disabled)) {
    background-color: #E3F2FD !important;
    color: #192cd2 !important;
    font-weight: 600;
    /* Dark blue text */
}

:deep(.v-date-picker-month__day button.v-btn--active) {
    background-color: #1976D2 !important;
    /* Dark blue background for selected date */
    color: white !important;
    /* White text for selected date */
}

/* .v-date-picker>>>.v-date-picker-controls__month-btn,
.v-date-picker>>>.v-date-picker-controls__mode-btn {
    display: none;
} */

.v-date-picker>>>.v-btn--icon.v-btn--density-comfortable {
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
.vc-highlight-content-solid {
    color: var(--vc-highlight-solid-content-color) !important;
}

.v-date-picker-month__day {
    .v-btn:not(.v-btn--disabled) {
        &:hover {
            background-color: #BBDEFB !important;
            /* Slightly darker blue on hover */
        }
    }
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

// .bg-primary {
//     background-color: rgb(var(--v-theme-grey-900)) !important;
// }

.text-primary {
    color: rgb(var(--v-theme-yellow)) !important;
}

// }
</style>
