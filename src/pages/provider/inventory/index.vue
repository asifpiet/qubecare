<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Inventory View',
  },
})
import AddNewUserDrawer from '@/pages/provider/inventory/AddNewInventory.vue';
import { dateFormat } from '@/plugins/globalFunctions';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useStore } from 'vuex';
const store = useStore()
const inventoryStore = useInventoryStore()
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);
const selectedInventory = ref('')
const isAddNewUserDrawerVisible = ref(false)
const isDeleteTonalSnackbarVisible = ref();
const isConfirmDialogVisible = ref(false)
const itemToDelete = ref(null);
const emit = defineEmits([
  'customEvent'
]);
const headers = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'Vendor',
    key: 'vendor_name',
  },
  {
    title: 'Name',
    key: 'item_name',
  },
  {
    title: 'Secondary Vendor',
    key: 'secondaryVendor',
  },

  {
    title: 'Type',
    key: 'inventoryType',
  },

  {
    title: 'Price',
    key: 'price',
  },
  {
    title: 'Cost',
    key: 'cost',
  },
  {
    title: 'Exp Date',
    key: 'expirationDate',
  },
  {
    title: 'Lot Num',
    key: 'lotNo',
  },
  {
    title: 'On Hand',
    key: 'onhand',
  },

  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    searchable: false
  },
]

const deleteInventory = async (id) => {
  await inventoryStore.deleteInventory(id)
  reload()
}



const EditDetail = async (InventoryItem) => {
  selectedInventory.value = InventoryItem.id
  inventoryStore.isDrawerOpen = true;
}
const confirmDelete = (item) => {
  itemToDelete.value = item; // Store the item to be deleted
  isConfirmDialogVisible.value = true; // Show the confirmation dialog
};

const handleConfirm = () => {
  if (itemToDelete.value) {
    deleteInventory(itemToDelete.value.id); // Delete the item
    isConfirmDialogVisible.value = false; // Close the dialog
    itemToDelete.value = null; // Reset the item
  }
};

const handleCancel = () => {
  console.log('dddd')
  isConfirmDialogVisible.value = false; // Close the dialog
  itemToDelete.value = null; // Reset the item
};
const reload = () => dataTable.value.reload()
watch(() => inventoryStore.isDrawerOpen, (val) => {
  if (!val) {
    reload()
  }
})
</script>

<template>
  <section>

    <DataTable ref="dataTable" :cardTitle="$t('Inventory')" :btnTitle="$t('Add New Inventory')" :headers="headers"
      :api="INVENTORY_API" :sortBy="sortByData"
      @onBtnClick="[inventoryStore.isDrawerOpen = true, isAddNewUserDrawerVisible = true, selectedInventory = null]">
      <template #item.item_name="{ item }">
        <div class="d-flex align-center gap-x-4">
          <span class="cursor-pointer text-primary" @click="EditDetail(item)">{{ item.item_name }} </span>
        </div>
      </template>

      <template #item.expirationDate="{ item }">
        <div class="d-flex align-center gap-x-4">
          <span class="">{{ dateFormat(item.expirationDate) }} </span>
        </div>
      </template>



      <template #item.actions="{ item }">
        <IconBtn @click="EditDetail(item)" v-if="$can('read', 'Inventory Edit')">
          <VIcon icon="tabler-edit" />
        </IconBtn>
        <IconBtn @click="confirmDelete(item)" v-if="$can('read', 'Inventory Delete')">
          <VIcon icon="tabler-trash" />
        </IconBtn>
      </template>
    </DataTable>

    <ConfirmDialog v-model:isDialogVisible="isConfirmDialogVisible"
      confirmation-question="Are you sure you want to delete this item?" confirm-title="Deleted!"
      confirm-msg="Item deleted successfully." cancel-title="Cancelled" cancel-msg="Deletion Cancelled!!"
      @confirm="handleConfirm" @cancel="handleCancel" />
    <AddNewUserDrawer :inventory="selectedInventory" v-if="inventoryStore.isDrawerOpen" @customEvent="reload()" />
  </section>
</template>
<style scoped>
::v-deep .v-data-table .v-data-table__wrapper::-webkit-scrollbar {
  width: 10px;
}
</style>
