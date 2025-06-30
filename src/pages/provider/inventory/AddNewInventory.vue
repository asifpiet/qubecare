<script setup>
import { useInventoryStore } from '@/stores/inventoryStore';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
const inventoryStore = useInventoryStore()
inventoryStore.unloadInventory()
const currentTab = ref('0')
const isLoading = ref(false)
const isFormValid = ref(false)
const refForm = ref()
const locationList = ref([])
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isDataEnable: {
    type: Boolean,
  },
  inventory: {
    type: Object,
    default: {},
    required: false,
  },
})

if (props.inventory) {
  console.log("inventory", props.inventory);
  inventoryStore.loadInventory(props.inventory)
}

const emit = defineEmits([
  'closeForm',
  'patientData',
  'dataSave'
]);

const closeNavigationDrawer = () => {
  inventoryStore.isDrawerOpen = false;
  emit('customEvent', false)
  emit('update:isDrawerOpen', false)
}


const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const onSubmit = async () => {
  refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      inventoryStore.saveInventory()
      inventoryStore.isDrawerOpen = false
      closeNavigationDrawer();
    }
  });

}
</script>

<template>
  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content"
    @update:model-value="inventoryStore.isDrawerOpen = false" :model-value="inventoryStore.isDrawerOpen">

    <AppDrawerHeaderSection :title="props.inventory ? $t('Edit Inventory') : $t('Add Inventory')"
      @cancel="inventoryStore.isDrawerOpen = false" />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <VCol cols="6">
                <AppSelect v-model="inventoryStore.inventory.inventoryType" :label="$t('Item Type')"
                  :placeholder="$t('Item Type')" :rules="[requiredValidator]" :items="['Inventory', 'Non-inventory']" />
              </VCol>
              <!-- 👉 Full name -->
              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.item_name" :rules="[requiredValidator]"
                  :label="$t('Item Name')" :placeholder="$t('Item Name')" />
              </VCol>
              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.manufPartNo" :label="$t('Manuf Part No')"
                  :placeholder="$t('Manuf Part No')" />
              </VCol>
              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.barcode" :label="$t('Barcode')"
                  :placeholder="$t('Barcode')" />
              </VCol>

              <!-- 👉 Username -->
              <VCol cols="6">
                <AppSelect v-model="inventoryStore.inventory.isTaxable" :rules="[requiredValidator]"
                  :label="$t('Taxable')" :placeholder="$t('Taxable')" :items="['Tax', 'Non-Tax']" />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.vendor_name" :rules="[requiredValidator]"
                  :label="$t('Vendor Name')" :placeholder="$t('Vendor Name')" />
              </VCol>
              <!-- 👉 Contact -->
              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.price" type="number" :label="$t('Price')"
                  :placeholder="$t('Price')" :rules="[requiredValidator]" step="0.01" min="0" />
              </VCol>
              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.cost" :rules="[requiredValidator]" type="number"
                  :label="$t('Cost')" :placeholder="$t('Cost')" step="0.01" min="0" />
              </VCol>
              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.onhand" :rules="[requiredValidator]" type="number"
                  :label="$t('On Hand')" :placeholder="$t('On Hand')" step="0.01" min="0" />
              </VCol>
              <VCol cols="6">

                <AppDateTimePicker v-model="inventoryStore.inventory.expirationDate" type="date"
                  :label="$t('Expiration Date')" :rules="[requiredValidator]" :placeholder="$t('Expiration Date')" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.sizeWeightNumber" :label="$t('Size (weight or number)')"
                  :placeholder="$t('Size (weight or number)')" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.typicalDosageQty" :label="$t('Typical Dosage Qty')"
                  :placeholder="$t('Typical Dosage Qty')" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.reorderPoint" :label="$t('Reorder Point')"
                  :placeholder="$t('Reorder Point')" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.minimumOHDesired" :rules="[requiredValidator]"
                  type="number" :label="$t('Minimum OH Desired')" :placeholder="$t('Minimum OH Desired')" step="0.01"
                  min="0" />
              </VCol>

              <!-- 👉 Role -->
              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.secondaryVendor" :rules="[requiredValidator]"
                  :label="$t('Secondary Vendor')" :placeholder="$t('Secondary Vendor')" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.secondaryVendorPartNo" :rules="[requiredValidator]"
                  :label="$t('Secondary Vendor Part No')" :placeholder="$t('Secondary Vendor Part No')" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.secondaryVendorBarcode" :rules="[requiredValidator]"
                  :label="$t('Secondary Vendor Barcode')" :placeholder="$t('Secondary Vendor Barcode')" />
              </VCol>


              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.lotNo" :rules="[requiredValidator]"
                  :label="$t('Lot No.')" :placeholder="$t('Lot No')" />
              </VCol>

              <VCol cols="6">
                <v-textarea v-model="inventoryStore.inventory.description" :label="$t('Description')"
                  :placeholder="$t('Description')" />
              </VCol>

              <!-- 👉 Plan -->
              <VCol cols="6">
                <AppSelect v-model="inventoryStore.inventory.categorizationSubType"
                  :label="$t('Categorization Sub-type')" :placeholder="$t('Categorization Sub-type')"
                  :rules="[requiredValidator]" :items="['Male', 'Female', 'Test']" />
              </VCol>



              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.cogsFactor" :label="$t('COGS(% Factor)')"
                  :placeholder="$t('COGS(% Factor)')" :rules="[requiredValidator]" step="0.01" min="0" type="number" />
              </VCol>

              <VCol cols="6">
                <AppSelect v-model="inventoryStore.inventory.categorizationType" :label="$t('Categorization Type')"
                  :rules="[requiredValidator]" :placeholder="$t('Categorization Type')" :items="['Hormones']" />
              </VCol>

              <VCol cols="6">

                <AppSelect v-model="inventoryStore.inventory.location" :label="$t('Location')"
                  :placeholder="$t('Location')" :items="locationList" item-value="uuid" item-title="name" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.osmolarityMOsmml" :label="$t('Osmolarity(mOsm/ml)')"
                  :rules="[requiredValidator]" :placeholder="$t('Osmolarity(mOsm/ml)')" />
              </VCol>
              <VCol cols="12">
                <VRow class="d-flex flex-wrap">
                  <VCol cols="auto">
                    <VCheckbox v-model="inventoryStore.inventory.isIV" :label="$t('IV')" />
                  </VCol>
                  <VCol cols="auto">
                    <VCheckbox v-model="inventoryStore.inventory.isTinchure" :label="$t('Tincture')" />
                  </VCol>
                  <VCol cols="auto">
                    <VCheckbox v-model="inventoryStore.inventory.isHormone" :label="$t('Hormone')" />
                  </VCol>
                  <VCol cols="auto">
                    <VCheckbox v-model="inventoryStore.inventory.isHerbalFormula" :label="$t('Herbal Formula')" />
                  </VCol>
                  <VCol cols="auto">
                    <VCheckbox v-model="inventoryStore.inventory.isPharmaCompound" :label="$t('Pharma Compound')" />
                  </VCol>
                  <VCol cols="auto">
                    <VCheckbox v-model="inventoryStore.inventory.other" :label="$t('Other')" />
                  </VCol>
                </VRow>
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.beforeBreakfast" :label="$t('Before Breakfast')"
                  :placeholder="$t('Before Breakfast')" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.breakfast" :label="$t('Breakfast')"
                  :placeholder="$t('Breakfast')" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.beforeLunch" :label="$t('Before Lunch')"
                  :placeholder="$t('Before Lunch')" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.lunch" :label="$t('Lunch')"
                  :placeholder="$t('Lunch')" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.beforeDinner" :label="$t('Before Dinner')"
                  :placeholder="$t('Before Dinner')" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.dinner" :label="$t('Dinner')"
                  :placeholder="$t('Dinner')" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.beforeSleep" :label="$t('Before Sleep')"
                  :placeholder="$t('Before Sleep')" />
              </VCol>
              <VCol cols="6">
                <AppTextField v-model="inventoryStore.inventory.healthBenefits" :label="$t('Health Benefits')"
                  :placeholder="$t('Health Benefits')" />
              </VCol>
              <VCol cols="12">
                <v-textarea v-model="inventoryStore.inventory.notes" :label="$t('Notes')" :placeholder="$t('Notes')" />
              </VCol>



              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3">
                  {{ $t('Save') }}
                </VBtn>
                <VBtn type="reset" variant="tonal" color="error" class="ml-3" @click="closeNavigationDrawer">
                  {{ $t('Close') }}

                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
