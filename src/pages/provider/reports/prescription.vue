<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Appointment Report',
    },
})
import { useProviderStore } from '@/stores/providerStore';
import { useStore } from 'vuex';
const providerStore = useProviderStore()
const store = useStore()
const start_date = ref();
const end_date = ref();
const date = ref();
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
    providerStore.getPrescriptionReport();
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
            providerStore.getPrescriptionReport();
        } else {
            console.warn('Invalid date range');
            await store.dispatch('updateIsLoading', false)
        }
    } catch (error) {
        console.error('Error processing date range:', error);

    }
};
</script>
<template>
    <VRow id="apex-chart-wrapper">
        <VCol cols="12" md="4" class="mt-3 px-5">
            <AppDateTimePicker v-model="date" label="Date Range" :config="{ mode: 'range' }"
                @change="changeDateRange()">
            </AppDateTimePicker>
        </VCol>
    </VRow>
    <VCard class="mt-5">
        <VCardItem>
            <VCardTitle> {{ $t('Prescription History') }} </VCardTitle>
        </VCardItem>

        <VCardText>
            <VTimeline v-if="providerStore.prescriptionReport && providerStore.prescriptionReport.length > 0" side="end"
                align="start" line-inset="8" truncate-line="start" density="compact">
                <VTimelineItem v-for="(item, index) in providerStore.prescriptionReport" :key="index"
                    dot-color="primary" size="x-small">
                    <!-- 👉 Header -->
                    <div class="d-flex justify-space-between align-center gap-2 flex-wrap mb-2">
                        <span class="app-timeline-title">
                            {{ item.title }}
                        </span>
                        <span class="app-timeline-meta">{{ item.Date }}</span>
                    </div>

                    <!-- 👉 Content -->
                    <div class="app-timeline-text mt-1">
                        {{ $t('Start Date') }} : {{ item.start_date }}<br />
                        {{ $t(' End Date') }} : {{ item.end_date }}<br />
                        {{ $t('Status') }} : {{ item.status }}<br />
                    </div>
                </VTimelineItem>
            </VTimeline>

            <!-- Empty State -->
            <div v-else class="text-center ">
                <p class="text-muted"> {{ $t('No Prescription data available for the selected dates.') }}</p>
            </div>


        </VCardText>
    </VCard>
</template>
