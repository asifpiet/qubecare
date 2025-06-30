<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Affiliate Appointment View',
  },
})
import { ref } from 'vue';

const { currentUser, currentRole, logout } = useAuth()
const userData = currentUser;
let affiliateId = userData.value?.id
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const itemsPerPage = ref(10);
const dataTable = ref(null);
let dataTableURL = GET_AFFILIATE_PATIENT_APPOINTMENTS + '/' + affiliateId
const reload = () => dataTable.value.reload()

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
    key: 'date',
    name: 'pc_eventDate'
  },

  {
    title: 'Start Time',
    key: 'start_time',
    name: 'pc_startTime'
  },
  {
    title: 'Title',
    key: 'title',
    name: 'pc_title'
  },
  {
    title: 'Status',
    key: 'status',
    name: 'pc_apptstatus'
  },

  // {
  //   title: 'Cancel',
  //   key:    'actions',
  //   sortable: false,
  //   searchable:false
  // },

]

onMounted(async () => {
  reload()
})
const formatDate = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Add 1 to month because months are zero-based
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}-${day}-${year}`;
};
const formatTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = ((hours % 12) || 12).toString().padStart(2, '0');
  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};
</script>

<template>
  <section>

    <DataTable ref="dataTable" :cardTitle="$t('Appointments')" btnTitle="" :headers="headers" :api="dataTableURL"
      :sortBy="sortByData" @onBtnClick="addNewItem">
      <template #item.date="{ item }">
        <div class="d-flex align-center gap-x-4">
          <span>{{ formatDate(item.date) }} </span>
        </div>
      </template>
      <template #item.start_time="{ item }">
        <div class="d-flex align-center gap-x-4">
          <span>{{ formatTime(item.start_time) }} </span>
        </div>
      </template>
      <!-- <template #item.requisition="{ item }">
                <IconBtn @click="editAppointments(item.id)">
                    <VIcon icon="tabler-edit" />
                </IconBtn>
            </template>
            <template #item.actions="{ item }">
                <IconBtn @click="deleteAppointments(item.id)">
                <VIcon icon="tabler-trash" />
                </IconBtn>
            </template> -->
    </DataTable>
  </section>
</template>
