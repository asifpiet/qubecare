<script setup>
import { useFormsStore } from '@/stores/formsStore';
import Intake from '@/views/apps/patient/Intake/Intake.vue';
import ViewIntakeForm from '@/views/apps/patient/Intake/viewIntake.vue';
import { ref } from 'vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const formsStore = useFormsStore()
const isIntakeDrawerVisible = ref(false)
const isSelectLabDialogVisible = ref(false)
const isViewConsentFormDrawerVisible = ref(false)
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const intakefieldValue = ref([]);
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
  },
  getIntakeForms: {
    type: Object
  }
})
const dataTable = ref(null);
//await formsStore.getQuestionnaireFormsList()
await formsStore.getFormByType('simple-forms')

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



const openIntakeModal = async (item) => {
  intakefieldValue.value = item;
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

const intakeFormId = ref(null)
watch(intakeFormId, async (newValue, oldValue) => {
  //   await store.dispatch('updateIntakeFormId', newValue);
  console.log('newValue', newValue)
});
</script>

<template>

  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">

    <AppDrawerHeaderSection :title='"Simple Form (" + props.patient.demographic.fullName + ")"'
      @cancel="closeNavigationDrawer" />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>

        <DataTable ref="dataTable" cardTitle="" btnTitle="New Simple Form" :headers="headers"
          :api="GET_PATIENT_INTAKE_FORMS_LIST + '/simple-forms/' + props.patient.id" :sortBy="sortByData"
          @onBtnClick="[isSelectLabDialogVisible = true, intakeFormId = '']">
          <template #item.actions="{ item }">
            <IconBtn @click="openIntakeModal(item)">
              <VIcon icon="tabler-eye" />
            </IconBtn>
          </template>
          <template #item.created_at="{ item }">
            {{ dateFormat(item.created_at) }}
          </template>
        </DataTable>
      </VCard>
      <VDialog v-model="isSelectLabDialogVisible" class="v-dialog-sm">
        <!-- Dialog close btn -->
        <DialogCloseBtn @click="isSelectLabDialogVisible = false" />

        <VCard title="Simple Form">
          <VCardText>
            <VForm ref="intakeFormRef">
              <VRow>
                <VCol cols="9">
                  <AppSelect v-model="intakeFormId" label="Select Questionnaire Form" placeholder=""
                    :items="formsStore.forms" item-value="id" item-title="name" :rules="[requiredValidator]" />
                </VCol>
                <VCol cols="3">
                  <VBtn class="mt-6" @click="selectIntakeForm">Select</VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VDialog>
      <VDialog v-model="isIntakeDrawerVisible" max-width="1300">
        <DialogCloseBtn @click="isIntakeDrawerVisible = false" />
        <VCard title="Add Questionnaire">
          <VCardText>
            <Intake v-if="isIntakeDrawerVisible" @closePopup="closeIntakeForm" :patient="props.patient"
              :storedData="storedData" :selectedFormId="intakeFormId" />

          </VCardText>
        </VCard>
      </VDialog>

      <VDialog v-model="isViewConsentFormDrawerVisible" max-width="1300">
        <DialogCloseBtn @click="isViewConsentFormDrawerVisible = false" />
        <VCard title="View Questionnaire">
          <VCardText>

            <ViewIntakeForm :intakefieldData="intakefieldValue" :patient="props.patient" />
          </VCardText>
        </VCard>
      </VDialog>

    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
