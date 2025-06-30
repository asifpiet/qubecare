<script setup>
import { useWidgetBuilderStore } from '@/stores/widgetBuilderStore';
import ChartJsBarChart from '@/views/charts/chartjs/ChartJsBarChart.vue';
import ChartJsBubbleChart from '@/views/charts/chartjs/ChartJsBubbleChart.vue';
import ChartJsHorizontalBarChart from '@/views/charts/chartjs/ChartJsHorizontalBarChart.vue';
import ChartJsLineAreaChart from '@/views/charts/chartjs/ChartJsLineAreaChart.vue';
import ChartJsLineChart from '@/views/charts/chartjs/ChartJsLineChart.vue';
import ChartJsPolarAreaChart from '@/views/charts/chartjs/ChartJsPolarAreaChart.vue';
import ChartJsRadarChart from '@/views/charts/chartjs/ChartJsRadarChart.vue';
import ChartJsScatterChart from '@/views/charts/chartjs/ChartJsScatterChart.vue';
const widgtStore = useWidgetBuilderStore()

const props = defineProps({
  widgetData: {
    type: Object,
    required: true,
  },
  patientId: {
    type: Number,
    required: false,
  }
})
console.log(props.patientId)
await widgtStore.getChartData(props.widgetData.widget_type, props.widgetData.id, props.patientId ? props.patientId : '')

const chartJsCustomColors = {
  white: '#fff',
  yellow: '#ffe802',
  primary: '#836af9',
  areaChartBlue: '#2c9aff',
  barChartYellow: '#ffcf5c',
  polarChartGrey: '#4f5d70',
  polarChartInfo: '#299aff',
  lineChartYellow: '#d4e157',
  polarChartGreen: '#28dac6',
  lineChartPrimary: '#9e69fd',
  lineChartWarning: '#ff9800',
  horizontalBarInfo: '#26c6da',
  polarChartWarning: '#ff8131',
  scatterChartGreen: '#28c76f',
  warningShade: '#ffbd1f',
  areaChartBlueLight: '#84d0ff',
  areaChartGreyLight: '#edf1f4',
  scatterChartWarning: '#ff9f43',
}

</script>

<template>
  <DynamicCard :meta="props.widgetData.metaConfig" :title="props.widgetData.widget_name">
    <VRow id="chartjs-wrapper">
      <!-- 👉 Statistics Line Chart  -->
      <VCol cols="12" v-if="props.widgetData.widget_type == 'line_chart'">



        <ChartJsLineChart v-if="widgtStore.chartData" :colors="chartJsCustomColors" :chartData="widgtStore.chartData" />

      </VCol>

      <!-- 👉 Radar Chart -->
      <VCol cols="12" md="12" v-if="props.widgetData.widget_type == 'radar_chart'">


        <ChartJsRadarChart />

      </VCol>

      <!-- 👉 Average Skills Polar Area Chart -->
      <VCol cols="12" md="12" v-if="props.widgetData.widget_type == 'polar_area_chart'">

        <ChartJsPolarAreaChart :colors="chartJsCustomColors" />

      </VCol>

      <!-- 👉  Bubble Chart -->
      <VCol cols="12" v-if="props.widgetData.widget_type == 'bubble_chart'">
        <VCard title="{{props.widgetData.widget_name}}">
          <template #append>
            <span class="text-subtitle-2" style="display: none;">$ 100,000</span>
          </template>

          <VCardText>
            <ChartJsBubbleChart :colors="chartJsCustomColors" />
          </VCardText>
        </VCard>
      </VCol>

      <!-- 👉 New Product Data Scatter Chart -->
      <VCol cols="12" v-if="props.widgetData.widget_type == 'scatter_chart'">
        <VCard>
          <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
            <VCardTitle>{{ props.widgetData.widget_name }}</VCardTitle>

            <template #append>
              <VBtnToggle color="primary" variant="outlined" density="compact">
                <VBtn>Daily</VBtn>
                <VBtn>Monthly</VBtn>
                <VBtn>Yearly</VBtn>
              </VBtnToggle>
            </template>
          </VCardItem>

          <VCardText>
            <ChartJsScatterChart :colors="chartJsCustomColors" />
          </VCardText>
        </VCard>
      </VCol>

      <!-- 👉 Data Science Area Line Chart -->
      <VCol cols="12" v-if="props.widgetData.widget_type == 'line_Area_chart'">
        <VCard>
          <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
            <VCardTitle>
              {{ props.widgetData.widget_name }}
            </VCardTitle>

            <template #append>
              <div class="date-picker-wrapper">
                <AppDateTimePicker model-value="2022-06-09" prepend-inner-icon="tabler-calendar"
                  placeholder="Select Date"
                  :config="$vuetify.display.smAndDown ? { position: 'auto center' } : { position: 'auto right' }" />
              </div>
            </template>
          </VCardItem>

          <VCardText>
            <ChartJsLineAreaChart :colors="chartJsCustomColors" />
          </VCardText>
        </VCard>
      </VCol>

      <!-- 👉 Latest Statistics -->
      <VCol cols="12" md="12" v-if="props.widgetData.widget_type == 'bar_chart'">

        <ChartJsBarChart v-if="widgtStore.chartData" :colors="chartJsCustomColors" :chartData="widgtStore.chartData" />

      </VCol>

      <!-- 👉 Balance Horizontal Bar Chart -->
      <VCol cols="12" md="12" v-if="props.widgetData.widget_type == 'horizontal_bar_chart'">


        <ChartJsHorizontalBarChart v-if="widgtStore.chartData" :colors="chartJsCustomColors"
          :chartData="widgtStore.chartData" />

      </VCol>
    </VRow>
  </DynamicCard>
</template>

<style lang="scss">
.date-picker-wrapper {
  inline-size: 10.5rem;
}

#chartjs-wrapper {
  .v-card-item__append {
    padding-inline-start: 0;
  }
}
</style>
