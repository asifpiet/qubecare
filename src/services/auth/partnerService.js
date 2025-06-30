import { BaseAuthService } from './baseAuthService'

const permissions = [
    {
        "text": "Dashboard Permissions",
        "permissions": [
            {
                "text": "Partner Dashboard View",
                "ability": true
            }
        ]
    },
    {
        "text": "Withdrawal Permissions",
        "permissions": [
            {
                "text": "Partner Withdrawal View",
                "ability": true
            }
        ]
    },
    {
        "text": "Settings Permissions",
        "permissions": [
            {
                "text": "Partner Settings View",
                "ability": true
            }
        ]
    },
    {
        "text": "Providers Permissions",
        "permissions": [
            {
                "text": "Partner Providers View",
                "ability": true
            }
        ]
    },
    {
        "text": "Affiliates Permissions",
        "permissions": [
            {
                "text": "Partner Affiliates View",
                "ability": true
            }
        ]
    },
    {
        "text": "Statements Permissions",
        "permissions": [
            {
                "text": "Partner Statements View",
                "ability": true
            }
        ]
    }
]
class PartnerAuthService extends BaseAuthService {
    constructor() {
        super(
            'partner',
            POST_PARTNER_LOGIN_API,
            '/partner/auth/refresh',
            '/partner/auth/logout',
            GET_PARTNER_ME
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
        const response = await $api(POST_PARTNER_REGISTER_API, {
            method: 'POST',
            body: data,
        })

        const { accessToken, refreshToken } = response
        this.setTokens(accessToken, refreshToken)

        // await this.fetchProfile()
        return true
    }

}

export const partnerAuthService = new PartnerAuthService()
