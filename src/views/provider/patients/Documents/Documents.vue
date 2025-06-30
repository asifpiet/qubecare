<script setup>
import AddDocument from '@/views/apps/patient/document/addDocument.vue';
import EditDocument from '@/views/apps/patient/document/editDocument.vue';
const { currentUser, currentRole } = useAuth()
const isDocumentDialogVisible = ref(false)
const isEditDocumentDialogVisible = ref(false)
const filterDocument = ref([]);
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'closeForm',
  'patientData'
]);

const closePopupWindow = () => {
  isDocumentDialogVisible.value = false;
  isEditDocumentDialogVisible.value = false;


}
const accessToken = useCookie('accessToken').value;
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

</script>

<template>



  <div>
    <vue-finder id="vf" :request="request"></vue-finder>
  </div>




  <VDialog v-model="isDocumentDialogVisible" width="600">
    <DialogCloseBtn @click="isDocumentDialogVisible = false" />
    <VCard title="Create New Document">
      <VCardText>
        <AddDocument @addDocument="updateNewUser" @closePoup=closePopupWindow :patient="props.patient" />
      </VCardText>
    </VCard>
  </VDialog>
  <VDialog v-model="isEditDocumentDialogVisible" width="600">
    <DialogCloseBtn @click="isEditDocumentDialogVisible = false" />
    <VCard title="Edit Document">
      <VCardText>
        <EditDocument :editDocumentData="filterDocument" @closePoup=closePopupWindow />
      </VCardText>
    </VCard>
  </VDialog>
</template>
<style lang="scss">
.app-autocomplete__option:contains('Heading:') {
  font-weight: bold;
  color: #333;
}
</style>
<style>
/* Preventing overflow */


.vuefinder .vuefinder__main__fixed {
  width: 90% !important;
  left: 7% !important;
  top: 15% !important;

}
</style>
