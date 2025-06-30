<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Availability View',
  },
})
import {
  blankEvent,
  useCalendar,
} from '@/views/apps/availability/useCalendar';
import { useCalendarStore } from '@/views/apps/availability/useCalendarStore';
import FullCalendar from '@fullcalendar/vue3';
import { useStore } from 'vuex';
const practitionerOptions = ref([]);
const storeApp = useStore()
// Components
import CalendarEventHandler from '@/views/apps/availability/CalendarEventHandler.vue';

// 👉 Store
const store = useCalendarStore()

// 👉 Event
const event = ref(structuredClone(blankEvent))
const isEventHandlerSidebarActive = ref(false)

watch(isEventHandlerSidebarActive, val => {
  if (!val)
    event.value = structuredClone(blankEvent)
})

const { isLeftSidebarOpen } = useResponsiveLeftSidebar()

// 👉 useCalendar
const { refCalendar, calendarOptions, addEvent, updateEvent, removeEvent, jumpToDate } = useCalendar(event, isEventHandlerSidebarActive, isLeftSidebarOpen)
onMounted(async () => {

  await storeApp.dispatch('getPractitioners')
  const usersFromStore = storeApp.getters.getPractitioners;

  practitionerOptions.value = [
    { user_id: null, fullName: 'All Practitioners' }, // Add the "All" option  
    ...usersFromStore.map(user => ({
      ...user,
      fullName: `${user.fname || ''} ${user.lname || ''}`.trim(),
    }))
  ];


})


// SECTION Sidebar

// 👉 Check all
const checkAll = computed({

  /*GET: Return boolean `true` => if length of options matches length of selected filters => Length matches when all events are selected
SET: If value is `true` => then add all available options in selected filters => Select All
Else if => all filters are selected (by checking length of both array) => Empty Selected array  => Deselect All
*/
  get: () => store.selectedCalendars.length === store.availableCalendars.length,
  set: val => {
    if (val)
      store.selectedCalendars = store.availableCalendars.map(i => i.label)
    else if (store.selectedCalendars.length === store.availableCalendars.length)
      store.selectedCalendars = []
  },
})
const checkAllFilter = (practitionerId) => {
  if (practitionerId === null) {
    console.log('Fetching events for all practitioners');
  } else {
    console.log('Fetching events for practitioner:', practitionerId);

  }
  event.value.extendedProps.practitioner_id = practitionerId;
  // Update practitioner ID based on the dropdown selection  

  // Refetch events   
  refCalendar.value.getApi().refetchEvents();
};
const openDenawer = () => {
  isEventHandlerSidebarActive.value = true
  event.value.extendedProps.practitioner_id = event.value.extendedProps.practitioner_id

}
const refetchEvent = (status) => {
  if (status) {
    refCalendar.value.getApi().refetchEvents();
  }

}
const jumpToDateFn = date => {
  jumpToDate(date)
}
</script>

<template>
  <div>
    <VCard>
      <!-- `z-index: 0` Allows overlapping vertical nav on calendar -->
      <VLayout style="z-index: 0;">
        <!-- 👉 Navigation drawer -->
        <!-- <VNavigationDrawer
          v-model="isLeftSidebarOpen"
          width="292"
          absolute
          touchless
          location="start"
          class="calendar-add-event-drawer"
          :temporary="$vuetify.display.mdAndDown"
        >
          

          <VDivider />

          <div class="d-flex align-center justify-center pa-2">
            <AppDateTimePicker
              :model-value="new Date().toJSON().slice(0, 10)"
              :config="{ inline: true }"
              class="calendar-date-picker"
              @update:model-value="jumpToDateFn"
            />
          </div>

          <VDivider />
          <div class="pa-6">
            <h6 class="text-lg font-weight-medium mb-4">
              Event Filters
            </h6>

            <div class="d-flex flex-column calendars-checkbox">
              <VCheckbox
                v-model="checkAll"
                label="View all"
              />
              <VCheckbox
                v-for="calendar in store.availableCalendars"
                :key="calendar.label"
                v-model="store.selectedCalendars"
                :value="calendar.label"
                :color="calendar.color"
                :label="calendar.label"
              />
            </div>
          </div>
        </VNavigationDrawer> -->

        <VMain>
          <VCard flat>
            <!-- <VCardText class="d-flex flex-wrap gap-4">
                <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
                
                  <div style="inline-size: 15.625rem;">
                    <AppSelect
                        v-model="event.extendedProps.practitioner_id"
                        label="Practitioner"
                        placeholder=""
                        :items="practitionerOptions"
                        item-value="user_id"      
                        item-title="fullName"
                        @update:model-value='checkAllFilter'
                    />
                  </div>

                
                    <VBtn
                          block
                          prepend-icon="tabler-plus"
                          @click="openDenawer"
                          v-if="$can('read', 'Availability Add')"
                        >
                        Add Availability
                  </VBtn>
                </div>
              </VCardText> -->

            <VRow style="padding: 10px;">
              <VCol cols="12" lg="4">
                <AppSelect v-model="event.extendedProps.practitioner_id" :label="$t('Practitioner')" placeholder=""
                  :items="practitionerOptions" item-value="id" item-title="fullName"
                  @update:model-value='checkAllFilter' />

              </VCol>
              <VCol cols="12" lg="4" style="margin-top: 25px;">
                <VBtn block prepend-icon="tabler-plus" @click="openDenawer" v-if="$can('read', 'Availability Add')">
                  {{ $t('Add Availability') }}
                </VBtn>
              </VCol>
            </VRow>

            <FullCalendar ref="refCalendar" :options="calendarOptions" />
          </VCard>
        </VMain>
      </VLayout>
    </VCard>
    <CalendarEventHandler v-model:isDrawerOpen="isEventHandlerSidebarActive" :event="event" @add-event="addEvent"
      @update-event="updateEvent" @remove-event="removeEvent" @refetch-event="refetchEvent" />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/libs/full-calendar";

.calendars-checkbox {
  .v-label {
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
    opacity: var(--v-high-emphasis-opacity);
  }
}

.calendar-add-event-drawer {
  &.v-navigation-drawer:not(.v-navigation-drawer--temporary) {
    border-end-start-radius: 0.375rem;
    border-start-start-radius: 0.375rem;
  }

  &.v-navigation-drawer--temporary:not(.v-navigation-drawer--active) {
    transform: translateX(-110%) !important;
  }
}

.calendar-date-picker {
  display: none;

  +.flatpickr-input {
    +.flatpickr-calendar.inline {
      border: none;
      box-shadow: none;

      .flatpickr-months {
        border-block-end: none;
      }
    }
  }

  &~.flatpickr-calendar .flatpickr-weekdays {
    margin-block: 0 4px;
  }
}

@media screen and (max-width: 1279px) {
  .calendar-add-event-drawer {
    border-width: 0;
  }
}
</style>

<style lang="scss" scoped>
.v-layout {
  overflow: visible !important;

  .v-card {
    overflow: visible;
  }
}
</style>
