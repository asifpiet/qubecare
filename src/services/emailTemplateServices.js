import { $api } from '@/utils/api';
import baseService from './baseService';

class EmailTemplateService extends baseService {


    async getEmailTemplateList() {
        const res = await $api(`${GET_EMAIL_TEMPLATES_API}`, {
            method: 'GET',
        });

        return res.data
    }
    async getEmailTemplateField() {
        const res = await $api(`${EMAIL_TEMPLATES_FIELD_API}`, {
            method: 'GET',
        });

        return res.data
    }

    async updateConfigEmailTemplate(data) {
        const res = await $api(`${UPDATE_EMAIL_TEMPLATES_FIELD_API}`, {
            method: 'POST',
            body: data,
        });

        return res
    }



    async saveEmailTemplate(data) {
        const url = data.id ? `${UPDATE_EMAIL_TEMPLATES_API}/${data.id}` : `${STORE_EMAIL_TEMPLATES_API}`;
        const method = data.id ? 'PUT' : 'POST';

        return $api(url, {
            method,
            body: data,
        });
    }

    async getEmailTemplate(id) {
        let res = await $api(`${GET_EMAIL_TEMPLATES_BY_ID_API}/${id}`, {
            method: 'GET',
        })
        return res.message
    }

    async getSelectedEmailField() {
        let res = await $api(`${GET_SELETED_EMAIL_TEMPLATES_FIELD_API}`, {
            method: 'GET',
        })
        return res.data
    }



    async deleteEmailTemplate(id) {
        let res = await $api(`${DELETE_EMAIL_TEMPLATES_API}/${id}`, {
            method: 'DELETE',
        })

        return res
    }
}

export const emailTemplateService = new EmailTemplateService()
