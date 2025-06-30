<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Inventory Edit',
  },
})
import HealthAndMaintance from '@/views/apps/patient/HealthAndMaintance/HealthAndMaintance.vue';
import TasksOrders from '@/views/apps/patient/tasksOrders/TasksOrders.vue';
import UserBioPanel from '@/views/apps/patient/view/UserBioPanel.vue';
// import UserTabAccount from '@/views/apps/user/view/UserTabAccount.vue';
import PatientHistory from '@/views/apps/patient/PatientHistory/PatientHistory.vue';
import PatientTimeLine from '@/views/apps/patient/patientTimeLine/patientTimeLine.vue';
import UserTabBillingsPlans from '@/views/apps/patient/view/UserTabBillingsPlans.vue';
import UserTabConnections from '@/views/apps/patient/view/UserTabConnections.vue';
import UserTabNotifications from '@/views/apps/patient/view/UserTabNotifications.vue';
import UserTabSecurity from '@/views/apps/patient/view/UserTabSecurity.vue';
import { useStore } from 'vuex';
const currentTab = ref('item-1')
const tabItemContent = 'Candy canes donut chupa chups candy canes lemon drops oat cake wafer. Cotton candy candy canes marzipan carrot cake. Sesame snaps lemon drops candy marzipan donut brownie tootsie roll. Icing croissant bonbon biscuit gummi bears. Pudding candy canes sugar plum cookie chocolate cake powder croissant.'

// 
const store = useStore()
// const userData = ref(null);
const route = useRoute('apps-user-view-id')
const userTab = ref(null)
const isLoading = ref(null)
const isTonalSnackbarVisible = ref(null)
const tabs = [
  {
    icon: 'tabler-users',
    title: 'Health Maintenance',
  },
  {
    icon: 'tabler-users',
    title: 'Tasks/Orders',
  },
  {
    icon: 'tabler-lock',
    title: 'All Meds/Supplements',
  },
  {
    icon: 'tabler-bookmark',
    title: 'Tasks/Orders',
  },
  {
    icon: 'tabler-bell',
    title: 'Clinical Profile',
  },
  {
    icon: 'tabler-link',
    title: 'Lab Results',
  },
]
const updatePatient = async patientData => {
  isLoading.value = true;
  console.log("updateNewUser", patientData);
  let id = store.getters.getPatientPorfile.patientId;
  const res = await $api('/api/apps/users/' + id, {
    method: 'PUT',
    body: patientData,
  });
  console.log("res", res);
  userData.value = await $api('/api/apps/users/' + id, {
    method: 'GET',
  });

  isLoading.value = false;
  isTonalSnackbarVisible.value = true;
}


const { data: userData } = await useApi(`/apps/users/${route.params.id}`)
const datasave = computed(async () => {
  isLoading.value = true
  let res = userData.value;
  console.log('udste', res);
  await store.dispatch('editPatientProfile', {
    res
  })
  isLoading.value = false
})

</script>

<template>
  <div v-if="datasave"></div>
  <VDialog v-model="isLoading" width="110" height="150" color="primary">
    <VCardText class="" style="color: white !important;">
      <div class="demo-space-x">
        <VProgressCircular :size="40" color="primary" indeterminate />
      </div>
    </VCardText>
  </VDialog>
  <VSnackbar v-model="isTonalSnackbarVisible" location="top end" variant="flat" color="success">
    Patient Profile updated.
  </VSnackbar>
  <VRow v-if="userData">
    <VCol cols="12" md="5" lg="4">
      <UserBioPanel :user-data="userData" @patientData="updatePatient" />
    </VCol>

    <VCol cols="12" md="7" lg="8">
      <VTabs v-model="userTab" class="v-tabs-pill">
        <VTab v-for="tab in tabs" :key="tab.icon">
          <VIcon :size="18" :icon="tab.icon" class="me-1" />
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>

      <VWindow v-model="userTab" class="mt-6 disable-tab-transition" :touch="false">
        <VWindowItem>
          <HealthAndMaintance />
          <!-- <UserTabAccount />   -->
        </VWindowItem>

        <VWindowItem>
          <TasksOrders />
          <!-- <UserTabAccount />   -->
        </VWindowItem>

        <VWindowItem>
          <UserTabSecurity />
        </VWindowItem>

        <VWindowItem>
          <UserTabBillingsPlans />
        </VWindowItem>

        <VWindowItem>
          <UserTabNotifications />
        </VWindowItem>

        <VWindowItem>
          <UserTabConnections />
        </VWindowItem>
      </VWindow>
      <VTabs v-model="currentTab" class="v-tabs-pill">
        <VTab>Patient History</VTab>
        <VTab>Patient TimeLine</VTab>

      </VTabs>



      <VWindow v-model="currentTab">
        <VWindowItem key="0">
          <PatientHistory class="pt-3" />
        </VWindowItem>
        <VWindowItem key="1">
          <PatientTimeLine class="pt-3" />
        </VWindowItem>
      </VWindow>


    </VCol>

  </VRow>
  <div v-else>
    <VAlert type="error" variant="tonal">
      Invoice with ID {{ route.params.id }} not found!
    </VAlert>
  </div>



</template>
