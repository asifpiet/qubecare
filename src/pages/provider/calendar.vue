<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Calender View',
  },
})

import { usePatientStore } from '@/stores/patientStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import {
  AppContentLayoutNav
} from '@layouts/enums';
import { useLayoutConfigStore } from '@layouts/stores/config';
import moment from 'moment-timezone';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const { currentUser } = useAuth()
const configStore = useLayoutConfigStore()
configStore.isVerticalNavCollapsed = true
configStore.appContentLayoutNav = AppContentLayoutNav.Vertical

const patientStore = usePatientStore()
const practitionerStore = usePractitionerStore()
patientStore.unloadPatient()
const selectedAppointment = ref(null)
const today = new Date();
const start_date = ref();
const end_date = ref();

const now = new Date();


const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};



const startToEndMonth = () => {
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month

  const monthStart = formatDate(startOfMonth);
  const monthEnd = formatDate(endOfMonth);

  start_date.value = monthStart;
  end_date.value = monthEnd;

  practitionerStore.startDate = dateFormat(start_date.value, 'YYYY-MM-DD');
  practitionerStore.endDate = dateFormat(end_date.value, 'YYYY-MM-DD');
}

const todayDate = () => {
  const currentDate = formatDate(now);

  start_date.value = currentDate;
  end_date.value = currentDate;

  practitionerStore.startDate = dateFormat(start_date.value, 'YYYY-MM-DD');
  practitionerStore.endDate = dateFormat(end_date.value, 'YYYY-MM-DD');
}

// const patients = ref([
//     { id: 1, patient_id: 219, patient_name: 'Inshal Sethi', patient_profile: '/images/avatar.png', date: '2025-01-06', start: "2025-01-06T16:00:00.000Z", end: "2025-01-06T16:30:00.000Z" },
//     { id: 2, patient_id: 229, patient_name: 'Test Demo', patient_profile: '/images/avatar.png', date: '2025-01-07', start: "2025-01-07T16:00:00.000Z", end: "2025-01-07T16:30:00.000Z" },
//     { id: 3, patient_id: 228, patient_name: 'Steve Steve', patient_profile: '/images/avatar.png', date: '2025-01-08', start: "2025-01-08T16:00:00.000Z", end: "2025-01-08T16:30:00.000Z" },
// ]);

const patientsListing = ref(null);

function setPatientsListingHeight() {
  const element = document.querySelector('.layout-page-content');

  // if (element) {
  //   const height = element.clientHeight;
  //   patientsListing.value.style.height = `${height}px`;
  //   patientsListing.value.style.maxHeight = `855px`;
  // 

  if (element && patientsListing.value) {
    const height = element.clientHeight;
    patientsListing.value.style.height = `${height}px`;
    patientsListing.value.style.maxHeight = '855px';
  }
}

function formatDateTime(startTimeString, endTimeString) {
  console.log('endTimeString', endTimeString)
  let timzoneFound = currentUser.value.time_zone
  let start = timeFormat(startTimeString, "hh:mm A")
  let end = null
  if (!endTimeString)
    end = moment.utc(startTimeString).tz(timzoneFound).add(30, 'minutes').format('hh:mm A');
  else
    end = timeFormat(end, "hh:mm A")
  return `${dateFormat(startTimeString, 'MM-DD')} | ${start} - ${end}`;
}

const handlePatientClick = async (patient) => {
  console.log('handlePatientClick', patient);
  practitionerStore.navAppointmentToggle = 'patients'
  practitionerStore.navUsersToggle = false
  selectedAppointment.value = patient
  await patientStore.loadPatient(patient.patient_id);

  // Call your custom function here
  console.log('Clicked patient:', patient);
  // You can add additional logic here, such as fetching patient details, etc.
}
const initialSelectionDone = ref(false)
onMounted(async () => {
  todayDate()
  await practitionerStore.getUpcomingAppointments()

  if (practitionerStore.navAppointmentToggle === 'patients') {
    setPatientsListingHeight();
    window.addEventListener('resize', setPatientsListingHeight);
  }

});

