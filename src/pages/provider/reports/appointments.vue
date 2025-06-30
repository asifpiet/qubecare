<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Appointment Report',
    },
})
import { usePractitionerStore } from '@/stores/practitionerStore';
import { useProviderStore } from '@/stores/providerStore';
import AppointmentBreakdown from '@/views/provider/reports/appointment/appointmentBreakdown.vue';
import AppointmentsChart from '@/views/provider/reports/appointment/appointmentsChart.vue';
import ProviderBreakdown from '@/views/provider/reports/appointment/providerBreakdown.vue';

import { useStore } from 'vuex';
const store = useStore()
const date = ref();
const providerStore = useProviderStore()
const practitionerStore = usePractitionerStore()
const provider = ref('all');
const today = new Date();
const downloadfile = ref();
const appiontmentStatus = ref('all');
const start_date = ref();
const end_date = ref();
// Array of weekday names
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// Get the current day name

onMounted(async () => {
    setDateRange();
    // await store.dispatch('updateIsLoading', true)
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
    providerStore.provider = provider.value;
    providerStore.status = appiontmentStatus.value;
    providerStore.getAppointmentReport();
});
const practitionerOptions = computed(() => {
    const practitioners = practitionerStore.practitioners.map(user => ({
        ...user,
        fullName: `${user.fname || ''} ${user.lname || ''}`.trim(),
    }));

    // Add the 'All' option at the beginning
    return [{ id: 'all', fullName: 'All' }, ...practitioners];
});
practitionerStore.practitionersList()
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
    try {
        const dateString = typeof date.value === 'string' ? date.value : '';
        const [startDate, endDate] = dateString.split(" to ");
        start_date.value = startDate;
        end_date.value = endDate;
        if (startDate && endDate) {
            console.log('check date', startDate, endDate);
            providerStore.start_date = startDate;
            providerStore.end_date = endDate;
            providerStore.provider = provider.value;
            providerStore.status = appiontmentStatus.value;
            providerStore.getAppointmentReport();
        } else {
            console.warn('Invalid date range');
            await store.dispatch('updateIsLoading', false)
        }
    } catch (error) {
        console.error('Error processing date range:', error);

    }
};

const eventStatuses = [
    { value: "all", label: "All" },
    { value: "ON_TIME", label: "On Time" },
    { value: "CHECKED_IN", label: "Checked In" },
    { value: "CONFIRMED", label: "CONFIRMED" },
    { value: "READY_FOR_PROVIDER", label: "Ready for Provider" },
    { value: "WITH_PROVIDER", label: "With Provider" },
    { value: "NOTE_COMPLETE", label: "Note Complete" },
    { value: "CHECKED_OUT", label: "Checked Out" },
    { value: "BILLING_DONE", label: "Billing Done" },
    { value: "DELAYED", label: "Delayed" },
    { value: "TENTATIVE", label: "Tentative" },
    { value: "RESCHEDULED", label: "Rescheduled" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "CANCELLATION_LATE", label: "Cancelled - Late" },
    { value: "CANCELLATION_BY_PROVIDER", label: "Cancelled - By Provider" },
    { value: "NO_SHOW", label: "No Show" }
];

watch(provider, changeDateRange);
watch(appiontmentStatus, changeDateRange);
watch(downloadfile, (newFile) => {
    if (!newFile) return;
    if (newFile === 'PDF') {
        providerStore.downloadFile('pdf', 'appointment');
    } else {
        providerStore.downloadFile('csv', 'appointment');
    }
});


</script>

<template>
    <VRow id="apex-chart-wrapper">
        <VCol cols="12" md="4" class="mt-3 px-3">
            <AppDateTimePicker v-model="date" :label="$t('Date Range')" :config="{ mode: 'range' }"
                @change="changeDateRange()">
            </AppDateTimePicker>
        </VCol>
        <VCol cols="12" md="4" class="mt-3 px-3">
            <small class="mn-0">{{ $t('Provider') }}</small>
            <VSelect v-model="provider" :rules="[requiredValidator]" :items="practitionerOptions" item-title="fullName"
                item-value="id" />
        </VCol>
        <VCol cols="12" md="4" class="mt-3 px-3">
            <AppSelect v-model="appiontmentStatus" label="Status" placeholder="Select Status" :items="eventStatuses"
                item-value="value" item-title="label" @change="changeDateRange()" />
        </VCol>
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
                                {{ providerStore.appointementReport.totalPatients }}
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
                            <VAvatar variant="tonal" color="warning" rounded>
                                <VIcon icon="tabler-calendar" size="24" />
                            </VAvatar>
                            <h4 class="text-h4">
                                {{ providerStore.appointementReport.totalAppointments }}
                            </h4>
                        </div>
                        <h6 class="text-h6 font-weight-regular">
                            {{ $t('Appointments') }}
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
                    <VCardTitle> {{ $t('Appointments by Type') }}</VCardTitle>
                    <template #append>
                        <div class="d-flex align-center">
                            <VSelect width="150" v-model="downloadfile" :label="$t('Download')"
                                :items="['PDF', 'Excel']" />
                        </div>
                    </template>
                </VCardItem>

                <VCardText>
                    <AppointmentsChart />
                </VCardText>
            </VCard>
        </VCol>

        <!-- 👉 Balance Line Chart  -->
        <VCol cols="12" md="6">
            <VCard>
                <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
                    <VCardTitle> {{ $t('Provider Breakdown') }}</VCardTitle>
                </VCardItem>

                <VCardText>
                    <ProviderBreakdown />
                </VCardText>
            </VCard>
        </VCol>


        <VCol cols="12" md="6">
            <VCard :title="$t('Appointment Type Breakdown')">
                <VCardText>
                    <AppointmentBreakdown />
                </VCardText>
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
