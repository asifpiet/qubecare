<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { useWidgetBuilderStore } from '@/stores/widgetBuilderStore';
import viewIntake from '@/views/apps/patient/Intake/viewIntake.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
const widgtStore = useWidgetBuilderStore()
const formsStore = useFormsStore()
const patient = ref({})
const storedData = ref({})
const mergedArray = ref({})
const props = defineProps({
  widgetData: {
    type: Object,
    required: true,
  },
  patientId: {
    type: Number,
    required: false,
  }
})

const isIntakeDrawerVisible = ref(true);




console.log(props.widgetData.fields.fieldArray)
if (props.patientId) {
  patient.value.id = props.patientId
}

await widgtStore.multiFormRender(props.widgetData.widget_type, props.widgetData.id, props.patientId ? props.patientId : '')




const closeIntakeForm = async () => {


}
</script>




<template>
  <DynamicCard :meta="props.widgetData.metaConfig" :title="props.widgetData.widget_name">

    <VExpansionPanels variant="accordion">
      <VExpansionPanel v-for="(item, index) in widgtStore.multiFormRenderData" :key="index">
        <VExpansionPanelTitle>
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <span>{{ item.name }}</span>
            <span style="font-size: 0.875rem; color: #666;">{{ dateFormat(item.created_at) }}</span>
          </div>
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <VCard flat>
              <viewIntake :intakefieldData="item" :patient="patient" />
            </VCard>
          </PerfectScrollbar>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>





  </DynamicCard>



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
