<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Appointment Report',
    },
})
import { useProviderStore } from '@/stores/providerStore';
import InvoiceGraph from '@/views/provider/reports/invoice/invoice-graph.vue';
import InvoiceSales from '@/views/provider/reports/invoice/invoice-sales.vue';
import InvoiceList from '@/views/provider/reports/invoice/invoiceList.vue';
const date = ref();
const providerStore = useProviderStore()
const start_date = ref();
const end_date = ref();
const downloadfile = ref();

onMounted(async () => {
    setDateRange();
    const now = new Date()
    let startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const formatDate = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const currentDate = formatDate(now)
    const monthStart = formatDate(startOfMonth)
    start_date.value = monthStart;
    end_date.value = currentDate;
    providerStore.start_date = monthStart;
    providerStore.end_date = currentDate;
    providerStore.getInvocieReport();
});

const formatDate = (date) => {
    const month = date.getMonth() + 1; // Months are zero-indexed
    const day = date.getDate();
    const year = date.getFullYear();
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
}
const setDateRange = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    date.value = formatDate(startOfMonth) + ' to ' + formatDate(today);
};
const changeDateRange = async () => {
    console.log('changed date', date.value, 'type:', typeof date.value);
    try {
        const dateString = typeof date.value === 'string' ? date.value : '';
        const [startDate, endDate] = dateString.split(" to ");
        start_date.value = startDate;
        end_date.value = endDate;
        if (startDate && endDate) {
            providerStore.start_date = startDate;
            providerStore.end_date = endDate;
            await providerStore.getInvocieReport();
            await providerStore.getInvocieStats();
        } else {
            console.warn('Invalid date range');
        }
    } catch (error) {
        console.error('Error processing date range:', error);

    }
};

watch(downloadfile, (newFile) => {
    if (!newFile) return;  // If downloadfile is null or undefined, skip
    if (newFile === 'PDF') {
        providerStore.downloadFile('pdf', 'invoice');

    } else {
        providerStore.downloadFile('csv', 'invoice');

    }
});
</script>

<template>
    <VRow class="match-height">
        <VCol cols="12" md="4" class="mt-3 px-3">
            <AppDateTimePicker v-model="date" :label="$t('Date Range')" :config="{ mode: 'range' }"
                @change="changeDateRange()">
            </AppDateTimePicker>
        </VCol>
        <VCol cols="12" md="4" class="mt-3 px-3">
            <label>{{ $t('Download') }}</label>
            <VSelect width="150" v-model="downloadfile" :items="['PDF', 'Excel']" />
        </VCol>
        <VCol cols="12" md="4"></VCol>
        <!-- <VCol cols="12">
      <DashboardCardStatistics :statData ="dashboardStats" />
    </VCol> -->

        <VCol cols="12" md="4">
            <InvoiceSales />
        </VCol>
        <VCol cols="12" md="8">
            <InvoiceGraph />
        </VCol>

        <VCol cols="12">
            <VCard :title="$t('Invoices')">
                <InvoiceList />
            </VCard>
        </VCol>





    </VRow>
</template>
