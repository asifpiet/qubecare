<script setup>
// import { dateFormat } from '@/plugins/globalFunctions';
import { usePatientStore } from '@/stores/patientStore';
import actions from '@/views/provider/patients/actions.vue';
import PatientInfoEditDialog from '@/views/provider/patients/dialogs/patientInfoEditDialog.vue';
import pdf from '@images/icons/project-icons/pdf.png';
import { useRoute, useRouter } from 'vue-router';
// import DocumentViewer from './components/DocumentViewer.vue';
const userData = useCookie('userData')
const accessToken = useCookie('accessToken').value;
const router = useRouter()
const route = useRoute();
const props = defineProps({
  appointment: {
    type: String,
    required: true,
  },
})
const type = ref(null);
const patientStore = usePatientStore()
const isUserInfoEditDialogVisible = ref(false)
const isTagsEditDialogVisible = ref(false)
const isActionDialogVisible = ref(false)
const isPdfView = ref(false)
const formattedPdfUrl = ref(null)
watch(
  () => props.appointment,
  async (newAppointment) => {
    if (newAppointment.patient_id) {
      console.log(newAppointment)
      await patientStore.getLastRecentAppointment(newAppointment.patient_id);
      await patientStore.getDocumentList(newAppointment.patient_id);
    }
  },
  { immediate: true } // Runs immediately when the component is mounted
);

const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Check if the birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return `${age} Yrs`;
}

console.log('app ', dateTimeFormat(props.appointment.start, 'MMMM DD, hh:mm A'))
const formattedDateOfBirth = computed(() => {
  return dateFormat(patientStore.demographic.dateOfBirth, 'MMM D, YYYY');
});
const startCall = () => {
  router.replace('/provider/call/' + props.appointment.patient_id + '/' + props.appointment.id)
};

const items = [
  {
    title: 'My Files',
    value: 1,
    prependIcon: 'tabler-files',
  },
  {
    title: 'Shared with me',
    value: 2,
    prependIcon: 'tabler-users',
  },
  {
    title: 'Starred',
    value: 3,
    prependIcon: 'tabler-star',
  },
  {
    title: 'Recent',
    value: 4,
    prependIcon: 'tabler-history',
  },
  {
    title: 'Offline',
    value: 5,
    prependIcon: 'tabler-circle-check',
  },
  {
    title: 'Uploads',
    value: 6,
    prependIcon: 'tabler-upload',
  },
  {
    title: 'Backups',
    value: 7,
    prependIcon: 'tabler-cloud-upload',
  },
]

