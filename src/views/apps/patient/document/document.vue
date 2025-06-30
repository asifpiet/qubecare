<script setup>
// import AddDocument from '@/views/apps/patient/document/addDocument.vue';
import { useFormsStore } from '@/stores/formsStore';
import { usePatientStore } from '@/stores/patientStore';
// import EditDocument from '@/views/apps/patient/document/editDocument.vue';
import RequestedForm from '@/views/apps/patient/document/RequestedForm.vue';
import Intake from '@/views/apps/patient/Intake/Intake.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { FEATURES } from "vuefinder/dist/features.js";
import { useStore } from 'vuex';
const store = useStore()
const isLoading = ref(false)
const formsStore = useFormsStore()
const patientStore = usePatientStore()
const finderComponent = ref(null)
const { currentUser, currentRole } = useAuth()
const isDocumentDialogVisible = ref(false)
const isViewDocumentDialogVisible = ref(false)
const isEditDocumentDialogVisible = ref(false)
const isRequestDocumentDialogVisible = ref(false)
const isRequestDrawerVisibleNew = ref(false)
const isIntakeDrawerVisible = ref(false)

const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const filterDocument = ref([]);
const intakefieldValue = ref([]);
const storedData = ref({})
const dataTable = ref(null);
const intakeFormId = ref(null)
const intakeFormRef = ref()
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

await formsStore.getFormByType('document-forms')
const headers = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'Date',
    key: 'docdate',
  },
  {
    title: 'Title',
    key: 'name',
  },
  {
    title: 'Type',
    key: 'mimetype',
  },
  {
    title: 'View',
    key: 'url',
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

const closeNavigationInsideDrawer = () => {
  isRequestDrawerVisibleNew.value = false;
}


const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const editDocument = async (vid) => {
  isLoading.value = true;
  isEditDocumentDialogVisible.value = true;
  let pid = props.patient.id;
  const res = await $api('/api' + PATIENT_API + '/' + pid, {
    method: 'GET',
  });
  filterDocument.value = res.documents.filter(row => row.id === vid)
  isLoading.value = false;
  return true;
}

const deleteVital = async vid => {
  let documents = filterDocument.value[0].documents;
  isLoading.value = true;
  const index = documents.filter(row => row.id === vid);
  if (index !== -1) {
    documents.splice(index, 1);

  } else {
    console.log('Row not found');
  }



  isLoading.value = false;
};


const selectIntakeForm = async () => {
  const { valid } = await intakeFormRef.value.validate()
  console.log(valid)
  if (valid) {
    isIntakeDrawerVisible.value = true;
    isDocumentDialogVisible.value = false;
  }
};

const closePopupWindow = () => {
  isIntakeDrawerVisible.value = false;
  isDocumentDialogVisible.value = false;
  isEditDocumentDialogVisible.value = false;


}
const downloadPDF = async (item) => {
  window.open(item.url, "_blank");
}

const ENABLED_FEATURES = [
  FEATURES.NEW_FILE,
  FEATURES.NEW_FOLDER,
  FEATURES.PREVIEW,
]
const accessToken = getCurrentAccessToken();
const request = {
  // ----- CHANGE ME! -----
  // [REQUIRED] Url for development server endpoint
  baseUrl: BASE_URL + GET_PATIENT_DOCUMENT_BY_ID + '/' + props.patient.id,
  // ----- CHANGE ME! -----

  // Additional headers & params & body
  headers: {
    Authorization: `Bearer ${accessToken}`,
    AccessToken: `${accessToken}`
  },


  // And/or transform request callback




}
const handleDataLoad = async (status) => {
  try {
    if (status && finderComponent.value) {
      console.log('Finder component:', finderComponent.value.getApp())
      // Let's see what methods and properties are available
      console.log('Available properties:', Object.getOwnPropertyNames(finderComponent.value))



      // Force a re-render of the component
      await finderComponent.value.$watch()
      const currentRequest = { ...request }


    }
  } catch (error) {
    console.error('Error during reload:', error, '\nFinder component:', finderComponent.value)
  }
}

</script>

<template>
  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">

    <AppDrawerHeaderSection :title="$t('Documents') + ' (' + props.patient.demographic.fullName + ')'"
      @cancel="closeNavigationDrawer" />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCardText>

        <div class="text-right pb-2">

          <VBtn class="mr-1" prepend-icon="tabler-plus" @click="[isDocumentDialogVisible = true]">
            {{ $t('Add Document') }}
          </VBtn>


          <VBtn class="mr-1 " prepend-icon="tabler-plus" @click="[patientStore.isSubDrawerOpen = true]">
            {{ $t('Request Document') }}
          </VBtn>
        </div>
        <div>
          <vue-finder id="vf" :request="request" ref="finderComponent"></vue-finder>
        </div>


      </VCardText>
      <!-- <VDialog v-model="isViewDocumentDialogVisible">
        <DialogCloseBtn @click="isViewDocumentDialogVisible = false" />
        <VCard>
          <VCardText>
            <div>
              <vue-finder id="vf" request="http://127.0.0.1:8000/api/get-document-vue/51"
                :features="ENABLED_FEATURES"></vue-finder>
            </div>
          </VCardText>
        </VCard>
      </VDialog> -->
      <!-- <VDialog v-model="isDocumentDialogVisible" width="600">
        <DialogCloseBtn @click="isDocumentDialogVisible = false" />
        <VCard :title="$t('Add Document')">
          <VCardText>
            <VForm ref="intakeFormRef">
              <VRow>
                <VCol cols="9">
                  <AppSelect v-model="intakeFormId" :label="$t('Select Document')" placeholder=""
                    :items="formsStore.forms" item-value="id" item-title="name" :rules="[requiredValidator]" />
                </VCol>
                <VCol cols="3">
                  <VBtn class="mt-6" @click="selectIntakeForm">{{ $t('Select') }}</VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VDialog> -->

      <VNavigationDrawer v-model="isDocumentDialogVisible" temporary :width="800" location="end"
        class="scrollable-content">
        <AppDrawerHeaderSection :title="$t('Add Document') + ' (' + props.patient.demographic.fullName + ')'"
          @cancel="isDocumentDialogVisible = false" />

        <VDivider />
        <VCardText>
          <VForm ref="intakeFormRef">
            <VRow>
              <VCol cols="8">
                <AppSelect v-model="intakeFormId" :label="$t('Select Document')" placeholder=""
                  :items="formsStore.forms" item-value="id" item-title="name" :rules="[requiredValidator]" />
              </VCol>
              <VCol cols="4">
                <VBtn class="mt-6" @click="selectIntakeForm">{{ $t('Select') }}</VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
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




      <VNavigationDrawer v-model="patientStore.isSubDrawerOpen" temporary :width="800" location="end"
        class="scrollable-content">
        <AppDrawerHeaderSection :title="$t('Request Documents') + ' (' + props.patient.demographic.fullName + ')'"
          @cancel="patientStore.isSubDrawerOpen = false" />
        <RequestedForm :patient="props.patient" class="mt-5" />
      </VNavigationDrawer>

    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
<style lang="scss">
.app-autocomplete__option:contains('Heading:') {
  font-weight: bold;
  color: #333;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;

}
</style>
