<script setup>

import moment from 'moment-timezone';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { VForm } from 'vuetify/components/VForm';
import { useStore } from 'vuex';
import { useCalendarStore } from './useCalendarStore';
import { requiredValidator } from '@core/utils/validators';

const searchQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const itemsPerPage = ref(100)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const practitioners = ref([])
const patientsList = ref([])
const locationsList = ref([])
const isAllDay = ref(false);
const eventDate = ref('');
const startHours = ref('');
const startMinutes = ref('');
const duration = ref(0);
const repeats = ref(false);
const repeatFrequency = ref('');
const repeatUnit = ref('');
const untilDate = ref('');
const selectedDays = ref([]);
const repeatOptions = ['every', '2nd', '3rd', '4th', '5th', '6th']; // Modify as needed  
const repeatUnits = ['day', 'week', 'month', 'year', 'workday']; // Modify as needed  
// 👉 store
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  event: {
    type: null,
    required: true,
  },
})
const isDrawerOpen = ref(props.event.id && props.isDrawerOpen)
const isModelOpen = ref(!props.event.id && props.isDrawerOpen)

const emit = defineEmits([
  'update:isModelOpen',
  'update:isDrawerOpen',
  'addEvent',
  'updateEvent',
  'removeEvent',
  'refetchEvent'
])
const store = useStore()
const calanderStore = useCalendarStore()
const refForm = ref()

// 👉 Event
const event = ref(JSON.parse(JSON.stringify(props.event)))

onMounted(async () => {
  console.log('props.event ==== ', props.event)
  await store.dispatch('getPractitioners')
  //await store.dispatch('getLocations');
  const practitionersData = store.getters.getPractitioners;
  event.value.extendedProps.untilDate = event.value.extendedProps.date

  //console.log('store.getters.getLocationData', store.getters.getLocationData)
  //locationsList.value = store.getters.getLocationData;
  practitioners.value = practitionersData.map(practitioner => ({
    name: `${practitioner.fname ? practitioner.fname : ''} ${practitioner.lname}`, // Display text
    id: practitioner.id, // Value
  }))
})

const resetEvent = () => {
  // isDrawerOpen.value = true
  console.log('watch ', props, props.event.extendedProps.practitioner_id, event.value.extendedProps.practitioner_id)
  if (props.isDrawerOpen && props.event.id) isModelOpen.value = true
  if (props.isDrawerOpen && !props.event.id) isDrawerOpen.value = props.isDrawerOpen
  if (!props.isDrawerOpen && !props.event.id) isDrawerOpen.value = props.isDrawerOpen

  event.value = JSON.parse(JSON.stringify(props.event))
  if (event.value.extendedProps.practitioner_id !== null) {

  } else {
    emit('refetchEvent', true)
    console.log('Practitioner ID is null, handle accordingly');
  }

  nextTick(() => {
    refForm.value?.resetValidation()
  })
}

const availabilityTypeOptions = [
    { value: 'availability', title: 'Availability' },
    { value: 'event', title: 'Event' }
];

const slotDurationOptions = [
    { value: 15, title: '15 min' },
    { value: 30, title: '30 min' },
    { value: 45, title: '45 min' },
    { value: 60, title: '1 hour' }
];

const timeSlots = [
  "12:00 am", "12:15 am", "12:30 am", "12:45 am",
  "01:00 am", "01:15 am", "01:30 am", "01:45 am",
  "02:00 am", "02:15 am", "02:30 am", "02:45 am",
  "03:00 am", "03:15 am", "03:30 am", "03:45 am",
  "04:00 am", "04:15 am", "04:30 am", "04:45 am",
  "05:00 am", "05:15 am", "05:30 am", "05:45 am",
  "06:00 am", "06:15 am", "06:30 am", "06:45 am",
  "07:00 am", "07:15 am", "07:30 am", "07:45 am",
  "08:00 am", "08:15 am", "08:30 am", "08:45 am",
  "09:00 am", "09:15 am", "09:30 am", "09:45 am",
  "10:00 am", "10:15 am", "10:30 am", "10:45 am",
  "11:00 am", "11:15 am", "11:30 am", "11:45 am",
  "12:00 pm", "12:15 pm", "12:30 pm", "12:45 pm",
  "01:00 pm", "01:15 pm", "01:30 pm", "01:45 pm",
  "02:00 pm", "02:15 pm", "02:30 pm", "02:45 pm",
  "03:00 pm", "03:15 pm", "03:30 pm", "03:45 pm",
  "04:00 pm", "04:15 pm", "04:30 pm", "04:45 pm",
  "05:00 pm", "05:15 pm", "05:30 pm", "05:45 pm",
  "06:00 pm", "06:15 pm", "06:30 pm", "06:45 pm",
  "07:00 pm", "07:15 pm", "07:30 pm", "07:45 pm",
  "08:00 pm", "08:15 pm", "08:30 pm", "08:45 pm",
  "09:00 pm", "09:15 pm", "09:30 pm", "09:45 pm",
  "10:00 pm", "10:15 pm", "10:30 pm", "10:45 pm",
  "11:00 pm", "11:15 pm", "11:30 pm", "11:45 pm"
];


