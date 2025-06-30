<script setup>
import { useCallStore } from '@/stores/callStore';
import { usePatientStore } from '@/stores/patientStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import { MEET_APPOINTMENT_URL } from '@/utils/constants';
import avatar1 from '@images/avatars/avatar-1.png';
import avatar2 from '@images/avatars/avatar-2.png';
import avatar3 from '@images/avatars/avatar-3.png';
import avatar5 from '@images/avatars/avatar-5.png';
import avatar6 from '@images/avatars/avatar-6.png';
import avatar7 from '@images/avatars/avatar-7.png';
import avatar8 from '@images/avatars/profile-5.webp';
import moment from 'moment-timezone';
import { useRoute, useRouter } from 'vue-router';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { VForm } from 'vuetify/components/VForm';
import { useCalendarStore } from './useCalendarStore';

const { currentUser } = useAuth()
const patientStore = usePatientStore()
const practitionerStore = usePractitionerStore()
const callStore = useCallStore()
const router = useRouter()
const route = useRoute();
const practitioners = ref([])
const providerSlots = ref([])
const providerAvailbleDates = ref([])
const allowedDates = ref([]);
const refreshConfig = ref(false);
const timezoneMap = {
  'America/New_York': 'EST',
  'America/Los_Angeles': 'PST',
  'America/Chicago': 'CST',
  'America/Denver': 'MST',
  'UTC': 'UTC',
};
const selectTimeZone = ref(currentUser.value.time_zone ? timezoneMap[currentUser.value.time_zone] : 'UTC');
const selectedAppPatient = ref(null)
practitionerStore.getloggedInPractitioner()
practitionerStore.practitionersList()
patientStore.patientsList()
practitionerStore.locaiationsList()

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
])
const calanderStore = useCalendarStore()
const refForm = ref()
const event = ref(JSON.parse(JSON.stringify(props.event)))
const selectedEventDate = ref(null)
const selectedEventStart = ref(null)
onMounted(async () => {
})

const resetEvent = () => {
  // isDrawerOpen.value = true
  console.log('watch ', props)
  if (props.isDrawerOpen && props.event.id) isModelOpen.value = true
  if (props.isDrawerOpen && !props.event.id) isDrawerOpen.value = props.isDrawerOpen
  if (!props.isDrawerOpen && !props.event.id) isDrawerOpen.value = props.isDrawerOpen
  if (props.event.extendedProps.patient_id)
    patientStore.loadPatient(props.event.extendedProps.patient_id)
  else
    patientStore.unloadPatient()
  // props.event = JSON.parse(JSON.stringify(props.event))
  nextTick(() => {
    refForm.value?.resetValidation()
  })
}

const eventStatuses = [
  { value: "ON_TIME", label: "On Time" },
  { value: "CHECKED_IN", label: "Checked In" },
  { value: "Complete", label: "Mark as Completed" },
  { value: "CONFIRMED", label: "CONFIRMED" },
  { value: "Pending", label: "Pending" },
  { value: "READY_FOR_PROVIDER", label: "Ready for Provider" },
  { value: "WITH_PROVIDER", label: "With Provider" },
  { value: "NOTE_COMPLETE", label: "Note Complete" },
  { value: "CHECKED_OUT", label: "Checked Out" },
  { value: "BILLING_DONE", label: "Billing Done" },
  { value: "DELAYED", label: "Delayed" },
  { value: "TENTATIVE", label: "Tentative" },
  { value: "RESCHEDULED", label: "Rescheduled" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "CANCELLATION_LATE", label: "Cancelled - Late" },
  { value: "CANCELLATION_BY_PROVIDER", label: "Cancelled - By Provider" },
  { value: "NO_SHOW", label: "No Show" }
];

const services = [
  { value: "Patient Followup", label: "Patient Followup" },
];

const rooms = [
  { value: "9722", label: "Doctor Room One" },
  { value: "9725", label: "Test room 1" },
  { value: "10319", label: "Asif Test" }
];

