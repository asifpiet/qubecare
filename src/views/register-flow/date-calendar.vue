<!-- DateTimePicker.vue -->
<script setup>
import { usePatientRegStore } from '@/stores/patientRegStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import moment from 'moment-timezone';
import { computed, inject, ref, watch } from 'vue';
import { VAutocomplete, VBtn, VCard, VCardActions, VCardText, VCol, VDialog, VIcon, VRow, VSpacer } from 'vuetify/components';

const practitionerStore = usePractitionerStore();
const patientRegStore = usePatientRegStore();

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    initialDate: {
        type: Date,
        default: null
    },
    minDate: {
        type: Date,
        default: null
    },
    maxDate: {
        type: Date,
        default: null
    }
});

// State management
const state = inject('appointment-state');
const selectedDate = ref(null);
const selectedTime = ref(null);
const selectedDateSlots = ref([]);
const selectedSlotStartTime = ref(null);
const selectedFormatedDateTime = ref(null);
const currentDisplayDate = ref(new Date());
const timeZoneChanged = ref(false);
const timezonePopup = ref(false);

// Timezone configuration
const timezoneMap = {
    'EST': 'America/New_York',
    'PST': 'America/Los_Angeles',
    'CST': 'America/Chicago',
    'MST': 'America/Denver'
};

// Initialize timezone if not set
if (!patientRegStore.appointment.timezone) {
    const allowedTimezones = Object.values(timezoneMap);
    let guessedTimezone = moment.tz.guess();
    if (!allowedTimezones.includes(guessedTimezone)) {
        guessedTimezone = 'America/New_York';
    }
    const selectedAbbreviation = Object.keys(timezoneMap).find(key => timezoneMap[key] === guessedTimezone) || 'EST';
    patientRegStore.appointment.timezone = selectedAbbreviation;
}


patientRegStore.appointment.month = new Date().getMonth() + 1; // Adding 1 because getMonth() is zero-based


const timezones = Object.entries(timezoneMap).map(([abbreviation, timezone]) => ({
    name: abbreviation,
    abbreviation: abbreviation,
}));

// Watch for timezone changes
watch(() => patientRegStore.appointment.timezone, async (newTimezone) => {
    if (newTimezone) {
        selectedTime.value = null;
        selectedSlotStartTime.value = null;
        selectedFormatedDateTime.value = null;
        await getSolts();
        if (selectedDate.value) {
            const formattedDate = formatDate(selectedDate.value);
            selectedDateSlots.value = practitionerStore.slots[formattedDate] || [];
        }
        timezonePopup.value = false
    }
});

// Helper Functions
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const changeTimeZone = () => {
    timeZoneChanged.value = true;
    timezonePopup.value = true;
};

const emit = defineEmits(['update:date', 'update:time', 'completed']);

const getSolts = async () => {
    await practitionerStore.getSlots({
        month: patientRegStore.appointment.month,
        timezone: patientRegStore.appointment.timezone
    }, props.data.config.practitioners[0]);
};

// Initialize slots
getSolts();

// Computed Properties
const startOfWeek = computed(() => {
    const start = new Date(currentDisplayDate.value);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    return start;
});

const weekDates = computed(() => {
    const dates = [];
    const start = new Date(startOfWeek.value);

    for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        const formattedDate = formatDate(date);

        dates.push({
            date: new Date(date),
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNumber: date.getDate(),
            isToday: isSameDate(date, new Date()),
            isSelected: selectedDate.value ? isSameDate(date, selectedDate.value) : false,
            isDisabled: isDateDisabled(date),
            hasSlots: practitionerStore.slots[formattedDate]?.length > 0
        });
    }
    return dates;
});

const timeSlots = computed(() => {
    return selectedDateSlots.value.map(slot => ({
        time: slot.formatted_datetime.split(" ")[1] + " " + slot.formatted_datetime.split(" ")[2],
        isSelected: slot.formatted_datetime.split(" ")[1] + " " + slot.formatted_datetime.split(" ")[2] === selectedTime.value
    }));
});

const isSameDate = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();
};

const isDateDisabled = (date) => {
    if (props.minDate && date < props.minDate) return true;
    if (props.maxDate && date > props.maxDate) return true;

    const formattedDate = formatDate(date);
    return !practitionerStore.slots[formattedDate] || practitionerStore.slots[formattedDate].length === 0;
};

