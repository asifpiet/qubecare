<script setup>
import { convertToAmPm, dateFormat } from '@/plugins/globalFunctions';
const props = defineProps({
  statData: {
    type: Object
  }
})
const appointments= ref([]);

const appointmentData = computed(() => {
  console.log("statData",props.statData);
  appointments.value = props.statData.upcomingAppointments;
});

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
    title: 'Time',
    key: 'time',
  },
  {
    title: 'Type',
    key: 'type',
  },
]
</script>

<template>
   <div v-if="appointmentData"></div>
  <VDataTable
    :headers="headers"
    :items="appointments"
    :items-per-page="5"
  >
    <template #item.date="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            {{ dateFormat(item.date) }}
          </div>
        </template>

        <template #item.time="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            {{ convertToAmPm(item.time) }}
          </div>
        </template>    
        
  </VDataTable>
</template>
