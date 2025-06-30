<script setup>
import API from '@/utils/apiDatable';
import debounce from 'lodash.debounce';
import { useStore } from 'vuex';
const store = useStore()
const searchQuery = ref('')
const isLoading = ref(false)
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const isActionDialogVisible = ref(false)
const isEditNewUserDrawerVisible = ref(false)
const isTextMessageUserDrawerVisible = ref(false)
const isTaskUserDrawerVisible = ref(false)
const isVitalDrawerVisible = ref(false)
const isLabDiagnosticsDrawerVisible = ref(false)
const isSubmitIntakesDrawerVisible = ref(false)
const isAddNewUserDrawerVisible = ref(false)
const isDocumentDrawerVisible = ref(false)
const isAddOrderDrawerVisible = ref(false)
const isPurchaseHistoryDrawerVisible = ref(false)
const isInventoryLogDrawerVisible = ref(false)
const isCategorizeItemDrawerVisible = ref(false)
const isEditGroupItemDrawerVisible = ref(false)
const isEditInventoryDrawerVisible = ref(false)
const isTonalSnackbarVisible = ref(false)
const isDeleteTonalSnackbarVisible = ref();
const selectedMore = ref()
const page = ref(1)
const sortByData = ref([{'key':'id','order':'desc'}])
const orderBy = ref()
const selectedRows = ref([])
const patientToEdit  = ref();
const isDisable = ref();
const search = ref('')
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);
const itemsPerPage = ref(10);
const editItem=ref({})
const emit = defineEmits([
  'saveProductData'

]);
const headers = [
{
    title: 'Title',
    key: 'title',
  },
  {
    title: 'Start Date',
    key: 'start_date',
  },
  {
    title: 'End Date',
    key: 'end_date',
  },
  {
    title: 'Status',
    key: 'status',
  },
  
  // {
  //   title: 'Actions',
  //   key: 'actions',
  //   sortable: false,
  //   searchable:false
  // },
]

const loadItems = debounce( async ( { page,  itemsPerPage, sortBy }) =>  {
  const payload = {
    page,
    itemsPerPage,
    sortBy,
    filters:{
    },
    search:search.value,
  }
  sortByData.value=sortBy
  console.log("records",page, itemsPerPage, sortBy);
  loading.value = true;
  let id = localStorage.getItem('LoginUserId');
  const data = await API.getDataTableRecord(PATIENT_PORTAL_PRESCRIPTION_API+'/'+id, payload, headers);
  console.log(data.total)
  serverItems.value   = data.items;
  totalItems.value = data.total;
  loading.value = false;  
},500);



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
  
}

const deleteUser = async(id) => {
  await store.dispatch('deleteInventory', {
    id
  })
  isDeleteTonalSnackbarVisible.value = true
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
}


onMounted(async () => {
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [{'key':'id','order':'desc'}] });
})
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

watch(selectedMore, async  (newValue) => {
  console.log("Selected Location:", newValue);
  selectedMore.value = '';
});

const EditDetail = async(item) => {
  editItem.value = item
  isEditInventoryDrawerVisible.value = true;
}

// const setNotifcation = () => {
//   isAddOrderDrawerVisible.value = false;
//   isTonalSnackbarVisible.value = true;
//   isEditInventoryDrawerVisible.value = false;
//   isAddNewUserDrawerVisible.value=false
//   loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
// }


const saveCategory = async(category) => {
    await store.dispatch('saveCategory',{
      category
    })
    isAddNewUserDrawerVisible.value = false;
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
}
const updateCategory = async(category) => {
    await store.dispatch('updateCategory',{
      category
    })
    isAddNewUserDrawerVisible.value = false;
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
} 
</script>

<template>
  <section>
  
    <VDialog v-model="isLoading" width="110" height="150" color="primary">
        <VCardText class="" style="color: white !important;">
          <div class="demo-space-x">
            <VProgressCircular :size="40" color="primary" indeterminate />
          </div>
        </VCardText>
      </VDialog>
      <VCardItem class="pb-4">
        <VCardTitle>Prescription</VCardTitle>
      </VCardItem>
      <VDivider />

      <VDivider />

     
      <VDataTableServer
      v-model:items-per-page="itemsPerPage"
              :headers="headers"
              :items="serverItems"
              :items-length="totalItems"
              :loading="loading"
              :search="search"
              item-value="id"
              :sort-by="sortByData"
              @update:options="loadItems"
              class="text-no-wrap"
      >
        
      <template #item.name="{ item }">
                <div class="d-flex align-center gap-x-4">
                    <span @click="EditDetail(item)" class="cursor-pointer text-primary"style="text-decoration: underline;">{{ item.name }} </span>
                  </div>
      </template>

        
        <!-- <template #item.actions="{ item }">
          <IconBtn @click="deleteUser(item.id)"   v-if="$can('read', 'Category Delete')">
            <VIcon icon="tabler-trash" />
          </IconBtn>
        </template> -->

        
        
      </VDataTableServer>
    
    

   
    
   
    
    
  
  
   
    
     
      
     
  </section>
</template>
<style scoped>
::v-deep .v-data-table .v-data-table__wrapper::-webkit-scrollbar {
  width:10px;
}
</style>
