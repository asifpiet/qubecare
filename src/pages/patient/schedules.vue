<script setup>
definePage({
  meta: {
    action: 'read',

    subject: 'Patient Schedules View',
  },
})
const { t } = useI18n();
import Prescription from '@/pages/patient/appointment/detail.vue';
import CreateAppointment from '@/pages/patient/appointment/newAppointment.vue';
import { dateFormat, formatTo12Hour } from '@/plugins/globalFunctions';
import { usePatientStore } from '@/stores/patientStore';
import { dateTimeFormat, hideLoader, showLoader } from '@/utils/showLoader';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import { VChip } from 'vuetify/components';
import { useStore } from 'vuex';
const route = useRoute()
const { currentUser, currentRole, logout } = useAuth()
const patientStore = usePatientStore()
const store = useStore()
const itemToDelete = ref(null);
const appointmentDetail = ref([]);
const selectedAppointment = ref(null)
const isConfirmDialogVisible = ref(false);
const isEditAppointmentsDialogVisible = ref(false)
const isViewDetail = ref(false);
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);
const isCreareAppointmentDialogVisible = ref(false);
const api_url = ref(null)
const btn = ref(null);
const patient_appointment_details = ref([]);
const emit = defineEmits([
  'update:isDrawerOpen',
  'closeForm',
  'patientData',
  'customEvent',
  'closePop'
])
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
})


const getAPi = computed(() => {

  if (route.path == '/patient/schedules') {
    api_url.value = GET_PATIENT_PROTAL_APPOINTMENTS + '/' + currentUser.value.id;
    btn.value = t('Create Appointment');
  }
  if (route.path == '/patient/dashboard') {
    api_url.value = PATIENT_PORTAL_UPCOMING_API + '/' + currentUser.value.id + '?start_date=' + patientStore.start_date + '&end_date=' + patientStore.end_date;
    btn.value = null;
  }



  return api_url.value;
});
const headers = [
  {
    title: 'ID',
    key: 'id',
    name: 'pc_eid'
  },
  {
    title: 'Patient Name',
    key: 'patient',
    name: 'patient_data.fname'
  },
  {
    title: 'Practitioner',
    key: 'practitioner',
    name: 'users.fname'
  },
  {
    title: 'Appointment Date',
    key: 'start',
    name: 'pc_eventDate'
  },


  {
    title: 'Status',
    key: 'status',
    name: 'pc_apptstatus'
  },

  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    searchable: false
  },

]
const reload = () => dataTable.value.reload()
watch(
  () => [patientStore.start_date, patientStore.end_date],
  ([newStartDate, newEndDate], [oldStartDate, oldEndDate]) => {
    console.log("Start Date changed:", newStartDate, "Old Start Date:", oldStartDate);
    console.log("End Date changed:", newEndDate, "Old End Date:", oldEndDate);
    if (newStartDate || newEndDate) {
      reload();
    }
  },

);
const closeAppointmentsDialogVisible = () => {
  isEditAppointmentsDialogVisible.value = false;
  reload()
}
const editAppointments = async (item) => {
  showLoader();
  console.log('editAppointments', item);
  selectedAppointment.value = item;
  patientStore.rescheduleAppointment = item;
  console.log("rescheduleAppointment", patientStore.rescheduleAppointment);
  patient_appointment_details.value = item;
  isCreareAppointmentDialogVisible.value = true;
  hideLoader();
}



const viewAppointments = async item => {
  console.log("item", item);
  appointmentDetail.value = item
  isViewDetail.value = true;
}

const joincall = (item) => {
  console.log("joincall", item, appointmentDetail.value);
  const url = '/patient/call?patient_id=' + currentUser.value.id + '&appointment_id=' + item.id + '&username=' + item.fname;
  window.open(url, '_blank');
}
const formattedText = (text) => {
  return text.replace(/_/g, ' ');  // Ensure you return the updated text
};

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'grey';
    case 'CONFIRMED':
      return 'success';
    case 'CANCELLED':
      return 'error';
    default:
      return 'primary';
  }
}
const cancleAppointments = async (item) => {
  itemToDelete.value = item.id;
  isConfirmDialogVisible.value = true;
}

const handleConfirm = async () => {
  if (itemToDelete.value) {
    await patientStore.patientCancelAppointment(itemToDelete.value);
    reload()
    isConfirmDialogVisible.value = false; // Close the dialog
    itemToDelete.value = null; // Reset the item
  }
};

const handleCancel = () => {

  isConfirmDialogVisible.value = false; // Close the dialog
  itemToDelete.value = null; // Reset the item
};
</script>

