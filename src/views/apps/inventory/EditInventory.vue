<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
const store = useStore()
const isDisable = ref(true);
const currentTab = ref('0')
const isLoading = ref(false)
const isFormValid = ref(false)
const refForm = ref()
const inventoryType = ref()
const item_name = ref()
const manufPartNo = ref()
const barcode = ref()
const isTaxable = ref()
const vendor_name = ref()
const price = ref()
const cost = ref()
const onhand = ref()
const expirationDate = ref()
const sizeWeightNumber = ref()
const typicalDosageQty = ref()
const reorderPoint = ref()
const minimumOHDesired = ref()
const secondaryVendor = ref()
const secondaryVendorPartNo = ref()
const secondaryVendorBarcode = ref()
const lotNo = ref()
const description = ref()
const categorizationSubType = ref()
const cogsFactor = ref()
const categorizationType = ref()
const location = ref()
const osmolarityMOsmml = ref()
const isIV = ref(false)
const isTinchure = ref(false)
const isHormone = ref(false)
const isHerbalFormula = ref(false)
const isPharmaCompound = ref(false)
const other = ref(false)
const beforeBreakfast = ref()
const breakfast = ref()
const beforeLunch = ref()
const lunch = ref()
const beforeDinner = ref()
const dinner = ref()
const beforeSleep = ref()
const notes = ref()
const healthBenefits = ref()
const id = ref(0)
const locationList = ref([])
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isDataEnable:{
    type: Boolean,
  },
  editInvetory:{
    type: Object,
    required:true
  }
})
onBeforeMount(async () => {
  console.log("isDataEnable", props.isDataEnable);
  await store.dispatch('getLocations')
  locationList.value = store.getters.getLocationData
})
const isTabEnable = computed(() => {
  isDisable.value = true;
});
const inventoryData = computed(() => {
    let data = props.editInvetory;
    console.log("data", data);
    id.value = data.id,
    inventoryType.value = data.inventoryType;
    item_name.value =data.item_name;
    manufPartNo.value = data.manufPartNo;
    barcode.value = data.barcode
    isTaxable.value = data.isTaxable
    vendor_name.value = data.vendor_name
    price.value = data.price
    cost.value = data.cost
    onhand.value = data.onhand
    expirationDate.value = data.expirationDate
    sizeWeightNumber.value = data.sizeWeightNumber
    typicalDosageQty.value = data.typicalDosageQty
    reorderPoint.value = data.reorderPoint
    minimumOHDesired.value = data.minimumOHDesired
    secondaryVendor.value = data.secondaryVendor
    secondaryVendorPartNo.value = data.secondaryVendorPartNo
    secondaryVendorBarcode.value = data.secondaryVendorBarcode
    lotNo.value = data.lotNo
    description.value = data.description
    categorizationSubType.value = data.categorizationSubType
    cogsFactor.value = data.cogsFactor
    categorizationType.value = data.categorizationType
    location.value = data.location
    osmolarityMOsmml.value = data.osmolarityMOsmml
    isIV.value = data.isIV==1?true:false
    isTinchure.value = data.isTinchure==1?true:false
    isHormone.value = data.isHormone==1?true:false
    isHerbalFormula.value = data.isHerbalFormula==1?true:false
    isPharmaCompound.value = data.isPharmaCompound==1?true:false
    other.value = data.other==1?true:false
    beforeBreakfast.value = data.beforeBreakfast
    breakfast.value = data.breakfast
    beforeLunch.value = data.beforeLunch
    lunch.value = data.lunch
    beforeDinner.value = data.beforeDinner
    dinner.value = data.dinner
    beforeSleep.value = data.beforeSleep
    notes.value = data.notes
    healthBenefits.value = data.healthBenefits
});
const emit = defineEmits([
  'closeForm',
  'patientData',
  'dataSave'
]);

const closeNavigationDrawer = () => {
  currentTab.value = 0;
  emit('update:isDrawerOpen', false)  
  emit('reset-form')
  //TabsUpdate();
  
}

const addNewUser = async userData => {
  console.log('UserDataDrawn', userData);
  emit('userData',userData);
  isDisable.value = false;
  emit('update:isDrawerOpen', true)
  if(userData.checkIsFormOpen == 'saveClose'){
    currentTab.value = 0;
    emit('update:isDrawerOpen', false)
  }
  await nextTick();
}

