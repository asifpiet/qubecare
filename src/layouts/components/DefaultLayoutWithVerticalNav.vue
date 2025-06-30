<script setup>

import navItems from '@/navigation/vertical';
import { themeConfig } from '@themeConfig';
// Components
import Footer from '@/layouts/components/Footer.vue';
import NavBarNotifications from '@/layouts/components/NavBarNotifications.vue';
// import NavSearchBar from '@/layouts/components/NavSearchBar.vue'

import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue';
import UserProfile from '@/layouts/components/UserProfile.vue';
import NavBarI18n from '@core/components/I18n.vue';
// @layouts plugin
import { disconnectKittDashBoard, initAIAssistantDashBoard } from '@/composables/dashboardAi';
import { usePractitionerStore } from '@/stores/practitionerStore';
import { VerticalNavLayout } from '@layouts';
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const { currentUser, currentRole, logout } = useAuth()
const practitionerStore = usePractitionerStore()
const route = useRoute()
const isAIAssistantActive = ref(false);
const isUpcomingAppointments = computed(() => route.path.includes('/provider/calendar'))
const selectedOption = ref('calendar')
const router = useRouter()
const dateRangeOptions = [
  { title: 'Today', value: 'today' },
  { title: 'Last 7 Days', value: 'last7' },
  { title: 'Last 30 Days', value: 'last30' },
  { title: 'This Week', value: 'thisWeek' },
  { title: 'This Month', value: 'thisMonth' },
  // { title: 'Custom', value: 'custom' },
]
console.log(currentUser.value)
const selectedDateRange = ref('today')
const customDateRange = ref(null)

const computeDates = (range) => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1); // First day of current month
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of current month

  // Reset times to ensure full day coverage
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  switch (range) {
    case 'today':
      start.setDate(today.getDate());
      end.setDate(today.getDate());
      break;
    case 'last7':
      start.setDate(today.getDate() - 6);
      end.setDate(today.getDate());
      break;
    case 'last30':
      start.setDate(today.getDate() - 29);
      end.setDate(today.getDate());
      break;
    case 'thisWeek':
      // Week starting Monday
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      end.setDate(diff + 6);
      break;
    case 'thisMonth':
      // No changes needed, as we've already set start and end correctly
      break;
  }

  const formatDate = (date) => date.toISOString().split('T')[0];

  practitionerStore.startDate = formatDate(start);
  practitionerStore.endDate = formatDate(end);

  // Update customDateRange for 'today'
  if (range === 'today') {
    customDateRange.value = [start, end];
  }
};
let aiAssistant = null;
const aiAssistantButton = ref(null);
const startAIAssistant = async () => {

  if (!isAIAssistantActive.value) {
    aiAssistant = initAIAssistantDashBoard(aiAssistantButton.value.$el || aiAssistantButton.value, currentUser.value);
    isAIAssistantActive.value = true;
    // await nextTick(() => {
    //   console.log('Starting AI Assistant... WWW.AI Assistant is now active!', route.query.to);
    //   router.replace(route.query.to ? String(route.query.to) : '/provider/calendar')
    // })
  }
}
const stopAIAssistant = () => {
  if (isAIAssistantActive.value) {
    console.log('Stopping AI Assistant...')
    disconnectKittDashBoard();
    isAIAssistantActive.value = false;
  }
}

// Initialize with today's dates
computeDates('today')

// Watcher for selectedDateRange
watch(selectedDateRange, async (newVal) => {
  console.log('Selected Date Range:', newVal)
  // await practitionerStore.getUpcomingAppointments()
  if (newVal !== 'custom') {
    computeDates(newVal)
    await practitionerStore.getUpcomingAppointments()
    practitionerStore.navUsersToggle = true;
  } else {
    // For custom, use existing store dates or today
    const startISO = practitionerStore.startDate
    const endISO = practitionerStore.endDate

    if (startISO && endISO) {
      const startDate = new Date(startISO)
      const endDate = new Date(endISO)

      customDateRange.value = [
        new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
        new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
      ]

      await practitionerStore.getUpcomingAppointments()
      if (practitionerStore.upcomingAppointments.length > 0)
        practitionerStore.navUsersToggle = true;
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      customDateRange.value = [today, today]
    }
  }
})

