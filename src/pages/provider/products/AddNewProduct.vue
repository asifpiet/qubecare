<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Product Add',
  },
})
import { useCategoryStore } from '@/stores/categoryStore';
import { useFormsStore } from '@/stores/formsStore';
import { useProductStore } from '@/stores/productStore';
import {
  requiredValidator,
} from '@core/utils/validators';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { VTextField } from 'vuetify/components';

const categoryStore = useCategoryStore()
const formsStore = useFormsStore()
const productStore = useProductStore()
productStore.unloadProduct()
const refForm = ref()
const priceOptions = ref(['One Time', 'Monthly', 'Yearly', 'Quartly']);
const inTakeOptions = ref([]);
const categories = ref([]);
const questionnaireOptions = ref([]);
const props = defineProps({
  product: {
    type: Object,
    default: {},
    required: false,
  },
})
if (props.product?.id)
  await productStore.loadProduct(props.product)

onBeforeMount(async () => {
  await categoryStore.getCategoryList();
  categories.value = categoryStore.categories;
  await formsStore.getFormByType('charting-forms')
  //await formsStore.getIntakeFormsList();
  inTakeOptions.value = formsStore.forms;

  //await formsStore.getQuestionnaireFormsList();
  await formsStore.getFormByType('simple-forms')
  questionnaireOptions.value = formsStore.forms;
});

const emit = defineEmits([
  'closeForm',
  'saveProductData',
  'dataSave',
  'saveData'
]);

const generateSlug = () => {
  if (productStore.product.name) {
    productStore.product.slug = productStore.product.name
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  } else {
    productStore.product.slug = ''
  }
}

const onSubmit = async () => {
  refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      productStore.saveProduct()
      productStore.isDrawerOpen = false
      emit('saveData', true)
    }
  });

}
const formatPrice = () => {
  if (productStore.product.price) {
    productStore.product.price = parseFloat(productStore.product.price).toFixed(2);
  } else {
    productStore.product.price = '0.00';
  }
};
</script>

<template>
  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content product-drawer"
    @update:model-value="productStore.isDrawerOpen = false" :model-value="productStore.isDrawerOpen" style="z-index: 9999999 !important;">

    <AppDrawerHeaderSection :title="productStore.id ? $t('Edit Product') : $t('Add Product')"
      @cancel="productStore.isDrawerOpen = false" />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <v-form ref="refForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="productStore.product.name" :rules="[requiredValidator]" :label="$t('Name')"
                  outlined required @input="generateSlug"></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="productStore.product.slug" :label="$t('Slug')" outlined readOnly></v-text-field>
              </v-col>

            </v-row>


            <v-row>
              <!-- Price, Prescription Checkbox, Intake Form, and Questionnaire Form in the Third Row -->
              <v-col cols="12" md="6">
                <AppSelect v-model="productStore.product.category_id" :items="categories" :label="$t('Category')"
                  outlined required item-title="name" item-value="id" :rules="[requiredValidator]"></AppSelect>
              </v-col>
              <v-col cols="12" md="6">
                <VTextField v-model="productStore.product.price" type="number" :label="$t('Price')" @blur="formatPrice"
                  @input="removeFormatting" prefix="$" />
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="productStore.product.type" :items="priceOptions" :label="$t('Payment Type')" outlined
                  required></v-select>
              </v-col>



              <v-col cols="12" md="6">
                <v-select v-model="productStore.product.inTakeForm_id" :items="inTakeOptions" :label="$t('Intake Form')"
                  outlined required item-title="name" item-value="id"></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="productStore.product.questiioneriesForm_id" :items="questionnaireOptions"
                  :label="$t('Questionnaire Form')" outlined required item-title="name" item-value="id"></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="productStore.product.sku" :label="$t('SKU')" outlined></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-checkbox v-model="productStore.product.isPrescription" :label="$t('Requires Prescription')"
                  outlined></v-checkbox>
              </v-col>

              <v-col cols="12" md="6">
                <VSelect v-model="productStore.product.status" :label="$t('Status')" :items="['Active', 'InActive']"
                  :rules="[requiredValidator]">
                </VSelect>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-textarea v-model="productStore.product.description" :label="$t('Description')" outlined
                  rows="4"></v-textarea>
              </v-col>
            </v-row>

            <v-row>
              <!-- Submit Button in a Separate Row, Centered -->
              <v-col cols="12">
                <v-btn @click="onSubmit" color="primary">{{ $t('Submit') }}</v-btn>
              </v-col>
            </v-row>
          </v-form>

        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>

<style lang="scss">
.product-drawer {
  /* Ensure the drawer has an extremely high z-index */
  z-index: 9999999 !important;
  
  /* Make sure all dropdown menus appear above everything else with even higher z-index */
  .v-menu__content {
    z-index: 10000000 !important;
  }
  
  /* Ensure select dropdowns are visible */
  .v-select__menu, 
  .v-autocomplete__content {
    z-index: 10000000 !important;
  }
  
  /* Target the overlay that might be blocking */
  & + .v-overlay {
    z-index: 9999998 !important;
  }
}

/* Global override for Vuetify's menu content when our drawer is open */
body:has(.product-drawer) .v-overlay {
  z-index: 10000000 !important;
}
</style>
