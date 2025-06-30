<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Affiliate Products View',
    },
})

import { usePatientRegStore } from '@/stores/patientRegStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import debounce from 'lodash.debounce';
// import PactitionerInfo from './components/provider-info.vue';
// import DateSelection from './date-selection.vue';
import { useBuilderStore } from '@/stores/builderStore';
import Confirmation from '@/views/register-flow/components/confirmation.vue';
import Steps from '@/views/register-flow/components/steps.vue';
import { useRoute, useRouter } from 'vue-router';
// import ReviewAppointment from './review-appointment.vue';
const { currentUser, currentRole, logout } = useAuth()
const route = useRoute();
const router = useRouter();
const patientRegStore = usePatientRegStore()
const builderStore = useBuilderStore()
const practitionerStore = usePractitionerStore()

const bid = atob(route.query.bid);
patientRegStore.patient.affiliate = route.query.af_ref ? atob(route.query.af_ref) : null
await builderStore.getUnauthBuilderById(bid)
console.log('builderStore.layout', builderStore.layout)
await patientRegStore.getProductByProviderId(builderStore.provider_id)

practitionerStore.getPractitionerInfoUnAuth(builderStore.provider_id)
console.log('>>', practitionerStore.practitioner)
if (localStorage.getItem('patientRegStore')) {
    let data = JSON.parse(atob(localStorage.getItem('patientRegStore')))
    console.log('data >>', data)
    patientRegStore.setState(data)
}


const doctorName = ref(null);
const doctorAvatar = ref(null);
const doctorSpecialty = ref('M.D.');
const lastName = ref(null)
const initials = ref(null)

const appointmentObject = builderStore.layout.find(object => object.title === 'Appointment');
patientRegStore.appointment.practitioner_fee = appointmentObject.config.practitioner_fee
const isMobile = ref(window.innerWidth <= 768);

const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};

onMounted(async () => {
    let practitionerDataApi = await $api(GET_PRACTITIONER_DATA_BY_UUID + '/' + appointmentObject.config.practitioners[0], {
        method: 'GET',
        onResponseError({ response }) {
            console.error('Error in practitioner API:', response);
        }
    });
    console.log('>>', practitionerDataApi.data)
    doctorAvatar.value = practitionerDataApi.data.profile_image_url ?? '/images/doctor.jpg'
    doctorName.value = practitionerDataApi.data.firstName + ' ' + practitionerDataApi.data.lastName
    lastName.value = practitionerDataApi.data.lastName
    initials.value = getInitials(doctorName.value)
    window.addEventListener('resize', checkIfMobile);
})

onUnmounted(() => {
    window.removeEventListener('resize', checkIfMobile);
});

const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word[0].toUpperCase())
        .join('');
}

const safeBtoa = (str) => {
    return btoa(unescape(encodeURIComponent(str)));
}

patientRegStore.$subscribe(debounce((mutation, state) => {

    localStorage.setItem('patientRegStore', safeBtoa(JSON.stringify(state)))

}))

</script>
<template>
    <div style="position: relative;">
        <Steps currentStep="Confirmation"></Steps>
    </div>
    <VContainer>
        <VRow style="" :style="isMobile ? { marginTop: '0px' } : { marginTop: '0px' }" class="">

            <VCol cols="12" md="12" :class="isMobile ? 'px-2' : 'pt-0'">
                <VContainer class="" style="height: 100%;" :class="isMobile ? 'px-0' : ''">
                    <VRow class="">
                        <!-- Main Card -->
                        <VCol cols="12" md="12" class="text-center">
                            <div>
                                <div class="success-icon">
                                    <span class="success-check custom-color">✓</span>
                                </div>
                                <h2 class="custom-color mb-2 mt-4">
                                    {{ $t('Your Appointment Has Been Successfully Scheduled') }}
                                </h2>
                                <p>{{ $t(`You're all set for your consultation with`) }}
                                    {{ $t('Dr. {doctorName}', { 'doctorName': doctorName }) }}.
                                    {{ $t('Check your email for appointment details.') }}
                                </p>
                            </div>
                        </VCol>

                        <VCol cols="12" md="12">
                            <div>
                                <Confirmation :data="appointmentObject" :doctorName="doctorName" :affiliate="true"></Confirmation>
                            </div>
                        </VCol>
                    </VRow>
                </VContainer>
            </VCol>
        </VRow>
    </VContainer>

</template>
<style scoped>
::v-deep(.progress-container){
    margin-bottom: 0px;
    padding-top: 0px;
}
.bg-custom {
    background: #f5fbf9;
}

.success-icon {
    width: 60px;
    height: 60px;
    background: #e9f5f2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    box-shadow: 0 10px 20px rgba(73, 163, 140, 0.2);
}

.success-check {
    font-size: 30px;
}

.visit-type {
    display: inline-block;
    padding: 8px 16px;
    background: #F3F4F6;
    border-radius: 20px;
    color: #6B7280;
    font-size: 14px;
}
</style>
