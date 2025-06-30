<script setup>
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import InvoiceProductEdit from './InvoiceProductEdit.vue';

const props = defineProps({
  data: {
    type: null,
    required: true,
  },
})

const emit = defineEmits([
  'push',
  'remove',
])

const invoice = ref(props.data.invoice)
const salesperson = ref(props.data.salesperson)
const thanksNote = ref(props.data.thanksNote)
const note = ref(props.data.note)

// 👉 Clients
const clients = ref([])

// 👉 fetchClients
const fetchClients = async () => {
  const { data, error } = await useApi(PATIENT_API_DATATABLE)

  if (error.value)
    console.log(error.value)
  else
    clients.value = data.value.data
}

fetchClients()

// 👉 Add item function
const addItem = () => {
  emit('push', {
    id: '',
    pname:'',
    qty: 1,
    price: 0.00,
    subtotal: 1.00,
  })
}
console.log(props.data)
const removeProduct = id => {
  emit('remove', id)
}
</script>

<template>
  <VCard class="pa-6 pa-sm-12">
    <!-- SECTION Header -->
    <div class="d-flex flex-wrap justify-space-between flex-column rounded bg-var-theme-background flex-sm-row gap-6 pa-6 mb-6">
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
        <p class="text-high-emphasis mb-0">
          Office 149, 450 South Brand Brooklyn
        </p>
        <p class="text-high-emphasis mb-0">
          San Diego County, CA 91905, USA
        </p>
        <p class="text-high-emphasis mb-0">
          +1 (123) 456 7891, +44 (876) 543 2198
        </p>
      </div>

      <!-- 👉 Right Content -->
      <div class="d-flex flex-column gap-2">
        <!-- 👉 Invoice Id -->
        <div class="d-flex align-start align-sm-center gap-x-4 font-weight-medium text-lg flex-column flex-sm-row">
          <span
            class="text-high-emphasis text-sm-end"
            style="inline-size: 5.625rem ;"
          >Invoice:</span>
          <span>
            <AppTextField
              v-model="invoice.id"
              disabled
              prefix="#"
              style="inline-size: 9.5rem;"
            />
          </span>
        </div>

        <!-- 👉 Issue Date -->
        <div class="d-flex gap-x-4 align-start align-sm-center flex-column flex-sm-row">
          <span
            class="text-high-emphasis text-sm-end"
            style="inline-size: 5.625rem;"
          >Date Issued:</span>

          <span style="inline-size: 9.5rem;">
            <AppDateTimePicker
              v-model="invoice.issuedDate"
              placeholder="YYYY-MM-DD"
              :config="{ position: 'auto right' }"
            />
          </span>
        </div>

        <!-- 👉 Due Date -->
        <div class="d-flex gap-x-4 align-start align-sm-center flex-column flex-sm-row">
          <span
            class="text-high-emphasis text-sm-end"
            style="inline-size: 5.625rem;"
          >Due Date:</span>
          <span style="min-inline-size: 9.5rem;">
            <AppDateTimePicker
              v-model="invoice.dueDate"
              placeholder="YYYY-MM-DD"
              :config="{ position: 'auto right' }"
            />
          </span>
        </div>
      </div>
    </div>
    <!-- !SECTION -->

    <VRow>
      <VCol class="text-no-wrap">
        <h6 class="text-h6 mb-4">
          Invoice To:
        </h6>

        <VSelect
          v-model="invoice.client"
          :items="clients"
          item-title="full_name"
          item-value="uuid"
          placeholder="Select Patient"
          return-object
          class="mb-4"
          style="inline-size: 11.875rem;"
        />
        <p class="mb-0">
          <span style="font-weight: 600;">Full Name:</span> {{ invoice.client.full_name }}
        </p>
        <p class="mb-0">
          <span style="font-weight: 600;">DOB:</span> {{ invoice.client.DOB }}
        </p>
        <p class="mb-0">
          <span style="font-weight: 600;">Phone:</span> {{ invoice.client.phone_contact }}
        </p>
        <p class="mb-0">
          <span style="font-weight: 600;">Email:</span> {{ invoice.client.email }}
        </p>
        <p
          v-if="invoice.client.address"
          class="mb-0"
        >
        <span style="font-weight: 600;">Address:</span>
          {{ invoice.client.address }} {{ invoice.client.city }} {{ invoice.client.state }}<br/>{{ invoice.client.zip }}, {{ invoice.client.country }}
        </p>
        
      </VCol>

      <VCol class="text-no-wrap">
        <h6 class="text-h6 mb-4">
          Bill To:
        </h6>

        <table>
          <tbody>
            <tr>
              <td class="pe-4">
                Total Due:
              </td>
              <td>{{ props.data.paymentDetails.totalDue }}</td>
            </tr>
            <tr>
              <td class="pe-4">
                Bank Name:
              </td>
              <td>{{ props.data.paymentDetails.bankName }}</td>
            </tr>
            <tr>
              <td class="pe-4">
                Country:
              </td>
              <td>{{ props.data.paymentDetails.country }}</td>
            </tr>
            <tr>
              <td class="pe-4">
                IBAN:
              </td>
              <td>
                <p class="text-wrap me-4">
                  {{ props.data.paymentDetails.iban }}
                </p>
              </td>
            </tr>
            <tr>
              <td class="pe-4">
                SWIFT Code:
              </td>
              <td>{{ props.data.paymentDetails.swiftCode }}</td>
            </tr>
          </tbody>
        </table>
      </VCol>
    </VRow>

    <VDivider class="my-6 border-dashed" />
    <!-- 👉 Add purchased products -->
    <div class="add-products-form">
      <div
        v-for="(product, index) in props.data.purchasedProducts"
        :key="product.title"
        class="mb-4"
      >
        <InvoiceProductEdit
          :id="index"
          :data="product"
          @remove-product="removeProduct"
        />
      </div>

      <VBtn
        size="small"
        prepend-icon="tabler-plus"
        @click="addItem"
      >
        Add Item
      </VBtn>
    </div>

    <VDivider class="my-6 border-dashed" />

    <!-- 👉 Total Amount -->
    <div class="d-flex justify-space-between flex-wrap flex-column flex-sm-row">
      <div class="mb-6 mb-sm-0">
        <div class="d-flex align-center mb-6" >
          
          <AppTextField
          v-model="thanksNote"
          placeholder="Thanks for your business"
           style="inline-size: 8rem;"
        />
        </div>

        
      </div>

      <div>
        <table class="w-100">
          <tbody>
            <tr>
              <td class="pe-16">
                Subtotal:
              </td>
              <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                <h6 class="text-h6">
                  $1800
                </h6>
              </td>
            </tr>
            <tr>
              <td class="pe-16">
                Discount:
              </td>
              <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                <h6 class="text-h6">
                  $28
                </h6>
              </td>
            </tr>
            <tr>
              <td class="pe-16">
                Tax:
              </td>
              <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                <h6 class="text-h6">
                  21%
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
                Total:
              </td>
              <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                <h6 class="text-h6">
                  $1690
                </h6>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <VDivider class="my-6 border-dashed" />

    <div>
      <h6 class="text-h6 mb-2">
        Note:
      </h6>
      <VTextarea
        v-model="note"
        placeholder="Write note here..."
        :rows="2"
      />
    </div>
  </VCard>
</template>
