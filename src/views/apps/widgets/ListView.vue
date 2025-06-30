<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { useWidgetBuilderStore } from '@/stores/widgetBuilderStore';
import Intake from '@/views/apps/patient/Intake/Intake.vue';
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

const isIntakeDrawerVisible = ref(false)
const handleEditClick = (id) => {
  if (props.widgetData.id == id) {
    isIntakeDrawerVisible.value = true
  }
}



console.log(props.widgetData.fields.fieldArray)
if (props.patientId) {
  patient.value.id = props.patientId
}


await widgtStore.listView(props.widgetData.widget_type, props.widgetData.id, props.patientId ? props.patientId : '')

mergedArray.value = props.widgetData.fields.fieldArray
  .sort((a, b) => {
    if (a.key === 'full_name') return -1;
    if (b.key === 'full_name') return 1;
    return 0;
  })
  .map(item => {
    const value = widgtStore.chartData[0] ? widgtStore.chartData[0][item.key] : '';
    return {
      ...item,
      value: value || ''
    };
  });
console.log(mergedArray.value)
const closeIntakeForm = async () => {
  await widgtStore.listView(props.widgetData.widget_type, props.widgetData.id, props.patientId ? props.patientId : '')

  mergedArray.value = props.widgetData.fields.fieldArray
    .sort((a, b) => {
      if (a.key === 'full_name') return -1;
      if (b.key === 'full_name') return 1;
      return 0;
    })
    .map(item => {
      const value = widgtStore.chartData[0] ? widgtStore.chartData[0][item.key] : '';
      return {
        ...item,
        value: value || ''
      };
    });
  isIntakeDrawerVisible.value = false
}
</script>




<template>
  <DynamicCard :meta="props.widgetData.metaConfig" :title="props.widgetData.widget_name">
    <div class="text-right" style="align-self: flex-start;"
      v-if="props.widgetData.form_id && props.widgetData.metaConfig.editBtn">
      <IconBtn @click="handleEditClick(props.widgetData.id)">
        <VIcon icon="tabler-edit" class="text-primary" />
      </IconBtn>
    </div>



    <!-- List on the left -->

    <VList class="card-list mt-2">
      <VListItem>
        <VListItem v-for="data in mergedArray">
          <VListItemTitle>
            <span class="text-h6">{{ data.label }}: </span>
            <span class="text-body-1"> {{ data.value }} </span>
          </VListItemTitle>
        </VListItem>



      </VListItem>
    </VList>
  </DynamicCard>

  <VDialog v-model="isIntakeDrawerVisible" max-width="800" v-if="props.widgetData.form_id">
    <DialogCloseBtn @click="isIntakeDrawerVisible = false" />
    <VCard>
      <VCardText>
        <Intake v-if="isIntakeDrawerVisible && props.widgetData.form_id" @closePopup="closeIntakeForm"
          :patient="patient" :storedData="storedData" :selectedFormId="props.widgetData.form_id" />
      </VCardText>
    </VCard>
  </VDialog>

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
</style>
