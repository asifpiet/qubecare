<script setup>
import Intake from '@/views/apps/patient/Intake/Intake.vue';
import updateForm from '@/views/apps/patient/Intake/updateForm.vue';
const storedData = ref({})
const patient = ref({})
const patientId = ref('')
const btnTitle = ref('Add')
const dataTable = ref(null);
const rowId = ref(0);
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
const sortByData = ref([{ 'key': props.widgetData.fields.fieldArray[0].key, 'order': 'desc' }])

if (props.patientId) {
  patientId.value = '/' + props.patientId
}

if (props.widgetData.metaConfig.editBtn || props.widgetData.metaConfig.deleteBtn) {

  let actions = {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    searchable: false
  }
  props.widgetData.fields.fieldArray = [...props.widgetData.fields.fieldArray, actions];
}

const isIntakeDrawerVisible = ref(false)
const isUpdateIntakeDrawerVisible = ref(false)
const handleEditClick = (id, row) => {
  if (props.widgetData.id == id) {
    isUpdateIntakeDrawerVisible.value = true
    rowId.value = row
  }
}
if (props.patientId) {
  patient.value.id = props.patientId
}
const reload = () => dataTable.value.reload()
const closeIntakeForm = async () => {
  isIntakeDrawerVisible.value = false
  isUpdateIntakeDrawerVisible.value = false
  reload()
}
</script>

<template>
  <section>

    <DataTable ref="dataTable" :cardTitle="props.widgetData.widget_name"
      :btnTitle="props.widgetData.metaConfig.addBtn ? btnTitle : ''" :headers="props.widgetData.fields.fieldArray"
      @onBtnClick="[isIntakeDrawerVisible = true]"
      :api="WIDGT_DATA + '/' + props.widgetData.widget_type + '/' + props.widgetData.id + patientId"
      :sortBy="sortByData" :meta="props.widgetData.metaConfig">
      <template #item.actions="{ item }"
        v-if="props.widgetData.metaConfig.editBtn || props.widgetData.metaConfig.deleteBtn">
        <IconBtn v-if="props.widgetData.metaConfig.editBtn">

          <VIcon icon="tabler-edit" @click="handleEditClick(props.widgetData.id, item.form_value_id)" />
        </IconBtn>
        <IconBtn v-if="props.widgetData.metaConfig.deleteBtn">
          <VIcon icon="tabler-trash" />
        </IconBtn>

      </template>
    </DataTable>
    <VDialog v-model="isIntakeDrawerVisible" max-width="800" v-if="props.widgetData.form_id">
      <DialogCloseBtn @click="isIntakeDrawerVisible = false" />
      <VCard>
        <VCardText>
          <Intake v-if="isIntakeDrawerVisible && props.widgetData.form_id" @closePopup="closeIntakeForm"
            :patient="patient" :storedData="storedData" :rowId="rowId" :selectedFormId="props.widgetData.form_id" />
        </VCardText>
      </VCard>
    </VDialog>
    <VDialog v-model="isUpdateIntakeDrawerVisible" max-width="800" v-if="props.widgetData.form_id">
      <DialogCloseBtn @click="isUpdateIntakeDrawerVisible = false" />
      <VCard>
        <VCardText>
          <updateForm v-if="isUpdateIntakeDrawerVisible && props.widgetData.form_id" @closePopup="closeIntakeForm"
            :patient="patient" :storedData="storedData" :rowId="rowId" :selectedFormId="props.widgetData.form_id" />
        </VCardText>
      </VCard>
    </VDialog>
  </section>
</template>
