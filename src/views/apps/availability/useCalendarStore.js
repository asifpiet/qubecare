import store from "@/store";

export const useCalendarStore = defineStore('availability', {
  // arrow function recommended for full type inference
  state: () => ({
    availableCalendars: [
      {
        color: 'error',
        label: 'Personal',
      },
      {
        color: 'primary',
        label: 'Business',
      },
      {
        color: 'warning',
        label: 'Family',
      },
      {
        color: 'success',
        label: 'Holiday',
      },
      {
        color: 'info',
        label: 'ETC',
      },
    ],
    selectedCalendars: ['Personal', 'Business', 'Family', 'Holiday', 'ETC'],
  }),
  actions: {
    async fetchEvents(start, end, practitionerId) {
      // const { data, error } = await useApi(createUrl('/apps/calendar', {
      //   query: {
      //     calendars: this.selectedCalendars,
      //   },
      // }))
      const startdate = new Date(start).toISOString().split('T')[0]; // Get YYYY-MM-DD
      const enddate = new Date(end).toISOString().split('T')[0];     // Get YYYY-MM-DD

      console.log('start, end', startdate, enddate);

      await store.dispatch('fetchFiltereAvailability', { id: 1, calendars: this.selectedCalendars, startDate: startdate, endDate: enddate, practitioner_id: practitionerId })
      console.log('calendar data ', store.getters.getAvailabilityList)
      // if (error.value)
      //   return error.value

      return store.getters.getAvailabilityList
      // .map(appointment => ({
      //   ...appointment,
      //   patient: appointment.patient_id
      // }));
    },
    async addEvent(event) {
      console.log('testtttt=== ', event.end, event.start, event.extendedProps.type)

      if (event.extendedProps.type === 'event') {
        const dayName = new Date(event.start).toLocaleDateString("en-US", { weekday: "long" });
        event.extendedProps.selectDays.push(dayName);

        console.log('here', dayName, event.extendedProps.selectDays)
      }

      await store.dispatch('saveAvailability', {
        practitioner_id: event.extendedProps.practitioner_id,
        shift_title: event.extendedProps.shift_title,
        type: event.extendedProps.type,
        allDay: event.allDay,
        date: event.extendedProps.date,
        end: event.end,
        start: event.start,
        start_time: event.extendedProps.start_time,
        end_time: event.extendedProps.end_time,
        slot_duration: event.extendedProps.slot_duration,
        service: event.extendedProps.service,
        facility: 0,//event.extendedProps.location,
        billing_facility: 0,//event.extendedProps.billing_facility?,
        repeats: event.extendedProps.repeats,
        repeatFrequency: event.extendedProps.repeats ? event.extendedProps.repeatFrequency : '',
        repeatUnit: event.extendedProps.repeats ? event.extendedProps.repeatUnit : '',
        untilDate: event.extendedProps.repeats ? event.extendedProps.untilDate : '',
        weakDay: event.extendedProps.weakDay,
        selectDays: event.extendedProps.repeats ? event.extendedProps.selectDays : '',
        comment: event.extendedProps.comment,

      })
    },
    async updateEvent(event) {
      // return await $api(`/apps/calendar/${event.id}`, {
      //   method: 'PUT',
      //   body: event,
      // })
      if (event.extendedProps.type === 'event') {
        const dayName = new Date(event.start).toLocaleDateString("en-US", { weekday: "long" });
        event.extendedProps.selectDays.push(dayName);

        console.log('here', dayName, event.extendedProps.selectDays)
      }
      return await store.dispatch('updateAvailability', {
        id: event.id,
        practitioner_id: event.extendedProps.practitioner_id,
        shift_title: event.extendedProps.shift_title,
        type: event.extendedProps.type,
        allDay: event.allDay,
        date: event.extendedProps.date,
        end: event.end,
        start: event.start,
        start_time: event.extendedProps.start_time,
        end_time: event.extendedProps.end_time,
        slot_duration: event.extendedProps.slot_duration,
        service: event.extendedProps.service,
        facility: event.extendedProps.location,
        billing_facility: event.extendedProps.billing_facility,
        repeats: event.extendedProps.repeats,
        repeatFrequency: event.extendedProps.repeats ? event.extendedProps.repeatFrequency : '',
        repeatUnit: event.extendedProps.repeats ? event.extendedProps.repeatUnit : '',
        untilDate: event.extendedProps.repeats ? event.extendedProps.untilDate : '',
        weakDay: event.extendedProps.weakDay,
        selectDays: event.extendedProps.repeats ? event.extendedProps.selectDays : '',
        comment: event.extendedProps.comment,


      })
    },
    async removeEvent(eventId) {
      // return await $api(`/apps/calendar/${eventId}`, {
      //   method: 'DELETE',
      // })
      await store.dispatch('deleteAvailability',
        {
          id: eventId
        }
      )
    },
  },
})
