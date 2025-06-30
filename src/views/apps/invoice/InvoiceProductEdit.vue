<script setup>  
import { computed, ref, watch } from 'vue';
const diagnosisArray = ref([])
const props = defineProps({  
  id: {  
    type: Number,  
    required: true,  
  }, 
  diagnoses : {  
    type: Array,  
    required: true,  
  },
  data: {  
    type: Array,  
    required: true,  
 
  },  
});  

// Emit events to parent component  
const emit = defineEmits(['removeProduct', 'totalAmount',  'updateTotal']);  

// Product options fetched from API  
const itemsOptions = ref([]);  

// Fetch product data on mount  
const fetchProduct = async () => {  
  const { data, error } = await useApi(GET_PRODUCT_API);  
  if (error.value) {  
    console.log(error.value);  
  } else {  
    itemsOptions.value = data.value.data;  
  }  
};  

fetchProduct();  

// Selected item and local product data  
const selectedItem = ref();  
const localProductData = ref(props.data);  

const updateTotal = () => {
  console.log('totalShipping.value',localProductData.value)
  emit('updateTotal', {
    id: props.id,
    data: localProductData.value,
    totalPrice:totalPrice.value
  });
};

// Function to update product details when a new item is selected from the dropdown  
watch(() => localProductData.value.qty, updateTotal);
watch(() => localProductData.value.price, updateTotal);
const updateProductDetails = (index,value) => {
  const selectedProduct = itemsOptions.value.find(item => item.id === localProductData.value[index].pro_id);

  if (selectedProduct) {
    localProductData.value[index] = {
      ...localProductData.value[index],
      id: index,//selectedProduct.id || Date.now(),
      price: selectedProduct.price || 0,
      subtotal:Number(selectedProduct.price) * Number(selectedProduct.qty)
    };
    updateTotal();
  }
};
// Emit initial total on component mount
onBeforeMount(() => {
  updateTotal();
});
onMounted(() => {
  updateTotal()
})
watch(localProductData, () => {
  updateTotal();
}, { deep: true });

// Function to add a new item  
const addNewItem = () => {
  let index=1  
  localProductData.value.push({  
    id:index++,  
    pro_id: '',  
    qty: 1,  
    price: 0.00, 
    date_of_service: '',
    subtotal: 0,  
  });  
};  



watch(() => localProductData.value.qty, updateTotal);
watch(() => localProductData.value.price, updateTotal);
const totalPrice = computed(() =>
  localProductData.value.reduce((sum, product) =>
    sum + Number(product.price) * Number(product.qty), 0)
);

// Watch for changes in qty and price to update subtotal  
localProductData.value.forEach((_, index) => {  
  watch(() => localProductData.value[index].qty, () => updateTotal(index));  
  watch(() => localProductData.value[index].price, () => updateTotal(index));  
});  

watch(() => localProductData.value.qty, updateTotal);
watch(() => localProductData.value.price, updateTotal)

// Function to remove a product  
const removeProduct = (index) => {  
  localProductData.value.splice(index, 1); // Remove item at the provided index  

  emit('totalAmount', totalPrice.value); // Emit total after removal  
};  

</script>  

<template>  
  <div class="add-products-header mb-2 d-none d-md-flex mb-4">  
    <VRow class="me-10">
      <VCol cols="12" md="3">  
        <h6 class="text-h6">Date Of Service</h6>  
      </VCol>   
      <VCol cols="12" md="3">  
        <h6 class="text-h6">Product</h6>  
      </VCol>  
      <VCol cols="12" md="2">  
        <h6 class="text-h6 ps-2">Qty</h6>  
      </VCol>  
      <VCol cols="12" md="2">  
        <h6 class="text-h6 ps-2">Price</h6>  
      </VCol>  
      <VCol cols="12" md="2">  
        <h6 class="text-h6">SubTotal</h6>  
      </VCol>  
    </VRow>  
  </div>  
  <div v-for="(product, index) in localProductData" :key="product.id">  
    <VCard flat border class="d-flex flex-sm-row flex-column-reverse">  
      <div class="pa-6 flex-grow-1">  
        <VRow> 
          <VCol cols="12" md="3">   
          <div class="d-flex gap-x-4 align-start align-sm-center flex-column flex-sm-row">
         
          <span style="min-inline-size: 9.5rem;">
            <AppDateTimePicker
              v-model="product.date_of_service"
              placeholder="Date Of Service"
              :config="{ position: 'auto right' }"
            />
          </span>
        </div>
      </VCol>
          <VCol cols="12" md="3">  
            <AppSelect  
              v-model="product.pro_id"  
              :items="itemsOptions"  
              item-title="pro_name"  
              item-value="id"  
              placeholder="Select Item"  
              class="mb-6"  
              @update:modelValue="(value) => updateProductDetails(index, value)"  
            />  
          </VCol>

          <VCol cols="12" md="2" sm="4">  
            <AppTextField  
              v-model.number="product.qty" 
              type="number"  
              placeholder="Qty"  
              class="mb-6"  
            />  
          </VCol>  
          <VCol cols="12" md="2" sm="4">  
            <AppTextField  
              v-model.number="product.price" 
              type="number"  
              placeholder="Price"  
            />  
          </VCol>  
          <VCol cols="12" md="2" sm="4">  
            <p class="my-2">  
              <span class="d-inline d-md-none">SubTotal: </span>  
              <span class="text-high-emphasis">      ${{ (Number(product.price) * Number(product.qty)).toFixed(2) }}</span>  
            </p>  
          </VCol>
          
            
        </VRow>  
      </div>  
      <div class="d-flex flex-column align-end item-actions" :class="$vuetify.display.smAndUp ? 'border-s' : 'border-b' ">  
        <IconBtn size="36" @click="removeProduct(index)">  
          <VIcon :size="20" icon="tabler-trash" />  
        </IconBtn>  
      </div>  
    </VCard>  
  </div>  
  <VBtn size="small" prepend-icon="tabler-plus" @click="addNewItem" class="mt-3">  
    Add Item  
  </VBtn>  
  
</template>
