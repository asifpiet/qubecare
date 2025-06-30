<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Patient Orders View',
  },
})
import API from '@/utils/apiDatable';
import debounce from 'lodash.debounce';
import { onMounted } from 'vue';
import { useStore } from 'vuex';
// import AddAppointment from './appointment/newAppointment.vue';
const store = useStore()
const textTemplate = ref();
const isLoading = ref(false)
const isFormValid = ref(false)
const searchQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const isTonalSnackbarVisible = ref(false)
const isSelectLabDialogVisible = ref(false)
const isAppointmentsDialogVisible = ref(false)
const isEditAppointmentsDialogVisible = ref(false)
const isAppiontmentDrawerVisible = ref(false)
const filterAppointments = ref(null)
const lab = ref(null)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const selectedRows = ref([])
const refForm = ref()
const message = ref();
const isDisable = ref(true);
const currentTab = ref('0')
const fullName = ref();
const filterAppointmentsData = ref([])
const appointments = ref([])
const search = ref('')
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);
const itemsPerPage = ref(10);
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const emit = defineEmits([
  'update:isDrawerOpen',
  'closeForm',
  'patientData'
])
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isDataEnable: {
    type: Boolean,
  }
})
const fullname = computed(() => {
  // fullName.value = store.getters.getPatientPorfile.firstName+' '+store.getters.getPatientPorfile.lastName;
  // console.log("fullname",fullName.value);
})

const updateOptions = options => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}
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
    title: 'Service',
    key: 'title',
    name: 'pc_title'
  },
  {
    title: 'Status',
    key: 'status',
    name: 'pc_apptstatus'
  },

  {
    title: 'Cancel',
    key: 'actions',
    sortable: false,
    searchable: false
  },

]
const loadItems = debounce(async ({ page, itemsPerPage, sortBy }) => {
  const payload = {
    page,
    itemsPerPage,
    sortBy,
    filters: {
    },
    search: search.value,
  }
  sortByData.value = sortBy
  console.log("records", page, itemsPerPage, sortBy);
  loading.value = true;
  let id = localStorage.getItem('LoginUserId');
  const data = await API.getDataTableRecord(PATIENT_PORTAL_UPCOMING_API + '/' + id, payload, headers);
  console.log(data.total)
  serverItems.value = data.items;
  totalItems.value = data.total;
  loading.value = false;
}, 500);

onMounted(async () => {
  //await store.dispatch('getAppointmentsList',{id: store.getters.getPatientPorfile.patientId});
  //appointments.value=store.getters.getAppointments
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
})


const totalUsers = computed(() => {
  return appointments.value && appointments.value[0]
    ? appointments.value.length
    : 0;
});


const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
}
const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const editAppointments = async (vid) => {
  isLoading.value = true;
  isEditAppointmentsDialogVisible.value = true;
  let pid = store.getters.getPatientPorfile.patientId;
  // const res = await $api('/api/apps/users/'+pid, {
  // method: 'GET',
  // });
  // filterAppointments.value = res.Appointments.filter(row => row.id === vid)
  // console.log("filterAppointments",filterAppointments.value)
  // isLoading.value = false;
}

const deleteAppointments = async vid => {
  await store.dispatch('cancelAppointment',
    {
      id: vid
    }
  )
  let uid = localStorage.getItem('LoginUserId');
  await store.dispatch('getAppointmentsList', { id: uid });
  appointments.value = store.getters.getAppointments
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // For 24-hour format
  }).replace(',', ''); // Removing the comma
}
</script>

<template>
  <div v-if="fullname"></div>

  <VDialog v-model="isLoading" width="110" height="150" color="primary">
    <VCardText class="" style="color: white !important;">
      <div class="demo-space-x">
        <VProgressCircular :size="40" color="primary" indeterminate />
      </div>
    </VCardText>
  </VDialog>
  <VSnackbar v-model="isTonalSnackbarVisible" location="top end" variant="flat" color="success">
    Appointments saved.
  </VSnackbar>

  <VCard flat title="Orders">
    <VCardText class="d-flex flex-wrap gap-4">
      <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
        <div style="inline-size: 15.625rem;">
          <AppTextField v-model="search" placeholder="Search Orders" />
        </div>

      </div>
      <VDivider />
      <VDataTableServer v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
        :items-length="totalItems" :loading="loading" :search="search" item-value="id" :sort-by="sortByData"
        @update:options="loadItems" class="text-no-wrap">

        <template #item.created_date="{ item }">
          <div class="d-flex align-center gap-x-4">
            <span>{{ formatDate(item.created_date) }} </span>
          </div>
        </template>
        <template #item.requisition="{ item }">
          <IconBtn @click="editAppointments(item.id)">
            <VIcon icon="tabler-edit" />
          </IconBtn>
        </template>
        <template #item.actions="{ item }">
          <IconBtn @click="deleteAppointments(item.id)">
            <VIcon icon="tabler-trash" />
          </IconBtn>
        </template>


      </VDataTableServer>

    </VCardText>
  </VCard>
  <!-- <AddAppointment v-model:isDrawerOpen="isAppiontmentDrawerVisible" /> -->
</template>
<!-- @user-data="addNewUser"
@update-user-data="updateNewUser" -->
