<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Patient View',
  },
})
import { usePatientStore } from '@/stores/patientStore';
import { ref } from 'vue';
const props = defineProps({
  patient: {
    type: Object,
    required: false
  },
  patientId: {
    type: Number,
    required: false
  },
})

const patientStore = usePatientStore()
const selectedData = ref(null)
const recording_url = 'https://o8g5.or4.idrivee2-67.com/qubecare/recording_appointment-155.mp4?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=nFXRKkoLNshvWw9J4R9p%2F20250527%2FOregon%2Fs3%2Faws4_request&X-Amz-Date=20250527T165709Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=bc1b58ae5f75d2ba96e5d905745aacab1edf38740aeddda024af5e1a2ae45a82'
const isActionDialogVisible = ref(false)
const isActionTrancrptionDialogVisible = ref(false)
const isActionRecordingDialogVisible = ref(false)
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);
const headers = [
  {
    title: 'Appointment ID',
    key: 'id',
  },
  {
    title: 'Practitioner',
    key: 'practitioner',
  },
  {
    title: 'Appointment Date',
    key: 'date',
  },
  {
    title: 'Status',
    key: 'transcription_status',
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    searchable: false
  },
]


const reload = () => dataTable.value.reload()
const isAudioFile = (url) => {
  if (!url) return false;
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a'];
  return audioExtensions.some(ext => url.toLowerCase().endsWith(ext));
}
const isVideoFile = (url) => {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
  return true //videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
}
watch(() => patientStore.isDrawerOpen, (val) => {
  if (!val) {
    reload()
  }
})
</script>

<template>
  <section>

    <DataTable ref="dataTable" cardTitle="Transcription" btnTitle="" :headers="headers"
      :api="GET_TRANSCRPTION_LIST + '/' + props.patientId" :sortBy="sortByData"
      @onBtnClick="[isActionDialogVisible = true, selectedData = null]">




      <template #item.date="{ item }">
        <div class="d-flex align-center gap-x-4">
          <span>{{ dateTimeFormat(`${item.date} ${item.start_time}`, "MM-DD-YYYY hh:mm A") }}</span>
        </div>
        <!-- {{ dateFormat(item.date) }} -->


      </template>

      <template #item.actions="{ item }">
        <div class="d-flex gap-2">
          <!-- Soap Notes Button -->
          <VBtn color="primary" variant="tonal" size="small"
            @click="[isActionDialogVisible = true, selectedData = item]" prepend-icon="tabler-notes"
            class="flex-grow-1">
            Soap Notes
          </VBtn>

          <!-- Transcription Button -->
          <VBtn color="secondary" variant="tonal" size="small"
            @click="[isActionTrancrptionDialogVisible = true, selectedData = item]" prepend-icon="tabler-microphone"
            class="flex-grow-1">
            Transcription
          </VBtn>
          <VBtn color="error" variant="tonal" size="small"
            @click="[isActionRecordingDialogVisible = true, selectedData = item]" prepend-icon="tabler-radio"
            class="flex-grow-1">
            Recording
          </VBtn>
        </div>
      </template>
    </DataTable>
    <VDialog v-model="isActionDialogVisible" max-width="800">
      <DialogCloseBtn @click="isActionDialogVisible = false" />
      <VCard title="Soap Notes">

        <VCardText>
          <div v-if="selectedData.transcription.notes.length > 0" class="soap-notes-container">
            <div v-for="(note, index) in selectedData.transcription.notes" :key="index" class="soap-note-card">
              <h3 class="soap-note-title">SOAP Note #{{ note.id }}</h3>
              <div class="soap-note-section">
                <h4>Subjective:</h4>
                <p>{{ note.subjective || "N/A" }}</p>
              </div>
              <div class="soap-note-section">
                <h4>Objective:</h4>
                <p>{{ note.objective || "N/A" }}</p>
              </div>
              <div class="soap-note-section">
                <h4>Assessment:</h4>
                <p>{{ note.assessment || "N/A" }}</p>
              </div>
              <div class="soap-note-section">
                <h4>Plan:</h4>
                <p>{{ note.plan || "N/A" }}</p>
              </div>

            </div>
          </div>
          <div v-else class="no-notes-message">
            <p>No SOAP notes available.</p>
          </div>
        </VCardText>
      </VCard>
    </VDialog>
    <VDialog v-model="isActionTrancrptionDialogVisible" max-width="800">
      <DialogCloseBtn @click="isActionTrancrptionDialogVisible = false" />
      <VCard title="Transcription">

        <VCardText>
          <div v-if="selectedData.transcription.summary" class="soap-notes-container">
            <div class="soap-note-card">

              <div class="soap-note-section">
                <h4>Summary:</h4>
                <p>{{ selectedData.transcription.summary || "N/A" }}</p>

              </div>
              <div class="soap-note-section">
                <h4>Text:</h4>
                <p>{{ selectedData.transcription.text || "N/A" }}</p>
              </div>


            </div>
          </div>
          <div v-else class="no-notes-message">
            <p>No Transcription available.</p>
          </div>
        </VCardText>
      </VCard>
    </VDialog>
    <VDialog v-model="isActionRecordingDialogVisible" max-width="800">
      <DialogCloseBtn @click="isActionRecordingDialogVisible = false" />
      <VCard title="Transcription">

        <VCardText>
          <div v-if="selectedData.recording_url" class="soap-notes-container">
            <div class="soap-note-car">

              <audio controls class="mb-4" v-if="isAudioFile(selectedData.recording_url)">
                <source :src="selectedData.recording_url" type="audio/mpeg">
                Your browser does not support the audio element.
              </audio>

              <!-- Video Player (if video recording) -->

              <video controls class="mb-4" v-else-if="isVideoFile(selectedData.recording_url)"
                style="width: 100%; max-width: 100%;">
                <source :src="selectedData.recording_url" type="video/mp4">
                Your browser does not support the video element.
              </video>


            </div>
          </div>
          <div v-else class="no-notes-message">
            <p>No Recording available.</p>
          </div>
        </VCardText>
      </VCard>
    </VDialog>
  </section>
</template>
<style scoped>
.soap-notes-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.soap-note-card {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.soap-note-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
}

.soap-note-section {
  margin-bottom: 12px;
}

.soap-note-section h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #555;
}

.soap-note-section p {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.no-notes-message {
  text-align: center;
  font-size: 1rem;
  color: #888;
  padding: 20px;
}
</style>
