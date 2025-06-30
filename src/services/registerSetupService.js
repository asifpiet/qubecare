import { $api } from '@/utils/api';
import baseService from './baseService';

class RegisterSetupService extends baseService {


    async providerRegister(data) {
        const res = await $api(PROVIDER_REGISTER_API, {
            method: 'POST',
            body: data,
        })
        return res

    }
    async saveCompanySetting(data) {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        try {
            const res = await $api(STORE_COMPANY_SETTING, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'multipart/form-data',

                },
            })
            console.log(res)
            return res
        } catch (error) {
            console.error('API Call Failed:', error);
            if (error.response?.status === 409) {
                const errorMessage = error.response._data || 'Conflict: The request could not be completed due to a conflict.';
                return errorMessage
            }
        }


    }
    async getCompanySetting() {

        const res = await $api(GET_COMPANY_SETTINGS, {
            method: 'GET',
        })
        return res.data

    }

    async completSetup(data) {

        const res = await $api(COMPLETE_SETUP_API + data, {
            method: 'PUT',
            body: data,
        })
        return res

    }
    async getCompletSetup() {

        const res = await $api(GET_COMPLETE_SETUP_API, {
            method: 'GET',
        })
        return res

    }
    async wizardStup() {
        //commit('setLoading', true)
        const res = await $api(WIZARD_SETUPE_API, {
            method: 'GET',
        })

        return res
    }
    async saveSignature(data) {
        const res = await $api(SAVE_SIGNATURE_API, {
            method: 'POST',
            body: data,
        })
        return res

    }
    async savePaymentMethod(data) {
        const res = await $api(SAVE_PAYMENT_METHOD_API, {
            method: 'POST',
            body: {
                name: data.paymentMethod,
                config: { apiKey: data.apiKey, apiSecret: data.apiSecret },

            },
        })
        return res

    }

}

export const registerSetupService = new RegisterSetupService()
