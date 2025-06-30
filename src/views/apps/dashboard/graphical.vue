<script setup>
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
  console.log("monthly", props.statData.monthly);
  let analyticsOverview;

  try {
    // Safely parse the JSON string if it exists
    analyticsOverview = props.statData || {};
  } catch (error) {
    console.error('Failed to parse getAppiontmentReport:', error);
    analyticsOverview = {}; // Fallback to an empty object
  }

  if (analyticsOverview && Array.isArray(analyticsOverview.stats)) {
    series.value = analyticsOverview.stats;
    console.log('Series updated with appointments:', series.value);
  } else {
    console.warn('appointments is missing or not an array:', analyticsOverview?.stats);
    series.value = [{}];
  }

//   let appointmentReport = props.statData;

//   // Check if it's a JSON string and parse it
//   if (typeof appointmentReport === 'string' && appointmentReport.trim()) {
//     try {
//       appointmentReport = JSON.parse(appointmentReport);
//     } catch (error) {
//       console.error('Invalid JSON in getAppiontmentReport:', error);
//       appointmentReport = {};
//     }
//   } else if (!appointmentReport || typeof appointmentReport !== 'object') {
//     // If not a valid object, default to an empty object
//     appointmentReport = {};
//   }

//   console.log('Chart appointmentReport:', appointmentReport);
  
//   categoriesx.value = appointmentReport.monthly || [];
//   console.log('Chart Categories:', categoriesx.value);
};

// Watch for changes in the store data
watch(
  () => props.statData,
  updateChartData,
  { immediate: true } // Trigger immediately to initialize data
);

watch(
  () => props.statData.monthly,
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
    categories: [
        "1 Dec",
        "2 Dec",
        "3 Dec",
        "4 Dec",
        "5 Dec",
        "6 Dec",
        "7 Dec",
        "8 Dec",
        "9 Dec",
        "10 Dec",
        "11 Dec",
        "12 Dec",
        "13 Dec",
        "14 Dec",
        "15 Dec",
        "16 Dec",
        "17 Dec",
        "18 Dec",
        "19 Dec",
        "20 Dec",
        "21 Dec",
        "22 Dec",
        "23 Dec",
        "24 Dec",
        "25 Dec",
        "26 Dec",
        "27 Dec",
        "28 Dec",
        "29 Dec",
        "30 Dec",
        "31 Dec"
    ],
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
      title="Order and Sales statistics"
      subtitle=""
    >
      <!-- <template #append>
        <VBtn
          variant="tonal"
          append-icon="tabler-chevron-down"
        >
          January
        </VBtn>
      </template> -->
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
