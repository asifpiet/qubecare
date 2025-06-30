import { BaseAuthService } from './baseAuthService'

const permissions = [
    {
        "text": "Dashboard Permissions",
        "permissions": [
            {
                "text": "Affiliate Dashboard View",
                "ability": true
            }
        ]
    },
    {
        "text": "Withdrawal Permissions",
        "permissions": [
            {
                "text": "Affiliate Withdrawal View",
                "ability": true
            }
        ]
    },
    {
        "text": "Products Permissions",
        "permissions": [
            {
                "text": "Affiliate Products View",
                "ability": true
            }
        ]
    },
    {
        "text": "Settings Permissions",
        "permissions": [
            {
                "text": "Affiliate Settings View",
                "ability": true
            }
        ]
    },
    {
        "text": "Patients Permissions",
        "permissions": [
            {
                "text": "Affiliate Patients View",
                "ability": true
            }
        ]
    },
    {
        "text": "Perscription Permissions",
        "permissions": [
            {
                "text": "Affiliate Prescription View",
                "ability": true
            }
        ]
    },
    {
        "text": "Appointment Permissions",
        "permissions": [
            {
                "text": "Affiliate Appointment View",
                "ability": true
            }
        ]
    },
    {
        "text": "Statements Permissions",
        "permissions": [
            {
                "text": "Affiliate Statements View",
                "ability": true
            }
        ]
    },
    {
        "text": "Reports Permissions",
        "permissions": [
            {
                "text": "Affiliate Reports View",
                "ability": true
            }
        ]
    }
]
class AffiliateAuthService extends BaseAuthService {
    constructor() {
        super(
            'affiliate',
            POST_AFFILIATE_LOGIN_API,
            '/affiliate/auth/refresh',
            '/affiliate/auth/logout',
            GET_AFFILIATE_ME
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
        const response = await $api(POST_AFFILIATE_REGISTER_API, {
            method: 'POST',
            body: data,
        })

        const { accessToken, refreshToken } = response
        this.setTokens(accessToken, refreshToken)

        // await this.fetchProfile()
        return true
    }

}

export const affiliateAuthService = new AffiliateAuthService()