onUnmounted(() => {
  if (practitionerStore.navAppointmentToggle === 'patients') {
    window.removeEventListener('resize', setPatientsListingHeight);
  }
  practitionerStore.navAppointmentToggle = 'calendar'
  practitionerStore.navUsersToggle = false
  // configStore.isVerticalNavCollapsed = false
  // configStore.appContentLayoutNav = AppContentLayoutNav.Vertical
});

watch(() => practitionerStore.navAppointmentToggle, (newVal) => {
  if (newVal === 'patients') {
    if (practitionerStore.upcomingAppointments.length > 0 && !initialSelectionDone.value) {
      handlePatientClick(practitionerStore.upcomingAppointments[0])
      initialSelectionDone.value = true;
      practitionerStore.navUsersToggle = false;
    }
  }
});

</script>

<template>
  <VRow>
    <!-- User Listing Column -->
    <VCol cols="12" md="3"
      v-if="practitionerStore.navAppointmentToggle === 'patients' && practitionerStore.navUsersToggle && practitionerStore.upcomingAppointments.length > 0">
      <div class="patients-liting" ref="patientsListing">
        <template v-if="practitionerStore.upcomingAppointments.length > 0">
          <VList>
            <VListItem class="px-2 py-2" v-for="patient in practitionerStore.upcomingAppointments" :key="patient.id"
              :append-avatar="patient.profile_picture ?? '/images/avatar.png'"
              :title="`${patient.fname} ${patient.lname}`"
              :subtitle="formatDateTime(patient.date_start_time, patient.end_time)"
              :class="{ 'selected-patient': selectedAppointment?.id === patient.id }"
              @click="handlePatientClick(patient)" />
          </VList>
        </template>
        <div v-else class="text-center pa-4 text-disabled">
          {{ $t("No Appointments Found") }}
        </div>
      </div>
    </VCol>

    <!-- Main Content Column -->
    <VCol cols="12"
      :md="practitionerStore.navAppointmentToggle === 'patients' && practitionerStore.navUsersToggle && practitionerStore.upcomingAppointments.length > 0 ? 9 : 12">
      <ProviderCalendar v-if="practitionerStore.navAppointmentToggle === 'calendar'"></ProviderCalendar>
      <AppointmentDashboard :appointment="selectedAppointment"
        v-if="practitionerStore.navAppointmentToggle === 'patients'">
      </AppointmentDashboard>
    </VCol>
  </VRow>
</template>

<style scoped>
/* Add some basic styling */
.v-list {
  padding: 0;
}

.v-list-item {
  border-bottom: 1px solid #eee;
  cursor: pointer;
  /* Make it look clickable */
  transition: background-color 0.3s ease;
  /* Smooth transition for background color */
}

.v-list-item>>>.v-list-item-title {
  margin-bottom: 5px;
  margin-top: 5px;
  font-weight: 500;
}

.v-list-item:last-child {
  border-bottom: none;
}

.v-list-item.selected-patient {
  background-color: silver;
  /* Highlight selected patient */
}

.v-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  /* Ensure the card takes the full height */
}

.patients-liting {
  flex: 1;
  overflow-y: auto;
  background-color: rgb(var(--v-theme-surface), 0.88);
  min-height: 540px;
  height: 100%;
}

/* Custom styles for the toggle group */


/* For WebKit browsers (Chrome, Safari, Edge) */
.patients-liting::-webkit-scrollbar {
  width: 6px;
  /* Adjust the width of the scrollbar */
  height: 6px;
  /* Adjust the height for horizontal scrollbars */
}

.patients-liting::-webkit-scrollbar-track {
  background: #f1f1f1;
  /* Color of the track */
}

.patients-liting::-webkit-scrollbar-thumb {
  background: #888;
  /* Color of the scrollbar thumb */
  border-radius: 3px;
  /* Rounded corners for the thumb */
}

.patients-liting::-webkit-scrollbar-thumb:hover {
  background: #555;
  /* Color of the scrollbar thumb on hover */
}

/* For Firefox */
.patients-liting {
  scrollbar-width: thin;
  /* Makes the scrollbar thinner */
  scrollbar-color: #888 #f1f1f1;
  /* Thumb and track colors */
}
</style>
