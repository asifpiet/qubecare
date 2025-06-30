<script setup>
import AddVital from '@/views/apps/user/vitals/addvital.vue';
import EditVital from '@/views/apps/user/vitals/editVital.vue';
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
const isVitalDialogVisible = ref(false)
const isEditVitalDialogVisible = ref(false)
const filterVital = ref(null)
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
const filterVitalData = ref([])
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isDataEnable:{
    type: Boolean,
  }
})
const fullname =  computed(() => {
    fullName.value = store.getters.getPatientPorfile.firstName+' '+store.getters.getPatientPorfile.lastName;
    
     console.log("fullname",fullName.value);
})

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
    title: 'Date of Visit',
    key: 'created_date',
  },
  {
    title: 'Action',
    key:    'actions',
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

const users = computed(() => {
    return [];
    let id = store.getters.getPatientPorfile.patientId;
    if(id){
        filterVitalData.value = usersData.value.users.filter(row => row.id === id)
        return filterVitalData.value && filterVitalData.value[0]
          ? filterVitalData.value[0].vitals
          : 0;
        
    }else{
        return [];
    }   
})

const totalUsers = computed(() => {
  return filterVitalData.value && filterVitalData.value[0]
    ? filterVitalData.value[0].vitals.length
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
  console.log("updateNewUser",userData);
  const res = await $api('/api'+PATIENT_API+'/'+userData.id, {
    method: 'PUT',
    body: userData,
  });
  isVitalDialogVisible.value= false;
  isEditVitalDialogVisible.value=false;
  isTonalSnackbarVisible.value = true;
  
  isLoading.value = false;
  console.log("res",res);
  fetchUsers()
}
const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const editVital = async(vid) => {
  isLoading.value = true;
  isEditVitalDialogVisible.value =true;
  let pid = store.getters.getPatientPorfile.patientId;
    const res = await $api('/api'+PATIENT_API+'/'+pid, {
    method: 'GET',
    });
    filterVital.value = res.vitals.filter(row => row.id === vid)
    console.log("filterVital",filterVital.value)
    isLoading.value = false;
}

const deleteVital = async vid => {
  console.log('filterVital', filterVitalData.value[0].vitals);
  // Get the vitals array
  let vitals = filterVitalData.value[0].vitals;
  
  isLoading.value = true;
  
  // Find the index of the row with the matching id
  const index = vitals.filter(row => row.id === vid);
  
  // Check if the index exists
  if (index !== -1) {
    // Remove the item from the array
    vitals.splice(index, 1);
    
  } else {
    console.log('Row not found');
  }

  // Fetch users (assuming this updates your data)
  // fetchUsers();
  
  isLoading.value = false;
};


const  formatDate = (dateString) => {
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
      <VSnackbar
      v-model="isTonalSnackbarVisible"
      location="top end"
      variant="flat"
      color="success"
    >
      Patient Vital saved.
    </VSnackbar>
    
    <VNavigationDrawer
    temporary
    :width="800"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
   
  >
 
    <AppDrawerHeaderSection
      :title='"Vitals ("+fullName+")"' 
      @cancel="closeNavigationDrawer"
    />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText class="d-flex flex-wrap gap-4">
        <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
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
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        
          <div style="inline-size: 15.625rem;">
            <AppTextField
              v-model="searchQuery"
              placeholder="Search User"
            />
          </div>
          
            <!-- <VBtn  prepend-icon="tabler-plus"> New Template</VBtn> -->
            <VBtn
                prepend-icon="tabler-plus"
                @click="isVitalDialogVisible=true"  class=""
            >
                New Vital1
            </VBtn>
        </div>
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
        
            <template #item.created_date="{ item }">
                <div class="d-flex align-center gap-x-4">
                    <span>{{ dateFormat(item.created_date) }} </span>
                  </div>
            </template>

            <template #item.actions="{ item }">
          <IconBtn @click="editVital(item.id)">
            <VIcon icon="tabler-edit" />
          </IconBtn>
          <IconBtn @click="deleteVital(item.id)">
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
                   
         </VCardText>
      </VCard>
      <VDialog
          v-model="isVitalDialogVisible"
          width="600"
        >
        <DialogCloseBtn @click="isVitalDialogVisible = false" />
        <VCard title="Create New Vital">
        <VCardText>
            <AddVital  @addVital="updateNewUser"/>
          </VCardText>
        </VCard> 
      </VDialog>
      <VDialog
          v-model="isEditVitalDialogVisible"
          width="600"
        >
        <DialogCloseBtn @click="isEditVitalDialogVisible = false" />
        <VCard title="Edit  Patient Vital">
        <VCardText>
            <EditVital  :editVitalData="filterVital" 
                @editVital=updateNewUser 
              />
          </VCardText>
        </VCard> 
      </VDialog>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
