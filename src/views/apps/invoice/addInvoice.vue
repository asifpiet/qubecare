<script setup>
import { usePatientStore } from '@/stores/patientStore';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import InvoiceProductEdit from './InvoiceProductEdit.vue';

const patientStore = usePatientStore()
const props = defineProps({
  data: {
    type: null,
    required: true,
  },
   orderData: {
    type: null,
  },
})

const emit = defineEmits([
  'push',
  'remove',
  'getDataArray',

])

const invoice = ref(props.data.invoice)
const thanksNote = ref(props.data.thanksNote)
const grandTotal = ref(0.00)
const diagnoses = ref(props.data.diagnoses); // Start with one empty diagnosis  
const totalPriceLine = ref(0);
const itemsOptions = ref([
  {
    title: 'Diagnosis A',
    id: 1
  },
  {
    title: 'Diagnosis B',
    id: 2
  },
  {
    title: 'Diagnosis C',
    id: 3
  }
]); // Your select options array  
const lineItems = ref(props.data.otherLineItem);

await patientStore.patientsListWithOutMap()
const addLineItem = () => {
  const lastId = lineItems.value.length > 0
    ? lineItems.value[lineItems.value.length - 1].id
    : 0;

  const newId = lastId + 1;
  lineItems.value.push({ id: newId, date_of_service: '', price: '', description: '' });
  updateTotal();
};

const removeLineItem = (index) => {
  lineItems.value.splice(index, 1);
  updateTotal();
};
const removeDiagnosis = (index) => {
  if (diagnoses.value.length > 1) {
    diagnoses.value.splice(index, 1); // Remove the selected diagnosis  
  }
};
const addDiagnosis = (index) => {
  const lastId = diagnoses.value.length > 0
    ? diagnoses.value[diagnoses.value.length - 1].diagnoses_id
    : 0;

  const newId = lastId + 1;
  diagnoses.value.push({ diagnoses_id: newId, diagnoses_title: '' }); // Add new empty diagnosis  
};
const updateDiagnosisDetails = (index, value) => {
  // diagnoses.value[index].diagnoses_id = value;  
  console.log(`Updated diagnosis ${index}:`, diagnoses.value[index]);

};

// 👉 Clients
const clients = ref([])


// 👉 fetchClients
const fetchClients = async () => {
  //const { data, error } = await useApi(PATIENT_API_DATATABLE)
  clients.value = patientStore.patientsOutMap;//patientStore.patients;
  console.log(clients.value)
  // Find and assign the client based on the patient_id in invoice
  if (invoice.value.client?.id) {
    const matchedClient = clients.value.find(
      (client) => client.id === invoice.value.client.id
    );
    if (matchedClient) {
      invoice.value.client = matchedClient; // Update client details
    }
  }

};


const calculateInitialTotal = () => {
  const totalPrice = props.data.purchasedProducts.reduce(
    (sum, product) => sum + product.price * product.qty,
    0
  );
  updateProductTotal({
    id: null, // No specific ID on page load
    data: props.data.purchasedProducts,
    totalPrice,
  });
};
const updateProductTotal = ({ id, data, totalPrice }) => {
  console.log('data ==== ', id, data, totalPrice)
  grandTotal.value = totalPrice
  props.data.grandTotal = totalPrice
  console.log('test', props.data.purchasedProducts)
  emit('getDataArray', data);
}
onMounted(() => {
  if (!props.data.edit) {
    generateInvoiceNumber()
    invoice.value.issuedDate = getCurrentDate()
    invoice.value.dueDate = getCurrentDate()
  }
  if (props.data.edit) {
    calculateInitialTotal()
    updateTotal()
  }
  fetchClients()
})
const updateTotal = () => {
  totalPriceLine.value = lineItems.value.reduce((acc, item) => {
    return acc + (parseFloat(item.price) || 0); // Ensure price is a number  
  }, 0);
  // Emit the updated total price to the parent component if needed  
  // Use `emit` if you have a parent context, otherwise this will need adjustment.  
  props.data.grandTotal = Number(totalPriceLine.value) + Number(grandTotal.value)
};
// 👉 Add item function
const addItem = () => {

  emit('push', {
    id: 0,
    pname: '',
    qty: 1,
    price: 0.00,
    subtotal: 0.00,
  })
  console.log(diagnosis)
}
console.log(props.data)
const removeProduct = id => {
  emit('remove', id)
}
const invoiceNumber = ref('');

