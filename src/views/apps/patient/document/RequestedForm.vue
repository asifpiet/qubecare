<script setup>
import { dateFormat } from '@/plugins/globalFunctions';
import { useFormsStore } from '@/stores/formsStore';
import { usePatientStore } from '@/stores/patientStore';
import Intake from '@/views/apps/patient/Intake/Intake.vue';
import ViewIntakeForm from '@/views/apps/patient/Intake/viewIntake.vue';
import { useStore } from 'vuex';
const { currentUser, currentRole } = useAuth()
const formsStore = useFormsStore()
const patientStore = usePatientStore()
const store = useStore()
const isLoading = ref(false)
const intakeFormRef = ref()
const isDocumentDialogVisible = ref(false)
const isEditDocumentDialogVisible = ref(false)
const sortByData = ref([{ 'key': 'form_name', 'order': 'desc' }])
const filterDocument = ref([]);
const dataTable = ref(null);
const intakeFormId = ref(null)
const isViewConsentFormDrawerVisible = ref(false)
const isSelectLabDialogVisible = ref(false)
const storedData = ref({})
const formName = ref(null);
const requestName = ref(null);
const intakefieldValue = ref([]);
const isIntakeDrawerVisible = ref(false)
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
    title: 'Requested Form',
    key: 'form_name',
  },
  // {
  //     title: 'Provider',
  //     key: 'provider_name',
  // },
  {
    title: 'Requested Date',
    key: 'date',
  },
  {
    title: 'Status',
    key: 'status',
  },
  // {
  //     title: 'Actions',
  //     key: 'actions',
  //     sortable: false,
  //     searchable: false
  // },


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

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const showForm = async (item) => {
  intakeFormId.value = item.form_id;
  formName.valaue = item.form_name;
  isIntakeDrawerVisible.value = true
};

const openIntakeModal = async (item) => {
  console.log('openIntakeModal');
  intakefieldValue.value = item;
  console.log("intakefieldRequest", intakefieldValue.value);
  isViewConsentFormDrawerVisible.value = true;
  storedData.value = item
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

    isSelectLabDialogVisible.value = false;
    addAlert('Request saved successfully', 'success')
    dataTable.value.reload()
  }
};

</script>

<template>
  <DataTable ref="dataTable" cardTitle="" :btnTitle="$t('Request Document')" :headers="headers"
    :api="GET_PROVIDER_REQUEST_FORM + '/' + props.patient.id + '/document-forms'" :sortBy="sortByData"
    @onBtnClick="isSelectLabDialogVisible = true">

    <template #item.date="{ item }">
      <div class="text-body-1 text-high-emphasis text-capitalize">
        {{ dateFormat(item.date) }}
      </div>
    </template>
    <template #item.status="{ item }">
      <div class="text-body-1 text-high-emphasis text-capitalize">
        <span v-if="item.status == 'Complete'">
          <VChip color="success">{{ item.status }}</VChip>
        </span>
        <span v-else>
          <VChip color="primary">{{ item.status }}</VChip>
        </span>
      </div>
    </template>
  </DataTable>

  <VNavigationDrawer v-model="isIntakeDrawerVisible" temporary :width="800" location="end" class="scrollable-content">
    <AppDrawerHeaderSection :title="$t('Add Request Form') + ' (' + props.patient.demographic.fullName + ')'" 
      @cancel="isIntakeDrawerVisible = false" />
    <Intake v-if="isIntakeDrawerVisible" @closePopup="closePopupWindow" :patient="props.patient"
      :storedData="storedData" :selectedFormId="intakeFormId" />
  </VNavigationDrawer>

  <VNavigationDrawer v-model="isSelectLabDialogVisible" temporary :width="800" location="end"
    class="scrollable-content">
    <AppDrawerHeaderSection :title="$t('Request Document') + ' (' + props.patient.demographic.fullName + ')'"
      @cancel="isSelectLabDialogVisible = false" />
    <VDivider />
    <VCardText>
      <VForm ref="intakeFormRef">
        <VRow>
          <VCol cols="8">
            <AppSelect v-model="intakeFormId" :label="$t('Select Intake Form')" placeholder="" :items="formsStore.forms"
              item-value="id" item-title="name" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="4">
            <VBtn class="mt-6" @click="sendFormRequest">{{ $t('Send Request') }}</VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VNavigationDrawer>



  <!-- <VDialog v-model="isViewConsentFormDrawerVisible" max-width="1000">
    <DialogCloseBtn @click="isViewConsentFormDrawerVisible = false" />
    <VCard :title="$t('View Request')">
      <VCardText>

        <ViewIntakeForm :intakefieldData="intakefieldValue" :patient="props.patient" />
      </VCardText>
    </VCard>
  </VDialog> -->

  <VNavigationDrawer v-model="isViewConsentFormDrawerVisible" temporary :width="800" location="end"
    class="scrollable-content">
    <AppDrawerHeaderSection  :title="$t('View Request') + ' (' + props.patient.demographic.fullName + ')'" 
      @cancel="isViewConsentFormDrawerVisible = false" />
    <ViewIntakeForm :intakefieldData="intakefieldValue" :patient="props.patient" />
  </VNavigationDrawer>

</template>
<style lang="scss">
.app-autocomplete__option:contains('Heading:') {
  font-weight: bold;
  color: #333;
}
</style>
