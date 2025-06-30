<script setup>
import { dateFormate } from '@/plugins/globalFunctions';
import AddTasksOrdersDrawer from '@/views/apps/user/tasksOrders/AddTasksOrdersDrawer.vue';
import EditTasksOrdersDrawer from '@/views/apps/user/tasksOrders/EditTasksOrdersDrawer.vue';
import { useStore } from 'vuex';
const store = useStore()
const searchQuery = ref('')
const selectedRole = ref()
const isLoading = ref(false)
const selectedPlan = ref()
const selectedStatus = ref()
const isDialogVisible = ref(false)
const itemsPerPage = ref(10)
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
  },
  {
    title: 'Alert',
    key: '',
  },
]

const {
  data: usersData,
  execute: fetchUsers,
} = await useApi(createUrl('/apps/users', {
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

const users = computed(() => {
    isLoading.value = true;
    let id = store.getters.getPatientPorfile.patientId;
    if(id){
        filterHeathMantainceData.value = usersData.value.users.filter(row => row.id === id)
        console.log("xcvdasdsds", filterHeathMantainceData.value);
        isLoading.value = false; 
        return filterHeathMantainceData.value[0].tasks;
        
    }else{
        isLoading.value = false; 
        return [];
    }
    
})
const totalUsers = computed(() => filterHeathMantainceData.value[0].tasks.length)

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
const updateNewUser = async tasks => {
  console.log("taskDatAssssif",tasks);
  let pid = store.getters.getPatientPorfile.patientId;
  // let tasks = store.getters.getPatientPorfile.tasks.map((task) => {
  //   if (task.id === taskData.id) {
  //     return {
  //       ...task,
  //       taskData
  //     };
  //   }
  //   return task;
  // });
  
  const userData = {
    id: pid,
    tasks
  }; 
  console.log('??????',userData);
  isLoading.value= true;
  const res = await $api('/api/apps/users/'+pid, {
    method: 'PUT',
    body: userData,
  });
  console.log("resUpdated",res);
  // fetchUsers()
  isLoading.value= false;
  isTonalSnackbarVisible.value= true;
  isAddTasksOrdersDrawerDrawerVisible.value = false;
  isEditTasksOrdersDrawerVisible.value = false;
  emit('update:isDrawerOpen', false)

}

const editTask = async hid => {
  isEditTasksOrdersDrawerVisible.value = true;
  let pid = store.getters.getPatientPorfile.patientId;
  const res = await $api('/api/apps/users/'+pid, {
    method: 'GET',
  });
  console.log("sad", res);
  filterHealthMaintance.value = res.tasks.filter(row => row.id === hid)
  console.log("filterHealthMaintance",filterHealthMaintance.value);
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
console.log("userDataUpdate",userData);
  const res = await $api('/api/apps/users/'+pid, {
    method: 'PUT',
    body: userData,
  });
  console.log("res",res);
  isLoading.value= false;    
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
        <div class="me-3 d-flex gap-3">
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
        </div>
        <VSpacer />

        <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
         
          <div style="inline-size: 15.625rem;">
            <AppTextField
              v-model="searchQuery"
              placeholder="Search User"
            />
          </div>
            <VBtn
            prepend-icon="tabler-plus"
            @click="[isAddTasksOrdersDrawerDrawerVisible = true]"
          >
            Add Open Tasks/Orders
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

     
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:model-value="selectedRows"
        v-model:page="page"
        :items="users"
        item-value="id"
        :items-length="totalUsers"
        :headers="headers"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        
      
      <template #item.due_date="{ item }">
            <div class="text-body-1 text-high-emphasis text-capitalize">
                {{ dateFormate(item.due_date) }} 
            </div>
            </template>
        <template #item.activityStatus="{ item }">

          <VSelect :width="200"
            v-model="item.activityStatus"
             :items="['Created', 'Completed', 'InProgress']"
             @update:modelValue="onStatusChange(item)"
          >
          </VSelect>
        </template>

        
        <template #item.actions="{ item }">
          <IconBtn @click="editTask(item.id)">
            <VIcon icon="tabler-edit" />
          </IconBtn>
        </template>
       

        
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalUsers"
          />
        </template>
      </VDataTableServer>

    </VCard>
    
    <AddTasksOrdersDrawer
      v-model:isDrawerOpen="isAddTasksOrdersDrawerDrawerVisible"
      @addTask="updateNewUser"
      
    />
    <EditTasksOrdersDrawer
      v-model:isDrawerOpen="isEditTasksOrdersDrawerVisible"
      @updateTask="updateNewUser"
      :taskData="filterHealthMaintance"
    />

    
   
  </section>
</template>
