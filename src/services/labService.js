// import { $api } from '@/utils/api';
import baseService from './baseService';

class LabService extends baseService {

    async getLabs(id) {
        let res = await $api(`${LABS_LIST_DROPDOWN_API}`, {
            method: 'GET',
        })

        return res
    }

    async saveLab(data, id) {
        let res = await $api(id ? `${ADMIN_UPDATE_LAB_BY_ID_API}/${id}` : ADMIN_GET_LAB_SAVE_API, {
            method: `${id? 'PUT' : 'POST'  }`,
            body: data,
        })
        return res
    }

    async getLabByID(id) {
        let res = await $api(`${ADMIN_GET_LAB_BY_ID_API}/${id}`, {
            method: 'GET',
        })

        return res.data
    }

    async deleteLab(id) {
        let res = await $api(`${ADMIN_DELETE_LAB_BY_ID_API}/${id}`, {
            method: 'DELETE',
        })

        return res
    }


    mapLabData(data) {
        return {
            id: data.id,
            lab: {
                name: data.name,
                address: data.address,
                city: data.city,
                state: data.state,
                country: data.country,
                zipcode: data.zipcode,
                phone_number: data.phone_number,
                fax_number: data.fax_number,
                status: data.status,
            },
        }
    }

}

export const labService = new LabService()
