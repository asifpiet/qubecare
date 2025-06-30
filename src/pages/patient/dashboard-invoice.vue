<script setup>
import { dateFormat } from '@/plugins/globalFunctions';
const props = defineProps({
  statData: {
    type: Object
  }
})
const appointments= ref([]);

const appointmentData = computed(() => {
  console.log("statData",props.statData);
  appointments.value = props.statData.invoices;
});

const headers = [
    {
    title: 'ID',
    key: 'invoice_id',
  },
  {
    title: 'Patient Name',
    key: 'name',
  },
 
  {
    title: 'Issue Date',
    key: 'issue_date',
  },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
  },
  {
    title: 'Grand Total',
    key: 'grand_total',
  },
  
]

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
      text:'Pending'
    }
  if (status === 'success')
    return {
      variant: 'success',
      icon: 'tabler-check',
      text:'Paid'
    }
    if (status === 'paid')
    return {
      variant: 'success',
      icon: 'tabler-check',
      text:'Paid'
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
      text:'Cancel'
    }
  return {
    variant: 'secondary',
    icon: 'tabler-x',
  }
}
</script>

<template>
   <div v-if="appointmentData"></div>
   <VDataTable
    :headers="headers"
    :items="appointments"
    :items-per-page="5"
  >
  <template #item.issue_date="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            {{ dateFormat(item.issue_date) }}
          </div>
        </template>
        <template #item.invoice_id="{ item }">
          <RouterLink :to="{ name: 'apps-invoice-view-id', params: { id: item.id } }">
            #{{ item.invoice_id }}
          </RouterLink>
        </template>

        <!-- status -->
        <template #item.status="{ item }">
      
                
               
                <VChip
            
            :color="resolveInvoiceStatusVariantAndIcon(item.status).variant"
            label
            size="x-small"
          >
          <VIcon
                  :size="16"
                  :icon="resolveInvoiceStatusVariantAndIcon(item.status).icon"
                /> {{ resolveInvoiceStatusVariantAndIcon(item.status).text }}
          </VChip>
       
        </template>

        <!-- client -->
        <template #item.name="{ item }">
          <div class="d-flex align-center">
            <VAvatar
              size="34"
              :color="!item.avatar ? resolveInvoiceStatusVariantAndIcon(item.status).variant : undefined"
              :variant="!item.avatar ? 'tonal' : undefined"
              class="me-3"
            >
              <VImg
                v-if="item.avatar"
                :src="item.avatar"
              />
              <span v-else>{{ avatarText(item.name) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              
                {{ item.name }}
              
              <span class="text-sm text-medium-emphasis">{{ item.email }}</span>
            </div>
          </div>
        </template>

        <!-- Total -->
        <template #item.grand_total="{ item }">
          $ {{ parseFloat(item.grand_total).toFixed(2) }} 
        </template>

        

       
        <!-- Date -->
        <!-- <template #item.date="{ item }">
          {{ item.issue_date }}
        </template> -->

        <!-- Balance -->
        <!-- <template #item.balance="{ item }">
          <VChip
            v-if="typeof ((resolveInvoiceBalanceVariant(item.balance, item.total)).status) === 'string'"
            :color="resolveInvoiceBalanceVariant(item.balance, item.total).chip.color"
            label
            size="x-small"
          >
            {{ (resolveInvoiceBalanceVariant(item.balance, item.total)).status }}
          </VChip>

          <template v-else>
            <span class="text-base text-high-emphasis">
              {{ Number((resolveInvoiceBalanceVariant(item.balance, item.total)).status) > 0 ? `$${(resolveInvoiceBalanceVariant(item.balance, item.total)).status}` : `-$${Math.abs(Number((resolveInvoiceBalanceVariant(item.balance, item.total)).status))}` }}
            </span>
          </template>
        </template> -->

        <!-- Actions -->
        <template #item.actions="{ item }">
          
          <IconBtn :to="{ name: 'apps-invoice-view-id', params: { id: item.invoice_id } }">
            <VIcon icon="tabler-eye" />
          </IconBtn>

          <!-- <MoreBtn
            :menu-list="computedMoreList(item.invoice_number)"
            item-props
            color="undefined"
            style="display:none;"
          /> -->
        </template>
    </VDataTable> 
</template>
