import { useAuthStore } from '@/stores/authStore'
import { $api } from '@/utils/api'
import { useRouter } from 'vue-router'

export class BaseAuthService {
  constructor(role, loginEndpoint, refreshEndpoint, logoutEndpoint, profileEndpoint) {
    this.role = role
    this.loginEndpoint = loginEndpoint
    this.refreshEndpoint = refreshEndpoint
    this.logoutEndpoint = logoutEndpoint
    this.profileEndpoint = profileEndpoint
  }

  async login(username, password) {
    let data = { username, password }
    const response = await $api(this.loginEndpoint, {
      method: 'POST',
      body: data,
    })

    const { accessToken, refreshToken } = response
    this.setTokens(accessToken, refreshToken)

    // await this.fetchProfile()
    return true
  }

  async refreshToken() {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await $api(this.refreshEndpoint, {
        method: 'POST',
        body: { refreshToken }
      })

      const { accessToken, refreshToken: newRefreshToken } = response
      this.setTokens(accessToken, newRefreshToken)

      return accessToken
    } catch (error) {
      console.error('Failed to refresh token', error)
      this.clearTokens()
      throw error
    }
  }

  async logout() {
    try {
      await $api(this.logoutEndpoint, { method: 'POST' })
    } finally {
      this.clearTokens()
      const authStore = useAuthStore()
      authStore.clearUser()
      const router = useRouter()
      router.push(`/${this.role}/login`)
    }
  }

  setTokens(accessToken, refreshToken) {
    const cookieOptions = { maxAge: undefined, path: '/' }  // Session cookie
    console.log('dsdsdsdsdsdsds', this.role)
    useCookie(this.role + '-accessToken', cookieOptions).value = accessToken
    useCookie(this.role + '-refreshToken', cookieOptions).value = refreshToken
  }
  setTokensMulti(accessToken, refreshToken, role) {
    const cookieOptions = { maxAge: undefined, path: '/' }  // Session cookie

    useCookie(role + '-accessToken', cookieOptions).value = accessToken
    useCookie(role + '-refreshToken', cookieOptions).value = refreshToken
  }
  clearTokens() {
    useCookie(this.role + '-accessToken').value = null
    useCookie(this.role + '-refreshToken').value = null
  }

  getAccessToken() {
    return useCookie(this.role + '-accessToken').value
  }

  getRefreshToken() {
    return useCookie(this.role + '-refreshToken').value
  }

  async fetchProfile() {
    const response = await $api(this.profileEndpoint, { method: 'GET' })
    // const authStore = useAuthStore()
    // authStore.setUser(response, this.role)
    return response
  }

  transformPermissions(permissionsData) {
    const transformedPermissions = [];
    transformedPermissions.push({ action: 'read', subject: 'Profile Update' })
    const processPermissions = (permissions) => {
      for (const permission of permissions) {
        if (permission.ability === true) {
          transformedPermissions.push({
            action: 'read', // Adjust based on your permission model
            subject: permission.text,
          });
        }

        if (permission.children) {
          for (const child of permission.children) {
            if (child.ability === true) {
              transformedPermissions.push({
                action: 'read', // Adjust based on your permission model
                subject: child.text,
              });
            }
          }
        }
      }
    };

    for (const group of permissionsData) {
      processPermissions(group.permissions);
    }
    return transformedPermissions;
  }
}
