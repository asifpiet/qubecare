<script setup>
import { useProviderStore } from '@/stores/providerStore';
import { getLineProviderChartSimpleConfig } from '@core/libs/apex-chart/apexCharConfig';
import { useTheme } from 'vuetify';
const providerStore = useProviderStore()
const vuetifyTheme = useTheme()
const balanceChartConfig = computed(() => getLineProviderChartSimpleConfig(vuetifyTheme.current.value))
const series = ref([{
    data: []
}])

const updateChartData = () => {
    const analyticsOverview = providerStore.providerReport
    if (analyticsOverview && analyticsOverview.data) {
        series.value = [{
            data: analyticsOverview.data
        }]
    }
}

// Watch for changes in the store data
watch(() => providerStore.providerReport, updateChartData, { immediate: true })

// Log for debugging
watch(series, (newValue) => {
    console.log('Chart series updated:', newValue)
}, { deep: true })
</script>

<template>
    <VueApexCharts type="line" height="400" :options="balanceChartConfig" :series="series" />
</template>
