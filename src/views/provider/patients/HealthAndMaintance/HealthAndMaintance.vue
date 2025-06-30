<script setup>
import { dateFormat } from '@/plugins/globalFunctions';
import { useMedicalHealthStore } from '@/stores/medicalHealthStore';
import { usePatientStore } from '@/stores/patientStore';
import AddHealthAndMaintanceDrawer from '@/views/provider/patients/HealthAndMaintance/AddhealthAndMantainceDrawer.vue';
const medicalHealthStore = useMedicalHealthStore()
const patientStore = usePatientStore()
const healthId = ref();
const sortByData = ref([{ 'key': 'title', 'order': 'desc' }])
const dataTable = ref(null);
const emit = defineEmits([
  'update:isDrawerOpen',
  'healthMantaince'
]);
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
})
const headers = [
  {
    title: 'Title',
    key: 'title',
  },

  {
    title: 'Start Date',
    key: 'begdate',
  },
  {
    title: 'End Date',
    key: 'enddate',
  },

  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    searchable: false
  },
]

const reload = () => dataTable.value.reload()

watch(() => medicalHealthStore.isDrawerOpen, (val) => {
  if (!val) {
    reload()
  }
})

watch(() => patientStore.id, (newVal) => {
  console.log('navAppointmentToggle', newVal);
  reload()
}
)
const editHealthMedical = async item => {
  healthId.value = item.medical_prob_id;
  medicalHealthStore.isDrawerOpen = true;
}

</script>

<template>

  <DataTable ref="dataTable" cardTitle="" :btnTitle="$t('Add Health Maintenance')" :headers="headers"
    :api="GET_HEALTH_MAINTANCE_API + '/' + props.patient.id" :sortBy="sortByData"
    @onBtnClick="[medicalHealthStore.isDrawerOpen = true, healthId = null]">
    <template #item.begdate="{ item }">
      <div class="text-body-1 text-high-emphasis text-capitalize">
        {{ dateFormat(item.begdate) }}
      </div>
    </template>

    <template #item.enddate="{ item }">
      <div class="text-body-1 text-high-emphasis text-capitalize">
        {{ dateFormat(item.enddate) }}
      </div>
    </template>
    <template #item.actions="{ item }">
      <IconBtn @click="editHealthMedical(item)" v-if="$can('read', 'Health And Maintenance Edit')">
        <VIcon icon="tabler-edit" />
      </IconBtn>
    </template>
  </DataTable>
  <AddHealthAndMaintanceDrawer :patient="props.patient" :selectedHealth="healthId"
    v-if="medicalHealthStore.isDrawerOpen" @customEvent="reload()" />

</template>
