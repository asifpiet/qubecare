<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Patient Dashboard View',
  },
})
import loadWidget from '@/pages/provider/widget/loadWidget.vue';
import { usePatientStore } from '@/stores/patientStore';
import { useUserStore } from '@/stores/userStore';
import { useWidgetBuilderStore } from '@/stores/widgetBuilderStore';
const route = useRoute('apps-provider-patient-dashboard-widget-id')
const widgtStore = useWidgetBuilderStore()
const patientStore = usePatientStore()
//patientStore.unloadPatient()

const userStore = useUserStore()
const patientId = route.params.id;

const type = 'patient'
const page_name = 'dashboard'
await widgtStore.getPage(type, page_name)
const page = await widgtStore.pageData.id
console.log('widgtStore.pageData', widgtStore.pageData)
console.log(patientId)
const name = ref(null);
const data = ref({});
const isLoading = ref(null)
const tabs = [
    {
        icon: 'tabler-lock',
        title: 'All Meds/Supplements',
        action: 'read',
        subject: 'All Meds/Supplements View',
    },
    {
        icon: 'tabler-users',
        title: 'Health Maintenance',
        action: 'read',
        subject: 'Health And Maintenance View',

    },
    {
        icon: 'tabler-bell',
        title: 'Clinical Profile',
        action: 'read',
        subject: 'General',

    },
    {
        icon: 'tabler-users',
        title: 'Tasks/Orders',
        action: 'read',
        subject: 'Tasks View',
    }
]

onMounted(async () => {
  if (patientId) {


    await patientStore.loadPatient(patientId);
    await patientStore.getLastRecentAppointment(patientId);
    await userStore.getUserByID(patientStore.demographic.primaryPractitioner)

    name.value = userStore.user?.firstName + ' ' + userStore.user?.lastName;
    let appId = patientStore.lastRecentAppointments?.next_upcoming_appointment?.id;

    console.log('sd', name.value, appId);
    patientStore.dataWidget = {
      patient_id: patientId, // Use .value to access the ref's value
      practitioner: name.value,
      id: appId,
    }


  }
})




</script>

<template>


  <loadWidget :page="page" :page_name="page_name" :type="type" :patientId="Number(patientId)" />
</template>
