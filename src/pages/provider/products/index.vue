<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Product View',
  },
})
import AddNewProduct from '@/pages/provider/products/AddNewProduct.vue';
import { productService } from '@/services/productService';
import { useProductStore } from '@/stores/productStore';
// import EditProduct from '@/pages/provider/products/EditProduct.vue';

const productStore = useProductStore()
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);
const selectedProduct = ref(null)
const emit = defineEmits([
  'saveProductData',
  'handleDialog'
]);
const headers = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'Product',
    key: 'pro_name',
  },
  {
    title: 'Category',
    key: 'cat_names',
  },
  {
    title: 'Price',
    key: 'price',
  },
  {
    title: 'Description',
    key: 'description',
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

const deleteUser = async (id) => {
  await productStore.deleteProduct(id)
  reload()
}
const isConfirmDialogVisible = ref(false)
const itemToDelete = ref(null);
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

onMounted(async () => {
  reload()
})

const EditDetail = async (product) => {
  let tempPro = productService.mapProductData(product)
  selectedProduct.value = tempPro
  console.log("Seeproduct", tempPro);
  productStore.isDrawerOpen = true
}


const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}



watch(() => productStore.isDrawerOpen, (val) => {
  if (!val) {
    reload()
  }
})
const handleDialogVisible = async (data) => {
  emit('handleDialog', true)
}
</script>

<template>
  <section>
    <DataTable ref="dataTable" :cardTitle="$t('Products')" :btnTitle="$t('Add New Product')" :headers="headers"
      :api="GET_PRODUCT_API" :sortBy="sortByData"
      @onBtnClick="[productStore.isDrawerOpen = true, selectedProduct = null]">
      <template #item.pro_name="{ item }">
        <div class="d-flex align-center gap-x-4">
          <span class="cursor-pointer text-primary" @click="EditDetail(item)" v-if="$can('read', 'Product Edit')">{{
            item.pro_name }} </span>
        </div>
      </template>
      <template #item.price="{ item }">
        <div class="d-flex align-center gap-x-4">
          <span>${{ item.price }} </span>
        </div>
      </template>

      <template #item.status="{ item }">
        <div class="d-flex align-center gap-x-4" v-if="item.status">
          {{ capitalize(item.status) }}
        </div>
      </template>


      <template #item.actions="{ item }">
        <IconBtn @click="EditDetail(item)" v-if="$can('read', 'Product Edit')">
          <VIcon icon="tabler-edit" />
        </IconBtn>
        <IconBtn @click="confirmDelete(item)" v-if="$can('read', 'Product Delete')">
          <VIcon icon="tabler-trash" />
        </IconBtn>
      </template>
    </DataTable>
    <ConfirmDialog v-model:isDialogVisible="isConfirmDialogVisible"
      confirmation-question="Are you sure you want to delete this item?" confirm-title="Deleted!"
      confirm-msg="Item deleted successfully." cancel-title="Cancelled" cancel-msg="Deletion Cancelled!!"
      @confirm="handleConfirm" @cancel="handleCancel" />
    <teleport to="body">
      <AddNewProduct :product="selectedProduct" v-if="productStore.isDrawerOpen" @saveData="handleDialogVisible"/>
    </teleport>
    <!-- <EditProduct v-model:isDrawerOpen="isEditInventoryDrawerVisible" @updateProductData="updateProduct"
      @dataSave="setNotifcation" v-if="isEditInventoryDrawerVisible" :edit-product="editItem" /> -->
  </section>
</template>
<style scoped>
::v-deep .v-data-table .v-data-table__wrapper::-webkit-scrollbar {
  width: 10px;
}
</style>
