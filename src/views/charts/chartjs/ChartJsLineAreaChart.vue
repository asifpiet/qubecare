<script setup>
import { getLineAreaChartConfig } from '@core/libs/chartjs/chartjsConfig'
import LineChart from '@core/libs/chartjs/components/LineChart'
import { useTheme } from 'vuetify'

const props = defineProps({
  colors: {
    type: null,
    required: true,
  },
})

const vuetifyTheme = useTheme()

const data1 = {
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
    '20/12',
    '',
  ],
  datasets: [
    {
      fill: true,
      tension: 0,
      label: 'Africa',
      pointRadius: 0.5,
      pointHoverRadius: 5,
      pointStyle: 'circle',
      backgroundColor: props.colors.areaChartBlue,
      pointHoverBorderWidth: 5,
      borderColor: 'transparent',
      pointHoverBorderColor: props.colors.white,
      pointBorderColor: 'transparent',
      pointHoverBackgroundColor: props.colors.areaChartBlue,
      data: [
        40,
        55,
        45,
        75,
        65,
        55,
        70,
        60,
        100,
        98,
        90,
        120,
        125,
        140,
        155,
      ],
    },
    {
      fill: true,
      tension: 0,
      label: 'Asia',
      pointRadius: 0.5,
      pointHoverRadius: 5,
      pointStyle: 'circle',
      pointHoverBorderWidth: 5,
      borderColor: 'transparent',
      backgroundColor: props.colors.areaChartBlueLight,
      pointHoverBorderColor: props.colors.white,
      pointBorderColor: 'transparent',
      pointHoverBackgroundColor: props.colors.areaChartBlueLight,
      data: [
        70,
        85,
        75,
        150,
        100,
        140,
        110,
        105,
        160,
        150,
        125,
        190,
        200,
        240,
        275,
      ],
    },
    {
      fill: true,
      tension: 0,
      label: 'Europe',
      pointRadius: 0.5,
      pointHoverRadius: 5,
      pointStyle: 'circle',
      pointHoverBorderWidth: 5,
      borderColor: 'transparent',
      backgroundColor: props.colors.areaChartGreyLight,
      pointHoverBorderColor: props.colors.white,
      pointBorderColor: 'transparent',
      pointHoverBackgroundColor: props.colors.areaChartGreyLight,
      data: [
        240,
        195,
        160,
        215,
        185,
        215,
        185,
        200,
        250,
        210,
        195,
        250,
        235,
        300,
        315,
      ],
    },
  ],
}

const chartConfig = computed(() => getLineAreaChartConfig(vuetifyTheme.current.value))
const data = lineChartAreaData(props.colors);
</script>
<script>
export function lineChartAreaData(colors) {
  const data = {
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
    '20/12',
    '',
  ],
  datasets: [
    {
      fill: true,
      tension: 0,
      label: 'Africa',
      pointRadius: 0.5,
      pointHoverRadius: 5,
      pointStyle: 'circle',
      backgroundColor: colors.areaChartBlue,
      pointHoverBorderWidth: 5,
      borderColor: 'transparent',
      pointHoverBorderColor: colors.white,
      pointBorderColor: 'transparent',
      pointHoverBackgroundColor: colors.areaChartBlue,
      data: [
        40,
        55,
        45,
        75,
        65,
        55,
        70,
        60,
        100,
        98,
        90,
        120,
        125,
        140,
        155,
      ],
    },
    {
      fill: true,
      tension: 0,
      label: 'Asia',
      pointRadius: 0.5,
      pointHoverRadius: 5,
      pointStyle: 'circle',
      pointHoverBorderWidth: 5,
      borderColor: 'transparent',
      backgroundColor: colors.areaChartBlueLight,
      pointHoverBorderColor: colors.white,
      pointBorderColor: 'transparent',
      pointHoverBackgroundColor: colors.areaChartBlueLight,
      data: [
        70,
        85,
        75,
        150,
        100,
        140,
        110,
        105,
        160,
        150,
        125,
        190,
        200,
        240,
        275,
      ],
    },
    {
      fill: true,
      tension: 0,
      label: 'Europe',
      pointRadius: 0.5,
      pointHoverRadius: 5,
      pointStyle: 'circle',
      pointHoverBorderWidth: 5,
      borderColor: 'transparent',
      backgroundColor: colors.areaChartGreyLight,
      pointHoverBorderColor:colors.white,
      pointBorderColor: 'transparent',
      pointHoverBackgroundColor: colors.areaChartGreyLight,
      data: [
        240,
        195,
        160,
        215,
        185,
        215,
        185,
        200,
        250,
        210,
        195,
        250,
        235,
        300,
        315,
      ],
    },
  ],
  }
return data
}
</script>
<template>
  <LineChart
    :chart-options="chartConfig"
    :height="400"
    :chart-data="data"
  />
</template>
