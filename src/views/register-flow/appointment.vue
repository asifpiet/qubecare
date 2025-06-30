<script setup>
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})

import { usePatientRegStore } from '@/stores/patientRegStore';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
// import PactitionerInfo from './components/provider-info.vue';
// import DateSelection from './date-selection.vue';
import DateCalendar from './date-calendar.vue';
import ReviewAppointment from './review-appointment.vue';

const patientRegStore = usePatientRegStore()
const emit = defineEmits(['completed']);

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
})

const doctorName = ref('null');
const doctorAvatar = ref(null);
const doctorSpecialty = ref('M.D.');
const lastName = ref(null)
const initials = ref(null)
const state = ref('date-selection')
provide('appointment-state', state)
patientRegStore.appointment.practitioner_fee = props.data.config.practitioner_fee
const isMobile = ref(window.innerWidth <= 768);

const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};

onMounted(async () => {
    const dr_name = ref('Asif');
    let practitionerDataApi = await $api(GET_PRACTITIONER_DATA_BY_UUID + '/' + props.data.config.practitioners[0], {
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
</script>
<template>
    <div class="text-center"
        style="padding: 15px 10px 10px 10px; border-bottom: 1px solid #c0c0c0b0;position: fixed; width: 100%; z-index: 1004;background: white;">
        <VNodeRenderer :nodes="themeConfig.app.logo" />
    </div>
    <VRow style="min-height: 100dvh; margin: 0px; position: relative;top: 60px;"
        :style="isMobile ? { marginTop: '0px' } : { marginTop: '0px' }"
        class="bg-custom d-flex align-center justify-center">

        <VCol cols="12" :class="isMobile ? 'px-2' : 'px-8 py-8 pt-0'">
            <VContainer class="d-flex align-center justify-center" style="height: 100%;">
                <VRow class="d-flex align-center justify-center">
                    <!-- Main Card -->
                    <VCol cols="12" :md="state === 'review-appointment' ? 6 : 12" class="col-order-1"
                        :class="isMobile ? '' : 'align-center justify-center pa-4'"
                        style="margin: auto; background-color: white !important;" :style="{
                            maxWidth: state === 'review-appointment' ? '800px' : state === 'date-selection' ? '1100px' : ''
                        }">
                        <h3 class="mb-1" v-if="state === 'date-selection'">{{ $t('Schedule your Appointment') }}</h3>
                        <VDivider class="mb-4" v-if="state === 'date-selection'"></VDivider>
                        <div :class="[
                            state === 'date-selection' ? 'd-flex gap-2 mb-2' : '',
                            state === 'review-appointment' ? 'text-center px-5' : ''
                        ]" :style="state === 'date-selection' ? 'border: 1px solid #e3e3e3; border-radius: 5px; padding: 10px;' : ''"
                            v-if="state === 'date-selection' || state === 'review-appointment'">

                            <div :style="{ width: state === 'date-selection' ? '120px' : 'auto' }">
                                <div class="text-center" :class="[
                                    state === 'date-selection' ? '' : '',
                                    state === 'review-appointment' ? 'mb-4' : ''
                                ]">
                                    <VAvatar rounded :size="state === 'review-appointment' ? '120' : '60'"
                                        :image="doctorAvatar" />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <h4 class="font-weight-bold" :class="{ 'mb-2': state === 'review-appointment' }">
                                        {{ $t('Dr. {doctorName}', { 'doctorName': doctorName }) }}, <span> {{ $t(' {doctorSpecialty}', { 'doctorSpecialty': doctorSpecialty }) }} </span>
                                    </h4>
                                    <!-- <p class="text-body-2 text-grey-darken-1">
                                        {{ $t('Dr. {doctorName}', { 'doctorName': doctorName }) }}
                                        {{ $t(`is a dedicated medical professional with extensive experience in`)}}
                                        {{ $t(' {doctorSpecialty}', { 'doctorSpecialty': doctorSpecialty }) }}
                                         {{ $t(`Known for his patient-centered approach, he strives to provide personalized care`)}}
                                         {{ $t('ensure the best outcomes for his patients.')}} 
                                        
                                        {{ $t('Dr. {lastName}', { 'lastName': lastName }) }}  
                                        {{ $t(`stays at the forefront of medical advancements to offer the highest quality treatment.`)}}
                                    </p> -->
                                    <p class="text-body-2 text-grey-darken-1">
                                        {{ $t('Dr. {doctorName}', {
                                            'doctorName': doctorName
                                        }) }}
                                        {{ $t('is a dedicated medical professional with extensive experience in medicine. Known for his patient-centered approach, he strives to provide personalized care and ensure the best outcomes for his patients.') }}
                                        {{ $t('Dr. {lastName}', {
                                            'lastName': lastName
                                        }) }}
                                        {{ $t('stays at the forefront of medical advancements to offer the highest quality treatment.') }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <VDivider class="mb-4 mt-4" v-if="state === 'date-selection'"></VDivider>
                        <div style="border: 1px solid #e3e3e3; border-radius: 5px;" v-if="state === 'date-selection'">
                            <DateCalendar :data="props.data"></DateCalendar>
                        </div>
                        <ReviewAppointment v-if="state === 'review-appointment'" :data="props.data"
                            @completed="emit('completed')">
                        </ReviewAppointment>

                    </VCol>
                </VRow>
            </VContainer>
        </VCol>
    </VRow>

</template>