const appointmentTypes = [
  { value: "telehealth_visit", label: "Telehealth Visit", selected: true },
  { value: "follow_up", label: "Follow Up" },
  { value: "lab_review", label: "Lab Review" },
  { value: "initial_consult", label: "Initial Consult" },
  { value: "office_visit", label: "Office Visit" },
];

const paymentTypes = [
  { value: "Cash Only", label: "Cash Only" },
  { value: "Insurance Only", label: "Insurance Only" },
  { value: "Cash and Insurance", label: "Cash and Insurance" },
  { value: "Auto", label: "Auto" },
  { value: "Workers", label: "Workers" },
  { value: "Prepaid", label: "Prepaid" }
];

watch(() => props.isDrawerOpen, resetEvent)

watch(
  () => props.event.extendedProps.patient_id,
  (newPatientId) => {
    console.log('>>', props.event, newPatientId)
    selectedAppPatient.value = props.event.title
    const selectedUser = patientStore.patients.find((user) => user.id === newPatientId);
    if (selectedUser) {
      props.event.title = selectedUser.demographic.fullName; // Update title based on the selected user
    } else {
      if (!props.event.id)
        props.event.title = ''; // Clear title if no user is selected
    }
  }
);

watch(
  () => props.event.extendedProps.practitioner_id,
  async (practitionerId) => {
    if (props.event.start) {
      let date = new Date(props.event.start);
      selectedEventDate.value = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;
      selectedEventStart.value = props.event.extendedProps.start_time
    }
    console.log('props.event.extendedProps.practitioner_id', props.event)
    const foundPractitioner = await practitionerStore.practitioners.find(practitioner => practitioner.id === practitionerId);
    const currentDate = new Date()
    let month = currentDate.getMonth() + 1
    if (props.event.extendedProps.date) {
      month = props.event.extendedProps.date.match(/\d+/g)[1];
    }
    console.log('foundPractitioner', foundPractitioner, month, selectTimeZone.value)
    if (foundPractitioner && month && selectTimeZone.value) {

      await practitionerStore.getSlots({ month: month, timezone: selectTimeZone.value }, foundPractitioner.id)

      providerAvailbleDates.value = practitionerStore.slots

      allowedDates.value = Object.keys(providerAvailbleDates.value).map(date => ({
        title: moment(date).format('MM-DD-YYYY'), // Display format 
        value: date // Original date value "YYYY-MM-DD"
      }));
      console.log(allowedDates.value)

      //allowedDates.value  = store.getters.getProviderSlots.map(entry => entry.date);  

      let data = providerAvailbleDates.value[props.event.extendedProps.date];

      if (data) {
        let formatedTime = []
        for (let timeData of data) {
          // Format the time using Moment.js  
          const time = moment(timeData.formatted_datetime, 'YYYY-MM-DD hh:mm A').format('hh:mm A');
          let slots = { slot: time, value: timeData.start_time }
          // Add the formatted time to the array  
          formatedTime.push(slots);
        }
        providerSlots.value = formatedTime
        console.log('providerSlots', providerSlots.value)

      }
    } else {
      allowedDates.value = []
      providerSlots.value = []
    }



  }
);
watch(
  () => props.event.extendedProps.date,
  async (date) => {
    console.log('date', date)
    // props.event.extendedProps.start_time = null
    const foundPractitioner = await practitionerStore.practitioners.find(practitioner => practitioner.id === props.event.extendedProps.practitioner_id);

    const currentDate = new Date()
    let month = currentDate.getMonth() + 1
    if (props.event.extendedProps.date) {
      month = props.event.extendedProps.date.match(/\d+/g)[1];
    }
    if (foundPractitioner && month && selectTimeZone.value) {
      await practitionerStore.getSlots({ month: month, timezone: selectTimeZone.value }, foundPractitioner.id)
      providerAvailbleDates.value = practitionerStore.slots
      let data = providerAvailbleDates.value[props.event.extendedProps.date];
      if (data) {
        let formatedTime = []
        for (let timeData of data) {
          console.log(timeData.start_time)
          // Format the time using Moment.js  
          const time = moment(timeData.formatted_datetime, 'YYYY-MM-DD hh:mm A').format('hh:mm A');
          let slots = { slot: time, value: timeData.start_time }
          // Add the formatted time to the array  

          formatedTime.push(slots);
        }
        providerSlots.value = formatedTime
        console.log('slots', providerSlots.value)
      }
    } else {
      allowedDates.value = []
      providerSlots.value = []
    }

  }
);
watch(
  () => props.event.extendedProps.start_time,
  async (start_time) => {
    console.log(start_time)
    let startTime = moment(props.event.extendedProps.start_time, 'hh:mm A');

    // Add 30 minutes  
    startTime.add(30, 'minutes');

    // Format the new time back to a string  
    const newTime = startTime.format('hh:mm A');
    props.event.extendedProps.end_time = newTime
  }
);
const removeEvent = () => {
  emit('removeEvent', String(props.event.id))

  // Close drawer
  emit('update:isDrawerOpen', false)
}

