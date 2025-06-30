<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
const store = useStore()
const isDisable = ref(true);
const currentTab = ref('0')
const isLoading = ref(false)
const isFormValid = ref(false)
const refForm = ref()
const vendorType = ref('Primary')
const vendorName = ref()
const vendorList = ref()
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const selectedRows = ref([])
const selectedPractitioner = ref()
const location = ref()
const isReorderPoint =ref(false)
const isMinOnHand =ref(false)
const practitioners = ref([])
const locationData = ref([])
const vendorData = ref([])
const selectedVendor = ref([])
const OrderList = ref([])
const totalOrder =ref()
const quantity = ref('0.00');
const description =ref();
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isDataEnable:{
    type: Boolean,
  }
})
onBeforeMount(() => {
  console.log("isDataEnable",props.isDataEnable);
})
const isTabEnable = computed(() => {
  isDisable.value = true;
});

const emit = defineEmits([
  'closeForm',
  'patientData'
]);

const closeNavigationDrawer = () => {
  currentTab.value = 0;
  emit('update:isDrawerOpen', false)  
  emit('reset-form')
  TabsUpdate();
  
}





const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const TabsUpdate = async() => {
  isDisable.value  = true;
  currentTab.value = 0;
  await store.dispatch('savePatientPorfile', {
      patientId: null,
      firstName: null,
      lastName:null
  }) 
}

