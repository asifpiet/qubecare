<script setup>
import { getLineChartConfig } from '@core/libs/chartjs/chartjsConfig';
import LineChart from '@core/libs/chartjs/components/LineChart';
import { useTheme } from 'vuetify';

const props = defineProps({
  colors: {
    type: null,
    required: true,
  },
  chartData: {
    type: null,
    required: true,
  },
})

const vuetifyTheme = useTheme()

const data1 = {
  labels: [
    'Oct 1',
    'Oct 2',
    'Oct 3',
    'Oct 4',
    'Oct 5',
    'Oct 6',
    'Oct 7',
    'Oct 8',
    'Oct 9',
    'Oct 10',
    'Oct 11',
    'Oct 12',
    'Oct 13',
    'Oct 14',
    'Oct 15',
  ],
  datasets: [
    {
      fill: false,
      tension: 0.5,
      pointRadius: 1,
      label: 'Initial Consultation',
      pointHoverRadius: 5,
      pointStyle: 'circle',
      borderColor: props.colors.primary,
      backgroundColor: props.colors.primary,
      pointHoverBorderWidth: 5,
      pointHoverBorderColor: props.colors.white,
      pointBorderColor: 'transparent',
      pointHoverBackgroundColor: props.colors.primary,
      data: [
        80,
        150,
        180,
        270,
        210,
        160,
        160,
        202,
        265,
        210,
        270,
        255,
        290,
        360,
        375,
      ],
    },
    {
      fill: false,
      tension: 0.5,
      label: 'Follow-up Session',
      pointRadius: 1,
      pointHoverRadius: 5,
      pointStyle: 'circle',
      borderColor: props.colors.warningShade,
      backgroundColor: props.colors.warningShade,
      pointHoverBorderWidth: 5,
      pointHoverBorderColor: props.colors.white,
      pointBorderColor: 'transparent',
      pointHoverBackgroundColor: props.colors.warningShade,
      data: [
        80,
        125,
        105,
        130,
        215,
        195,
        140,
        160,
        230,
        300,
        220,
        170,
        210,
        200,
        280,
      ],
    },
    {
      fill: false,
      tension: 0.5,
      pointRadius: 1,
      label: 'Group Session',
      pointHoverRadius: 5,
      pointStyle: 'circle',
      borderColor: props.colors.yellow,
      backgroundColor: props.colors.yellow,
      pointHoverBorderWidth: 5,
      pointHoverBorderColor: props.colors.white,
      pointBorderColor: 'transparent',
      pointHoverBackgroundColor: props.colors.yellow,
      data: [
        80,
        99,
        82,
        90,
        115,
        115,
        74,
        75,
        130,
        155,
        125,
        90,
        140,
        130,
        180,
      ],
    },
  ],
}

const chartConfig = computed(() => getLineChartConfig(vuetifyTheme.current.value))
const data = props.chartData.chartSampleData; //lineChartData(props.colors,props.chartData);
</script>
<script>
export function lineChartData(colors, chartdata) {
  if (chartdata) {
    return chartdata
  } else {
    return {
    labels: [
      'Oct 1',
      'Oct 2',
      'Oct 3',
      'Oct 4',
      'Oct 5',
      'Oct 6',
      'Oct 7',
      'Oct 8',
      'Oct 9',
      'Oct 10',
      'Oct 11',
      'Oct 12',
      'Oct 13',
      'Oct 14',
      'Oct 15',
    ],
    datasets: [
      {
        fill: false,
        tension: 0.5,
        pointRadius: 1,
        label: 'Initial Consultation',
        pointHoverRadius: 5,
        pointStyle: 'circle',
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        pointHoverBorderWidth: 5,
        pointHoverBorderColor: colors.white,
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: colors.primary,
        data: [
          80,
          150,
          180,
          270,
          210,
          160,
          160,
          202,
          265,
          210,
          270,
          255,
          290,
          360,
          375,
        ],
      },
      
    ],
  }
  }
  
}
</script>

<template>
  <LineChart
    :chart-options="chartConfig"
    :height="400"
    :chart-data="data"
  />
</template>
