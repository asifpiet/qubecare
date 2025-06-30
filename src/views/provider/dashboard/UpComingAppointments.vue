<script setup>
import { useProviderStore } from '@/stores/providerStore';
import { dateTimeFormat } from '@/utils/showLoader';
const providerStore = useProviderStore()
const headers = [

  {
    title: 'Patient Name',
    key: 'title',
  },

  {
    title: 'DATE',
    key: 'date',
  },

  {
    title: 'Type',
    key: 'type',
  },
]
</script>

<template>

  <VDataTable :headers="headers" :items="providerStore.dashboard.upcomingAppointments" :items-per-page="5">
    <template #item.date="{ item }">
      <div class="text-body-1 text-high-emphasis text-capitalize">
        <!-- {{ dateFormat(item.date) }} -->
        {{ dateTimeFormat(`${item.date} ${item.time}`, "MM-DD-YYYY hh:mm A") }}

      </div>
    </template>

    <!-- <template #item.time="{ item }">
      <div class="text-body-1 text-high-emphasis text-capitalize">
        {{ convertToAmPm(item.time) }}
      </div>
    </template> -->

  </VDataTable>
</template>
