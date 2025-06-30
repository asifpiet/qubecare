<script setup>
import { convertToAmPm, dateFormat } from '@/plugins/globalFunctions';
import { MEET_APPOINTMENT_URL } from '@/utils/constants';
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);
const props = defineProps({
  statData: {
    type: Object
  }
})
const appointments= ref([]);
const isDisabled =ref(true);
const appointmentData = computed(() => {
  console.log("statData",props.statData);
  appointments.value = props.statData.upcomingAppointments;
});

const joincall = (item) => {
  console.log("joincall",item);
  const url = MEET_APPOINTMENT_URL+item.id;
  window.open(url, '_blank');
}

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
  {
    title: 'Status',
    key: 'status',
  },
  {
    title: 'Action',
    key: 'action',
  },
]
</script>

<template>
   <div v-if="appointmentData"></div>
   <!-- <DataTable ref="dataTable" cardTitle="UpComing"  :headers="headers"
      :api="PATIENT_API_DATATABLE" :sortBy="sortByData"
      @onBtnClick="[patientStore.isDrawerOpen = true, selectedPatient = null]">
      
    </DataTable> -->
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
        <template #item.status="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
           <VChip size="small" v-if="item.pc_apptstatus == 'PENDING'">{{ item.pc_apptstatus }} </VChip>
                    <VChip size="small" v-else-if="item.pc_apptstatus == 'CONFIRMED'" color="success">{{ item.pc_apptstatus }} </VChip>
                    <VChip size="small" v-else-if="item.pc_apptstatus == 'CANCELLED'" color="error">{{ item.pc_apptstatus }} </VChip>
                    <VChip size="small" v-else >{{ item.pc_apptstatus }} </VChip>
          </div>
        </template>
        
        <template #item.action="{ item }">
        <div class="text-body-1 text-high-emphasis text-capitalize" >
          
          <VBtn size="small" @click="joincall(item)" v-if="item.pc_apptstatus !== 'CANCELLED' &&  item.pc_apptstatus !== 'CONFIRMED'">Join Call</VBtn>
        </div>
      </template>
        
  </VDataTable>
</template>