const updateNewUser = async userData => {
  console.log('UserDataDrawn', userData);
  emit('updateUserData',userData);
  emit('update:isDrawerOpen', true)
  
  if(userData.checkIsFormOpen == 'saveClose'){
    emit('update:isDrawerOpen', false)
  }
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const onSubmit = async() => {
  isLoading.value = true
  refForm.value?.validate().then(async({ valid }) => {
    if (valid) {
      await store.dispatch('updateInventoryData', {
        id:id.value,
          inventoryType:inventoryType.value,
          item_name: item_name.value,
          manufPartNo:manufPartNo.value,
          barcode: barcode.value,
          isTaxable:  isTaxable.value,
          vendor_name:  vendor_name.value,
          price:  price.value,
          cost: cost.value,
          onhand: onhand.value,
          expirationDate: expirationDate.value,
          sizeWeightNumber: sizeWeightNumber.value,
          typicalDosageQty: typicalDosageQty.value,
          reorderPoint: reorderPoint.value,
          minimumOHDesired: minimumOHDesired.value,
          secondaryVendor:  secondaryVendor.value,
          secondaryVendorPartNo:  secondaryVendorPartNo.value,
          secondaryVendorBarcode:secondaryVendorBarcode.value,
          lotNo:  lotNo.value,
          description:  description.value,
          categorizationSubType:  categorizationSubType.value,
          cogsFactor: cogsFactor.value,
          categorizationType: categorizationType.value,
          location: location.value,
          osmolarityMOsmml: osmolarityMOsmml.value,
          isIV: isIV.value,
          isTinchure: isTinchure.value,
          isHormone:  isHormone.value,
          isHerbalFormula:  isHerbalFormula.value,
          isPharmaCompound: isPharmaCompound.value,
          other:  other.value,
          beforeBreakfast:  beforeBreakfast.value,
          breakfast:  breakfast.value,
          beforeLunch:  beforeLunch.value,
          lunch:  lunch.value,
          beforeDinner: beforeDinner.value,
          dinner: dinner.value,
          beforeSleep:  beforeSleep.value,
          notes:  notes.value,
          healthBenefits: healthBenefits.value
      })
      emit('dataSave')
      emit('update:isDrawerOpen', false)
      
      isLoading.value = false
      
    }
  });
  
}
</script>

<template>
  <div v-if="inventoryData"></div>
  <VNavigationDrawer
    temporary
    :width="800"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
   
  >
    
    <AppDrawerHeaderSection
      title="Edit  Inventory"
      @cancel="closeNavigationDrawer"
    />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
          <VCardText>
        <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <VCol cols="6">
                <AppSelect
                  v-model="inventoryType"
                  label="Item Type"
                  placeholder="Item Type"
                  :rules="[requiredValidator]"
                  :items="['Inventory', 'Non-inventory']"
                />
              </VCol>
              <!-- 👉 Full name -->
              <VCol cols="6">
                <AppTextField
                  v-model="item_name"
                  :rules="[requiredValidator]"
                  label="Item Name"
                  placeholder="Item Name"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="manufPartNo"
                  label="Manuf Part No"
                  placeholder="Manuf Part No"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="barcode"
                  label="Barcode"
                  placeholder="Barcode"
                />
              </VCol>

              <!-- 👉 Username -->
              <VCol cols="6">
                <AppSelect
                  v-model="isTaxable"
                  label="Taxable"
                  placeholder="Taxable"
                  :items="['Tax', 'Non-Tax']"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="6">
                <AppTextField
                  v-model="vendor_name"
                  :rules="[requiredValidator]"
                  label="Vendor Name"
                  placeholder="Vendor Name"
                />
              </VCol>
              <!-- 👉 Contact -->
              <VCol cols="6">
                <AppTextField
                  v-model="price"
                  type="number"
                  label="Price"
                  placeholder="Price"
                  step="0.01"  
                  min="0"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="cost"
                  type="number"
                  label="Cost"
                  placeholder="Cost"
                  step="0.01"  
                  min="0"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="onhand"
                  type="text"
                  label="On Hand"
                  placeholder="On Hand"
                   step="0.01"
                  min="0"
                />
              </VCol>
              <VCol cols="6">
                
                <AppDateTimePicker
                v-model="expirationDate"
                  type="date"
                  label="Expiration Date"
                  placeholder="Expiration Date"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="sizeWeightNumber"
                  label="Size (weight or number)"
                  placeholder="Size (weight or number)"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="typicalDosageQty"
                  label="Typical Dosage Qty"
                  placeholder="Typical Dosage Qty"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="reorderPoint"
                  label="Reorder Point"
                  placeholder="Reorder Point"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="minimumOHDesired"
                  type="number"
                  label="Minimum OH Desired"
                  placeholder="Minimum OH Desired"
                  step="0.0001"
                  min="0"
                />
              </VCol>

              <!-- 👉 Role -->
              <VCol cols="6">
                <AppTextField
                  v-model="secondaryVendor"
                  label="Secondary Vendor"
                  placeholder="Secondary Vendor"
                  
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="secondaryVendorPartNo"
                  label="Secondary Vendor Part No"
                  placeholder="Secondary Vendor Part No"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="secondaryVendorBarcode"
                  label="Secondary Vendor Barcode"
                  placeholder="Secondary Vendor Barcode"
                />
              </VCol>


              <VCol cols="6">
                <AppTextField
                  v-model="lotNo"
                  label="Lot No."
                  placeholder="Lot No"
                />
              </VCol>

              <VCol cols="6">
                <v-textarea
                  v-model="description"
                  label="Description"
                  placeholder="Description"
                />
              </VCol>

              <!-- 👉 Plan -->
              <VCol cols="6">
                <AppSelect
                  v-model="categorizationSubType"
                  label="Categorization Sub-type"
                  placeholder="Categorization Sub-type"
                  :items="['Male','Female', 'Test']"
                />
              </VCol>


              
              <VCol cols="6">
                <AppTextField
                  v-model="cogsFactor"
                  label="COGS(% Factor)"
                  placeholder="COGS(% Factor)"
                  step="0.01"
                  min="0"
                   type="number"
                />
              </VCol>

              <VCol cols="6">
                <AppSelect
                  v-model="categorizationType"
                  label="Categorization Type"
                  placeholder="Categorization Type"
                  :items="['Hormones']"
                />
              </VCol>

              <VCol cols="6">
                <AppSelect
                 v-model="location"
                  label="Location"
                  placeholder="Location"
                  :items="locationList"
                  item-value="uuid"
                  item-title="name"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="osmolarityMOsmml"
                  label="Osmolarity(mOsm/ml)"
                  placeholder="Osmolarity(mOsm/ml)"
                />
              </VCol> 
              <VCol cols="12">  
                <VRow class="d-flex flex-wrap">  
                  <VCol cols="auto">  
                    <VCheckbox  
                      v-model="isIV"  
                      label="IV"  
                    />  
                  </VCol>  
                  <VCol cols="auto">  
                    <VCheckbox  
                      v-model="isTinchure"  
                      label="Tincture"  
                    />  
                  </VCol>  
                  <VCol cols="auto">  
                    <VCheckbox  
                      v-model="isHormone"  
                      label="Hormone"  
                    />  
                  </VCol>  
                  <VCol cols="auto">  
                    <VCheckbox  
                      v-model="isHerbalFormula"  
                      label="Herbal Formula"  
                    />  
                  </VCol>  
                  <VCol cols="auto">  
                    <VCheckbox  
                      v-model="isPharmaCompound"  
                      label="Pharma Compound"  
                    />  
                  </VCol>  
                  <VCol cols="auto">  
                    <VCheckbox  
                      v-model="other"  
                      label="Other"  
                    />  
                  </VCol>  
                </VRow>  
              </VCol>  

              <VCol cols="6">
                <AppTextField
                  v-model="beforeBreakfast"
                  label="Before Breakfast"
                  placeholder="Before Breakfast"
                />
              </VCol>
              
              <VCol cols="6">
                <AppTextField
                  v-model="breakfast"
                  label="Breakfast"
                  placeholder="Breakfast"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="beforeLunch"
                  label="Before Lunch"
                  placeholder="Before Lunch"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="lunch"
                  label="Lunch"
                  placeholder="Lunch"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="beforeDinner"
                  label="Before Dinner"
                  placeholder="Before Dinner"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="dinner"
                  label="Dinner"
                  placeholder="Dinner"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="beforeSleep"
                  label="Before Sleep"
                  placeholder="Before Sleep"
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="healthBenefits"
                  label="Health Benefits"
                  placeholder="Health Benefits"
                />
              </VCol>
              <VCol cols="6">
                <v-textarea
                  v-model="notes"
                  label="Notes"
                  placeholder="Notes"
                />
              </VCol>

              

              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                 type="submit"
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
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
