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
  widgetData: {
    type: Object,
    required: false,
  },
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
    if (newAppointment) {
      console.log(newAppointment.patient_id)



      await patientStore.getLastRecentAppointment(patientStore.id);
      await patientStore.getDocumentList(patientStore.id);
    }

  },
  { immediate: true } // Runs immediately when the component is mounted
);

const calculateAge = (dateOfBirth) => {
  if (dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Check if the birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return `${age} Yrs`;
  } else {
    return ``;
  }

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
const formatDOB = (date) => {
  return date ? `|DOB: ${dateFormat(date, 'MMM D, YYYY')}` : null;
};
</script>
<template>

  <DynamicCard :meta="props.widgetData.metaConfig" :title="props.widgetData.widget_name">
    <div class="text-center pt-8 pb-0 ">
      <VAvatar rounded="circle" size="100" color="primary">
        <VImg v-if="patientStore.demographic.profilePicture" :src="patientStore.demographic.profilePicture" />
        <span v-else>{{ avatarText(patientStore.demographic.firstName) }}{{
          avatarText(patientStore.demographic.lastName) }}</span>
      </VAvatar>
      <!-- <VAvatar rounded="circle" size="100"
                :image="patientStore.demographic.profilePicture ?? '/images/avatar.png'" /> -->

      <!--  User fullName -->
      <h5 class="text-h5">
        {{ patientStore.demographic?.fullName }}
        <VBtn icon variant="text" color="medium-emphasis">
          <VIcon icon="tabler-dots-vertical" @click="[isActionDialogVisible = true]" />
        </VBtn>
      </h5>

      <small>{{ patientStore.demographic?.genderIdentity }}, {{ calculateAge(patientStore.demographic.dateOfBirth)
      }} {{ formatDOB(patientStore.demographic?.dateOfBirth) }} </small>
      <div class="mb-2">

        <VBtn
          :color="patientStore.demographic.status === 'active' || patientStore.demographic.status === '' ? `success` : `error`"
          variant="tonal" size="x-small">
          {{ patientStore.demographic.status === 'active' || patientStore.demographic.status === '' ?
            'Active' : 'Inactive' }}
        </VBtn>
      </div>
    </div>
    <!-- <VDivider /> -->

    <v-row :align="`start`" justify="space-between">

      <!-- List on the left -->
      <v-col cols="12" class="px-0">
        <VList class="card-list mt-2">
          <VListItem class="no-padding backgroundColor" density="compact">
            <VListItemTitle class="px-6">
              <span class="text-h6 mr-1">
                <VIcon icon="tabler-phone" color="secondary" disabled="" size="x-small"></VIcon>
              </span>
              <small class=""> {{ patientStore.demographic.preferredPhone }}</small>
              <span class="text-body-1 ml-1 mr-1">
                <VIcon icon="tabler-mail" color="secondary" disabled="" size="x-small"></VIcon>
              </span>
              <small class="ml-0"> {{ patientStore.demographic.email }} </small>
            </VListItemTitle>
          </VListItem>
          <VListItem class="no-padding backgroundColor" density="compact">
            <VListItemTitle class="text-wrap d-flex flex-nowrap px-6">
              <span class="text-h6 mr-2">
                <VIcon icon="tabler-map-pin" color="secondary" disabled="" size="x-small"></VIcon>
              </span>
              <small class="pb-2">
                {{ `${patientStore.demographic.address ?? ''} ${patientStore.demographic.city ?? ''}
                ${patientStore.demographic.state ?? ''} ${patientStore.demographic.zipcode ?? ''}`
                }}
              </small>
            </VListItemTitle>
          </VListItem>
          <VDivider class="bold-divider" />
          <VListItem class="no-padding ml-0 py-2 backgroundColor" density="compact">
            <div class="py-2 pb-0 px-6">
              <small color="secondary" density="compact">{{ $t('Last Appointment') }}</small>
              <div v-if="patientStore.lastRecentAppointments?.last_recent_appointment?.date &&
                patientStore.lastRecentAppointments?.last_recent_appointment?.start_time">
                <h6 class="text-body x-small">
                  {{
                    appointmenDateFormate(`${patientStore.lastRecentAppointments.last_recent_appointment.date}
                  ${patientStore.lastRecentAppointments.last_recent_appointment.start_time}`,
                      "MM-DD-YYYY hh:mm A") }}
                </h6>
              </div>
              <div v-else>
                <small color="secondary" density="compact"> N/A</small>
              </div>
            </div>
          </VListItem>
        </VList>
      </v-col>
    </v-row>

    <v-row class="mt-1 ">
      <v-col cols="12" class="pb-0 d-flex justify-space-between align-center px-1 pt-0">

        <small class="px-4" color="secondary" density="compact">{{ $t('Documents') }}</small>
        <!-- <RouterLink density="compact" class="text-primary" to="">
                        <small>View All</small>
                    </RouterLink> -->
      </v-col>
      <v-col cols="12" class="pt-0 backgroundColor px-4">

        <VList density="comfortable" nav class="backgroundColor px-0 py-1">
          <VListItem class="whiteBackground cursor-pointer" v-if="patientStore.documents.length > 0"
            v-for="item in patientStore.documents" :key="item.value" :value="item.value"
            @click="[isPdfView = !isPdfView, openDocument(item)]">
            <template #prepend>
              <img :src="pdf" height="20" class="me-2" alt="img">
            </template>

            <VListItemTitle>
              <small color="secondary" class="app-timeline-text font-weight-medium text-wrap" density="compact">{{
                item.label }}</small>
            </VListItemTitle>
          </VListItem>
          <VListItem v-else class="pl-0">
            <small color="secondary" density="compact"> N/A</small>
          </VListItem>
        </VList>
      </v-col>
    </v-row>
  </DynamicCard>

  <VDialog v-model="isPdfView" max-width="800">
    <DialogCloseBtn @click="[isPdfView = !isPdfView, formattedPdfUrl = null]" />

    <!-- Image View for PNG and JPEG types -->
    <VCard class="pdf-container" v-if="formattedPdfUrl">
      <img :src="formattedPdfUrl" width="100%" height="100%" v-if="type == 'image/png' || type == 'image/jpeg'" />
      <iframe v-else
        :src="'https://docs.google.com/viewer?url=' + encodeURIComponent(formattedPdfUrl) + '&embedded=true'" :style="{
          transform: `scale(${scale})`,
          transformOrigin: 'top center'
        }" width="100%" height="auto" @load="handleLoad" frameborder="0" class="pdf-iframe" />
    </VCard>

    <!-- PDF View for other types -->

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