// Event Handlers
const selectDate = (date) => {
    if (isDateDisabled(date)) return;
    selectedDate.value = new Date(date);
    selectedTime.value = null;

    const formattedDate = formatDate(selectedDate.value);
    selectedDateSlots.value = practitionerStore.slots[formattedDate] || [];
    emit('update:date', selectedDate.value);
};

const selectTime = (time) => {
    const selectedSlot = selectedDateSlots.value.find(slot => {
        const slotTime = slot.formatted_datetime.split(" ")[1] + " " + slot.formatted_datetime.split(" ")[2];
        return slotTime === time;
    });

    if (selectedSlot) {
        selectedTime.value = time;
        selectedSlotStartTime.value = selectedSlot.start_time;
        selectedFormatedDateTime.value = selectedSlot.formatted_datetime;

        nextButton()
    }

    emit('update:time', time);
};

const isAtCurrentWeek = computed(() => {
    const today = new Date();
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    startOfCurrentWeek.setHours(0, 0, 0, 0);

    const currentStartOfWeek = new Date(startOfWeek.value);
    currentStartOfWeek.setHours(0, 0, 0, 0);

    return currentStartOfWeek <= startOfCurrentWeek;
});

const navigateWeek = (direction) => {
    const newDate = new Date(currentDisplayDate.value);
    newDate.setDate(currentDisplayDate.value.getDate() + (direction * 7));

    // Only allow navigation if we're not going before the current week
    if (direction === -1) {
        const today = new Date();
        const startOfCurrentWeek = new Date(today);
        startOfCurrentWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
        startOfCurrentWeek.setHours(0, 0, 0, 0);

        const newStartOfWeek = new Date(newDate);
        newStartOfWeek.setDate(newDate.getDate() - newDate.getDay() + (newDate.getDay() === 0 ? -6 : 1));
        newStartOfWeek.setHours(0, 0, 0, 0);

        if (newStartOfWeek < startOfCurrentWeek) {
            return;
        }
    }

    currentDisplayDate.value = newDate;
};

const isCurrentMonth = computed(() => {
    const today = new Date();
    return currentDisplayDate.value.getMonth() === today.getMonth() &&
        currentDisplayDate.value.getFullYear() === today.getFullYear();
});

// Modify the navigateMonth function to prevent going back from current month
const navigateMonth = (direction) => {
    // If trying to go back (-1) when in current month, prevent navigation
    if (direction === -1 && isCurrentMonth.value) {
        return;
    }

    const newDate = new Date(currentDisplayDate.value);
    newDate.setMonth(currentDisplayDate.value.getMonth() + direction);
    currentDisplayDate.value = newDate;
};

const nextButton = async () => {
    if (!selectedSlotStartTime.value) {
        addAlert('Select Time Slot', 'error');
        return;
    }

    const apptData = {
        appointment_date: moment(selectedSlotStartTime.value).tz('UTC').format('YYYY-MM-DD'),
        appointment_time: moment(selectedSlotStartTime.value).tz('UTC').format('HH:mm:ss'),
        timezone: patientRegStore.appointment.timezone,
        timeSlotString: moment(selectedSlotStartTime.value).tz('UTC').format('hh:mm A'),
        timeSlotFormatedString: moment(selectedFormatedDateTime.value, 'YYYY-MM-DD hh:mm A').format('hh:mm A'),
        formatted_datetime: selectedFormatedDateTime.value,
        formatedDateString: moment(selectedSlotStartTime.value, 'YYYY-MM-DD hh:mm A').format('MM-DD-YYYY'),
        start_time: selectedSlotStartTime.value
    };

    patientRegStore.setAppointment(apptData);
    await nextTick();
    state.value = 'review-appointment';
};

// Initialize with props if provided
if (props.initialDate) {
    currentDisplayDate.value = new Date(props.initialDate);
    selectDate(props.initialDate);
}

onMounted(() => {
    // Set current display date to today
    currentDisplayDate.value = new Date();

    // Set month in store if not already set
    if (!patientRegStore.appointment.month) {
        patientRegStore.appointment.month = currentDisplayDate.value.getMonth() + 1;
    }

    // Get slots for current month
    getSolts();

    // If there's a pre-selected date, handle it
    if (patientRegStore.appointment.appointment_date) {
        const preSelectedDate = new Date(patientRegStore.appointment.appointment_date);
        selectDate(preSelectedDate);
    }
});

