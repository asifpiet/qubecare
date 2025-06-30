<script setup>
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const itemsPerPage = ref(10)
const isLoading = ref(false)
const start_date = ref()
const end_date = ref()
const vendorType = ref()
const vendorList = ref()
const selectedRows = ref([])
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isDataEnable:{
    type: Boolean,
  }
})
const updateOptions = options => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const headers = [
   
{
    title: 'Select',
    key: 'date',
    },
    {
    title: 'Name',
    key: 'date',
    },
    {
    title: 'Sub-Type',
    key: 'date',
    },
    {
    title: 'Type',
    key: 'date',
    },
    
    
]

const emit = defineEmits([
  'closeForm',
  'patientData'
]);

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)  
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}
//  const users = computed(() => {
//     let id = store.getters.getPatientPorfile.patientId;
//     if(id){
//         console.log("xxzxzx",usersData.value.users);
//         filtertextData.value = usersData.value.users.filter(row => row.id === id)
//         console.log("textMessage",filtertextData.value)
//         return filtertextData.value && filtertextData.value[0]
//           ? filtertextData.value[0].textMessage
//           : 0;
//     }else{
//         return [];
//     }   
// })
//  const totalUsers = computed(() => {
//   return filtertextData.value && filtertextData.value[0]
//     ? filtertextData.value[0].textMessage.length
//     : 0;
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
      title="Supply Categorization"
      @cancel="closeNavigationDrawer"
    />

    <VDivider />

        <PerfectScrollbar :options="{ wheelPropagation: false }">
           
                <VCard flat>
                    <VCardText class="d-flex flex-wrap gap-4">
                    
                    <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
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
                       
                    <div style="inline-size: 15.625rem;">
                        <AppTextField
                            v-model="searchQuery"
                            placeholder="Search Category"
                        />
                        </div>
                        
                    </div>
                    <div style="inline-size: 15.625rem;">
                    
                            <AppSelect
                                v-model="vendorType"
                                placeholder="Vendor Type"
                                :items="['Create Purchase Order', 'Purchase Order History', 'Inventroy Change Log', 'Group Edit Item', 'Categorize item']"
                                
                                />
                            </div>
                            <div style="inline-size: 15.625rem;">        
                            <AppSelect
                                v-model="vendorList"
                                label="Vendor List"
                                placeholder="Vendor List"
                                :items="['Create Purchase Order', 'Purchase Order History', 'Inventroy Change Log', 'Group Edit Item', 'Categorize item']"
                                
                                />
                            
                            </div>
                        <VDivider />
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
                        <template #item.date="{ item }">
                        <div class="text-body-1 text-high-emphasis text-capitalize">
                            {{ dateFormate(item.date) }} 
                        </div>
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
                    </VCard>
                    <VCol cols="12">
                <VBtn
                  type="submit"
                 class="me-3"
                
                >
                Save All Selected
                </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="error"
                  class="ml-3"
                  @click="closeNavigationDrawer"
                >
                Close
                </VBtn>
              </VCol>   
        
    </PerfectScrollbar>
    </VNavigationDrawer>

</template>