const formatDateTime = (date, startTime, endTime) => {
  // Parse date and time strings into components
  const dateStr = new Date(date).toISOString().split('T')[0]; // Get the date part of the ISO string
  const [startHour, startMinute] = parseTime(startTime);
  const [endHour, endMinute] = parseTime(endTime);

  // Create UTC Date objects with correct time components
  const start = new Date(Date.UTC(
    new Date(dateStr).getUTCFullYear(),
    new Date(dateStr).getUTCMonth(),
    new Date(dateStr).getUTCDate(),
    startHour,
    startMinute
  ));

  const end = new Date(Date.UTC(
    new Date(dateStr).getUTCFullYear(),
    new Date(dateStr).getUTCMonth(),
    new Date(dateStr).getUTCDate(),
    endHour,
    endMinute
  ));

  // Format to ISO string in UTC
  const formattedStart = start.toISOString();
  const formattedEnd = end.toISOString();

  return {
    start: formattedStart,
    end: formattedEnd
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
    console.log('props.event', props.event)
    let result = formatDateTime(props.event.extendedProps.date, props.event.extendedProps.start_time, props.event.extendedProps.end_time);
    props.event.start = result.start
    props.event.end = result.end
    if (valid) {

      // If id exist on id => Update event
      if ('id' in props.event) {

        emit('updateEvent', props.event)

        // Else => add new event
      } else {
        console.log('props.event', props.event)
        emit('addEvent', props.event)
      }
      allowedDates.value = []
      // Close drawer
      isDrawerOpen.value = false
      emit('update:isDrawerOpen', false)
    }
  })
}

const guestsOptions = [
  {
    avatar: avatar1,
    name: 'Jane Foster',
  },
  {
    avatar: avatar3,
    name: 'Donna Frank',
  },
  {
    avatar: avatar5,
    name: 'Gabrielle Robertson',
  },
  {
    avatar: avatar7,
    name: 'Lori Spears',
  },
  {
    avatar: avatar6,
    name: 'Sandy Vega',
  },
  {
    avatar: avatar2,
    name: 'Cheryl May',
  },
]

// 👉 Form
const onCancel = () => {
  console.log()
  // Close drawer
  emit('update:isDrawerOpen', false)
  isDrawerOpen.value = false
  nextTick(() => {
    refForm.value?.reset()
    resetEvent()
    refForm.value?.resetValidation()
  })
}

