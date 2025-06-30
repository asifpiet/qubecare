<script setup>
import { useStore } from 'vuex';
const store = useStore()
const isLoading = ref(false)
const isFormValid = ref(false)
const refForm = ref()
const patient_name = ref();
const title = ref();
const priority = ref();
const task_type = ref();
const due_date = ref();
const activityStatus = ref();
const task_owner = ref();
const task_watchers = ref([]);
const access_restriction = ref();
const sendEmailtoPatientApplicationForTask = ref();
const notes = ref();
const today = ref(new Date());
const isTextMessageDialogVisible = ref(true);
const closeNavigationDrawer = () => {
    isTextMessageDialogVisible.value = false;  
}
const props = defineProps({
taskData: {
    type: Object,
    required: true,
  }
});
const emit = defineEmits([
  'update:isDrawerOpen',
])
const viewTask = computed(async() => {
  console.log("viewtaskData",props.taskData);
  patient_name.value = props.taskData.patient_name;
  title.value = props.taskData.title +' - '+props.taskData.task_type;
  priority.value =props.taskData.priority;
  task_type.value = props.taskData.task_type;
  due_date.value = props.taskData.due_date;
  activityStatus.value = props.taskData.activityStatus;
  task_owner.value = props.taskData.task_owner;
  task_watchers.value = JSON.parse(props.taskData.task_watchers);
  access_restriction.value = props.taskData.access_restriction;
  sendEmailtoPatientApplicationForTask.value = props.taskData.sendEmailtoPatientApplicationForTask;
  notes.value = props.taskData.notes;
  return true;
});
const onSubmit = async() => {
  isLoading.value = true
  refForm.value?.validate().then(async({ valid }) => {
    if (valid) {
    //   console.log('lastnae',lastName.value);
    //store.getters.getPatientPorfile.patientId
      emit('editTask', { 
             id:props.taskData.id,
            patient_name: patient_name.value,
            activityMessage: title.value +' - '+ task_type.value,
            activityDueDate: due_date.value,
            activityStatus:activityStatus.value,
            owner: task_owner.value +' | '+ task_watchers.value,
            title: title.value,
            priority:priority.value,
            task_type:task_type.value,
            due_date:due_date.value,
            task_owner:task_owner.value,
            task_watchers:task_watchers.value,
            access_restriction:access_restriction.value,
            sendEmailtoPatientApplicationForTask:sendEmailtoPatientApplicationForTask.value,
            notes: notes.value,
            patient_id: store.getters.getPatientPorfile.patientId,
            edit:true
        
      })
        isLoading.value = false;
        nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
        closeNavigationDrawer();  
        })
    }else{
        
      isLoading.value = false;
    }
  })
  
}
</script>
<template>
            <VForm
                ref="refForm"
                v-model="isFormValid"
                v-if="viewTask"
            >
            <VRow>
               
            
             
              <VCol cols="6">
                <AppTextField
                  v-model="patient_name"
                  :rules="[requiredValidator]"
                  label="Name"
                  placeholder="Name"
                  
                />
              </VCol>
              <VCol cols="6">
                <AppSelect
                  v-model="title"
                  :rules="[requiredValidator]"
                  label="Title"
                  placeholder="Title"
                  :items="['Lab Order follow Up']"
                  
                />
              </VCol>
              <VCol cols="6">
                <AppSelect
                  v-model="priority"
                  :rules="[requiredValidator]"
                  label="Priorty"
                  placeholder="Title"
                  :items="['Low', 'High', 'Medium']"
                  
                />
              </VCol>
              <VCol cols="6">
                <AppSelect
                  v-model="task_type"
                  :rules="[requiredValidator]"
                  label="Task Type"
                  placeholder="Task Type"
                   :items="['Document Review', 'Sign a Chart', 'IV Order']"
                  
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="due_date"
                  type="datetime-local"
                  label="Due Date"
                  placeholder="Due Date"
                />
              </VCol>
              <VCol cols="6">
                <AppSelect
                  v-model="activityStatus"
                  :rules="[requiredValidator]"
                  label="Status"
                  placeholder="Status"
                  :items="['Created', 'In progress', 'Complete']"
                />
              </VCol>
              <VCol cols="6">
                <AppSelect
                  v-model="task_owner"
                  :rules="[requiredValidator]"
                  label="Task Owner"
                  placeholder="Task Owner"
                  :items="['Staff','Zeeshan Anjum']"
                />
              </VCol>
              <VCol cols="6">
                <AppSelect
                  v-model="task_watchers"
                  :rules="[requiredValidator]"
                  label="Task Watcher"
                  placeholder="Task Watcher"
                  :items="['Staff', 'Zeeshan Anjum']"
                  multiple
                />
              </VCol>
              <VCol cols="6">
                <AppSelect
                  v-model="access_restriction"
                  :rules="[requiredValidator]"
                  label="Access Restriction"
                  placeholder="Access Restriction"
                  :items="['None', 'Creator Or Assignee']"
                />
              </VCol>
              <VCol cols="12">
                <VCheckbox
                  v-model="sendEmailtoPatientApplicationForTask"
                  label="Send Email To Patient Applicable for tasks"
                />
                </VCol>
              <VCol cols="12">
                <v-textarea
                  v-model="notes"
                  label="Add New Notes*"
                  :rules="[requiredValidator]"
                  rows="5"
                  placeholder="Add New Notes*"
                />
                </VCol>
                <VCol cols="12">
                <VBtn
                  @click="onSubmit"
                 class="me-3"
                
                >
                Save
                </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="error"
                  class="ml-3"
                  @click="closeNavigationDrawer"
                >
                Close
                </VBtn>
              </VCol>
            </VRow>
        </VForm>        
         
</template>
