<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Intake Questions View',
  },
})
import { useFormsStore } from '@/stores/formsStore';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const formsStore = useFormsStore();
const router = useRouter();
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false, searchable: false },
]

const reload = () => dataTable.value.reload()

onMounted(async () => {
  reload()
});
const addNewItem = () => {
  router.push({ name: 'provider-settings-intake-questions-add-intake-questions' });
};

const editItem = (item) => {
  router.push({
    name: 'provider-settings-intake-questions-edit-id',
    params: { id: item.id } // Use item.id here
  });
};



const deleteItem = async (item) => {
  await formsStore.deleteIntakeQuestionsForm(item.id)
  reload()
};
</script>

<template>
  <DataTable ref="dataTable" :cardTitle="$t('Intake Questions')" :btnTitle="$t('Add New Intake')" :headers="headers"
    :api="GET_INTAKE_QUESTIONS" :sortBy="sortByData" @onBtnClick="addNewItem">
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
  </DataTable>
</template>

<style scoped>
.mt-4 {
  margin-top: 16px;
}
</style>
