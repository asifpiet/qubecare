<script setup>
import { dateFormat } from '@/plugins/globalFunctions';
import API from '@/utils/apiDatable';
import AddTasksOrdersDrawer from '@/views/apps/patient/tasksOrders/AddTasksOrdersDrawer.vue';
import EditTasksOrdersDrawer from '@/views/apps/patient/tasksOrders/EditTasksOrdersDrawer.vue';
import debounce from 'lodash.debounce';
import { useStore } from 'vuex';
const store = useStore()
const searchQuery = ref('')
const selectedRole = ref()
const isLoading = ref(false)
const patientId  =ref()
const  taskList =ref([])
const selectedPlan = ref()
const selectedStatus = ref()
const isDialogVisible = ref(false)
const itemsPerPage = ref(10)
const totalItems = ref(0);
const isActionDialogVisible = ref(false)
const isTextMessageUserDrawerVisible = ref(false)
const isTaskUserDrawerVisible = ref(false)
const isVitalDrawerVisible = ref(false)
const filterHeathMantainceData = ref(null)
const isTonalSnackbarVisible = ref(false)
const isAddTasksOrdersDrawerDrawerVisible = ref(false)
const isEditTasksOrdersDrawerVisible = ref(false)
const isSelectedStatus = ref(false)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const selectedRows = ref([])
const patientToEdit  = ref();
const isDisable = ref();
const filterHealthMaintance = ref([])
const search = ref('')
const serverItems = ref([]);
const loading = ref(true);
const emit = defineEmits([
    'update:isDrawerOpen',
    'healthMantaince'
]);

const updateOptions = options => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const headers = [
{
    title: 'Title',
    key: 'title',
  },
  {
    title: 'Order Type',
    key: 'task_type',
  },
  {
    title: 'Due Date',
    key: 'due_date',
  },
  {
    title: 'Status',
    key: 'activityStatus',
  },
  
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    searchable:false
  },
  // {
  //   title: 'Alert',
  //   key: '',
  // },
]

const loadItems = debounce( async ( { page,  itemsPerPage, sortBy }) =>  {
  console.log('loadItems');
  const payload = {
    page,
    itemsPerPage,
    sortBy,
    filters:{
    },
    search:search.value,
  }
  console.log("records",page, itemsPerPage, sortBy);
  loading.value = true;
  const data = await API.getDataTableRecord(GET_TASK_API_LIST + '/' + patientId.value, payload, headers);
  console.log(data.total)
  serverItems.value   = data.items;
  totalItems.value = data.total;
  totalUsers.value =data.total
  loading.value = false;  
},500);
// const totalUsers = computed(() => usersData.value.totalUsers)
onMounted(async () => {
  

  console.log("getPatientProfile", store.getters.getPatientPorfile.uuid);
  patientId.value = store.getters.getPatientPorfile.uuid
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
  //await store.dispatch('getListTask',{id:patientId.value});
 // taskList.value=store.getters.getTaskList
  console.log('ddddd',taskList.value)

})
const totalUsers = ref(0)
const resolveUserRoleVariant = role => {
  const roleLowerCase = role.toLowerCase()
  if (roleLowerCase === 'subscriber')
    return {
      color: 'success',
      icon: 'tabler-user',
    }
  if (roleLowerCase === 'author')
    return {
      color: 'error',
      icon: 'tabler-device-desktop',
    }
  if (roleLowerCase === 'maintainer')
    return {
      color: 'info',
      icon: 'tabler-chart-pie',
    }
  if (roleLowerCase === 'editor')
    return {
      color: 'warning',
      icon: 'tabler-edit',
    }
  if (roleLowerCase === 'admin')
    return {
      color: 'primary',
      icon: 'tabler-crown',
    }
  
  return {
    color: 'primary',
    icon: 'tabler-user',
  }
}

const resolveUserStatusVariant = stat => {
  const statLowerCase = stat.toLowerCase()
  if (statLowerCase === 'pending')
    return 'warning'
  if (statLowerCase === 'active')
    return 'success'
  if (statLowerCase === 'inactive')
    return 'secondary'
  
  return 'primary'
}

const updateTask = async userData => {
    isLoading.value = true;
  console.log("updateTask", userData);
  let patientId =store.getters.getPatientPorfile.uuid
  const res = await $api(UPDATE_TASK_DATA+'/'+userData.id,  {
    method: 'POST',
    body: userData,
  })
 
  if (res.error) {
    store.commit('setErrorMsg', true)
    store.commit('setShowMsg',res.error)
  }
  if (res.success) {
    store.commit('setSuccessMsg', true)
    store.commit('setShowMsg',res.success)
  }

  isLoading.value= false;
  isTonalSnackbarVisible.value= true;
  isAddTasksOrdersDrawerDrawerVisible.value = false;
  isEditTasksOrdersDrawerVisible.value = false;
  emit('update:isDrawerOpen', false)
  isLoading.value = false;
  console.log("res",res);
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
}

