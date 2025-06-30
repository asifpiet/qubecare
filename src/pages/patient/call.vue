<script setup>
import Chat from '@/components/Chat.vue';
import '@/lib/livekit/style.css';
import { useCallStore } from '@/stores/callStore';
import { useMessageStore } from '@/stores/messageStore';
import { MEET_APPOINTMENT_URL } from '@/utils/constants';
import { useChatStore } from '@/views/apps/chat/useChatStore';
import { onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
definePage({
  meta: {
    layout: 'blank',
  },
})
const callStore = useCallStore()
const messageStore = useMessageStore()
const store = useChatStore()
const router = useRouter()
const route = useRoute();


const patient_id = route.query.patient_id;
callStore.callOptions.patient.id = patient_id
const appointment_id = route.query.appointment_id;

const url = MEET_APPOINTMENT_URL + appointment_id + '?username=' + route.query.username

callStore.url = url

onMounted(async () => {

  callStore.callOptions.room = appointment_id
  callStore.callOptions.participant = route.query.username

  callStore.callOptions.from = 'patient'
  callStore.status = true
  callStore.showUi = true
  callStore.showMainUi = true
  await setTimeout(() => {
    callStore.teleport = true
    callStore.teleportRef = '#livekitCall'

    callStore.enableCall = true
  }, 3000)


});
onBeforeMount(async () => {
  await messageStore.getUserByAppoimnet(appointment_id)
  console.log(messageStore.getUserAppoimnet)
  await store.getChat(messageStore.getUserAppoimnet.id)
});
onBeforeUnmount(() => {
  callStore.teleport = false
})
onUnmounted(() => {
  callStore.teleportTo = '#innerBody'
});

</script>
<script type="text/javascript">
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
  var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = 'https://embed.tawk.to/6797ddc6825083258e0bb97c/1iikjkk78';
  s1.charset = 'UTF-8';
  s1.setAttribute('crossorigin', '*');
  s0.parentNode.insertBefore(s1, s0);
})();
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
      <VCol cols="12" md="4" class="mb-4 mt-4">
        <Chat :user="{ id: patient_id, appointment_id: appointment_id }" v-if="store.activeChat" />

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
  height: calc(100vh);
}

#livekitCall :deep(>div),
#livekitCall :deep(>div>div),
#livekitCall :deep(>div>div>div),
#livekitCall :deep(>div>div>div>div) {
  height: 100%;
}

/* #livekitCall :deep(.lk-grid-layout-wrapper) {
  display: block;
  position: relative;
} */

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
