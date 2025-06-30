<!-- DateTimePicker.vue -->
<script setup>
import { patientAuthService } from '@/services/auth/patientAuthService';
import { usePatientRegStore } from '@/stores/patientRegStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import debounce from 'lodash.debounce';
import moment from 'moment-timezone';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { VAutocomplete, VBtn, VCard, VCardActions, VCardText, VCol, VDialog, VIcon, VRow, VSpacer } from 'vuetify/components';

const route = useRoute();
const router = useRouter();
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
    },
    doctorName: {
        type: String,
        required: false
    },
    affiliate: {
        type: Boolean,
        required: false
    }
});

const confirmDisabled = ref(false)
const selectedDate = ref(null);
const selectedTime = ref(null);
const selectedDateSlots = ref([]);
const selectedSlotStartTime = ref(null);
const selectedFormatedDateTime = ref(null);
const currentDisplayDate = ref(new Date());
const timeZoneChanged = ref(false);
const timezonePopup = ref(false);
const confirmPopup = ref(false);
const apptData = ref({})
const currentUser = ref(null)
patientRegStore.patient.affiliate_email = route.query.af_ref ? atob(route.query.af_ref) : null
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

onMounted(() => {
    const types = props.data.config.appointment_types
    if (types && types.length > 0 && !patientRegStore.appointment.appointment_type) {
        patientRegStore.appointment.appointment_type = types[0]
    }
})

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

const emit = defineEmits(['update:date', 'update:time', 'completed', 'update:slotDuration']);

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

// Calculate slot duration dynamically
const slotDuration = computed(() => {
    if (selectedDateSlots.value.length < 2) {
        return 30; // Default to 30 minutes if we can't calculate
    }

    // Get first two slots to calculate duration
    const firstSlot = selectedDateSlots.value[0];
    const secondSlot = selectedDateSlots.value[1];

    if (!firstSlot || !secondSlot) {
        return 30; // Default to 30 minutes
    }

    // Parse the time from formatted_datetime (format: "YYYY-MM-DD HH:MM AM/PM")
    const parseSlotTime = (slot) => {
        const parts = slot.formatted_datetime.split(" ");
        const timePart = parts[1] + " " + parts[2]; // "HH:MM AM/PM"
        return moment(timePart, "hh:mm A");
    };

    const firstTime = parseSlotTime(firstSlot);
    const secondTime = parseSlotTime(secondSlot);

    // Calculate difference in minutes
    const diffMinutes = secondTime.diff(firstTime, 'minutes');

    return diffMinutes > 0 ? diffMinutes : 30; // Default to 30 if calculation fails
});

// Format duration for display
const formattedDuration = computed(() => {
    const duration = slotDuration.value;
    if (duration >= 60) {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        if (minutes === 0) {
            return hours === 1 ? '1 hour' : `${hours} hours`;
        } else {
            return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
        }
    } else {
        return `${duration} minutes`;
    }
});

// Watch for slot duration changes and emit to parent
watch(formattedDuration, (newDuration) => {
    emit('update:slotDuration', newDuration);
}, { immediate: true });

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

const confirm = () => {
    confirmPopup.value = true
    apptData.value = {
        appointment_date: moment(selectedSlotStartTime.value).tz('UTC').format('YYYY-MM-DD'),
        appointment_time: moment(selectedSlotStartTime.value).tz('UTC').format('HH:mm:ss'),
        timezone: patientRegStore.appointment.timezone,
        timeSlotString: moment(selectedSlotStartTime.value).tz('UTC').format('hh:mm A'),
        timeSlotFormatedString: moment(selectedFormatedDateTime.value, 'YYYY-MM-DD hh:mm A').format('hh:mm A'),
        formatted_datetime: selectedFormatedDateTime.value,
        formatedDateString: moment(selectedSlotStartTime.value, 'YYYY-MM-DD hh:mm A').format('MM-DD-YYYY'),
        start_time: selectedSlotStartTime.value
    };
}

