<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Network Products View',
    },
})
import { affiliateProductService } from '@/services/affiliateProductService';
import { useAffiliateProductStore } from '@/stores/affiliateProductStore';
// import EditInventory from '@/views/apps/inventory/EditInventory.vue';
import AddNewProduct from '@/pages/network/products/AddNewProduct.vue';

const affiliateProductStore = useAffiliateProductStore()
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);
const selectedProduct = ref(null)
const emit = defineEmits([
    'saveProductData'

]);
const headers = [
    {
        title: 'ID',
        key: 'id',
    },
    {
        title: 'Product',
        key: 'product_name',
        // name: 'products.name',
    },
    {
        title: 'Price',
        key: 'price',
        name: 'price',
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
    await affiliateProductStore.deleteAffiliateProduct(id)
    reload()
}


onMounted(async () => {
    reload()
})

const EditDetail = async (product) => {
    let tempPro = affiliateProductService.mapAffiliateProductData(product)
    selectedProduct.value = tempPro
    console.log("Seeproduct", product, tempPro);
    affiliateProductStore.isDrawerOpen = true
}

watch(() => affiliateProductStore.isDrawerOpen, (val) => {
    if (!val) {
        reload()
    }
})
</script>

<template>
    <section>
        <DataTable ref="dataTable" cardTitle="Affiliate Products" btnTitle="Add To Affiliate Network" :headers="headers"
            :api="GET_AFFILIATE_PRODUCTS" :sortBy="sortByData"
            @onBtnClick="[affiliateProductStore.isDrawerOpen = true, selectedProduct = null]">
            <template #item.pro_name="{ item }">
                <div class="d-flex align-center gap-x-4">
                    <span class="cursor-pointer text-primary">{{ item.product_name }} </span>
                </div>
            </template>

            <template v-slot:[`item.status`]="{ item }">
                <span>{{ item.status == 1 ? 'Active' : 'Deactive' }}</span>

            </template>


            <template #item.actions="{ item }">
                <IconBtn @click="EditDetail(item)" v-if="$can('read', 'Affiliate Edit')">
                    <VIcon icon="tabler-edit" />
                </IconBtn>
                <IconBtn @click="deleteUser(item.affiliate_product_id)" v-if="$can('read', 'Affiliate Delete')">
                    <VIcon icon="tabler-trash" />
                </IconBtn>
            </template>
        </DataTable>
        <teleport to="body">
            <AddNewProduct :product="selectedProduct" v-if="affiliateProductStore.isDrawerOpen" />
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
