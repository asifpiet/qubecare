import { BaseAuthService } from './baseAuthService'

class ProviderAuthService extends BaseAuthService {
  constructor() {
    super(
      'provider',
      LOGIN_API,
      '/provider/auth/refresh',
      '/provider/auth/logout',
      GET_PROVIDER_ME
    )
  }

  // If you need any provider-specific profile fetching logic, you can override the fetchProfile method
  async fetchProfile() {
    const profile = await super.fetchProfile()
    // You can add any provider-specific profile processing here
    return profile
  }
  async register(data) {
    //PROVIDER_REGISTER_API
    const response = await $api(PROVIDER_RIGSTER_AS_PRACTIONER, {
      method: 'POST',
      body: data,
    })

    const { accessToken, refreshToken } = response
    this.setTokens(accessToken, refreshToken)

    // await this.fetchProfile()
    return true
  }
  // Add any other provider-specific auth methods here
}

export const providerAuthService = new ProviderAuthService()
