<script setup>
import { useInvoiceStore } from '@/stores/invoiceStore';
import { usePaymentStore } from '@/stores/paymentStore';
import stripeForm from '@/views/apps/invoice/stripeForm.vue';
import { VRow } from 'vuetify/components';
const { currentUser, currentRole, logout } = useAuth()
const paymentStore = usePaymentStore()
const loadHtml = ref(false)
const saveCard = ref(true)

const dropOption = ref([{ title: 'With Stored Card', value: 'with_pervious_card' }, { title: 'Add New Card', value: 'new_card' }])
const dataForm = ref({
  paymentMethod: 'Stripe',
  apiKey: null,
  apiSecret: null
})
const invoiceStore = useInvoiceStore()
const props = defineProps({
  data: {
    type: null,
    required: true,
  },
})
const deliveryOptions = [
  {
    icon: 'tabler-brand-stripe',
    title: 'Stripe',
    desc: 'Select Payment Method For setup.',
    value: 'Stripe',
    color: 'primary'
  },
  // {
  //   icon: 'tabler-brand-paypal',
  //   title: 'Paypal',
  //   desc: 'Setup for Paypal Payment Method',
  //   value: 'paypal',
  //   color: 'primary'
  // },

]
const cardDetails = ref(props.data);
const emit = defineEmits([
  'update:isDrawerOpen',
  'submit',
])
console.log('props.data', props.data)
const refForm = ref();
const isFormValid = ref(false)
const lodaHtml = ref(false)
const payCard = ref('with_pervious_card');
const patientCards = ref([]);
await invoiceStore.getPatientStoredCard(cardDetails.value.patient_id)
const submitPayment = async () => {
  if (payCard.value == 'with_pervious_card') {

    cardDetails.value.payment_gateway = dataForm.value.paymentMethod
    cardDetails.value.payment_method = "card"


    cardDetails.value.patientPreCard = true
    cardDetails.value.card_order_id = patientCards.value
    cardDetails.value.payment_method_id = patientCards.value
    cardDetails.value.payment_type = payCard.value
    await invoiceStore.patientPayInvoice(cardDetails.value)
    // await paymentStore.paymentProcess(cardDetails.value)
    // console.log('Payment submitted', cardDetails.value);

    // if (paymentStore.processPayment.success) {
    //   lodaHtml.value = true
    // }

    clearCardDetails()
    emit('submit', 'success')
  } else {
    refForm.value?.validate().then(async ({ valid }) => {
      if (valid) {
        // Process payment logic here  
        cardDetails.value.card_order_id = ''
        cardDetails.value.patientPreCard = false
        cardDetails.value.payment_gateway = dataForm.value.paymentMethod
        cardDetails.value.payment_method = "card"
        //await paymentStore.paymentProcess(cardDetails.value)
        await invoiceStore.patientPayInvoice(cardDetails.value)
        clearCardDetails()
        emit('submit', 'success')
        //isAddPaymentPoup.value = false; // Close dialog after submit  
      }
    })
  }

}
const clearCardDetails = () => {
  cardDetails.value = {
    cardholderName: null,
    cardNumber: null,
    expiryDate: null,
    cvv: null,
    patientPreCard: true,
    card_order_id: null // Reset additional properties if needed  

  };
};
watch(
  () => payCard.value,
  async (form_id) => {
    if (payCard.value == "new_card") {
      console.log('Ref value:', payCard.value, currentRole.value)

      cardDetails.value.card_order_id = ''
      cardDetails.value.patientPreCard = false
      cardDetails.value.payment_gateway = dataForm.value.paymentMethod
      cardDetails.value.payment_method = "card"
      cardDetails.value.payment_type = payCard.value
      cardDetails.value.payment_method_id = ''
      cardDetails.value.save_card = saveCard.value

      await invoiceStore.patientPayInvoice(cardDetails.value)
      console.log(invoiceStore.payIntentData)
      if (invoiceStore.payIntentData.success) {
        loadHtml.value = true
      }
    } else {
      loadHtml.value = false
    }


  }
);

const paymentProcess = async (selectedValue) => {

}
</script>

<template>
  <VRow>
    <CustomRadiosWithIcon v-model:selected-radio="dataForm.paymentMethod" :radio-content="deliveryOptions"
      :grid-column="{ cols: '12', sm: '6' }">
      <template #default="{ item }">
        <div class="d-flex flex-column align-center gap-2 w-100">

          <VIcon size="28" :icon="item.icon" class="text-high-emphasis" />

          <h6 class="text-h6">
            {{ item.title }}
          </h6>
          <p class="text-body-2 mb-0">
            {{ item.desc }}
          </p>
        </div>
      </template>
    </CustomRadiosWithIcon>
    <VCol cols="12">
      <AppSelect v-model="payCard" :label="$t('Select Pay With')" :placeholder="$t('Select Pay With')"
        :items="dropOption" />
    </VCol>
  </VRow>
  <VRow v-if="!loadHtml">

    <VCol cols="12" v-if="payCard == 'with_pervious_card'">

      <AppSelect v-model="patientCards" :label="$t('Patient Cards')" :placeholder="$t('Patient Cards')"
        :items="invoiceStore.storedCard" item-value="id" item-title="card.last4" />
    </VCol>
    <VCol cols="12" v-if="payCard == 'with_pervious_card'">
      <VBtn @click="submitPayment">
        {{ $t('Pay') }}
      </VBtn>

    </VCol>
  </VRow>
  <div v-if="payCard == 'new_card'">

    <stripeForm v-if="loadHtml" />

  </div>



</template>
