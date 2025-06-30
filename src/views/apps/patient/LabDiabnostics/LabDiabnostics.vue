<script setup>
import AddLabDiagnostics from '@/views/apps/patient/LabDiabnostics/AddLabDiagonostics.vue';
import EditLabDiagnostics from '@/views/apps/patient/LabDiabnostics/EditLabDiagonostics.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
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
const isLabDiagnosticsDialogVisible = ref(false)
const isEditLabDiagnosticsDialogVisible = ref(false)
const filterLabDiagnostics = ref(null)
const lab = ref(null)
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const selectedRows = ref([])
const refForm = ref()
const message = ref();
const isDisable = ref(true);
const currentTab = ref('0')
const fullName = ref();
const filterLabDiagnosticsData = ref([])
const labdiagnostics = ref([])
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isDataEnable: {
    type: Boolean,
  }
})
const fullname = computed(() => {
  fullName.value = props.patient.firstName + ' ' + props.patient.lastName;

  console.log("fullname", fullName.value);
})

onMounted(async () => {
  await store.dispatch('getLabDiagnosticsList', { id: props.patient.id });
  labdiagnostics.value = store.getters.labdiagnostics
  console.log(labdiagnostics.value)
})

const totalUsers = computed(() => {
  return labdiagnostics.value && labdiagnostics.value[0]
    ? labdiagnostics.value.length
    : 0;
});

const updateOptions = options => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}
const headers = [
  {
    title: 'Provider',
    key: 'provider',
  },
  {
    title: 'Lab',
    key: 'lab',
  },
  {
    title: 'Patient',
    key: 'patient',
  },
  {
    title: 'Order# / Test',
    key: 'order_test',
  },
  {
    title: 'Updated',
    key: 'updated_at',
  },
  {
    title: 'Submitted',
    key: 'created_at',
  },
  {
    title: 'Result',
    key: 'result',
  },
  {
    title: 'Notes',
    key: 'notes',
  },
  {
    title: 'Requisition',
    key: 'requisition',
  },
  {
    title: 'Action',
    key: 'actions',
  },

]

const emit = defineEmits([
  'closeForm',
  'patientData'
]);

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
}
const updateNewUser = async userData => {
  isLoading.value = false;
  console.log("updateNewUser", userData);
  const res = await $api('/api/apps/users/' + userData.id, {
    method: 'PUT',
    body: userData,
  });
  isSelectLabDialogVisible.value = false
  isLabDiagnosticsDialogVisible.value = false;
  isEditLabDiagnosticsDialogVisible.value = false;
  isTonalSnackbarVisible.value = true;

  isLoading.value = false;
  console.log("res", res);
  fetchUsers()
}
const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const editLabDiagnostics = async (vid) => {
  isLoading.value = true;
  isEditLabDiagnosticsDialogVisible.value = true;
  // let pid = props.patient.patientId;
  //   const res = await $api('/api/apps/users/'+pid, {
  //   method: 'GET',
  //   });
  filterLabDiagnostics.value = labdiagnostics.value.filter(row => row.id === vid)
  console.log("filterLabDiagnostics", filterLabDiagnostics.value)
  isLoading.value = false;
}

const deleteLabDiagnostics = async vid => {
  console.log('filterLabDiagnostics', labdiagnostics.value);
  // Get the LabDiagnostics array
  let LabDiagnostics = labdiagnostics.value;

  isLoading.value = true;

  // Find the index of the row with the matching id
  const index = LabDiagnostics.filter(row => row.id === vid);

  // Check if the index exists
  if (index !== -1) {
    // Remove the item from the array
    LabDiagnostics.splice(index, 1);

  } else {
    console.log('Row not found');
  }

  // Fetch users (assuming this updates your data)
  // fetchUsers();

  isLoading.value = false;
};

const openAddModal = () => {
  isSelectLabDialogVisible.value = false
  isLabDiagnosticsDialogVisible.value = true;
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
    LabDiagnostics saved.
  </VSnackbar>

  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">

    <AppDrawerHeaderSection :title='"LabDiagnostics (" + fullName + ")"' @cancel="closeNavigationDrawer" />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText class="d-flex flex-wrap gap-4">
          <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
            <div class="me-3 d-flex gap-3">
              <AppSelect :model-value="itemsPerPage" :items="[
                { value: 10, title: '10' },
                { value: 25, title: '25' },
                { value: 50, title: '50' },
                { value: 100, title: '100' },
                { value: -1, title: 'All' },
              ]" style="inline-size: 6.25rem;" @update:model-value="itemsPerPage = parseInt($event, 10)" />
            </div>
            <VSpacer />
            <VSpacer />
            <VSpacer />
            <VSpacer />
            <VSpacer />
            <VSpacer />
            <VSpacer />
            <VSpacer />
            <VSpacer />
            <VSpacer />
            <VSpacer />
            <VSpacer />
            <VSpacer />

            <div style="inline-size: 15.625rem;">
              <AppTextField v-model="searchQuery" placeholder="Search User" />
            </div>

            <!-- <VBtn  prepend-icon="tabler-plus"> New Template</VBtn> -->
            <VBtn prepend-icon="tabler-plus" @click="isSelectLabDialogVisible = true" class="">
              New LabDiagnostics
            </VBtn>
          </div>
          <VDivider />
          <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:model-value="selectedRows" v-model:page="page"
            :items="labdiagnostics" item-value="id" :items-length="totalUsers" :headers="headers" class="text-no-wrap"
            @update:options="updateOptions">

            <template #item.created_date="{ item }">
              <div class="d-flex align-center gap-x-4">
                <span>{{ formatDate(item.created_date) }} </span>
              </div>
            </template>
            <template #item.requisition="{ item }">
              <IconBtn @click="editLabDiagnostics(item.id)">
                <VIcon icon="tabler-edit" />
              </IconBtn>
            </template>
            <template #item.actions="{ item }">
              <IconBtn @click="deleteLabDiagnostics(item.id)">
                <VIcon icon="tabler-trash" />
              </IconBtn>
            </template>

            <template #bottom>
              <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="totalUsers" />
            </template>
          </VDataTableServer>

        </VCardText>
      </VCard>
      <VDialog v-model="isSelectLabDialogVisible" width="600">
        <DialogCloseBtn @click="isSelectLabDialogVisible = false" />
        <VCard title="Please select lab first">
          <VCardText>
            <VRow>
              <VCol cols="9">
                <AppSelect v-model="lab" label="" placeholder="" :items="['LabCorp', 'Genova', 'Solaris']" />
              </VCol>
              <VCol cols="3">
                <VBtn @click="openAddModal">Select</VBtn>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VDialog>
      <VDialog v-model="isLabDiagnosticsDialogVisible" max-width="1300">
        <DialogCloseBtn @click="isLabDiagnosticsDialogVisible = false" />
        <VCard title="Lab Orders">
          <VCardText>
            <AddLabDiagnostics @addLabDiagnostics="updateNewUser" />
          </VCardText>
        </VCard>
      </VDialog>
      <VDialog v-model="isEditLabDiagnosticsDialogVisible" max-width="1300">
        <DialogCloseBtn @click="isEditLabDiagnosticsDialogVisible = false" />
        <VCard title="Edit  Patient LabDiagnostics">
          <VCardText>
            <EditLabDiagnostics :editLabDiagnosticsData="filterLabDiagnostics" @editLabDiagnostics=updateNewUser />
          </VCardText>
        </VCard>
      </VDialog>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