const openDocument = (item) => {
  formattedPdfUrl.value = item.public_url;
  type.value = item.type;

}
</script>
<template>
  <VCard class="backgroundColor">
    <VCardText class="text-center pt-8 pb-0">
      <VAvatar rounded="circle" size="100" color="primary">
        <VImg v-if="patientStore.demographic.profilePicture" :src="patientStore.demographic.profilePicture" />
        <span v-else>{{ avatarText(patientStore.demographic.firstName) }}{{ avatarText(patientStore.demographic.lastName) }}</span>
      </VAvatar>

      <!-- 👉 User fullName -->
      <h5 class="text-h5">
        {{ patientStore.demographic?.fullName }}
        <VBtn icon variant="text" color="medium-emphasis">
          <VIcon icon="tabler-dots-vertical" @click="[isActionDialogVisible = true]" />
        </VBtn>
      </h5>
      <small>{{ patientStore.demographic?.genderIdentity }}, {{ calculateAge(patientStore.demographic.dateOfBirth) }} | {{ $t('DOB:') }} {{ dateFormat(patientStore.demographic.dateOfBirth, 'MMM D, YYYY') }}</small>

      <div class="mb-2">
        <VBtn :color="patientStore.demographic.status === 'Active' ? `success` : `error`" variant="tonal" size="x-small">
          {{ patientStore.demographic.status === 'Active' ? patientStore.demographic.status : 'Inactive' }}
        </VBtn>
      </div>
    </VCardText>
    <!-- <VDivider /> -->

    <VCardText class="py-2">
      <v-row :align="`start`" justify="space-between">
        <!-- List on the left -->
        <v-col cols="12" class="px-0">
          <VList class="card-list mt-2">
            <VListItem class="no-padding backgroundColor" density="compact">
              <VListItemTitle>
                <span class="text-h6 mr-1">
                  <VIcon icon="tabler-phone" color="secondary" disabled size="x-small"></VIcon>
                </span>
                <small>{{ patientStore.demographic.preferredPhone }}</small>
                <span class="text-body-1 ml-1 mr-1">
                  <VIcon icon="tabler-mail" color="secondary" disabled size="x-small"></VIcon>
                </span>
                <small class="ml-0">{{ patientStore.demographic.email }}</small>
              </VListItemTitle>
            </VListItem>
            <VListItem class="no-padding backgroundColor" density="compact">
              <VListItemTitle class="text-wrap d-flex flex-nowrap">
                <span class="text-h6 mr-2">
                  <VIcon icon="tabler-map-pin" color="secondary" disabled size="x-small"></VIcon>
                </span>
                <small class="pb-2">
                  {{ `${patientStore.demographic.address ?? ''} ${patientStore.demographic.city ?? ''} ${patientStore.demographic.state ?? ''} ${patientStore.demographic.zipcode ?? ''}` }}
                </small>
              </VListItemTitle>
            </VListItem>
            <VDivider class="bold-divider" />
            <VListItem class="no-padding ml-0 py-2 backgroundColor" density="compact">
              <div class="py-2 pb-0">
                <small color="secondary" density="compact">{{ $t('Last Appointment') }}</small>
                <div v-if="patientStore.lastRecentAppointments?.last_recent_appointment?.date && patientStore.lastRecentAppointments?.last_recent_appointment?.start_time">
                  <h6 class="text-body x-small">
                    {{ appointmenDateFormate(`${patientStore.lastRecentAppointments.last_recent_appointment.date} ${patientStore.lastRecentAppointments.last_recent_appointment.start_time}`, "MM-DD-YYYY hh:mm A") }}
                  </h6>
                </div>
                <div v-else>
                  <small color="secondary" density="compact">{{ $t('N/A') }}</small>
                </div>
              </div>
            </VListItem>
          </VList>
        </v-col>
        <!-- </v-col> closing tag here -->
      </v-row>

      <v-row class="mt-1">
        <v-col cols="12" class="pb-0 d-flex justify-space-between align-center px-0 pt-0">
          <small color="secondary" density="compact">{{ $t('Documents') }}</small>
        </v-col>
        <v-col cols="12" class="pt-0 backgroundColor px-0">
          <VList density="comfortable" nav class="backgroundColor px-0 py-1">
            <VListItem class="whiteBackground cursor-pointer" v-if="patientStore.documents.length > 0" v-for="item in patientStore.documents" :key="item.value" :value="item.value" @click="[isPdfView = !isPdfView, openDocument(item)]">
              <template #prepend>
                <img :src="pdf" height="20" class="me-2" alt="img">
              </template>
              <VListItemTitle>
                <small color="secondary" class="app-timeline-text font-weight-medium text-wrap" density="compact">{{ item.label }}</small>
              </VListItemTitle>
            </VListItem>
            <VListItem v-else class="pl-0">
              <small color="secondary" density="compact">{{ $t('N/A') }}</small>
            </VListItem>
          </VList>
        </v-col>
      </v-row>
    </VCardText>
  </VCard>

  <!-- PDF View for other types -->
  <VDialog v-model="isPdfView" persistent>
    <!-- Your PDF Viewer here -->
  </VDialog>

  <actions :patient="patientStore" v-model:showDialog="isActionDialogVisible" />
  <PatientInfoEditDialog v-model:isDialogVisible="isUserInfoEditDialogVisible" />
</template>

<style scoped>
.card-list>>>.v-list-item:not(:last-child) {
  padding-block-end: 5px !important;
}

.no-padding {
  padding: 0 !important;
}

.backgroundColor {
  background-color: #e0f2ef;
}

.whiteBackground {
  background-color: #fff;
  border-radius: 0px;
}

.bold-divider {

  border-width: 1px;
  /* Thicker line */
  border-color: #b9aaaa;
  /* Divider color */
}
</style>

<style scoped>
.pdf-container {
  height: calc(100vh - 64px);
  overflow: auto;
  position: relative;
  display: flex;
  justify-content: center;
}

.pdf-iframe {
  border: none;
  transition: transform 0.2s ease;
}
</style>
