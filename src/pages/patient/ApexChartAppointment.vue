<script setup>
import { usePatientStore } from '@/stores/patientStore';
import { getLinePatientPortalAppointmentChartSimpleConfig } from '@core/libs/apex-chart/apexCharConfig';
import { useTheme } from 'vuetify';
import { useStore } from 'vuex';
const patientStore = usePatientStore()
const store = useStore()
const vuetifyTheme = useTheme()
const balanceChartConfig = computed(() => getLinePatientPortalAppointmentChartSimpleConfig(vuetifyTheme.current.value))
const series = ref([{
  data: []
}])

const updateChartData = () => {
  const analyticsOverview = patientStore.appointmentMonthlyData;
  if (analyticsOverview && analyticsOverview) {
    series.value = [{
      data: analyticsOverview
    }]
  }
}

// Watch for changes in the store data
watch(() => patientStore.appointmentMonthlyData, updateChartData, { immediate: true })

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
