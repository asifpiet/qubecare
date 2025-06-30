<script setup>
import { getColumnChartConfig } from '@core/libs/apex-chart/apexCharConfig';
import { ref, watch } from 'vue';
import { useTheme } from 'vuetify';
import { useStore } from 'vuex';
const store = useStore()
const vuetifyTheme = useTheme()
const chartConfig = computed(() => getColumnChartConfig(vuetifyTheme.current.value));

const series = ref([]);

const updateChartData = () => {
  let analyticsOverview;

  try {
    // Safely parse the JSON string if it exists
    analyticsOverview = store.getters.getAppiontmentReport || {};
  } catch (error) {
    console.error('Failed to parse getAppiontmentReport:', error);
    analyticsOverview = {}; // Fallback to an empty object
  }

  if (analyticsOverview && Array.isArray(analyticsOverview.appointments)) {
    series.value = analyticsOverview.appointments;
    console.log('Series updated with appointments:', series.value);
  } else {
    console.warn('appointments is missing or not an array:', analyticsOverview?.appointments);
    series.value = [{}];
  }
};

// Watch for changes in the store data
watch(
  () => store.getters.getAppiontmentReport,
  updateChartData,
  { immediate: true } // Trigger immediately to initialize data
);

watch(
  series,
  (newValue) => {
    console.log('Chart series updated:', newValue);
  },
  { deep: true } // Use deep watch if series is nested
);


</script>

<template>
  <VueApexCharts
    type="bar"
    height="400"
    :options="chartConfig"
    :series="series"
  />
</template>
