import { createFetch } from '@vueuse/core';
import { destr } from 'destr';
const userData = useCookie('userData')

export const useApi = createFetch({
  baseUrl: BASE_URL || '/api',
  fetchOptions: {
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
    },
  },
  options: {
    refetch: true,
    async beforeFetch({ options }) {
      const { currentRole } = GLOBAL_VARIABLE.useAuth

      const accessToken = getCurrentAccessToken()//useCookie('accessToken').value;
      if (accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
          AccessToken: `${accessToken}`,
        }
      }

      return { options }
    },
    afterFetch(ctx) {
      const { data, response } = ctx


      // Parse data if it's JSON
      let parsedData = null
      try {
        parsedData = destr(data)
      }
      catch (error) {
        console.log(error)
        console.error(error)
      }

      return { data: parsedData, response }
    },
    onFetchResponse(response) {
      console.log(response.status)
    },
    onFetchError(e) {

      if (e.response.status == '401') {
        useCookie('accessToken').value = null
        userData.value = null

        useCookie('userAbilityRules').value = null
        try {
          console.log('GLOBAL_VARIABLE.ability ==== ', GLOBAL_VARIABLE.ability)
          GLOBAL_VARIABLE.ability.update([]);
        } catch (error) { }

        GLOBAL_VARIABLE.route.push('/login')
      }
      if (e.response.status == '403') {
        GLOBAL_VARIABLE.route.push('/not-authorized')
      }
    }
  },
})
