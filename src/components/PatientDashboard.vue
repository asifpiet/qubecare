<script setup>

import { usePatientStore } from '@/stores/patientStore';
import LabResult from '@/views/apps/patient/Dashboard/LabResult/LabResult.vue';
import ClinicalProfile from '@/views/provider/patients/clinicalProfile/clinicalProfile.vue';
import HealthAndMaintance from '@/views/provider/patients/HealthAndMaintance/HealthAndMaintance.vue';
import MedSupplement from '@/views/provider/patients/MedSupplement/MedSupplement.vue';
import PatientHistory from '@/views/provider/patients/PatientHistory.vue';
import TasksOrders from '@/views/provider/patients/tasks/list.vue';
import UserBioPanel from '@/views/provider/patients/UserBioPanel.vue';

const props = defineProps({
  appointment: {
    type: String,
    required: true,
  },
})
const patientStore = usePatientStore()
//patientStore.unloadPatient()
const route = useRoute()
const patientId = props.appointment.patient_id;
const userTab = ref(null)
const isLoading = ref(null)
const tabs = [
  {
    icon: 'tabler-lock',
    title: 'All Meds/Supplements',
    action: 'read',
    subject: 'All Meds/Supplements View',
  },
  {
    icon: 'tabler-users',
    title: 'Health Maintenance',
    action: 'read',
    subject: 'Health And Maintenance View',

  },
  {
    icon: 'tabler-bell',
    title: 'Clinical Profile',
    action: 'read',
    subject: 'General',

  },
  {
    icon: 'tabler-users',
    title: 'Tasks/Orders',
    action: 'read',
    subject: 'Tasks View',
  }
]
patientStore.loadPatient(patientId);
</script>

<template>
  <div>
    <VDialog v-model="isLoading" width="110" height="150" color="primary">
      <VCardText class="" style="color: white !important;">
        <div class="demo-space-x">
          <VProgressCircular :size="40" color="primary" indeterminate />
        </div>
      </VCardText>
    </VDialog>
    <VRow>
      <VCol cols="12" md="5" lg="4">
        <UserBioPanel :patient="patientStore.patient" v-if="patientStore.id" />
      </VCol>
      <VCol cols="12" md="7" lg="8" v-if="patientStore.id">
        <VTabs v-model="userTab" class="v-tabs-pill">
          <VTab v-for="tab in tabs" :key="tab.icon">
            <VIcon :size="18" :icon="tab.icon" class="me-1" v-if="$can(tab.action, tab.subject)" />
            <span v-if="$can(tab.action, tab.subject)">{{ tab.title }}</span>
          </VTab>
        </VTabs>

        <VWindow v-model="userTab" class="mt-6 disable-tab-transition" :touch="false">
          <VWindowItem>
            <MedSupplement class="pt-3" :patient="patientStore.patient" v-if="patientStore.id" />
          </VWindowItem>
          <VWindowItem>
            <HealthAndMaintance :patient="patientStore.patient" v-if="patientStore.id" />
          </VWindowItem>
          <VWindowItem>
            <ClinicalProfile :patient="patientStore.patient" v-if="patientStore.id" />
          </VWindowItem>
          <VWindowItem>
            <TasksOrders :patient="patientStore.patient" v-if="patientStore.id" />
          </VWindowItem>



          <VWindowItem>
            <LabResult class="pt-3" />
          </VWindowItem>

        </VWindow>
      </VCol>
      <VCol cols="12">
        <PatientHistory class="pt-3" />

      </VCol>
    </VRow>

  </div>
</template>
