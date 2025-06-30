<script setup>
import { ref } from 'vue';
const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
})
const doctorName = ref(null);
const doctorSpecialty = ref('MD');
const lastName = ref(null)
const initials = ref(null)

const isMobile = ref(window.innerWidth <= 768);


const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};

onMounted(async () => {
    let practitionerDataApi = await $api(GET_PRACTITIONER_DATA_BY_UUID + '/' + props.data.config.practitioners[0], {
        method: 'GET',
        onResponseError({ response }) {
            console.error('Error in practitioner API:', response);
        }
    });
    console.log('>>', practitionerDataApi.data)
    doctorName.value = practitionerDataApi.data.firstName + ' ' + practitionerDataApi.data.lastName
    lastName.value = practitionerDataApi.data.lastName
    initials.value = getInitials(doctorName.value)
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
});

const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word[0].toUpperCase())
        .join('');
}
onUnmounted(() => {
    window.removeEventListener('resize', checkIfMobile);
});
</script>
<template>
    <v-card class="bg-transparent" :class="isMobile ? '' : 'auth-card pa-4'" color="transparent" elevation="0">
        <v-card-text class="text-center">
            <v-avatar color="#e0f2f1" size="120" class="mb-4">
                <span class="text-h5 text-green-darken-2"><img src="/images/doctor.jpg" style="width: 100%;"
                        alt="Doctor" /> </span>
            </v-avatar>
           
           
            <h2 class="text-h5 font-weight-bold mb-2"> {{ $t(' Dr. {doctorName}', { 'doctorName': doctorName }) }}, <span> {{ $t(' {doctorSpecialty}', { 'doctorSpecialty': doctorSpecialty }) }}</span></h2>
            <!-- <p class="text-body-1 mb-4">{{ doctorSpecialty }}</p> -->
            <p class="text-body-2 text-grey-darken-1">
                {{ $t(' Dr. {doctorName}', { 'doctorName': doctorName }) }} {{ $t(`is a dedicated medical professional with
                extensive experience in`)}} {{ $t(' {doctorSpecialty}', { 'doctorSpecialty': doctorSpecialty }) }}. {{ $t(`Known for his patient-
                centered approach, he strives to provide personalized care and
                ensure the best outcomes for his patients.`)}} {{ $t(' {lastName}', { 'lastName': lastName }) }}  {{ $t(`stays at the
                forefront of medical advancements to offer the highest quality
                treatment.`)}}
                
            </p>
        </v-card-text>
    </v-card>
</template>



<style scoped>
.v-card {
    background-color: #f3f3f3 !important;
}
</style>
