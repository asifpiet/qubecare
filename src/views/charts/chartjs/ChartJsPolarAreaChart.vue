<script setup>
import { getPolarChartConfig } from '@core/libs/chartjs/chartjsConfig'
import PolarAreaChart from '@core/libs/chartjs/components/PolarAreaChart'
import { useTheme } from 'vuetify'

const props = defineProps({
  colors: {
    type: null,
    required: true,
  },
})

const vuetifyTheme = useTheme()
const chartConfig = computed(() => getPolarChartConfig(vuetifyTheme.current.value))

const data1 = {
  labels: [
    'Africa',
    'Asia',
    'Europe',
    'America',
    'Antarctica',
    'Australia',
  ],
  datasets: [{
    borderWidth: 0,
    label: 'Population (millions)',
    data: [
      19,
      17.5,
      15,
      13.5,
      11,
      9,
    ],
    backgroundColor: [
      props.colors.primary,
      props.colors.yellow,
      props.colors.polarChartWarning,
      props.colors.polarChartInfo,
      props.colors.polarChartGrey,
      props.colors.polarChartGreen,
    ],
  }],
}
const data = polerChartArea(props.colors);
</script>
<script>
export function polerChartArea(colors) {
  const data = {
  labels: [
    'Africa',
    'Asia',
    'Europe',
    'America',
    'Antarctica',
    'Australia',
  ],
  datasets: [{
    borderWidth: 0,
    label: 'Population (millions)',
    data: [
      19,
      17.5,
      15,
      13.5,
      11,
      9,
    ],
    backgroundColor: [
      colors.primary,
      colors.yellow,
      colors.polarChartWarning,
      colors.polarChartInfo,
      colors.polarChartGrey,
      colors.polarChartGreen,
    ],
  }],
}
return data
}
</script>
<template>
  <PolarAreaChart
    :height="400"
    :chart-data="data"
    :chart-options="chartConfig"
  />
</template>
