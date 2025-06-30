<script setup>
import { useProviderStore } from '@/stores/providerStore';
import { getDonutChartConfig } from '@core/libs/apex-chart/apexCharConfig';
import { ref, watch } from 'vue';
import { useTheme } from 'vuetify';
import { useStore } from 'vuex';
const store = useStore()
const vuetifyTheme = useTheme()
const providerStore = useProviderStore()
const expenseRationChartConfig = computed(() => getDonutChartConfig(vuetifyTheme.current.value))
const series = ref([]);

const safeParseJSON = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
};

const updateChartData = () => {
  const analyticsOverview = providerStore.appointementReport || {};
  console.log('Analytics Overview:', analyticsOverview);

  if (analyticsOverview && Array.isArray(analyticsOverview.typeValue)) {
    series.value = analyticsOverview.typeValue;
    console.log('Updated Series:', series.value);
  } else {
    console.warn('Invalid or missing typeValue:', analyticsOverview.typeValue);
    series.value = [{}];
  }
};

// Create a computed or reactive wrapper for the appointment report
const appointmentReport = computed(() =>
    providerStore.appointementReport || {}
);

// Watch the reactive/computed appointment report
watch(
  appointmentReport,
  (newVal) => {
    console.log('Appointment Report Changed:', newVal);
    updateChartData();
  },
  { immediate: true } // Trigger immediately for initial load
);



</script>

<template>
  <VueApexCharts
    type="donut"
    height="310"
    :options="expenseRationChartConfig"
    :series="series"
  />
</template>
