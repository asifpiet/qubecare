// import { $api } from '@/utils/api';
import baseService from './baseService';

class LaborderService extends baseService {

    async saveLaborder(data) {
        let res = await $api(ADMIN_LABORDER_SAVE_API, {
            method: 'POST',
            body: data,
        })
        return res
    }

    async getLaborderByID(id) {
        let res = await $api(`${ADMIN_GET_LABORDER_BY_ID_API}/${id}`, {
            method: 'GET',
        })

        return res.data
    }

    async deleteLaborder(id) {
        let res = await $api(`${ADMIN_DELETE_LABORDER_BY_ID_API}/${id}`, {
            method: 'DELETE',
        })

        return res
    }

    async savePatientLaborderFiles(data) {
        let res = await $api(PATIENT_LABORDER_UPLOAD_FILES, {
            method: 'POST',
            body: data,
        })
        return res
    }


    mapLaborderData(data) {
        return {
            id: data.id,
            patient_id: data.patient_id,
            labOrderItems: {
                lab_id: data.lab_id,
                test_id: data.test_id,
                Priority: data.Priority,
                notes: data.notes,
                status: data.status,
            },
        }
    }

}

export const laborderService = new LaborderService()
