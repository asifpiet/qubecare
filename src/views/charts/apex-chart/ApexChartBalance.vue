<script setup>
import { getLineChartSimpleConfig } from '@core/libs/apex-chart/apexCharConfig';
import { useTheme } from 'vuetify';
import { useStore } from 'vuex';
const store = useStore()
const vuetifyTheme = useTheme()
const balanceChartConfig = computed(() => getLineChartSimpleConfig(vuetifyTheme.current.value))
// providerStats.value  = store.getters.getProviderStats;
// const series = [{
//   data: [
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//     0,
//   ],
// }]

const series = ref([{
  data: []
}])

const updateChartData = () => {
  const analyticsOverview = store.getters.getPatientStats
  if (analyticsOverview && analyticsOverview.data) {
    series.value = [{
      data: analyticsOverview.data
    }]
  }
}

// Watch for changes in the store data
watch(() => store.getters.getPatientStats, updateChartData, { immediate: true })

// Log for debugging
watch(series, (newValue) => {
  console.log('Chart series updated:', newValue)
}, { deep: true })
</script>

<template>
  <VueApexCharts
    type="line"
    height="400"
    :options="balanceChartConfig"
    :series="series"
  />
</template>
