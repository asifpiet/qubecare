<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Dashboard View',
  },
})
import { useProviderStore } from '@/stores/providerStore';
import DashboardCardStatistics from '@/views/provider/dashboard/DashboardCardStatistics.vue';
import UpComingAppointments from '@/views/provider/dashboard/UpComingAppointments.vue';
import Graphical from '@/views/provider/dashboard/graphical.vue';

const dateRangeOptions = [
  { text: 'This Week', value: 'this_week' },
  { text: 'This Month', value: 'this_month' },
  { text: 'This Year', value: 'this_year' },
  { text: 'Last Week', value: 'last_week' },
  { text: 'Last Month', value: 'last_month' },
  { text: 'Last Year', value: 'last_year' },
];

const selectedDateRange = ref('this_year');
const start_date = ref();
const end_date = ref();
const providerStore = useProviderStore();
const dashboardStats = ref([]);

onMounted(async () => {
  handleDateRangeChange(selectedDateRange.value);
  // hideLoader()
});

const calculateDateRange = (rangeType) => {
  const now = new Date();
  let startDate, endDate;
  
  switch (rangeType) {
    case 'this_week': {
      // First day of current week (Sunday as first day of week)
      const firstDay = new Date(now);
      const day = now.getDay(); // 0 for Sunday, 1 for Monday, etc.
      firstDay.setDate(now.getDate() - day);
      startDate = firstDay;
      endDate = now;
      break;
    }
    case 'this_month': {
      // First day of current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = now;
      break;
    }
    case 'this_year': {
      // First day of current year
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = now;
      break;
    }
    case 'last_week': {
      // First day of last week
      const firstDayLastWeek = new Date(now);
      const day = now.getDay();
      firstDayLastWeek.setDate(now.getDate() - day - 7);
      startDate = firstDayLastWeek;
      
      // Last day of last week
      const lastDayLastWeek = new Date(firstDayLastWeek);
      lastDayLastWeek.setDate(firstDayLastWeek.getDate() + 6);
      endDate = lastDayLastWeek;
      break;
    }
    case 'last_month': {
      // First day of last month
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      // Last day of last month
      endDate = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    }
    case 'last_year': {
      // First day of last year
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      // Last day of last year
      endDate = new Date(now.getFullYear() - 1, 11, 31);
      break;
    }
    default: {
      // Default to this month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = now;
    }
  }
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  };
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const handleDateRangeChange = (value) => {
  const { startDate, endDate } = calculateDateRange(value);
  
  start_date.value = startDate;
  end_date.value = endDate;
  
  // Update store and fetch new data
  providerStore.start_date = startDate;
  providerStore.end_date = endDate;
  providerStore.getDashbaordStats();
  dashboardStats.value = [];
};
</script>

<template>
  <VRow class="match-height">
    <VCol cols="12" md="3" class="mt-3 px-3">
      <VSelect
        v-model="selectedDateRange"
        :items="dateRangeOptions"
        item-title="text"
        item-value="value"
        label="Filter Data"
        density="comfortable"
        @update:model-value="handleDateRangeChange"
      ></VSelect>
    </VCol>
    <VCol cols="12">
      <DashboardCardStatistics />
    </VCol>

    <VCol cols="12" md="12">
      <Graphical />
    </VCol>

    <VCol cols="12">
      <VCard title="Upcoming Appointments">
        <UpComingAppointments />
      </VCard>
    </VCol>
  </VRow>
</template>