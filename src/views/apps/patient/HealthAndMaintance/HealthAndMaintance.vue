<script setup>
import { dateFormat } from '@/plugins/globalFunctions';
import API from '@/utils/apiDatable';
import AddHealthAndMaintanceDrawer from '@/views/apps/patient/HealthAndMaintance/AddhealthAndMantainceDrawer.vue';
import EditHealthAndMantaince from '@/views/apps/patient/HealthAndMaintance/EdithealthAndMantainceDrawer.vue';
import debounce from 'lodash.debounce';
import { useStore } from 'vuex';
const store = useStore()
const search = ref('')
const searchQuery = ref('')
const selectedRole = ref()
const isLoading = ref(false)
const loading = ref(true);
const selectedPlan = ref()
const selectedStatus = ref()
const itemsPerPage = ref(10)
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
const selectedRows = ref([]);
const serverItems = ref([]);
const patientToEdit  = ref();
const totalItems = ref(0);
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
    title: 'title',
    key: 'title',
  },
  
  {
    title: 'start Date',
    key: 'begdate',
  },
  {
    title: 'End Date',
    key: 'enddate',
  },
 
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    searchable:false
  },
]

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

const loadItems = debounce( async ( { page,  itemsPerPage, sortBy }) =>  {
  const payload = {
    page,
    itemsPerPage,
    sortBy,
    filters:{
    },
    search:search.value,
  }
  console.log("records",page, itemsPerPage, sortBy, store.getters.getPatientPorfile);
  loading.value = true;
  let uuid = store.getters.getPatientPorfile.uuid;
  const data = await API.getDataTableRecord(GET_HEALTH_MAINTANCE_API+'/'+uuid, payload, headers);
  serverItems.value   = data.items;
  totalItems.value = data.total;
  totalUsers.value =data.total
 
 loading.value = false;  
},500);
const totalUsers = ref(0)
// const {
//   data: usersData,
//   execute: fetchUsers,
// } = await useApi(createUrl(HEALTH_MAINTANCE_API, {
//   query: {
//     uuid: store.getters.getPatientPorfile.uuid
//   },
// }))

// const users = computed(() => {
    // isLoading.value = true;
    // console.log("HealthAndMaintance",usersData.value);
    // let id = store.getters.getPatientPorfile.patientId;
    // if(id){
    //     filterHeathMantainceData.value = usersData.value.users.filter(row => row.id === id)
    //     isLoading.value = false; 
    //     return filterHeathMantainceData.value[0].healthMantaince;
        
    // }else{
    //     isLoading.value = false; 
    // return [];
    // }

    // return [];
    
// })
// const totalUsers = computed(() => 0)

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

const updateHealthMantainceData = async healthData => {
  console.log("healthData",healthData);
  isLoading.value= true;
  const res = await $api(UPDATE_HEALTH_MAINTANCE_API+'/'+healthData.patientId, {
    method: 'PUT',
    body: healthData,
  });
  console.log("res",res);
  
  isLoading.value= false;
  isTonalSnackbarVisible.value= true;
  isAddHealthMaintanceDrawerVisible.value = false;
  isEditHealthMaintanceDrawerVisible.value = false;
  emit('update:isDrawerOpen', false)
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });

}

const AddHealthMantainceData = async healthData => {
  isLoading.value= true;
  let uuid = store.getters.getPatientPorfile.uuid;
  const res = await $api(STORE_HEALTH_MAINTANCE_API+'/'+uuid, {
    method: 'POST',
    body: healthData,
  });
  console.log("res",res);
  
  isLoading.value= false;
  isTonalSnackbarVisible.value= true;
  isAddHealthMaintanceDrawerVisible.value = false;
  isEditHealthMaintanceDrawerVisible.value = false;
  emit('update:isDrawerOpen', false)
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });

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
  filterHealthMaintance.value = hid;
  console.log("filterHealthMaintance",filterHealthMaintance.value);
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
    <template #actions>
              <VBtn
                  icon
                  color="white"
                  @click="isTonalSnackbarVisible = false"
                >
                  x
              </VBtn>
    </template>
     </VSnackbar>
  <section>
    <VCard class="mb-6">
      <VCardText class="d-flex flex-wrap gap-4">
        <VSpacer />
        <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
         
          <div style="inline-size: 15.625rem;">
            <AppTextField
              v-model="search"
              placeholder="Search Health Maintenance"
            />
          </div>
            <VBtn
            prepend-icon="tabler-plus"
            @click="[isAddHealthMaintanceDrawerVisible = true]"
            v-if="$can('read', 'Health And Maintenance Add')"
          >
            Add Health Maintenance
          </VBtn>
        </div>
      </VCardText>
      
      <VDivider />

     
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:model-value="selectedRows"
        v-model:page="page"
         :items="serverItems"
        item-value="id"
        :items-length="totalUsers"
        :headers="headers"
        :loading="loading"
        :search="search"
        class="text-no-wrap"
        @update:options="loadItems"
      >
        
      <template #item.begdate="{ item }">
                        <div class="text-body-1 text-high-emphasis text-capitalize">
                            {{ dateFormat(item.begdate) }} 
                        </div>
                        </template>

                        <template #item.enddate="{ item }">
                        <div class="text-body-1 text-high-emphasis text-capitalize">
                            {{ dateFormat(item.enddate) }} 
                        </div>
                        </template>       
                        
                        

        
        <template #item.actions="{ item }">
          <IconBtn @click="editPatient(item)" v-if="$can('read', 'Health And Maintenance Edit')">
            <VIcon icon="tabler-edit" />
          </IconBtn>
        </template>

      </VDataTableServer>
    </VCard>
    
    <AddHealthAndMaintanceDrawer
      v-model:isDrawerOpen="isAddHealthMaintanceDrawerVisible"
      @addhealthMantaince="AddHealthMantainceData"
      
    />
    <EditHealthAndMantaince
      v-model:isDrawerOpen="isEditHealthMaintanceDrawerVisible"
      :healthMantainceData="filterHealthMaintance"
      @updateHealthMantaince="updateHealthMantainceData"
    />

  </section>
</template>
