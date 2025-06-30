<script setup>
import { useVitalsStore } from '@/stores/vitalsStore';
import AddVital from '@/views/apps/patient/vitals/addvital.vue';
//import AddVital from '@/views/apps/user/vitals/addvital.vue';
import EditVital from '@/views/apps/patient/vitals/editVital.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';

const vitalsStore = useVitalsStore()
const store = useStore()
const isLoading = ref(false)
const isTonalSnackbarVisible = ref(false)
const isVitalDialogVisible = ref(false)
const isEditVitalDialogVisible = ref(false)

const filterVital = ref({
  provider: '',
  provider_id: '',
  weight_lbs: '',
  weight_oz: '',
  temperature: '',
  height_ft: '',
  height_in: '',
  bmi: '',
  blood_presssure: '',
  diastolic: '',
  respiratory_rate: '',
  pulse: '',
  bloodSugar: '',
  fasting: '',
  saturation: '',
  headCircumference_in: '',
  neck_in: '',
  shoulders_in: '',
  chest_in: '',
  waist_in: '',
  hips_in: '',
  lean_body_mass_lbs: '',
  left_forearm_in: '',
  left_wrist_in: '',
  right_forearm_in: '',
  right_wrist_in: '',
  left_bicep_in: '',
  right_bicep_in: '',
  left_thigh_in: '',
  right_thigh_in: '',
  left_calf_in: '',
  right_calf_in: '',
  body_fat: '',
  activity_level: '',
  hip_to_waist: '',
  resting_metabolic_rate_kcal: '',
  with_activity_metabolic_rate_kcal: '',
  fluid: '',
  fluid_oz: '',
  protein: '',
  protein_gms: '',
  protein_bmi: '',
  frame: '',
  ideal_body_weight_lbs: '',
  ibw_percentage: '',
  adjusted_body_weight_abw_lbs: '',
  recommendation_weight: '',
  notes: '',
  subjective_notes: '',
  due_datesdasd: '',
  catagri_template: '',
})
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isDataEnable: {
    type: Boolean,
  }
})

const headers = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'Provider',
    key: 'provider',
  },
  {
    title: 'Date of Visit',
    key: 'created_at',

  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    searchable: false
  },

]

const emit = defineEmits([
  'closeForm',
  'patientData',
  'editVital'
]);
onMounted(async () => {
  dataTable.value.reload()

})
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
}
const updateNewUser = async userData => {
  // isLoading.value = false;
  console.log("updateNewUser", userData);
  //await store.dispatch('updateIsLoading',true);
  let patientId = props.patient.uuid
  vitalsStore.EditVital(userData, userData.vital_id)
  isVitalDialogVisible.value = false;
  isEditVitalDialogVisible.value = false;
  dataTable.value.reload()
  console.log("res", res);
}
const saveVitals = async userData => {

  let patientId = props.patient.id
  await vitalsStore.AddVital(userData, patientId)

  isVitalDialogVisible.value = false;
  isEditVitalDialogVisible.value = false;
  isTonalSnackbarVisible.value = true;
  dataTable.value.reload()

}
const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const editVital = async (vid) => {
  isLoading.value = true;
  await vitalsStore.getVitalByIdAction(vid.pid, vid.eid, vid.vid, vid.id)
  isEditVitalDialogVisible.value = true;
  console.log(vitalsStore.getVitalById)
  filterVital.value = vitalsStore.getVitalById
  console.log("filterVital", filterVital.value)
  isLoading.value = false;
}

const deleteVital = async vid => {
  await vitalsStore.deleteVital(vid)
  dataTable.value.reload()
};


const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // For 24-hour format
  }).replace(',', ''); // Removing the comma
}

</script>

<template>
  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">

    <AppDrawerHeaderSection :title="$t('Vitals') + ' (' + props.patient.demographic.fullName + ')'"
      @cancel="closeNavigationDrawer" />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <DataTable ref="dataTable" cardTitle="" :btnTitle="$t('New Vital')" :headers="headers"
            :api="GET_VITAL + '/' + props.patient.id" :sortBy="sortByData" @onBtnClick="isVitalDialogVisible = true">
            <template #item.created_at="{ item }">
              <div class="d-flex align-center gap-x-4">
                <span>{{ dateFormat(item.created_at) }} </span>
              </div>
            </template>

            <template #item.actions="{ item }">
              <IconBtn @click="editVital(item)" v-if="$can('read', 'Vitals Edit')">
                <VIcon icon="tabler-edit" />
              </IconBtn>
              <IconBtn @click="deleteVital(item.id)" v-if="$can('read', 'Vitals Delete')">
                <VIcon icon="tabler-trash" />
              </IconBtn>
            </template>
          </DataTable>
        </VCardText>
      </VCard>

      <VNavigationDrawer v-model="isVitalDialogVisible" temporary :width="800" location="end"
        class="scrollable-content">
        <AppDrawerHeaderSection :title="$t('Create Vital') + ' (' + props.patient.demographic.fullName + ')'" 
          @cancel="isVitalDialogVisible = false" />
          <VDivider/>
          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <VCardText>
            <AddVital @addVital="saveVitals" />
          </VCardText>
        </PerfectScrollbar>
      </VNavigationDrawer>
      <!-- <VDialog v-model="isVitalDialogVisible" width="800">
        <DialogCloseBtn @click="isVitalDialogVisible = false" />
        <VCard title="Create New Vital">
          <VCardText>
            <AddVital @addVital="saveVitals" />
          </VCardText>
        </VCard>
      </VDialog> -->
      <!-- <VDialog v-model="isEditVitalDialogVisible" width="800">
        <DialogCloseBtn @click="isEditVitalDialogVisible = false" />
        <VCard title="Edit  Patient Vital">
          <VCardText>
            <EditVital :editVitalData="filterVital" @updateVital=updateNewUser />
          </VCardText>
        </VCard>
      </VDialog> -->

      <VNavigationDrawer v-model="isEditVitalDialogVisible" temporary :width="800" location="end"
        class="scrollable-content">
        <AppDrawerHeaderSection :title="$t('Edit Vital') + ' (' + props.patient.demographic.fullName + ')'" 
          @cancel="isEditVitalDialogVisible = false" />
          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <VCardText>
              <EditVital :editVitalData="filterVital" @updateVital=updateNewUser />
          </VCardText>
        </PerfectScrollbar>
      </VNavigationDrawer>


    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
