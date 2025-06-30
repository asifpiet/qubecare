<script setup>
import AiAssistance from '@/views/apps/patient/AiAssistance/AiAssistance.vue';
import Appointments from '@/views/apps/patient/Appointments/Appointments.vue';
import ConsentForm from '@/views/apps/patient/ConsentForm/ConsentForm.vue';
import IntakeList from '@/views/apps/patient/Intake/IntakeList.vue';
import LabDiagnostics from '@/views/apps/patient/LabDiabnostics/LabDiabnostics.vue';
import AddPayment from '@/views/apps/patient/Payments/AddPayment.vue';
import Questioner from '@/views/apps/patient/Questioner/index.vue';
import SubmitIntakes from '@/views/apps/patient/SubmitIntakes/SubmitIntakes.vue';
import Document from '@/views/apps/patient/document/document.vue';
import MedSupplement from '@/views/apps/patient/list/EditMedAndSupplment.vue';
import LabOrders from '@/views/apps/patient/LabOrders/LabOrders.vue';
import EmailLog from '@/views/apps/patient/list/EmailLog.vue';
import MessageList from '@/views/apps/patient/list/MessageListPatient.vue';
import PhoneLog from '@/views/apps/patient/list/PhoneLog.vue';
import TextMessage from '@/views/apps/patient/list/TextMessage.vue';
// import MedSupplement from '@/views/provider/patients/MedSupplement/EditMedAndSupplment.vue';
// import Tasks from '@/views/apps/patient/list/tasks.vue';
import Vitals from '@/views/apps/patient/list/vitals.vue';
import Tasks from '@/views/provider/patients/tasks/actionTask.vue';
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import actionButtons from './actions/actionButtons.vue';
const props = defineProps({
  patient: {
    type: Object,
    default: {}
  },
  showDialog: {
    type: Boolean,
    default: false
  },
  showGrid: {
    type: Boolean,
    default: false
  },
  grid: {
    type: Number,
    default: 4
  },
  secondGrid: {
    type: Number,
    default: 6
  },
})
const emit = defineEmits([
  'update:showDialog',
])
const store = useStore()
const currentTab = ref('window1')
const router = useRouter();
const route = useRoute()
const patientId = ref()
const currentPath = route.path;
const showDrawer = ref('')
const isDrawerOpen = ref(false)
const onDialogBtnClick = (actionName) => {
  showDrawer.value = actionName;
  isDrawerOpen.value = true;
  closeDialog()
};
const closeDialog = () => {
  emit('update:showDialog', false)
};
watch(() => isDrawerOpen.value,
  (value) => {
    if (!value) {
      showDrawer.value = ''
    }
  }
)


console.log('props.patient.id', props.patient)
</script>
<template>
  <VDialog v-model="props.showDialog" width="800">
    <DialogCloseBtn @click="closeDialog()" />
    <actionButtons @onDialogBtnClick="onDialogBtnClick" :patient="props.patient"  :grid="props.grid"/>
  </VDialog>
  <actionButtons @onDialogBtnClick="onDialogBtnClick" :patient="props.patient" v-if="props.showGrid" :grid="props.grid" />
  <teleport to="body">
    <TextMessage v-model:isDrawerOpen="isDrawerOpen" v-if="showDrawer == 'TextMessage'" :patient="props.patient" />
    <PhoneLog v-model:isDrawerOpen="isDrawerOpen" v-if="showDrawer == 'PhoneLog'" :patient="props.patient" />
    <MessageList v-model:isDrawerOpen="isDrawerOpen" v-if="showDrawer == 'MessageList'" :patient="props.patient" />
    <EmailLog v-model:isDrawerOpen="isDrawerOpen" v-if="showDrawer == 'EmailLog'" :patient="props.patient" />
    <MedSupplement v-model:isDrawerOpen="isDrawerOpen" v-if="showDrawer == 'MedSupplement'" :patient="props.patient" />
    <LabOrders v-model:isDrawerOpen="isDrawerOpen" v-if="showDrawer == 'LabOrders'" :patient="props.patient" />

    <LabDiagnostics v-model:isDrawerOpen="isDrawerOpen" v-if="showDrawer == 'LabDiagnostics'"
      :patient="props.patient" />
    <SubmitIntakes v-model:isDrawerOpen="isDrawerOpen" v-if="showDrawer == 'SubmitIntakes'" :patient="props.patient" />
    <AiAssistance v-model:isDrawerOpen="isDrawerOpen" v-if="showDrawer == 'AiAssistance'" :patient="props.patient" />
    <Tasks v-model:isDrawerOpen="isDrawerOpen" v-if="showDrawer == 'Tasks'" :patient="props.patient" />
    <Vitals v-model:isDrawerOpen="isDrawerOpen" v-if="showDrawer == 'Vitals'" :patient="props.patient" />
    <Document v-model:isDrawerOpen="isDrawerOpen" v-if="showDrawer == 'Document'" :patient="props.patient" />
    <Appointments v-model:isDrawerOpen="isDrawerOpen" v-if="showDrawer == 'Appointments'" :patient="props.patient" />

    <AddPayment v-model:isDrawerOpen="isDrawerOpen" v-if="showDrawer == 'AddPayment'" :patient="props.patient" />
    <IntakeList v-model:isDrawerOpen="isDrawerOpen" v-if="showDrawer == 'IntakeList'" :getIntakeForms="intakeForms"
      :patient="props.patient" />
    <Questioner v-model:isDrawerOpen="isDrawerOpen" v-if="showDrawer == 'Questioner'" :patient="props.patient" />
    <ConsentForm v-model:isDrawerOpen="isDrawerOpen" v-if="showDrawer == 'ConsentForm'" :patient="props.patient" />
  </teleport>
</template>
