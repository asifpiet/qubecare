<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Invoice Edit',
  },
})
import { useInvoiceStore } from '@/stores/invoiceStore';
import InvoiceEditable from '@/views/apps/invoice/addInvoice.vue';
import InvoiceAddPaymentDrawer from '@/views/apps/invoice/InvoiceAddPaymentDrawer.vue';
import InvoiceSendInvoiceDrawer from '@/views/apps/invoice/InvoiceSendInvoiceDrawer.vue';

import InvoiceAddPaymentModel from '@/views/apps/invoice/InvoiceAddPaymentModel.vue';

const invoiceStore = useInvoiceStore()
const invoiceData = ref()
const orderData = ref(null)
const invoiceDetails = ref()
const cardDetails = ref({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: '',
});
const refForm = ref();
const isFormValid = ref(false)
const route = useRoute('provider-invoice-edit-id')
const selectedPaymentMethod = ref('Card Payment')
const { data: invoiceDataGet } = await useApi(`${INVOICE_GET_BY_ID}/${route.params.id}`)
await invoiceStore.getInvoiceByID(route.params.id)
invoiceDetails.value = invoiceDataGet.value.data
orderData.value = invoiceStore.order_data
console.log(invoiceDetails.value)
if (invoiceDetails.value) {
  invoiceData.value = {
    invoice: {
      ...invoiceDetails.value.invoice, // Preserve existing properties
      client: { id: invoiceDetails.value.invoice.patient_id }
    },
    paymentDetails: {
      totalDue: 0.00,
      bankName: 'American Bank',
      country: 'United States',
      iban: 'ETD95476213',
      swiftCode: 'BR91905',
    },

    purchasedProducts: invoiceDetails.value.purchasedProducts ? invoiceDetails.value.purchasedProducts : [],
    diagnoses: invoiceDetails.value.diagnoses.length > 0 ? invoiceDetails.value.diagnoses.length : [{ diagnoses_id: 0, diagnoses_title: '' }],
    otherLineItem: invoiceDetails.value.otherLineItem.length > 0 ? invoiceDetails.value.otherLineItem : [{ id: 0, date_of_service: '', price: 0.00, description: '' }],
    edit: true
  }
  invoiceData.value.invoice.id = invoiceDetails.value.invoice.invoice_id
  invoiceData.value.invoice.grandTotal = invoiceDetails.value.invoice.grand_total
  invoiceData.value.invoice.invoiceStatus = invoiceDetails.value.invoice.status
  invoiceData.value.notes = invoiceDetails.value.invoice.notes
  invoiceData.value.invoice.issuedDate = invoiceDetails.value.invoice.issue_date
  invoiceData.value.invoice.dueDate = invoiceDetails.value.invoice.due_date
  invoiceData.value.clientNotes = invoiceDetails.value.invoice.client_notes == 1 ? true : false
  selectedPaymentMethod.value = invoiceDetails.value.invoice.payment_method
  invoiceData.value.invoice.invoiceStatus = invoiceDetails.value.invoice.status

  cardDetails.value.invoice_id = invoiceDetails.value.invoice.id
  cardDetails.value.invoice_number = invoiceDetails.value.invoice.invoice_id
  cardDetails.value.patient_id = invoiceDetails.value.invoice.patient_id
  cardDetails.value.price = parseFloat(invoiceData.value.invoice.grandTotal).toFixed(2)
  cardDetails.value.cardInfo = invoiceDetails.value.cardInfo
  console.log('invoiceData ', invoiceData.value.invoice.client_notes)
}

const addProduct = value => {
  invoiceData.value?.purchasedProducts.push(value)
}

const removeProduct = id => {
  invoiceData.value?.purchasedProducts.splice(id, 1)
}

const isSendSidebarActive = ref(false)
const isAddPaymentSidebarActive = ref(false)
const isAddPaymentPoup = ref(false)
const paymentTerms = ref(true)
const clientNotes = ref(false)
const paymentStub = ref(false)


