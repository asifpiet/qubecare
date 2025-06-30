<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import PdfViewr from '@/views/apps/patient/ConsentForm/PdfViewr.vue';
import Intake from '@/views/apps/patient/Intake/Intake.vue';
import ViewIntakeForm from '@/views/apps/patient/Intake/viewIntake.vue';

import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
const formsStore = useFormsStore()
const practitionerStore = usePractitionerStore()
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const isSelectLabDialogVisible = ref(false)
const isAddConsentFormDrawerVisible = ref(false)
const isViewConsentFormDrawerVisible = ref(false)
const isPdfConsentFormDrawerVisible = ref(false)
const practitioners = ref([])
const consentForms = ref([])
const consentFormId = ref(null)
const practitioner = ref(null)
const dataTable = ref(null);

const storedData = ref({})
const intakefieldValue = ref([]);
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

onMounted(async () => {
  await formsStore.getFormByType('consent-forms')
  //await formsStore.getConsentFormsList()
  await practitionerStore.practitionersList()
  consentForms.value = formsStore.consentForms;
  const practitionersData = practitionerStore.practitioners;

  practitioners.value = practitionersData.map(practitioner => ({
    name: `${practitioner.fname} ${practitioner.lname}`, // Display text
    id: practitioner.id, // Value
  }))
})
const headers = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'Consent Form',
    key: 'name',
  },
  // {
  //   title: 'Signed As',
  //   key: 'name',
  // },
  {
    title: 'View',
    key: 'view',
  },
  {
    title: 'Signature Date',
    key: 'created_at',
  },

]

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
  isAddConsentFormDrawerVisible.value = true;
};

const openPdfModal = async (item) => {
  console.log('item', item)
  intakefieldValue.value = item;
  console.log(intakefieldValue.value)
  console.log("intakeListValue", intakefieldValue.value);
  consentFormId.value = item.form_id
  storedData.value = item
  isSelectLabDialogVisible.value = false
  isPdfConsentFormDrawerVisible.value = true;
};
const formatDate = (dateString) => {
  const [datePart, timePart] = dateString.split('T');
  const [year, month, day] = datePart.split('-');
  const [hour, minute, second] = timePart.split(':');
  return `${month}-${day}-${year} ${hour}:${minute}:${second.slice(0, 2)}`;
};



const isConsentDrawerOpen = async () => {
  console.log('save modal closed')
  consentFormId.value = '';
  isAddConsentFormDrawerVisible.value = false
  dataTable.value.reload()
} 
</script>

<template>


  <PerfectScrollbar :options="{ wheelPropagation: false }">


    <DataTable ref="dataTable" cardTitle="" btnTitle="New Consent" :headers="headers"
      :api="GET_PATIENT_INTAKE_FORMS_LIST + '/consent-forms/' + props.patient.id" :sortBy="sortByData"
      @onBtnClick="isSelectLabDialogVisible = true">
      <template #item.created_at="{ item }">
        <div class="d-flex align-center gap-x-4">
          <span>{{ dateFormat(item.created_at) }} </span>
        </div>
      </template>
      <template #item.view="{ item }">
        <IconBtn @click="openPdfModal(item)">
          <VIcon icon="tabler-eye" />
        </IconBtn>
      </template>
    </DataTable>



    <VNavigationDrawer v-model="isSelectLabDialogVisible" temporary :width="800" location="end"
      class="scrollable-content">
      <AppDrawerHeaderSection :title='"Add Consent (" + props.patient.demographic.fullName + ")"'
        @cancel="[isSelectLabDialogVisible = false, consentFormId = null, practitioner = null]" />
      <PerfectScrollbar :options="{ wheelPropagation: false }">
        <!-- <VCard title="Please Consent Form"> -->
        <VDivider />
        <VCardText>
          <VRow>
            <VCol cols="5">
              <AppSelect v-model="practitioner" label="Select Practitioner" placeholder="" :items="practitioners"
                item-value="id" item-title="name" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="5">
              <AppSelect v-model="consentFormId" label="Select Consent Form" placeholder="" :items="formsStore.forms"
                item-value="id" item-title="name" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="2">
              <VBtn class="mt-6" @click="openAddModal">Select</VBtn>
            </VCol>
          </VRow>
        </VCardText>
        <!-- </VCard> -->
      </PerfectScrollbar>
    </VNavigationDrawer>




    <VNavigationDrawer v-model="isAddConsentFormDrawerVisible" temporary :width="800" location="end"
      class="scrollable-content">
      <AppDrawerHeaderSection :title='"Add Consent (" + props.patient.demographic.fullName + ")"'
        @cancel="[isAddConsentFormDrawerVisible = false, practitioner = null, consentFormId = null]" />
      <PerfectScrollbar :options="{ wheelPropagation: false }">
        <!-- <VCard title=""> -->
        <VDivider />
        <VCardText>
          <Intake @closePopup="isConsentDrawerOpen" :patient="props.patient" :selectedFormId="consentFormId"
            v-if="consentFormId" :selectedPractitionerId="practitioner" />
        </VCardText>
        <!-- </VCard> -->
      </PerfectScrollbar>
    </VNavigationDrawer>

    <VDialog v-model="isViewConsentFormDrawerVisible" max-width="1300">
      <DialogCloseBtn @click="isViewConsentFormDrawerVisible = false" />
      <VCard title="View Consent">
        <VCardText>
          <ViewIntakeForm :intakefieldData="intakefieldValue" :patient="props.patient" />

        </VCardText>
      </VCard>
    </VDialog>



    <VNavigationDrawer v-model="isPdfConsentFormDrawerVisible" temporary :width="800" location="end"
      class="scrollable-content">
      <AppDrawerHeaderSection :title='"PDF Consent (" + props.patient.demographic.fullName + ")"'
        @cancel="[isPdfConsentFormDrawerVisible = false, intakefieldValue = null]" />
      <PerfectScrollbar :options="{ wheelPropagation: false }" v-if="intakefieldValue && intakefieldValue.pdf_url">
        <PdfViewr v-if="intakefieldValue" :pdfUrl="intakefieldValue.pdf_url"
          v-model:isOpen="isPdfConsentFormDrawerVisible" :title="intakefieldValue.name" />
      </PerfectScrollbar>
    </VNavigationDrawer>


  </PerfectScrollbar>

</template>
