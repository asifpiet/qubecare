<script setup>
import intakeQuestion from '@/pages/provider/intakeQuestion/AddIntakeQuestions.vue';
import EditIntakeQuestions from '@/pages/provider/intakeQuestion/EditIntakeQuestions.vue';

import API from '@/utils/apiDatable';
import debounce from 'lodash.debounce';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const store = useStore();
const router = useRouter();
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const search = ref('')
const serverItems = ref([]);
const loading = ref(true);
const isDialogVisibleUpdate = ref(false);
const formId = ref();

const totalItems = ref(0);
const itemsPerPage = ref(5);
const items = ref([]);
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


const emit = defineEmits(['handleDialog', 'total'])
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false, searchable: false },
]
const loadItems = debounce(async ({ page, itemsPerPage, sortBy }) => {
  const payload = {
    page,
    itemsPerPage,
    sortBy,
    filters: {
    },
    search: search.value,
  }
  sortByData.value = sortBy
  console.log("records", page, itemsPerPage, sortBy);
  loading.value = true;
  const data = await API.getDataTableRecord(GET_INTAKE_QUESTIONS, payload, headers);
  console.log(data.total)
  serverItems.value = data.items;
  totalItems.value = data.total;


  loading.value = false;
}, 500);
onMounted(async () => {
  //await store.dispatch('getIntakeQuestionsFormList');
  //items.value = store.getters.getIntakeQuestions;
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
});
const addNewItem = () => {
  router.push({ name: 'admin-add-intake-questions' });
};

const editItem = (item) => {
  formId.value = item.id
  isDialogVisibleUpdate.value = true
};



const deleteItem = async (item) => {
  await store.dispatch('deleteIntakeQuestionsForm', { id: item.id });
  //await store.dispatch('getIntakeQuestionsFormList');
  //items.value = store.getters.getIntakeQuestions;
  //console.log('Delete item', item.id);
  emit('handleDialog', false)
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
};
const handleSubmit = async (msg) => {
  if (msg == 'success') {
    console.log(props.isDialogVisible)
    isDialogVisibleUpdate.value = false
    emit('handleDialog', false)
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
  }


};
const clickDialogCancel = async (msg) => {
  emit('handleDialog', false)

};
</script>

<template>

  <VCardItem class="pb-4">
    <VCardTitle>Intake Questions</VCardTitle>
  </VCardItem>
  <VDivider />
  <div class="app-user-search-filter d-flex align-center flex-wrap gap-4"
    style="margin: 10px; justify-content: flex-end;">

    <div style="inline-size: 15.625rem;">
      <AppTextField v-model="search" placeholder="Search Intake Questions" />
    </div>

  </div>
  <VDivider />

  <VDataTableServer v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
    :items-length="totalItems" :loading="loading" :search="search" item-value="id" @update:options="loadItems"
    :sort-by="sortByData">
    <!-- Custom slot for the Status column -->
    <template #item.status="{ item }">
      <span>{{ item.status == 1 ? 'Active' : 'Deactive' }}</span>

    </template>

    <!-- Actions slot for edit and delete buttons -->
    <template #item.actions="{ item }">
      <IconBtn @click="editItem(item)" v-if="$can('read', 'Intake Questions Edit')">
        <VIcon icon="tabler-edit" />
      </IconBtn>
      <IconBtn @click="deleteItem(item)" v-if="$can('read', 'Intake Questions Delete')">
        <VIcon icon="tabler-trash" />
      </IconBtn>
    </template>
  </VDataTableServer>

  <VDialog v-model="props.isDialogVisible" max-width="800">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="clickDialogCancel" />
    <intakeQuestion v-if="props.userForm == 'Intake Question Form'" @submit="handleSubmit" />


  </VDialog>
  <VDialog v-model="isDialogVisibleUpdate" max-width="800">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisibleUpdate = !isDialogVisibleUpdate" />
    <EditIntakeQuestions v-if="props.userForm == 'Intake Question Form'" :formId="formId" @submit="handleSubmit" />


  </VDialog>
</template>

<style scoped>
.mt-4 {
  margin-top: 16px;
}
</style>
