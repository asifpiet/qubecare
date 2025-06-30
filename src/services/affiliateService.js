import { $api } from '@/utils/api';
import baseService from './baseService';

class AffiliateService extends baseService {


    async getAffiliateDashboardData(data) {
        let res = await $api(`${GET_AFFILIATE_DASHBOARD_STATS}?${data}`, {
            method: 'GET',
        })

        return res
    }

    async getAffiliateAccountData(id) {
        let res = await $api(`${GET_AFFILIATE_ACCOUNT}/${id}`, {
            method: 'GET',
        })

        return res
    }

    async saveAffiliateAccount(data) {
        let res = await $api(STORE_AFFILIATE_ACCOUNT, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async perocessAffiliateWithdaw(data) {
        let res = await $api(POST_AFFILIATE_WITHDRAWLS, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async savePassword(data) {
        let res = await $api(`${SAVE_AFFILIATE_PASSWORD}/${data.token}`, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async updateProfile(data) {
        let res = await $api(UPDATE_AFFILIATE_PROFILE, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async createSupportTicket(data) {
        let res = await $api(CREATE_AFFILIATE_SUPPORT_TICKET, {
            method: 'POST',
            body: data,
        })

        return res
    }

}

export const affiliateService = new AffiliateService()
