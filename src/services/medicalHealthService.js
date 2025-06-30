import { dateFormate } from '@/plugins/globalFunctions';
import { $api } from '@/utils/api';
import baseService from './baseService';

class MedicalHealthService extends baseService {
    async saveHealthMaintenance(data, id) {
        const url = data.medical_problem_id ? `${UPDATE_HEALTH_MAINTANCE_API}/${data.medical_problem_id}` : `${STORE_HEALTH_MAINTANCE_API}/${id}`;
        const method = data.medical_problem_id ? 'PUT' : 'POST';

        return $api(url, {
            method,
            body: data,
        });
    }

    async getHealthMaintenance(id) {
        let res = await $api(`${GET_HEALTH_MAINTANCE_BY_ID}/${id}`, {
            method: 'GET',
        })
        return this.mapHeatlhData(res.data)
    }


    mapHeatlhData(data) {
        return {
            name: data.title,
            typeOfItem: data.type_of_item,
            lastDate: dateFormate(data.begdate),
            nextDate: dateFormate(data.enddate),
            screeningDetails: data.screening_detail,
            flag: data.flag,
            medical_problem_id: data.medical_prob_id

        }
    }
}

export const medicalHealthService = new MedicalHealthService()
