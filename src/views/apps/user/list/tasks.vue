<script setup>
import AddTask from '@/views/apps/user/tasks/addtask.vue';
import ViewTask from '@/views/apps/user/tasks/viewtask.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
const store = useStore()
const textTemplate = ref();
const isLoading = ref(false)
const isFormValid = ref(false)
const searchQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const isTonalSnackbarVisible = ref(false)
const isTextMessageDialogVisible = ref(false)
const istaskDialogVisible = ref(false)
const isViewtaskDialogVisible = ref(false)
const filtertask = ref(null)
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const selectedRows = ref([])
const refForm = ref()
const message = ref();
const isDisable = ref(true);
const currentTab = ref('0')
const fullName = ref();
const filterData = ref();
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isDataEnable:{
    type: Boolean,
  }
})
const fullname =  computed(() => {
    fullName.value = store.getters.getPatientPorfile.firstName+' '+store.getters.getPatientPorfile.lastName;
    
     console.log("fullname",fullName.value);
})

const updateOptions = options => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}
const headers = [
  {
    title: 'Activity Message',
    key: 'activityMessage',
  },
  {
    title: 'Activity Due Date',
    key: 'activityDueDate',
  },
  {
    title: 'Activity Status',
    key: 'activityStatus',
  },
  {
    title: 'Owner',
    key: 'owner',
  },
]


const {
  data: usersData,
  execute: fetchUsers,
} = await useApi(createUrl(PATIENT_TASK_API, {
  query: {
    q: searchQuery,
    status: selectedStatus,
    plan: selectedPlan,
    role: selectedRole,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))


const users = computed(() => {
    console.log("sdasAsdif", usersData.value.tasks);
  return usersData.value.tasks;
})
const totalUsers = computed(() => usersData.value.tasks.length)


// const users = computed(() => {
//     let id = store.getters.getPatientPorfile.patientId;
//     if(id){
//         filterData.value = usersData.value.patientTasks.filter(row => row.id === id)
//         return filterData.value[0].tasks;
//         // return [];
//     }else{
//         return [];
//     }   
// })
// const totalUsers = computed(() => usersData.value.totalUsers)

// const totalUsers = computed(() => {
//   return filterData.value && filterData.value[0]
//     ? filterData.value[0].tasks.length
//     : 0;
// });


const emit = defineEmits([
  'closeForm',
  'patientData'
]);

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)  
}
const updateNewUser = async userData => {
    isLoading.value = false;
  console.log("updateNewUser",userData);
 
  const res = await $api('/api'+PATIENT_API+'/'+userData.id, {
    method: 'PUT',
    body: userData,
  });
  istaskDialogVisible.value= false;
  isTonalSnackbarVisible.value = true;
  isLoading.value = false;
  console.log("res",res);
  fetchUsers()
}
const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}
const onSubmit = async() => {
  isLoading.value = true
  refForm.value?.validate().then(async({ valid }) => {
    if (valid) {
        emit('patientData', {
        id: store.getters.getPatientPorfile.patientId,
        textTemplate: textTemplate.value,
        message: message.value,
      })
      
        isTonalSnackbarVisible.value = true;
        isLoading.value = false;
        nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
        emit('update:isDrawerOpen', false) 
        })
    }else{
      isLoading.value = false;
    }
  })
  
}
const  calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Check if the birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

const showDetail = async(tid) => {
  isViewtaskDialogVisible.value = true;
  let pid = store.getters.getPatientPorfile.patientId;
  
    const res = await $api('/api'+PATIENT_API+'/'+pid, {
    method: 'GET',
    });
    console.log("viewTask",res.tasks);
    filtertask.value = res.tasks.filter(row => row.id === tid)
    console.log("filterTask",filtertask.value)
 }
</script>

