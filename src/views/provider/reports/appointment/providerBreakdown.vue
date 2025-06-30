<script setup>
import { useProviderStore } from '@/stores/providerStore';
import { getBarChartConfig } from '@core/libs/apex-chart/apexCharConfig';
import { useTheme } from 'vuetify';
import { useStore } from 'vuex';
const store = useStore()
const providerStore = useProviderStore()
const vuetifyTheme = useTheme()
const horizontalBarChartConfig = computed(() => getBarChartConfig(vuetifyTheme.current.value))


import { ref, watch } from 'vue';

const series = ref([{ data: [] }]);

// Update chart data
const updateChartData = () => {
  let analyticsOverview;

  try {
    // Safely parse the JSON string from the store
    analyticsOverview = providerStore.appointementReport || {};
  } catch (error) {
    console.error('Failed to parse getAppiontmentReport:', error);
    analyticsOverview = {}; // Fallback to an empty object
  }

  // Safely check and update data
  if (analyticsOverview && Array.isArray(providerStore.appointementReport.providerAppointments)) {
    series.value = [
      {
        data: analyticsOverview.providerAppointments,
      },
    ];
    console.log('Series updated with providerAppointments:', series.value);
  } else {
    console.warn(
      'providerAppointments is missing or not an array:',
      analyticsOverview?.providerAppointments
    );
    series.value = [{ data: [] }];
  }
};

// Watch for changes in the getter data
watch(
  () => providerStore.appointementReport,
  updateChartData,
  { immediate: true } // Ensure the initial data is loaded
);

// Debug changes in the `series` array
watch(
  series,
  (newValue) => {
    console.log('Chart series updated:', newValue);
  },
  { deep: true } // Use deep watch only if necessary
);


</script>

<template>
  <VueApexCharts
    type="bar"
    height="200"
    :options="horizontalBarChartConfig"
    :series="series"
  />
</template>
