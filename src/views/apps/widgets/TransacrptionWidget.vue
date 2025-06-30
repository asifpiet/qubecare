<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Patient Dashboard View',
  },
})
import { usePatientStore } from '@/stores/patientStore';
import { useUserStore } from '@/stores/userStore';
import Transcrptions from '@/views/provider/patients/Transcrptions.vue';
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
console.log('dsdsssds', patientId)






</script>

<template>
  <div>



    <Transcrptions :patient="patientStore.patient" :patientId="props.patientId" v-if="patientStore.id" />
  </div>
</template>
<style>
.border-bottom-none {
  border-bottom: none !important;
}
</style>
