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
const task_watchers = ref();
const access_restriction = ref();
const sendEmailtoPatientApplicationForTask = ref(0);
const notes = ref();
const today = ref(new Date());
const isTextMessageDialogVisible = ref(true);
const closeNavigationDrawer = () => {
    isTextMessageDialogVisible.value = false;  
}
const emit = defineEmits([
  'update:isDrawerOpen',
])
const practitionerOptions = ref([  // Dropdown options
  { id: 1, name: 'Zeeshan Anjum' },
  { id: 2, name: 'Nasir Ali' },
  { id: 3, name: 'John Doe' },
]);
const getPractionerUser = computed(async () => {
  await store.dispatch('updateIsLoading',true)
  const { data } = await useApi(createUrl(GET_USERS_LIST));  
   // Commit the fetched user data to Vuex 
   store.commit('setUser', data.value.data);
   const usersFromStore = store.getters.getUserList; 
   console.log(usersFromStore)
   practitionerOptions.value = usersFromStore.map(user => ({  
        ...user,  
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),  
   }));
  console.log(practitionerOptions.value)
  await store.dispatch('updateIsLoading',false)
        return practitionerOptions.value

})
const taskOptions = ref([  
 { value: '1', label: 'Document Review' },  
 { value: '2', label: 'Sign a Chart' },  
 { value: '3', label: 'Lab Order Follow up' },  
 { value: '4', label: 'Phone Call/Follow up' },  
  { value: '5', label: 'Text Follow up' },  
  { value: '103', label: 'Home Health Orders' },  
 { value: '106', label: 'Imaging Order' },  
 { value: '105', label: 'Injection Order' },  
 { value: '104', label: 'IV Order' },  
 { value: '101', label: 'Lab Order' },  
 { value: '102', label: 'Medication Orders' },  
 { value: '111', label: 'Miscellaneous Orders' }
 ]);  

 const orderOptions = ref([  

 ]);
  onMounted(async () => {
    await store.dispatch('updateIsLoading',true)
    const { data } = await useApi(createUrl(GET_USERS_LIST));  
    // Commit the fetched user data to Vuex 
    store.commit('setUser', data.value.data);
    const usersFromStore = store.getters.getUserList; 
    console.log(usersFromStore)
    practitionerOptions.value = usersFromStore.map(user => ({  
          ...user,  
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),  
    }));
    console.log(practitionerOptions.value)
    await store.dispatch('updateIsLoading',false)
  })
const onSubmit = async() => {
  isLoading.value = true
  refForm.value?.validate().then(async({ valid }) => {
    if (valid) {
    //   console.log('lastnae',lastName.value);
    //store.getters.getPatientPorfile.patientId
      emit('addTask', {     
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
            patient_id:store.getters.getPatientPorfile.uuid
        
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
                  item-title="label"  
                  item-value="label" 
                   :items="taskOptions"
                  
                />
              </VCol>
              <VCol cols="6">
                
                <AppDateTimePicker
                   v-model="due_date"
                    label="Due Date"
                  placeholder="Due Date"
                  :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
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
                  :items="practitionerOptions"   
                  item-title="fullName"  
                  item-value="id"  
                />
              </VCol>
              <VCol cols="6">
                <AppSelect
                  v-model="task_watchers"
                  :rules="[requiredValidator]"
                  label="Task Watcher"
                  placeholder="Task Watcher"
                  :items="practitionerOptions"   
                  item-title="fullName"  
                  item-value="id"  
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
