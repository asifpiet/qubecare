<script setup>
import { useFormsStore } from '@/stores/formsStore';
import viewIntake from '@/views/apps/patient/Intake/viewIntake.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
const { currentUser, currentRole, logout } = useAuth()
const formsStore = useFormsStore()
const patient = ref({})
const storedData = ref({})
const mergedArray = ref({})



console.log(currentUser.value)




await formsStore.getPatientMultiForm(currentUser.value.id)




</script>




<template>


  <VExpansionPanels variant="accordion">
    <VExpansionPanel v-for="(item, index) in formsStore.patientSubmittedForm" :key="index">
      <VExpansionPanelTitle>
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <span>{{ item.name }}</span>
          <span style="font-size: 0.875rem; color: #666;">{{ dateFormat(item.created_at) }}</span>
        </div>
      </VExpansionPanelTitle>
      <VExpansionPanelText>
        <PerfectScrollbar :options="{ wheelPropagation: false }">
          <VCard flat>
            <viewIntake :intakefieldData="item" :patient="currentUser" />
          </VCard>
        </PerfectScrollbar>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>









</template>
<style scoped>
.canvas-container {
  position: relative;
  margin: 0 auto;
  width: 100%;
  /* Set desired width */
  height: 600px;
  /* Set desired height */
  border: 1px solid #ddd;
  /* Optional: Add a border for visual reference */
  background-color: #f9f9f9;
  /* Optional: Set a background color */
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.formeo-wrap) {
  max-height: 300px;
  overflow: auto;
}
</style>
