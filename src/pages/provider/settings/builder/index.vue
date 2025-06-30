<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Builder View',
  },
})
import { useBuilderStore } from '@/stores/builderStore';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const builderStore = useBuilderStore();
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const router = useRouter();
const dataTable = ref(null);

const headers = [
  { title: 'ID', key: 'id', name: 'id' },
  { title: 'Builder Name', key: 'builder_name', name: 'builder_name' },
  { title: 'Actions', key: 'actions', sortable: false, searchable: false },
];

const reload = () => dataTable.value.reload()

onMounted(async () => {
  reload()
});
const addNewItem = () => {
  router.push({ name: 'provider-settings-builder-add-builder' });
};

const editItem = (item) => {
  builderStore.id = item.id;
  builderStore.layout = item.data
  builderStore.name = item.builder_name;
  router.push({
    name: 'provider-settings-builder-edit-builder-id',
    params: { id: item.id } // Use item.id here
  });
};



const deleteItem = async (item) => {
  await builderStore.deleteBuilder(item.id)
  reload()
};
const isConfirmDialogVisible = ref(false)
const itemToDelete = ref(null);
const confirmDelete = (item) => {
  console.log(item)
  itemToDelete.value = item; // Store the item to be deleted
  isConfirmDialogVisible.value = true; // Show the confirmation dialog
};

const handleConfirm = () => {
  if (itemToDelete.value) {
    deleteItem(itemToDelete.value); // Delete the item
    isConfirmDialogVisible.value = false; // Close the dialog
    itemToDelete.value = null; // Reset the item
  }
};

const handleCancel = () => {
  console.log('dddd')
  isConfirmDialogVisible.value = false; // Close the dialog
  itemToDelete.value = null; // Reset the item
};
</script>

<template>

  <DataTable ref="dataTable" :cardTitle="$t('Builders')" :btnTitle="$t('Add New Builder')" :headers="headers"
    :api="GET_NEW_BUILDERS" :sortBy="sortByData" @onBtnClick="addNewItem">
    <!-- Actions slot for edit and delete buttons -->
    <template v-slot:[`item.actions`]="{ item }">
      <IconBtn @click="editItem(item)" v-if="$can('read', 'Builder Edit')">
        <VIcon icon="tabler-edit" />
      </IconBtn>
      <IconBtn @click="confirmDelete(item)" v-if="$can('read', 'Builder Delete')">
        <VIcon icon="tabler-trash" />
      </IconBtn>
    </template>
  </DataTable>
  <ConfirmDialog v-model:isDialogVisible="isConfirmDialogVisible"
    confirmation-question="Are you sure you want to delete this item?" confirm-title="Deleted!"
    confirm-msg="Item deleted successfully." cancel-title="Cancelled" cancel-msg="Deletion Cancelled!!"
    @confirm="handleConfirm" @cancel="handleCancel" />
</template>

<style scoped>
.mt-4 {
  margin-top: 16px;
}
</style>
