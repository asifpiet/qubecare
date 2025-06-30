<script setup>
import AddEmail from '@/views/apps/patient/textMessage/AddEmail.vue';

import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
const store = useStore()
const isTonalSnackbarVisible = ref(false)
const isTextMessageDialogVisible = ref(false)
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const subjectMessageList = ref()
const isDialogOpenSubjectList = ref(false)
const refVForm = ref();
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isDataEnable: {
    type: Boolean,
  }
})
const dataTable = ref(null);
const headers = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'Date',
    key: 'date',
  },

  {
    title: 'Provider',
    key: 'practitioner_name',
  },
  {
    title: 'Subject',
    key: 'subject',
  },


]

onMounted(async () => {
  dataTable.value.reload()
})

const emit = defineEmits([
  'closeForm',
  'patientData',
]);

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
}



const handleDrawerModelValueUpdate = val => {

  emit('update:isDrawerOpen', val)

}



const handleUserSubmit = async (msg) => {
  if (msg == 'cancel') {
    isTextMessageDialogVisible.value = false;
  }
  if (msg == 'success') {
    isTextMessageDialogVisible.value = false;
    console.log('start')
    let patientId = props.patient.id
    dataTable.value.reload()
    setTimeout(() => {
      isTonalSnackbarVisible.value = false;
    }, 3000);
  }
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString(); // Adjust format as needed  
};
</script>

<template>
  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">

    <AppDrawerHeaderSection :title='"Email   (" + props.patient.demographic.fullName + ")"'
      @cancel="closeNavigationDrawer" />

    <PerfectScrollbar :options="{ wheelPropagation: false }">

      <VCardText>
        <DataTable ref="dataTable" cardTitle="" btnTitle="Email Add" :headers="headers"
          :api="GET_EMAIL_LIST + '/' + props.patient.id" :sortBy="sortByData"
          @onBtnClick="isTextMessageDialogVisible = true">
          <template #item.date="{ item }">
            <div class="">
              {{ dateFormat(item.date) }}
            </div>
          </template>

          <template #item.subject="{ item }">
            <!-- <VBtn>
              {{ item.subject }}
            </VBtn> -->
          </template>
        </DataTable>

      </VCardText>
      <VDialog v-model="isTextMessageDialogVisible" width="800">
        <DialogCloseBtn @click="isTextMessageDialogVisible = false" />
        <VCard title="Email">
          <VCardText>
            <AddEmail @submit="handleUserSubmit" :email-data="props.patient.email" v-if="$can('read', 'Email Add')"
              :patient="props.patient" />
          </VCardText>
        </VCard>
      </VDialog>
      <VDialog v-model="isDialogOpenSubjectList" width="800">
        <DialogCloseBtn @click="isDialogOpenSubjectList = false" />
        <VCard title="Email">
          <VCardText>

            <VForm class="mt-2" ref="refVForm">
              <VRow>

                <VCol cols="12" v-for="(message, index) in subjectMessageList.messages" :key="index">
                  <VAlert color="info" class="message-alert">
                    <div class="message-content">
                      {{ message.text }}
                    </div>

                  </VAlert>
                  <div class="message-details">
                    <span class="message-timestamp">{{ formatDate(message.date) }}</span> -
                    <span class="message-by">{{ message.message_by }}</span>
                  </div>
                </VCol>
              </VRow>
            </VForm>


          </VCardText>
        </VCard>
      </VDialog>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
<style scoped>
.message-alert {
  margin-bottom: 8px;
  /* Add some space below the alert */
}

.message-details {
  font-size: 0.875rem;
  /* Smaller font size for details */
  color: rgba(0, 0, 0, 0.54);
  /* Light color for details */
  float: right;
}

.message-timestamp {
  margin-right: 4px;
  /* Space between date and sender */
}
</style>
