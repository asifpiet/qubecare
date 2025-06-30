// import { $api } from '@/utils/api';
import baseService from './baseService';

class InvoiceService extends baseService {

    async getInvoiceState() {
        let res = await $api(`${INVOICE_STATE}`, {
            method: 'GET',
        })

        return res.data
    }

    // async getRoles(id) {
    //     let res = await $api(`${ROLES_LIST_DROPDOWN_API}`, {
    //         method: 'GET',
    //     })

    //     return res.data
    // }

    async saveInvoice(data, id) {
        let res = await $api(id ? `${UPDATE_INVOICE_API}/${id}` : ADD_INVOICE_API, {
            method: id ? 'PUT' : 'POST',
            body: data,
        })
        return res
    }

    async getInvoiceByID(id) {
        let res = await $api(`${INVOICE_GET_BY_ID}/${id}`, {
            method: 'GET',
        })

        return res.data
    }
    async getPatientInvoiceByID(id) {
        let res = await $api(`${PATIENT_GET_INVOICE_BY_ID}/${id}`, {
            method: 'GET',
        })

        return res.data
    }



    async payInvoice(data) {
        let res = await $api(`${PAY_INVOICE}`, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async patientPayInvoice(data) {
        let res = await $api(`${PATIENT_PAY_INVOICE}`, {
            method: 'POST',
            body: data,
        })

        return res
    }


    async getStoredCard(patient_id) {
        let res = await $api(`${GET_STORED_CARD}/${patient_id}`, {
            method: 'GET',
        })

        return res.data
    }

    async getPatientStoredCard(patient_id) {
        let res = await $api(`${PATIENT_GET_STORED_CARD}/${patient_id}`, {
            method: 'GET',
        })

        return res.data
    }



}

export const invoiceService = new InvoiceService()
