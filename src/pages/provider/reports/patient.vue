<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Appointment Report',
    },
})
// import ApexChartBalance from '@/views/charts/apex-chart/ApexChartBalance.vue';
import ApexPatientChartBalance from '@/pages/charts/patient/ApexPatientChartBalance.vue';
import { useStore } from 'vuex';
const store = useStore()
const downloadfile = ref();
const date = ref();
const logisticData = ref([]);
const invoiceReport = ref([]);
const practitionerOptions = ref([]);
const bissnessDay = ref();
const providerStats = ref();
const totalPatients = ref(0);
const totalProviders = ref(0);
const start_date = ref();
const end_date = ref();
const today = new Date();
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// const changeDateRange = async () => {


//  console.log('changed date', date.value, 'type:', typeof date.value);

//  try {
//    const dateString = typeof date.value === 'string' ? date.value : '';
//    const [startDate, endDate] = dateString.split(" to ");

//    if (startDate && endDate) {
//      await store.dispatch('getAdminAnalyticsOverview', {
//        start_date: startDate,
//        end_date: endDate,
//      });
//      analyticsData.value = store.getters.getAnalyticsOverview;
//    } else {
//      console.warn('Invalid date range');

//    }
//  } catch (error) {
//    console.error('Error processing date range:', error);

//  }
//  };

onMounted(async () => {
    setDateRange();
    await store.dispatch('updateIsLoading', true)
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
    await store.dispatch('getPatientStats', {
        start_date: start_date.value,
        end_date: end_date.value,
    });
    providerStats.value = store.getters.getPatientStats;
    totalPatients.value = providerStats.value.totalPatients;
    totalProviders.value = providerStats.value.totalProviders;
    console.log("patientStats", providerStats.value);
    await store.dispatch('updateIsLoading', false)
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
    // await store.dispatch('updateIsLoading',true)
    // console.log('shgdhasgdshla',store.getters.getCurrentFilterDate);
    console.log('changed date', date.value, 'type:', typeof date.value);
    try {
        const dateString = typeof date.value === 'string' ? date.value : '';
        const [startDate, endDate] = dateString.split(" to ");
        start_date.value = startDate;
        end_date.value = endDate;
        if (startDate && endDate) {
            console.log('check date', startDate, endDate);
            await store.dispatch('getPatientStats', {
                start_date: start_date.value,
                end_date: end_date.value,
            });
            invoiceReport.value = store.getters.getInvoiceReport;
            console.log("invoiceReport", invoiceReport.value);
            await store.dispatch('updateIsLoading', false)
        } else {
            console.warn('Invalid date range');
            await store.dispatch('updateIsLoading', false)
        }
    } catch (error) {
        console.error('Error processing date range:', error);

    }
};


const isDownloadPDFFile = async () => {

    await store.dispatch('isPatientPDFFile', {
        start_date: start_date.value,
        end_date: end_date.value,
    })
};
const isDownloadExcelFile = async () => {

    await store.dispatch('isPatientExcelFile', {
        start_date: start_date.value,
        end_date: end_date.value,

    })
};

watch(downloadfile, (newFile) => {
    if (!newFile) return;  // If downloadfile is null or undefined, skip
    if (newFile === 'PDF') {
        isDownloadPDFFile();
    } else {
        isDownloadExcelFile();
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
        <VCol cols="12" md="4"></VCol>
        <VCol cols="12" md="4"></VCol>
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
                                {{ totalProviders }}
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
                                {{ totalPatients }}
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
                            {{ $t(' Business Day ') }}
                        </h6>
                    </VCardText>
                </VCard>
            </div>
        </VCol>
        <!-- 👉  Area chart -->
        <VCol cols="12">

            <VCard>
                <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
                    <VCardTitle> {{ $t('Patient Stats') }}</VCardTitle>
                    <template #append>
                        <div class="d-flex align-center">
                            <!-- <VBtnToggle
                    density="compact"
                    color="primary"
                    variant="outlined"
                    divided
                    class="mr-2"
                  >
                    <VBtn>Daily</VBtn>
                    <VBtn>Monthly</VBtn>
                    <VBtn>Yearly</VBtn>
                  </VBtnToggle> -->

                            <VSelect width="150" v-model="downloadfile" :label="$t('Download')"
                                :items="['PDF', 'Excel']" />
                        </div>
                    </template>
                </VCardItem>

                <VCardText>
                    <ApexPatientChartBalance />
                </VCardText>
            </VCard>
        </VCol>

        <!-- 👉 Data Science -->
        <!-- <VCol cols="12">
      <VCard>
        <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
          <VCardTitle>Appiontments By Type</VCardTitle>

          <template #append>
            <div class="date-picker-wrapper">
              <AppDateTimePicker
                model-value="2022-06-09"
                prepend-inner-icon="tabler-calendar"
                placeholder="Select Date"
                :config="$vuetify.display.smAndDown ? { position: 'auto center' } : { position: 'auto right' }"
              />
            </div>
          </template>
        </VCardItem>

        <VCardText>
          <ApexChartDataScience />
        </VCardText>
      </VCard>
    </VCol> -->


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
