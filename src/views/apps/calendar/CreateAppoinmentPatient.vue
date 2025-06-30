<script setup>
import { useCallStore } from '@/stores/callStore';
import { usePatientStore } from '@/stores/patientStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import avatar1 from '@images/avatars/avatar-1.png';
import avatar2 from '@images/avatars/avatar-2.png';
import avatar3 from '@images/avatars/avatar-3.png';
import avatar5 from '@images/avatars/avatar-5.png';
import avatar6 from '@images/avatars/avatar-6.png';
import avatar7 from '@images/avatars/avatar-7.png';
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

  if (props.isDrawerOpen && !props.event.id) {
    isDrawerOpen.value = props.isDrawerOpen;
  }


  // Load patient if patient_id exists
  if (props.event.extendedProps.patient_id) {
    patientStore.loadPatient(props.event.extendedProps.patient_id);

    const selectedUser = patientStore.patients.find((user) => {
      console.log('Checking Patient:', user.id, user.demographic.fullName, props.event.extendedProps.patient_id);
      return Number(user.id) === props.event.extendedProps.patient_id;
    });
    if (selectedUser) {
      props.event.extendedProps.patient_id = selectedUser.id;
      console.log(selectedUser)
      props.event.title = selectedUser.demographic.fullName;
    }

  }

  nextTick(() => {
    props.event.extendedProps.practitioner_id = null
    props.event.extendedProps.date = null
    props.event.extendedProps.start_time = null
    props.event.extendedProps.service = null
    props.event.extendedProps.status = null
    props.event.extendedProps.appointment_type = null
    props.event.extendedProps.payment_type = null
    props.event.extendedProps.notes = null
    refForm.value?.resetValidation();
  });
};

const eventStatuses = [
  { value: "ON_TIME", label: "On Time" },
  { value: "CHECKED_IN", label: "Checked In" },
  { value: "CONFIRMED", label: "CONFIRMED" },
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
  { value: "INITIAL_CONSULT", label: "New Patient (Initial Visit)" },
  { value: "FOLLOW_UP", label: "Returning Patient (Follow up)", selected: true }
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
  refForm.value?.validate().then(async ({ valid }) => {
    console.log('props.event', props.event)
    let result = formatDateTime(props.event.extendedProps.date, props.event.extendedProps.start_time, props.event.extendedProps.end_time);
    props.event.start = result.start
    props.event.end = result.end
    console.log(valid)
    if (valid) {
      await calanderStore.addEvent(props.event)
      resetEvent()
      refForm.value?.resetValidation();
      allowedDates.value = [];
      isDrawerOpen.value = false
      emit('update:isDrawerOpen', false)
      emit('formSubmitted'); // Notify the parent component
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
    //refForm.value?.reset()
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


const dialogModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}



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
const handleDrawerModelValueUpdate = (val) => {
  emit('update:isDrawerOpen', val); // Emit the updated state to the parent
};


</script>

<template>

  <VNavigationDrawer temporary location="end" :model-value="isDrawerOpen" width="400" :border="0"
    class="scrollable-content" @update:model-value="handleDrawerModelValueUpdate">
    <!-- 👉 Header -->
    <AppDrawerHeaderSection :title="props.event.id ? $t('Update Appointment') : $t('Add Appointment')"
      @cancel="isDrawerOpen = false; emit('update:isDrawerOpen', false)">
      <!-- <template #beforeClose>
        <IconBtn
          v-show="event.id"
          @click="removeEvent"
        >
          <VIcon
            size="18"
            icon="tabler-trash"
          />
        </IconBtn>
      </template> -->
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
                <AppSelect v-model="props.event.extendedProps.practitioner_id" :label="$t('Practitioner')" placeholder=""
                  :items="practitionerStore.practitioners" item-value="id" item-title="fullName" />
              </VCol>
              <VCol cols="12">

                <AppSelect v-model="props.event.extendedProps.patient_id" :label="$t('Patient')" :items="patientStore.patients"
                  item-value="id" item-title="demographic.fullName" placeholder="" />
              </VCol>
              <!-- 👉 Title -->
              <VCol cols="12">
                <AppTextField v-model="props.event.title" :label="$t('Title')" placeholder="Meeting with Jane"
                  :rules="[requiredValidator]" disabled />
              </VCol>

              <!-- 👉 Calendar -->


              <VCol cols="12">

                <AppSelect v-model="props.event.extendedProps.date" :label="$t('Date')" :placeholder="$t('Select Date')"
                  :items="allowedDates" :rules="[requiredValidator]" :disabled="allowedDates.length === 0" />

              </VCol>
              <!-- 👉 Start date -->
              <VCol cols="12">
                <AppSelect v-model="props.event.extendedProps.start_time" :label="$t('Start')" placeholder=""
                  :items="providerSlots" item-value='value' item-title="slot" :rules="[requiredValidator]" />
              </VCol>

              <!-- 👉 End date -->



              <VCol cols="12">
                <AppSelect v-model="props.event.extendedProps.service" :label="$t('Service')" :placeholder="$t('Service')"
                  :items="services" item-value="value" item-title="label" />
              </VCol>

              <VCol cols="12">
                <AppSelect v-model="props.event.extendedProps.status" :label="$t('Status')" :placeholder="$t('Status')"
                  :items="eventStatuses" item-value="value" item-title="label" :rules="[requiredValidator]" />
              </VCol>





              <VCol cols="12">
                <AppSelect v-model="props.event.extendedProps.appointment_type" :label="$t('Appointment Type')"
                  :placeholder="$t('Appointment Type')" :items="appointmentTypes" item-value="value"
                  item-title="label" />
              </VCol>

              <VCol cols="12">
                <AppSelect v-model="props.event.extendedProps.payment_type" :label="$t('Payment Type')"
                  :placeholder="$t('Payment Type')" :items="paymentTypes" item-value="value" item-title="label" />
              </VCol>



              <!-- 👉 Description -->
              <VCol cols="12">
                <AppTextarea v-model="props.event.extendedProps.notes"  :label="$t('Description')"
                  :placeholder="$t('description')" />
              </VCol>

              <!-- 👉 Form buttons -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3">
                  {{ $t('Submit')}}
                </VBtn>
                <VBtn variant="outlined" color="secondary" @click="onCancel">
                  {{ $t('Cancel')}} 
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
