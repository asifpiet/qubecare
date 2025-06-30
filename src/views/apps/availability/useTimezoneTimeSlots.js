import moment from 'moment-timezone'

export const useTimezoneTimeSlots = () => {
  // Generate 24 hours of 15-minute slots in the user's timezone
  const generateTimeSlots = (timezone = moment.tz.guess()) => {
    const slots = []
    const today = moment().tz(timezone).startOf('day')
    console.log('today --- ', today)
    // Generate 96 slots (24 hours * 4 quarters)
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const slotTime = today.clone().add(hour, 'hours').add(minute, 'minutes')
        const timeString = slotTime.format('hh:mm A')
        slots.push(timeString)
      }
    }

    return slots
  }

  // Convert a time slot string to UTC moment object
  const slotToUTC = (dateStr, timeStr, timezone) => {
    const [time, period] = timeStr.split(' ')
    const [hours, minutes] = time.split(':')

    const localTime = moment.tz(dateStr, timezone)
      .hours(period === "PM" && hours !== "12" ? parseInt(hours) + 12 : parseInt(hours))
      .minutes(parseInt(minutes));

    // Convert to UTC and return formatted time
    return localTime.tz("UTC").format("hh:mm A");
  }

  // Convert UTC date string to time slot string
  const UTCToSlot = (dateStr, timezone = moment.tz.guess()) => {
    return moment.tz(dateStr, 'UTC')
      .tz(timezone)
      .format('hh:mm A')
  }

  return {
    generateTimeSlots,
    slotToUTC,
    UTCToSlot
  }
}
