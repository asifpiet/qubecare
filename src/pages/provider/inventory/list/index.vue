<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Inventory View',
  },
})
import { dateFormat } from '@/plugins/globalFunctions';
import API from '@/utils/apiDatable';
import AddNewUserDrawer from '@/views/apps/inventory/AddNewInventory.vue';
import AddOrder from '@/views/apps/inventory/AddOrder.vue';
import EditGroupItem from '@/views/apps/inventory/EditGroupItem.vue';
import EditInventory from '@/views/apps/inventory/EditInventory.vue';
import InventoryLog from '@/views/apps/inventory/InventoryLog.vue';
import PurchaseHistory from '@/views/apps/inventory/PurchaseHistory.vue';
import actions from '@/views/apps/user/actions.vue';
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
const isConfirmDialogVisible = ref(false)
const itemToDelete = ref(null);
const selectedMore = ref()
const page = ref(1)
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const orderBy = ref()
const selectedRows = ref([])
const patientToEdit = ref();
const isDisable = ref();
const search = ref('')
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);
const itemsPerPage = ref(10);
const editItem = ref({})
const emit = defineEmits([
  'openTextMessage',
  'openTaskDrawn',
  'openVitalDrawn',
  'openLabDiagnosticsDrawn',
  'openSubmitIntakesDrawn',
  'openDocumentDrawn',

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
  // {
  //   title: 'Date of Birth',
  //   key: 'dateOfBirth',
  // },
  {
    title: 'Type',
    key: 'inventoryType',
  },
  // {
  //   title: 'Location',
  //   key: 'location',
  // },

  // {
  //   title: 'MNP',
  //   key: 'mnp',
  // },
  {
    title: 'Price',
    key: 'price',
  },
  {
    title: 'Cost',
    key: 'cost',
  },
  {
    title: 'Exp.Date',
    key: 'expirationDate',
  },
  {
    title: 'Lot Num',
    key: 'lotNo',
  },
  {
    title: 'On-Hand',
    key: 'onhand',
  },
  // {
  //   title: 'On-Order',
  //   key: 'onOrder',
  // },

  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    searchable: false
  },
]
const updateOptions = options => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}
const openTextMessageDrawn = () => {
  isActionDialogVisible.value = false;
  isTextMessageUserDrawerVisible.value = true;
}
const openTaskDrawan = () => {
  isActionDialogVisible.value = false;
  isTaskUserDrawerVisible.value = true;
}
const openVitalUserDrawan = () => {
  isActionDialogVisible.value = false;
  isVitalDrawerVisible.value = true;
}
const openLabDiagnosticsUserDrawan = () => {
  isActionDialogVisible.value = false;
  isLabDiagnosticsDrawerVisible.value = true;
}
const openSubmitIntakesUserDrawan = () => {
  isActionDialogVisible.value = false;
  isSubmitIntakesDrawerVisible.value = true;
}
const openPatientDocumentDrawan = () => {
  isActionDialogVisible.value = false;
  isDocumentDrawerVisible.value = true;
}

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
  const data = await API.getDataTableRecord(INVENTORY_API, payload, headers);
  console.log(data.total)
  serverItems.value = data.items;
  totalItems.value = data.total;
  loading.value = false;
}, 500);



const addNewUser = async userData => {
  if (userData.id == null) {
    console.log("userData", userData);
    await $api('/apps/users', {
      method: 'POST',
      body: userData,
    });
  } else {
    updateNewUser(userData);
  }
  if (userData.checkIsFormOpen == "saveClose") {
    isTabEnable();
  }
  fetchUsers()
}



const updateNewUser = async userData => {
  console.log("updateNewUser", userData);
  const res = await $api('/api/apps/users/' + userData.id, {
    method: 'PUT',
    body: userData,
  });
  console.log("resUpdate", res);

}

const deleteUser = async (id) => {
  await store.dispatch('deleteInventory', {
    id
  })
  isDeleteTonalSnackbarVisible.value = true
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
}


onMounted(async () => {

  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [{ 'key': 'id', 'order': 'desc' }] });
  //emailList.value=store.getters.getEmailList
  //console.log('ssdss',emailList.value)
})
const isTabEnable = async () => {
  isDisable.value = true
  await store.dispatch('savePatientPorfile', {
    patientId: null,
    firstName: null,
    lastName: null
  })
}
const actionBox = async (id) => {
  const res = await $api('/api/apps/users/' + id, {
    method: 'GET',
  });
  // patientToEdit.value = res;
  await store.dispatch('editPatientProfile', {
    res
  })
  console.log("res1", res);
}

watch(selectedMore, async (newValue) => {
  console.log("Selected Location:", newValue);
  if (newValue == 'Create Purchase Order') {
    isAddOrderDrawerVisible.value = true;
  }
  if (newValue == 'Purchase Order History') {

    isPurchaseHistoryDrawerVisible.value = true;
  }
  if (newValue == 'Inventroy Change Log') {
    isInventoryLogDrawerVisible.value = true;
  }
  if (newValue == 'Categorize item') {
    isCategorizeItemDrawerVisible.value = true;
  }
  if (newValue == 'Group Edit Item') {
    isEditGroupItemDrawerVisible.value = true;
  }

  selectedMore.value = '';
});

const EditDetail = async (InventoryItem) => {
  //   const res = await store.dispatch('getSingleInventory',{
  //     id:Inventoryid
  //   });
  //   isEditInventoryDrawerVisible.value = true;
  editItem.value = InventoryItem
  isEditInventoryDrawerVisible.value = true;
}

