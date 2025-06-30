<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Patient Invoices View',
  },
})
import { dateFormat } from '@/plugins/globalFunctions';
import { usePatientStore } from '@/stores/patientStore';
const { currentUser, currentRole, logout } = useAuth()
const patientStore = usePatientStore()
const route = useRoute()
const api_url = ref(null)
const sortByData = ref([{ 'key': 'invoice_id', 'order': 'desc' }])
const dataTable = ref(null);


const getAPi = computed(() => {

  if (route.path == '/patient/invoice') {
    api_url.value = PATIENT_PORTAL_INVOCIE_API + '/' + currentUser.value.id;
  }
  if (route.path == '/patient/dashboard') {
    api_url.value = PATIENT_PORTAL_INVOCIE_API + '/' + currentUser.value.id + '?start_date=' + patientStore.start_date + '&end_date=' + patientStore.end_date;
  }

  return api_url.value;
});
// 👉 headers
const headers = [
  {
    title: '#',
    key: 'invoice_id',
  },
  {
    title: 'Invoice',
    key: 'invoice_number',
  },


  {
    title: 'Patient',
    key: 'patient_name',
  },
  {
    title: 'Total',
    key: 'grand_total',
  },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
  },
  {
    title: 'Issue Date',
    key: 'date',
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]


const reload = () => dataTable.value.reload()
watch(
  () => [patientStore.start_date, patientStore.end_date],
  ([newStartDate, newEndDate], [oldStartDate, oldEndDate]) => {
    console.log("Start Date changed:", newStartDate, "Old Start Date:", oldStartDate);
    console.log("End Date changed:", newEndDate, "Old End Date:", oldEndDate);
    if (newStartDate || newEndDate) {
      reload();
    }
  },
);


const resolveInvoiceBalanceVariant = (balance, total) => {
  if (balance === total)
    return {
      status: 'Unpaid',
      chip: { color: 'error' },
    }
  if (balance === 0)
    return {
      status: 'Paid',
      chip: { color: 'success' },
    }

  return {
    status: balance,
    chip: { variant: 'text' },
  }
}

const resolveInvoiceStatusVariantAndIcon = status => {
  if (status === 'pending')
    return {
      variant: 'warning',
      icon: 'tabler-chart-pie-2',
      text: 'Pending'
    }
  if (status === 'success')
    return {
      variant: 'success',
      icon: 'tabler-check',
      text: 'Paid'
    }
  if (status === 'paid')
    return {
      variant: 'success',
      icon: 'tabler-check',
      text: 'Paid'
    }
  if (status === 'Downloaded')
    return {
      variant: 'info',
      icon: 'tabler-arrow-down',
    }
  if (status === 'Draft')
    return {
      variant: 'primary',
      icon: 'tabler-folder',
    }
  if (status === 'Sent')
    return {
      variant: 'secondary',
      icon: 'tabler-mail',
    }
  if (status === 'Past Due')
    return {
      variant: 'error',
      icon: 'tabler-help',
    }
  if (status === 'cancel')
    return {
      variant: 'error',
      icon: 'tabler-help',
      text: 'Cancel'
    }
  return {
    variant: 'secondary',
    icon: 'tabler-x',
  }
}

const computedMoreList = computed(() => {
  return paramId => [

    {
      title: 'Edit',
      value: 'edit',
      prependIcon: 'tabler-pencil',
      to: {
        name: 'apps-invoice-edit-id',
        params: { id: paramId },
      },
    },

  ]
})


</script>

<template>
  <div v-if="getAPi">
    <DataTable ref="dataTable" :cardTitle="$t('Invoices')" :headers="headers" :api="api_url" :sortBy="sortByData">

      <template #item.invoice_id="{ item }">
        {{ item.invoice_id }}
      </template>
      <template #item.invoice_number="{ item }">
        <RouterLink :to="{ name: 'patient-view-id', params: { id: item.invoice_id } }">
          #{{ item.invoice_number }}
        </RouterLink>
      </template>

      <!-- status -->
      <template #item.status="{ item }">



        <VChip :color="resolveInvoiceStatusVariantAndIcon(item.status).variant" label size="x-small">
          <VIcon :size="16" :icon="resolveInvoiceStatusVariantAndIcon(item.status).icon" /> {{
            resolveInvoiceStatusVariantAndIcon(item.status).text }}
        </VChip>

      </template>

      <!-- client -->
      <template #item.patient_name="{ item }">
        <div class="d-flex align-center">
          <VAvatar size="34" :color="!item.avatar ? resolveInvoiceStatusVariantAndIcon(item.status).variant : undefined"
            :variant="!item.avatar ? 'tonal' : undefined" class="me-3">
            <VImg v-if="item.avatar" :src="item.avatar" />
            <span v-else>{{ avatarText(item.patient_name) }}</span>
          </VAvatar>
          <div class="d-flex flex-column">

            {{ item.patient_name }}

            <span class="text-sm text-medium-emphasis">{{ item.email }}</span>
          </div>
        </div>
      </template>

      <!-- Total -->
      <template #item.grand_total="{ item }">
        $ {{ parseFloat(item.grand_total).toFixed(2) }}
      </template>



      <template #item.date="{ item }">
        {{ dateFormat(item.issue_date) }}
      </template>
      <template #item.balance="{ item }">
        <VChip v-if="typeof ((resolveInvoiceBalanceVariant(item.balance, item.total)).status) === 'string'"
          :color="resolveInvoiceBalanceVariant(item.balance, item.total).chip.color" label size="x-small">
          {{ (resolveInvoiceBalanceVariant(item.balance, item.total)).status }}
        </VChip>

        <template v-else>
          <span class="text-base text-high-emphasis">
            {{ Number((resolveInvoiceBalanceVariant(item.balance, item.total)).status) > 0 ?
              `$${(resolveInvoiceBalanceVariant(item.balance, item.total)).status}` :
              `-$${Math.abs(Number((resolveInvoiceBalanceVariant(item.balance, item.total)).status))}` }}
          </span>
        </template>
      </template>

      <!-- Actions -->
      <template #item.actions="{ item }">
        <IconBtn :to="{ name: 'patient-view-id', params: { id: item.invoice_id } }">
          <VIcon icon="tabler-eye" />
        </IconBtn>

        <MoreBtn :menu-list="computedMoreList(item.invoice_number)" item-props color="undefined"
          style="display:none;" />
      </template>
    </DataTable>
  </div>
</template>

<style lang="scss">
#invoice-list {
  .invoice-list-actions {
    inline-size: 8rem;
  }

  .invoice-list-filter {
    inline-size: 12rem;
  }
}
</style>

<!-- @user-data="addNewUser"
@update-user-data="updateNewUser" -->
