<script setup>
import {
  cardNumberValidator,
  cvvValidator,
  expiryValidator,
  requiredValidator,
} from '@core/utils/validators';
import { onMounted } from 'vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
const store = useStore()
const textTemplate = ref();
const isLoading = ref(false)
const isFormValid = ref(false)
const searchQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const isTonalSnackbarVisible = ref(false)
const isSelectLabDialogVisible = ref(false)
const isAppointmentsDialogVisible = ref(false)
const isEditAppointmentsDialogVisible = ref(false)
const filterAppointments = ref(null)
const lab = ref(null)
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const selectedRows = ref([])
const refForm = ref()
const message = ref();
const isDisable = ref(true);
const currentTab = ref('0')
const fullName = ref();
const filterAppointmentsData = ref([])
const appointments = ref([])
const paymentForm = ref()
const cardNumber = ref('')
const expiry = ref('')
const cvv = ref('')
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
const fullname = computed(() => {
  fullName.value = props.patient.firstName + ' ' + props.patient.lastName;

  console.log("fullname", fullName.value);
})

const updateOptions = options => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}
const headers = [
  {
    title: 'Patient Name',
    key: 'patient',
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
    title: 'Start Time',
    key: 'start_time',
  },
  {
    title: 'Service',
    key: 'service',
  },
  {
    title: 'Satatus',
    key: 'status',
  },
  {
    title: 'Location',
    key: 'location',
  },
  {
    title: 'Notes',
    key: 'notes',
  },
  {
    title: 'Cancel',
    key: 'actions',
  },

]


onMounted(async () => {
  await store.dispatch('getAppointmentsList', { id: 1 });
  appointments.value = store.getters.getAppointments
  console.log(appointments.value)
})


const totalUsers = computed(() => {
  return appointments.value && appointments.value[0]
    ? appointments.value.length
    : 0;
});

const emit = defineEmits([
  'closeForm',
  'patientData'
]);

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
}
const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const editAppointments = async (vid) => {
  isLoading.value = true;
  isEditAppointmentsDialogVisible.value = true;
  let pid = props.patient.id;
  const res = await $api('/api/apps/users/' + pid, {
    method: 'GET',
  });
  filterAppointments.value = res.Appointments.filter(row => row.id === vid)
  console.log("filterAppointments", filterAppointments.value)
  isLoading.value = false;
}

const deleteAppointments = async vid => {
  console.log('filterAppointments', filterAppointmentsData.value[0].Appointments);
  // Get the Appointments array
  let Appointments = filterAppointmentsData.value[0].Appointments;

  isLoading.value = true;

  // Find the index of the row with the matching id
  const index = Appointments.filter(row => row.id === vid);

  // Check if the index exists
  if (index !== -1) {
    // Remove the item from the array
    Appointments.splice(index, 1);

  } else {
    console.log('Row not found');
  }

  // Fetch users (assuming this updates your data)
  // fetchUsers();

  isLoading.value = false;
};

const submitForm = async () => {
  const { valid: isValid } = await paymentForm.value?.validate();
  console.log('isValid ', isValid);
  if (isValid) {
    await processPayment()
    if (!store.getters.getErrorMessage) {
      if (store.getters.getPaymentProcessed) {
        setTimeout(() => {
          router.replace(route.query.to && route.query.to !== '/checkout' ? String(route.query.to) : '/book-appointment')
        }, 5000)
      }
    }

    // else
    //     router.replace(route.query.to && route.query.to != '/checkout' ? String(route.query.to) : '/thankyou')
  }
};
const cardNumberFormat = () => {
  cardNumber.value = cardNumber.value.replace(/\D/g, '').substring(0, 16);

};
const formatExpiry = () => {
  // Automatically format the input to MM/YY format
  expiry.value = expiry.value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d{2})/, '$1/$2');
};
const handleCVVInput = () => {
  // Remove non-digit characters from input
  cvv.value = cvv.value.replace(/\D/g, '');
};
</script>

<template>
  <div v-if="fullname"></div>

  <VDialog v-model="isLoading" width="110" height="150" color="primary">
    <VCardText class="" style="color: white !important;">
      <div class="demo-space-x">
        <VProgressCircular :size="40" color="primary" indeterminate />
      </div>
    </VCardText>
  </VDialog>
  <VSnackbar v-model="isTonalSnackbarVisible" location="top end" variant="flat" color="success">
    Appointments saved.
  </VSnackbar>

  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">

    <AppDrawerHeaderSection :title='"Add Payment (" + fullName + ")"' @cancel="closeNavigationDrawer" />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <VForm ref="paymentForm" @submit.prevent="() => { }">
            <VRow>
              <VCol cols="12" lg="12" md="12">
                <VTextField v-model="cardNumber" label="Credit Card Number*"
                  :rules="[requiredValidator, cardNumberValidator]" placeholder="xxxxxxxxxxxxxxxx"
                  @input="cardNumberFormat" density="comfortable" />
              </VCol>
              <VCol cols="12" lg="6" md="6">
                <VTextField v-model="expiry" label="Expiration Date*" :rules="[requiredValidator, expiryValidator]"
                  placeholder="MM/YY" @input="formatExpiry" density="comfortable" />
              </VCol>
              <VCol cols="12" lg="6" md="6">
                <VTextField v-model="cvv" :rules="[requiredValidator, cvvValidator]" label="CVV*" maxlength="3"
                  @input="handleCVVInput" density="comfortable" />
              </VCol>
            </VRow>
            <div class="text-center mb-2 mt-4">
              <VBtn class="px-4 mb-2" color="primary" @click="submitForm">
                Take Payment</VBtn>

            </div>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
