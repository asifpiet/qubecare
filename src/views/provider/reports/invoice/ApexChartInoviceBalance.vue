<script setup>
import { useProviderStore } from '@/stores/providerStore';
import { getLineInvoiceChartSimpleConfig } from '@core/libs/apex-chart/apexCharConfig';
import { useTheme } from 'vuetify';
import { useStore } from 'vuex';
const store = useStore()
const providerStore = useProviderStore()
const vuetifyTheme = useTheme()
const balanceChartConfig = computed(() => getLineInvoiceChartSimpleConfig(vuetifyTheme.current.value))
const series = ref([{
  data: []
}])

const updateChartData = () => {
  const analyticsOverview = providerStore.invocieReport
  if (analyticsOverview && analyticsOverview.data) {
    series.value = [{
      data: analyticsOverview.data
    }]
  }
}

// Watch for changes in the store data
watch(() => providerStore.invocieReport, updateChartData, { immediate: true })

// Log for debugging
watch(series, (newValue) => {
  console.log('Chart series updated:', newValue)
}, { deep: true })
</script>

<template>
  <VueApexCharts type="line" height="400" :options="balanceChartConfig" :series="series" />
</template>
