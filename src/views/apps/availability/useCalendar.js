import { useProviderStore } from '@/stores/providerStore'
import { useCalendarStore } from '@/views/apps/availability/useCalendarStore'
import { useConfigStore } from '@core/stores/config'
import allLocale from '@fullcalendar/core/locales-all'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import moment from 'moment-timezone'
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
    shift_title: '',
    type: 'availability',
    date: '',
    practitioner_id: null,
    start_time: '',
    end_time: '',
    slot_duration: 30,
    service: [],
    location: '',
    billing_facility: '',
    repeats: false,
    repeatFrequency: '',
    repeatUnit: '',
    untilDate: '',
    weakDay: false,
    selectDays: [],
    comment: '',

  },
}

export const useCalendar = (event, isEventHandlerSidebarActive, isLeftSidebarOpen) => {
  const providerStore = useProviderStore()
  const configStore = useConfigStore()
  const store = useCalendarStore()
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
        shift_title,
        type,
        date,
        practitioner_id,
        start_time,
        end_time,
        slot_duration,
        service,
        location,
        billing_facility,
        repeats,
        repeatFrequency,
        repeatUnit,
        untilDate,
        weakDay,
        selectDays,
        comment,
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
        shift_title,
        type,
        date,
        practitioner_id,
        start_time,
        end_time,
        slot_duration,
        service,
        location,
        billing_facility,
        repeats,
        repeatFrequency,
        repeatUnit,
        untilDate,
        weakDay,
        selectDays,
        comment,
      },
      allDay,
    }
  }

  // Initial fetch on server
  if (typeof process !== 'undefined' && process.server) {
    store.fetchEvents()
  }
  const formatDateTime = (date, endTime) => {
    // Convert the 12-hour time format to 24-hour time format  
    const [timePart, modifier] = endTime.split(' '); // Split time and AM/PM  
    let [hours, minutes] = timePart.split(':');

    // Convert hours from 12-hour to 24-hour format  
    if (modifier === 'pm' && hours !== '12') {
      hours = parseInt(hours, 10) + 12; // Convert PM hours  
    } else if (modifier === 'am' && hours === '12') {
      hours = '00'; // Midnight case  
    }

    // Construct the date string in the desired format  
    // Note: The 'Z' indicates UTC, but we will keep it as is  
    // Construct the final date time string directly in the desired format  
    const formattedDateTime = `${date}T${hours}:${minutes}:00.000Z`;

    return formattedDateTime;
  }

  // 👉 Fetch events with date range
  const fetchEvents = (info, successCallback) => {
    if (!info)
      return

    // Get start and end dates from the calendar's current view
    const startDate = info.start.toISOString()
    const endDate = info.end.toISOString()

    const selectedPractitionerId = event.value.extendedProps.practitioner_id;

    store.fetchEvents(startDate, endDate, selectedPractitionerId)
      .then(response => {
        // Log the raw response for debugging  
        console.log('Fetched Events:', response);
        const { currentUser } = GLOBAL_VARIABLE.useAuth
        let timzoneFound = currentUser.value.time_zone
        // Map the response to the structure expected by FullCalendar  
        const events = response.map(event => ({
          id: event.id,
          title: event.fname ? event.fname : event.lname,
          start: moment.utc(event.date + ' ' + event.start_time).tz(timzoneFound).format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z", // Ensure start is a Date object  
          end: moment.utc(event.date + ' ' + event.end_time).tz(timzoneFound).format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z",// Ensure end is a Date object  
          url: '',
          allDay: event.allDay,
          extendedProps: {
            calendar: event.type === 'availability' ? 'Business' : 'ETC',
            guests: [],
            shift_title: event.shift_title,
            type: event.type,
            date: event.date,
            practitioner_id: event.practitioner_id,
            start_time: moment.utc(event.date + ' ' + event.start_time).tz(timzoneFound).format("hh:mm A"),
            end_time: moment.utc(event.date + ' ' + event.end_time).tz(timzoneFound).format("hh:mm A"),
            slot_duration: event.slot_duration,
            service: event.service,
            location: event.facility,
            billing_facility: event.billing_facility,
            repeats: event.repeats,
            repeatFrequency: event.repeatFrequency,
            repeatUnit: event.repeatUnit,
            untilDate: event.untilDate,
            weakDay: event.weakDay,
            selectDays: event.selectDays ? event.selectDays : [],
            comment: event.comment,
          },
        }));
        console.log(events)
        // Return the transformed events to FullCalendar  
        successCallback(events);
      })
      .catch(error => {
        console.error('Error occurred while fetching calendar events:', error);
        // Optionally return an empty array or some fallback data  
        return [];
      });

  }

  // 👉 Calendar API
  const calendarApi = ref(null)

  // 👉 Update event in calendar [UI]
  const updateEventInCalendar = (updatedEventData, propsToUpdate, extendedPropsToUpdate) => {
    console.log('updating event', updatedEventData)
    calendarApi.value = refCalendar.value.getApi()

    const existingEvent = calendarApi.value?.getEventById(String(propsToUpdate.id))
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
  const refetchEvents = () => {
    console.log('calendarApi.value', refCalendar.value?.getApi())
    refCalendar.value?.getApi()?.refetchEvents()
  }

  watch(() => store.selectedCalendars, refetchEvents)

  // 👉 Add event
  const addEvent = _event => {
    store.addEvent(_event)
      .then(() => {
        refetchEvents()
      })
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

  // 👉 Update event
  const updateEvent = _event => {

    store.updateEvent(_event)
      .then(r => {
        const propsToUpdate = ['id', 'title', 'start', 'end', 'url']
        const extendedPropsToUpdate = [
          'calendar',
          'guests',
          'shift_title',
          'type',
          'date',
          'practitioner_id',
          'start_time',
          'end_time',
          'slot_duration',
          'service',
          'location',
          'billing_facility',
          'repeats',
          'repeatFrequency',
          'repeatUnit',
          'untilDate',
          'weakDay',
          'selectDays',

        ]

        updateEventInCalendar(r, propsToUpdate, extendedPropsToUpdate)
      })
    refetchEvents()
  }

  // 👉 Remove event
  const removeEvent = eventId => {
    store.removeEvent(eventId).then(() => {
      removeEventInCalendar(eventId)
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
    slotDuration: '00:15:00', // Set time slots to 15 minutes  
    slotLabelInterval: '00:15:00', // Ensure labels are also in 15-minute intervals  
    slotLabelFormat: { // Format for slot labels  
      hour: '2-digit',
      minute: '2-digit',
      meridiem: 'short', // Use 'AM'/'PM'  
    },
    locale: providerStore.langauge,
    locales: allLocale,
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
    eventContent({ event, view }) {
      // Check the current view and set the title accordingly  
      const isWeekView = view.type === 'timeGridWeek';
      const isDayView = view.type === 'timeGridDay';
      const title = isWeekView ? `${event.title}` : event.title;

      // Format start and end times  
      const startTime = event.extendedProps.start_time;
      const endTime = event.extendedProps.end_time
      if (isWeekView) {
        return {
          html: `  
                    <div class="event-title">${title}</div> 
                    
                `,
        };
      } else if (isDayView) {
        return {
          html: `  
               <div class="event-title">${title}</div>    
            <div class="event-times">  
                 ${startTime}-${endTime}  
            </div>  
              
          `,
        };
      } else {
        return {
          html: `  
                     
                <div class="event-times">  
                    ${title} <br/>${startTime}<br/>${endTime}  
                </div>  
                  
              `,
        };
      }

    },

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

      event.value = extractEventDataFromEventApi(clickedEvent)
      event.value.extendedProps.date = formatDateToYYYYMMDD(clickedEvent.start)
      isEventHandlerSidebarActive.value = true
    },

    dateClick(info) {
      console.log(info)
      const startDate = info.dateStr; // This is the clicked date  
      const endDate = new Date(startDate); // Create a new Date object for the end date  


      endDate.setMinutes(endDate.getMinutes() + 15); // Add 15 minutes  
      const formatTime = (date) => {
        const dateN = new Date(date);
        const options = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };
        return dateN.toLocaleTimeString('en-US', options); // Returns formatted time string in UTC  
      };
      event.value = {
        ...event.value,
        start: info.date,
        end: endDate,
        extendedProps: {
          ...event.value.extendedProps,
          date: info.dateStr,
          untilDate: info.dateStr,
          repeats: true,
          start_time: formatTime(info.dateStr),
          end_time: formatTime(endDate),
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