// Modify the setCustomDateRange function
const setCustomDateRange = async (dateRange) => {
  console.log('Custom Date Range Received1:', dateRange)

  // if (!dateRange || dateRange.length !== 2) {
  //   console.warn('Invalid date range')
  //   return
  // }

  const [startDate, endDate] = dateRange;

  // Ensure dates are Date objects
  const start = new Date(startDate)
  const end = new Date(endDate)

  // Set start date to beginning of day
  start.setHours(0, 0, 0, 0)

  // Set end date to end of day
  end.setHours(23, 59, 59, 999)

  practitionerStore.startDate = start.toISOString()
  practitionerStore.endDate = end.toISOString()

  // await practitionerStore.getUpcomingAppointments()
  // if (practitionerStore.upcomingAppointments.length > 0)
  //   practitionerStore.navUsersToggle = true;
  // Update store
  nextTick(async () => {

    console.log('Store updated with nextTick', {
      startDate: practitionerStore.startDate,
      endDate: practitionerStore.endDate
    })



  })
}

// Modify the watcher to be more explicit
watch(customDateRange, async (newVal) => {
  console.log('Custom Date Range Changed2:', newVal, newVal.length)

  if (newVal && newVal.length === 24) {
    setCustomDateRange(newVal)

    await practitionerStore.getUpcomingAppointments()
    if (practitionerStore.upcomingAppointments.length > 0)
      practitionerStore.navUsersToggle = true;

  }
}, { deep: true })
</script>

<template>
  <VerticalNavLayout :nav-items="navItems">
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 w-100 align-center ms-auto">
        <IconBtn id="vertical-nav-toggle-btn" class="ms-n3 d-lg-none" @click="toggleVerticalOverlayNavActive(true)">
          <VIcon size="26" icon="tabler-menu-2" />
        </IconBtn>
        <!-- <NavSearchBar class="ms-lg-n3" /> -->

        <VSpacer />
        
        <div v-if="isUpcomingAppointments" style="width: 190px;">
          <VBtnToggle v-model="practitionerStore.navAppointmentToggle" mandatory divided class="toggle-group"
            color="primary" density="compact">
            <VBtn value="calendar" class="toggle-button px-9">
              <VIcon icon="tabler-calendar" /> {{ $t('Calendar') }}
            </VBtn>
            <VBtn value="patients" class="toggle-button px-9">
              <VIcon icon="tabler-user" /> {{ $t('Patient') }}
            </VBtn>
          </VBtnToggle>
        </div>

        <div v-if="practitionerStore.navAppointmentToggle === 'patients' && isUpcomingAppointments"
          style="min-width: 170px; margin-left: 10px;">
          <template v-if="selectedDateRange !== 'custom'">
            <v-select v-model="selectedDateRange" :items="dateRangeOptions" item-title="title" item-value="value"
              hide-details />
          </template>
          <!---<template v-else>
            <v-menu>
              <template v-slot:activator="{ props }">
                <AppDateTimePicker v-model="customDateRange" label="" placeholder="Select date"
                  :config="{ mode: 'range' }" />
              </template>
            </v-menu>
          </template>-->
        </div>
        <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
          :languages="themeConfig.app.i18n.langConfig" />

        <NavbarThemeSwitcher />
        <!-- <NavbarShortcuts /> -->
        <NavBarNotifications class="me-1" v-if="currentRole === 'provider'" />
        <!-- <div class="mr-4 ml-2" v-if="currentUser.user_type === 'provider' || currentUser.user_type === 'practitioner'">
           <button
              class="items-center px-4 py-2 rounded-lg bg-blue-600 text-sm text-white font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              ref="aiAssistantButton" @click="startAIAssistant" v-if="!isAIAssistantActive">
              <i class="fa-solid fa-robot mr-2"></i>
              {{ $t("Addy AI") }}
            
          </button>
          <button
              class="items-center px-4 py-2 rounded-lg bg-red-600 text-sm text-white font-medium hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              ref="aiAssistantButton" @click="stopAIAssistant" v-else>
              <i class="fa-solid fa-robot mr-2"></i>
              {{ $t("Stop Addy AI") }}
            
          </button> 
        </div> -->
        <UserProfile />
      </div>
    </template>

    <slot />

    <template #footer>
      <Footer />
    </template>

    <TheCustomizer />
  </VerticalNavLayout>
</template>

<style scoped>
.toggle-group {
  width: 100%;
}

.toggle-button {
  flex: 1;
  text-transform: none;
}

body .v-btn-group.v-btn-toggle.v-btn-group.v-btn-group--density-compact {
  block-size: 37px !important;
}

body .v-btn-group.v-btn-toggle.v-btn-group {
  padding: 0px !important;
}
</style>
