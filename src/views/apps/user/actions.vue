<script setup>
import { MEET_APPOINTMENT_URL } from '@/utils/constants';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';


const props = defineProps({
  grid: {
    type: Number,
    default:4
  },
  secondGrid: {
    type: Number,
    default:6
  },
  selectedPatient: {
    type: Object,
    default: null
  }
})
const store = useStore()
const currentTab = ref('window1')
const router = useRouter();
const route = useRoute()
const patientId = ref()
const currentPath = route.path;
const tabItemContent = 'Candy canes donut chupa chups candy canes lemon drops oat cake wafer. Cotton candy candy canes marzipan carrot cake. Sesame snaps lemon drops candy marzipan donut brownie tootsie roll. Icing croissant bonbon biscuit gummi bears. Pudding candy canes sugar plum cookie chocolate cake powder croissant.'
const emit = defineEmits([
  'update:isDrawerOpen',
 'openTextMessage',
  'openTaskDrawn',
  'openVitalDrawn',
  "openPhoneLog",
  "drawanOpenMessageList",
  'openLabDiagnosticsDrawn',
  'openSubmitIntakesDrawn',
  'openAppointmentsDrawn',
  'openAddPaymentDrawn',
  'openEmailDrawn',
  'openDocumentDrawn',
  'openIntakeDrawn',
  'openQuestionerDrawn',
  'openConsentFormDrawn',
  'openAiAssistance'
])

const aiAssistance = () => {
  console.log('openAiAssistance')
    emit('openAiAssistance', true);
}
const TextMessage = () => {
    emit('openTextMessage', true);
}
const phoneLog = () => {
    emit('openPhoneLog', true);
}
const openEmailDialog = () => {
    emit('openEmailDrawn', true);
}
const messageList = () => {
    emit('drawanOpenMessageList', true);
}
const taskDrawan = () => {
    emit('openTaskDrawn', true);
};  
const vitals = () => {
    emit('openVitalDrawn', true);
}; 

const labDiagnostics = () => {
    emit('openLabDiagnosticsDrawn', true);
};

const submitIntakes = () => {
    emit('openSubmitIntakesDrawn', true);
};
const DocumentDrawan = () => {
    emit('openDocumentDrawn', true);
};


const appointments = () => {
    emit('openAppointmentsDrawn', true);
};

const addpayment = () => {
    emit('openAddPaymentDrawn', true);
};

const intake = () => {
    emit('openIntakeDrawn', true);
};

const questioner = () => {
    emit('openQuestionerDrawn', true);
};

const consentForm = () => {
    emit('openConsentFormDrawn', true);
};

const openVideoChat = () => {
    window.open(MEET_APPOINTMENT_URL+store.getters.getPatientPorfile.patientId, '_blank').focus();
};

const goToClinical = (type, id) => {  
  if (type == 'new-initial-consult') {
    const url = router.resolve({ name:'admin-clinical-new-initial-consult', params: {type, id } }).href;
    window.open(url, '_blank'); 
  }
  if (type == 'new-follow-up') {
    const url = router.resolve({ name:'admin-clinical-new-follow-up', params: {type, id } }).href;
    window.open(url, '_blank'); 
  }
  if (type == 'new-basic-notes') {
    const url = router.resolve({ name:'admin-clinical-new-basic-notes', params: {type, id } }).href;
    window.open(url, '_blank'); 
}
      // Navigate to the route with specified parameters  
        
     
      // Open the constructed URL in a new tab  
     
      
}; 
    
const patientData = computed(()=>{
    patientId.value = props.selectedPatient.uuid;
    console.log("zzz",props.selectedPatient)
});

const getLgValue = () => {
      // Check if the current path is 'app/call'
      return currentPath === '/apps/call' ? 6 : 4; // Adjust lg value as needed
    }
