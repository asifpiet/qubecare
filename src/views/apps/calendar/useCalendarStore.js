import { usePatientStore } from "@/stores/patientStore";
import { defineStore } from 'pinia';


export const useCalendarStore = defineStore('calendar', {
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
    async fetchEvents(start, end) {
      const patientStore = usePatientStore()
      const startdate = new Date(start).toISOString().split('T')[0]; // Get YYYY-MM-DD
      const enddate = new Date(end).toISOString().split('T')[0];     // Get YYYY-MM-DD

      console.log('start, end', startdate, enddate);
      await patientStore.calendarAppointments({ start_date: startdate, end_date: enddate })
      console.log('calendar data ', patientStore.appointments)
      console.log('Google calendar data ', patientStore.googleAppointments)
      const combinedArray = [...patientStore.appointments, ...patientStore.googleAppointments]
      return combinedArray
    },
    async addEvent(event) {
      const patientStore = usePatientStore()
      await patientStore.saveCalendarAppointment({
        practitioner_id: event.extendedProps.practitioner_id,
        patient_id: event.extendedProps.patient_id,
        title: event.title,
        date: event.extendedProps.date,
        start_time: event.extendedProps.start_time,
        end_time: event.extendedProps.end_time,
        status: event.extendedProps.status,
        service: event.extendedProps.service,
        location: event.extendedProps.location,
        room: event.extendedProps.room,
        appointment_type: event.extendedProps.appointment_type,
        payment_type: event.extendedProps.payment_type,
        notes: event.extendedProps.notes,
      })
    },
    async updateEvent(event) {
      const patientStore = usePatientStore()

      const isoFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+00:00$/;
      const startTime = event.extendedProps.start_time;
    
      if (!isoFormatRegex.test(startTime)) {
        
        const original = new Date(event.start);
        const utcDate = new Date(original.getTime() + 4 * 60 * 60 * 1000); // Add 4 hours
    
        const formattedUtc = utcDate.toISOString().replace('.000Z', '+00:00');
    
        event.extendedProps.start_time = formattedUtc;
      }
      // return await $api(`/apps/calendar/${event.id}`, {
      //   method: 'PUT',
      //   body: event,
      // })
      let res = await patientStore.saveCalendarAppointment({
        id: event.id,
        practitioner_id: event.extendedProps.practitioner_id,
        patient_id: event.extendedProps.patient_id,
        title: event.title,
        date: event.extendedProps.date,
        start_time: event.extendedProps.start_time,
        end_time: event.extendedProps.end_time,
        status: event.extendedProps.status,
        service: event.extendedProps.service,
        location: event.extendedProps.location,
        room: event.extendedProps.room,
        appointment_type: event.extendedProps.appointment_type,
        payment_type: event.extendedProps.payment_type,
        notes: event.extendedProps.notes,
      }, event.id)
      return res;
    },
    async removeEvent(eventId) {
      const patientStore = usePatientStore()
      console.log('eventId',eventId)
      return await patientStore.cancelAppointment(eventId)
      // return await $api(`/apps/calendar/${eventId}`, {
      //   method: 'DELETE',
      // })
      // await store.dispatch('cancelAppointment',
      //   {
      //     id: eventId
      //   }
      // )
    },
  },
})
