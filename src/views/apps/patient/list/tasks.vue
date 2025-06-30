<script setup>
import API from '@/utils/apiDatable';
import AddTask from '@/views/apps/patient/tasks/addtask.vue';
import ViewTask from '@/views/apps/patient/tasks/viewtask.vue';
import debounce from 'lodash.debounce';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
const store = useStore()
const textTemplate = ref();
const isLoading = ref(false)
const isFormValid = ref(false)

const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const isTonalSnackbarVisible = ref(false)
const isTextMessageDialogVisible = ref(false)
const istaskDialogVisible = ref(false)
const isViewtaskDialogVisible = ref(false)
const filtertask = ref(null)
const page = ref(1)
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const orderBy = ref()
const selectedRows = ref([])
const refForm = ref()
const message = ref();
const isDisable = ref(true);
const currentTab = ref('0')
const fullName = ref();
const filterData = ref();
const taskList = ref([])
const searchQuery = ref('')
const search = ref('')
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);
const itemsPerPage = ref(10);
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
const patientId = ref()
const updateOptions = options => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}
const headers = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'Activity Message',
    key: 'activityMessage',
  },
  {
    title: 'Activity Due Date',
    key: 'activityDueDate',
  },
  {
    title: 'Activity Status',
    key: 'activityStatus',

  },
  // {
  //   title: 'Owner',
  //   key: 'owner',
  // },
]


// Method to load items
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
  const data = await API.getDataTableRecord(GET_TASK_API_LIST + '/' + patientId.value, payload, headers);
  console.log(data.total)
  serverItems.value = data.items;
  totalItems.value = data.total;
  totalUsers.value = data.total
  loading.value = false;
}, 500);



// const totalUsers = computed(() => usersData.value.totalUsers)
onMounted(async () => {


  console.log("getPatientProfile", props.patient.uuid);
  patientId.value = props.patient.uuid
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
  //await store.dispatch('getListTask',{id:patientId.value});
  // taskList.value=store.getters.getTaskList
  console.log('ddddd', taskList.value)

})

const totalUsers = ref(0)
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
  let patientId = props.patient.uuid
  const res = await $api(ADD_TASK_API_T + '/' + patientId, {
    method: 'POST',
    body: userData,
  })


  istaskDialogVisible.value = false;
  isTonalSnackbarVisible.value = true;
  isLoading.value = false;
  console.log("res", res);
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
}
const updateTask = async userData => {
  isLoading.value = false;
  console.log("updateTask", userData);
  let patientId = props.patient.uuid
  const res = await $api(UPDATE_TASK_DATA + '/' + userData.id, {
    method: 'POST',
    body: userData,
  })

  if (res.error) {
    store.commit('setErrorMsg', true)
    store.commit('setShowMsg', res.error)
  }
  if (res.success) {
    store.commit('setSuccessMsg', true)
    store.commit('setShowMsg', res.success)
  }


  isViewtaskDialogVisible.value = false;
  // isTonalSnackbarVisible.value = true;
  isLoading.value = false;
  console.log("res", res);
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
}
const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}
const onSubmit = async () => {
  isLoading.value = true
  refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      emit('patientData', {
        id: props.patient.id,
        textTemplate: textTemplate.value,
        message: message.value,
      })

      isTonalSnackbarVisible.value = true;
      isLoading.value = false;
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
        emit('update:isDrawerOpen', false)
      })
    } else {
      isLoading.value = false;
    }
  })

}
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Check if the birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

