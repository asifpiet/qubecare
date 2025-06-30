// import { $api } from '@/utils/api';
import baseService from './baseService';

class LabtestService extends baseService {

    async getLabtests(id) {
        let res = await $api(`${ADMIN_GET_LABTESTS_API}/${id}`, {
            method: 'GET',
        })

        return res.data
    }

    async saveLabtest(data, id) {
        let res = await $api(id ? `${ADMIN_UPDATE_LABTEST_BY_ID_API}/${id}` : ADMIN_GET_LABTEST_SAVE_API, {
            method: `${id ? 'PUT' : 'POST'}`,
            body: data,
        })
        return res
    }

    async getLabtestByID(id) {
        let res = await $api(`${ADMIN_GET_LABTEST_BY_ID_API}/${id}`, {
            method: 'GET',
        })

        return res.data
    }

    async deleteLabtest(id) {
        let res = await $api(`${ADMIN_DELETE_LABTEST_BY_ID_API}/${id}`, {
            method: 'DELETE',
        })

        return res
    }


    mapLabtestData(data) {
        return {
            id: data.id,
            labtest: {
                lab_id: data.lab_id,
                test_name: data.test_name,
                status: data.status,
            },
        }
    }

}

export const labtestService = new LabtestService()
