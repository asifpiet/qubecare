import { $api } from '@/utils/api';
import baseService from './baseService';

class MedicationService extends baseService {


    async getMedicationList(id, src, status) {
        const query = new URLSearchParams({ src, status }).toString();
        const res = await $api(`${GET_PATIENT_MEDICAN_DATA}/${id}?${query}`, {
            method: 'GET',
        });
        return res.data
    }


    async getTemplateMedicineList() {
        const res = await $api(`${GET_MEIDCINE_LIST}`, {
            method: 'GET',
        });

        return res
    }

    async getMedicineList() {
        const res = await $api(`${PRESCRIPTION_TEMPLATE_LIST_API}`, {
            method: 'GET',
        });

        return res
    }

    async getStatusHisotry(id) {
        const res = await $api(`${GET_PRESCRIPTION_HISTORY}/${id}`, {
            method: 'GET',
        });

        return res
    }

    async getPatientStatusHisotry(id) {
        const res = await $api(`${GET_PATIENT_PRESCRIPTION_HISTORY}/${id}`, {
            method: 'GET',
        });

        return res
    }

    async getAffiliateStatusHisotry(id) {
        const res = await $api(`${GET_AFFILIATE_PRESCRIPTION_HISTORY}/${id}`, {
            method: 'GET',
        });

        return res
    }







    async savePrescription(data, id, prescriptionpId) {
        const url = prescriptionpId ? `${UPDATE_PRESCRIPTION}/${prescriptionpId}` : `${SAVE_PRESCRIPTION}/${id}`;
        const method = prescriptionpId ? 'PUT' : 'POST';

        return $api(url, {
            method,
            body: data,
        });
    }

    async updatePrescriptionStaus(needs_followup, numberOfDays, data, signatureNote, status, tracking_number, id) {
        const url = `${UPDATE_PRESCRIPTION_STATUS}/${id}`;
        const method = 'PUT';

        return $api(url, {
            method,
            body: {
                status: status,
                signature: data,
                note: signatureNote,
                tracking_id: tracking_number,
                needs_followup: needs_followup,
                followup_days: numberOfDays
            },
        });
    }

    async deleteStatusHistory(id) {
        let res = await $api(`${DELETE_PRESCRIPTION_HISTORY}/${id}`, {
            method: 'DELETE',
        })

        return res
    }



    async refillPrescriptionRequest(id, data) {
        let res = await $api(`${PATIENT_REORDER_PRESCRIPTION}/${id}`, {
            method: 'POST',
            body: data,
        })
        return res
    }

    async saveMedicine(data, id) {
        const url = data.prescription_id ? `${UPDATE_PATIENT_MEDICAN_DATA}/${data.prescription_id}` : `${STORE_MEDICAN_API}/${id}`;
        const method = data.prescriptions_id ? 'PUT' : 'POST';

        return $api(url, {
            method,
            body: data,
        });
    }

    async getMedicine(id) {
        let res = await $api(`${GET_PATIENT_MEDICAN_DATA_BY_ID}/${id}`, {
            method: 'GET',
        })
        return res.data
    }
    async viewPatientPrescription(id) {
        let res = await $api(`${PATIENT_PORTAL_PRESCRIPTION_BY_ID}/${id}`, {
            method: 'GET',
        })
        return res.data[0]
    }

    async getPrescriptionById(id) {
        let res = await $api(`${GET_PRESCRIPTION_BY_ID}/${id}`, {
            method: 'GET',
        })
        return res
    }
    async getPatientPrescriptionById(id) {
        let res = await $api(`${PATINET_GET_PRESCRIPTION_BY_ID}/${id}`, {
            method: 'GET',
        })
        return res
    }









}

export const medicationService = new MedicationService()
