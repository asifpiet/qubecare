<script setup>
import { formatToCustomDate, formatToMonthDate } from '@/plugins/globalFunctions';
import actions from '@/views/apps/user/actions.vue';
import AddHealthAndMaintanceDrawer from '@/views/apps/user/HealthAndMaintance/AddhealthAndMantainceDrawer.vue';
import EditHealthAndMantaince from '@/views/apps/user/HealthAndMaintance/EdithealthAndMantainceDrawer.vue';
import Tasks from '@/views/apps/user/list/tasks.vue';
import TextMessage from '@/views/apps/user/list/TextMessage.vue';
import Vitals from '@/views/apps/user/list/vitals.vue';
import ViewTask from '@/views/apps/user/tasks/viewtask.vue';
import { useStore } from 'vuex';
const store = useStore()
const searchQuery = ref('')
const selectedRole = ref()
const isLoading = ref(false)
const selectedPlan = ref()
const selectedStatus = ref()
const itemsPerPage = ref(10)
const filtertask = ref(null)
const isViewtaskDialogVisible = ref(false)
const isActionDialogVisible = ref(false)
const isEditNewUserDrawerVisible = ref(false)
const isTextMessageUserDrawerVisible = ref(false)
const isTaskUserDrawerVisible = ref(false)
const isVitalDrawerVisible = ref(false)
const filterHeathMantainceData = ref(null)
const isTonalSnackbarVisible = ref(false)
const isAddHealthMaintanceDrawerVisible = ref(false)
const isEditHealthMaintanceDrawerVisible = ref(false)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const selectedRows = ref([])
const patientToEdit  = ref();
const isDisable = ref();
const filterHealthMaintance = ref()

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
    title: 'Date',
    key: 'due_date',
  },
  {
    title: 'Detail',
    key: 'activityMessage',
  },
];

const openTextMessageDrawn = ()=> {
  isActionDialogVisible.value = false;
  isTextMessageUserDrawerVisible.value = true;
}
const openTaskDrawan = ()=> {
  isActionDialogVisible.value = false;
  isTaskUserDrawerVisible.value = true;
}
const openVitalUserDrawan = ()=> {
  isActionDialogVisible.value = false;
  isVitalDrawerVisible.value = true;
}

const closeForm = (val) => {
  console.log("cvas",valid);
  isAddNewUserDrawerVisible.value = false;
  // emit('update:isDrawerOpen', val)
}


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
const updateNewUser = async healthData => {
  isLoading.value= true;
  const res = await $api('/api/apps/users/'+healthData.id, {
    method: 'PUT',
    body: healthData,
  });
  console.log("res",res);
  fetchUsers()
  isLoading.value= false;
  isTonalSnackbarVisible.value= true;
  isAddHealthMaintanceDrawerVisible.value = false;
  isEditHealthMaintanceDrawerVisible.value = false;
  emit('update:isDrawerOpen', false)

}

const deleteUser = async id => {
  await $api(`/apps/users/${ id }`, { method: 'DELETE' })
  const index = selectedRows.value.findIndex(row => row === id)
  if (index !== -1)
    selectedRows.value.splice(index, 1)
    fetchUsers()
}

const editPatient = async hid => {
  isEditHealthMaintanceDrawerVisible.value = true;
  let pid = store.getters.getPatientPorfile.patientId;
  const res = await $api('/api/apps/users/'+pid, {
    method: 'GET',
  });
  console.log("sad", res);
  filterHealthMaintance.value = res.healthMantaince.filter(row => row.id === hid)
  console.log("filterHealthMaintance",filterHealthMaintance.value);
}


const showDetail = async(tid) => {
  isViewtaskDialogVisible.value = true;
  let pid = store.getters.getPatientPorfile.patientId;
    const res = await $api('/api/apps/users/'+pid, {
    method: 'GET',
    });
    console.log("viewTask",res.tasks);
    filtertask.value = res.tasks.filter(row => row.id === tid)
    console.log("filterTask",filtertask.value)
 }

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
    Health Maintenance saved
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
            {{ formatToMonthDate(item.due_date) }}
          </div>
        </template>
        <template #item.activityMessage="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            <strong class="cursor-pointer" style="text-decoration-line: underline;" @click="showDetail(item.id)">{{ item.activityMessage }}</strong>
            <div>{{ item.activityStatus }} {{ item.activityMessage }} {{  formatToCustomDate(item.activityDueDate) }} - Assigned by {{ item.task_owner  }}</div>
          <div>{{ item.notes}}</div>
          </div>
        </template>

        

        
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalUsers"
          />
        </template>
      </VDataTableServer>
      <VDialog
          v-model="isViewtaskDialogVisible"
          width="600"
        >
        <DialogCloseBtn @click="isViewtaskDialogVisible = false" />
        <VCard title="Task information">
        <VCardText>
            <ViewTask  :viewTaskData="filtertask"/>
          </VCardText>
        </VCard> 
      </VDialog>


        <VDialog
          v-model="isActionDialogVisible"
          width="500"
        >
        <DialogCloseBtn @click="isActionDialogVisible = false" />
        <VCard>
        <VCardText>
          <actions 
              @openTextMessage="openTextMessageDrawn"
              @openTaskDrawn="openTaskDrawan"
              @openVitalDrawn ="openVitalUserDrawan"
          /> 
          </VCardText>
        </VCard> 
      </VDialog>
    </VCard>
    
    <AddHealthAndMaintanceDrawer
      v-model:isDrawerOpen="isAddHealthMaintanceDrawerVisible"
      @healthMantaince="updateNewUser"
      
    />
    <EditHealthAndMantaince
      v-model:isDrawerOpen="isEditHealthMaintanceDrawerVisible"
      :healthMantainceData="filterHealthMaintance"
      @healthMantaince="updateNewUser"
    />

    <TextMessage  
     v-model:isDrawerOpen="isTextMessageUserDrawerVisible"
    />
    <Tasks   v-model:isDrawerOpen="isTaskUserDrawerVisible" 
      />
      <Vitals 
      v-model:isDrawerOpen="isVitalDrawerVisible" 
      />
  </section>
</template>
