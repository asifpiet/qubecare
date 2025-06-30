<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Patient InvoicesID View',
  },
})
import InvoiceAddPaymentDrawer from '@/views/apps/invoice/InvoiceAddPaymentDrawer.vue';
import InvoiceAddPaymentModel from '@/views/apps/invoice/InvoiceAddPaymentModel.vue';
import InvoiceSendInvoiceDrawer from '@/views/apps/invoice/InvoiceSendInvoiceDrawer.vue';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useStore } from 'vuex';
const store = useStore()
const route = useRoute('apps-invoice-preview-id')
const userData = useCookie('userData')
const isAddPaymentSidebarVisible = ref(false)
const isSendPaymentSidebarVisible = ref(false)
const invoiceDetails = ref()
const invoiceData = ref()
const itemsOptions = ref([]);
const clients = ref([])
const cardDetails = ref({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: '',
});
const isAddPaymentPoup = ref(false)
const { data: invoiceDataGet } = await useApi(`${PATIENT_GET_INVOICE_BY_ID}/${route.params.id}`)
const invoice = ref()
invoiceDetails.value = invoiceDataGet.value.data;
console.log("invocie70", invoiceDataGet.value);
const paymentDetails = ref()

if (invoiceDetails.value) {
  invoiceData.value = {
    invoice: {
      ...invoiceDetails.value.invoice, // Preserve existing properties
      client: { id: localStorage.getItem('LoginUserId') }
    },
    paymentDetails: {
      totalDue: 0.00,
      bankName: 'American Bank',
      country: 'United States',
      iban: 'ETD95476213',
      swiftCode: 'BR91905',
    },

    purchasedProducts: [
      ...invoiceDetails.value.purchasedProducts.filter(item => item.pro_id !== null),
      ...invoiceDetails.value.otherLineItem,
    ],
    diagnoses: invoiceDetails.value.diagnoses,
    otherLineItem: invoiceDetails.value.otherLineItem,
    edit: true
  }
  invoiceData.value.invoice.id = invoiceDetails.value.invoice.invoice_id ? invoiceDetails.value.invoice.invoice_id : '';
  invoiceData.value.invoice.grandTotal = invoiceDetails.value.invoice.grand_total ? invoiceDetails.value.invoice.grand_total : '';
  invoiceData.value.invoice.issuedDate = invoiceDetails.value.invoice.issue_date ? invoiceDetails.value.invoice.issue_date : '';
  invoiceData.value.invoice.dueDate = invoiceDetails.value.invoice.due_date ? invoiceDetails.value.invoice.due_date : '';
  invoiceData.value.clientNotes = invoiceDetails.value.invoice.client_notes == 1 ? true : false
  invoiceData.value.invoice.invoiceStatus = invoiceDetails.value.invoice.status ? invoiceDetails.value.invoice.status : '';
  cardDetails.value.invoice_id = invoiceDetails.value.invoice.id ? invoiceDetails.value.invoice.id : '';
  cardDetails.value.invoice_number = invoiceDetails.value.invoice.invoice_id ? invoiceDetails.value.invoice.invoice_id : '';
  cardDetails.value.patient_id = invoiceDetails.value.invoice.patient_id ? invoiceDetails.value.invoice.patient_id : '';
  cardDetails.value.price = parseFloat(invoiceData.value.invoice.grandTotal).toFixed(2)
  cardDetails.value.cardInfo = invoiceDetails.value.cardInfo ? invoiceDetails.value.cardInfo : '';
  console.log('invoiceData ', invoiceData.value)
  paymentDetails.value = invoiceData.value.paymentDetails ? invoiceData.value.paymentDetails : '';
}
const productNames = ref({});
const fetchProducts = async () => {
  const { data, error } = await useApi(GET_PATIENT_PRODUCTS_API + '/' + userData.value?.uuid);
  if (error.value) {
    console.log(error.value);
  } else {
    itemsOptions.value = data.value.data;
    console.log(itemsOptions)
    // Map product IDs to names for quick lookup
    itemsOptions.value.forEach((product) => {
      productNames.value[product.id] = product.name;
    });
    console.log("productNames", productNames.value);
  }
};

