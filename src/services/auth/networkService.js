import { BaseAuthService } from './baseAuthService'

const permissions = [
    {
        "text": "Dashboard Permissions",
        "permissions": [
            {
                "text": "Network Dashboard View",
                "ability": true
            }
        ]
    },
    {
        "text": "Products Permissions",
        "permissions": [
            {
                "text": "Network Products View",
                "ability": true
            }
        ]
    },
    {
        "text": "Settings Permissions",
        "permissions": [
            {
                "text": "Network Settings View",
                "ability": true
            }
        ]
    },
]
class NetworkAuthService extends BaseAuthService {
    constructor() {
        super(
            'network',
            POST_NETWORK_LOGIN_API,
            '/network/auth/refresh',
            '/network/auth/logout',
            GET_NETWORK_ME
        )
    }



    // If you need any profile fetching logic, you can override the fetchProfile method
    async fetchProfile() {
        const profile = await super.fetchProfile()
        // You can add any profile processing here
        profile.permissions = permissions
        return profile
    }

    async login(username, password) {
        let data = { email: username, password }
        const response = await $api(this.loginEndpoint, {
            method: 'POST',
            body: data,
        })

        const { accessToken, refreshToken } = response
        this.setTokens(accessToken, refreshToken)
        return true
    }

    async register(data) {
        const response = await $api(POST_NETWORK_REGISTER_API, {
            method: 'POST',
            body: data,
        })

        const { accessToken, refreshToken } = response
        this.setTokens(accessToken, refreshToken)

        // await this.fetchProfile()
        return true
    }

}

export const networkAuthService = new NetworkAuthService()
