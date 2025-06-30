<script setup>
import { hexToRgb } from '@layouts/utils';
import { useTheme } from 'vuetify';
const vuetifyTheme = useTheme()
const totalOrderPrice =ref();
const totalOrder =ref(0);
const totalProductSales =ref(0);
const totalOrderItem =ref();
const props = defineProps({
  statData: {
    type: Object
  }
})

const data = computed(()=>{
  console.log("statData",props.statData[0]);
  totalOrderPrice.value = props.statData.totalOrderPrice;
  totalOrder.value = props.statData.totalOrder;
  totalProductSales.value = 0;
  totalOrderItem.value = props.statData.totalOrderItem;
  // upcomingAppointments.value = props.statData.upcomingAppointments;
//   totalInvoice.value = props.statData.totalInvoice;
  
})
const series = [{
  data: [
    40,
    65,
    50,
    45,
    90,
    55,
    70,
  ],
}]

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  
  return {
    chart: {
      parentHeightOffset: 0,
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        barHeight: '60%',
        columnWidth: '38%',
        startingShape: 'rounded',
        endingShape: 'rounded',
        borderRadius: 4,
        distributed: true,
      },
    },
    grid: {
      show: false,
      padding: {
        top: -30,
        bottom: 0,
        left: -10,
        right: -10,
      },
    },
    colors: [
      `rgba(${ hexToRgb(currentTheme.primary) },${ variableTheme['dragged-opacity'] })`,
      `rgba(${ hexToRgb(currentTheme.primary) },${ variableTheme['dragged-opacity'] })`,
      `rgba(${ hexToRgb(currentTheme.primary) },${ variableTheme['dragged-opacity'] })`,
      `rgba(${ hexToRgb(currentTheme.primary) },${ variableTheme['dragged-opacity'] })`,
      `rgba(${ hexToRgb(currentTheme.primary) }, 1)`,
      `rgba(${ hexToRgb(currentTheme.primary) },${ variableTheme['dragged-opacity'] })`,
      `rgba(${ hexToRgb(currentTheme.primary) },${ variableTheme['dragged-opacity'] })`,
    ],
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: [
        'Mo',
        'Tu',
        'We',
        'Th',
        'Fr',
        'Sa',
        'Su',
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: `rgba(${ hexToRgb(currentTheme['on-surface']) },${ variableTheme['disabled-opacity'] })`,
          fontSize: '13px',
          fontFamily: 'Public Sans',
        },
      },
    },
    yaxis: { labels: { show: false } },
    tooltip: { enabled: false },
    responsive: [{
      breakpoint: 1025,
      options: { chart: { height: 199 } },
    }],
  }
})

const earningsReports = [
  {
    color: 'primary',
    icon: 'tabler-shopping-cart',
    title: 'Order',
    amount: '$545.69',
    progress: '55',
  },
  {
    color: 'info',
    icon: 'tabler-currency-dollar',
    title: 'Sales',
    amount: '$256.34',
    progress: '25',
  },
  
]

const moreList = [
  {
    title: 'View More',
    value: 'View More',
  },
  {
    title: 'Delete',
    value: 'Delete',
  },
]

const progress = (value) => {
  return ((value / 100) * 100).toFixed(2);
};
</script>

<template>
    <div v-if="data"></div>
  <VCard>
    <VCardItem class="pb-sm-0">
      <VCardTitle>Total Revenue</VCardTitle>
      <VCardSubtitle>Sales and Order Overview</VCardSubtitle>
    </VCardItem>

    <VCardText>
      <VRow>
        <VCol
          cols="12"
          lg="12"
          class="d-flex flex-column align-self-center pt-9"
        >
          <div class="d-flex align-center gap-2 mb-3 flex-wrap">
            <h2 class="text-h2">
              ${{ totalOrderPrice }}
            </h2>
            <!-- <VChip
              label
              size="small"
              color="success"
            >
            </VChip> -->
          </div>

          <span class="text-sm text-medium-emphasis mb-9">
            Total Balance
          </span>
        </VCol>

        <!-- <VCol
          cols="12"
          sm="7"
          lg="6"
        >
          <VueApexCharts
            :options="chartOptions"
            :series="series"
            height="161"
          />
        </VCol> -->
      </VRow>

      <div class="border rounded mt-9  pa-5">
        <VRow>
          <VCol
            cols="12"
            sm="6"
          >
            <div class="d-flex align-center">
              <VAvatar
                rounded
                size="26"
                color="primary"
                variant="tonal"
                class="me-2"
              >
                <VIcon
                  size="18"
                  icon="tabler-shopping-cart"
                />
              </VAvatar>

              <h6 class="text-base font-weight-regular">
                Order
              </h6>
            </div>
            <h6 class="text-h4 my-2">
              {{ totalOrder }}
            </h6>
            <VProgressLinear
              :model-value="progress(totalOrder)"
              color="primary"
              height="4"
              rounded
              rounded-bar
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <div class="d-flex align-center">
              <VAvatar
                rounded
                size="26"
                color="info"
                variant="tonal"
                class="me-2"
              >
                <VIcon
                  size="18"
                  icon="tabler-shopping-cart"
                />
              </VAvatar>

              <h6 class="text-base font-weight-regular">
                Sale
              </h6>
            </div>
            <h6 class="text-h4 my-2">
              {{ totalOrderItem }}
            </h6>
            <VProgressLinear
              :model-value="progress(totalOrderItem)"
              color="primary"
              height="4"
              rounded
              rounded-bar
            />
          </VCol>
          
        </VRow>
      </div>
    </VCardText>
  </VCard>
</template>
