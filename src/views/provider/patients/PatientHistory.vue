<script setup>
import { dateFormat } from '@/plugins/globalFunctions';
import { usePatientStore } from '@/stores/patientStore';
import AddSupperBills from '@/views/apps/user/PatientHistory/AddSupperBills.vue';
const patientStore = usePatientStore()
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);
const isAddPatientBillingDrawerVisible = ref(false)
const isActionDialogVisible = ref(false)
const patientNotes = ref()
const route = useRoute()
const patientId = route.params.id;
const emit = defineEmits([
    'update:isDrawerOpen',
    'healthMantaince'
]);

const reload = () => dataTable.value.reload()
const headers = [
  {
    title: 'Date',
    key: 'Date',
  },
  {
    title: 'Provider',
    key: 'provider',
  },
  {
    title: 'Patient',
    key: 'patient',
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
    key: 'billing',
  },
  {
    title: 'Claimed   (Claim) - (Paid)',
    key: 'claim',
  },
]


onMounted(async () => {
  

//   console.log("getPatientProfile", store.getters.getPatientPorfile.uuid);
//   patientId.value = store.getters.getPatientPorfile.uuid
//   loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
  //await store.dispatch('getListTask',{id:patientId.value});
 // taskList.value=store.getters.getTaskList
  // console.log('ddddd',taskList.value)

})
// const totalUsers = ref(0)


// const loadItems = debounce( async ( { page,  itemsPerPage, sortBy }) =>  {
//   console.log('loadItems');
//   const payload = {
//     page,
//     itemsPerPage,
//     sortBy,
//     filters:{
//     },
//     search:search.value,
//   }
//   console.log("records",page, itemsPerPage, sortBy);
//   loading.value = true;
//   const data = await API.getDataTableRecord(PATIENT_HISTORY_API +'/'+store.getters.getPatientPorfile.uuid, payload, headers);
//   console.log(data.total)
//   serverItems.value   = data.items;
//   totalItems.value = data.total;
//   totalUsers.value =data.total
//   loading.value = false;  
// },500);
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
// const updateNewUser = async healthData => {
//   isLoading.value= true;
//   const res = await $api('/api/apps/users/'+healthData.id, {
//     method: 'PUT',
//     body: healthData,
//   });
//   console.log("res",res);
//   fetchUsers()
//   isLoading.value= false;
//   isTonalSnackbarVisible.value= true;
//   isAddHealthMaintanceDrawerVisible.value = false;
//   isEditHealthMaintanceDrawerVisible.value = false;
//   emit('update:isDrawerOpen', false)

// }

// const deleteUser = async id => {
//   await $api(`/apps/users/${ id }`, { method: 'DELETE' })
//   const index = selectedRows.value.findIndex(row => row === id)
//   if (index !== -1)
//     selectedRows.value.splice(index, 1)
//     fetchUsers()
// }

// const editPatient = async hid => {
//   isEditHealthMaintanceDrawerVisible.value = true;
//   let pid = store.getters.getPatientPorfile.patientId;
//   const res = await $api('/api/apps/users/'+pid, {
//     method: 'GET',
//   });
//   console.log("sad", res);
//   filterHealthMaintance.value = res.healthMantaince.filter(row => row.id === hid)
//   console.log("filterHealthMaintance",filterHealthMaintance.value);
// }

const patientNote = (note) => {
  isActionDialogVisible.value = true;
  patientNotes.value = note;
}
</script>

<template>
     
    <section>
        <DataTable ref="dataTable" :cardTitle="$t('Patient History')" :headers="headers"
            :api="PATIENT_HISTORY_API+'/'+patientId" :sortBy="sortByData">
            <template #item.Date="{ item }" :width="200">
            <!-- <p class="pt-5 mb-0"> {{ item.patient_name }}</p> -->
            <p class="">{{ dateFormat(item.Date)}}</p>
         </template>
          <template #item.provider="{ item }" :width="200">
            <!-- <p class="pt-5 mb-0"> {{ item.patient_name }}</p> -->
            <p class="cursor-pointer text-primary mb-0"  style="text-decoration-line:underline">{{ item.provider}}</p>
         </template>
          <template #item.patient="{ item }" :width="200">
            <!-- <p class="pt-5 mb-0"> {{ item.patient_name }}</p> -->
            <p class="cursor-pointer text-primary mb-0"  style="text-decoration-line:underline" @click="patientNote(item.Reason)">Note</p>
         </template>
         <template #item.id="{ item }" :width="200">
            <VBtn prepend-icon="tabler-plus" class="mr-3" @click="isAddPatientBillingDrawerVisible = true">
              SuperBills
            </VBtn>
            <VBtn prepend-icon="tabler-plus">
              Claim
            </VBtn>
         </template>
      
         <template #item.billing="{ item }" :width="200">
            
          <div v-for="(superbill, index) in item.billing" :key="index">
            
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

        <template #item.claim="{ item }" :width="200">
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
        </DataTable>
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
            <!-- <VBtn @click="isActionDialogVisible = false" class="mr-2">
              Update Note
            </VBtn> -->
            <VBtn @click="isActionDialogVisible = false">
              Close
            </VBtn>
          </VCardText>
        </VCard> 
      </VDialog>
  </section>
</template>
