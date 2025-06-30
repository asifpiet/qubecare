<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Patient Portal Dashboard View',
  },
})
import Invoice from '@/pages/patient/invoice.vue';
import Upcoming from '@/pages/patient/schedules.vue';
import { usePatientStore } from '@/stores/patientStore';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { VCardText } from 'vuetify/components';
const { t } = useI18n();
const { currentUser, currentRole, logout } = useAuth()
const patientStore = usePatientStore()
patientStore.unloadDateRange()
const isMobile = ref();
const grid = ref(4);
const dateRange = ref('')
onMounted(async () => {

  isMobile.value = window.innerWidth <= 768;
  grid.value = 4;
  if (isMobile.value == true) {
    grid.value = 12;
  }
  dateRange.value = getCurrentMonthRange()

  const [startDate, endDate] = dateRange.value;
  patientStore.start_date = startDate;
  patientStore.end_date = endDate;
  patientStore.getPatientPortalDashboard(currentUser.value.id)
});
watch(dateRange, async (newRange) => {
  console.log('Date range changed:', newRange);

  if (newRange) {
    const [startDate, endDate] = getDatesFromStringRange(newRange);

    if (startDate && endDate) {
      try {
        patientStore.start_date = startDate;
        patientStore.end_date = endDate;
        console.log('Fetching data for range:', startDate, endDate);
        patientStore.getPatientPortalDashboard(currentUser.value.id)
      } catch (error) {
        console.error('Error during API call:', error);
      }
    } else {
      console.warn('Invalid date range after parsing:', newRange);
    }
  }
});


const getDatesFromStringRange = (rangeString) => {
  // Ensure the input is a string
  if (typeof rangeString !== 'string') {
    console.warn('Invalid rangeString:', rangeString);
    return [null, null];
  }

  // Split the string into start and end dates
  const [start, end] = rangeString.split(' to ');

  // Validate that both start and end are valid date strings
  if (!start || !end || isNaN(new Date(start)) || isNaN(new Date(end))) {
    console.warn('Invalid date range values:', { start, end });
    return [null, null];
  }

  // Return the formatted dates
  return [start.trim(), end.trim()];
};


const translatedlogisticData = computed(() => {
  console.log("logisticData", patientStore.logisticData);

  // Convert logisticData to an array if it's not one
  const logisticDataArray = Array.isArray(patientStore.logisticData)
    ? patientStore.logisticData
    : Object.values(patientStore.logisticData); // Convert object to array

  return logisticDataArray.map(data => ({
    ...data,
    title: t(data.title), // Translate title
    isHover: data.isHover || false, // Default value for isHover
    footerText: data.footerText || '', // Default value for footerText
  }));
});



const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the current month
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of the current month

  // Format the date as "YYYY-MM-DD"
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return [formatDate(start), formatDate(end)];
};

const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`; // Adding '$' and fixing to 2 decimal places
}


</script>

<template>
  <VRow class="match-height">
    <VCol :cols="grid">
      <AppDateTimePicker v-model="dateRange" :label="$t('Date Filter')" :placeholder="$t('Select date')"
        :config="{ mode: 'range' }" />
    </VCol>
  </VRow>
  <VRow class="match-height">
    <VCol cols="12">
      <VRow>
        <VCol v-for="(data, index) in translatedlogisticData" :key="index" cols="12" md="4" sm="6">
          <div>
            <VCard class="logistics-card-statistics cursor-pointer"
              :style="data.isHover ? `border-block-end-color: rgb(var(--v-theme-${data.color}))` : `border-block-end-color: rgba(var(--v-theme-${data.color}),0.38)`"
              @mouseenter="data.isHover = true" @mouseleave="data.isHover = false">
              <VCardText>
                <div class="d-flex align-center gap-x-4 mb-1">
                  <VAvatar variant="tonal" :color="data.color" rounded>
                    <VIcon :icon="data.icon" size="28" />
                  </VAvatar>
                  <h4 class="text-h4">
                    {{ data.value }}
                  </h4>
                </div>
                <div class="text-body-1 mb-1">
                  {{ data.title }}
                </div>
              </VCardText>
            </VCard>
          </div>
        </VCol>
      </VRow>
    </VCol>
    <VCol cols="12">
      <!-- <VCard> -->
      <Upcoming />
      <!-- </VCard> -->
    </VCol>
    <!-- <VCol cols="12">
      <VCard :title="$t('Appointment Statistics')">
        <ApexChartAppointment :startDate="patientStore.start_date" :endDate="patientStore.end_date" />
      </VCard>
    </VCol> -->
    <VCol cols="12">
      <Invoice class="pt-5" :startDate="patientStore.start_date" :endDate="patientStore.end_date" />
    </VCol>



  </VRow>
</template>
<style lang="scss" scoped>
@use "@core/scss/base/mixins" as mixins;

.logistics-card-statistics {
  border-block-end-style: solid;
  border-block-end-width: 2px;

  &:hover {
    border-block-end-width: 3px;
    margin-block-end: -1px;

    @include mixins.elevation(8);

    transition: all 0.1s ease-out;
  }
}

.skin--bordered {
  .logistics-card-statistics {
    border-block-end-width: 2px;

    &:hover {
      border-block-end-width: 3px;
      margin-block-end: -2px;
      transition: all 0.1s ease-out;
    }
  }
}
</style>