const AddNewTask = async userData => {
    isLoading.value = false;
  console.log("updateNewUser", userData);
  let patientId =store.getters.getPatientPorfile.uuid
  const res = await $api(ADD_TASK_API_T+'/'+patientId,  {
    method: 'POST',
    body: userData,
  })
  isLoading.value= false;
  isTonalSnackbarVisible.value= true;
  isAddTasksOrdersDrawerDrawerVisible.value = false;
  isEditTasksOrdersDrawerVisible.value = false;
  emit('update:isDrawerOpen', false)
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
}

// const updateNewUser = async tasks => {
//   console.log("taskDatAssssif",tasks);
//   let pid = store.getters.getPatientPorfile.patientId;
//   const userData = {
//     id: pid,
//     tasks
//   }; 
//   console.log('??????',userData);
//   isLoading.value= true;
//   const res = await $api('/api/apps/users/'+pid, {
//     method: 'PUT',
//     body: userData,
//   });
//   console.log("resUpdated",res);
//   // fetchUsers()
//   isLoading.value= false;
//   isTonalSnackbarVisible.value= true;
//   isAddTasksOrdersDrawerDrawerVisible.value = false;
//   isEditTasksOrdersDrawerVisible.value = false;
//   emit('update:isDrawerOpen', false)

// }

const editTask = async item => {
  console.log("editTask", item);
  isEditTasksOrdersDrawerVisible.value = true;
  // let pid = store.getters.getPatientPorfile.patientId;
  // const res = await $api('/api/apps/users/'+pid, {
  //   method: 'GET',
  // });
  // console.log("sad", res);
  filterHealthMaintance.value = item;
  // console.log("filterHealthMaintance",filterHealthMaintance.value);
}

const onStatusChange = async(item) => {
  console.log("item",item);
  isLoading.value= true;
  let pid = store.getters.getPatientPorfile.patientId;
  let tasks = store.getters.getPatientPorfile.tasks.map((task) => {
    if (task.id === item.id) {
      // Update the activityStatus of the task with the same id
      return {
        ...task,
        activityStatus: item.activityStatus
      };
    }
    return task; // Return other tasks unchanged
  });
  
  const userData = {
    id: pid,
    tasks: tasks
  };      
// console.log("userDataUpdate",userData);
//   const res = await $api('/api/apps/users/'+pid, {
//     method: 'PUT',
//     body: userData,
//   });
//   console.log("res",res);
//   isLoading.value= false;    
 };
</script>

<template>
     <VDialog v-model="isLoading" width="110" height="150" color="primary">
        <VCardText class="" style="color: white !important;">
          <div class="demo-space-x">
            <VProgressCircular :size="40" color="primary" indeterminate />
          </div>
        </VCardText>
      </VDialog>
      <VSnackbar
      v-model="isTonalSnackbarVisible"
      location="top end"
      variant="flat"
      color="success"
    >
    Tasks Orders Saves
     </VSnackbar>
  <section>
    <VCard class="mb-6">
      <VCardText class="d-flex flex-wrap gap-4">
        <!-- <div class="me-3 d-flex gap-3">
          <AppSelect
            :model-value="itemsPerPage"
            :items="[
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: -1, title: 'All' },
            ]"
            style="inline-size: 6.25rem;"
            @update:model-value="itemsPerPage = parseInt($event, 10)"
          />
        </div> -->
        <VSpacer />

        <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
         
          <div style="inline-size: 15.625rem;">
            <AppTextField
              v-model="search"
              placeholder="Search Tasks"
            />
          </div>
          
            <VBtn
            prepend-icon="tabler-plus"
            @click="[isAddTasksOrdersDrawerDrawerVisible = true]"
            v-if="$can('read', 'Tasks Add')"
          >
            Add Open Tasks/Orders
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <VDataTableServer
              v-model:items-per-page="itemsPerPage"
              :headers="headers"
              :items="serverItems"
              item-value="id"
              class="text-no-wrap"
              :items-length="totalItems"
              :loading="loading"
              :search="search"
              :item-value="name"
              @update:options="loadItems"
            >
        
      
      <template #item.due_date="{ item }">
            <div class="text-body-1 text-high-emphasis text-capitalize">
                {{ dateFormat(item.due_date) }} 
            </div>
            </template>
        <template #item.activityStatus="{ item }">
          <VChip
            size="small"
            color="primary"
          >
            <span class="font-weight-medium">{{ item.activityStatus }}</span>
          </VChip>
          <!-- <VSelect :width="200"
            v-model="item.activityStatus"
             :items="['Created', 'Completed', 'InProgress']"
             @update:modelValue="onStatusChange(item)"
          > -->
          <!-- </VSelect> -->
        </template>

        
        <template #item.actions="{ item }">
          <IconBtn @click="editTask(item)" v-if="$can('read', 'Tasks Edit')">
            <VIcon icon="tabler-edit" />
          </IconBtn>
        </template>
       

        
        <!-- <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalUsers"
          />
        </template> -->
      </VDataTableServer>

    </VCard>
    
    <AddTasksOrdersDrawer
      v-model:isDrawerOpen="isAddTasksOrdersDrawerDrawerVisible"
      @addTask="AddNewTask"
      
    />
    <EditTasksOrdersDrawer
      v-model:isDrawerOpen="isEditTasksOrdersDrawerVisible"
      @updateTask="updateTask"
      :taskData="filterHealthMaintance"
    />

    
   
  </section>
</template>
