<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Calender View',
  },
})
import '@/lib/livekit/style.css';
import loadWidget from '@/pages/provider/widget/loadWidget.vue';
import { useCallStore } from '@/stores/callStore';
import { usePatientStore } from '@/stores/patientStore';
import { useUserStore } from '@/stores/userStore';
import { useWidgetBuilderStore } from '@/stores/widgetBuilderStore';
import { MEET_APPOINTMENT_URL } from '@/utils/constants';
import { useChatStore } from '@/views/apps/chat/useChatStore';
import cart from '@/views/provider/components/cart.vue';
import {
  AppContentLayoutNav
} from '@layouts/enums';
import { useLayoutConfigStore } from '@layouts/stores/config';
import { onBeforeUnmount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const widgtStore = useWidgetBuilderStore()
const store = useChatStore()
const callStore = useCallStore()
const patientStore = usePatientStore()
const configStore = useLayoutConfigStore()
const { currentUser, currentRole, logout } = useAuth()
configStore.isVerticalNavCollapsed = true
configStore.appContentLayoutNav = AppContentLayoutNav.Vertical

const router = useRouter()
const route = useRoute();
const userStore = useUserStore()
const isActionDialogVisible = ref(false)
const selectedPatient = ref(null)
const patient_id = route.params.patient_id;
const appointment_id = route.params.appointment_id;
const name = ref(null);
const livekitCall = ref(null)
const callRef = ref(null)
const url = MEET_APPOINTMENT_URL + appointment_id + '?username=' + currentUser.value.fullName

callStore.url = url

//await patientStore.loadPatient(patient_id)
await patientStore.getAppointmentOrder(appointment_id)

selectedPatient.value = patientStore.patient;
const type = 'patient'
const page_name = 'patient_call'
await widgtStore.getPage(type, page_name)
const page = await widgtStore.pageData.id
console.log('widgtStore.pageData', widgtStore.pageData)
//selectedPatient.value.id = patient_id
console.log("selectedPatient", selectedPatient.value);
const currentTab = ref(0)

onBeforeMount(async () => {
  // window.addEventListener('message', (event) => {
  //   console.log('event', event)
  //   if (event.data.type === 'callEnd') {
  //     onCallEnd();
  //   }
  // });

  await store.getChat(patient_id)
});
onMounted(async () => {
  if (patient_id) {


    await patientStore.loadPatient(patient_id);
    await patientStore.getLastRecentAppointment(patient_id);
    await userStore.getUserByID(patientStore.demographic.primaryPractitioner)

    name.value = userStore.user?.firstName + ' ' + userStore.user?.lastName;
    let appId = patientStore.lastRecentAppointments?.next_upcoming_appointment?.id;


    patientStore.dataWidget = {
      patient_id: patient_id, // Use .value to access the ref's value
      practitioner: name.value,
      id: appId,
    }
    console.log('sd', patientStore.dataWidget);

  }

  callStore.callOptions.room = appointment_id
  callStore.callOptions.participant = currentUser.value.fullName
  callStore.callOptions.patient = patientStore.patient
  callStore.callOptions.from = 'provider'
  callStore.status = true
  callStore.showUi = true
  callStore.showMainUi = true
  await setTimeout(() => {
    callStore.teleport = true
    callStore.teleportRef = '#livekitCall'

    callStore.enableCall = true
  }, 3000)
  // Livekit.initialize(livekitCall.value,
  //   {
  //     connectionDetailsEndpoint: "https://meet.codelfi.com/api/connection-details",
  //     roomName: appointment_id,
  //     participantName: route.query.username,
  //     // onError: () => void;
  //     onLeave: () => {
  //       onCallEnd()
  //     }
  //   }
  // )
  // callStore.teleportTo = 'callRef'
});
onBeforeUnmount(async () => {
  // callStore.teleportTo = '#body-portal'
  // callStore.teleportRef = 'body'
  callStore.teleport = false

})
onUnmounted(() => {
  callStore.teleportTo = '#innerBody'
  configStore.isVerticalNavCollapsed = false
  configStore.appContentLayoutNav = AppContentLayoutNav.Vertical
});

</script>

<template>
  <section>
    <VRow>
      <VCol cols="12" md="8">
        <!-- <OpenPortal name="callRef"></OpenPortal> -->
        <div class="iframe-container" id="livekitCall">
          <!-- <iframe :src="url" frameborder="0" allow="camera; microphone; fullscreen" class="responsive-iframe"></iframe> -->
          <OpenPortal name="callPortal"></OpenPortal>
        </div>
        <VCard class="mt-2" v-if="$can('read', 'Order View')">
          <cart :hideTotals="true"></cart>
        </VCard>
      </VCol>

      <VCol cols="12" md="4" style="padding: 0px;">

        <loadWidget :page="page" :page_name="page_name" :type="type" :patientId="Number(patient_id)" />








      </VCol>
    </VRow>



  </section>
</template>
<style scoped>
.iframe-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #282828;
}

.responsive-iframe {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

#livekitCall {
  height: calc(100vh - 150px);
}

#livekitCall :deep(>div),
#livekitCall :deep(>div>div),
#livekitCall :deep(>div>div>div),
#livekitCall :deep(>div>div>div>div) {
  height: 100%;
}

#livekitCall :deep(.lk-focus-layout) {
  display: block;
  position: relative;
}

#livekitCall :deep(aside) {
  position: absolute;
  /* top: 10px;
  left: 10px; */
  z-index: 9;
  width: 100%;
}

#livekitCall :deep(.lk-focus-layout>div) {
  height: 100%;
}


#livekitCall :deep(.lk-video-conference-inner) {
  display: block;
  position: relative;
}

#livekitCall :deep(.lk-grid-layout-wrapper) {
  height: 100%;
}

#livekitCall :deep(.lk-control-bar) {
  width: 100%;
  position: absolute;
  z-index: 999;
  bottom: 15px;
  margin: auto;
  border: none;
  background: none;
}

#livekitCall :deep(.lk-disconnect-button) {
  background: red;
  color: white;
}

/* #livekitCall>::v-deep(div)>::v-deep(div) {
  height: 100%
}

#livekitCall>::v-deep(div)>::v-deep(div)>::v-deep(div) {
  height: 100%
} */
</style>
