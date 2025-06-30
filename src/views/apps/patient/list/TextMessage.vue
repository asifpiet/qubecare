<script setup>
import { dateFormate } from '@/plugins/globalFunctions';
import AddTextMessage from '@/views/apps/user/textMessage/addtextMessage.vue';
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
const isTextMessageDialogVisible = ref(false)
const itemsPerPage = ref(10)
const filtertextData = ref(null)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const selectedRows = ref([])
const refForm = ref()
const message = ref();
const isDisable = ref(true);
const currentTab = ref('0')
const fullName = ref();
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

const updateOptions = options => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}
const headers = [
  {
    title: 'Date',
    key: 'date',
  },
  {
    title: 'Message',
    key: 'message',
  },
  {
    title: 'Sent To',
    key: 'sentTo',
  },
]


const {
  data: usersData,
  execute: fetchUsers,
} = await useApi(createUrl(PATIENT_API, {
  query: {
    q: searchQuery,
    status: selectedStatus,
    plan: selectedPlan,
    role: selectedRole,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))
// const formatDate = (isoDate) => {
//   const date = new Date(isoDate);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
//   const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed

//   // Return the formatted date as yyyy-mm-dd
//   return `${year}-${month}-${day}`;
// };
const users = computed(() => {
  let id = props.patient.id;
  if (id) {
    console.log("xxzxzx", usersData.value.users);
    filtertextData.value = usersData.value.users.filter(row => row.id === id)
    console.log("textMessage", filtertextData.value)
    return filtertextData.value && filtertextData.value[0]
      ? filtertextData.value[0].textMessage
      : 0;
  } else {
    return [];
  }
})
const totalUsers = computed(() => {
  return filtertextData.value && filtertextData.value[0]
    ? filtertextData.value[0].textMessage.length
    : 0;
});

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
  isTextMessageDialogVisible.value = false;
  isTonalSnackbarVisible.value = true;
  isLoading.value = false;
  console.log("res", res);


  fetchUsers()
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
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
    TextMessage created.
  </VSnackbar>
  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">

    <AppDrawerHeaderSection :title='"Text Message   (" + fullName + ")"' @cancel="closeNavigationDrawer" />

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
            <div style="inline-size: 15.625rem;">
              <AppTextField v-model="searchQuery" placeholder="Search User" />
            </div>
            <!-- <VBtn  prepend-icon="tabler-plus"> New Template</VBtn> -->
            <VBtn prepend-icon="tabler-plus" @click="isTextMessageDialogVisible = true" class="ml-2">
              Text Message
            </VBtn>
          </div>
          <VDivider />
          <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:model-value="selectedRows" v-model:page="page"
            :items="users" item-value="id" :items-length="totalUsers" :headers="headers" class="text-no-wrap"
            @update:options="updateOptions">
            <template #item.date="{ item }">
              <div class="text-body-1 text-high-emphasis text-capitalize">
                {{ dateFormate(item.date) }}
              </div>
            </template>




            <template #bottom>
              <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="totalUsers" />
            </template>
          </VDataTableServer>

        </VCardText>
      </VCard>
      <VDialog v-model="isTextMessageDialogVisible" width="500">
        <DialogCloseBtn @click="isTextMessageDialogVisible = false" />
        <VCard title=" Create Text Message">
          <VCardText>
            <AddTextMessage @textMessage="updateNewUser" />
          </VCardText>
        </VCard>
      </VDialog>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
