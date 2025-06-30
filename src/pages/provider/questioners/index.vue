<script setup>
import AddQuestioners from '@/pages/provider/questioners/AddQuestioners.vue';
import EditQuestioners from '@/pages/provider/questioners/EditQuestioners.vue';
import API from '@/utils/apiDatable';
import debounce from 'lodash.debounce';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const search = ref('')
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);
const itemsPerPage = ref(10);
const store = useStore();
const router = useRouter();
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const items = ref([]);
const isDialogVisibleUpdate = ref(false);
const formId = ref();
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: false,
  },
  userForm: {
    type: String,
    required: false,
  },
})
const emit = defineEmits(['handleDialog'])
const headers = [
{ title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false ,searchable:false },
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
  const data = await API.getDataTableRecord(GET_QUESTIONER_QUESTIONS, payload, headers);
  console.log(data.total)
  serverItems.value   = data.items;
  totalItems.value = data.total;
  loading.value = false;  
}, 500);
onMounted(async () => {
 
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
});



const addNewItem = () => {
  router.push({ name: 'admin-add-questioners' });
};

const editItem = (item) => {
  formId.value=item.id
  isDialogVisibleUpdate.value=true
};



const deleteItem = async(item) => {
    await store.dispatch('deleteQuestionerQuestionsForm',{ id: item.id});
    //await store.dispatch('getQuestionerQuestionsFormList');
    //items.value = store.getters.getQuestionerQuestions;
  //console.log('Delete item', item.id);
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
  emit('handleDialog',false)
};
const handleSubmit = async (msg) => {
  if (msg == 'success') {
    console.log(props.isDialogVisible)
    isDialogVisibleUpdate.value=false
    emit('handleDialog',false)
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
  }


};
const clickDialogCancel = async (msg) => {
  emit('handleDialog',false)

};
</script>

<template>

      <VCardItem class="pb-4">
        <VCardTitle>Questioners</VCardTitle>
      </VCardItem>
      <VDivider />
    
    <div class="app-user-search-filter d-flex align-center flex-wrap gap-4" style="margin: 10px; justify-content: flex-end;">  
         
        <div style="inline-size: 15.625rem;">  
          <AppTextField v-model="search" placeholder="Search Questioners" />  
        </div>  
      
      </div>  
      <VDivider />
    <VDataTableServer
                v-model:items-per-page="itemsPerPage"
                v-model:model-value="selectedRows"
                :headers="headers"
                :items="serverItems"
                :items-length="totalItems"
                :loading="loading"
                :search="search"
                item-value="id"
                @update:options="loadItems"
                :sort-by="sortByData"
                class="text-no-wrap"
             
            >
      <!-- Custom slot for the Status column -->
      <template v-slot:[`item.status`]="{ item }">
        <span>{{ item.status == 1 ? 'Active' : 'Deactive' }}</span>

      </template>

      <!-- Actions slot for edit and delete buttons -->
      <template v-slot:[`item.actions`]="{ item }">
        <IconBtn @click="editItem(item)" v-if="$can('read', 'Questionnaire Edit')">
          <VIcon icon="tabler-edit" />
        </IconBtn>
        <IconBtn @click="deleteItem(item)" v-if="$can('read', 'Questionnaire Delete')">
          <VIcon icon="tabler-trash" />
        </IconBtn>
      </template>
    </VDataTableServer>

  <VDialog
    v-model="props.isDialogVisible"
    max-width="800"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="clickDialogCancel" />
    <AddQuestioners v-if="props.userForm=='Questioners Form For Product'"  @submit="handleSubmit"/>
   
    
    </VDialog>
    <VDialog
    v-model="isDialogVisibleUpdate"
    max-width="800"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisibleUpdate = !isDialogVisibleUpdate" />
    <EditQuestioners v-if="props.userForm=='Questioners Form For Product'" :formId="formId" @submit="handleSubmit"/>
   
    
    </VDialog>
</template>

<style scoped>
  .mt-4 {
    margin-top: 16px;
  }
</style>
