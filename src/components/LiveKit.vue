<script setup>
import '@/components/ProviderChat.vue';
import Livekit from '@/lib/livekit/livekit-meet.es';
import '@/lib/livekit/style.css';
import { useCallStore } from '@/stores/callStore';
import { useProviderStore } from '@/stores/providerStore';
import { LIVEKIT_CALL } from '@/utils/constants.js';
import { useRoute, useRouter } from 'vue-router';
const callStore = useCallStore()
const providerStore = useProviderStore()
const router = useRouter()
const route = useRoute();
const isTonalSnackbarVisible = ref(false)
const livekitCall = ref(null)
const isJoin = ref(false)
const isRendered = ref(false)
const isDialogVisible = ref(false)
const dialogData = ref(null)
const responses = ref([]);
const currentPath = route.path;
const props = defineProps({
  isCallComponent: {
    type: Boolean,
    required: true,
  },
})

watch(() => props.isCallComponent, (val) => {
  if (val && !isRendered.value) {
    isRendered.value = true
    renderComponent()
  } else {
    if (!isJoin.value && isRendered.value && !val) {
      isRendered.value = false
    }
  }

  if (!val) {
    Livekit.toggleMinView(true)
  } else {
    Livekit.toggleMinView(false)
  }
})

const showConfirmation = async (data) => {
  console.log('showConfirmation', data)
  try {
    const payload = JSON.parse(data.payload)

    if (payload.message) {
      isDialogVisible.value = true
      dialogData.value = payload.message
      providerStore.ProviderChat.push({
        id: payload.message_id,
        message: payload.message,
      });
    }
  } catch (error) {
    console.error('Invalid JSON payload:', error)
  }
  return "ok"
}

const childRef = ref(null)
const hideConfirmation = async (data) => {
  console.log('deleteMessageData', data)
  try {
    const payload = JSON.parse(data.payload)

    if (payload.message_id) {
      if (childRef.value) {
        childRef.value.removeMessage(payload.message_id);
      }
    }
  } catch (error) {
    console.error('Invalid JSON payload:', error)
  }
  return "ok"
}




const renderComponent = () => {
  nextTick(() => {
    Livekit.initialize(livekitCall.value,
      {
        connectionDetailsEndpoint: BASE_URL + `${LIVEKIT_CALL}`,
        roomName: 'appointment-' + callStore.callOptions.room,
        participantName: callStore.callOptions.from === 'provider' ? 'provider_user_' + callStore.callOptions.participant : callStore.callOptions.participant,
        miniView: false,
        onRoomCreated: (room) => {
          console.log('Room Created', room)
          room.localParticipant.registerRpcMethod("showConfirmation", showConfirmation);
          room.localParticipant.registerRpcMethod("hideConfirmation", hideConfirmation);
        },
        onJoin: () => {
          isJoin.value = true
          callStore.isJoin = true
        },
        onError: () => { },
        onLeave: () => {
          isJoin.value = false
          callStore.isJoin = false
          providerStore.ProviderChat = [];
          onCallEnd()
        },
        onFullScreen: () => {
          console.log('Full Screen', callStore.callOptions.patient)
          router.replace('/provider/call/' + callStore.callOptions.patient.id + '/' + callStore.callOptions.room)
          // router.replace({
          //     path: '/provider/call',
          //     query: {
          //         patient_id: callStore.callOptions.patient.id, // Patient ID from the call store
          //         appointment_id: callStore.callOptions.room, // Appointment ID (or room)
          //         username: callStore.callOptions.participant // Participant username
          //     }
          // });

        }
      })
  })
}

watch(() => props.isCallComponent, () => {
  console.log("Teleport is ", props.isCallComponent);
  Livekit.miniView = !props.isCallComponent;
});
const onCallEnd = () => {
  callStore.enableCall = false
  isRendered.value = false
  isDialogVisible.value = false
  if (callStore.callOptions.from === 'provider')
    router.replace('/provider/patients/dashboard/' + callStore.callOptions.patient.id)
  else
    router.replace('/patient/call-ended')
};
</script>
<template>

  <div id="innerBody" :style="{ display: isJoin && !props.isCallComponent ? 'block' : 'none' }">
    <DraggableParent></DraggableParent>
    <TeleportToPortal to="callPortal" :disabled="!props.isCallComponent" v-if="isRendered">
      <div ref="livekitCall"></div>
    </TeleportToPortal>
  </div>

  <ProviderChat ref="childRef" v-if="isJoin && callStore.callOptions.from === 'provider'" />
  <!-- <VDialog v-model="isDialogVisible" width="500">
   
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />
    
    <VCard>

      <VCardText>
        {{ dialogData }}
      </VCardText>

      <VCardText class="d-flex justify-end">
        <VBtn @click="isDialogVisible = false">
          OK
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog> -->
</template>
<style scoped>
#innerBody {
  position: fixed;
  top: 10px;
  left: 10px;
  width: 200px;
  height: 150px;
  background-color: black;
  z-index: 99999;
}


/* Hide specific elements inside the Livekit component */
::v-deep(.lk-form-control) {
  display: none;
}

::v-deep(.lk-room-container) {
  margin-top: 8px;
}

#innerBody ::v-deep(.full-view-mini) {
  margin-left: 5px;
  background: #1e1e1e;
  border-radius: 9px;
  padding: 6px 10px 3px 10px;
  width: 42px;
  height: 37px;
  margin-right: 2px;
}

#innerBody ::v-deep(.leave-mini) {
  background: red;
  margin-left: 3px;
  border-radius: 9px;
  padding: 6px 10px 3px 10px;
  width: 42px;
  height: 37px;
}

#innerBody ::v-deep([data-lk-source="camera"]) {
  margin-left: 2px;
}

/* #innerBody:hover ::v-deep(.full-view-mini) {
    display: block;
}

#innerBody:hover ::v-deep(.leave-mini) {
    display: block;
} */
#innerBody ::v-deep(.lk-mini-view-controls) {
  position: absolute;
  top: 95px;
  left: 0;
  right: 0;
  display: none;
}

#innerBody:hover ::v-deep(.lk-mini-view-controls) {
  display: block;
}

.lk-video-conference-inner>.lk-mini-view-container:hover::v-deep(.lk-button) {
  display: none;
}
</style>
