<script setup>
import { getRadarChartConfig } from '@core/libs/chartjs/chartjsConfig'
import RadarChart from '@core/libs/chartjs/components/RadarChart'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()
const chartConfig = computed(() => getRadarChartConfig(vuetifyTheme.current.value))

const chartData1 = {
  labels: [
    'STA',
    'STR',
    'AGI',
    'VIT',
    'CHA',
    'INT',
  ],
  datasets: [
    {
      fill: true,
      label: 'Donté Panlin',
      borderColor: 'transparent',
      backgroundColor: 'rgba(255,161,161, 0.9)',
      data: [
        25,
        59,
        90,
        81,
        60,
        82,
      ],
      pointBorderColor: 'transparent',
      pointBackgroundColor: 'transparent',
    },
    {
      fill: true,
      label: 'Mireska Sunbreeze',
      borderColor: 'transparent',
      backgroundColor: 'rgba(155,136,250, 0.9)',
      data: [
        40,
        100,
        40,
        90,
        40,
        90,
      ],
      pointBorderColor: 'transparent',
      pointBackgroundColor: 'transparent',
    },
  ],
}
const chartData = radarChartData(props.colors);
</script>
<script>
export function radarChartData(colors) {
  const chartData = {
  labels: [
    'STA',
    'STR',
    'AGI',
    'VIT',
    'CHA',
    'INT',
  ],
  datasets: [
    {
      fill: true,
      label: 'Donté Panlin',
      borderColor: 'transparent',
      backgroundColor: 'rgba(255,161,161, 0.9)',
      data: [
        25,
        59,
        90,
        81,
        60,
        82,
      ],
      pointBorderColor: 'transparent',
      pointBackgroundColor: 'transparent',
    },
    {
      fill: true,
      label: 'Mireska Sunbreeze',
      borderColor: 'transparent',
      backgroundColor: 'rgba(155,136,250, 0.9)',
      data: [
        40,
        100,
        40,
        90,
        40,
        90,
      ],
      pointBorderColor: 'transparent',
      pointBackgroundColor: 'transparent',
    },
  ],
}
return chartData
}
</script>
<template>
  <RadarChart
    :height="400"
    :chart-data="chartData"
    :chart-options="chartConfig"
  />
</template>
