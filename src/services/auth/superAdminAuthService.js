import { BaseAuthService } from './baseAuthService'
const permissions = [
  {
    "text": "Providers List",
    "permissions": [
      {
        "text": "Providers List View",
        "ability": true
      }
    ]
  },
  {
    "text": "Affiliate Users",
    "permissions": [
      {
        "text": "Affiliate Users View",
        "ability": true
      }
    ]
  },
  {
    "text": "Partners",
    "permissions": [
      {
        "text": "Partners Users View",
        "ability": true
      }
    ]
  },
]
class SuperAdminAuthService extends BaseAuthService {
  constructor() {
    super(
      'admin',
      SUPER_ADMIN_LOGIN_API,
      '/admin/auth/refresh',
      '/admin/auth/logout',
      SUPER_ADMIN_ME
    )
  }

  // If you need any provider-specific profile fetching logic, you can override the fetchProfile method
  async fetchProfile() {
    const profile = await super.fetchProfile()
    profile.permissions = permissions
    return profile
  }


  async providerLogin(id) {
    const response = await $api(SUPER_ADMIN_PROVIDER_LOGIN_API + '/' + id, {
      method: 'GET',
    })

    const { accessToken, refreshToken } = response
    this.setTokensMulti(accessToken, refreshToken, 'provider')

    // await this.fetchProfile()
    return true
  }
  async affiliateLogin(id) {
    const response = await $api(SUPER_ADMIN_AFFILLIATE_LOGIN_API + '/' + id, {
      method: 'GET',
    })

    const { accessToken, refreshToken } = response
    this.setTokensMulti(accessToken, refreshToken, 'affiliate')

    //await this.fetchProfile()
    return true
  }
  async partnerLogin(id) {
    const response = await $api(SUPER_ADMIN_PARTNERS_LOGIN_API + '/' + id, {
      method: 'GET',
    })

    const { accessToken, refreshToken } = response
    this.setTokensMulti(accessToken, refreshToken, 'partner')

    //await this.fetchProfile()
    return true
  }
}

export const superAdminAuthService = new SuperAdminAuthService()
