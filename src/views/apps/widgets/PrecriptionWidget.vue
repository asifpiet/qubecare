<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Patient Dashboard View',
  },
})
import { usePatientStore } from '@/stores/patientStore';
import { useUserStore } from '@/stores/userStore';
import EditMedSupplement from '@/views/provider/patients/MedSupplement/EditMedAndSupplment.vue';
const patientStore = usePatientStore()
//patientStore.unloadPatient()
const route = useRoute()
const userStore = useUserStore()

const userTab = ref(null)
const name = ref(null);
const data = ref({});
const isLoading = ref(null)
const props = defineProps({
  widgetData: {
    type: Object,
    required: true,
  },
  patientId: {
    type: Number,
    required: false,
  }
})
const patientId = props.patientId;
console.log(patientId)
// onMounted(async () => {
//   if (props.patientId) {
//     const patientId = props.patientId

//     await patientStore.loadPatient(patientId);
//     await patientStore.getLastRecentAppointment(patientId);
//     await userStore.getUserByID(patientStore.demographic.primaryPractitioner)

//     name.value = userStore.user?.firstName + ' ' + userStore.user?.lastName;
//     let appId = patientStore.lastRecentAppointments?.next_upcoming_appointment?.id;

//     console.log('sd', name.value, appId);
//     data.value = {
//       'patient_id': patientId, // Use .value to access the ref's value
//       'practitioner': name.value,
//       'id': appId,
//     };

//   }
// })


let style = 'margin-top:0px;'


</script>

<template>
  <div>



    <EditMedSupplement :style="style" :patient="patientStore.patient" v-if="patientStore.id" />

  </div>
</template>
<style>
.border-bottom-none {
  border-bottom: none !important;
}
</style>
