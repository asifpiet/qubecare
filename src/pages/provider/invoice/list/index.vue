<script setup>
import { dateFormat } from '@/plugins/globalFunctions';
import { useInvoiceStore } from '@/stores/invoiceStore';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
const { t } = useI18n();
const invoiceStore = useInvoiceStore()
definePage({
  meta: {
    action: 'read',
    subject: 'Invoice View',
  },
})

const router = useRouter();
const selectedRows = ref([])
const totalItems = ref(0);
const dataTable = ref(null);
const sortByData = ref([{ 'key': 'invoice_id', 'order': 'desc' }])

const reload = () => dataTable.value.reload()


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
  // {
  //   title: 'Balance',
  //   key: 'balance',
  // },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]
await invoiceStore.getInvoiceState()
onMounted(async () => {
  reload()
  console.log(invoiceStore.stats.total_patients)
})
const widgetData = ref([
  {
    title: 'Patients',
    value: computed(() => invoiceStore.stats ? invoiceStore.stats.total_patients : 0),
    icon: 'tabler-user',
  },
  {
    title: 'Invoices',
    value: computed(() => invoiceStore.stats ? invoiceStore.stats.total_invoices : 0),
    icon: 'tabler-file-invoice',
  },
  {
    title: 'Paid',
    value: computed(() => {
      const totalPaid = invoiceStore.stats && invoiceStore.stats.total_paid_amount ? formatCurrency(invoiceStore.stats.total_paid_amount) : 0.00;
      return `${totalPaid}`; // Add dollar sign and format to 2 decimal places  
    }),
    icon: 'tabler-checks',
  },
  {
    title: 'Unpaid',
    value: computed(() => {
      const totalUnpaid = invoiceStore.stats && invoiceStore.stats.total_unpaid_amount ? formatCurrency(invoiceStore.stats.total_unpaid_amount) : 0.00;
      return `${totalUnpaid}`; // Add dollar sign and format to 2 decimal places  
    }),
    icon: 'tabler-circle-off',
  },
]);
// 👉 Invoice balance variant resolver
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
    // {
    //   title: 'Download',
    //   value: 'download',
    //   prependIcon: 'tabler-download',
    // },
    {
      title: 'Edit',
      value: 'edit',
      prependIcon: 'tabler-pencil',
      to: {
        name: 'provider-invoice-edit-id',
        params: { id: paramId },
      },
    },

  ]
})

const addNewItem = () => {
  router.push({ name: 'provider-invoice-add' });
};

const deleteInvoice = async id => {
  return true
  await $api(`/apps/invoice/${id}`, { method: 'DELETE' })

  // Delete from selectedRows
  const index = selectedRows.value.findIndex(row => row === id)
  if (index !== -1)
    selectedRows.value.splice(index, 1)

  // Refetch Invoices
  fetchInvoices()
}

const translatedData = computed(() => {
  return widgetData.value.map(data => ({
    ...data,
    title: t(data.title)
  }));
});
</script>

<template>
  <section>
    <!-- 👉 Invoice Widgets -->
    <VCard class="mb-6">
      <VCardText class="px-3">
        <VRow>
          <template v-for="(data, id) in translatedData" :key="id">
            <VCol cols="12" sm="6" md="3" class="px-6">
              <div class="d-flex justify-space-between align-center" :class="$vuetify.display.xs
                ? id !== widgetData.length - 1 ? 'border-b pb-4' : ''
                : $vuetify.display.sm
                  ? id < (widgetData.length / 2) ? 'border-b pb-4' : ''
                  : ''">
                <div class="d-flex flex-column">
                  <h4 class="text-h4">
                    {{ data.value }}
                  </h4>
                  <span class="text-body-1 text-capitalize">{{ data.title }}</span>
                </div>

                <VAvatar variant="tonal" rounded size="42">
                  <VIcon :icon="data.icon" size="26" color="high-emphasis" />
                </VAvatar>
              </div>
            </VCol>
            <VDivider v-if="$vuetify.display.mdAndUp ? id !== widgetData.length - 1
              : $vuetify.display.smAndUp ? id % 2 === 0
                : false" vertical inset length="60" />
          </template>
        </VRow>
      </VCardText>
    </VCard>

    <DataTable ref="dataTable" :cardTitle="$t('Invoices')" :btnTitle="$t('Create Invoice')" :headers="headers"
      :api="INVOICE_LIST_API" :sortBy="sortByData" @onBtnClick="addNewItem">
      <!-- id -->
      <template #item.invoice_id="{ item }">
        {{ item.invoice_id }}
      </template>
      <template #item.invoice_number="{ item }">
        <RouterLink :to="{ name: 'provider-invoice-preview-id', params: { id: item.invoice_number } }">
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
      <!-- Date -->
      <!-- <template #item.date="{ item }">
          {{ item.issue_date }}
        </template> -->

      <!-- Balance -->
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
        <IconBtn @click="deleteInvoice(item.id)" style="display:none;">
          <VIcon icon="tabler-trash" />
        </IconBtn>

        <IconBtn :to="{ name: 'provider-invoice-edit-id', params: { id: item.invoice_number } }">
          <VIcon icon="tabler-edit" />
        </IconBtn>
        <IconBtn :to="{ name: 'provider-invoice-preview-id', params: { id: item.invoice_number } }">
          <VIcon icon="tabler-eye" />
        </IconBtn>

        <MoreBtn :menu-list="computedMoreList(item.invoice_number)" item-props color="undefined"
          style="display:none;" />
      </template>
    </DataTable>
  </section>

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
