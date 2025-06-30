import { $api } from '@/utils/api';
import baseService from './baseService';

class TemplateService extends baseService {


    async getTemplateList() {
        const res = await $api(`${PRESCRIPTION_TEMPLATE_API}`, {
            method: 'GET',
        });

        return res.data
    }

    async saveTemplate(data) {
        const url = data.id ? `${PRESCRIPTION_TEMPLATE_API}/${data.id}` : `${PRESCRIPTION_TEMPLATE_API}`;
        const method = data.id ? 'PUT' : 'POST';

        return $api(url, {
            method,
            body: data,
        });
    }

    async getTemplate(id) {
        let res = await $api(`${PRESCRIPTION_TEMPLATE_API}/${id}`, {
            method: 'GET',
        })
        return res.data
    }

    async deleteTemplate(id) {
        let res = await $api(`${PRESCRIPTION_TEMPLATE_API}/${id}`, {
            method: 'DELETE',
        })

        return res
    }



}

export const templateService = new TemplateService()
