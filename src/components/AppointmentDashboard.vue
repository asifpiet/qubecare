<script setup>

import { usePatientStore } from '@/stores/patientStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import LabResult from '@/views/apps/patient/Dashboard/LabResult/LabResult.vue';
import ClinicalProfile from '@/views/provider/patients/clinicalProfile/clinicalProfile.vue';
import Demographics from '@/views/provider/patients/Demographics/Demographics.vue';
import Documents from '@/views/provider/patients/Documents/Documents.vue';
import HealthAndMaintance from '@/views/provider/patients/HealthAndMaintance/HealthAndMaintance.vue';
// import MedSupplement from '@/views/provider/patients/MedSupplement/MedSupplement.vue';
import EditMedSupplement from '@/views/provider/patients/MedSupplement/EditMedAndSupplment.vue';
import TasksOrders from '@/views/provider/patients/tasks/list.vue';
import { useI18n } from 'vue-i18n';
import AppointmentDrawer from './AppointmentDrawer.vue';
const route = useRoute()
const patientStore = usePatientStore()
const practitionerStore = usePractitionerStore()
const router = useRouter()
const currentPath = route.path;
const { t } = useI18n();
const props = defineProps({
  appointment: {
    type: String,
    required: true,
  },
})

watch(
  () => props.appointment,
  async (newAppointment) => {
    console.log('dashboard-cloass', newAppointment);
    if (newAppointment) {
      await patientStore.getLastRecentAppointment(newAppointment.patient_id);

    }
  },
  { immediate: true } // Runs immediately when the component is mounted
);

// patientStore.unloadPatient()

const patientId = props.appointment?.patient_id;
const userTab = ref(null)
const isLoading = ref(null)
// console.log("propsAppointment",patientId);
const tabs = [
  // {
  //     icon: 'tabler-bubble-text',
  //     title: 'Transcript',
  //     action: 'read',
  //     subject: 'All Meds/Supplements View',
  // },
  // {
  //     icon: 'tabler-clipboard-text',
  //     title: 'Summary',
  //     action: 'read',
  //     subject: 'All Meds/Supplements View',
  // },
  {
    icon: 'tabler-pill',
    title: 'Prescriptions',
    action: 'read',
    subject: 'All Meds/Supplements View',
  },
  {
    icon: 'tabler-file-info',
    title: 'Demographics',
    action: 'read',
    subject: 'All Meds/Supplements View',
  },
  // {
  //     icon: 'tabler-file-info',
  //     title: 'Demographics',
  //     action: 'read',
  //     subject: 'All Meds/Supplements View',
  // },

  {
    icon: 'tabler-file-type-doc',
    title: 'Patient Documents',
    action: 'read',
    subject: 'All Meds/Supplements View',
  },

  {
    icon: 'tabler-heart-rate-monitor',
    title: 'Health Maintenance',
    action: 'read',
    subject: 'Health And Maintenance View',

  },
  {
    icon: 'tabler-hospital-circle',
    title: 'Clinical Profile',
    action: 'read',
    subject: 'General',

  },
  {
    icon: 'tabler-stack-forward',
    title: 'Tasks/Orders',
    action: 'read',
    subject: 'Tasks View',
  }
]


const translatedHeaders = computed(() => {
  return tabs.map(header => ({
    ...header,
    title: t(header.title)
  }));
});

const goToCallPage = () => {

  router.replace('/provider/call/' + props.appointment.patient_id + '/' + props.appointment.id)
};

</script>

<template>
  <div>
    <VDialog v-model="isLoading" width="110" height="150" color="primary">
      <VCardText style="color: white !important;">
        <div class="demo-space-x">
          <VProgressCircular :size="40" color="primary" indeterminate />
        </div>
      </VCardText>
    </VDialog>

    <VRow v-if="(patientStore.id &&
      practitionerStore.upcomingAppointments.length > 0 &&
      currentPath == '/provider/calendar') ||
      (patientStore.id && currentPath == '/provider/patients/dashboards/' + patientStore.id)">
      <VCol cols="12" :md="practitionerStore.navUsersToggle ? 4 : 3" style="background-color:">
        <AppointmentCard :appointment="props.appointment" />
      </VCol>
      <VCol cols="12" :md="practitionerStore.navUsersToggle ? 8 : 9" v-if="patientStore.id">
        <div style="background-color: white;" class="pt-5">
          <VRow>
            <VCol cols="12" md="12">
              <div class="px-3">
                <VRow>
                  <VCol cols="12" md="6" style="border-right: 3px solid #f8f7fa;">
                  </VCol>

                  <VCol cols="12" md="6">
                    <small class="text-secondary" density="compact">{{ $t('PCP') }}</small>
                    <div class="pb-2">
                      <small class="text-body">{{ props.appointment.practitioner }}</small>
                    </div>

                    <div v-if="patientStore.lastRecentAppointments?.next_upcoming_appointment?.date &&
                      patientStore.lastRecentAppointments?.next_upcoming_appointment?.start_time">
                      <VBtn variant="outlined" size="small" @click="goToCallPage">{{ $t('Start Televisit') }}</VBtn>

                      <VMenu location="bottom">
                        <template #activator="{ props }">
                          <VBtn icon="tabler-dots" class="ml-1" rounded variant="outlined" size="small"
                            color="secondary" v-bind="props">
                          </VBtn>
                        </template>
                        <VList>
                          <VListItem>{{ $t('Create Appointment') }}</VListItem>
                        </VList>
                      </VMenu>
                    </div>
                    <div v-else>
                      <VBtn variant="outlined" size="small">{{ $t('Create Appointment') }}</VBtn>
                    </div>
                  </VCol>
                </VRow>
              </div>
            </VCol>

            <VCol cols="12" md="12">
              <VTabs v-model="userTab" class="shift-arraow-right pb-0">
                <VTab v-for="tab in translatedHeaders" :key="tab.icon">
                  <VIcon :size="18" :icon="tab.icon" class="me-1" v-if="$can(tab.action, tab.subject)" />
                  <span v-if="$can(tab.action, tab.subject)">{{ tab.title }}</span>
                </VTab>
              </VTabs>

              <VWindow v-model="userTab">
                <VWindowItem>
                  <EditMedSupplement :patient="patientStore.patient" v-if="patientStore.id" />
                </VWindowItem>
                <VWindowItem>
                  <Demographics class="pt-3" v-if="patientStore.id" />
                </VWindowItem>
                <VWindowItem>
                  <Documents class="pt-3" :patient="patientStore.patient" v-if="patientStore.id" />
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
          </VRow>
        </div>
      </VCol>
    </VRow>

    <VCard
      v-if="!patientStore.id && currentPath == '/provider/calendar' && practitionerStore.upcomingAppointments.length > 0">
      <VCardText>
        <p class="text-center"> {{ $t('Select a patient to view details') }}</p>
      </VCardText>
    </VCard>

    <VCard v-if="practitionerStore.upcomingAppointments.length <= 0 && currentPath == '/provider/calendar'">
      <VCardText>
        <p class="text-center">{{ $t('No Data Found') }}</p>
      </VCardText>
    </VCard>

    <AppointmentDrawer :appointment="props.appointment" />
  </div>
</template>
