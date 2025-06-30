<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Template View',
  },
})

import AddTemplate from '@/pages/provider/settings/templates/AddTemplate.vue';
import { useTemplateStore } from '@/stores/templateStore';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
const templateStore = useTemplateStore()
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);
const selectedTemplate = ref(null);
const isTemplateAddDialogVisible = ref(false)
const headers = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'Package Name',
    key: 'template_name',
  },

  // {
  //   title: 'Status',
  //   key: 'status',
  // },

  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    searchable: false
  },
]


const reload = () => dataTable.value.reload()
onMounted(() => {
  reload()
})

const closeForm = () => {
  isTemplateAddDialogVisible.value = false;
  reload();
}

const editTemplate = async (item) => {

  await templateStore.getTemplate(item.id)
  selectedTemplate.value = item.id;
  templateStore.prescription.id = item.id;
  isTemplateAddDialogVisible.value = true;
}

const deleteTemplate = (item) => {
  templateStore.deleteTemplate(item.id);
  reload()
}

const isConfirmDialogVisible = ref(false)
const itemToDelete = ref(null);
const confirmDelete = (item) => {
  console.log(item)
  itemToDelete.value = item; // Store the item to be deleted
  isConfirmDialogVisible.value = true; // Show the confirmation dialog
};

const handleConfirm = () => {
  if (itemToDelete.value) {
    deleteTemplate(itemToDelete.value); // Delete the item
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

  <DataTable ref="dataTable" :cardTitle="$t('Packages')"
    :btnTitle="$can('read', 'Template Add') ? $t('Add New Package') : ''" :headers="headers"
    :api="PRESCRIPTION_TEMPLATE_API" :sortBy="sortByData"
    @onBtnClick="[isTemplateAddDialogVisible = true, selectedTemplate = null]">
    <template #item.actions="{ item }">
      <IconBtn @click="editTemplate(item)" v-if="$can('read', 'Template Edit')">
        <VIcon icon="tabler-edit" />
      </IconBtn>
      <IconBtn @click="confirmDelete(item)" v-if="$can('read', 'Template Delete')">
        <VIcon icon="tabler-trash" />
      </IconBtn>
    </template>
  </DataTable>

  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content"
    :model-value="isTemplateAddDialogVisible">

    <AppDrawerHeaderSection :title="templateStore.prescription.id ? $t('Edit Package') : $t('Add New Package')"
      @cancel="[isTemplateAddDialogVisible = !isTemplateAddDialogVisible, reload(), templateStore.unloadTemplate()]" />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard>
        <AddTemplate :templateId="selectedTemplate" @customEvent=closeForm() />
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>

  <ConfirmDialog v-model:isDialogVisible="isConfirmDialogVisible"
    confirmation-question="Are you sure you want to delete this item?" confirm-title="Deleted!"
    confirm-msg="Item deleted successfully." cancel-title="Cancelled" cancel-msg="Deletion Cancelled!!"
    @confirm="handleConfirm" @cancel="handleCancel" />
</template>
