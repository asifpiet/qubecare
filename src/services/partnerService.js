import { $api } from '@/utils/api';
import baseService from './baseService';

class PartnerService extends baseService {


    async getDashboardStats(data) {
        let res = await $api(GET_PARTNER_DASHBOARD_STATS, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async getPartnerAccountData(id) {
        let res = await $api(`${GET_PARTNER_ACCOUNT}/${id}`, {
            method: 'GET',
        })

        return res.data
    }

    async savePartnerAccount(data) {
        let res = await $api(STORE_PARTNER_ACCOUNT, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async perocessPartnerWithdaw(data) {
        let res = await $api(POST_PARTNER_WITHDRAWLS, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async registerProvider(data) {
        let res = await $api(STORE_PARTNER_PROVIDER, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async registerAffiliate(data) {
        let res = await $api(STORE_PARTNER_AFFILIATE, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async updateProfile(data) {
        let res = await $api(UPDATE_PARTNER_PROFILE, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async createSupportTicket(data) {
        let res = await $api(CREATE_PARTNER_SUPPORT_TICKET, {
            method: 'POST',
            body: data,
        })

        return res
    }

}

export const partnerService = new PartnerService()