</script>
<template>  
  <div v-if="patientData"></div>  
  <VTabs v-model="currentTab" class="v-tabs-pill">  
    <VTab>Admin</VTab>  
    <VTab>Clinical</VTab>  
    <VTab>Point of Sales</VTab>  
  </VTabs>  
  <VDivider class="mt-3" />  

  <VCardText>  
    <VWindow v-model="currentTab">  
      <VWindowItem key="0">  
        <VRow>  
          <VCol cols="12" :lg=props.grid md="4" sm="6">  
            <RouterLink v-if="patientId"  :to="{ name: 'apps-patient-view-id', params: { id: patientId } }" class="font-weight-medium text-link">  
              <VBtn variant="outlined" class="w-100"  v-if="$can('read', 'Patient Dashboard View')"  >Dashboard</VBtn>  
            </RouterLink>  
          </VCol>  
          <VCol cols="12" :lg=props.grid  md="4" sm="6">  
            <VBtn variant="outlined" class="w-100" @click="openEmailDialog"  v-if="$can('read', 'Email View')">Email</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.grid  md="4" sm="6">  
            <VBtn variant="outlined" class="w-100" @click="phoneLog" v-if="$can('read', 'Phone Log View')">Phone Log</VBtn>  
          </VCol>  

          <VCol cols="12" :lg=props.grid md="4" sm="6">  
            <VBtn variant="outlined" class="w-100" @click="taskDrawan" v-if="$can('read', 'Tasks View')">Task</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.grid md="4" sm="6">  
            <VBtn variant="outlined" class="w-100" @click="DocumentDrawan" v-if="$can('read', 'Documents View')">Documents</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.grid md="4" sm="6">  
            <VBtn variant="outlined" class="w-100" @click="intake" v-if="$can('read', 'Intake Questions View')">Intake</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.grid md="4" sm="6">  
            <VBtn variant="outlined" class="w-100" @click="consentForm" v-if="$can('read', 'Consent View')">Consent</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.grid md="4" sm="6">  
            <VBtn variant="outlined" class="w-100" @click="vitals" v-if="$can('read', 'Vitals View')">Vitals</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.grid md="4" sm="6">  
            <VBtn variant="outlined" class="w-100" @click="messageList"  v-if="$can('read', 'Messages View')">Messages</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.grid md="4"  sm="6" style="display: none;"  >
            <VBtn variant="outlined" class="w-100" @click="TextMessage">Text Message</VBtn>  
          </VCol> 
          <VCol cols="12" :lg=props.grid md="4"  sm="6">
            <VBtn variant="outlined" class="w-100" @click="aiAssistance" v-if="currentPath === '/apps/call'">AI Help</VBtn>  
          </VCol>  
        </VRow>  
      </VWindowItem>  
      
      <VWindowItem key="1">  
        <VRow>  
          <VCol cols="12" :lg=props.secondGrid md="6"  sm="6">  
            <VBtn variant="outlined" class="w-100" @click="goToClinical('new-initial-consult', patientId)" v-if="$can('read', 'New Initial Consult View')">New Initial Consult</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.secondGrid md="6"  sm="6">  
            <VBtn variant="outlined" class="w-100" @click="goToClinical('new-follow-up', patientId)" v-if="$can('read', 'New Follow Up')">New Follow Up</VBtn>  
          </VCol>  

          <VCol cols="12" :lg=props.secondGrid md="6"  sm="6">  
            <VBtn variant="outlined" class="w-100" @click="goToClinical('new-basic-notes', patientId)" v-if="$can('read', 'Basic Note View')" >New Basic Note</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.secondGrid md="6"  sm="6">  
            <VBtn variant="outlined" class="w-100" disabled>Charting History</VBtn>  
          </VCol>  

          <VCol cols="12" :lg=props.secondGrid md="6"  sm="6">  
            <VBtn variant="outlined" class="w-100" @click="labDiagnostics" disabled>Lab/Diagnostics</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.secondGrid md="6"  sm="6">  
            <VBtn variant="outlined" class="w-100" disabled>Custom Formulations</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.secondGrid md="6"  sm="6">  
            <VBtn variant="outlined" class="w-100" @click="submitIntakes" v-if="$can('read', 'Intake Questions View')">Submitted Intakes</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.secondGrid md="6"  sm="6">  
            <VBtn variant="outlined" class="w-100" disabled>Sent Records</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.secondGrid md="6"  sm="6">  
            <VBtn variant="outlined" class="w-100" @click="questioner" v-if="$can('read', 'Questionnaire View')">Questionnaire</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.secondGrid md="6"  sm="6">  
            <VBtn variant="outlined" class="w-100" disabled>eRx</VBtn>  
          </VCol>  
        </VRow>  
      </VWindowItem>  
      
      <VWindowItem key="2">  
        <VRow>  
          <VCol cols="12" :lg=props.secondGrid md="6"  sm="6" >  
            <VBtn variant="outlined" class="w-100" disabled>Supperbill</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.secondGrid md="6"  sm="6">  
            <VBtn variant="outlined" class="w-100" @click="addpayment" v-if="$can('read', 'Card Payment View')" >Take Card Payment</VBtn>  
          </VCol>  

          <VCol cols="12" :lg=props.secondGrid md="6"  sm="6">  
            <VBtn variant="outlined" class="w-100" disabled>Form1500</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.secondGrid md="6"  sm="6">  
            <VBtn variant="outlined" class="w-100" disabled>Full Script</VBtn>  
          </VCol>  

          <VCol cols="12" :lg=props.secondGrid md="6"  sm="6">  
            <VBtn variant="outlined" class="w-100" disabled>Recommendations</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.secondGrid md="6"  sm="6">  
            <VBtn variant="outlined" class="w-100" disabled>Check Balance</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.secondGrid md="6"  sm="6">  
            <VBtn variant="outlined" class="w-100" @click="appointments" v-if="$can('read', 'Appointments View')">Appointments</VBtn>  
          </VCol>  
          <VCol cols="12" :lg=props.secondGrid md="6"  sm="6">  
            <VBtn variant="outlined" class="w-100" @click="openVideoChat" v-if="$can('read', 'Video Chat')">Video Chat</VBtn>  
          </VCol>  
        </VRow>  
      </VWindowItem>  
    </VWindow>  
  </VCardText>  
</template>
