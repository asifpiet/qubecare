<script setup>

import { usePatientStore } from '@/stores/patientStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
// import MedSupplement from '@/views/provider/patients/MedSupplement/MedSupplement.vue';
import AppointmentDrawer from './AppointmentDrawer.vue';

import CreateAppoinmentPatient from '@/views/apps/calendar/CreateAppoinmentPatient.vue';
const route = useRoute()
const patientStore = usePatientStore()
const practitionerStore = usePractitionerStore()
const router = useRouter()
const currentPath = route.path;
const props = defineProps({
  appointment: {
    type: String,
    required: true,
  },
})
const isEventHandlerSidebarActive = ref(false)
watch(
  () => props.appointment,
  async (newAppointment) => {
    console.log('dashboard-cloass', newAppointment);
    if (newAppointment) {

      await patientStore.getLastRecentAppointment(patientStore.id);

    }
  },
  { immediate: true } // Runs immediately when the component is mounted
);

// patientStore.unloadPatient()

const patientId = props.appointment?.patient_id;
const userTab = ref(null)
const isLoading = ref(null)

const event = ref({
  id: null,
  extendedProps: {
    patient_id: patientStore.id,
    practitioner_id: ''
  }
})

const onFormSubmitted = () => {
  console.log('Form submitted, but drawer remains open');
  // You can perform additional actions here if needed
  isEventHandlerSidebarActive.value = false
};
const goToCallPage = () => {

  router.replace('/provider/call/' + props.appointment.patient_id + '/' + props.appointment.id)
};
watch(isEventHandlerSidebarActive, (newVal) => {
  console.log('isEventHandlerSidebarActive changed:', newVal);
});

const markasComplete = async (id) => {
  console.log('markasComplete', id);
  await patientStore.updateAppointmentStatus(id);
  await patientStore.getLastRecentAppointment(patientStore.id);
}
</script>

<template>
  <div>

    <VRow v-if="(patientStore.id &&
      practitionerStore.upcomingAppointments.length > 0 &&
      currentPath == '/provider/calendar') ||
      (patientStore.id && currentPath == '/provider/patients/dashboard/' + patientStore.id)">

      <VCol cols="12" :md="practitionerStore.navUsersToggle ? 8 : 9" v-if="patientStore.id">


        <VRow>
          <VCol cols="12" md="12">
            <div class="px-3">
              <VRow>
                <VCol cols="12" md="6" style="border-right: 3px solid #f8f7fa;">

                </VCol>

                <VCol cols="12" md="6">
                  <small class="text-secondary" density="compact">{{ $t('PCP') }}</small>
                  <div class="pb-2">
                    <small class="text-body ">{{ props.appointment.practitioner }}</small>
                  </div>
                  <!-- <h6 class="pb-2">{{ props.appointment.practitioner }}</h6> -->
                  <!--  -->

                  <div class="d-flex align-center "
                    v-if="patientStore.lastRecentAppointments?.next_upcoming_appointment?.date &&
                      patientStore.lastRecentAppointments?.next_upcoming_appointment?.start_time && patientStore.lastRecentAppointments?.next_upcoming_appointment?.status !== 'Complete'">
                    <VBtn class="px-5 me-2" variant="outlined" size="small" @click=goToCallPage>{{ $t('Start Televisit')
                    }}
                    </VBtn>
                    <VBtn variant="outlined" size="small"
                      @click="markasComplete(patientStore.lastRecentAppointments?.next_upcoming_appointment.id)"
                      class="me-2"
                      v-if="patientStore.lastRecentAppointments?.next_upcoming_appointment?.status !== 'Complete'">
                      {{ $t('Mark as Complete') }}
                    </VBtn>
                    <!-- @click="practitionerStore.appointmentDrawer = true" -->
                    <VMenu location="bottom">
                      <template #activator="{ props }">
                        <VBtn icon="tabler-dots" class="ml-1" rounded variant="outlined" size="small" color="secondary"
                          v-bind="props">

                        </VBtn>
                      </template>

                      <VList>
                        <VListItem @click="isEventHandlerSidebarActive = true">{{ $t('Create Appointment') }}
                        </VListItem>
                      </VList>
                    </VMenu>
                  </div>
                  <div v-else>
                    <VBtn variant="outlined" size="small" @click="isEventHandlerSidebarActive = true">
                      {{ $t('Create Appointment') }}
                    </VBtn>
                  </div>
                </VCol>
              </VRow>
            </div>
          </VCol>
          <VCol cols="12" md="12">



          </VCol>
        </VRow>

      </VCol>
    </VRow>
    <VCard
      v-if="!patientStore.id && currentPath == '/provider/calendar' && practitionerStore.upcomingAppointments.length > 0">
      <VCardText>
        <p class="text-center">{{ $t('No Data Found, Select a patient to view details') }} </p>
      </VCardText>
    </VCard>
    <VCard v-if="practitionerStore.upcomingAppointments.length <= 0 && currentPath == '/provider/calendar'">
      <VCardText>
        <p class="text-center">{{ $t('No Data Found') }}</p>
      </VCardText>
    </VCard>
    <AppointmentDrawer :appointment="props.appointment" />
    <CreateAppoinmentPatient v-model:isDrawerOpen="isEventHandlerSidebarActive" :event="event"
      @formSubmitted="onFormSubmitted" />
  </div>
</template>
