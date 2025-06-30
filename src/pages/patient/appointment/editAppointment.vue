<script setup>
import { dateFormat, dateFormate } from '@/plugins/globalFunctions';
import { usePatientStore } from '@/stores/patientStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import moment from 'moment-timezone';
import { useStore } from 'vuex';
const { currentUser, currentRole, logout } = useAuth()
const patientStore = usePatientStore()
const patientId = currentUser.value.id;
const props = defineProps({
  appointmentData: {
    type: Object,
    required: true,
  }
});
const practitionerStore = usePractitionerStore()

const store = useStore()
const timezoneMap = {
  'America/New_York': 'EST',
  'America/Los_Angeles': 'PST',
  'America/Chicago': 'CST',
  'America/Denver': 'MST',
  'UTC': 'UTC',
};


const userTimeZone = currentUser?.value?.time_zone;
const selectTimeZone = timezoneMap[userTimeZone] || 'UTC';

const emit = defineEmits([
  'update:isDrawerOpen',
  'closeForm',
  'patientData',
  'customEvent',
  'closePop'
])
const appointmentForm = ref();
const start_time = ref();
const notes = ref();
const date = ref();
const providerSlots = ref([])
const providerAvailbleDates = ref([])
const allowedDates = ref([]);
const appt_id = ref();
const availableDates = ref([]);
const fetchSlot = async () => {
  // const selectTimeZone = currentUser.value.time_zone ? timezoneMap[currentUser.value.time_zone] : 'UTC';
  showLoader()
  appt_id.value = props.appointmentData.id;
  // console.log("selectTimeZone",selectTimeZone);
  if (selectTimeZone) {
    // console.log("selectTimeZone",selectTimeZone.value);
    const currentDate = new Date()
    const month = currentDate.getMonth() + 1
    await practitionerStore.getSlots({ month: month, timezone: selectTimeZone }, props.appointmentData.practitioner_id)
    providerAvailbleDates.value = practitionerStore.slots
    allowedDates.value = Object.keys(providerAvailbleDates.value);
    availableDates.value = allowedDates.value.map(date => dateFormat(date));
    // console.log('allowDate', allowedDates.value, props.appointmentData.start_time);
    notes.value = props.appointmentData.notes;
    let data;
    if (date.value) {
      const dateIndex = allowedDates.value.indexOf(dateFormate(date.value));
      data = providerAvailbleDates.value[allowedDates.value[dateIndex]];
    } else {
      data = providerAvailbleDates.value[allowedDates.value[0]];
      date.value = availableDates.value[0];
    }
    if (data) {
      start_time.value = '';
      let formatedTime = []
      for (let timeData of data) {
        const time = moment(timeData.formatted_datetime, 'YYYY-MM-DD hh:mm A').format('hh:mm A');
        let slots = { slot: time, value: timeData.start_time }
        formatedTime.push(slots);
      }
      providerSlots.value = formatedTime
    }
  } else {
    allowedDates.value = []
    providerSlots.value = []
  }
  hideLoader()
};
fetchSlot();
watch(
  () => date.value,
  async (date) => {
    console.log('date', date)
    fetchSlot();
  }
);

const handleSubmit = () => {
  appointmentForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      let id = props.appointmentData.id;
      let data = {
        practitioner_id: props.appointmentData.practitioner_id,
        patient_id: patientId,
        title: props.appointmentData.title,
        // date: dateFormate(date.value),
        start_time: start_time.value,
        end_time: props.appointmentData.end_time,
        status: props.appointmentData.status,
        service: props.appointmentData.service,
        location: props.appointmentData.location,
        room: props.appointmentData.room,
        appointment_type: props.appointmentData.appointment_type,
        payment_type: props.appointmentData.payment_type,
        notes: notes.value,
      }
      await patientStore.updatePatientAppointment(data, id)
      emit('closePop', false);
      allowedDates.value = []
    }
  })

}
</script>
<template>

  <!-- <div v-if="showAppointment"></div> -->
  <VCard :title="$t('Re-Schedule Appointment')">
    <VCardText>
      <VForm ref="appointmentForm" @submit.prevent="handleSubmit">
        <VRow>
          <VCol cols="6">
            <AppSelect v-model="date" :rules="[requiredValidator]" :label="$t('Date')" :placeholder="$t('Select Date')"
              :items="availableDates" />
          </VCol>
          <VCol cols="6">
            <AppSelect v-model="start_time" :rules="[requiredValidator]" :label="$t('Time')" placeholder=""
              :items="providerSlots" item-value="value" item-title="slot" />
          </VCol>
          <!-- 👉 Description -->
          <VCol cols="12">
            <AppTextarea v-model="notes" :label="$t('Notes')" :placeholder="$t('Meeting description')" />
          </VCol>

          <!-- 👉 Form buttons -->
          <VCol cols="12">
            <VBtn type="submit" class="me-3">
              {{ $t('Update') }}
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>

</template>
