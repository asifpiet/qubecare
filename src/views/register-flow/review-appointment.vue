<script setup>
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})
import { patientAuthService } from '@/services/auth/patientAuthService';
import { usePatientRegStore } from '@/stores/patientRegStore';
import moment from "moment";
import { onBeforeMount, onMounted } from "vue";

const emit = defineEmits(['completed']);
const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
})


const patientRegStore = usePatientRegStore()
const visibility = ref('hidden')

const scheduleDate = ref("");
const scheduleTime = ref("");
const isTimeSlot = ref("");
const timeZone = ref("");
const timeDifference = ref();
const state = inject('appointment-state')
const appointmentDetails = patientRegStore.appointment
const disableSubmit = ref(false)

onBeforeMount(async () => {


    timeZone.value = appointmentDetails.timezone;
    isTimeSlot.value = appointmentDetails.appointment_time;

    const time = moment(isTimeSlot.value, "HH:mm:ss");
    scheduleTime.value = time.format("HH:mm a");

    scheduleDate.value = formatDate(appointmentDetails.appointment_date);
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
    visibility.value = 'unset'
});
const backFun = () => {
    state.value = 'date-selection'
};
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
const confirmFun = async () => {
    disableSubmit.value = true
    const currentUser = await patientAuthService.fetchProfile();
    console.log('currentUser', currentUser)
    let startTime = convertTimeBasedOnContext(
        appointmentDetails.timeSlotString,
        appointmentDetails.appointment_time
    )
    await patientRegStore.bookAppointment(
        {
            practitioner_id: props.data.config.practitioners[0],
            patient_id: currentUser.userData.id,
            title: `${currentUser.userData.firstName} ${currentUser.userData.lastName}`,
            date: appointmentDetails.appointment_date,
            formatted_datetime: appointmentDetails.formatted_datetime,
            timezone: appointmentDetails.timezone,
            start_time: appointmentDetails.start_time,
            end_time: formatTime(startTime, 15),
            status: 'Pending',
            service: 'Patient Followup',
            location: 4,
            room: 'Room 1',
            appointment_type: 'New Patient (Initial Visit)',
            payment_type: 'Cash Only',
            notes: '',
            order_id: patientRegStore.order_id
        }
    )
    disableSubmit.value = false
    emit('completed')





};

</script>

<template>

    <!-- <VRow>
        <VCol cols="12" lg="12" md="12">
            <router-link to="/" class="text-center mb-2 mt-2" style="
                                width: 100%;
                                position: relative;
                                display: block;
                                padding-top: 20px;
                            ">
                <span class="text-center">
                    <VImg
                                    :src="seetingPlanLogo"
                                    width="250"
                                    height="50"
                                    class="logo-img"
                                />
                </span>
            </router-link>
        </VCol>
    </VRow> -->
    <div class="auth-card pa-2 rounded-5"
        :style="[isMobile ? { marginTop: '0px' } : { marginTop: '0px' }, { visibility: visibility }]"
        :class="isMobile ? '' : ''">
        <div class="text-center">
            <h3 class="pricing-title mb-0 mt-4" style="padding-left: 10px;color: #49A38C;font-weight: 600;">
                {{ $t('Your Appointment Details') }}
            </h3>
            <div class="v-col v-col-12 w-100 pb-0 text-center">
                <div class="text-center">
                    <div class="app-bars-container">
                        <div class="app-bar">
                            <p class="mb-0 text-center">
                                <VIcon icon="tabler-calendar-week" /> &nbsp;{{
                                    formatShowDate(appointmentDetails.formatedDateString) }}
                            </p>
                        </div>
                        <div class="app-bar">
                            <p class="mb-0 text-center">
                                <VIcon icon="tabler-clock" /> &nbsp;{{ appointmentDetails.timeSlotFormatedString }}
                            </p>
                        </div>
                    </div>
                </div>
                <p class="mb-0 mt-3 text-body-2">
                    {{ $t(`If you have any questions or need further assistance please don't hesitate to contact us.We're here to help!`) }}
                </p>
                <p class="mb-2 mt-3 text-body-2">
                 {{ $t(`Telehealth instructions will be sent to you via email shortly.`) }} 
                </p>
                   
                <p class="mb-0 mt-3" style="font-weight: 600;">
                    {{ $t(`To confirm your appointment, simply click the 'Confirm' button below`) }}:</p>
            </div>
        </div>
        <VRow class="pt-4 pb-4">
            <VCol cols="6">
                <VBtn block @click="backFun" variant="outlined" class="text-capitalize" color="secondary"
                    :disabled="disableSubmit" rounded="lg">
                    {{ $t('Back') }}
                </VBtn>
            </VCol>
            <VCol cols="6">
                <VBtn block @click="confirmFun" class="text-capitalize text-white" :disabled="disableSubmit"
                    rounded="lg">
                    {{ $t('Confirm') }}
                </VBtn>
            </VCol>
        </VRow>

    </div>
</template>

<style lang="scss" scoped>
@use "@core/scss/template/pages/page-auth.scss";

.app-bars-container {
    display: flex;
    gap: 4px;
    /* Reduced gap between elements */
    justify-content: center;
    align-items: center;
}

.app-bar {
    background: #f3f3f3;
    border-radius: 10px;
    padding: 5px;
    text-align: left;
    margin: 0;
    /* Removed auto margin */
}

.app-text {
    color: #004600;
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
    .auth-card>>>div>.app-bar {
        width: 50%;
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
    .auth-card>>>div>.app-bar {
        width: 30%;
    }

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
