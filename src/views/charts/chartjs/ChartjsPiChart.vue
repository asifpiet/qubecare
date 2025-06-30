<script setup>
import { getLatestBarChartConfig } from '@core/libs/chartjs/chartjsConfig';
import PiChart from '@core/libs/chartjs/components/PiChart';
import { useTheme } from 'vuetify';

const props = defineProps({
  colors: {
    type: null,
    required: true,
  },
  chartData: {
    type: Object,
    required: false,
  },
})

const vuetifyTheme = useTheme()
const chartOptions = computed(() => getLatestBarChartConfig(vuetifyTheme.current.value))



const data = props.chartData.chartSampleData;
</script>
<script>
export function getChartData(colors) {
  return {
  labels: [
    '7/12',
    '8/12',
    '9/12',
    '10/12',
    '11/12',
    '12/12',
    '13/12',
    '14/12',
    '15/12',
    '16/12',
    '17/12',
    '18/12',
    '19/12',
  ],
  datasets: [{
    maxBarThickness: 15,
    backgroundColor: colors.barChartYellow,
    borderColor: 'transparent',
    borderRadius: {
      topRight: 15,
      topLeft: 15,
    },
    data: [
      275,
      90,
      190,
      205,
      125,
      85,
      55,
      87,
      127,
      150,
      230,
      280,
      190,
    ],
  }],
}
}
</script>
<template>
  <PiChart
    :height="400"
    :chart-data="data"
    :chart-options="chartOptions"
  />
</template>