const convertTimeBasedOnContext = (time12hr, time24hr) => {
    const period = time12hr.slice(-2); // 'AM' or 'PM'
    let hour12 = parseInt(time12hr.slice(0, 2), 10);
    let hour24 = parseInt(time24hr.slice(0, 2), 10);
    if (period === "PM" && hour12 !== 12) {
        hour24 = (hour24 % 12) + 12;
    } else if (period === "AM" && hour12 === 12) {
        hour24 = 0;
    }
    let newTime24hr = hour24.toString().padStart(2, "0") + time24hr.slice(2);

    return newTime24hr;
};

const formatTime = (time, minutesToAdd = 0) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    let date = new Date();
    date.setHours(hours, minutes + minutesToAdd, seconds);

    let hoursFormatted = date.getHours() % 12 || 12;
    let minutesFormatted = String(date.getMinutes()).padStart(2, '0');
    let ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${hoursFormatted}:${minutesFormatted} ${ampm}`;
}

const confirmFun = async () => {
    if (!props.affiliate)
        currentUser.value = await patientAuthService.fetchProfile();
    console.log('currentUser', currentUser.value)
    let startTime = convertTimeBasedOnContext(
        apptData.value.timeSlotString,
        apptData.value.appointment_time
    )
    let scheduleData = {
        practitioner_id: props.data.config.practitioners[0],
        patient_id: patientRegStore.patient.id ?? currentUser.value?.userData?.id,
        title: `${patientRegStore.patient.first_name ?? currentUser.value?.userData?.firstName} ${patientRegStore.patient.last_name ?? currentUser.value?.userData?.lastName}`,
        date: apptData.value.appointment_date,
        formatted_datetime: apptData.value.formatted_datetime,
        timezone: apptData.value.timezone,
        start_time: apptData.value.start_time,
        end_time: formatTime(startTime, 15),
        status: 'Pending',
        service: 'Patient Followup',
        location: 4,
        room: 'Room 1',
        appointment_type: patientRegStore.appointment.appointment_type,
        payment_type: 'Cash Only',
        notes: '',
        order_id: patientRegStore.order_id,
        affiliate_email: patientRegStore.patient.affiliate_email
    }
    console.log('scheduleData', scheduleData)
    if (props.affiliate)
        await patientRegStore.bookAffiliateAppointment(scheduleData)
    else
        await patientRegStore.bookAppointment(scheduleData)




};

const encodeBase64Unicode = (obj) => {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}

const nextButton = async () => {
    if (!selectedSlotStartTime.value) {
        addAlert('Select Time Slot', 'error');
        return;
    }


    confirmDisabled.value = true
    patientRegStore.setAppointment(apptData.value);
    await nextTick();
    try {
        await confirmFun()
        setTimeout(() => {
            confirmDisabled.value = false
            if (props.affiliate) {
                router.replace('/affiliate/confirmation?bid=' + route.query.bid + '&cart=' + encodeBase64Unicode(patientRegStore.cart_products) + '&af_ref=' + route.query.af_ref);
            } else {

                let url = '/patient/confirmation?bid=' + route.query.bid + '&cart=' + encodeBase64Unicode(patientRegStore.cart_products);

                if (patientRegStore.patient.affiliate_email) url += `&af_ref=${btoa(patientRegStore.patient.affiliate_email)}`;

                router.replace(url);
            }
        }, 500);
    } catch (error) {
        confirmDisabled.value = false
        addAlert('Something went wrong!', 'error')
        hideLoader()
        console.error('Error in API:', error.response || error.message || error);
    }

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

const formatShowDate = (originalDate) => {
    // Parse the date string into a Date object
    let dateParts = originalDate.split('-');
    let dateObject = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);

    // Format the Date object into the desired format
    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return monthNames[dateObject.getMonth()] + ' ' + dateObject.getDate() + ', ' + (dateObject.getFullYear() - 1);
}

const currentMonthDateRange = computed(() => {
    const dates = [];

    // Use the current display date to get the year and month being viewed
    const year = currentDisplayDate.value.getFullYear();
    const month = currentDisplayDate.value.getMonth();

    // Create a date for the first day of the month
    const startDate = new Date(year, month, 1);

    // Get the number of days in the current month
    // By setting the date to 0 of next month, we get the last day of current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Generate dates for the current month
    for (let i = 0; i < daysInMonth; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const formattedDate = formatDate(date);

        dates.push({
            date: new Date(date),
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNumber: date.getDate(),
            isToday: isSameDate(date, new Date()),
            isSelected: selectedDate.value ? isSameDate(date, selectedDate.value) : false,
            isDisabled: isDateDisabled(date),
            hasSlots: practitionerStore.slots[formattedDate]?.length > 0,
        });
    }
    return dates;
});

const safeBtoa = (str) => {
    return btoa(unescape(encodeURIComponent(str)));
}

patientRegStore.$subscribe(debounce((mutation, state) => {

    localStorage.setItem('patientRegStore', safeBtoa(JSON.stringify(state)))

}))

const formatLabel = (type) => {
    // Optionally format label from snake_case to "Title Case"
    return type
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
}
</script>

<template>
    <div class="date-time-picker" style="min-height: 430px;">

        <div class="month-navigation">
            <VBtn @click="navigateMonth(-1)" icon="tabler-chevron-left" variant="text" :disabled="isCurrentMonth"
                color="light">
            </VBtn>
            <div class="month-display custom-font-family">
                <VIcon>tabler-calendar</VIcon>&nbsp;{{ currentDisplayDate.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                }) }}
            </div>

            <VBtn @click="navigateMonth(1)" icon="tabler-chevron-right" variant="text" color="light">
            </VBtn>
        </div>

        <div class="header mt-4">
            <VRadioGroup v-model="patientRegStore.appointment.appointment_type" inline>
                <VRadio v-for="type in props.data.config.appointment_types" :key="type" :label="formatLabel(type)"
                    :value="type" />
            </VRadioGroup>
            <a class="" @click="changeTimeZone" style="cursor: pointer; color: #282828;">
                <h4 class="custom-font-family">{{ $t('Timezone') }}:&nbsp;<VIcon icon="tabler-world" size="small">
                    </VIcon>
                    <span style="font-weight: 400;">{{ patientRegStore.appointment.timezone }}</span>
                    &nbsp;
                    <VIcon size="18" icon="tabler-chevron-down"></VIcon>
                </h4>
            </a>




            <!-- <div>
                <VBtn class="nav-button mr-1" @click="navigateWeek(-1)" icon="tabler-chevron-left" variant="outlined"
                    :disabled="isAtCurrentWeek">
                </VBtn>
                <VBtn class="nav-button" @click="navigateWeek(1)" aria-label="Next week" icon="tabler-chevron-right"
                    variant="outlined"></VBtn>
            </div> -->


        </div>

        <div class="calendar-container">
            <div class="calendar-header">
                <div class="weekday" v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day">
                    {{ day }}
                </div>
            </div>

            <!-- Calendar - Date grid -->
            <div class="calendar-grid">
                <div v-for="dateObj in currentMonthDateRange" :key="dateObj.date.toISOString()" class="date-cell"
                    :class="{
                        'selected': dateObj.isSelected,
                        'today': dateObj.isToday,
                        'disabled': dateObj.isDisabled,
                        'outside-month': !dateObj.isCurrentMonth
                    }" @click="selectDate(dateObj.date)">
                    {{ dateObj.dayNumber }}
                </div>
            </div>
        </div>

        <div v-if="selectedDate && (!timeSlots || timeSlots.length == 0)">
            <h4 class="text-center text-danger custom-font-family">No slot available</h4>
        </div>
        <h3 class="mt-10 mb-5" v-if="selectedDate && timeSlots.length > 0" style="font-weight: 500;">
            Available Times for {{ selectedDate.toLocaleDateString('en-US', { month: 'long' }) }} {{
                selectedDate.getDate() }}
        </h3>
        <div v-if="selectedDate" class="time-slots">
            <div v-for="slot in timeSlots" :key="slot.time" class="time-slot" :class="{ 'selected': slot.isSelected }"
                @click="selectTime(slot.time)">
                {{ slot.time }}
            </div>
        </div>

        <div class="text-center mt-4" v-if="selectedSlotStartTime">
            <VBtn class="text-capitalize text-white d-grid waves-effect waves-light px-4 w-50" variant="flat"
                @click="confirm" rounded="lg" block size="large">
                {{ $t('Confirm Appointment') }}
            </VBtn>
        </div>
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
    <VDialog v-model="confirmPopup" persistent width="500">
        <DialogCloseBtn @click="confirmPopup = false" />
        <VCard v-if="confirmPopup">
            <VCardText>
                <VRow>
                    <VCol cols="12" md="12" class="text-center">
                        <h2 class="custom-color">{{ $t('Please Confirm Your Appointment') }}</h2>
                    </VCol>
                    <VCol cols="12" md="12">
                        <div class="bg-custom appointment-details">
                            <div class="detail-row">
                                <span class="detail-label">Date:</span>
                                <span class="detail-value">{{ formatShowDate(apptData.formatedDateString) }}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Time:</span>
                                <span class="detail-value">{{ apptData.timeSlotFormatedString }} &nbsp; {{
                                    apptData.timezone }}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Doctor:</span>
                                <span class="detail-value">Dr. {{ props.doctorName }}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Type:</span>
                                <span class="detail-value">Telehealth Visit (30 min)</span>
                            </div>
                        </div>
                        <p class="mt-4 text-center agreement">
                            By confirming, you agree to attend this consultation. If you need to reschedule,
                            please contact support at least 24 hours in advance.
                        </p>
                    </VCol>
                </VRow>
                <VRow class="pt-0 pb-4 mt-0">

                    <VCol cols="12" md="6">
                        <VBtn block @click="nextButton" class="text-capitalize text-white" size="large"
                            :disabled="confirmDisabled">
                            Confirm Appointment
                        </VBtn>
                    </VCol>
                    <VCol cols="12" md="6">
                        <VBtn block @click="confirmPopup = false" variant="outlined" class="text-capitalize"
                            size="large">
                            Change Selection
                        </VBtn>
                    </VCol>
                </VRow>
            </VCardText>


        </VCard>
    </VDialog>
</template>

<style scoped>
.appointment-details {
    border: 1px solid #e9f5f2;
    border-radius: 12px;
    padding: 25px 10px;
}

.detail-row {
    display: flex;
    margin-bottom: 16px;
    align-items: center;
}

.detail-row:last-child {
    margin-bottom: 0;
}

.detail-label {
    width: 80px;
    color: #4b5563;
    font-weight: 600;
    font-size: 15px;
}

.detail-value {
    font-weight: 500;
    color: #1f2937;
    font-size: 16px;
}

.agreement {
    text-align: center;
    color: #4b5563;
    margin-bottom: 10px;
    font-size: 15px;
    line-height: 1.6;
    position: relative;
}

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
    justify-content: space-between;
    /* Changed from center to space-between */
    background: #49a38c;
    border-radius: 5px;
    padding: 10px;
    color: white;
    width: 100%;
    /* Ensure it takes full width */
}

/* If needed, you can add these to your month-display class */
.month-display {
    font-size: 0.875rem;
    color: white;
    text-align: center;
    flex-grow: 1;
    /* Allow the month display to take up available space */
}

.month-nav-button {
    padding: 6px 10px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    color: #49a38c;
    font-size: 0.875rem;
}

/* Calendar */
.calendar-container {
    margin-bottom: 20px;
}

.calendar-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    margin-bottom: 8px;
    font-weight: 500;
    color: #666;
}

.weekday {
    padding: 8px 0;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
}

.date-cell {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
}

.date-cell:hover:not(.disabled) {
    border-color: #00BFB3;
}

.date-cell.selected {
    background-color: #00BFB3;
    color: white;
    border-color: #00BFB3;
}

.date-cell.today {
    border-color: #00BFB3;
    font-weight: bold;
}

.date-cell.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f7fafc;
}

.date-cell.outside-month {
    color: #434050;
}

/* End */

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
    color: #49a38c;
    flex-shrink: 0;
}

.date-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 17px 2px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    cursor: pointer;
    background: white;
    transition: all 0.2s;
    text-align: center;
    height: 100%;
    width: 100%;
}

.date-cell:hover:not(.disabled) {
    border-color: #49a38c;
}

.date-cell.selected {
    background: #49a38c;
    color: white;
    border-color: #49a38c;
}

.date-cell.today {
    border-color: #49a38c;
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
    padding: 10px 10px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
    font-weight: 500;
}

.time-slot:hover {
    border-color: #49a38c;
}

.time-slot.selected {
    background: #49a38c;
    color: white;
    border-color: #49a38c;
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
