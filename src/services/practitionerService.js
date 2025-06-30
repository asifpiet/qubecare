import { $api } from '@/utils/api'
import baseService from './baseService'

class PractitonerService extends baseService {


    async getPractitionersList() {
        let res = await $api(GET_PRACTITIONER_LIST, {
            method: 'GET',
        })

        return res.data.map(this.mapPractitionerData)
    }

    async affiliatePatientPractitionersList(id) {
        let res = await $api(`${GET_AFFIIATE_PATIENT_PRACTITIONERLIST}/${id}`, {
            method: 'POST',
        })

        return res.data
    }


    async getLocationsList() {
        let res = await $api(LOCATIONS_API, {
            method: 'GET',
        })

        return res.data
    }
    async getLoggedInPractitioner(id) {
        let res = await $api(`${GET_PROVIDER_ME}`, {
            method: 'GET',
        })

        return res.userData
    }

    async getPractitionerSlots(data, id) {
        return await $api(`${GET_AVAILABLE_SLOTS_DATA}/${id}`, {
            method: 'POST',
            body: data,
        })
    }

    async getPractitionerProfile(id) {
        let res = await $api(`${GET_PROVIDER_API}/${id}`, {
            method: 'GET',
        })

        return res.data
    }
    async getAdminProfile(id) {
        let res = await $api(`${SUPER_ADMIN_USER_PROFILE}/${id}`, {
            method: 'GET',
        })

        return res.data
    }

    async updatePractitionerProfile(data, id) {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        return await $api(`${UPDATE_PROVIDER_API}/${id}`, {
            method: 'POST',
            body: formData,
        })
    }
    async updateAdminProfile(data, id) {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        return await $api(`${SUPER_ADMIN_UPDATE_USER}/${id}`, {
            method: 'POST',
            body: formData,
        })
    }
    mapPractitionerData(data) {
        return {
            ...data,
            fullName: `${data.fname} ${data.lname}`,
            id: `${data.id}`,
        }
    }

    async getUpcomingAppointments(data) {
        let res = await $api(`${GET_PROVIDER_UPCOMMING_APPOINTMENTS}`, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async savePassword(data) {
        let res = await $api(`${SAVE_PROVIDER_PASSWORD}/${data.token}`, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async getPractitionerProducts() {
        let res = await $api(`${GET_PRODUCT_API}`, {
            method: 'GET',
        })

        return res
    }

    async getPractitionerInfoUnAuth(id) {
        let res = await $api(`${GET_PRACTITIONER_DATA_BY_UUID}/${id}`, {
            method: 'GET',
        })

        return res
    }

    async getHubSpotAuth(id) {
        let res = await $api(`${GET_HUBSPOT_AUTH}/${id}`, {
            method: 'GET',
        })

        return res
    }


}

export const practitonerService = new PractitonerService()
