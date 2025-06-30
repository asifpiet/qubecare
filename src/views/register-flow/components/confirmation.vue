<script setup>
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})
import { usePatientRegStore } from '@/stores/patientRegStore';
import moment from "moment";
import { onBeforeMount, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const emit = defineEmits(['completed']);
const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    doctorName: {
        type: String,
        required: false
    },
    affiliate: {
        type: Boolean,
        required: false
    }
})


const patientRegStore = usePatientRegStore()
const visibility = ref('hidden')
const companyEmail = import.meta.env.VITE_COMPANY_EMAIL ?? 'support@peptidewebmd.com';
const scheduleDate = ref("");
const scheduleTime = ref("");
const isTimeSlot = ref("");
const timeZone = ref("");
const timeDifference = ref();

const appointmentDetails = patientRegStore.appointment
const disableSubmit = ref(false)
const isMobile = ref(window.innerWidth <= 768);

if (localStorage.getItem('patientRegStore')) {
    let data = JSON.parse(atob(localStorage.getItem('patientRegStore')))
    console.log('data >>', data)
    patientRegStore.setState(data)
}

const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};
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
    window.addEventListener('resize', checkIfMobile);
    visibility.value = 'unset'
});



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
    localStorage.removeItem('patientRegStore')
    if(props.affiliate)
        router.replace('/affiliate/products');
    else
        router.replace('/patient/dashboard');
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
        :class="isMobile ? 'px-0' : ''">
        <div class="text-center">
            <div class="v-col v-col-12 w-100 pb-0 text-center">
                <div class="text-center">
                    <div class="" :class="isMobile ? '' : 'app-bars-container'">
                        <div class=" px-4 py-4 info-bar" :class="isMobile ? 'app-bar-detail mb-2' : 'app-bar'">
                            <h4 class="custom-color mb-4" style="font-weight: 500;font-size: 16px;">{{ $t('Appointment Details') }}
                            </h4>
                            <p class="d-flex justify-content-between">
                                <span><b>{{ $t('Date') }}:</b></span>
                                <span class="ml-auto">{{ formatShowDate(appointmentDetails.formatedDateString) }}</span>
                            </p>
                            <p class="d-flex justify-content-between">
                                <span><b>{{ $t('Time') }}:</b></span>
                                <span class="ml-auto">{{ appointmentDetails.timeSlotFormatedString }} &nbsp; {{
                                    appointmentDetails.timezone }}</span>
                            </p>
                            <p class="d-flex justify-content-between">
                                <span><b>{{ $t('Doctor') }}:</b></span>
                                <span class="ml-auto">Dr. {{ props.doctorName }}</span>
                            </p>
                            <p class="d-flex justify-content-between">
                                <span><b>{{ $t('Location') }}:</b></span>
                                <span class="ml-auto">{{ $t('Virtual') }}</span>
                            </p>
                            <p class="d-flex justify-content-between">
                                <span><b>{{ $t('Duration') }}:</b></span>
                                <span class="ml-auto">{{ $t('30 minutes') }}</span>
                            </p>
                        </div>
                        <div class="px-4 py-4 info-bar" :class="isMobile ? 'app-bar-detail mb-2' : 'app-bar'">
                            <h4 class="custom-color mb-4" style="font-weight: 500;font-size: 16px;">{{ $t('What to Expect') }}</h4>
                            <p> {{ $t('Dr. {doctorName}', { 'doctorName': props.doctorName }) }}, 
                                {{ $t(`will review your health history before your call to ensure a personalized treatment plan.`)}}
                                
                            </p>
                            <ul class="instruction-list">
                                <li>{{ $t('The consultation will take place via a secure telehealth platform') }}</li>
                                <li>{{ $t('Ensure a quiet, well-lit space for your call') }}</li>
                                <li>{{ $t('Have medical history and prescriptions ready for discussion') }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <VContainer :class="isMobile ? 'px-0' : ''">
            <div class="text-center">
                <div class="v-col v-col-12 w-100 pb-0 text-center">
                    <div class="text-center">
                        <div :class="isMobile ? '' : 'app-bars-container'">
                            <div :class="isMobile ? 'app-bar-btn mb-2' : 'app-bar-btn'">
                                <VBtn block @click="confirmFun" class="text-capitalize text-white"
                                    :disabled="disableSubmit" size="large">
                                    {{ $t('Proceed') }}
                                </VBtn>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <VRow>
                <VCol cols="12" md="12" class="text-center">
                    <p class="mt-6">{{ $t('Need assistance? Contact') }} <a class="custom-color" :href="`mailto:${companyEmail}`">
                        {{ companyEmail }}</a> {{ $t('or start a live chat.') }}</p>
                </VCol>

            </VRow>
            <VDivider class="mt-4 mb-4"></VDivider>
            <div class="trust-badges">
                <div class="badge">
                    <div class="badge-icon custom-color">✓</div>
                    <span>{{ $t('HIPAA-compliant') }}</span>
                </div>
                <div class="badge">
                    <div class="badge-icon custom-color">✓</div>
                    <span>{{ $t('Secure Telehealth Platform') }}</span>
                </div>
                <div class="badge">
                    <div class="badge-icon custom-color">✓</div>
                    <span>{{ $t('FDA Registered Practice') }}</span>
                </div>
            </div>
        </VContainer>

    </div>
</template>

<style lang="scss" scoped>
@use "@core/scss/template/pages/page-auth.scss";

.info-bar {
    min-height: 300px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Trust Badges */
.trust-badges {
    display: flex;
    justify-content: center;
    gap: 40px;
}

.badge {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #666;
    font-size: 13px;
}

.badge-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
}

@media (max-width: 768px) {

    .trust-badges {
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }
}

.instruction-list {
    list-style: none;
    font-size: 14px;
}

.instruction-list li {
    margin-bottom: 8px;
    color: #666;
    position: relative;
    padding-left: 16px;
}

.instruction-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #00BFB3;
}

.app-bars-container {
    display: flex;
    gap: 4px;
    /* Reduced gap between elements */
    justify-content: center;
    align-items: center;
}

.app-bar {
    border-radius: 10px;
    padding: 5px;
    text-align: left;
    margin: 0;
    /* Removed auto margin */
}

.app-bar-btn {
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
    .auth-card>>>div>.app-bar-detail {
        width: 100%;
    }

    .auth-card>>>div>.app-bar {
        width: 50%;
    }

    .auth-card>>>div>.app-bar-btn {
        width: 100%;
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
    .auth-card>>>div>.app-bar-btn {
        width: 25%;
    }

    .auth-card>>>div>.app-bar {
        width: 35%;
    }

    .auth-card>>>div>.app-bar-detail {
        width: 100%;
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
