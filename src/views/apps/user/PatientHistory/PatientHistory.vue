<script setup>
import AddSupperBills from '@/views/apps/user/PatientHistory/AddSupperBills.vue';
import { useStore } from 'vuex';
const store = useStore()
const isEditNewUserDrawerVisible = ref(false)
const isTextMessageUserDrawerVisible = ref(false)
const isTaskUserDrawerVisible = ref(false)
const isVitalDrawerVisible = ref(false)
const filterHeathMantainceData = ref(null)
const isTonalSnackbarVisible = ref(false)
const isAddHealthMaintanceDrawerVisible = ref(false)
const isEditHealthMaintanceDrawerVisible = ref(false)
const isAddPatientBillingDrawerVisible = ref(false)
const isActionDialogVisible = ref(false)
const isLoading = ref(false)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const selectedRows = ref([])
const patientToEdit  = ref();
const isDisable = ref();
const patientNotes = ref()
const searchQuery = ref()
const selectedStatus = ref()
const selectedPlan = ref()
const selectedRole = ref()
const filterHealthMaintance = ref()
const itemsPerPage = ref(10)
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
    key: 'date',
  },
  {
    title: 'Patient',
    key: 'patient_name',
  },
  {
    title: 'Appiontment',
    key: 'appiontment',
  },
  {
    title: 'Charting',
    key: 'id',
  },
  {
    title: 'SuperBills  (Total) -  (Paid)',
    key: 'superbills',
  },
  {
    title: 'Claimed   (Claim) - (Paid)',
    key: 'claims',
  },
]

const openTextMessageDrawn = ()=> {
 
  isTextMessageUserDrawerVisible.value = true;
}
const openTaskDrawan = ()=> {
  
  isTaskUserDrawerVisible.value = true;
}
const openVitalUserDrawan = ()=> {
  
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
        return filterHeathMantainceData.value[0].patient_history;
        
    }else{
        isLoading.value = false; 
        return [];
    }
    isLoading.value = false; 
    
})
const totalUsers = computed(() => filterHeathMantainceData.value[0].patient_history.length)

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

const patientNote = () => {
  isActionDialogVisible.value = true;
  patientNotes.value = 'This is test Notes';
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
            <VBtn
            prepend-icon="tabler-plus"
            @click="[isAddHealthMaintanceDrawerVisible = true]"
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
        :items="users"
        item-value="id"
        :items-length="totalUsers"
        :headers="headers"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        
      <template #item.patient_name="{ item }" :width="200">
            <p class="pt-5 mb-0"> {{ item.patient_name }}</p>
            <p class="cursor-pointer text-primary mb-0" style="text-decoration-line:underline" @click="patientNote()">Note</p>
         </template>
         <template #item.id="{ item }" :width="200">
            <VBtn prepend-icon="tabler-plus" class="mr-3" @click="isAddPatientBillingDrawerVisible = true">
              SuperBills
            </VBtn>
            <VBtn prepend-icon="tabler-plus">
              Claim
            </VBtn>
         </template>
      
         <template #item.superbills="{ item }" :width="200">
            
          <div v-for="(superbill, index) in item.superbills" :key="index">
            
            <span>
            <IconBtn @click="editSuperbill(item.id, index)">
              <VIcon icon="tabler-edit" /> 
            </IconBtn>
            <IconBtn @click="deleteSuperbill(item.id, index)">
              <VIcon icon="tabler-trash" /> 
            </IconBtn>
              (${{ superbill.total }})  -  (${{ superbill.paid }})</span>
          </div>
        </template>

        <template #item.claims="{ item }" :width="200">
          <div v-for="(claim, index) in item.claims" :key="index">
            <span>
              <IconBtn @click="editClaim(item.id, index)">
                <VIcon icon="tabler-edit" /> 
              </IconBtn>
              <IconBtn @click="deleteClaim(item.id, index)">
                <VIcon icon="tabler-trash" /> 
              </IconBtn>
               (${{ claim.claimed }}) -   (${{ claim.paid }})</span>
            
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
    </VCard>
    
    <AddSupperBills
      v-model:isDrawerOpen="isAddPatientBillingDrawerVisible"
    />
      <VDialog
          v-model="isActionDialogVisible"
          width="500"
        >
        <DialogCloseBtn @click="isActionDialogVisible =false" />
        <VCard>
        <VCardText>
            <v-textarea v-model="patientNotes"> 
          </v-textarea>

          </VCardText>
          <VCardText class="d-flex justify-end">
            <VBtn @click="isActionDialogVisible = false" class="mr-2">
              Update Note
            </VBtn>
            <VBtn @click="isActionDialogVisible = false">
              Close
            </VBtn>
          </VCardText>
        </VCard> 
      </VDialog>
  </section>
</template>
