<script setup>
import { useFormsStore } from '@/stores/formsStore';
import ViewIntakeForm from '@/views/apps/patient/Intake/formRender.vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import AddForms from './addForms.vue';
const { t } = useI18n();
const isViewConsentFormDrawerVisible = ref(false)
const props = defineProps({
  tab: {
    type: String,
    required: false,
  },
})
const formsStore = useFormsStore();
const route = useRoute();
let tab = route.params.tab ? route.params.tab : props.tab;
console.log('tab', route.query.tab)
const isConfirmDialogVisible = ref(false)
const itemToDelete = ref(null);
formsStore.type = t(tab);
const formItem = ref(null)
const isEditFormDailog = ref(false);
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Actions', key: 'actions', sortable: false, searchable: false },
]

const reload = () => dataTable.value.reload()
onMounted(async () => {
  reload()
});


const formatString = (input) => {
  return input.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const addNewItem = () => {
  formItem.value = null;
  formsStore.isDrawerOpen = true

};

const editItem = (item) => {
  formItem.value = item
  //isEditFormDailog.value = true
  formsStore.isDrawerOpenEdit = true
};

const openFormRender = (item) => {
  console.log('gggg= ', item)
  formItem.value = item
  isViewConsentFormDrawerVisible.value = true
};

const deleteItem = async (item) => {
  await formsStore.deleteForm(item.id)
  reload()
};
const confirmDelete = (item) => {
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
watch(() => formsStore.isDrawerOpen, (val) => {
  if (!val) {
    reload()
  }
})
watch(() => formsStore.isDrawerOpenEdit, (val) => {
  if (!val) {
    reload()
  }
})
const emit = defineEmits([
  'saveData'
]);
const handleDialogVisible = async (data) => {
  emit('saveData', true)
}
</script>
<template>
  <DataTable ref="dataTable" cardTitle=""
    :btnTitle="$can('read', 'Forms Add') ? $t('Add') + ' ' + `${formatString(tab)}` : ''" :headers="headers"
    :api="`${GET_CUSTOM_FORMS}/${tab}`" :sortBy="sortByData" @onBtnClick="addNewItem">
    <!-- Custom slot for the Status column -->
    <template #item.status="{ item }">
      <span>{{ item.status == 1 ? 'Active' : 'Deactive' }}</span>

    </template>

    <!-- Actions slot for edit and delete buttons -->
    <template #item.actions="{ item }">
      <IconBtn @click="editItem(item)" v-if="$can('read', 'Forms Edit')">
        <VIcon icon="tabler-edit" />
      </IconBtn>
      <IconBtn @click="confirmDelete(item)" v-if="$can('read', 'Forms Delete')">
        <VIcon icon="tabler-trash" />
      </IconBtn>
      <IconBtn @click="openFormRender(item)" v-if="$can('read', 'Forms View')">
        <VIcon icon="tabler-eye" />
      </IconBtn>
    </template>
  </DataTable>

  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content"
    :model-value="isViewConsentFormDrawerVisible" @update:model-value="handleDrawerModelValueUpdate">

    <AppDrawerHeaderSection :title="formatString(t(tab))"
      @cancel="[isViewConsentFormDrawerVisible = false, formItem = null]" />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard :title="$t('Form Perview')">
        <VCardText>

          <ViewIntakeForm v-if="formItem" :intakefieldData="formItem" :selectedFormId="formItem.id" />
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>

  <!-- <VDialog v-model="isViewConsentFormDrawerVisible" max-width="1300">
    <DialogCloseBtn @click="isViewConsentFormDrawerVisible = false" />
    <VCard :title="$t('Form Perview')">
      <VCardText>

        <ViewIntakeForm :intakefieldData="formItem" :selectedFormId="formItem.id" />
      </VCardText>
    </VCard>
  </VDialog> -->

  <!-- <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content"
    :model-value="formsStore.isDrawerOpen" @update:model-value="handleDrawerModelValueUpdate">

    <AppDrawerHeaderSection :title="formatString(tab)"
      @cancel="[formsStore.isDrawerOpen = !formsStore.isDrawerOpen, formItem = null]" />

    <PerfectScrollbar :options="{ wheelPropagation: false }"> -
      <VCard>
        <VCardText>
          <AddForms :formType="tab" :formItem="formItem"></AddForms>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer> -->
  <VDialog v-model="formsStore.isDrawerOpen" max-width="800">
    <DialogCloseBtn @click="formsStore.isDrawerOpen = false" />
    <VCard :title="$t('Add Form')">
      <VCardText>

        <AddForms :formType="tab" :formItem="formItem" v-if="formsStore.isDrawerOpen" @saveData="handleDialogVisible"></AddForms>
      </VCardText>
    </VCard>
  </VDialog>
  <VDialog v-model="formsStore.isDrawerOpenEdit" max-width="800">
    <DialogCloseBtn @click="formsStore.isDrawerOpenEdit = false" />
    <VCard :title="$t('Edit Form')">
      <VCardText>


        <AddForms v-if="formItem" :formType="tab" :formItem="formItem"></AddForms>
      </VCardText>
    </VCard>
  </VDialog>
  <!-- <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content"
    :model-value="formsStore.isDrawerOpenEdit" @update:model-value="handleDrawerModelValueUpdate">

    <AppDrawerHeaderSection :title="formatString(tab)"
      @cancel="[formsStore.isDrawerOpenEdit = !formsStore.isDrawerOpenEdit, formItem = null]" />

    <PerfectScrollbar :options="{ wheelPropagation: false }"> -
      <VCard>
        <VCardText>

          <AddForms v-if="formItem" :formType="tab" :formItem="formItem"></AddForms>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer> -->

  <ConfirmDialog v-model:isDialogVisible="isConfirmDialogVisible"
    confirmation-question="Are you sure you want to delete this item?" confirm-title="Deleted!"
    confirm-msg="Item deleted successfully." cancel-title="Cancelled" cancel-msg="Deletion Cancelled!!"
    @confirm="handleConfirm" @cancel="handleCancel" />
</template>
<style>
.clear-form {
  display: none;
}

.save-form {
  display: none;
}

.formeo-controls {
  display: block;
}
</style>
