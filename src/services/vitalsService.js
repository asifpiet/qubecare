import baseService from './baseService';

class VitalsService extends baseService {

    async AddVital(data, id) {
        let res = await $api(`${ADD_VITAL}/${id}`, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async getVitalByIdAction(pid, eid, vid, id) {
        let res = await $api(`${GET_VITAL_BY_ID}/${pid}/${eid}/${vid}/${id}`, {
            method: 'GET',
        })

        return res
    }

    async EditVital(data, id) {
        let res = await $api(`${UPADATE_VITAL}/${id}`, {
            method: 'PUT',
            body: data,
        })

        return res
    }

    async deleteVital(id) {
        let res = await $api(`${DELETE_VITAL}/${id}`, {
            method: 'DELETE',
        })

        return res
    }
}

export const vitalsService = new VitalsService()
