<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Patient Dashboard View',
  },
})
import { usePatientStore } from '@/stores/patientStore';
import { useUserStore } from '@/stores/userStore';
import Appointments from '@/views/apps/patient/Appointments/AppointmentsWithoutDrawer.vue';
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






</script>

<template>


  <Appointments :patient="patientStore.patient" />


</template>
<style>
.border-bottom-none {
  border-bottom: none !important;
}
</style>
