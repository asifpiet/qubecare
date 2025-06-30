// import { $api } from '@/utils/api';
import baseService from './baseService';

class PatientRegService extends baseService {

    async getProductByProviderId(id) {
        let res = await $api(`${GET_PATIENT_PRODUCTS_API}/${id}`, {
            method: 'GET',
        })

        return res.data
    }
    async checkPatientEmail(data) {
        let res = await $api(`${GET_PATIENT_EMAIL_CHECK}`, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async loginPatient(data) {
        let res = await $api(`${LOGIN_PATIENT_API}`, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async registerPatient(data) {
        let res = await $api(`${REGISTER_PATIENT}`, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async bookAppointment(data) {
        let res = await $api(`${STORE_PATIENT_BOOK_APPOINTMENT}`, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async saveOrder(data) {
        let res = await $api(`${STORE_PATIENT_ORDER_CREATE}`, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async saveForm(data) {
        let res = await $api(`${STORE_REG_FORM_DATA}`, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async updateOrderState(data, id) {
        let res = await $api(`${UPDATE_ORDER_STATE}/${id}`, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async saveAffiliateOrder(data) {
        let res = await $api(`${STORE_AFFILIATE_PATIENT_ORDER}`, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async bookAffiliateAppointment(data) {
        let res = await $api(`${STORE_AFFILIATE_PATIENT_BOOK_APPOINTMENT}`, {
            method: 'POST',
            body: data,
        })

        return res
    }
}

export const patientRegService = new PatientRegService()
