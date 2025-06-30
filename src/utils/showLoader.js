import { useAppStore } from '@/stores/appStore';
import moment from 'moment-timezone';
import pako from 'pako';
export const showLoader = () => {
    const appStore = useAppStore()
    appStore.showLoader = true
}

export const hideLoader = () => {
    const appStore = useAppStore()
    console.log('hideLoader');
    appStore.showLoader = false
}

export const addAlert = (message, type = 'success') => {
    const appStore = useAppStore()
    appStore.alerts.push({ message, type, show: true })
}

export const removeAlert = (alert) => {
    const appStore = useAppStore()
    const index = appStore.alerts.indexOf(alert)
    appStore.alerts.splice(index, 1)
}
const timezoneMap = {
    'EST': 'America/New_York',
    'PST': 'America/Los_Angeles',
    'CST': 'America/Chicago',
    'MST': 'America/Denver',
    'UTC': 'UTC',
};


export const findTimezone = (abbreviation) => {
    const timezone = timezoneMap[abbreviation.toUpperCase()];
    if (!timezone) {
        throw new Error(`Timezone abbreviation ${abbreviation} not found`);
    }
    return timezone;
};


export const dateFormat = (date, format = 'MM-DD-YYYY') => {
    try {

        const { currentUser } = useAuth()
        let timzoneFound = currentUser.value.time_zone ?? "America/New_York"
        const timezone = timzoneFound//findTimezone(timzoneFound);
        // return DateTime.fromFormat(date, format, { zone: timzoneFound }).toFormat(format);
        return moment.utc(date).tz(timzoneFound).format(format);


    } catch (error) {
        console.error('Timezone formatting error:', error);
        return null;
    }
};

export const dtFormat = (date) => {
    if (!date) return '';
    const parts = date.split("-"); // ["1989", "04", "20"]
    return `${parts[1]}-${parts[2]}-${parts[0]}`;
}
export const timeFormat = (date, format = 'HH:mm:ss') => {
    try {

        const { currentUser } = useAuth()
        let timzoneFound = currentUser.value.time_zone
        const timezone = timzoneFound//findTimezone(timzoneFound);
        return moment.utc(date).tz(timzoneFound).format(format)//DateTime.fromFormat(date, format, timzoneFound).toFormat(format); //moment(date).tz(timzoneFound).format(format);

    } catch (error) {
        console.error('Timezone formatting error:', error);
        return null;
    }
};
export const dateTimeFormat = (date, format = 'MM-DD-YYYY HH:mm:ss') => {
    try {

        const { currentUser } = useAuth()
        let timzoneFound = currentUser.value.time_zone

        return moment.utc(date).tz(timzoneFound).format(format);

    } catch (error) {
        console.error('Timezone formatting error:', error);
        return null;
    }
};

export const appointmenDateFormate = (date, format = 'MM-DD-YYYY HH:mm:ss') => {
    try {

        const { currentUser } = useAuth()
        let timzoneFound = currentUser.value.time_zone

        let originalDate = moment.utc(date).tz(timzoneFound).format(format);
        return moment(originalDate, 'MM-DD-YYYY hh:mm A').format('MMM D, YYYY hh:mm A');

    } catch (error) {
        console.error('Timezone formatting error:', error);
        return null;
    }
};



export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
    // Handle null, undefined, or invalid input
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '0.00';
    }

    // Parse the amount to ensure it's a number
    const numericAmount = parseFloat(amount);

    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numericAmount);

    } catch (error) {
        console.error('Currency formatting error:', error);
        // Fallback format if Intl fails
        return `${currency} ${numericAmount.toFixed(2)}`;
    }
};



export const encodeToBase64 = (jsonObj) => {
    const jsonString = JSON.stringify(jsonObj);

    // Compress the JSON string using gzip
    const compressedData = pako.deflate(jsonString, { level: 9 }); // level: 9 is maximum compression

    // Encode the compressed data to Base64
    const base64String = btoa(String.fromCharCode.apply(null, compressedData));

    // Make Base64 string URL-safe
    const urlSafeBase64String = base64String
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');


    return urlSafeBase64String;
}

export const decodeFromBase64 = (urlSafeBase64String) => {


    // Convert URL-safe Base64 string back to standard Base64
    const base64String = urlSafeBase64String
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    // Add padding if necessary
    const padding = base64String.length % 4;
    const paddedBase64String = base64String + '='.repeat(padding ? 4 - padding : 0);

    // Decode the Base64 string to binary data
    const binaryString = atob(paddedBase64String);
    const binaryData = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        binaryData[i] = binaryString.charCodeAt(i);
    }

    // Decompress the binary data using gzip
    const decompressedData = pako.inflate(binaryData, { to: 'string' });

    // Convert JSON string back to a JSON object
    const jsonObj = JSON.parse(decompressedData);

    return jsonObj;
}

export const urlSaveDecode = (urlSafeBase64String) => {


    // Convert URL-safe Base64 string back to standard Base64
    const base64String = urlSafeBase64String
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    // Add padding if necessary
    const padding = base64String.length % 4;
    const paddedBase64String = base64String + '='.repeat(padding ? 4 - padding : 0);

    // Decode the Base64 string to binary data
    const binaryString = atob(paddedBase64String);

    return binaryString
}
export const getCurrentAccessToken = () => {
    try {

        const url = window.location.pathname
        const role = getRoleByUri(url)
        console.log('dsdsdsdecdcsxs', role)
        return useCookie(role + '-accessToken').value
    } catch (error) {

    }
}

export const getRoleByUri = (path) => {
    if (path.startsWith('/provider')) return 'provider'
    if (path.startsWith('/patient')) return 'patient'
    if (path.startsWith('/admin')) return 'admin'
    if (path.startsWith('/affiliate')) return 'affiliate'
    if (path.startsWith('/partner')) return 'partner'
    if (path.startsWith('/network')) return 'network'
    if (path.startsWith('/apps')) return 'provider'
    return null
}
