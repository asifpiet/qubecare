import axios from 'axios';
import { ofetch } from 'ofetch';
// Declare reusable variables
const clientId = 'L31xI_99M2_atm565sWplF6XVTLliDID6u7ZQwF6Y7U';
const clientSecret = 'yu2Mo4550dtl5Fi_HrdGKHjRPTXcfUZLvKeLY5_za0Qi5tIts3HY6PTKt9dfFANX7y8GaLLFJn6WMOAjh0OeCg';
const baseUrl = 'https://erm.codelfi.com';
const userData = useCookie('userData')
// Initialize your API instance
export const $api = ofetch.create({
  baseURL: BASE_URL || '/api',
  async onRequest({ options }) {
    const { currentRole } = GLOBAL_VARIABLE.useAuth

    const accessToken = getCurrentAccessToken();
    console.log('accessToken', accessToken)
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        AccessToken: `${accessToken}`
      };
    }
  },
  async onResponse({ response }) {

    if (response.status == '401') {
      useCookie('accessToken').value = null
      userData.value = null

      useCookie('userAbilityRules').value = null
      try {
        console.log('GLOBAL_VARIABLE.ability ==== ', GLOBAL_VARIABLE.ability)
        GLOBAL_VARIABLE.ability.update([]);
      } catch (error) { }
      console.log('window.location.href', window.location.href)
      if (response.url.includes('login'))
        return
      if (window.location.href.includes('affiliate')) {
        await GLOBAL_VARIABLE.route.push('/affiliate/login')
      } else if (window.location.href.includes('partner')) {
        await GLOBAL_VARIABLE.route.push('/partner/login')
      }
      else if (window.location.href.includes('patient')) {
        await GLOBAL_VARIABLE.route.push('/patient/login')
      } else {
        await GLOBAL_VARIABLE.route.push('/provider/login')
      }

    }
    if (response.status == '403') {
      GLOBAL_VARIABLE.route.push('/not-authorized')
    }

    //console.log(response)
  },
  async onResponseError({ response }) {
    // Handle error responses
    console.error('API Error:', response.status, response.statusText, response._data);

  },
});

/**
 * Function to get access token from the authentication server
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Token data containing access and refresh tokens
 */
export async function getAccessToken(email, password) {
  try {
    const response = await axios.post(`${baseUrl}/oauth2/default/token`, {
      grant_type: 'password',
      client_id: clientId,
      client_secret: clientSecret,
      username: email,
      password: password,
      scope: 'openid offline_access api:oemr user/patient.read user/patient.write user/drug.read user/appointment.read user/appointment.write patient/patient.read patient/appointment.read user/encounter.read user/encounter.write',
    });

    const tokenData = await response.json();

    if (!tokenData.access_token) {
      throw new Error('Authentication failed');
    }

    // Set the token in the cookie for future requests
    useCookie('accessToken').value = tokenData.access_token;

    return {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenType: tokenData.token_type,
      expiresIn: tokenData.expires_in,
    };
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

/**
 * Function to fetch patient details using email
 * @param {string} email
 * @param {string} accessToken
 * @returns {Promise<Object>} Patient data
 */

export async function getPatientDetails(email, accessToken) {
  try {
    const response = await axios.get(`${baseUrl}/apis/default/api/patient`, {
      params: {
        email: email,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    const patientData = response.data;

    if (!patientData.data || patientData.data.length === 0) {
      throw new Error('Patient not found');
    }

    return patientData.data[0]; // Assuming patient data is at index 0
  } catch (error) {
    console.error('Error fetching patient details:', error);
    throw error;
  }
}


/**
 * Main login function combining the token request and patient details
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Token and patient details
 */
export async function login(email, password) {

  // console.log('loginData', email, password);
  try {
    // Step 1: Get access token
    const tokenData = await getAccessToken(email, password);

    // Step 2: Retrieve patient details
    const patientDetails = await getPatientDetails(email, tokenData.accessToken);

    // Return both token and patient details
    return {
      ...tokenData,
      patientDetails,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
