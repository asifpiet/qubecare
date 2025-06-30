<script setup>
import { getHorizontalBarChartConfig } from '@core/libs/chartjs/chartjsConfig';
import BarChart from '@core/libs/chartjs/components/BarChart';
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
const chartOptions = computed(() => getHorizontalBarChartConfig(vuetifyTheme.current.value))

const data1 = {
  labels: [
    'MON',
    'TUE',
    'WED ',
    'THU',
    'FRI',
  ],
  datasets: [
    {
      maxBarThickness: 15,
      label: 'Market Data',
      backgroundColor: props.colors.warningShade,
      borderColor: 'transparent',
      data: [
        710,
        350,
        580,
        460,
        120,
      ],
    },
    {
      maxBarThickness: 15,
      backgroundColor: props.colors.horizontalBarInfo,
      label: 'Personal Data',
      borderColor: 'transparent',
      data: [
        430,
        590,
        510,
        240,
        360,
      ],
    },
  ],
}
console.log(props.chartData)
const data = props.chartData.chartSampleData;//horizantolBarChart(props.colors);
</script>
<script>
export function horizantolBarChart(colors) {
  return {
  labels: [
    'MON',
    'TUE',
    'WED ',
    'THU',
    'FRI',
  ],
  datasets: [
    {
      maxBarThickness: 15,
      label: 'Market Data',
      backgroundColor: colors.warningShade,
      borderColor: 'transparent',
      data: [
        710,
        350,
        580,
        460,
        120,
      ],
    },
  
  ],
}
}
</script>

<template>
  <BarChart
    :height="375"
    :chart-data="data"
    :chart-options="chartOptions"
  />
</template>
