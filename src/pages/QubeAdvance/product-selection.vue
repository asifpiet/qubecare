<script setup>
definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})
import { computed, onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
const store = useStore()
const router = useRouter()
const route = useRoute()
const products = ref([])
const builderData = JSON.parse(localStorage.getItem('builderData'));
onBeforeMount(async () => {
    store.dispatch('updateIsLoading', true)
    let pros = await $api(GET_PATIENT_PRODUCTS_API+'/'+builderData.builder_provider_id, {
        method: 'GET',
        onResponseError({ response }) {
            console.error('Error in plans API:', response);
        }
    });
    products.value = pros.data.filter(item => item.provider_id !== null);
    store.dispatch('updateIsLoading', false)
});

const cart = ref([]);  // Array to store selected product objects

// Add or remove product from the cart
const toggleCart = (product) => {
    const productIndex = cart.value.findIndex(item => item.id === product.id);
    if (productIndex !== -1) {
        cart.value.splice(productIndex, 1);  // Remove product from cart
    } else {
        // Add product with default properties
        const productWithDefaults = {
            ...product,
            qty: 1,
            subscription: product.subscription || false,
            onetime: product.onetime || true,
        };
        cart.value.push(productWithDefaults);  // Add product to cart
    }
    saveCartToLocalStorage();  // Save updated cart to localStorage
};

// Check if product is in the cart
const isInCart = (productId) => {
    return cart.value.some(item => item.id === productId);
};

// Save the cart to localStorage
const saveCartToLocalStorage = () => {
    localStorage.setItem('cart_products', JSON.stringify(cart.value));
};

// Get the number of items in the cart
const cartCount = computed(() => cart.value.length);

// Show cart contents (for demo purposes)
const showCart = () => {
    console.log('cartCount',cartCount.value,builderData)
    store.dispatch('updateIsTonalSnackbar', false)
    store.dispatch('updateErrorMessage', null)
    // alert('Cart contains: ' + cart.value.map(item => item.name).join(', '));
    if(cartCount.value > 0){
        localStorage.setItem('next_page',builderData.patientFlow[0])
        router.replace(route.query.to ? String(route.query.to) : '/'+builderData.theme_name+'/'+builderData.patientFlow[0])
    }else{
        store.dispatch('updateIsTonalSnackbar', true)
        store.dispatch('updateErrorMessage', 'Please select a product')
    }
    
};
</script>

<template>
  <v-container>
    <v-row>
        <VCol cols="12" md="12">
            <div class="float-right">
                <v-badge :content="cartCount" color="primary" class="ml-2">
                    <span class="caption">Items in Cart &nbsp;&nbsp;</span>
                </v-badge>
            </div>
        </VCol>
        <v-col v-for="product in products" :key="product.id" cols="12" md="4">
            <v-card>
                <v-img :src="product.image || 'https://via.placeholder.com/150'" height="200px" class="w-100" cover></v-img>
                <v-card-title>
                <v-row>
                    <v-col class="text-start">{{ product.name }}</v-col>
                    <v-col class="text-end font-weight-bold">${{ product.price }}</v-col>
                </v-row>
                </v-card-title>
                <v-card-subtitle class="mb-4">{{ product.description }}</v-card-subtitle>
                <div class="text-center" style="margin: 10px;">
                <v-btn
                    @click="toggleCart(product)"
                    :color="isInCart(product.id) ? 'error' : 'primary'"
                    class="mb-4"
                    :icon="isInCart(product.id) ? 'tabler-shopping-cart-minus' : 'tabler-shopping-cart-plus'"
                    :title="isInCart(product.id) ? 'Remove from cart' : 'Add to cart'"
                    rounded
                    block
                />
                </div>
            </v-card>
        </v-col>
    </v-row>
    <v-divider></v-divider>

    <div class="mt-4 float-right">
      <v-btn @click="showCart" color="success">Next</v-btn>
    </div>
  </v-container>
</template>