// Watch for changes in the appointment data and pre-select values
watchEffect(async () => {
    if (patientRegStore.appointment.appointment_date) {
        console.log("Pre-selecting date:", patientRegStore.appointment.appointment_date);
        selectedDate.value = new Date(patientRegStore.appointment.appointment_date);

        await getSolts(); // Ensure slots are fetched before proceeding

        // Format the date as needed for slot lookup
        const formattedDate = formatDate(selectedDate.value);
        selectedDateSlots.value = practitionerStore.slots[formattedDate] || [];

        console.log("Available slots for", formattedDate, ":", selectedDateSlots.value);

        // Auto-select the stored slot if available
        if (patientRegStore.appointment.timeSlotFormatedString) {
            console.log("Pre-selecting time:", patientRegStore.appointment.timeSlotFormatedString);

            const preSelectedSlot = selectedDateSlots.value.find(slot =>
                slot.formatted_datetime.includes(patientRegStore.appointment.timeSlotFormatedString)
            );

            console.log("Matched slot:", preSelectedSlot);

            if (preSelectedSlot) {
                selectedTime.value = patientRegStore.appointment.timeSlotFormatedString;
                selectedSlotStartTime.value = preSelectedSlot.start_time;
                selectedFormatedDateTime.value = preSelectedSlot.formatted_datetime;
                console.log("Slot selected successfully:", selectedTime.value);
            } else {
                console.warn("No matching slot found for:", patientRegStore.appointment.timeSlotFormatedString);
            }
        }
    }
});

watch(
    () => currentDisplayDate.value.getMonth(),
    async (newMonth, oldMonth) => {
        if (newMonth !== oldMonth) {
            // Update the store with the new month
            patientRegStore.appointment.month = newMonth + 1; // Months are zero-based, so add 1

            // Fetch slots for the new month
            await getSolts();

            // Optionally, if a specific date is selected, you can reset the available time slots:
            if (selectedDate.value) {
                const formattedDate = formatDate(selectedDate.value);
                selectedDateSlots.value = practitionerStore.slots[formattedDate] || [];
            }
        }
    }
);

</script>

<template>
    <div class="date-time-picker">
        <div class="header">
            <h4 class="">{{ $t('Select Date & Time') }}</h4>
            <a class="" @click="changeTimeZone" style="cursor: pointer; color: #282828;">
                <h4 class="custom-font-family">{{ $t('Timezone') }} &nbsp;<VIcon icon="tabler-world" size="small">
                    </VIcon>
                    <span style="font-weight: 400;">{{ patientRegStore.appointment.timezone }}</span>
                    &nbsp;
                    <VIcon size="18" icon="tabler-chevron-down"></VIcon>
                </h4>
            </a>
            <div class="month-navigation">

                <div class="month-display custom-font-family">
                    <VIcon>tabler-calendar</VIcon>
                    {{ 
                        currentDisplayDate.toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                        })
                    }}
                </div>
                <VBtn @click="navigateMonth(-1)" icon="tabler-chevron-left" variant="text" size="x-small"
                    :disabled="isCurrentMonth">
                </VBtn>
                <VBtn @click="navigateMonth(1)" icon="tabler-chevron-right" variant="text" size="x-small">
                </VBtn>
            </div>
        </div>

        <div class="dates-outer-container">


            <VBtn class="nav-button" @click="navigateWeek(-1)" icon="tabler-chevron-left" variant="outlined"
                :disabled="isAtCurrentWeek">
            </VBtn>

            <div class="dates-scroll-container">
                <div class="dates-grid">
                    <div v-for="dateObj in weekDates" :key="dateObj.date.toISOString()" class="date-cell" :class="{
                        'selected': dateObj.isSelected,
                        'today': dateObj.isToday,
                        'disabled': dateObj.isDisabled,
                        'has-slots': dateObj.hasSlots
                    }" @click="selectDate(dateObj.date)">
                        <div class="day-name">{{ dateObj.dayName }}</div>
                        <div class="day-number">{{ dateObj.dayNumber }}</div>
                    </div>
                </div>
            </div>

            <VBtn class="nav-button" @click="navigateWeek(1)" aria-label="Next week" icon="tabler-chevron-right"
                variant="outlined"></VBtn>
        </div>

        <div v-if="selectedDate && (!timeSlots || timeSlots.length == 0)">
            <h4 class="text-center text-danger custom-font-family">{{ $t('No slot available') }}</h4>
        </div>

        <div v-if="selectedDate" class="time-slots">
            <div v-for="slot in timeSlots" :key="slot.time" class="time-slot" :class="{ 'selected': slot.isSelected }"
                @click="selectTime(slot.time)">
                {{ slot.time }}
            </div>
        </div>

        <!-- <div class="text-center mt-4" v-if="selectedSlotStartTime">
            <VBtn class="text-capitalize text-white d-grid waves-effect waves-light px-4 w-50" variant="flat"
                @click="nextButton()" rounded="lg">
                Next
            </VBtn>
        </div> -->
    </div>

    <VDialog v-model="timezonePopup" persistent width="500">
        <VCard :title="$t('Change Time Zone')">
            <VCardText v-if="timeZoneChanged">
                <VRow>
                    <VCol cols="12" md="12">
                        <VAutocomplete :label="$t('Time Zone')" v-model="patientRegStore.appointment.timezone"
                            style="column-gap: 0px;" :items="timezones" item-title="name" item-value="abbreviation">
                        </VAutocomplete>
                    </VCol>
                </VRow>
            </VCardText>

            <VCardActions>
                <VSpacer></VSpacer>
                <VBtn :text="$t('Close')" @click="timezonePopup = false"></VBtn>
            </VCardActions>
        </VCard>
    </VDialog>