const headers = [
  {
    title: 'Item Name',
    key: 'item_name',
  },
  {
    title: 'Item VendorPart No',
    key: 'manufPartNo',
  },
  {
    title: 'Item VendorBarcode',
    key: 'barcode',
  },
  {
    title: 'Cost Per Unit',
    key: 'cost',
  },
  {
    title: 'Min OHDesired',
    key: 'minimumOHDesired',
  },
  {
    title: 'ReorderPoint',
    key: 'reorderPoint',
  },
  {
    title: 'On-Hand',
    key: 'onhand',
  },
  {
    title: 'On-Order',
    key: 'onOrder',
  },
  {
    title: 'Order Qty',
    key: 'orderQuantity',
  },
  {
    title: '$',
    key: 'totalPrice',
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]

const getDropdownData = computed(async() => {
    await store.dispatch('getPractitioners')
    await store.dispatch('getLocations')
    await store.dispatch('getVendors', {
      vendor_name:null
    })
    const practitionersData = store.getters.getPractitioners;
    const locationObjects = store.getters.getLocationData;
    const VendorObjects = store.getters.getVendorData;
    console.log("locationObjects",locationObjects);
    // Map practitioners to get only the names
    practitioners.value = practitionersData.map(practitioner => ({
      name: `${practitioner.firstName} ${practitioner.lastName}`, // Display text
      id: practitioner.id, // Value
    }))
    

    if (practitioners.value ) {
      
      selectedPractitioner.value = practitioners.value[0].name; // Set default to first practitioner's id
    }


    locationData.value = locationObjects.map(locatn => ({
      name: `${locatn.name}`, // Display text
      id: locatn.id, // Value
    }));

    if (locationData.value ) {
      location.value = locationData.value[0].name; // Set default to first practitioner's id
    }

    vendorData.value = VendorObjects
      .map(vendor => ({
        name: vendor.vendor_name, // Display text
        id: vendor.id, // Value
      }))
      .filter((value, index, self) => 
        index === self.findIndex((v) => v.name === value.name) // Remove duplicates by name
      );
    return true;
})

watch(selectedVendor, async(vendor_name) => {
  if(vendor_name){
    vendorName.value = vendor_name;
    console.log('Selected Practitioner ID:', vendor_name);
    await store.dispatch('getVendors',{
      vendor_name
    })
    OrderList.value =  store.getters.getVendorData;
    totalOrder.value = store.getters.getVendorData.length;
    console.log("OrderList",OrderList.value);
  }
  
});
const updateOptions = options => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const remove = (id) => {
    // Update OrderList to exclude the item with the matching id
    OrderList.value = OrderList.value.filter(item => item.id !== id);
    
    // Optionally, you might want to also remove the item from the store if it's being managed there
    // store.dispatch('removeVendor', id);
};

// const formattedQuantity = computed(() => formatNumber(quantity.value));
const formatQuantity = (value) => {
  if (!value) return '0.00'; // Default value
  const numberValue = parseFloat(value.replace(/,/g, '')); // Remove commas for parsing
  return isNaN(numberValue) ? '0.00' : numberValue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const updateQuantity = (event, item) => {
  let inputValue = event.target.value;

  // Remove any invalid characters except for digits and decimal point
  inputValue = inputValue.replace(/[^0-9.]/g, '');

  // Split the input value into integer and decimal parts
  const parts = inputValue.split('.');
  
  // Prevent more than one decimal point
  if (parts.length > 2) return;

  // Limit the integer part to a maximum length of 8
  if (parts[0].length > 8) {
    parts[0] = parts[0].slice(0, 8); // Take first 8 digits of the integer part
  }

  // Ensure there are exactly 2 digits after the decimal
  if (parts.length > 1) {
    if (parts[1].length > 2) {
      parts[1] = parts[1].slice(0, 2); // Take first 2 digits of the decimal part
    }
  } else {
    parts[1] = '00'; // Ensure there are 2 decimal places if none
  }

  // Combine the integer and decimal parts
  const formattedValue = parts.join('.');

  // Ensure total length does not exceed 10 characters
  if (formattedValue.length > 10) {
    const integerPart = formattedValue.split('.')[0];
    const decimalPart = formattedValue.split('.')[1] || '';

    // Adjust integer part to fit total length constraint
    if (integerPart.length > 8) {
      item.quantity = integerPart.slice(0, 8) + '.' + (decimalPart.slice(0, 2) || '00');
    } else {
      item.quantity = formattedValue;
    }
  } else {
    // Update the quantity for the specific order
    item.quantity = formattedValue;
  }
};

const totalAmount = computed(() => {
  return OrderList.value.reduce((sum, item) => {
    const itemTotal = parseFloat(item.cost * item.quantity);
    return sum + (isNaN(itemTotal) ? 0 : itemTotal);
  }, 0).toFixed(2);
});


const onSubmit = async() => {
          await store.dispatch('addOrder',{
            practitioner_name: selectedPractitioner.value,
            vendor_type:vendorType.value,
            vendor_name:selectedVendor.value,
            description:description.value,
            location:location.value,
            orderedTotalPrice:totalAmount,
            actualPOTotalprice:totalAmount,
            status:'',
            date:'10-10-2024',
            itemDetail:[
              
            ]
          })

          emit('dataSave')




}
</script>

<template>
  <div v-if="getDropdownData"></div>
  <VNavigationDrawer
    temporary
    :width="800"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
   
  >
    
    <AppDrawerHeaderSection
      title="Create Purchase Order"
      @cancel="closeNavigationDrawer"
    />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
        <VCard flat>
          <VCardText>
            <VRow>
                <VCol cols="4">
                    <AppSelect
                        v-model="vendorType"
                        label="Vendor Type"
                        placeholder="Vendor Type"
                        :items="['Primary', 'Secondary']"
                        
                        />
                </VCol>
                <VCol  cols="4" >
                    <AppSelect
                        v-model="selectedVendor"
                        label="Vendor List"
                        placeholder="Vendor List"
                        :items="vendorData"
                        item-value="name"      
                        item-title="name"   
                    />
                </VCol>
                <VCol  cols="4" >
                <AppSelect 
                    v-model="selectedPractitioner"
                    label="Practitioner"
                    placeholder="Select Practitioner"
                    :items="practitioners"
                    item-value="name"      
                    item-title="name"
                    @change="handleSelectionChange"

                  />
                </VCol>
                <VCol  cols="4">
                    <AppSelect
                        v-model="location"
                         label="Location"
                        placeholder="Location"
                        :items="locationData"
                        item-value="name"      
                        item-title="name" 
                        />
                </VCol>
                <VCol cols="4">
                <VCheckbox
                  v-model="isReorderPoint"
                  label="Show below Reorder Point"
                />
                
                <VCheckbox
                  v-model="isMinOnHand"
                  label="Show below Min OnHand"
                />
                </VCol>
                <VCol  cols="4">
                    <AppTextField
                        label="Remove OH Greater Than"
                        placeholder="Remove OH Greater Than"
                        v-model="removeOHGreaterThan"
                    />
                    <VBtn size="small">Apply</VBtn>
                </VCol>
                <VCol  cols="12">
                    <v-textarea
                        label="Description"
                        placeholder="Description"
                        v-model="description"
                        rows="3"
                        
                    />
                </VCol>
                <VCol  cols="12">
                    <AppTextField
                        label="Search And Add Items"
                        placeholder="Search And Add Items"
                        v-model="description"
                        rows="3"
                        
                    />
                </VCol>
            </VRow>
            <VCardText class="d-flex flex-wrap gap-4">
        <VSpacer />
      </VCardText>

      <VDivider />

      
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:model-value="selectedRows"
        v-model:page="page"
        :items="OrderList"
        item-value="id"
        :items-length="totalOrder"
        :headers="headers"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        
      <template #item.item_name="{ item }">
                <div class="d-flex align-center gap-x-4">
                    <span class="cursor-pointer text-primary"style="text-decoration: underline;">{{ item.item_name }} </span>
                  </div>
      </template>
              <template #item.orderQuantity="{ item }">
                  <div class="d-flex align-center gap-x-4">
                    <AppTextField
                       width="200"
                      type="number"
                      :value="formatQuantity(item.quantity)" 
                      v-model="quanity"
                      @input="(event) => updateQuantity(event, item)"
                       :maxlength="10"
                    />
                  </div>
              </template>

              <template #item.totalPrice="{ item }">
                  <div class="d-flex align-center gap-x-4">
                    ${{ isNaN(item.cost * item.quantity) ? '0.00' : parseFloat(item.cost * item.quantity).toFixed(2) }}
                  </div>
              </template>

        
        <template #item.actions="{ item }">
          <IconBtn @click="remove(item.id)">
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
          <VCardText>
          <VRow>
              <VCol cols="6"><b>Total</b> </VCol>
              <VCol cols="6"><b>$ {{ totalAmount }} </b> </VCol>
          </VRow>
        </VCardText>
            <VCol cols="12">
                <VBtn
                  @click="onSubmit"
                 class="me-3"
                
                >
                Save
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
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