const fetchClients = async () => {
  const { data, error } = await useApi(PATIENT_API_DATATABLE);
  if (error.value) {
    console.error(error.value);
  } else {
    clients.value = data.value.data;

    // Find and assign the client based on the patient_id in invoice
    if (invoiceData.value.invoice.client?.id) {
      const matchedClient = clients.value.find(
        (client) => client.id === invoiceData.value.invoice.client.id
      );
      if (matchedClient) {
        invoiceData.value.invoice.client = matchedClient; // Update client details
      }
    }
  }
};
onMounted(() => {

  //   fetchClients()
  fetchProducts()
  console.log(productNames.value)
})
const printInvoice = () => {
  window.print()
}
const generatePDF = async () => {
  store.dispatch('updateIsLoading', true);
  const pdf = new jsPDF('p', 'mm', 'a4');
  const margin = 10; // Margin in mm
  const element = document.querySelector("#pdfContent"); // ID of the element to capture

  await html2canvas(element).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth, pdfHeight);
    pdf.save(`${cardDetails.value.invoice_number}.pdf`);
  });

  store.dispatch('updateIsLoading', false);
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
  <section v-if="invoiceData">
    <VRow>
      <VCol cols="12" md="9" id="pdfContent">
        <VCard class="invoice-preview-wrapper pa-6 pa-sm-12">
          <!-- SECTION Header -->
          <div
            class="invoice-header-preview d-flex flex-wrap justify-space-between flex-column flex-sm-row print-row bg-var-theme-background gap-6 rounded pa-6 mb-6">
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
              <h6 class="text-h6 font-weight-regular">
                Office 149, 450 South Brand Brooklyn
              </h6>
              <h6 class="text-h6 font-weight-regular">
                San Diego County, CA 91905, USA
              </h6>
              <h6 class="text-h6 font-weight-regular">
                +1 (123) 456 7891, +44 (876) 543 2198
              </h6>
            </div>

            <!-- 👉 Right Content -->
            <div>
              <!-- 👉 Invoice ID -->
              <h6 class="font-weight-medium text-lg mb-6">
                Invoice #{{ invoiceData.invoice.id }}
              </h6>

              <!-- 👉 Issue Date -->
              <h6 class="text-h6 font-weight-regular">
                <span>Date Issued: </span>
                <span>{{ new Date(invoiceData.invoice.issuedDate).toLocaleDateString('en-GB') }}</span>
              </h6>

              <!-- 👉 Due Date -->
              <h6 class="text-h6 font-weight-regular">
                <span>Due Date: </span>
                <span>{{ new Date(invoiceData.invoice.dueDate).toLocaleDateString('en-GB') }}</span>
              </h6>
            </div>
          </div>
          <!-- !SECTION -->

          <!-- 👉 Payment Details -->
          <VRow class="print-row mb-6">
            <VCol class="text-no-wrap">
              <h6 class="text-h6 mb-4">
                Invoice Tod:
              </h6>

              <p class="mb-0">
                {{ invoiceData.invoice.client.full_name }}
              </p>
              <p class="mb-0">
                {{ dateFormat(invoiceData.invoice.client.DOB) }}
              </p>
              <p class="mb-0">
                {{ invoiceData.invoice.client.phone_contact }}
              </p>
              <p class="mb-0">
                {{ invoiceData.invoice.client.email }}
              </p>

            </VCol>


          </VRow>

          <!-- 👉 invoice Table -->
          <VTable class="invoice-preview-table border text-high-emphasis overflow-hidden mb-6">
            <thead>
              <tr>
                <th scope="col">
                  DESCRIPTION
                </th>

                <th scope="col" class="text-center">
                  QTY
                </th>
                <th scope="col" class="text-center">
                  Price
                </th>
                <th scope="col" class="text-center">
                  TOTAL
                </th>
              </tr>
            </thead>

            <tbody class="text-base">
              <tr v-for="item in invoiceData.purchasedProducts" :key="item.id">
                <td class="text-no-wrap" v-if="item.description">
                  {{ item.description }}
                </td>
                <td class="text-no-wrap" v-if="item.pro_id">
                  {{ productNames[item.pro_id] || "Loading..." }}
                </td>
                <td class="text-center">
                  {{ item.qty ? item.qty : 1 }}
                </td>
                <td class="text-center">
                  $ {{ parseFloat(item.price).toFixed(2) }}
                </td>
                <td class="text-center">
                  ${{ (Number(item.price) * Number(item.qty ? item.qty : 1)).toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </VTable>

          <!-- 👉 Total -->
          <div class="d-flex justify-space-between flex-column flex-sm-row print-row">
            <div class="mb-2">
              <div class="d-flex align-center mb-1">
                <h6 class="text-h6 me-6">
                  Diagnoses:

                </h6>

                <ul class="mt-6">
                  <li v-for="(item, index) in invoiceData.diagnoses" :key="item.diagnoses_id">
                    {{ item.diagnoses_title }}
                  </li>
                </ul>
              </div>

            </div>

            <div>


              <VDivider class="my-2" />

              <table class="w-100">
                <tbody>
                  <tr>
                    <td class="pe-16">
                      Total:
                    </td>
                    <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                      <h6 class="text-base font-weight-medium">
                        ${{ parseFloat(invoiceData.invoice.grandTotal).toFixed(2) }}
                      </h6>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <VDivider class="my-6 border-dashed" />

          <p class="mb-0">
            <span class="text-high-emphasis font-weight-medium me-1">
              Note:
            </span>
            <span>It was a pleasure working with you and your team. Thank You!</span>
          </p>
        </VCard>
      </VCol>

      <VCol cols="12" md="3" class="d-print-none">
        <VCard>
          <VCardText>
            <!-- 👉 Send Invoice Trigger button -->
            <VBtn block prepend-icon="tabler-send" class="mb-4" @click="isSendPaymentSidebarVisible = true"
              style="display: none;">
              Send Invoice
            </VBtn>

            <VBtn block color="secondary" variant="tonal" class="mb-4" @click="generatePDF">
              Download
            </VBtn>

            <div>
              <VBtn block variant="tonal" color="secondary" class="mb-4" @click="printInvoice">
                Print
              </VBtn>

              <!-- <VBtn
                color="secondary"
                variant="tonal"
                class="mb-4 flex-grow-1"
                :to="{ name: 'apps-invoice-edit-id', params: { id: route.params.id } }"
              >
                Edit
              </VBtn> -->
            </div>

            <!-- 👉  Add Payment trigger button  -->
            <VBtn block v-if="invoiceData.invoice.invoiceStatus != 'success'" color="success"
              @click="isAddPaymentPoup = true">
              Pay ${{ parseFloat(invoiceData.invoice.grandTotal).toFixed(2) }}
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 👉 Add Payment Sidebar -->
    <InvoiceAddPaymentDrawer v-model:isDrawerOpen="isAddPaymentSidebarVisible" />

    <!-- 👉 Send Invoice Sidebar -->
    <InvoiceSendInvoiceDrawer v-model:isDrawerOpen="isSendPaymentSidebarVisible" />
    <VDialog v-model="isAddPaymentPoup" width="600">
      <DialogCloseBtn @click="isAddPaymentPoup = false" />
      <VCard title="Add Payment">
        <VCardText>
          <VRow>
            <VCol cols="12" class="d-flex justify-end">
              <h3 class="grand-total">Total: ${{ parseFloat(invoiceData.invoice.grandTotal).toFixed(2) }}</h3>
            </VCol>
          </VRow>
          <InvoiceAddPaymentModel :data="cardDetails" @submit="submitPayment" />
        </VCardText>
      </VCard>
    </VDialog>
  </section>
  <section v-else>
    <VAlert type="error" variant="tonal">
      Invoice with ID {{ route.params.id }} not found!
    </VAlert>
  </section>
</template>

<style lang="scss">
.invoice-preview-table {
  --v-table-header-color: var(--v-theme-surface);

  &.v-table .v-table__wrapper table thead tr th {
    border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
  }
}

@media print {
  .v-theme--dark {
    --v-theme-surface: 255, 255, 255;
    --v-theme-on-surface: 47, 43, 61;
    --v-theme-on-background: 47, 43, 61;
  }

  body {
    background: none !important;
  }

  .invoice-header-preview,
  .invoice-preview-wrapper {
    padding: 0 !important;
  }

  .product-buy-now {
    display: none;
  }

  .v-navigation-drawer,
  .layout-vertical-nav,
  .app-customizer-toggler,
  .layout-footer,
  .layout-navbar,
  .layout-navbar-and-nav-container {
    display: none;
  }

  .v-card {
    box-shadow: none !important;

    .print-row {
      flex-direction: row !important;
    }
  }

  .layout-content-wrapper {
    padding-inline-start: 0 !important;
  }

  // .v-table__wrapper {
  //   overflow: hidden !important;
  // }

  .vue-devtools__anchor {
    display: none;
  }
}
</style>
