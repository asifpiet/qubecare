import { dateFormate } from '@/plugins/globalFunctions';
import { $api } from '@/utils/api';
import baseService from './baseService';

class FollowUpService extends baseService {

    async saveClinicalData(data, annontableImage, id) {
        const formData = new FormData();
        console.log("savedata", data, id);
        // for (const key in data) {
        formData.append('json_data', JSON.stringify(data));
        // }

        // Append the image if provided
        if (annontableImage) {
            formData.append("annontableImage", annontableImage); // Use the desired key name for the image
        }
        let res = await $api(`${CLICNIC_VITAL_API}/${id}`, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'multipart/form-data',

            },
        })

        return res
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

export const followUpService = new FollowUpService()
