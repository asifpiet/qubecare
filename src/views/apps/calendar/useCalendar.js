import { useProviderStore } from '@/stores/providerStore'
import { useCalendarStore } from '@/views/apps/calendar/useCalendarStore'
import { useConfigStore } from '@core/stores/config'
import allLocale from '@fullcalendar/core/locales-all'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useI18n } from "vue-i18n"
export const blankEvent = {
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    /*
      ℹ️ We have to use undefined here because if we have blank string as value then select placeholder will be active (moved to top).
      Hence, we need to set it to undefined or null
    */
    calendar: 'Business',
    guests: [],
    date: '',
    practitioner_id: '',
    patient_id: '',
    patinent_uuid: '',
    start_time: '',
    end_time: '',
    service: '',
    status: '',
    location: '',
    room: '',
    appointment_type: 'telehealth_visit',
    payment_type: '',
    notes: '',
  },
}

export const useCalendar = (event, isEventHandlerSidebarActive, isLeftSidebarOpen) => {
  const configStore = useConfigStore()
  const store = useCalendarStore()
  const providerStore = useProviderStore()
  const refCalendar = ref()
  const { locale } = useI18n();
  // 👉 Calendar colors
  const calendarsColor = {
    Business: 'primary',
    Holiday: 'success',
    Personal: 'error',
    Family: 'warning',
    ETC: 'info',
  }

  watch(() => providerStore.langauge,
    (newLang) => {
      nextTick(() => {
        if (refCalendar.value) {
          const api = refCalendar.value.getApi();
          api.setOption('locale', newLang);
          api.render(); // Force a re-render
        }
      });
    });

  // ℹ️ Extract event data from event API
  const extractEventDataFromEventApi = eventApi => {
    const {
      id,
      title,
      start,
      end,
      url,
      extendedProps: {
        calendar,
        guests,
        date,
        practitioner_id,
        patient_id,
        patinent_uuid,
        start_time,
        end_time,
        status,
        room,
        service,
        location,
        appointment_type,
        payment_type,
        notes,
      },
      allDay,
    } = eventApi

    return {
      id,
      title,
      start,
      end,
      url,
      extendedProps: {
        calendar,
        guests,
        date,
        practitioner_id,
        patient_id,
        patinent_uuid,
        start_time,
        end_time,
        status,
        room,
        service,
        location,
        appointment_type,
        payment_type,
        notes,
      },
      allDay,
    }
  }

  // Initial fetch on server
  if (typeof process !== 'undefined' && process.server) {
    store.fetchEvents()
  }

  const formatTimeToUppercase = (inputTime) => {

    return inputTime //inputTime.replace(/\bam\b/i, "AM").replace(/\bpm\b/i, "PM");
  }

  // 👉 Fetch events with date range
  const fetchEvents = (info, successCallback) => {
    if (!info)
      return

    // Create precise date range for the current month
    const year = info.start.getUTCFullYear()
    const month = info.start.getUTCMonth()

    // Create exact start of the month
    const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0))

    // Create exact end of the month
    const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999))

    // Convert to ISO strings
    const startDateISO = startDate.toISOString()
    const endDateISO = endDate.toISOString()

    console.log('Precise Month Dates:', {
      startDateISO,
      endDateISO,
      targetMonth: month
    })

    store.fetchEvents(startDateISO, endDateISO)
      .then(r => {

        const processedEvents = r.map(e => ({
          ...e,
          date: e.date,
          start: e.start,
          end: e.end,
          start_time: formatTimeToUppercase(e.start_time),
          end_time: formatTimeToUppercase(e.end_time),
          calendar: e.status === 'NO_SHOW'
                    ? 'Family'
                    : ['CANCELLED', 'CANCELLATION_LATE', 'CANCELLATION_BY_PROVIDER'].includes(e.status)
                      ? 'Personal'
                      : e.status === 'CONFIRMED'
                        ? 'Business'
                        : 'Business',
        }))
        console.log(processedEvents)
        // Strictly filter events to be within the current month
        const filteredEvents = processedEvents.filter(event => {
          const eventStart = new Date(event.start)
          return eventStart.getUTCFullYear() === year &&
            eventStart.getUTCMonth() === month
        })

        successCallback(filteredEvents)
      })
      .catch(e => {
        console.error('Error occurred while fetching calendar events', e)
      })
  }

  // 👉 Calendar API
  const calendarApi = ref(null)

  // 👉 Update event in calendar [UI]
  const updateEventInCalendar = (updatedEventData, propsToUpdate, extendedPropsToUpdate) => {
    console.log('updating event', updatedEventData)
    calendarApi.value = refCalendar.value.getApi()

    const existingEvent = calendarApi.value?.getEventById(String(updatedEventData.id))
    if (!existingEvent) {
      console.warn('Can\'t found event in calendar to update')
      return
    }

    // Set event properties except date related
    // Docs: https://fullcalendar.io/docs/Event-setProp
    for (let index = 0; index < propsToUpdate.length; index++) {
      const propName = propsToUpdate[index]
      existingEvent.setProp(propName, updatedEventData[propName])
    }

    // Set date related props
    // Docs: https://fullcalendar.io/docs/Event-setDates
    existingEvent.setDates(updatedEventData.start, updatedEventData.end, { allDay: updatedEventData.allDay })

    // Set event's extendedProps
    // Docs: https://fullcalendar.io/docs/Event-setExtendedProp
    for (let index = 0; index < extendedPropsToUpdate.length; index++) {
      const propName = extendedPropsToUpdate[index]
      existingEvent.setExtendedProp(propName, updatedEventData.extendedProps[propName])
    }
  }

  // 👉 Remove event in calendar [UI]
  const removeEventInCalendar = eventId => {
    const _event = calendarApi.value?.getEventById(eventId)
    if (_event)
      _event.remove()
  }

  // 👉 refetch events
  const refetchEvents = async () => {
    console.log('calendarApi.value', refCalendar.value?.getApi())
    refCalendar.value?.getApi()?.refetchEvents()
  }

  watch(() => store.selectedCalendars, refetchEvents)

  // 👉 Add event
  const addEvent = async _event => {
    await store.addEvent(_event)
      .then(async() => {
        await refetchEvents()
      })
  }

  // 👉 Update event
  const updateEvent = async _event => {
    await store.updateEvent(_event)
      .then(r => {
        const propsToUpdate = ['id', 'title', 'start', 'end', 'url']
        const extendedPropsToUpdate = [
          'calendar',
          'guests',
          'date',
          'practitioner_id',
          'patient_id',
          'patinent_uuid',
          'start_time',
          'end_time',
          'status',
          'room',
          'service',
          'location',
          'appointment_type',
          'payment_type',
          'notes',
        ]
        console.log('r', r)
        updateEventInCalendar(r, propsToUpdate, extendedPropsToUpdate)
      })
    await refetchEvents()
  }

  // 👉 Remove event
  const removeEvent = eventId => {
    store.removeEvent(eventId).then(() => {
      // removeEventInCalendar(eventId)
      refetchEvents()
    })
  }

  const formatDateToYYYYMMDD = (dateString) => {
    const date = new Date(dateString)
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 👉 Calendar options
  const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    timeZone: 'UTC',
    fixedWeekCount: false,
    showNonCurrentDates: false,
    initialView: 'dayGridMonth',
    locale: providerStore.langauge,
    locales: allLocale,
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true, // Ensures 12-hour format
    },
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    },
    views: {
      dayGridMonth: {
        type: 'dayGrid',
        duration: { months: 1 },
        dateIncrement: { months: 1 },
      }
    },
    eventConstraint: {
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    },
    headerToolbar: {
      start: 'drawerToggler,prev,next title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
    },
    events: fetchEvents,

    // ❗ We need this to be true because when its false and event is allDay event and end date is same as start data then Full calendar will set end to null
    forceEventDuration: true,
    editable: true,
    eventResizableFromStart: true,
    dragScroll: true,
    dayMaxEvents: 2,
    navLinks: true,

    eventClassNames({ event: calendarEvent }) {
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]
      return [
        `bg-light-${colorName} text-${colorName}`,
      ]
    },

    eventClick({ event: clickedEvent, jsEvent }) {
      jsEvent.preventDefault()

      if (clickedEvent.url) {
        window.open(clickedEvent.url, '_blank')
      }
      console.log('Clicked event:', clickedEvent)
      event.value = extractEventDataFromEventApi(clickedEvent)
      event.value.extendedProps.date = formatDateToYYYYMMDD(clickedEvent.start)
      isEventHandlerSidebarActive.value = true
    },

    dateClick(info) {
      event.value = {
        ...event.value,
        start: info.date,
        extendedProps: {
          ...event.value.extendedProps,
          date: info.dateStr
        }
      }
      isEventHandlerSidebarActive.value = true
    },

    eventDrop({ event: droppedEvent }) {
      updateEvent(extractEventDataFromEventApi(droppedEvent))
    },

    eventResize({ event: resizedEvent }) {
      if (resizedEvent.start && resizedEvent.end)
        updateEvent(extractEventDataFromEventApi(resizedEvent))
    },

    customButtons: {
      drawerToggler: {
        text: 'calendarDrawerToggler',
        click() {
          isLeftSidebarOpen.value = true
        },
      },
    },
  }

  // 👉 onMounted
  onMounted(() => {
    calendarApi.value = refCalendar.value.getApi()
  })

  // 👉 Jump to date on sidebar(inline) calendar change
  const jumpToDate = currentDate => {
    calendarApi.value?.gotoDate(new Date(currentDate))
  }

  // Watch for RTL changes
  watch(() => configStore.isAppRTL, val => {
    calendarApi.value?.setOption('direction', val ? 'rtl' : 'ltr')
  }, { immediate: true })

  return {
    refCalendar,
    calendarOptions,
    refetchEvents,
    fetchEvents,
    addEvent,
    updateEvent,
    removeEvent,
    jumpToDate,
  }
}