const paymentMethods = [
  'Card Payment',
]
const clientErrors = reactive({});
const productErrors = ref([]);
const validateClient = (client) => {
  const errors = {};

  if (!client.uuid.trim()) {
    errors.uuid = 'Patient field is required!';
  }


  return errors;
};
const validatePurchasedProducts = (products, client) => {
  const errors = [];

  products.forEach((product, index) => {
    const productErrors = {};

    // Validate Product ID
    if (!client.uuid.trim()) {
      productErrors.uuid = 'Patient field is required!';
    }
    if (!product.pro_id) {
      productErrors.pro_id = "Product  cannot be empty in Billing Items";
    }

    // Validate Quantity
    if (product.qty <= 0 || !Number.isInteger(product.qty)) {
      productErrors.qty = "Quantity must be a positive integer";
    }

    // Validate Price
    if (product.price < 0) {
      productErrors.price = "Price must be a positive number";
    }

    // Validate Date of Service
    if (!Date.parse(product.date_of_service)) {
      productErrors.date_of_service = "Date of service must be a valid date";
    }

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
const handleSubmit = async () => {
  // You can access your invoice data here 




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
    invoice_primary_id: invoiceDetails.value.invoice.id
  }
  await invoiceStore.saveInvoice(
    {
      invoice: submittedData.invoice,
      purchasedProducts: submittedData.purchasedProducts,
      diagnoses: submittedData.diagnoses,
      otherLineItem: submittedData.otherLineItem
    }, submittedData.invoice_primary_id)
  // store.dispatch('updateInvoice', submittedData)
  //  store.dispatch('saveInvoice',submittedData)
  // 
  // Perform submission logic, such as an API call  
  console.log('Submitting Invoice Data:', submittedData);


};
const submitPayment = (msg) => {

  // Process payment logic here  

  if (msg == 'success') {
    isAddPaymentPoup.value = false;
  }
  //isAddPaymentPoup.value = false; // Close dialog after submit  

}

</script>

<template>
  <VRow v-if="invoiceData && invoiceData?.invoice">
    <!-- 👉 InvoiceEditable -->
    <VCol cols="12" md="9">

      <InvoiceEditable v-if="invoiceData?.invoice" :data="invoiceData" :orderData="orderData" @push="addProduct" @remove="removeProduct"
        @error="" />
    </VCol>

    <!-- 👉 Right Column: Invoice Action -->
    <VCol cols="12" md="3">
      <VCard class="mb-8">
        <VCardText>
          <!-- 👉 Send Invoice Trigger button -->
          <VBtn block prepend-icon="tabler-send" class="mb-4" @click="isSendSidebarActive = true"
            style="display: none;">
            {{ $t('Send Invoice')}}
          </VBtn>

          <div class="d-flex flex-wrap gap-4">
            <!-- 👉  Preview button -->
            <VBtn color="secondary" variant="tonal" class="flex-grow-1"
              :to="{ name: 'provider-invoice-preview-id', params: { id: route.params.id } }">
              {{ $t('Preview')}}
            </VBtn>

            <!-- 👉 Save button -->
            <VBtn color="secondary" variant="tonal" class="mb-4 flex-grow-1" @click="handleSubmit">
              {{ $t('Save')}}
            </VBtn>
          </div>

          <!-- 👉 Add Payment trigger button -->
          <VBtn block color="success" v-if="invoiceData.invoice.invoiceStatus != 'paid'"
            @click="isAddPaymentPoup = true">
            {{ $t('Pay') }} ${{ parseFloat(invoiceData.invoice.grandTotal).toFixed(2) }}
          </VBtn>
        </VCardText>
      </VCard>

      <!-- 👉 Accept payment via  -->
      <AppSelect v-model="selectedPaymentMethod" :items="paymentMethods" class="mb-4" style="display: none;" />

      <!-- 👉 Payment Terms -->


      <!-- 👉 Client Notes -->
      <div class="d-flex align-center justify-space-between">
        <VLabel for="client-notes">
          {{ $t('Client Notes')}}
        </VLabel>
        <div>
          <VSwitch id="client-notes" v-model="invoiceData.clientNotes" />
        </div>
      </div>

      <!--  Payment Stub -->

    </VCol>

    <!-- 👉 Invoice send drawer -->
    <InvoiceSendInvoiceDrawer v-model:isDrawerOpen="isSendSidebarActive" />

    <!-- 👉 Invoice add payment drawer -->
    <InvoiceAddPaymentDrawer v-model:isDrawerOpen="isAddPaymentSidebarActive" />
    <VDialog v-model="isAddPaymentPoup" width="800">
      <DialogCloseBtn @click="isAddPaymentPoup = false" />
      <VCard :title="$t('Add Payment')">
        <VCardText>
          <VRow>
            <VCol cols="12" class="d-flex justify-end">
              <h3 class="grand-total">{{ $t('Total')}}: ${{ parseFloat(invoiceData.invoice.grandTotal).toFixed(2) }}</h3>
            </VCol>
          </VRow>
          <InvoiceAddPaymentModel :data="cardDetails" @submit="submitPayment" />
        </VCardText>
      </VCard>
    </VDialog>

  </VRow>

  <section v-else>
    <VAlert type="error" variant="tonal">
      Invoice with ID {{ route.params.id }} not found!
    </VAlert>
  </section>
</template>
