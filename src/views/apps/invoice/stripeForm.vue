<script setup>
import { useInvoiceStore } from '@/stores/invoiceStore';
import { usePaymentStore } from '@/stores/paymentStore';
import { loadStripe } from '@stripe/stripe-js';
const invoiceStore = useInvoiceStore()
const paymentStore = usePaymentStore()
const cardElement = ref(null)
const paymentIntentId = ref('')
const elements = ref(null)
const stripe = ref(null)


onMounted(async () => {
  // Initialize Stripe
  paymentIntentId.value = invoiceStore.payIntentData.paymentIntent.id
  stripe.value = await loadStripe(invoiceStore.payIntentData.publishable_key, {
    stripeAccount: invoiceStore.payIntentData.stripe_account_id
  })

  // Create Elements instance
  elements.value = stripe.value.elements({
    clientSecret: invoiceStore.payIntentData.clientSecret
  })

  // Create and mount the Payment Element
  const paymentElement = elements.value.create('payment', {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '15px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  })

  paymentElement.mount(cardElement.value)
})

const handleSubmit = async () => {
  try {
    const { error } = await stripe.value.confirmPayment({
      elements: elements.value,
      confirmParams: {
        return_url: `${BASE_URL}/emr/payment/${invoiceStore.payIntentData.order_id}/complete`,

      },
    })

    if (error) {
      console.error(error)
      alert('Error creating payment method: ' + error.message)
    }
  } catch (error) {
    console.error(error)
    alert('Payment failed: ' + error.message)
  }
}
</script>
<template>

  <VForm @submit.prevent="handleSubmit">
    <label for="payment-intent-id" style="display: none;">{{ $t('Payment Intent ID:') }}</label>
    <input type="hidden" id="payment-intent-id" v-model="paymentIntentId" required>
    <br><br>
    <div ref="cardElement">
      <!-- Stripe Card Element will be inserted here -->
    </div>
    <br><br>

    <VCol cols="12">
      <VBtn type="submit">
        {{ $t('Pay') }}
      </VBtn>

    </VCol>

  </VForm>

</template>
<style scoped>
form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
}

button {
  background-color: #666EE8;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #5151d3;
}
</style>
