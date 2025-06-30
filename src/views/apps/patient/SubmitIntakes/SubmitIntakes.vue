<script setup>
import PdfSubmittedIntake from '@/views/apps/patient/SubmitIntakes/PdfSubmittedIntake.vue';
import ViewSubmittedIntake from '@/views/apps/patient/SubmitIntakes/ViewSubmittedIntake.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
const isSelectLabDialogVisible = ref(false)
const isSubmitIntakesDialogVisible = ref(false)
const isViewConsentFormDrawerVisible = ref(false)
const isPdfConsentFormDrawerVisible = ref(false)
const lab = ref(null)
const fullName = ref();
const sortByData = ref([{ 'key': 'form_id', 'order': 'desc' }])
const selectedFormId = ref(null)
const storedData = ref({})
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
    key: 'form_id',
  },
  {
    title: 'Form Type',
    key: 'type',
    searchable: false,
    sortable: false
  },
  {
    title: 'Form Name',
    key: 'form_name',
    searchable: false,
  },
  {
    title: 'Submitted',
    key: 'created_at',
  },
  {
    title: 'Action',
    key: 'actions',
    searchable: false,
    sortable: false
  },

]


onMounted(async () => {

})

const emit = defineEmits([
  'closeForm',
  'patientData'
]);

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const openAddModal = () => {
  isSelectLabDialogVisible.value = false
  isSubmitIntakesDialogVisible.value = true;
};
const openPdfModal = async (item) => {
  selectedFormId.value = item.form_id;
  storedData.value = item;
  isSelectLabDialogVisible.value = false
  isPdfConsentFormDrawerVisible.value = true;

  // closeNavigationDrawer()
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

    <AppDrawerHeaderSection :title='"SubmitIntakes (" + props.patient.demographic.fullName + ")"'
      @cancel="closeNavigationDrawer" />

    <PerfectScrollbar :options="{ wheelPropagation: false }">

      <VCardText>
        <DataTable ref="dataTable" cardTitle="" btnTitle="" :headers="headers"
          :api="GET_PATIENT_SUBMITTED_INTAKES + '/' + props.patient.id" :sortBy="sortByData">
          <template #item.patient_name="{ item }">
            <div class="d-flex align-center gap-x-4">
              <span>{{ props.patient.firstName + ' ' + props.patient.lastName }} </span>
            </div>
          </template>

          <template #item.created_at="{ item }">
            <div class="d-flex align-center gap-x-4">
              <span>{{ dateFormat(item.created_at) }} </span>
            </div>
          </template>

          <template #item.actions="{ item }">
            <IconBtn @click="openPdfModal(item)">
              <VIcon icon="tabler-eye" />
            </IconBtn>
          </template>
          <!-- <IconBtn @click="openPdfModal(item)">
            <VIcon icon="tabler-pdf" />
          </IconBtn> -->
        </DataTable>

      </VCardText>
      <VDialog v-model="isSelectLabDialogVisible" width="600">
        <DialogCloseBtn @click="isSelectLabDialogVisible = false" />
        <VCard title="Please select lab first">
          <VCardText>
            <VRow>
              <VCol cols="9">
                <AppSelect v-model="lab" label="" placeholder="" :items="['LabCorp', 'Genova', 'Solaris']" />
              </VCol>
              <VCol cols="3">
                <VBtn @click="openAddModal">Select</VBtn>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VDialog>

      <VDialog v-model="isViewConsentFormDrawerVisible" max-width="1300">
        <DialogCloseBtn @click="isViewConsentFormDrawerVisible = false" />
        <VCard title="View Submitted Intake">
          <VCardText>
            <ViewSubmittedIntake />
          </VCardText>
        </VCard>
      </VDialog>
      <VDialog v-model="isPdfConsentFormDrawerVisible" max-width="1300">
        <DialogCloseBtn @click="isPdfConsentFormDrawerVisible = false" />
        <VCard title="Pdf Submitted Intake">
          <VCardText>
            <PdfSubmittedIntake :selectedFormId="selectedFormId" :storedData="storedData" :patient="props.patient" />
          </VCardText>
        </VCard>
      </VDialog>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
<style>
.v-table__wrapper {
  overflow-x: scroll !important;
}
</style>
