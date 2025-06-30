<script setup>
import { usePractitionerStore } from '@/stores/practitionerStore';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';

const practitionerStore = usePractitionerStore()
const store = useStore()
const isDisable = ref(true);
const currentTab = ref('0')
const isLoading = ref(false)
const isFormValid = ref(false)
const refForm = ref()
const affiliate_product_id = ref()
const referral_fee = ref('0.00');
const status = ref(false);
const selectBuilderId = ref();
const selectProductId = ref();
const products = ref([]);
const builders = ref([]);
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isDataEnable: {
    type: Boolean,
  },
  editProduct: {
    type: Object
  }
})

onBeforeMount(async () => {
  await practitionerStore.getloggedInPractitioner()
  let buildersRes = await $api(GET_PROVIDER_BUILDERS + '/' + practitionerStore.loggedInPractitioner?.id, {
    method: 'GET',
    onResponseError({ response }) {
      console.error('Error in API:', response);
    }
  });
  builders.value = buildersRes.data
  await store.dispatch('getPractitionerProductsList', { id: localStorage.getItem('LoginUserUUId') });
  products.value = store.getters.getPractitionerProducts;
  console.log("getPractitionerProducts", products.value);
});

const emit = defineEmits([
  'closeForm',
  'saveProductData',
  'dataSave'
]);


const editProduct = computed(() => {
  console.log("editProduct", props.editProduct);
  affiliate_product_id.value = props.editProduct.affiliate_product_id
  selectProductId.value = props.editProduct.product_id;
  selectBuilderId.value = props.editProduct.builder_id;
  referral_fee.value = props.editProduct.referral_fee;
  status.value = props.editProduct.status ? true : false;

})
const closeNavigationDrawer = () => {
  currentTab.value = 0;
  emit('update:isDrawerOpen', false)
  emit('reset-form')
  //TabsUpdate();

}


const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const generateSlug = () => {
  if (name.value) {
    slug.value = name.value
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  } else {
    slug.value = ''
  }
}

const onSubmit = async () => {
  console.log('no');
  refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      console.log('yes');
      emit('updateProductData', {
        id: affiliate_product_id.value,
        referral_fee: referral_fee.value,
        status: status.value,
        product_id: selectProductId.value,
        builder_id: selectBuilderId.value,
      })
      emit('dataSave')
      emit('update:isDrawerOpen', false)

      isLoading.value = false

    }
  });

}

const formatPrice = () => {
  if (referral_fee.value) {
    // Convert to a float and format to two decimal places
    referral_fee.value = parseFloat(referral_fee.value).toFixed(2);
  } else {
    referral_fee.value = '0.00'; // Default to 0.00 if empty
  }
};
</script>

<template>
  <div v-if="editProduct"></div>
  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">

    <AppDrawerHeaderSection title="Edit" @cancel="closeNavigationDrawer" />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <v-form ref="refForm">
            <v-row>
              <!-- Price, Prescription Checkbox, Intake Form, and Questionnaire Form in the Third Row -->
              <v-col cols="12" md="12">
                <v-select v-model="selectProductId" :items="products" label="Products" outlined required
                  item-title="name" item-value="id"></v-select>
              </v-col>
              <v-col cols="12" md="12">
                <v-select v-model="selectBuilderId" :items="builders" label="Builder" outlined required
                  item-title="builder_name" item-value="builder_id"></v-select>
              </v-col>
              <v-col cols="12" md="12">
                <VTextField v-model="referral_fee" type="number" label="Referral Fee" @blur="formatPrice"
                  @input="removeFormatting" />
              </v-col>

              <v-col cols="12" md="6">
                <v-checkbox v-model="status" label="Active" outlined></v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <!-- Submit Button in a Separate Row, Centered -->
              <v-col cols="12">
                <v-btn @click="onSubmit" color="primary">Update</v-btn>
              </v-col>
            </v-row>
          </v-form>

        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