function isDateAllowed(date) {
  // Format date manually to avoid timezone conversion
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 because getMonth() is zero-based
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${day}-${month}-${year}`; // Format date as YYYY-MM-DD

  return allowedDates.value.includes(formattedDate); // Check if the formatted date is in the allowed dates
}
const startDatePickerConfig = computed(() => {
  refreshConfig.value;
  const config = {
    enableTime: false,
    dateFormat: 'Y-m-d',
    disable: [
      function (date) {
        return !isDateAllowed(date); // Disable dates that are not in the allowed list  
      }
    ],
  };

  // Optionally log the selected date for debugging  
  if (props.event.date) {
    console.log(props.event.date);
  }

  return config;
});

const endDateTimePickerConfig = computed(() => {
  const config = {
    enableTime: !props.event.allDay,
    dateFormat: `Y-m-d${props.event.allDay ? '' : ' H:i'}`,
  }

  if (props.event.date)
    config.minDate = props.event.date

  return config
})

const dialogModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}
const goToCall = (id) => {
  isModelOpen.value = false;
  emit('update:isDrawerOpen', false)
  window.open(MEET_APPOINTMENT_URL + id, '_blank').focus();
};

const goToCallPage = (ev) => {
  console.log('ev', ev, practitionerStore.loggedInPractitioner)
  isModelOpen.value = false;
  emit('update:isDrawerOpen', false)
  router.replace('/provider/call/' + ev.extendedProps.patient_id + '/' + ev.id)
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatCustomDate = (dateString) => {
  // Ensure the date string is in YYYY-MM-DD format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return 'Invalid date format';
  }

  // Split the date string into components
  const [year, month, day] = dateString.split('-');

  // Convert month to number (subtract 1 since array is 0-based)
  const monthIndex = parseInt(month, 10) - 1;

  // Remove leading zero from day
  const cleanDay = parseInt(day, 10);

  // Return formatted date (e.g., "Jan 1,")
  return `${monthNames[monthIndex]} ${cleanDay},`;
};

// Usage in your computed property:
const formatedDate = computed(() => {
  console.log('props.event.extendedProps.date', props.event.extendedProps.date);
  return formatCustomDate(props.event.extendedProps.date);
});

const calculateAge = (birthDateString = null) => {
  if (!birthDateString) return null
  // Split the birth date string
  const [birthYear, birthMonth, birthDay] = birthDateString.split("-").map(Number);

  // Get current date from the system using a basic approximation
  const currentDate = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const [currentYear, currentMonth, currentDay] = currentDate.split("-").map(Number);

  // Calculate age
  let age = currentYear - birthYear;

  // Adjust if the birthday hasn't occurred yet this year
  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }

  return age;
}

const formatDate = (dateString = null) => {
  if (!dateString) return null
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  // Split the input date string
  const [year, month, day] = dateString.split("-");

  // Get the corresponding month abbreviation
  const monthAbbreviation = months[parseInt(month, 10) - 1];

  // Return the formatted string
  return `${monthAbbreviation} ${parseInt(day, 10)}, ${year}`;
}



</script>

<template>
  <v-dialog :model-value="isModelOpen" width="auto">
    <DialogCloseBtn @click="isModelOpen = false; emit('update:isDrawerOpen', false)" />
    <VCard max-width="500">
      <VCardText class="d-flex align-bottom flex-sm-row flex-column justify-center gap-x-6"
        v-if="patientStore.demographic.fullName">
        <div class="d-flex h-0">
          <VAvatar rounded size="90" :image="patientStore.demographic.profilePicture ?? avatar8" class="" />
        </div>

        <div class="user-profile-info w-100 mt-16 pt-6 pt-sm-0 mt-sm-0">
          <h4 class="text-h4 text-center text-sm-start font-weight-medium mb-0">
            {{ patientStore.demographic.fullName ?? '' }}
          </h4>

          <div class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-5">
            <div class="d-flex flex-wrap justify-center justify-sm-start flex-grow-1 gap-6">

              <span class="d-flex gap-x-2 align-center">
                <div class="text-body-1 font-weight-medium"
                  v-if="patientStore.demographic.genderIdentity || patientStore.demographic.dateOfBirth">
                  {{ patientStore.demographic.genderIdentity ?? '' }}, {{
                    calculateAge(patientStore.demographic.dateOfBirth) ?
                      `${calculateAge(patientStore.demographic.dateOfBirth)}Yrs` : '' }}
                </div>
              </span>

              <span class="d-flex gap-x-2 align-center">
                <div class="text-body-1 font-weight-medium" v-if="patientStore.demographic.dateOfBirth">
                  {{ $t('DOB') }}: {{ formatDate(patientStore.demographic.dateOfBirth) ?? '' }}
                </div>
              </span>
            </div>
          </div>
        </div>
      </VCardText>
      <VCardText>
        <p class="mb-1 text-body-1 font-weight-medium"> {{ $t('Appointment Date & Time') }} </p>
        <div>
          <p class="mb-0" v-if="formatedDate && props.event.extendedProps.start_time"
            style="font-family: 'Inter'; font-weight: 600; font-size: 20px; line-height: normal;">
            {{ formatedDate }} {{ props.event.extendedProps.start_time }}
          </p>
          <p class="mb-3">
            <span class="d-flex gap-x-2 align-center">
              <VIcon size="20" color="grey" icon="tabler-video" />
              <div class="text-body-1 font-weight-medium" style="font-size: 14px !important;color: grey;">

                {{ $t('Patient Follow-UP') }}
              </div>
            </span>
          </p>
        </div>

      </VCardText>
      <VCardText>
        <RouterLink v-if="isModelOpen"
          :to="{ name: 'provider-patients-dashboard-id', params: { id: props.event.extendedProps.patient_id } }">
          <VBtn rounded="pill" color="primary" flat>

            {{ $t('View Patient Details') }}
          </VBtn>
        </RouterLink>

        <v-btn class="ms-auto" variant="text" v-if="props.event.extendedProps.appointment_type !== 'office_visit'
          && props.event.extendedProps.status !== 'CANCELLED'
          && props.event.extendedProps.status !== 'CANCELLATION_LATE'
          && props.event.extendedProps.status !== 'CANCELLATION_BY_PROVIDER'
          && props.event.extendedProps.status !== 'NO_SHOW'" :text="$t('Start Call')" color="success"
          @click="goToCallPage(props.event)" :disabled="callStore.isJoin"></v-btn>

        <v-btn class="ms-auto" variant="text" :text="$t('Edit')" @click="isModelOpen = false; isDrawerOpen = true"
          v-if="$can('read', 'Appointments Edit')"></v-btn>
      </VCardText>
    </VCard>
  </v-dialog>
  <VNavigationDrawer temporary location="end" :model-value="isDrawerOpen" width="400" :border="0"
    class="scrollable-content" @update:model-value="dialogModelValueUpdate">
    <!-- 👉 Header -->
    <AppDrawerHeaderSection :title="props.event.id ? $t('Update Appointment') : $t('Add Appointment')"
      @cancel="isDrawerOpen = false; emit('update:isDrawerOpen', false)">
      <template #beforeClose>
        <IconBtn v-show="props.event.id" @click="removeEvent">
          <VIcon size="18" icon="tabler-trash" />
        </IconBtn>
      </template>
    </AppDrawerHeaderSection>

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }"
      v-if="$can('read', 'Appointments Add') || $can('read', 'Appointments Edit')">
      <VCard flat>
        <VCardText>
          <!-- SECTION Form -->
          <VForm ref="refForm" @submit.prevent="handleSubmit">
            <VRow>
              <VCol cols="12">
                <AppSelect v-model="props.event.extendedProps.practitioner_id" :label="$t('Practitioner')"
                  placeholder="" :items="practitionerStore.practitioners" item-value="id" item-title="fullName" />
              </VCol>
              <VCol cols="12">

                <AppSelect v-model="props.event.extendedProps.patient_id" :label="$t('Patient')"
                  :items="patientStore.patients" item-value="id" item-title="demographic.fullName" placeholder="" />
              </VCol>
              <!-- 👉 Title -->
              <VCol cols="12">
                <AppTextField v-model="props.event.title" :label="$t('Title')" :placeholder="$t('Title')"
                  :rules="[requiredValidator]" disabled />
              </VCol>

              <!-- 👉 Calendar -->
              <VCol cols="12" style="display: none;">
                <AppSelect v-model="event.extendedProps.calendar" :label="$t('Label')"
                  :placeholder="$t('Select Event Label')" :rules="[requiredValidator]"
                  :items="calanderStore.availableCalendars" :item-title="item => item.label"
                  :item-value="item => item.label">
                  <template #selection="{ item }">
                    <div v-show="event.extendedProps.calendar" class="align-center"
                      :class="event.extendedProps.calendar ? 'd-flex' : ''">
                      <VIcon :color="item.raw.color" icon="tabler-circle-filled" size="8" class="me-2" />
                      <span>{{ item.raw.label }}</span>
                    </div>
                  </template>

                  <template #item="{ item, props: itemProps }">
                    <VListItem v-bind="itemProps">
                      <template #prepend>
                        <VIcon size="8" icon="tabler-circle-filled" :color="item.raw.color" />
                      </template>
                    </VListItem>
                  </template>
                </AppSelect>
              </VCol>

              <VCol cols="12">

                <AppSelect v-model="props.event.extendedProps.date" :label="$t('Date')" :placeholder="$t('Select Date')"
                  :items="allowedDates" :rules="[requiredValidator]" :disabled="allowedDates.length === 0" />
                <!-- <AppDateTimePicker
                  :key="JSON.stringify(startDatePickerConfig)"
                 
                
                  label="Date"
                  placeholder="Select Date"
                  :config="startDatePickerConfig"
                  
                /> -->
              </VCol>
              <!-- 👉 Start date -->
              <VCol cols="12">
                <AppSelect v-model="props.event.extendedProps.start_time" :label="$t('Start')" placeholder=""
                  :items="providerSlots" item-value='value' item-title="slot" />
              </VCol>

              <!-- 👉 End date -->
              <VCol cols="6" style="display: none;">
                <AppSelect v-model="event.extendedProps.end_time" :label="$t('End')" placeholder=""
                  :items="providerSlots" item-value='end_time' item-title="end_time" />
              </VCol>

              <!-- 👉 All day -->
              <VCol cols="12" style="display: none;">
                <VSwitch v-model="event.allDay" label="All day" />
              </VCol>

              <VCol cols="12">
                <AppSelect v-model="props.event.extendedProps.service" :label="$t('Service')"
                  :placeholder="$t('Select Service')" :items="services" item-value="value" item-title="label" />
              </VCol>

              <VCol cols="12">
                <AppSelect v-model="props.event.extendedProps.status" :label="$t('Status')"
                  :placeholder="$t('Select Status')" :items="eventStatuses" item-value="value" item-title="label" />
              </VCol>

              <!-- 👉 Event URL -->
              <VCol cols="12" style="display: none;">
                <AppTextField v-model="event.url" :label="$t('Event URL')" placeholder="https://event.com/meeting"
                  :rules="[urlValidator]" type="url" />
              </VCol>

              <!-- 👉 Guests -->
              <VCol cols="12" style="display: none;">
                <AppSelect v-model="event.extendedProps.guests" :label="$t('Guests')" placeholder="Select guests"
                  :items="guestsOptions" :item-title="item => item.name" :item-value="item => item.name" chips multiple
                  eager />
              </VCol>

              <VCol cols="12" style="display: none;">
                <AppSelect v-model="props.event.extendedProps.room" :label="$t('Room')" :placeholder="$t('Select Room')"
                  :items="rooms" item-value="value" item-title="label" />
              </VCol>

              <!-- 👉 Location -->
              <VCol cols="12" style="display: none;">
                <AppSelect v-model="props.event.extendedProps.location" :label="$t('Location')"
                  :placeholder="$t('Select Location')" :items="practitionerStore.locations" item-value="id"
                  item-title="name" />
              </VCol>

              <VCol cols="12">
                <AppSelect v-model="props.event.extendedProps.appointment_type" :label="$t('Appointment Type')"
                  :placeholder="$t('Select Appointment Type')" :items="appointmentTypes" item-value="value"
                  item-title="label" />
              </VCol>

              <VCol cols="12">
                <AppSelect v-model="props.event.extendedProps.payment_type" :label="$t('Payment Type')"
                  :placeholder="$t('Payment Type')" :items="paymentTypes" item-value="value" item-title="label" />
              </VCol>



              <!-- 👉 Description -->
              <VCol cols="12">
                <AppTextarea v-model="props.event.extendedProps.notes" :label="$t('Description')"
                  :placeholder="$t('description')" />
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

    <ErrorHeader status-code="401" title="You are not authorized! 🔐"
      description="You don’t have permission to access this page. Go Home!." v-else />

  </VNavigationDrawer>
</template>
