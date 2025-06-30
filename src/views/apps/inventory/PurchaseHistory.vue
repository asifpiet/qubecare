<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
const store = useStore()
const itemsPerPage = ref(10)

const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const selectedRows = ref([])
const searchQuery = ref()
const isLoading = ref(false)
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isDataEnable:{
    type: Boolean,
  }
})

const emit = defineEmits([
  'closeForm',
  'patientData'
]);
const headers = [
  
  {
    title: 'Provider',
    key: 'practitioner_name',
  },
  {
    title: 'Date',
    key: 'date',
  },
  {
    title: 'Vendor',
    key: 'vendor_name',
  },
  {
    title: 'Description',
    key: 'description',
  },
  {
    title: 'Ordered Total($)',
    key: 'orderedTotalPrice',
  },
  {
    title: 'Actual PO Total($)',
    key: 'actualPOTotalprice',
  },
  {
    title: 'Status',
    key: 'status',
  },
  
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)  
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const {
  data: usersData,
  execute: fetchUsers,
} = await useApi(createUrl(PURCHASE_ORDER_API, {
  query: {
    q: searchQuery,
    status: selectedStatus,
    plan: selectedPlan,
    role: selectedRole,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))
const users = computed(() => {
  // isLoading.value = true;
  console.log("purchaseOrderHistory",usersData.value.purchaseOrderHistory);
  return usersData.value.purchaseOrderHistory;  
  
});
const totalUsers = computed(() => usersData.value.totalUsers)

const updateStatus = async (item) => {
  console.log(`Updating status for`, item);
};


// watch(
//   () => item.status,
//   (newValue, oldValue) => {
//     if (newValue !== oldValue) {
//       updateStatus(item.status);
//     }
//   }
// );

// watch(selectedVendor, async(vendor_name) => {
//   if(vendor_name){
//     console.log('Selected Practitioner ID:', vendor_name);
//     await store.dispatch('getVendors',{
//       vendor_name
//     })
//     OrderList.value =  store.getters.getVendorData;
//     totalOrder.value = store.getters.getVendorData.length;
//     console.log("OrderList",OrderList.value);
//   }
  
// });

</script>

<template>
    <VNavigationDrawer
    temporary
    :width="800"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
    >
    
    <AppDrawerHeaderSection
      title="Purchase Order History"
      @cancel="closeNavigationDrawer"
    />

    <VDivider />

        <PerfectScrollbar :options="{ wheelPropagation: false }">
          <VCard class="mb-6">
      
        <VDivider />

      <VCardText class="d-flex flex-wrap gap-4">
        <div class="me-3 d-flex gap-3">
          <AppSelect
            :model-value="itemsPerPage"
            :items="[
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: -1, title: 'All' },
            ]"
            style="inline-size: 6.25rem;"
            @update:model-value="itemsPerPage = parseInt($event, 10)"
          />
        </div>
        <VSpacer />
      </VCardText>

      <VDivider />

      <VCardText>
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:model-value="selectedRows"
        v-model:page="page"
        :items="users"
        item-value="id"
        :items-length="totalUsers"
        :headers="headers"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        
      <template #item.item_name="{ item }">
                <div class="d-flex align-center gap-x-4">
                    <span @click="EditDetail(item.id)" class="cursor-pointer text-primary"style="text-decoration: underline;">{{ item.item_name }} </span>
                  </div>
      </template>

      <template #item.orderedTotalPrice="{ item }">
                  <div class="d-flex align-center gap-x-4">
                    ${{  parseFloat(item.orderedTotalPrice).toFixed(2) }}
                  </div>
              </template>

              <template #item.actualPOTotalprice="{ item }">
                  <div class="d-flex align-center gap-x-4">
                    ${{  parseFloat(item.actualPOTotalprice).toFixed(2) }}
                    </div>
              </template>

      <template #item.status="{ item }">
                <div class="d-flex align-center gap-x-4">
                  <AppSelect
                    :width="150"
                    v-model="item.status"
                    :items="['Sent', 'Paid', 'Recevied', 'Paid & Recevied']"
                  />
                </div>  
      </template>

        
        <template #item.actions="{ item }">
          <IconBtn @click="deleteUser(item.id)">
            <VIcon icon="tabler-trash" />
          </IconBtn>
        </template>

        
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalUsers"
          />
        </template>
      </VDataTableServer>
        </VCardText>
        <VDialog
          v-model="isActionDialogVisible"
          width="500"
        >
        <DialogCloseBtn @click="isActionDialogVisible = false" />
        <VCard>
        <VCardText>
          
          </VCardText>
        </VCard> 
      </VDialog>
    </VCard>
        </PerfectScrollbar>
    </VNavigationDrawer>

</template>