<template>
  <div v-if="getAPi">
    <DataTable ref="dataTable" :cardTitle="$t('Appointments')" :btnTitle="btn" :headers="headers" :api="api_url"
      :sortBy="sortByData" @onBtnClick="[isCreareAppointmentDialogVisible = true, selectedAppointment = null]">
      <template #item.start="{ item }">
        <div class="d-flex align-center gap-x-4">
          <span>{{ dateTimeFormat(`${item.date} ${item.start_time}`, "MM-DD-YYYY hh:mm A") }}</span>
        </div>
      </template>
      <template #item.status="{ item }">
        <div class="d-flex align-center gap-x-4">
          <VChip v-if="item.status == 'PENDING'">{{ $t('Pending') }} </VChip>
          <VChip v-else-if="item.status == 'CONFIRMED'" :color="getStatusColor(item.status)">{{ $t('Confirmed') }}
          </VChip>
          <VChip v-else-if="item.status == 'CANCELLED'" :color="getStatusColor(item.status)">{{
            $t('Cancelled') }}
          </VChip>
          <VChip v-else>{{ formattedText(item.status) }} </VChip>
        </div>
      </template>


      <template #item.actions="{ item }">

        <VBtn icon variant="text" color="medium-emphasis" @click="editAppointments(item)"
          v-if="item.status !== 'CANCELLED'">
          <VIcon icon="tabler-calendar" location="top" />
          <VTooltip location="top" transition="scale-transition" activator="parent">
            <span>{{ $t('Re-schedule') }}</span>
          </VTooltip>
        </VBtn>

        <VBtn icon variant="text" color="medium-emphasis" @click="joincall(item)" v-if="item.status !== 'CANCELLED'">
          <VIcon icon="tabler-video" location="top" />
          <VTooltip location="top" transition="scale-transition" activator="parent">
            <span>{{ $t('Go to Meeting') }}</span>
          </VTooltip>
        </VBtn>

        <VBtn icon variant="text" color="medium-emphasis" @click="cancleAppointments(item)"
          v-if="item.status !== 'CANCELLED'">
          <VIcon icon="tabler-trash" location="top" />
          <VTooltip location="top" transition="scale-transition" activator="parent">
            <span>{{ $t('Cancel Appointment') }}</span>
          </VTooltip>
        </VBtn>

      </template>

    </DataTable>
  </div>




  <VDialog v-model="isViewDetail" :width="$vuetify.display.smAndDown ? 'auto' : 1000">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isViewDetail = false" />
    <VCard class="pa-2 pa-sm-10">
      <VRow>
        <VCol cols="12" md="8" sm="6">
          <VCard>
            <Prescription />
          </VCard>
        </VCol>
        <VCol cols="12" md="4" sm="6">
          <VCard title="Appointment Detail">
            <VCardItem class="pt-0">
              <p class="mb-2" v-if="appointmentDetail.date"><span>{{ $t('Date:') }} {{
                dateFormat(appointmentDetail.date)
                  }}</span>
              </p>
              <p class="mb-2" v-if="appointmentDetail.start_time"><span> {{ $t('Start Time:') }} {{
                formatTo12Hour(appointmentDetail.start_time) }}</span></p>
              <p class="" v-if="appointmentDetail.end_time"><span>{{ $t('End Time:') }} {{
                formatTo12Hour(appointmentDetail.end_time
                )
              }}</span></p>
              <p>
                <VBtn block @click="joincall()"
                  v-if="appointmentDetail.start_time && appointmentDetail.status != 'CANCELLED' && appointmentDetail.status != 'CONFIRMED'">
                  {{ $t('Go to Meeting') }} </VBtn>
              </p>
              <p>
                <VBtn block color="error" v-if="appointmentDetail.status == 'CANCELLED'"> {{ $t('Cancelled') }} </VBtn>
              </p>
            </VCardItem>


          </VCard>

        </VCol>

      </VRow>
    </VCard>

  </VDialog>
  <ConfirmDialog v-model:isDialogVisible="isConfirmDialogVisible"
    confirmation-question="Are you sure you want to cancle this Appointment?" confirm-title="Deleted!"
    confirm-msg="Appointment cancelled successfully." cancel-title="Cancelled" cancel-msg="Deletion Cancelled!!"
    @confirm="handleConfirm" @cancel="handleCancel" />

  <!-- <VDialog v-model="isEditAppointmentsDialogVisible" class="v-dialog-sm">
    
    <DialogCloseBtn @click="isEditAppointmentsDialogVisible = false" />
    <EditAppointment v-model:isDrawerOpen="isEditAppointmentsDialogVisible"
      :appointmentData="patient_appointment_details" @customEvent="reload()"
      @closePop="closeAppointmentsDialogVisible" />

  </VDialog> -->


  <VNavigationDrawer v-model="isCreareAppointmentDialogVisible" temporary :width="800" location="end"
    class="scrollable-content">

    <AppDrawerHeaderSection :title="selectedAppointment ? $t('Re-schedule Appointment') : $t('Create Appointment')"
      @cancel="[isCreareAppointmentDialogVisible = !isCreareAppointmentDialogVisible, patientStore.rescheduleAppointment = [], selectedAppointment = null, reload()]" />
    <VDivider />
    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <CreateAppointment v-if="isCreareAppointmentDialogVisible" />
    </PerfectScrollbar>
  </VNavigationDrawer>

</template>
