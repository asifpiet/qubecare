<script setup>
import { useAffiliateProductStore } from '@/stores/affiliateProductStore';
import { useBuilderStore } from '@/stores/builderStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import { useProductStore } from '@/stores/productStore';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { VTextField } from 'vuetify/components';

const { currentUser, currentRole, logout } = useAuth()
const practitionerStore = usePractitionerStore()
const affiliateProductStore = useAffiliateProductStore()
const productStore = useProductStore()
const builderStore = useBuilderStore()
affiliateProductStore.unloadAffiliateProduct()
const currentTab = ref('0')
const refForm = ref()
const products = ref([]);
const builders = ref([]);


const props = defineProps({
  product: {
    type: Object,
    default: {},
    required: false,
  },
})

if (props.product?.id)
  await affiliateProductStore.loadAffiliateProduct(props.product)

onBeforeMount(async () => {
  await builderStore.getBuildersList(currentUser.value?.id)
  builders.value = builderStore.builders

  await productStore.productsList()
  products.value = productStore.products;
  console.log("getPractitionerProducts", products.value);
});

const emit = defineEmits([
  'closeForm',
  'saveProductData',
  'dataSave'
]);

const onSubmit = async () => {
  console.log('no');
  refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      affiliateProductStore.saveAffiliateProduct()
      affiliateProductStore.isDrawerOpen = false

    }
  });

}
const formatPrice = () => {
  if (affiliateProductStore.affiliateProduct.referral_fee) {
    // Convert to a float and format to two decimal places
    affiliateProductStore.affiliateProduct.referral_fee = parseFloat(affiliateProductStore.affiliateProduct.referral_fee).toFixed(2);
  } else {
    affiliateProductStore.affiliateProduct.referral_fee = '0.00'; // Default to 0.00 if empty
  }
};
</script>

<template>
  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content"
    @update:model-value="affiliateProductStore.isDrawerOpen = false" :model-value="affiliateProductStore.isDrawerOpen">

    <AppDrawerHeaderSection :title="affiliateProductStore.id ? 'Edit Affiliate Network' : 'Add To Affiliate Network'"
      @cancel="affiliateProductStore.isDrawerOpen = false" />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <v-form ref="refForm">
            <v-row>
              <!-- Price, Prescription Checkbox, Intake Form, and Questionnaire Form in the Third Row -->
              <v-col cols="12" md="12">
                <v-select v-model="affiliateProductStore.affiliateProduct.product_id" :items="products" label="Products"
                  outlined required item-title="name" item-value="id"></v-select>
              </v-col>
              <v-col cols="12" md="12">
                <v-select v-model="affiliateProductStore.affiliateProduct.builder_id" :items="builders" label="Builder"
                  outlined required item-title="builder_name" item-value="builder_id"></v-select>
              </v-col>
              <v-col cols="12" md="12">
                <VTextField v-model="affiliateProductStore.affiliateProduct.referral_fee" type="number"
                  label="Referral Fee" @blur="formatPrice" @input="removeFormatting" />
              </v-col>

              <v-col cols="12" md="6">
                <v-checkbox v-model="affiliateProductStore.affiliateProduct.status" label="Active"
                  outlined></v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <!-- Submit Button in a Separate Row, Centered -->
              <v-col cols="12">
                <v-btn @click="onSubmit" color="primary">Submit</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
