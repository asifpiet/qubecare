<script setup>
import { usePractitionerStore } from '@/stores/practitionerStore';
import { useTaskStore } from '@/stores/taskStore';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
const taskStore = useTaskStore()
const practitionerStore = usePractitionerStore()
practitionerStore.practitionersList()
taskStore.unloadTask()
const isFormValid = ref(false)
const isLoading = ref(false)
const refForm = ref()
const today = ref(new Date());
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  selectedTask: {
    type: String,
    required: true,
  },
  patient: {
    type: Object,
    required: true,
  },

})
const practitionerOptions = computed(() => {
  return practitionerStore.practitioners.map(user => ({
    ...user,
    fullName: `${user.fname || ''} ${user.lname || ''}`.trim(),
  }))
})

if (props.selectedTask) {
  console.log("selectedHealth", props.selectedTask);
  taskStore.loadTask(props.selectedTask)
}
onBeforeMount(() => { })
onMounted(async () => {
  console.log("practitionerOptions", practitionerOptions.value)
})
const taskOptions = [
  'Document Review',
  'Sign a Chart',
  'Lab Order Follow up',
  'Phone Call/Follow up',
  'Text Follow up',
  'Home Health Orders',
  'Imaging Order',
  'Injection Order',
  'IV Order',
  'Lab Order',
  'Medication Orders',
  'Miscellaneous Orders'
];
const emit = defineEmits([
  'closeForm',
  'patientData'
]);

const closeNavigationDrawer = () => {
  taskStore.isDrawerOpen = false
  emit('customEvent', false)
  emit('update:isDrawerOpen', false)
}
const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}


const onSubmit = async () => {
  isLoading.value = true
  refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      console.log("patientpatient", props.patient);
      let res = taskStore.saveTask(props.patient)
      console.log("res", res);
      closeNavigationDrawer();
      return res;
    }
  })
}


</script>

<template>
  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content"
    @update:model-value="taskStore.isDrawerOpen = false" :model-value="taskStore.isDrawerOpen">

    <AppDrawerHeaderSection :title="props.selectedTask ? $t('Edit Tasks') : $t('Add Tasks')"
      @cancel="taskStore.isDrawerOpen = false" />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>

          <VForm ref="refForm" v-model="isFormValid">
            <VRow>



              <VCol cols="6">
                <AppTextField v-model="taskStore.tasks.patient_name" :rules="[requiredValidator]" 
                :label="$t('Name')"
                  :placeholder="$t('Name')" />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="taskStore.tasks.title" :rules="[requiredValidator]" :label="$t('Title')"
                  :placeholder="$t('Title')" :items="taskOptions" />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="taskStore.tasks.priority" :rules="[requiredValidator]" :label="$t('Priority')"
                  :placeholder="$t('Priority')" :items="['Low', 'High', 'Medium']" />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="taskStore.tasks.task_type" :rules="[requiredValidator]" :label="$t('Task Type')"
                  :placeholder="$t('Task Type')" :items="['Document Review', 'Sign a Chart', 'IV Order']" />
              </VCol>
              <VCol cols="6">
                <AppTextField v-model="taskStore.tasks.due_date" type="datetime-local" :label="$t('Due Date')"
                  :placeholder="$t('Due Date')" />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="taskStore.tasks.activityStatus" :rules="[requiredValidator]" :label="$t('Status')"
                  :placeholder="$t('Status')" :items="['Created', 'In progress', 'Complete']" />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="taskStore.tasks.task_owner" :rules="[requiredValidator]" :label="$t('Task Owner')"
                  :placeholder="$t('Task Owner')" :items="practitionerOptions" item-title="fullName" item-value="id" />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="taskStore.tasks.task_watchers" :rules="[requiredValidator]" :label="$t('Task Watcher')"
                  :placeholder="$t('Task Watcher')" :items="practitionerOptions" item-title="fullName" item-value="id" />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="taskStore.tasks.access_restriction" :rules="[requiredValidator]"
                  :label="$t('Access Restriction')" :placeholder="$t('Access Restriction')"
                  :items="['None', 'Creator Or Assignee']" />
              </VCol>
              <VCol cols="12">
                <VCheckbox v-model="taskStore.tasks.sendEmailtoPatientApplicationForTask"
                  :label="$t('Send Email To Patient Applicable for tasks')" />
              </VCol>
              <VCol cols="12">
                <v-textarea v-model="taskStore.tasks.notes" :label="$t('Add New Notes')" :rules="[requiredValidator]" rows="5"
                  :placeholder="$t('Add New Notes')" />
              </VCol>
              <VCol cols="12">
                <VBtn @click="onSubmit" class="me-3">
                  {{ $t('Save')}}
                </VBtn>
                <VBtn type="reset" variant="tonal" color="error" class="ml-3" @click="closeNavigationDrawer">
                  
                  {{ $t('Close')}}
                </VBtn>
              </VCol>
            </VRow>
          </VForm>

        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
