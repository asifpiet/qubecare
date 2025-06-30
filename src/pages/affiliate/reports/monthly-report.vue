<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Affiliate Reports View',
    },
})
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';
import 'flatpickr/dist/plugins/monthSelect/style.css';

import { dateFormat } from '@/utils/showLoader';

const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);
const dateRange = ref(null)
const headers = [
    { title: 'id', key: 'id' },
    { title: 'Commission', key: 'commission_amount' },
    { title: 'Products', key: 'statement_items' },
    { title: 'Provider', key: 'provider_name' },
    { title: 'Date', key: 'statement_date' },
    // { title: 'Actions', key: 'actions', sortable: false, searchable: false },
]

const datatableUrl = ref(GET_AFFILIATE_MONTHLY_STATEMENTS)

const reload = () => dataTable.value.reload()

const selectedMonth = ref(null);

watch(selectedMonth, (newMonth) => {
  if (!newMonth) return;

  // Parse m-Y format (e.g., "4-2025")
  const [month, year] = newMonth.split('-');
  const monthNum = parseInt(month, 10);  // Parse as base 10
  const paddedMonth = String(monthNum).padStart(2, '0');
  const startDate = `${year}-${paddedMonth}-01`;

  // Create a date for the first day of the NEXT month
  const nextMonth = new Date(year, monthNum, 1);
  // Subtract one day to get the last day of the current month
  const end = new Date(nextMonth - 1);
  const endDate = end.toISOString().split('T')[0];

  datatableUrl.value = `${GET_AFFILIATE_MONTHLY_STATEMENTS}?start_date=${startDate}&end_date=${endDate}`;
  reload();
});


const formatAmount = (amount) => {
    return Number(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

onMounted(() => {

    const now = new Date();
    const month = `${now.getMonth() + 1}-${now.getFullYear()}`;
    selectedMonth.value = month;
    reload()
})

const getItemsName = (products) => {
    return products.map(p => p.product_name).join(", ");
};

const getProviderName = (products) => {
    return products.map(p => p.provider_name).join(", ");
};
</script>



<template>
    <VRow class="match-height mb-2">
        <VCol cols="12" md="3">
            <AppDateTimePicker
                v-model="selectedMonth"
                :label="$t('Select Month')"
                :placeholder="$t('Select month')"
                :config="{ dateFormat: 'm-Y', plugins: [new monthSelectPlugin({ shorthand: true, dateFormat: 'm-Y', altFormat: 'F Y' })] }"
            />

        </VCol>
    </VRow>
    <DataTable ref="dataTable" :cardTitle="$t('Monthly Report')" btnTitle="" :headers="headers" :api="datatableUrl"
        :sortBy="sortByData">
        <template #item.commission_amount="{ item }">
            <span>{{ `$${formatAmount(item.commission_amount)}` }}</span>
        </template>

        <template #item.statement_items="{ item }">
            <span>{{ getItemsName(item.statement_items) }}</span>
        </template>

        <template #item.statement_date="{ item }">
            <span>{{ dtFormat(item.statement_date) }}</span>
        </template>

    </DataTable>
</template>