const setNotifcation = () => {
  isAddOrderDrawerVisible.value = false;
  isTonalSnackbarVisible.value = true;
  isEditInventoryDrawerVisible.value = false;
  isAddNewUserDrawerVisible.value = false
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
}
const confirmDelete = (item) => {
  itemToDelete.value = item; // Store the item to be deleted
  isConfirmDialogVisible.value = true; // Show the confirmation dialog
};

const handleConfirm = () => {
  if (itemToDelete.value) {
    deleteUser(itemToDelete.value.id); // Delete the item
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
  <section>

    <VDialog v-model="isLoading" width="110" height="150" color="primary">
      <VCardText class="" style="color: white !important;">
        <div class="demo-space-x">
          <VProgressCircular :size="40" color="primary" indeterminate />
        </div>
      </VCardText>
    </VDialog>
    <VSnackbar v-model="isTonalSnackbarVisible" location="top end" variant="flat" color="success">
      Inventory saved.
    </VSnackbar>
    <VSnackbar v-model="isDeleteTonalSnackbarVisible" location="top end" variant="flat" color="success">
      Inventory Delete.
    </VSnackbar>
    <VCard class="mb-6">
      <VCardItem class="pb-4">
        <VCardTitle>Inventory</VCardTitle>
      </VCardItem>
      <VDivider />

      <VCardText class="d-flex flex-wrap gap-4">
        <div class="me-3 d-flex gap-3">
          <AppSelect :model-value="itemsPerPage" :items="[
            { value: 10, title: '10' },
            { value: 25, title: '25' },
            { value: 50, title: '50' },
            { value: 100, title: '100' },
            { value: -1, title: 'All' },
          ]" style="inline-size: 6.25rem; display: none;" @update:model-value="itemsPerPage = parseInt($event, 10)" />
        </div>
        <VSpacer />

        <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">

          <div style="inline-size: 15.625rem;">
            <AppTextField v-model="search" placeholder="Search Inventory" />
          </div>

          <div style="inline-size: 15.625rem; display: none;">
            <AppSelect v-model="selectedMore" placeholder="More Options"
              :items="['Create Purchase Order', 'Purchase Order History']" />
            <!-- :items="['Create Purchase Order', 'Purchase Order History', 'Inventroy Change Log', 'Group Edit Item', 'Categorize item']" -->

          </div>
          <VBtn prepend-icon="tabler-plus" @click="[isAddNewUserDrawerVisible = true, isTabEnable()]"
            v-if="$can('read', 'Inventory Add')">
            Add New Inventory
          </VBtn>
        </div>
      </VCardText>

      <VDivider />


      <VDataTableServer v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
        :items-length="totalItems" :loading="loading" :search="search" item-value="id" :sort-by="sortByData"
        @update:options="loadItems" class="text-no-wrap">

        <template #item.item_name="{ item }">
          <div class="d-flex align-center gap-x-4">
            <span class="cursor-pointer text-primary">{{ item.item_name }} </span>
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



      </VDataTableServer>

      <VDialog v-model="isActionDialogVisible" width="500">
        <DialogCloseBtn @click="isActionDialogVisible = false" />
        <VCard>
          <VCardText>
            <actions @openTextMessage="openTextMessageDrawn" @openTaskDrawn="openTaskDrawan"
              @openVitalDrawn="openVitalUserDrawan" @openLabDiagnosticsDrawn="openLabDiagnosticsUserDrawan"
              @openSubmitIntakesDrawn="openSubmitIntakesUserDrawan" @openDocumentDrawn="openPatientDocumentDrawan" />
          </VCardText>
        </VCard>
      </VDialog>
    </VCard>

    <AddNewUserDrawer v-model:isDrawerOpen="isAddNewUserDrawerVisible" @dataSave="setNotifcation"
      v-if="isAddNewUserDrawerVisible" />

    <EditInventory v-model:isDrawerOpen="isEditInventoryDrawerVisible" @dataSave="setNotifcation"
      v-if="isEditInventoryDrawerVisible" :edit-invetory="editItem" />

    <AddOrder v-model:isDrawerOpen="isAddOrderDrawerVisible" @dataSave="setNotifcation"
      v-if="isAddOrderDrawerVisible" />
    <PurchaseHistory v-model:isDrawerOpen="isPurchaseHistoryDrawerVisible" @user-data="addNewUser"
      @update-user-data="updateNewUser" :isDataEnable=true v-if="isPurchaseHistoryDrawerVisible" />

    <InventoryLog v-model:isDrawerOpen="isInventoryLogDrawerVisible" @user-data="addNewUser"
      @update-user-data="updateNewUser" :isDataEnable=true v-if="isInventoryLogDrawerVisible" />


    <EditGroupItem v-model:isDrawerOpen="isEditGroupItemDrawerVisible" @user-data="addNewUser"
      @update-user-data="updateNewUser" :isDataEnable=true v-if="isEditGroupItemDrawerVisible" />




    <ConfirmDialog v-model:isDialogVisible="isConfirmDialogVisible"
      confirmation-question="Are you sure you want to delete this item?" confirm-title="Deleted!"
      confirm-msg="Item deleted successfully." cancel-title="Cancelled" cancel-msg="Deletion Cancelled!!"
      @confirm="handleConfirm" @cancel="handleCancel" />






  </section>
</template>
<style scoped>
::v-deep .v-data-table .v-data-table__wrapper::-webkit-scrollbar {
  width: 10px;
}
</style>
