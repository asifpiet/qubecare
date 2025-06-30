<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Appointment Report',
    },
})
import { useProviderStore } from '@/stores/providerStore';
import ProviderChart from '@/views/provider/reports/provider/providerChart.vue';
import { useStore } from 'vuex';
const providerStore = useProviderStore()
const store = useStore()
const downloadfile = ref();
const date = ref();
const today = new Date();
const start_date = ref();
const end_date = ref();
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
    providerStore.getProviderReport();
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
            providerStore.getProviderReport();
            console.log('check date', startDate, endDate);
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
        providerStore.downloadFile('pdf', 'provider');
    } else {
        providerStore.downloadFile('csv', 'provider');
    }
});



</script>

<template>
    <VRow id="apex-chart-wrapper">
        <!-- 👉  Area chart -->

        <VCol cols="12" md="4" sm="6" class="mt-3 px-3 pb-0">
            <AppDateTimePicker v-model="date" :label="$t('Date Range')" :config="{ mode: 'range' }"
                @change="changeDateRange()">
            </AppDateTimePicker>
        </VCol>
        <VCol cols="12"></VCol>
        <VCol cols="12" md="4" sm="6">
            <div>
                <VCard class="logistics-card-statistics cursor-pointer"
                    style="border-block-end-color: rgb(var(--v-theme-primary))" @mouseenter="true" @mouseleave="false">
                    <VCardText>
                        <div class="d-flex align-center gap-x-4 mb-2">
                            <VAvatar variant="tonal" color="primary" rounded>
                                <VIcon icon="tabler-users" size="24" />
                            </VAvatar>
                            <h4 class="text-h4">
                                {{ providerStore.providerReport.totalProvider }}
                            </h4>
                        </div>
                        <h6 class="text-h6 font-weight-regular">
                            {{ $t('Providers') }}
                        </h6>
                    </VCardText>
                </VCard>
            </div>
        </VCol>
        <VCol cols="12" md="4" sm="6">
            <div>
                <VCard class="logistics-card-statistics cursor-pointer"
                    style="border-block-end-color: rgb(var(--v-theme-warning))" @mouseenter="true" @mouseleave="false">
                    <VCardText>
                        <div class="d-flex align-center gap-x-4 mb-2">
                            <VAvatar variant="tonal" color="warning" rounded>
                                <VIcon icon="tabler-calendar" size="24" />
                            </VAvatar>
                            <h4 class="text-h4">
                                {{ providerStore.providerReport.totalpatients }}
                            </h4>
                        </div>
                        <h6 class="text-h6 font-weight-regular">

                            {{ $t('Patients') }}
                        </h6>
                    </VCardText>
                </VCard>
            </div>
        </VCol>
        <VCol cols="12" md="4" sm="6">
            <div>
                <VCard class="logistics-card-statistics cursor-pointer"
                    style="border-block-end-color: rgb(var(--v-theme-warning))" @mouseenter="true" @mouseleave="false">
                    <VCardText>
                        <div class="d-flex align-center gap-x-4 mb-2">
                            <VAvatar variant="tonal" color="info" rounded>
                                <VIcon icon="tabler-clock" size="24" />
                            </VAvatar>
                            <h4 class="text-h4">
                                {{ days[today.getDay()] }}
                            </h4>
                        </div>
                        <h6 class="text-h6 font-weight-regular">

                            {{ $t('Business Day') }}

                        </h6>
                    </VCardText>
                </VCard>
            </div>
        </VCol>
        <VCol cols="12">
            <VCard>
                <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
                    <VCardTitle> {{ $t('Provider Stats') }}</VCardTitle>
                    <template #append>
                        <div class="d-flex align-center">
                            <VSelect width="150" v-model="downloadfile" :label="$t('Download')"
                                :items="['PDF', 'Excel']" />
                        </div>
                    </template>
                </VCardItem>
                <VRow>
                    <VCol cols="12">
                        <ProviderChart />
                    </VCol>

                </VRow>
            </VCard>
        </VCol>
    </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";

.date-picker-wrapper {
    inline-size: 10.5rem;
}

#apex-chart-wrapper {
    .v-card-item__append {
        padding-inline-start: 0;
    }
}
</style>
