<script setup>
import { useProviderStore } from '@/stores/providerStore';
const providerStore = useProviderStore()
const categoriesx =ref({});
const props = defineProps({
  statData: {
    type: Object
  }
})
const chartColors = {
  line: {
    series1: '#FFB400',
    series2: '#9055FD',
    series3: '#7367f029',
  },
}

const headingColor = 'rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity))'
const labelColor = 'rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity))'
const borderColor = 'rgba(var(--v-border-color), var(--v-border-opacity))'
// const series = props.statData.stats;

const series = ref({});

const updateChartData = () => {
  console.log("monthly", providerStore.dashboard.monthly);
  let analyticsOverview;

  try {
    // Safely parse the JSON string if it exists
    analyticsOverview = providerStore.dashboard || {};
  } catch (error) {
    console.error('Failed to parse getAppiontmentReport:', error);
    analyticsOverview = {}; // Fallback to an empty object
  }

  if (analyticsOverview && Array.isArray(providerStore.dashboard.stats)) {
    series.value = providerStore.dashboard.stats;
    console.log('Series updated with appointments:', series.value);
  } else {
    console.warn('appointments is missing or not an array:', providerStore.dashboard.stats);
    series.value = [{}];
  }
};

// Watch for changes in the store data
watch(
  () => providerStore.dashboard,
  updateChartData,
  { immediate: true } // Trigger immediately to initialize data
);

watch(
  () => providerStore.dashboard.monthly,
  (newMonthly) => {
    console.log("Monthly Data Updated:", newMonthly);
  },
  { immediate: true }
);

watch(
  series,
  (newValue) => {
    console.log('Chart series updated:', newValue);
  },
  { deep: true } // Use deep watch if series is nested
);


const shipmentConfig = {
  chart: {
    type: 'line',
    stacked: false,
    parentHeightOffset: 0,
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  markers: {
    size: 5,
    colors: '#fff',
    strokeColors: chartColors.line.series2,
    hover: { size: 6 },
    borderRadius: 4,
  },
  stroke: {
    curve: 'smooth',
    width: [
      0,
      3,
    ],
    lineCap: 'round',
  },
  legend: {
    show: true,
    position: 'bottom',
    markers: {
      width: 8,
      height: 8,
      offsetX: -3,
    },
    height: 40,
    itemMargin: {
      horizontal: 10,
      vertical: 0,
    },
    fontSize: '15px',
    fontFamily: 'Open Sans',
    fontWeight: 400,
    labels: {
      colors: headingColor,
      useSeriesColors: !1,
    },
    offsetY: 10,
  },
  grid: {
    strokeDashArray: 8,
    borderColor,
  },
  colors: [
    chartColors.line.series1,
    chartColors.line.series2,
  ],
  fill: {
    opacity: [
      1,
      1,
    ],
  },
  plotOptions: {
    bar: {
      columnWidth: '30%',
      borderRadius: 4,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    tickAmount: 10,
    categories: providerStore.dashboard.monthly,
    labels: {
      style: {
        colors: labelColor,
        fontSize: '13px',
        fontWeight: 400,
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    tickAmount: 4,
    min: 0,
    max: 50,
    labels: {
      style: {
        colors: labelColor,
        fontSize: '13px',
        fontWeight: 400,
      },
      formatter(val) {
        return `${ val }%`
      },
    },
  },
  responsive: [
    {
      breakpoint: 1400,
      options: {
        chart: { height: 320 },
        xaxis: { labels: { style: { fontSize: '10px' } } },
        legend: {
          itemMargin: {
            vertical: 0,
            horizontal: 10,
          },
          fontSize: '13px',
          offsetY: 12,
        },
      },
    },
    {
      breakpoint: 1025,
      options: {
        chart: { height: 415 },
        plotOptions: { bar: { columnWidth: '50%' } },
      },
    },
    {
      breakpoint: 982,
      options: { plotOptions: { bar: { columnWidth: '30%' } } },
    },
    {
      breakpoint: 480,
      options: {
        chart: { height: 250 },
        legend: { offsetY: 7 },
      },
    },
  ],
}
</script>

<template>
  <VCard>
    <VCardItem
      :title="$t('Order and Sales statistics')"
      subtitle=""
    >
    </VCardItem>

    <VCardText>
      <VueApexCharts
        id="shipment-statistics"
        type="line"
        height="320"
        :options="shipmentConfig"
        :series="series"
      />
    </VCardText>
  </VCard>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";

.v-btn-group--divided .v-btn:not(:last-child) {
  border-inline-end-color: rgba(var(--v-theme-primary), 0.5);
}

#shipment-statistics {
  .apexcharts-legend-text {
    font-size: 16px !important;
  }

  .apexcharts-legend-series {
    border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
    border-radius: 0.375rem;
    block-size: 83%;
    padding-block: 4px;
    padding-inline: 16px 12px;
  }
}
</style>
