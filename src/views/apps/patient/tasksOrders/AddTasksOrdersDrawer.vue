<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
const store = useStore()
const isFormValid = ref(false)
const isLoading = ref(false)
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
const sendEmailtoPatientApplicationForTask = ref();
const notes = ref();
const today = ref(new Date());
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  }
})

onMounted(async () => {
  await store.dispatch('updateIsLoading', true)
  const { data } = await useApi(createUrl(GET_USERS_LIST));
  // Commit the fetched user data to Vuex 
  store.commit('setUser', data.value.data);
  const usersFromStore = store.getters.getUserList;
  console.log(usersFromStore)
  practitionerOptions.value = usersFromStore.map(user => ({
    ...user,
    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
  }));
  console.log("practitionerOptions", practitionerOptions.value)
  await store.dispatch('updateIsLoading', false)
})

const practitionerOptions = ref([  // Dropdown options
  { id: 1, name: 'Zeeshan Anjum' },
  { id: 2, name: 'Nasir Ali' },
  { id: 3, name: 'John Doe' },
]);

// const getPractionerUser = computed(async () => {
//   await store.dispatch('updateIsLoading',true)
//   const { data } = await useApi(createUrl(GET_USERS_LIST));  
//    // Commit the fetched user data to Vuex 
//    console.log("getPractionerUser",data.value.userList);
//    store.commit('setUser', data.value.userList);
//    const usersFromStore = store.getters.getUserList; 
//    console.log(usersFromStore)
//    practitionerOptions.value = usersFromStore.map(user => ({  
//         ...user,  
//         fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),  
//    }));
//   console.log(practitionerOptions.value)
//   await store.dispatch('updateIsLoading',false)
//         return practitionerOptions.value

// })

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
const emit = defineEmits([
  'closeForm',
  'patientData'
]);

const closeNavigationDrawer = () => {

  emit('update:isDrawerOpen', false)
  emit('reset-form')


}
const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const onSubmit = async () => {
  isLoading.value = true
  refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      //   console.log('lastnae',lastName.value);

      emit('addTask', {
        patient_name: patient_name.value,
        activityMessage: title.value + ' - ' + task_type.value,
        activityDueDate: due_date.value,
        activityStatus: activityStatus.value,
        owner: task_owner.value + ' | ' + task_watchers.value,
        title: title.value,
        priority: priority.value,
        task_type: task_type.value,
        due_date: due_date.value,
        task_owner: task_owner.value,
        task_watchers: task_watchers.value,
        access_restriction: access_restriction.value,
        sendEmailtoPatientApplicationForTask: sendEmailtoPatientApplicationForTask.value,
        notes: notes.value,
        patient_id: store.getters.getPatientPorfile.uuid


      })
      isLoading.value = false;
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
        closeNavigationDrawer();
      })
    } else {

      isLoading.value = false;
    }
  })

}
</script>

<template>
  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">

    <AppDrawerHeaderSection title="Add Tasks Orders" @cancel="closeNavigationDrawer" />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>

          <VForm ref="refForm" v-model="isFormValid">
            <VRow>



              <VCol cols="6">
                <AppTextField v-model="patient_name" :rules="[requiredValidator]" label="Name" placeholder="Name" />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="title" :rules="[requiredValidator]" label="Title" placeholder="Title"
                  :items="['Lab Order follow Up']" />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="priority" :rules="[requiredValidator]" label="Priorty" placeholder="Title"
                  :items="['Low', 'High', 'Medium']" />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="task_type" :rules="[requiredValidator]" label="Task Type" placeholder="Task Type"
                  :items="['Document Review', 'Sign a Chart', 'IV Order']" />
              </VCol>
              <VCol cols="6">
                <AppTextField v-model="due_date" type="datetime-local" label="Due Date" placeholder="Due Date" />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="activityStatus" :rules="[requiredValidator]" label="Status" placeholder="Status"
                  :items="['Created', 'In progress', 'Complete']" />
              </VCol>
              <VCol cols="6">
                <!-- <AppSelect
                  v-model="task_owner"
                  :rules="[requiredValidator]"
                  label="Task Owner"
                  placeholder="Task Owner"
                  :items="['Staff','Zeeshan Anjum']"
                /> -->
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="task_owner" :rules="[requiredValidator]" label="Task Owner" placeholder="Task Owner"
                  :items="practitionerOptions" item-title="fullName" item-value="id" />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="task_watchers" :rules="[requiredValidator]" label="Task Watcher"
                  placeholder="Task Watcher" :items="practitionerOptions" item-title="fullName" item-value="id"
                  multiple />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="access_restriction" :rules="[requiredValidator]" label="Access Restriction"
                  placeholder="Access Restriction" :items="['None', 'Creator Or Assignee']" />
              </VCol>
              <VCol cols="12">
                <VCheckbox v-model="sendEmailtoPatientApplicationForTask"
                  label="Send Email To Patient Applicable for tasks" />
              </VCol>
              <VCol cols="12">
                <v-textarea v-model="notes" label="Add New Notes*" :rules="[requiredValidator]" rows="5"
                  placeholder="Add New Notes*" />
              </VCol>
              <VCol cols="12">
                <VBtn @click="onSubmit" class="me-3">
                  Save
                </VBtn>
                <VBtn type="reset" variant="tonal" color="error" class="ml-3" @click="closeNavigationDrawer">
                  Close
                </VBtn>
              </VCol>
            </VRow>
          </VForm>

        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