const services = [
  { value: "Cardiology", label: "Cardiology" },
  { value: "Dermatology", label: "Dermatology" },
  { value: "Pediatrics", label: "Pediatrics" },
  { value: "Diagnostic Services", label: "Diagnostic Services" },
  { value: "Surgical Services", label: "Surgical Services" },
  { value: "Mental Health Services", label: "Mental Health Services" },
  { value: "Rehabilitation Services", label: "Rehabilitation Services" },
];







const startDateTimePickerConfig = computed(() => {
  const config = {
    enableTime: !event.value.allDay,
    dateFormat: `Y-m-d${event.value.allDay ? '' : ' H:i'}`,
  }

  if (event.value.end)
    config.maxDate = event.value.end

  return config
})

// const {
//   data: usersData,
//   execute: fetchUsers,
// } = await useApi(createUrl('/apps/users', {
//   query: {
//     q: searchQuery,
//     status: selectedStatus,
//     plan: selectedPlan,
//     role: selectedRole,
//     itemsPerPage,
//     page,
//     sortBy,
//     orderBy,
//   },
// }))

const users = computed(() => {
  return patientsList.value
})

// console.log('User',usersData.value.users)

watch(() => props.isDrawerOpen, resetEvent)

watch(
  () => event.value.extendedProps.patient_id,
  (newPatientId) => {
    console.log('>>', event.value)
    const selectedUser = users.value.find((user) => user.id === newPatientId);
    if (selectedUser) {
      event.value.title = selectedUser.full_name; // Update title based on the selected user
    } else {
      if (!event.value.id)
        event.value.title = ''; // Clear title if no user is selected
    }
  }
);

const removeEvent = () => {
  emit('removeEvent', String(event.value.id))
  isModelOpen.value = false
  // Close drawer
  emit('update:isDrawerOpen', false)
}

const formatDateTimeStart = (date, startTime) => {
  const { currentUser } = GLOBAL_VARIABLE.useAuth
  let timzoneFound = currentUser.value.time_zone
  const estDateTime = moment.tz(`${date} ${startTime}`, 'YYYY-MM-DD hh:mm A', timzoneFound);

  // Convert to UTC timestamp
  return {
    start: estDateTime.clone().tz('UTC').format(),
    end: estDateTime.clone().tz('UTC').format()
  };
};
const formatDateTimeEnd = (date, endTime) => {
  const { currentUser } = GLOBAL_VARIABLE.useAuth
  let timzoneFound = currentUser.value.time_zone
  const estDateTime = moment.tz(`${date} ${endTime}`, 'YYYY-MM-DD hh:mm A', timzoneFound);

  // Convert to UTC timestamp
  return {
    start: estDateTime.clone().tz('UTC').format(),
    end: estDateTime.clone().tz('UTC').format()
  };
};
// Helper function to parse "HH:MM am/pm" format
const parseTime = (timeString) => {
  const [time, modifier] = timeString.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') hours = '0';
  if (modifier === 'pm') hours = parseInt(hours, 10) + 12;
  return [parseInt(hours, 10), parseInt(minutes, 10)];
};

const handleSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    const { currentUser } = GLOBAL_VARIABLE.useAuth
    let timzoneFound = currentUser.value.time_zone
    let resultStart = formatDateTimeStart(event.value.extendedProps.date, event.value.extendedProps.start_time);
    let resultEnd = formatDateTimeEnd(event.value.extendedProps.untilDate, event.value.extendedProps.end_time);
    event.value.start = moment.utc(resultStart.start).tz("UTC").format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z"
    event.value.end = moment.utc(resultEnd.end).tz("UTC").format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z"

    console.log('start date UTC == ', resultStart.start)
    console.log('End date UTC == ', resultEnd.end)
    console.log('event start date UTC == ', event.value.start)
    console.log('event End date UTC == ', event.value.end)
    console.log('Start date EST == ', moment.utc(event.value.start).tz(timzoneFound).format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z")
    console.log('End date EST == ', moment.utc(event.value.end).tz(timzoneFound).format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z")
    //console.log(resultStart.start, resultEnd.end, event.value.start, event.value.end, moment.utc(event.value.start).tz(timzoneFound).format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z")
    event.value.extendedProps.start_time = moment.utc(event.value.start).tz("UTC").format("hh:mm A")
    event.value.extendedProps.end_time = moment.utc(event.value.end).tz("UTC").format("hh:mm A")
    if (valid) {

      // If id exist on id => Update event
      if ('id' in event.value) {

        emit('updateEvent', event.value)

        // Else => add new event
      } else {
        console.log('event.value', event.value)
        emit('addEvent', event.value)
      }
      // Close drawer
      isDrawerOpen.value = false
      emit('update:isDrawerOpen', false)
    }
  })
}



