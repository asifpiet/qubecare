<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { usePatientStore } from '@/stores/patientStore';
import PdfConsentForm from '@/views/apps/patient/ConsentForm/PdfConsentForm.vue';
import Intake from '@/views/apps/patient/Intake/Intake.vue';
import RequestedForm from '@/views/apps/patient/Intake/RequestedForm.vue';
import ViewIntakeForm from '@/views/apps/patient/Intake/viewIntake.vue';
import { ref } from 'vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';

const formsStore = useFormsStore()
const patientStore = usePatientStore()
const store = useStore()
const isIntakeDrawerVisible = ref(false)
const isRequestFormDrawerVisible = ref(false)
const isLoading = ref(false)
const isTonalSnackbarVisible = ref(false)
const isSelectLabDialogVisible = ref(false)
const isViewConsentFormDrawerVisible = ref(false)
const isPdfConsentFormDrawerVisible = ref(false)
const fullName = ref();
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const intakefieldValue = ref([]);
const storedData = ref({})
const selectedTab = ref();
const requestName = ref(null);
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
  },
  getIntakeForms: {
    type: Object
  }
})
const dataTable = ref(null);

await formsStore.getFormByType('charting-forms')


onMounted(async () => { })

const closeIntakeForm = () => {
  isIntakeDrawerVisible.value = false;
  dataTable.value.reload()
}
const headers = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'Intake Form',
    key: 'name',
    name: 'intake_question.name'

  },

  {
    title: 'Created At',
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
  'closePopup'
]);

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
}
const handleDrawerModelValueUpdate = val => {

  emit('update:isDrawerOpen', val)
}

const formatCustomDate = (dateTime) => {
  if (!dateTime) return '';
  const date = new Date(dateTime);

  // Extract parts of the date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Format hours to 12-hour format with AM/PM
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = String(hours % 12 || 12).padStart(2, '0');

  // Construct the desired format
  return `${month}-${day}-${year}`;
};

const openIntakeModal = async (item) => {
  storedData.value = '';
  intakefieldValue.value = item;
  console.log(intakefieldValue.value)
  console.log("intakeListValue", intakefieldValue.value);
  isViewConsentFormDrawerVisible.value = true;
  storedData.value = item
};

const intakeFormRef = ref()


const selectIntakeForm = async () => {
  const { valid } = await intakeFormRef.value.validate()
  console.log(valid)
  if (valid) {
    isIntakeDrawerVisible.value = true,
      isSelectLabDialogVisible.value = false
  }
};

const sendFormRequest = async () => {
  const { valid } = await intakeFormRef.value.validate()
  console.log(valid)
  if (valid) {
    let data = {
      patient_id: props.patient.id,
      form_id: intakeFormId.value,
      request_name: requestName.value,
      status: 'pending'
    }
    console.log("data", data);
    await patientStore.sendFormRequest(data);
    // isIntakeDrawerVisible.value = true,
    // isSelectLabDialogVisible.value = false
  }
};

const intakeFormId = ref(null)

</script>

