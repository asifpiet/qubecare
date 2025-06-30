<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Patient Dashboard View',
  },
})
import { usePatientStore } from '@/stores/patientStore';
import { useUserStore } from '@/stores/userStore';
import IntakeList from '@/views/apps/patient/Intake/IntakeListWithoutDrawer.vue';
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



  <IntakeList :getIntakeForms="intakeForms" :patient="patientStore.patient" />

</template>
<style>
.border-bottom-none {
  border-bottom: none !important;
}
</style>
