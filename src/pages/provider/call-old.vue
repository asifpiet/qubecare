<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Calender View',
  },
})
import '@/lib/livekit/style.css';
import { useCallStore } from '@/stores/callStore';
import { usePatientStore } from '@/stores/patientStore';
import { MEET_APPOINTMENT_URL } from '@/utils/constants';
import UserBioPanel from '@/views/provider/patients/UserBioPanel.vue';
import actions from '@/views/provider/patients/actions.vue';
import {
  AppContentLayoutNav
} from '@layouts/enums';
import { useLayoutConfigStore } from '@layouts/stores/config';
import { onBeforeUnmount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const callStore = useCallStore()
const patientStore = usePatientStore()
const configStore = useLayoutConfigStore()
configStore.isVerticalNavCollapsed = true
configStore.appContentLayoutNav = AppContentLayoutNav.Vertical

const router = useRouter()
const route = useRoute();

const isActionDialogVisible = ref(false)
const selectedPatient = ref(null)
const patient_id = route.query.patient_id;
const appointment_id = route.query.appointment_id;

const livekitCall = ref(null)
const callRef = ref(null)
const url = MEET_APPOINTMENT_URL + appointment_id + '?username=' + route.query.username

callStore.url = url
await patientStore.loadPatient(patient_id)
selectedPatient.value = patientStore.patient;
//selectedPatient.value.id = patient_id
console.log("selectedPatient", selectedPatient.value);

onBeforeMount(async () => {
  // window.addEventListener('message', (event) => {
  //   console.log('event', event)
  //   if (event.data.type === 'callEnd') {
  //     onCallEnd();
  //   }
  // });
});
onMounted(async () => {
  callStore.callOptions.room = appointment_id
  callStore.callOptions.participant = route.query.username
  callStore.callOptions.patient = selectedPatient.value
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
onBeforeUnmount(() => {
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
      </VCol>
      <VCol cols="12" md="4">
        <div class="mb-4">
          <UserBioPanel :patient="selectedPatient" />
        </div>
        <VCard>
          <actions :patient="selectedPatient" :showGrid="true" />
        </VCard>

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
  z-index: 9999;
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