// Function to generate a random invoice number  
const generateInvoiceNumber = () => {
  const prefix = "INV"; // Prefix for invoice number  
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // Format YYYYMMDD  
  const randomPart = Math.floor(1000 + Math.random() * 9000); // Random number between 1000 and 9999  

  // Set the generated invoice number  
  invoiceNumber.value = `${prefix}${datePart}${randomPart}`;
  if (props.data.edit) {
    props.data.invoice.id = props.data.invoice.invoice_id
  } else {
    props.data.invoice.id = invoiceNumber.value
  }

}
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based  
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};  
</script>

<template>
  <VCard class="pa-6 pa-sm-12">
    <!-- SECTION Header -->
    <div
      class="d-flex flex-wrap justify-space-between flex-column rounded bg-var-theme-background flex-sm-row gap-6 pa-6 mb-6">
      <!-- 👉 Left Content -->
      <div>
        <div class="d-flex align-center app-logo mb-6">
          <!-- 👉 Logo -->
          <VNodeRenderer :nodes="themeConfig.app.logo" />

          <!-- 👉 Title -->
          <h6 class="app-logo-title">
            {{ themeConfig.app.title }}
          </h6>
        </div>

        <!-- 👉 Address -->
        <!-- <p class="text-high-emphasis mb-0">
          Office 149, 450 South Brand Brooklyn
        </p>
        <p class="text-high-emphasis mb-0">
          San Diego County, CA 91905, USA
        </p>
        <p class="text-high-emphasis mb-0">
          +1 (123) 456 7891, +44 (876) 543 2198
        </p> -->
      </div>

      <!-- 👉 Right Content -->
      <div class="d-flex flex-column gap-2">
        <!-- 👉 Invoice Id -->
        <div class="d-flex align-start align-sm-center gap-x-4 font-weight-medium text-lg flex-column flex-sm-row">
          <span class="text-high-emphasis text-sm-end" style="inline-size: 5.625rem ;">{{ $t('Invoice') }} :</span>
          <span>
            <AppTextField v-model="invoice.id" disabled prefix="#" style="inline-size: 12.5rem;" />
          </span>
        </div>

        <!-- 👉 Issue Date -->
        <div class="d-flex gap-x-4 align-start align-sm-center flex-column flex-sm-row">
          <span class="text-high-emphasis text-sm-end" style="inline-size: 5.625rem;">{{ $t('Date Issued') }}:</span>

          <span style="inline-size: 12.5rem;">
            <AppDateTimePicker v-model="invoice.issuedDate" placeholder="YYYY-MM-DD"
              :config="{ position: 'auto right' }" />
          </span>
        </div>

        <!-- 👉 Due Date -->
        <div class="d-flex gap-x-4 align-start align-sm-center flex-column flex-sm-row" v-if="invoice.status != 'paid'">
          <span class="text-high-emphasis text-sm-end" style="inline-size: 5.625rem;">{{ $t('Due Date') }}:</span>
          <span style="inline-size: 12.5rem;">
            <AppDateTimePicker v-model="invoice.dueDate" placeholder="YYYY-MM-DD"
              :config="{ position: 'auto right' }" />
          </span>
        </div>
        <div class="d-flex gap-x-4 align-start align-sm-center flex-column flex-sm-row" v-if="invoice.status == 'paid'">
          <span class="text-high-emphasis text-sm-end" style="inline-size: 5.625rem;">{{ $t('Status') }}:</span>
          <span style="inline-size: 12.5rem; text-align: center;">
            <VChip color="success" style="inline-size: 12.5rem; ">
              {{ $t('Paid') }}
            </VChip>
          </span>
        </div>
        <div class="d-flex gap-x-4 align-start align-sm-center flex-column flex-sm-row" v-if="props.orderData?.promo_code">
          <span class="text-high-emphasis text-sm-end" style="inline-size: 5.625rem;">{{ $t('Promo code') }}:</span>
          <span style="inline-size: 12.5rem; text-align: center;">
            <VChip color="secondary" style="inline-size: 12.5rem; ">
              {{ props.orderData?.promo_code }}
            </VChip>
          </span>
        </div>
      </div>
    </div>
    <!-- !SECTION -->

    <VRow>
      <VCol cols="12">
        <h6 class="text-h6 mb-4">
          {{ $t('Invoice To') }}:
        </h6>

        <VAutocomplete v-model="invoice.client" :items="clients" variant="outlined" item-title="full_name"
          item-value="id" :placeholder="$t('Select Patient')" :label="$t('Patient')" return-object class="mb-4"
          style="inline-size: 15.875rem;" :rules="[requiredValidator]" />

        <p class="mb-0">
          <span style="font-weight: 600;">{{ $t('Full Name') }}:</span> {{ invoice.client.full_name !== "Select Patient"
            ?
            invoice.client.full_name : '' }}

          <span style="font-weight: 600; display: none;">{{ $t('UUID') }} : {{ invoice.client ? invoice.client.uuid : ''
          }}</span>

        </p>
        <p class="mb-0">
          <span style="font-weight: 600;">{{ $t('DOB') }} :</span> {{ invoice.client && invoice.client.DOB ?
            dateFormat(invoice.client.DOB) :
          '' }}
        </p>
        <p class="mb-0">
          <span style="font-weight: 600;">{{ $t('Phone') }} :</span> {{ invoice.client ? invoice.client.preferredPhone :
            '' }}
        </p>
        <p class="mb-0">
          <span style="font-weight: 600;">{{ $t('Email') }} :</span> {{ invoice.client ? invoice.client.email : '' }}
        </p>
        <p v-if="invoice.client && invoice.client.address" class="mb-0">
          <span style="font-weight: 600;">{{ $t('Address') }} :</span>
          {{ invoice.client.address }} {{ invoice.client ? invoice.client.city : '' }} {{
            invoice.client ? invoice.client.state : '' }}<br />{{ invoice.client ? invoice.client.zip : '' }}, {{
            invoice.client ? invoice.client.country : '' }}
        </p>

      </VCol>

      <VCol class="text-no-wrap" style="display: none;">
        <h6 class="text-h6 mb-4">
          {{ $t('Bill To') }}:
        </h6>

        <table>
          <tbody>
            <tr>
              <td class="pe-4">
                {{ $t('Total Due') }}:

              </td>
              <td>${{ props.data.paymentDetails.totalDue }}</td>
            </tr>
            <tr>
              <td class="pe-4">
                {{ $t('Bank Name') }} :
              </td>
              <td>{{ props.data.paymentDetails.bankName }}</td>
            </tr>
            <tr>
              <td class="pe-4">
                {{ $t('Country') }}:

              </td>
              <td>{{ props.data.paymentDetails.country }}</td>
            </tr>
            <tr>
              <td class="pe-4">
                {{ $t('IBAN') }}:
              </td>
              <td>
                <p class="text-wrap me-4">
                  {{ props.data.paymentDetails.iban }}
                </p>
              </td>
            </tr>
            <tr>
              <td class="pe-4">
                {{ $t('SWIFT Code') }}:
              </td>
              <td>{{ props.data.paymentDetails.swiftCode }}</td>
            </tr>
          </tbody>
        </table>
      </VCol>
    </VRow>

    <VDivider class="my-6 border-dashed" />
    <!-- 👉 Add purchased products -->

    <VExpansionPanels>
      <VExpansionPanel>
        <VExpansionPanelTitle collapse-icon="tabler-minus" expand-icon="tabler-plus">
          {{ $t('Diagnoses') }}
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="add-diagonoses-form">
            <div v-for="(diagnosis, index) in diagnoses" :key="index" class="diagnosis-item mb-6">
              <VRow align="center"> <!-- Utilize VRow to manage flex layout -->
                <VCol cols="12" md="10">
                  <AppSelect v-model="diagnosis.diagnoses_title" :items="itemsOptions" item-title="title"
                    item-value="title" placeholder="Select Item"
                    @update-modelValue="updateDiagnosisDetails(index, diagnosis)" />
                </VCol>
                <VCol cols="12" md="2" v-if="index == 0">
                  <VBtn size="small" prepend-icon="tabler-plus" @click="addDiagnosis(index)">
                    {{ $t('Add More') }}

                  </VBtn>
                </VCol>
                <VCol cols="12" md="2" v-if="index > 0">
                  <div class="d-flex justify-end"> <!-- Flexbox for aligning items -->
                    <IconBtn size="36" @click="removeDiagnosis(index)">
                      <VIcon :size="24" icon="tabler-trash" />
                    </IconBtn>
                  </div>
                </VCol>
              </VRow>
            </div>


          </div>
        </VExpansionPanelText>
      </VExpansionPanel>

      <VExpansionPanel>
        <VExpansionPanelTitle collapse-icon="tabler-minus" expand-icon="tabler-plus">
          {{ $t('Billing Items') }}
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="add-products-form">
            <InvoiceProductEdit :data="props.data.purchasedProducts" @remove-product="removeProduct"
              @update-total="updateProductTotal" :diagnoses="diagnoses" />
            <div v-for="(product, index) in props.data.purchasedProducts" :key="product.title" class="mb-4">

            </div>

            <VBtn size="small" prepend-icon="tabler-plus" @click="addItem" style="display: none;">
              {{ $t('Add Item') }}
            </VBtn>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>


      <VExpansionPanel>
        <VExpansionPanelTitle collapse-icon="tabler-minus" expand-icon="tabler-plus">
          {{ $t('Other Line Items') }}
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="add-diagonoses-form">
            <div v-for="(item, index) in lineItems" :key="index" class="line-item">
              <VRow align="center"> <!-- Utilize VRow to manage flex layout -->
                <VCol cols="12" md="3">
                  <AppDateTimePicker v-model="item.date_of_service" placeholder="Date Of Service"
                    label="Date Of Service" :config="{ position: 'auto right' }" />
                </VCol>
                <VCol cols="12" md="3">
                  <AppTextField v-model="item.price" label="Price" type="number" step="0.01" required
                    @input="updateTotal" />
                </VCol>
                <VCol cols="12" md="4">
                  <AppTextField v-model="item.description" label="Description*" required />
                </VCol>
                <VCol cols="12" md="2" v-if="index == 0">
                  <div class="d-flex justify-end"> <!-- Flexbox for aligning items -->
                    <VBtn size="small" prepend-icon="tabler-plus" @click="addLineItem" class="mt-3">
                      {{ $t('Add More') }}
                    </VBtn>
                  </div>
                </VCol>
                <VCol cols="12" md="2" v-if="index > 0">
                  <div class="d-flex justify-end"> <!-- Flexbox for aligning items -->
                    <IconBtn size="36" @click="removeLineItem(index)">
                      <VIcon :size="24" icon="tabler-trash" />
                    </IconBtn>
                  </div>
                </VCol>
              </VRow>
            </div>


          </div>
        </VExpansionPanelText>
      </VExpansionPanel>


    </VExpansionPanels>
    <VDivider class="my-6 border-dashed" />

    <!-- 👉 Total Amount -->
    <div class="d-flex justify-space-between flex-wrap flex-column flex-sm-row">
      <div class="mb-6 mb-sm-0">
        <div class="d-flex align-center mb-6">

          <AppTextField v-model="thanksNote" placeholder="Thanks for your business"
            style="inline-size: 8rem; display: none;" />
        </div>


      </div>

      <div>
        <table class="w-100" style="display: none;">
          <tbody>
            <tr>
              <td class="pe-16">
                {{ $t('Grand Total') }} :
              </td>
              <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                <h6 class="text-h6">
                  ${{ grandTotal }}
                </h6>
              </td>
            </tr>


          </tbody>
        </table>

        <VDivider class="mt-4 mb-3" />

        <table class="w-100">
          <tbody>
            <tr>
              <td class="pe-16">
                {{ $t('Billing Items Total') }}:
              </td>
              <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                <h6 class="text-h6">
                  ${{ grandTotal.toFixed(2) }}
                </h6>
              </td>
            </tr>
            <tr>
              <td class="pe-16">
                {{ $t('Other Line Total') }} :
              </td>
              <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                <h6 class="text-h6">
                  ${{ totalPriceLine.toFixed(2) }}
                </h6>
              </td>
            </tr>
            <tr v-if="props.orderData?.discounted_amount">
              <td class="pe-16">
                {{ $t('Discount') }} :
              </td>
              <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                <h6 class="text-h6">
                  ${{ props.orderData?.discounted_amount.toFixed(2) }}
                </h6>
              </td>
            </tr>
            <tr>
              <td class="pe-16">
                {{ $t('Total') }} :
              </td>
              <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                <h6 class="text-h6">
                  ${{ parseFloat(Number(totalPriceLine.toFixed(2)) + Number(grandTotal.toFixed(2)) - Number(props.orderData?.discounted_amount?.toFixed(2) || 0)).toFixed(2) }}
                </h6>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <VDivider class="my-6 border-dashed" />

    <div v-if="props.data.clientNotes">
      <h6 class="text-h6 mb-2">
        {{ $t('Note') }} :
      </h6>
      <VTextarea v-model="props.data.notes" placeholder="Write note here..." :rows="2" />
    </div>

  </VCard>
</template>
