<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Invoice Add',
  },
})
import { useInvoiceStore } from '@/stores/invoiceStore';
import InvoiceEditable from '@/views/apps/invoice/addInvoice.vue';
import InvoiceSendInvoiceDrawer from '@/views/apps/invoice/InvoiceSendInvoiceDrawer.vue';
import { useRouter } from 'vue-router';

const invoiceStore = useInvoiceStore()
const productArray = ref([]);
const diagnosesArray = ref([]);
// 👉 Default Blank Data
const router = useRouter()
const invoiceData = ref({
  invoice: {
    id: 5037,
    issuedDate: '',
    service: '',
    avatar: '',
    invoiceStatus: '',
    dueDate: '',
    balance: 0,
    patient_id: '',
    client: {
      email: '',
      phone_contact: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      full_name: 'Select Patient',
      DOB: '',
      uuid: ''
    },
  },
  paymentDetails: {
    totalDue: 0.00,
    bankName: 'American Bank',
    country: 'United States',
    iban: 'ETD95476213',
    swiftCode: 'BR91905',

  },
  diagnoses: [{ diagnoses_id: 0, diagnoses_title: '' }],
  otherLineItem: [{ id: 0, date_of_service: '', price: 0.00, description: '' }],
  purchasedProducts: [{
    id: 0,
    pro_id: '',
    qty: 1,
    price: 0.00,
    date_of_service: '',
    subtotal: 0,
  }
  ],
  notes: '',
  paymentMethod: '',
  salesperson: '',
  thanksNote: '',
  clientNotes: true,
  grandTotal: 0.00,
  edit: false
})
const clientErrors = reactive({});
const productErrors = ref([]);
const validatePurchasedProducts = (products, client) => {
  const errors = [];

  products.forEach((product, index) => {
    const productErrors = {};

    // Validate Product ID
    // if (!client.uuid.trim()) {
    //   productErrors.uuid = 'Patient field is required!';
    // }

    // Add errors for the product if any
    if (Object.keys(productErrors).length) {
      errors.push({
        index, // Keep track of the product's index
        errors: productErrors,
      });
    }
  });

  return errors;
};

const validateInvoice = () => {

  productErrors.value = validatePurchasedProducts(invoiceData.value.purchasedProducts, invoiceData.value.invoice.client);

  if (productErrors.value.length === 0) {
    return true
  } else {
    console.error('Validation Errors:', clientErrors, productErrors.value);
    return false
  }
};
const paymentTerms = ref(true)

const paymentStub = ref(false)
const selectedPaymentMethod = ref('Card Payment')

const paymentMethods = [
  'Card Payment',

]

const isSendPaymentSidebarVisible = ref(false)

const addProduct = value => {

  invoiceData.value?.purchasedProducts.push(value)
  console.log(invoiceData.value)
}
const getdataForm = (value) => {
  productArray.value = value
  console.log(productArray.value)

}
const addDiagonses = (value) => {
  diagnosesArray.value = value
  console.log(diagnosesArray.value)
}

const removeProduct = id => {
  invoiceData.value?.purchasedProducts.splice(id, 1)
}
const handleSubmit = async () => {
  // You can access your invoice data here 


  if (validateInvoice()) {


    invoiceData.value.invoice.patient_id = invoiceData.value.invoice.client.id
    invoiceData.value.invoice.grandTotal = invoiceData.value.grandTotal
    invoiceData.value.invoice.notes = invoiceData.value.notes
    invoiceData.value.invoice.clientNotes = invoiceData.value.clientNotes
    invoiceData.value.invoice.paymentMethod = selectedPaymentMethod.value
    const submittedData = {
      invoice: { ...invoiceData.value.invoice },
      //paymentDetails: { ...invoiceData.value.paymentDetails },

      purchasedProducts: invoiceData.value.purchasedProducts.length > 0 && invoiceData.value.purchasedProducts[0].pro_id != '' ? invoiceData.value.purchasedProducts : [],
      diagnoses: invoiceData.value.diagnoses.length > 0 && invoiceData.value.diagnoses[0].diagnoses_title != '' ? invoiceData.value.diagnoses : [],
      otherLineItem: invoiceData.value.otherLineItem.length > 0 && invoiceData.value.otherLineItem[0].price != 0.00 ? invoiceData.value.otherLineItem : [],

    };
    await invoiceStore.saveInvoice(submittedData)
    // await store.dispatch('saveInvoice', submittedData)

    if (!invoiceData.value.edit) {
      let storeData = invoiceStore.invoice
      if (storeData.invoice.invoice_id) {
        await router.push('/provider/invoice/preview/' + storeData.invoice.invoice_id)
      }
    }
    // 
    // Perform submission logic, such as an API call  
    console.log('Submitting Invoice Data:', submittedData);
  }

};
</script>

<template>
  <VRow>
    <!-- 👉 InvoiceEditable -->

    <VCol cols="12" md="9">
      <div v-if="productErrors.length > 0" style="color: red;" class="pa-2 pa-sm-5">
        <h3>Validation Errors:</h3>
        <ul>
          <li v-for="(error, idx) in productErrors" :key="idx">

            <ul>
              <li v-for="(msg, key) in error.errors" :key="key">
                {{ msg }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <InvoiceEditable :data="invoiceData" @push="addProduct" @remove="removeProduct" @getDataArray="getdataForm"
        @addDiagonses="addDiagonses" @error="" />
    </VCol>

    <!-- 👉 Right Column: Invoice Action -->
    <VCol cols="12" md="3">
      <VCard class="mb-8">

        <VCardText>
          <!-- 👉 Send Invoice -->
          <VBtn block prepend-icon="tabler-send" class="mb-4" @click="isSendPaymentSidebarVisible = true"
            style="display: none;">
              {{ $t('Send Invoice')}}
          </VBtn>

          <!-- 👉 Preview -->
          <VBtn block color="secondary" variant="tonal" class="mb-4"
            :to="{ name: 'provider-invoice-preview-id', params: { id: '5036' } }" disabled="disabled">
             {{ $t('Preview')}}
          </VBtn>

          <!-- 👉 Save -->
          <VBtn block color="secondary" variant="tonal" @click="handleSubmit">
            {{ $t('Save')}}
          </VBtn>
        </VCardText>
      </VCard>

      <!-- 👉 Select payment method -->
      <AppSelect v-model="selectedPaymentMethod" :items="paymentMethods" class="mb-6" style="display: none;" />

      <!-- 👉 Payment Terms -->
      <div class="d-flex align-center justify-space-between">
        <VLabel for="payment-terms" style="display: none;">
          {{ $t('Payment Terms') }}
        </VLabel>
        <div>
          <VSwitch id="payment-terms" v-model="paymentTerms" style="display: none;" />
        </div>
      </div>

      <!-- 👉  Client Notes -->
      <div class="d-flex align-center justify-space-between">
        <VLabel for="client-notes">
          {{ $t('Client Notes')}}
        </VLabel>
        <div>
          <VSwitch id="client-notes" v-model="invoiceData.clientNotes" />
        </div>
      </div>

      <!-- 👉  Payment Stub -->
      <div class="d-flex align-center justify-space-between">
        <VLabel for="payment-stub" style="display: none;">
          {{ $t('Payment Stub')}}
        </VLabel>
        <div>
          <VSwitch id="payment-stub" v-model="paymentStub" style="display: none;" />
        </div>
      </div>
    </VCol>
  </VRow>

  <!-- 👉 Send Invoice Sidebar -->
  <InvoiceSendInvoiceDrawer v-model:isDrawerOpen="isSendPaymentSidebarVisible" />
</template>
