<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
const store = useStore()
const isDisable = ref(true);
const currentTab = ref('0')
const isLoading = ref(false)
const isFormValid = ref(false)
const refForm = ref()
const name = ref('');
const slug = ref('');
const status = ref();
const description = ref('');
const price = ref('0.00'); 
const type = ref(null);
const isPrescription = ref(false);
const inTakeForm = ref(null);
const questiioneriesForm = ref(null);
const selectCategoryId =ref();
const uuid = ref();
const priceOptions = ref([ 'One Time', 'Monthly', 'Yearly', 'Quartly']);
const inTakeOptions = ref([]);
const categories = ref([]);
const sku =ref();
const product_id =ref();
const questionnaireOptions = ref([]);

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isDataEnable:{
    type: Boolean,
  },
  editProduct:{
    type:Object
  }
})

onBeforeMount(async () => {
    await store.dispatch('getCategoryList');
    categories.value = store.getters.getCategoryList;
    // console.log("getCategoryList",categories.value);
    
    await store.dispatch('getIntakeQuestionsFormList');
    inTakeOptions.value = store.getters.getIntakeQuestions;
    console.log("inTakeOptions",inTakeOptions.value);

    await store.dispatch('getQuestionerQuestionsFormList');
    questionnaireOptions.value = store.getters.getQuestionerQuestions;
    // console.log("inTakeOptions",inTakeOptions.value);
  });

const emit = defineEmits([
  'closeForm',
  'saveProductData',
  'dataSave'
]);


const editProduct = computed(() => {
        console.log("editProduct",props.editProduct);
        product_id.value = props.editProduct.id,
        uuid.value = props.editProduct.uuid;
        name.value = props.editProduct.pro_name;
        slug.value = props.editProduct.slug;
        description.value = props.editProduct.description;
        price.value = props.editProduct.price;
        type.value = props.editProduct.type;
        isPrescription.value = props.editProduct.prescription;
        sku.value = props.editProduct.sku;
        inTakeForm.value = props.editProduct.in_take_form_id;
        selectCategoryId.value = props.editProduct.category_id;
        status.value = props.editProduct.status;
        questiioneriesForm.value = props.editProduct.questiioneries_form_id;
    
})
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

const onSubmit = async() => {
  console.log('no');
  refForm.value?.validate().then(async({ valid }) => {
    if (valid) {
        console.log('yes');
      emit('updateProductData', {
        product_id: product_id.value,
        uuid:uuid.value,
        name: name.value,
        slug: slug.value,
        description: description.value,
        price: price.value,
        type: type.value,
        isPrescription: isPrescription.value,
        inTakeForm: inTakeForm.value,
        questiioneriesForm: questiioneriesForm.value,
        categporyId:selectCategoryId.value,
        sku:sku.value,
        status:status.value
      })
      emit('dataSave')
      emit('update:isDrawerOpen', false)
      
      isLoading.value = false
      
    }
  });
  
}

const formatPrice = () => {
  if (price.value) {
    // Convert to a float and format to two decimal places
    price.value = parseFloat(price.value).toFixed(2);
  } else {
    price.value = '0.00'; // Default to 0.00 if empty
  }
};
</script>

<template>
  <div v-if="editProduct"></div>
  <VNavigationDrawer
    temporary
    :width="800"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
   
  >
    
    <AppDrawerHeaderSection
      title="Edit Product"
      @cancel="closeNavigationDrawer"
    />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
          <VCardText>
            <v-form ref="refForm" >
            <v-row>
              <v-col cols="12" md="6">
                  <v-text-field
                    v-model="name"
                   :rules="[requiredValidator]"
                    label="Name"
                    outlined
                    required
                    @input="generateSlug"
                  ></v-text-field>
                </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="slug"
                  label="Slug"
                  outlined
                readOnly
                ></v-text-field>
              </v-col>
              
            </v-row>
              

      <v-row>
        <!-- Price, Prescription Checkbox, Intake Form, and Questionnaire Form in the Third Row -->
        <v-col cols="12" md="6">
          <v-select
            v-model="selectCategoryId"
            :items="categories"
            label="Category"
            outlined
            required
            item-title="name"
            item-value="id"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <VTextField
            v-model="price"
            type="number"
            label="Price"
            @blur="formatPrice" 
            @input="removeFormatting"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="type"
            :items="priceOptions"
            label="Type"
            outlined
            required
          ></v-select>
        </v-col>

        

        <v-col cols="12" md="6">
          <v-select
            v-model="inTakeForm"
            :items="inTakeOptions"
            label="Intake Form"
            outlined
            required
             item-title="name"
            item-value="id"
          ></v-select>
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="questiioneriesForm"
            :items="questionnaireOptions"
            label="Questionnaire Form"
            outlined
            required
             item-title="name"
            item-value="id"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
                <v-text-field
                  v-model="sku"
                  label="SKU"
                  outlined
                  ></v-text-field>
              </v-col>
        <v-col cols="12" md="6">
          <v-checkbox
            v-model="isPrescription"
            label="Requires Prescription"
            outlined
          ></v-checkbox>
        </v-col>

        <v-col cols="12" md="6">
          <VSelect
            v-model="status"
            label="Status"
            :items="['Active', 'Inactive']"
          ></VSelect>
        </v-col>
      </v-row>
      <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="description"
                    label="Description"
                    outlined
                    rows="4"
                  ></v-textarea>
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