const showDetail = async (item) => {

  let pid = props.patient.id;
  filtertask.value = item
  console.log("filterTask", filtertask.value)
  isViewtaskDialogVisible.value = true;
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
    Task Update.
  </VSnackbar>

  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">

    <AppDrawerHeaderSection :title='"Tasks (" + fullName + ")"' @cancel="closeNavigationDrawer" />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText class="pt-6">
          <VRow class="">
            <VCol cols="6" md="3">
              <div class="d-flex align-center gap-4">
                <VAvatar color="info" variant="tonal" size="42">
                  <VIcon icon="tabler-user" />
                </VAvatar>

                <div class="d-flex flex-column">
                  <span class="text-h5 font-weight-medium"> {{ fullName }}</span>
                  <span class="text-sm"> Patient Name </span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="3">
              <div class="d-flex align-center gap-4">
                <VAvatar color="primary" variant="tonal" size="42">
                  <VIcon icon="tabler-calendar" />
                </VAvatar>

                <div class="d-flex flex-column">
                  <span class="text-h5 font-weight-medium">{{ props.patient.dateOfBirth }}</span>
                  <span class="text-sm"> Date of Birth </span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="3">
              <div class="d-flex align-center gap-4">
                <VAvatar color="error" variant="tonal" size="42">
                  <VIcon icon="tabler-user" />
                </VAvatar>

                <div class="d-flex flex-column">
                  <span class="text-h5 font-weight-medium">{{ props.patient.sexatBirth }}</span>
                  <span class="text-sm"> Gender </span>
                </div>

              </div>
            </VCol>
            <VCol cols="6" md="3">
              <div class="d-flex align-center gap-4">
                <VAvatar color="error" variant="tonal" size="42">
                  <VIcon icon="tabler-user" />
                </VAvatar>

                <div class="d-flex flex-column">
                  <span class="text-h5 font-weight-medium">{{ calculateAge(props.patient.dateOfBirth) }}</span>
                  <span class="text-sm"> Age </span>
                </div>

              </div>
            </VCol>

            <VCol cols="6" md="3" style="display: none;">
              <div class="d-flex align-center gap-4">
                <VAvatar color="info" variant="tonal" size="42">
                  <VIcon icon="tabler-currency-dollar" />
                </VAvatar>

                <div class="d-flex flex-column">
                  <span class="text-h5 font-weight-medium">{{ props.patient.insuranceDeductible }}</span>
                  <span class="text-sm"> Deductible $ </span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="3" style="display: none;">
              <div class="d-flex align-center gap-4">
                <VAvatar color="primary" variant="tonal" size="42">
                  <VIcon icon="tabler-chart-pie-2" />
                </VAvatar>

                <div class="d-flex flex-column">
                  <span class="text-h5 font-weight-medium">{{ props.patient.coInsurance }}</span>
                  <span class="text-sm"> Co-Ins %</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="3" style="display: none;">
              <div class="d-flex align-center gap-4">
                <VAvatar color="error" variant="tonal" size="42">
                  <VIcon icon="tabler-currency-dollar" />
                </VAvatar>

                <div class="d-flex flex-column">
                  <span class="text-h5 font-weight-medium">{{ props.patient.insurance }}</span>
                  <span class="text-sm"> Insurance </span>
                </div>
              </div>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex flex-wrap gap-4">


          <VDivider />
          <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">


            <div style="inline-size: 15.625rem;">
              <AppTextField v-model="search" placeholder="Search Task" />
            </div>

            <!-- <VBtn  prepend-icon="tabler-plus"> New Template</VBtn> -->
            <VBtn prepend-icon="tabler-plus" @click="istaskDialogVisible = true" class=""
              v-if="$can('read', 'Tasks Add')">
              New Task
            </VBtn>
          </div>
          <VDivider />
          <VDataTableServer v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
            :items-length="totalItems" :loading="loading" :search="search" item-value="id" :sort-by="sortByData"
            @update:options="loadItems">

            <template #item.activityMessage="{ item }">
              <div class="d-flex align-center gap-x-4">
                <span @click="showDetail(item)" class="cursor-pointer text-primary"
                  style="text-decoration: underline;">{{ item.activityMessage }} </span>
              </div>
            </template>


          </VDataTableServer>

        </VCardText>
      </VCard>
      <VDialog v-model="istaskDialogVisible" width="600">
        <DialogCloseBtn @click="istaskDialogVisible = false" />
        <VCard title="Create New Task">
          <VCardText>
            <AddTask @addTask="updateNewUser" />
          </VCardText>
        </VCard>
      </VDialog>
      <VDialog v-model="isViewtaskDialogVisible" width="600">
        <DialogCloseBtn @click="isViewtaskDialogVisible = false" />
        <VCard title="Task information">
          <VCardText>
            <ViewTask :task-data="filtertask" @editTask="updateTask" v-if="$can('read', 'Tasks Edit')" />
            <h4 style="color: red;" v-else>Permission Denied!</h4>
          </VCardText>
        </VCard>
      </VDialog>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
