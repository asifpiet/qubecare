<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import PdfConsentForm from '@/views/apps/patient/ConsentForm/PdfConsentForm.vue';
import ViewConsentForm from '@/views/apps/patient/ConsentForm/ViewConsentForm.vue';
import Intake from '@/views/apps/patient/Intake/Intake.vue';
const formsStore = useFormsStore()
const practitionerStore = usePractitionerStore()
const sortByData = ref([{ 'key': 'form_name', 'order': 'desc' }])
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
const props = defineProps({
  patient: {
    type: Object,
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
    title: 'Consent Form',
    key: 'form_name',
  },
  {
    title: 'Signed As',
    key: 'name',
  },
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
  'patientData',
  'uploadConsent'
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




const closeIntakeForm = () => {
  isAddConsentFormDrawerVisible.value = false;
  emit('uploadConsent', true)
}

</script>

<template>


  <div style="float: right;">
    <VBtn @click="isSelectLabDialogVisible = true" prepend-icon="tabler-plus">{{ $t('New Consent Form') }}
    </VBtn>
  </div>

  <VCardText>





  </VCardText>

  <VDialog v-model="isSelectLabDialogVisible" width="600">
    <DialogCloseBtn @click="isSelectLabDialogVisible = false" />
    <VCard title="Please Consent Form">
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
    </VCard>
  </VDialog>
  <VDialog v-model="isAddConsentFormDrawerVisible" max-width="1300">
    <DialogCloseBtn @click="isAddConsentFormDrawerVisible = false" />
    <VCard title="Add Consent">
      <VCardText>

        <Intake @closePopup="closeIntakeForm" :patient="props.patient" :selectedFormId="consentFormId"
          :selectedPractitionerId="practitioner" />

      </VCardText>
    </VCard>
  </VDialog>

  <VDialog v-model="isViewConsentFormDrawerVisible" max-width="1300">
    <DialogCloseBtn @click="isViewConsentFormDrawerVisible = false" />
    <VCard title="View Consent">
      <VCardText>
        <ViewConsentForm />
      </VCardText>
    </VCard>
  </VDialog>

  <VDialog v-model="isPdfConsentFormDrawerVisible" max-width="1300">
    <DialogCloseBtn @click="isPdfConsentFormDrawerVisible = false" />
    <VCard title="PDF Consent">
      <VCardText>
        <PdfConsentForm :patient="props.patient" :selectedFormId="consentFormId" :storedData="storedData" />
      </VCardText>
    </VCard>
  </VDialog>



</template>
