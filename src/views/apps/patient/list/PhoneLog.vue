<script setup>

import AddPhoneLog from '@/views/apps/patient/textMessage/AddPhoneLog.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const isTonalSnackbarVisible = ref(false)
const isTextMessageDialogVisible = ref(false)
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
    title: 'Date',
    key: 'date',
  },
  {
    title: 'Provider',
    key: 'provider',
  },
  {
    title: 'Message',
    key: 'message',
  },

]

onMounted(async () => {
  dataTable.value.reload()
})


const emit = defineEmits([
  'closeForm',
  'patientData'
]);

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
}

const downloadPDF = async (item) => {
  window.open(item.pdfUrl, "_blank");
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}


const handleUserSubmit = async (msg) => {
  // Close the dialog when the AddUser component emits the submit event
  if (msg == 'cancel') {
    isTextMessageDialogVisible.value = false;
  }
  if (msg == 'success') {
    isTextMessageDialogVisible.value = false;
    dataTable.value.reload()
    setTimeout(() => {
      isTonalSnackbarVisible.value = false;
    }, 3000);
  }
}


</script>

<template>

  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">

    <AppDrawerHeaderSection :title='"Phone Log   (" + props.patient.demographic.fullName + ")"'
      @cancel="closeNavigationDrawer" />

    <PerfectScrollbar :options="{ wheelPropagation: false }">

      <VCardText>
        <DataTable ref="dataTable" cardTitle="" btnTitle="Phone Log" :headers="headers"
          :api="GET_LIST_PHONE_LOG_API + '/' + props.patient.id" :sortBy="sortByData"
          @onBtnClick="isTextMessageDialogVisible = true">
          <template #item.date="{ item }">
            <div class="text-body-1 text-high-emphasis text-capitalize">
              {{ dateFormat(item.date) }}
            </div>
          </template>

          <template #item.pdfUrl="{ item }">
            <IconBtn>
              <VIcon icon="tabler-pdf" @click="downloadPDF(item)" />
            </IconBtn>
          </template>
        </DataTable>

      </VCardText>

      <VDialog v-model="isTextMessageDialogVisible" width="800">
        <DialogCloseBtn @click="isTextMessageDialogVisible = false" />
        <VCard title=" Create Phone Log">
          <VCardText>
            <AddPhoneLog @submit="handleUserSubmit" :patient="patient" />
          </VCardText>
        </VCard>
      </VDialog>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
