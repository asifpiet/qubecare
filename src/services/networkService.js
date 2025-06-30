import baseService from './baseService';

class NetworkService extends baseService {


    // async getPartnerAccountData(id) {
    //     let res = await $api(`${GET_PARTNER_ACCOUNT}/${id}`, {
    //         method: 'GET',
    //     })

    //     return res.data
    // }

    // async savePartnerAccount(data) {
    //     let res = await $api(STORE_PARTNER_ACCOUNT, {
    //         method: 'POST',
    //         body: data,
    //     })

    //     return res
    // }



}

export const networkService = new NetworkService()