<template>
    <div v-if="fullname"></div>
    
    <VDialog v-model="isLoading" width="110" height="150" color="primary">
        <VCardText class="" style="color: white !important;">
          <div class="demo-space-x">
            <VProgressCircular :size="40" color="primary" indeterminate />
          </div>
        </VCardText>
      </VDialog>
      <VSnackbar
      v-model="isTonalSnackbarVisible"
      location="top end"
      variant="flat"
      color="success"
    >
      Task created.
    </VSnackbar>
    
    <VNavigationDrawer
    temporary
    :width="800"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
   
  >
 
    <AppDrawerHeaderSection
      :title='"Tasks ("+fullName+")"' 
      @cancel="closeNavigationDrawer"
    />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText class="pt-6">
                        <VRow class="">
                            <VCol cols="6" md="3">
                                <div class="d-flex align-center gap-4">
                                    <VAvatar
                                        color="info"
                                        variant="tonal"
                                        size="42"
                                    >
                                        <VIcon icon="tabler-user" />
                                    </VAvatar>

                                    <div class="d-flex flex-column">
                                        <span
                                            class="text-h5 font-weight-medium"
                                            > {{ fullName}}</span
                                        >
                                        <span class="text-sm"> Patient Name </span>
                                    </div>
                                </div>
                            </VCol>
                            <VCol cols="6" md="3">
                                <div class="d-flex align-center gap-4">
                                    <VAvatar
                                        color="primary"
                                        variant="tonal"
                                        size="42"
                                    >
                                        <VIcon icon="tabler-calendar" />
                                    </VAvatar>

                                    <div class="d-flex flex-column">
                                        <span
                                            class="text-h5 font-weight-medium"
                                            >{{ store.getters.getPatientPorfile.dateOfBirth }}</span
                                        >
                                        <span class="text-sm"> Date of Birth </span>
                                    </div>
                                </div>
                            </VCol>
                            <VCol cols="6" md="3">
                                <div class="d-flex align-center gap-4">
                                    <VAvatar
                                        color="error"
                                        variant="tonal"
                                        size="42"
                                    >
                                        <VIcon icon="tabler-user" />
                                    </VAvatar>

                                    <div class="d-flex flex-column">
                                        <span
                                            class="text-h5 font-weight-medium"
                                            >{{ store.getters.getPatientPorfile.genderIdentity }}</span
                                        >
                                        <span class="text-sm"> Gender </span>
                                    </div>
                                    
                                </div>
                            </VCol>
                            <VCol cols="6" md="3">
                                <div class="d-flex align-center gap-4">
                                    <VAvatar
                                        color="error"
                                        variant="tonal"
                                        size="42"
                                    >
                                        <VIcon icon="tabler-user" />
                                    </VAvatar>

                                    <div class="d-flex flex-column">
                                        <span
                                            class="text-h5 font-weight-medium"
                                            >{{ calculateAge(store.getters.getPatientPorfile.dateOfBirth) }}</span
                                        >
                                        <span class="text-sm"> Age </span>
                                    </div>
                                    
                                </div>
                            </VCol>
                            <VCol cols="6" md="3">
                                <div class="d-flex align-center gap-4">
                                    <VAvatar
                                        color="success"
                                        variant="tonal"
                                        size="42"
                                    >
                                        <VIcon icon="tabler-currency-dollar" />
                                    </VAvatar>

                                    <div class="d-flex flex-column">
                                        <span
                                            class="text-h5 font-weight-medium"
                                            >2</span
                                        >
                                        <span class="text-sm">
                                            Copay $
                                        </span>
                                    </div>
                                </div>
                            </VCol>
                            <VCol cols="6" md="3">
                                <div class="d-flex align-center gap-4">
                                    <VAvatar
                                        color="info"
                                        variant="tonal"
                                        size="42"
                                    >
                                        <VIcon icon="tabler-currency-dollar" />
                                    </VAvatar>

                                    <div class="d-flex flex-column">
                                        <span
                                            class="text-h5 font-weight-medium"
                                            >{{ store.getters.getPatientPorfile.insuranceDeductible}}</span
                                        >
                                        <span class="text-sm"> Deductible $ </span>
                                    </div>
                                </div>
                            </VCol>
                            <VCol cols="6" md="3">
                                <div class="d-flex align-center gap-4">
                                    <VAvatar
                                        color="primary"
                                        variant="tonal"
                                        size="42"
                                    >
                                        <VIcon icon="tabler-chart-pie-2" />
                                    </VAvatar>

                                    <div class="d-flex flex-column">
                                        <span
                                            class="text-h5 font-weight-medium"
                                            >{{ store.getters.getPatientPorfile.coInsurance}}</span
                                        >
                                        <span class="text-sm"> Co-Ins %</span>
                                    </div>
                                </div>
                            </VCol>
                            <VCol cols="6" md="3">
                                <div class="d-flex align-center gap-4">
                                    <VAvatar
                                        color="error"
                                        variant="tonal"
                                        size="42"
                                    >
                                        <VIcon icon="tabler-currency-dollar" />
                                    </VAvatar>

                                    <div class="d-flex flex-column">
                                        <span
                                            class="text-h5 font-weight-medium"
                                            >{{ store.getters.getPatientPorfile.insurance}}</span
                                        >
                                        <span class="text-sm"> Insurance </span>
                                    </div>
                                </div>
                            </VCol>
                        </VRow>
                    </VCardText>
        <VCardText class="d-flex flex-wrap gap-4">
         
       
          <VDivider/>
        <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
            <div class="me-3 d-flex gap-3">
          <AppSelect
            :model-value="itemsPerPage"
            :items="[
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: -1, title: 'All' },
            ]"
            style="inline-size: 6.25rem;"
            @update:model-value="itemsPerPage = parseInt($event, 10)"
          />
        </div>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        <VSpacer/>
        
          <div style="inline-size: 15.625rem;">
            <AppTextField
              v-model="searchQuery"
              placeholder="Search User"
            />
          </div>
          
            <!-- <VBtn  prepend-icon="tabler-plus"> New Template</VBtn> -->
            <VBtn
                prepend-icon="tabler-plus"
                @click="istaskDialogVisible=true"  class=""
            >
                New Task
            </VBtn>
        </div>
            <VDivider />
            <VDataTableServer
                v-model:items-per-page="itemsPerPage"
                v-model:model-value="selectedRows"
                v-model:page="page"
                :items="users"
                item-value="id"
                :items-length="totalUsers"
                :headers="headers"
                class="text-no-wrap"
                @update:options="updateOptions"
            >
        
            <template #item.activityMessage="{ item }">
                <div class="d-flex align-center gap-x-4">
                    <span @click="showDetail(item.id)" class="cursor-pointer text-primary"style="text-decoration: underline;">{{ item.activityMessage }} </span>
                  </div>
            </template>

        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalUsers"
          />
        </template>
        </VDataTableServer>
                   
         </VCardText>
      </VCard>
      <VDialog
          v-model="istaskDialogVisible"
          width="600"
        >
        <DialogCloseBtn @click="istaskDialogVisible = false" />
        <VCard title="Create New Task">
        <VCardText>
            <AddTask  @addTask="updateNewUser"/>
          </VCardText>
        </VCard> 
      </VDialog>
      <VDialog
          v-model="isViewtaskDialogVisible"
          width="600"
        >
        <DialogCloseBtn @click="isViewtaskDialogVisible = false" />
        <VCard title="Task information">
        <VCardText>
            <ViewTask  :viewTaskData="filtertask"/>
          </VCardText>
        </VCard> 
      </VDialog>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
