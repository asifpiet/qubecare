<script setup>
// import { PATIENT_LIST_API } from '@/utils/constants';
import actions from '@/views/apps/user/actions.vue';
import EditNewUserDrawer from '@/views/apps/user/edit/EditNewUserDrawer.vue';
import AddNewUserDrawer from '@/views/apps/user/list/AddNewUserDrawer.vue';
import TextMessage from '@/views/apps/user/list/TextMessage.vue';
import Tasks from '@/views/apps/user/list/tasks.vue';
import Vitals from '@/views/apps/user/list/vitals.vue';
import { useStore } from 'vuex';
const store = useStore()
const searchQuery = ref('')
const itemsPerPage = ref(10)
const isActionDialogVisible = ref(false)
const isEditNewUserDrawerVisible = ref(false)
const isTextMessageUserDrawerVisible = ref(false)
const isTaskUserDrawerVisible = ref(false)
const isVitalDrawerVisible = ref(false)
const isAddNewUserDrawerVisible = ref(false)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const selectedRows = ref([])
const isDisable = ref();

const emit = defineEmits([
  'openTextMessage',
  'openTaskDrawn',
  'openVitalDrawn',
]);
const headers = [
{
    title: 'Room Name',
    key: 'room_name',
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]
const updateOptions = options => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}
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
// const {
//   data: usersData,
//   execute: fetchUsers,
// } = await useApi(createUrl('/apps/users/', {
//   query: {
//     q: searchQuery,
//     status: selectedStatus,
//     plan: selectedPlan,
//     role: selectedRole,
//     itemsPerPage,
//     page,
//     sortBy,
//     orderBy,
//   },
// }))

const users = computed(() => {
  console.log("getLocation", store.getters.getLocation);
  let data = store.getters.getLocation
  return data.rooms;
})
const totalUsers = computed(() => store.getters.getLocation.rooms)

const roles = [
  {
    title: 'Admin',
    value: 'admin',
  },
  {
    title: 'Author',
    value: 'author',
  },
  {
    title: 'Editor',
    value: 'editor',
  },
  {
    title: 'Maintainer',
    value: 'maintainer',
  },
  {
    title: 'Subscriber',
    value: 'subscriber',
  },
]

const plans = [
  {
    title: 'Basic',
    value: 'basic',
  },
  {
    title: 'Company',
    value: 'company',
  },
  {
    title: 'Enterprise',
    value: 'enterprise',
  },
  {
    title: 'Team',
    value: 'team',
  },
]

const status = [
  {
    title: 'Pending',
    value: 'pending',
  },
  {
    title: 'Active',
    value: 'active',
  },
  {
    title: 'Inactive',
    value: 'inactive',
  },
]

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
const addNewUser = async userData => {
  if(userData.id == null){
      console.log("userData",userData);
      await $api('/apps/users', {
      method: 'POST',
      body: userData,
    });
  }else{
    updateNewUser(userData);
  }
  if(userData.checkIsFormOpen == "saveClose"){
    isTabEnable();
  }
  fetchUsers()
}

const updateNewUser = async userData => {
  console.log("updateNewUser",userData);
  const res = await $api('/api/apps/users/'+userData.id, {
    method: 'PUT',
    body: userData,
  });
  console.log("resUpdate",res);
  fetchUsers()
}

const deleteUser = async id => {
  await $api(`/apps/users/${ id }`, { method: 'DELETE' })
  const index = selectedRows.value.findIndex(row => row === id)
  if (index !== -1)
    selectedRows.value.splice(index, 1)
    fetchUsers()
}

const editPatient = async id => {
  isEditNewUserDrawerVisible.value = true;
  const res = await $api('/api/apps/users/'+id, {
    method: 'GET',
  });
  
  await store.dispatch('editPatientProfile', {
    res
  })
  console.log("res1edit",res);
}

const isTabEnable = async() => {
  isDisable.value = true  
  await store.dispatch('savePatientPorfile', {
      patientId: null,
      firstName: null,
      lastName:null
  })   
}
const actionBox = async(id) => {
  const res = await $api('/api/apps/users/'+id, {
    method: 'GET',
  });
  // patientToEdit.value = res;
  await store.dispatch('editPatientProfile', {
    res
  })
  console.log("res1",res); 
}
const widgetData = ref([
  {
    title: 'Session',
    value: '21,459',
    change: 29,
    desc: 'Total Users',
    icon: 'tabler-users',
    iconColor: 'primary',
  },
  {
    title: 'Paid Users',
    value: '4,567',
    change: 18,
    desc: 'Last Week Analytics',
    icon: 'tabler-user-plus',
    iconColor: 'error',
  },
  {
    title: 'Active Users',
    value: '19,860',
    change: -14,
    desc: 'Last Week Analytics',
    icon: 'tabler-user-check',
    iconColor: 'success',
  },
  {
    title: 'Pending Users',
    value: '237',
    change: 42,
    desc: 'Last Week Analytics',
    icon: 'tabler-user-search',
    iconColor: 'warning',
  },
])
</script>

<template>
  <section>
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
              placeholder="Search Room"
            />
          </div>

         
          <VBtn
            prepend-icon="tabler-plus"
            @click="[isAddNewUserDrawerVisible = true, isTabEnable()]"
          >
            Add Room
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
       

        
        <template #item.actions="{ item }">
          <IconBtn @click="editPatient(item.id)">
            <VIcon icon="tabler-edit" />
          </IconBtn>
          <IconBtn @click="deleteUser(item.id)">
            <VIcon icon="tabler-trash" />
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
   
    
    <AddNewUserDrawer
      v-model:isDrawerOpen="isAddNewUserDrawerVisible"
      @user-data="addNewUser"
      @update-user-data="updateNewUser"
      :isDataEnable=true

     
    />
    <EditNewUserDrawer
      v-model:isDrawerOpen="isEditNewUserDrawerVisible"
      @update-user-data="updateNewUser"
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