// 👉 Form
const onCancel = () => {

  // Close drawer
  emit('update:isDrawerOpen', false)

  nextTick(() => {
    refForm.value?.reset()
    resetEvent()
    refForm.value?.resetValidation()

  })
}

const startDatePickerConfig = computed(() => {
  const config = {
    enableTime: !event.value.allDay,
    dateFormat: `Y-m-d${event.value.allDay ? '' : ''}`,
  }

  if (event.value.date)
    config.maxDate = event.value.date

  return config
})

const endDateTimePickerConfig = computed(() => {
  const config = {
    enableTime: !event.value.allDay,
    dateFormat: `Y-m-d${event.value.allDay ? '' : ' H:i'}`,
  }

  if (event.value.date)
    config.minDate = event.value.date

  return config
})

const dialogModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const formatLabel = (type) => {
    // Optionally format label from snake_case to "Title Case"
    return type
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
}
</script>

<template>
  <v-dialog :model-value="isModelOpen" width="400" :persistent="true">
    <v-card :title="$t('Availability Information')">
      <VCardText>
        <p> {{ $t('Provider Name') }}: {{ event.title }}</p>
        <p>{{ $t('Date') }} : {{ event.extendedProps.date }}</p>
        <p> {{ $t('Start Time') }}: {{ event.extendedProps.start_time }}</p>
        <p> {{ $t('End Time') }} : {{ event.extendedProps.end_time }}</p>
      </VCardText>
      <template v-slot:actions>
        <v-btn class="ms-auto" :text="$t('Remove')" @click="removeEvent" v-if="$can('read', 'Availability Delete')"></v-btn>
        <v-btn class="ms-auto" :text="$t('Edit')" @click="isModelOpen = false; isDrawerOpen = true"
          v-if="$can('read', 'Availability Edit')"></v-btn>
        <v-btn class="ms-auto" :text="$t('Ok')" color="secondary"
          @click="isModelOpen = false; emit('update:isDrawerOpen', false)"></v-btn>
      </template>
    </v-card>
  </v-dialog>
  <VNavigationDrawer temporary location="end" :model-value="isDrawerOpen" width="800" :border="0"
    class="scrollable-content" @update:model-value="dialogModelValueUpdate">
    <!-- 👉 Header -->
    <AppDrawerHeaderSection :title="event.id ? $t('Update Availability') : $t('Add Availability')"
      @cancel="isDrawerOpen = false; emit('update:isDrawerOpen', false)">
      <template #beforeClose>
        <IconBtn v-show="event.id" @click="removeEvent" v-if="$can('read', 'Availability Delete')">
          <VIcon size="18" icon="tabler-trash" />
        </IconBtn>
      </template>
    </AppDrawerHeaderSection>

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }"
      v-if="$can('read', 'Availability Add') || $can('read', 'Availability Edit')">
      <VCard flat>
        <VCardText>
          <!-- SECTION Form -->
          <VForm ref="refForm" @submit.prevent="handleSubmit">
            <VRow>
              <VCol cols="12">
                <VRadioGroup
                    v-model="event.extendedProps.type"
                    inline
                  >
                  <VRadio
                    v-for="type in availabilityTypeOptions"
                    :key="type.value"
                    :label="type.title"
                    :value="type.value"
                  />
                  </VRadioGroup>
              </VCol>
              <VCol cols="12">
                <AppSelect v-model="event.extendedProps.practitioner_id" :label="$t('Practitioner')" placeholder=""
                  :items="practitioners" item-value="id" item-title="name" :rules="[requiredValidator]" />
              </VCol>
              <VCol cols="6" style="display: none;">
                <AppSelect v-model="event.extendedProps.location" :label="$t('Facility')" :placeholder="$t('Facility')"
                  :items="locationsList" item-value="id" item-title="name" />
              </VCol>
              <VCol cols="6" style="display: none;">
                <AppSelect v-model="event.extendedProps.billing_facility" :label="$t('Billing Facility')"
                  :placeholder="$t('Billing Facility')" :items="locationsList" item-value="id" item-title="name" />
              </VCol>
              <!-- 👉 Title -->
              <VCol cols="12" style="display: none;">
                <AppTextField v-model="event.extendedProps.shift_title" :label="$t('Shift Title')"
                  :placeholder="$t('Shift Title')" />
              </VCol>




              <!-- 👉 All day -->






              <VCol cols="12" style="display: none;">
                <VSwitch v-model="event.allDay" :label="$t('All day')" />
              </VCol>


              <VCol cols="6">
                <AppDateTimePicker v-model="event.extendedProps.date" :rules="[requiredValidator]"
                  :label="$t('Start Date')" :placeholder="$t('Select Date')" />
              </VCol>



              <!-- 👉 Start date -->
              <VCol cols="6">
                <AppSelect v-model="event.extendedProps.start_time" :label="$t('Start Time')" placeholder=""
                  :items="timeSlots" :disabled="event.allDay" :rules="[requiredValidator]" />
              </VCol>
              <VCol cols="6">
                <AppDateTimePicker v-model="event.extendedProps.untilDate" :rules="[requiredValidator]"
                  :label="$t('End Date')" :placeholder="$t('End Date')" />
              </VCol>
              <!-- 👉 End date -->
              <VCol cols="6">
                <AppSelect v-model="event.extendedProps.end_time" :label="$t('End Time')" placeholder=""
                  :items="timeSlots" :disabled="event.allDay" :rules="[requiredValidator]" />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="event.extendedProps.slot_duration" :label="$t('Slot Duration')" placeholder=""
                  :items="slotDurationOptions" item-value="value" item-title="title" :rules="[requiredValidator]" />
              </VCol>





              <!-- Repeat Settings -->
              <v-col cols="12" style="display: none;">
                <v-checkbox v-model="event.extendedProps.repeats" :label="$t('Repeats')" />
              </v-col>

              <v-col cols="4" style="display: none;">
                <AppSelect v-model="event.extendedProps.repeatFrequency" :items="repeatOptions" :label="$t('Every')"
                  :disabled="!event.extendedProps.repeats" />
              </v-col>

              <v-col cols="2" style="display: none;">
                <AppSelect v-model="event.extendedProps.repeatUnit" :items="repeatUnits" :label="$t('Day')"
                  :disabled="!event.extendedProps.repeats" />
              </v-col>

              <v-col cols="6" style="display: none;">
                <AppDateTimePicker v-model="event.extendedProps.untilDate" :label="$t('Until Date')"
                  :placeholder="$t('Until Date')" :disabled="!event.extendedProps.repeats" />

              </v-col>

              <!-- Days of the Week Checkboxes -->
              <v-col cols="12" v-show="event.extendedProps.type === 'availability'">
                <VCheckbox v-model="event.extendedProps.weakDay" :label="$t('Days Of Week')" style="display: none;" />

                <div class="demo-space-x">
                  <VCheckbox v-model="event.extendedProps.selectDays" :label="$t('su')" value="Sunday" />

                  <VCheckbox v-model="event.extendedProps.selectDays" :label="$t('Mo')" value="Monday" />

                  <VCheckbox v-model="event.extendedProps.selectDays" :label="$t('Tu')" value="Tuesday" />
                  <VCheckbox v-model="event.extendedProps.selectDays" :label="$t('We')" value="Wednesday" />
                  <VCheckbox v-model="event.extendedProps.selectDays" :label="$t('Th')" value="Thursday" />
                  <VCheckbox v-model="event.extendedProps.selectDays" :label="$t('Fri')" value="Friday" />
                  <VCheckbox v-model="event.extendedProps.selectDays" :label="$t('Sa')" value="Saturday" />
                </div>

              </v-col>




              <VCol cols="12" style="display: none;">
                <AppSelect v-model="event.extendedProps.service" :label="$t('Service')"
                  :placeholder="$t('Select Service')" :items="services" item-value="value" item-title="label" />
              </VCol>
              <VCol cols="12">
                <AppTextField v-model="event.extendedProps.comment" :label="$t('Comments')"
                  :placeholder="$t('Comments')" />
              </VCol>

              <!-- 👉 Form buttons -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3">
                  {{ $t('Submit') }}
                </VBtn>
                <VBtn variant="outlined" color="secondary" @click="onCancel">
                  {{ $t('Cancel') }}
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
          <!-- !SECTION -->
        </VCardText>
      </VCard>
    </PerfectScrollbar>
    <ErrorHeader status-code="401" :title="$t('You are not authorized!')"
      :description="$t('You don’t have permission to access this page. Go Home!.')" v-else />
  </VNavigationDrawer>
</template>