<template>

  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">

    <AppDrawerHeaderSection :title="$t('Intake Form') + ' (' + props.patient.demographic.fullName + ')'"  
      @cancel="closeNavigationDrawer" />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>

        <DataTable ref="dataTable" cardTitle="" :btnTitle="$t('New Intake Form')" :headers="headers"
          :api="GET_PATIENT_INTAKE_FORMS_LIST + '/charting-forms/' + props.patient.id" :sortBy="sortByData"
          @onBtnClick="[isSelectLabDialogVisible = true, intakeFormId = '']">
          <template #item.actions="{ item }">
            <VBtn @click="openIntakeModal(item)">{{ $t('View') }}</VBtn>

          </template>
          <template #item.created_at="{ item }">
            {{ dateFormat(item.created_at) }}
          </template>
          <template #additionalButton>
            <VBtn @click="isRequestFormDrawerVisible = true">{{ $t('Forms Request') }}</VBtn>
          </template>
        </DataTable>
      </VCard>

      <VNavigationDrawer v-model="isSelectLabDialogVisible" temporary :width="800" location="end"
        class="scrollable-content">
        <AppDrawerHeaderSection :title="$t('Add Intake Form') + ' (' + props.patient.demographic.fullName + ')'" 
          @cancel="isSelectLabDialogVisible = false" />
        <VCard :title="$t('Intake Form')">
          <VCardText>
            <VForm ref="intakeFormRef">
              <VRow>
                <VCol cols="9">
                  <AppSelect v-model="intakeFormId" :label="$t('Select Intake Form')" placeholder="" :items="formsStore.forms"
                    item-value="id" item-title="name" :rules="[requiredValidator]" />
                </VCol>
                <VCol cols="3">
                  <VBtn class="mt-6" @click="selectIntakeForm">{{ $t('Select') }}</VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VNavigationDrawer>


      <VNavigationDrawer v-model="isIntakeDrawerVisible" temporary :width="800" location="end"
        class="scrollable-content">
        <AppDrawerHeaderSection :title="$t('Add Intake Form') + ' (' + props.patient.demographic.fullName + ')'"  
          @cancel="isIntakeDrawerVisible = false" />
        <PerfectScrollbar :options="{ wheelPropagation: false }">
          <!-- <VCard title=""> -->
          <VCardText>
            <Intake v-if="isIntakeDrawerVisible" @closePopup="closeIntakeForm" :patient="props.patient"
              :storedData="storedData" :selectedFormId="intakeFormId" />
          </VCardText>
          <!-- </VCard> -->
        </PerfectScrollbar>
      </VNavigationDrawer>

      <VNavigationDrawer v-model="isIntakeDrawerVisible" temporary :width="800" location="end"
        class="scrollable-content">
        <AppDrawerHeaderSection :title="$t('Add Intake Form') + ' (' + props.patient.demographic.fullName + ')'"  
          @cancel="isIntakeDrawerVisible = false" />
        <PerfectScrollbar :options="{ wheelPropagation: false }">
          <Intake v-if="isIntakeDrawerVisible" @closePopup="closePopupWindow" :patient="props.patient"
            :storedData="storedData" :selectedFormId="intakeFormId" />
        </PerfectScrollbar>
      </VNavigationDrawer>


      <VNavigationDrawer v-model="isViewConsentFormDrawerVisible" temporary :width="800" location="end"
        v-if="intakefieldValue" class="scrollable-content">
        <AppDrawerHeaderSection :title="$t('View Intake Form') + ' (' + props.patient.demographic.fullName + ')'"   
          @cancel="isViewConsentFormDrawerVisible = false" />
        <VDivider />
        <PerfectScrollbar :options="{ wheelPropagation: false }"
          v-if="isViewConsentFormDrawerVisible && intakefieldValue">
          <ViewIntakeForm :intakefieldData="intakefieldValue" :patient="props.patient" />
        </PerfectScrollbar>
      </VNavigationDrawer>

      <!-- <VDialog v-model="isViewConsentFormDrawerVisible" max-width="1300">
        <DialogCloseBtn @click="isViewConsentFormDrawerVisible = false" />
        <VCard title="View Intake">
          <VCardText>
              <ViewIntakeForm :intakefieldData="intakefieldValue" :patient="props.patient" />
          </VCardText>
        </VCard>
      </VDialog> -->



      <VDialog v-model="isPdfConsentFormDrawerVisible" max-width="1300">
        <DialogCloseBtn @click="isPdfConsentFormDrawerVisible = false" />
        <VCard title="PDF Consent">
          <VCardText>
            <PdfConsentForm />
          </VCardText>
        </VCard>
      </VDialog>


      <!-- <VDialog v-model="isRequestFormDrawerVisible" max-width="1000">
        <DialogCloseBtn @click="isRequestFormDrawerVisible = false" />
        <RequestedForm :patient="props.patient" />
      </VDialog> -->

      <VNavigationDrawer v-model="isRequestFormDrawerVisible" temporary :width="800" location="end"
        class="scrollable-content">
        <AppDrawerHeaderSection :title="$t('Forms Request') + ' (' + props.patient.demographic.fullName + ')'" 
          @cancel="isRequestFormDrawerVisible = false" />
        <VDivider />
        <PerfectScrollbar :options="{ wheelPropagation: false }">
          <RequestedForm :patient="props.patient" />
        </PerfectScrollbar>
      </VNavigationDrawer>


    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
