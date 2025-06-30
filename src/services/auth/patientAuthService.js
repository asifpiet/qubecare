import { BaseAuthService } from './baseAuthService'
const permissions = [
  {
    "text": "Patient Dashboard Permissions",
    "permissions": [
      {
        "text": "Patient Portal Dashboard View",
        "ability": true
      }
    ]
  },
  {
    "text": "Schedule Permissions",
    "permissions": [
      {
        "text": "Patient Schedules View",
        "ability": true
      }
    ]
  },
  {
    "text": "Notes Permissions",
    "permissions": [
      {
        "text": "Notes View",
        "ability": true
      }
    ]
  },
  {
    "text": "Prescription Permissions",
    "permissions": [
      {
        "text": "Prescription View",
        "ability": true
      }
    ]
  },

  {
    "text": "Document Permissions",
    "permissions": [
      {
        "text": "Patient Document View",
        "ability": true
      }
    ]
  },

  {
    "text": "Documents Download Permissions",
    "permissions": [
      {
        "text": "Patient Documents Download View",
        "ability": true
      }
    ]
  },

  {
    "text": "Forms Permissions",
    "permissions": [
      {
        "text": "Patient Forms View",
        "ability": true
      }
    ]
  },



  {
    "text": "Billing Permissions",
    "permissions": [
      {
        "text": "Patient Billing View",
        "ability": true
      }
    ]
  },







  {
    "text": "Invoices Permissions",
    "permissions": [
      {
        "text": "Patient Invoices View",
        "ability": true
      }
    ]
  },

  {
    "text": "InvoicesID Permissions",
    "permissions": [
      {
        "text": "Patient InvoicesID View",
        "ability": true
      }
    ]
  },
  {
    "text": "Calander Permissions",
    "permissions": [
      {
        "text": "Patient Calender View",
        "ability": true
      }
    ]
  },
  {
    "text": "Help Permissions",
    "permissions": [
      {
        "text": "Patient Help View",
        "ability": true
      }
    ]
  },
  {
    "text": "Appointments Permissions",
    "permissions": [
      {
        "text": "Patient Appointments Add",
        "ability": true
      }
    ]
  },
  {
    "text": "Edit Appointments Permissions",
    "permissions": [
      {
        "text": "Patient Appointments Edit",
        "ability": true
      }
    ]
  },


  {
    "text": "Withdrawal Permissions",
    "permissions": [
      {
        "text": "Partner Settings View",
        "ability": true
      }
    ]
  },
  {
    "text": "Settings Permissions",
    "permissions": [
      {
        "text": "Patient Settings View",
        "ability": true
      }
    ]
  },
  {
    "text": "Messages",
    "permissions": [
      {
        "text": "Messages View",
        "ability": true
      }
    ]
  }
]
class PatientAuthService extends BaseAuthService {
  constructor() {
    super(
      'patient',
      PATIENT_PORTAL_LOGIN_API,
      '/patient/auth/refresh',
      '/patient/auth/logout',
      GET_PATIENT_ME

    )
  }

  async getProfile() {
    return $api('/patient/profile', { method: 'GET' })
  }

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
    return response
  }

  async justLogin(username, password) {
    let data = { email: username, password }
    const response = await $api(this.loginEndpoint, {
      method: 'POST',
      body: data,
    })
    return response
  }

  async register(data) {
    const response = await $api(REGISTER_PATIENT, {
      method: 'POST',
      body: data,
    })

    const { accessToken, refreshToken } = response
    this.setTokens(accessToken, refreshToken)

    // await this.fetchProfile()
    return response
  }

  async justRegister(data) {
    const response = await $api(REGISTER_PATIENT, {
      method: 'POST',
      body: data,
    })

    // await this.fetchProfile()
    return response
  }

  // Add any patient-specific auth methods here
}

export const patientAuthService = new PatientAuthService()