</template>

<style scoped>
.custom-font-family {
    font-family: system-ui, -apple-system, sans-serif;
}

.date-time-picker {
    width: 100%;
    margin: 0 auto;
    padding: 16px;
    font-family: system-ui, -apple-system, sans-serif;
    box-sizing: border-box;
}

.header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
}

@media (min-width: 640px) {
    .header {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
}

.title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
}

@media (min-width: 640px) {
    .title {
        font-size: 1rem;
    }
}

.month-navigation {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
}

.month-nav-button {
    padding: 6px 10px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    color: #49A38C;
    font-size: 0.875rem;
}

.month-display {
    font-size: 0.875rem;
    color: #666;
    min-width: 80px;
    text-align: center;
}

.dates-outer-container {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    width: 100%;
}

.dates-scroll-container {
    width: 100%;
    position: relative;
    overflow: hidden;
}

.dates-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    width: 100%;
}

.nav-button {
    padding: 6px 8px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    color: #49A38C;
    flex-shrink: 0;
}

.date-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 2px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    cursor: pointer;
    background: white;
    transition: all 0.2s;
    text-align: center;
    height: 100%;
    width: 80%;
}

.date-cell:hover:not(.disabled) {
    border-color: #49A38C;
}

.date-cell.selected {
    background: #49A38C;
    color: white;
    border-color: #49A38C;
}

.date-cell.today {
    border-color: #49A38C;
}

.date-cell.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f7fafc;
}

.day-name {
    font-size: 0.95rem;
    color: #666;
    margin-bottom: 2px;
}

.selected .day-name {
    color: white;
}

.day-number {
    font-size: 1.5rem;
    font-weight: 600;
}

.time-slots {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 8px;
    margin-top: 16px;
}

.time-slot {
    padding: 8px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
    font-weight: 500;
}

.time-slot:hover {
    border-color: #49A38C;
}

.time-slot.selected {
    background: #49A38C;
    color: white;
    border-color: #49A38C;
}

@media (max-width: 639px) {
    .dates-grid {
        min-width: 100%;
    }

    .date-cell {
        padding: 8px 4px;
        min-width: 0;
        width: 100%;
    }

    .day-name {
        font-size: 0.7rem;
    }

    .day-number {
        font-size: 0.9rem;
    }

    .nav-button {
        padding: 4px 6px;
        font-size: 0.875rem;
    }

    .time-slots {
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 6px;
    }

    .time-slot {
        padding: 8px 4px;
        font-size: 0.8rem;
    }
}

/* Touch device optimizations */
@media (hover: none) {

    .date-cell:hover,
    .time-slot:hover,
    .nav-button:hover,
    .month-nav-button:hover {
        border-color: #e2e8f0;
    }
}
</style>
