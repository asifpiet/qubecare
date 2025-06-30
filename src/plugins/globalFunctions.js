// plugins/globalFunctions.js
export const dateFormate = (isoDate) => {
      // Global function for formatting a date as yyyy-mm-dd
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
      const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
      return `${year}-${month}-${day}`;

}

export const formatTo12Hour = (time) => {
      const [hours, minutes] = time.split(':'); // Split time to exclude seconds
      const date = new Date();
      date.setHours(hours, minutes);

      // Format the time without seconds
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};
export const convertToAmPm = (time) => {
      const [hour, minute, second] = time.split(":").map(Number);
      const period = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 || 12; // Convert hour to 12-hour format, handle 0 as 12
      return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
};

export const dateFormat = (isoDate) => {
      // Global function for formatting a date as yyyy-mm-dd
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
      const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
      return `${month}-${day}-${year}`;

}

export const formatToCustomDate = (isoDate) => {
      const date = new Date(isoDate);

      // Get the month, day, year, hours, and minutes
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();

      // Format hours and minutes
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';

      // Convert to 12-hour format
      hours = hours % 12;
      hours = hours ? String(hours).padStart(2, '0') : '12'; // The hour '0' should be '12'

      return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
};

export const formatToMonthDate = (isoDate) => {
      const date = new Date(isoDate);

      // Get the day, month, and year
      const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
      const year = String(date.getFullYear()).slice(-2);   // Get the last two digits of the year

      // Array of month names
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      // Get the month name
      const month = monthNames[date.getMonth()];

      return `${day}-${month}-${year}`;
};



