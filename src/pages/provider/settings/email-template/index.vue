<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'User Management View',
  },
})

import { useEmailTemplateStore } from '@/stores/emailTemplateStore';
import AddEmailTemplate from '@/views/provider/email-template/AddEmailTemplate.vue';

const emailTemplateStore = useEmailTemplateStore()
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);
const selectedTemplate = ref(null);
const headers = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'Template Name',
    key: 'name',
  },

  {
    title: 'Status',
    key: 'status',
  },

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

  emailTemplateStore.isDrawerOpen = false;
  emailTemplateStore.template.html = '';
  emailTemplateStore.template.doc = '';
  reload();
}

const editTemplate = async (item) => {

  emailTemplateStore.unloadTemplate();
  console.log(item);
  await emailTemplateStore.getTemplate(item.id)
  selectedTemplate.value = item.id;
  if (emailTemplateStore.template.name) {
    emailTemplateStore.isDrawerOpen = true;
  }
  // emailTemplateStore.template.id = item.id;

}

const deleteTemplate = (item) => {
  emailTemplateStore.deleteTemplate(item.id);
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
  <DataTable ref="dataTable" :cardTitle="$t('Email Templates')" :btnTitle="$t('Add New Template')" :headers="headers"
    :api="GET_EMAIL_TEMPLATES_API" :sortBy="sortByData"
    @onBtnClick="[emailTemplateStore.isDrawerOpen = true, selectedTemplate = null]">
    <template #item.actions="{ item }">
      <IconBtn @click="editTemplate(item)" v-if="$can('read', 'Email Template Config Edit')">
        <VIcon icon="tabler-edit" />
      </IconBtn>
      <IconBtn @click="confirmDelete(item)" v-if="$can('read', 'Email Template Config Delete')">
        <VIcon icon="tabler-trash" />
      </IconBtn>
    </template>
  </DataTable>

  <VDialog v-model="emailTemplateStore.isDrawerOpen" z-index="1100"
    v-if="emailTemplateStore.isDrawerOpen && emailTemplateStore.template">
    <DialogCloseBtn
      @click="[emailTemplateStore.isDrawerOpen = !emailTemplateStore.isDrawerOpen, reload(), selectedTemplate = null]" />
    <VCard :title="emailTemplateStore.template.id ? $t('Edit Template') : $t('Add New Template')">
      <AddEmailTemplate :templateId="selectedTemplate" @customEvent=closeForm() />
    </VCard>
  </VDialog>



  <ConfirmDialog v-model:isDialogVisible="isConfirmDialogVisible"
    :confirmation-question="$t('Are you sure you want to delete this item?')" :confirm-title="$t('Deleted!')"
    :confirm-msg="$t('Item deleted successfully.')" :cancel-title="$t('Cancelled')"
    :cancel-msg="$t('Deletion Cancelled!!')" @confirm="handleConfirm" @cancel="handleCancel" />
</template>
