// import { networkService } from '@/services/networkService'
import { defineStore } from 'pinia'

const card = {
    card_number: null,
    expiry: null,
    cvv: null,
}
export const useNetworkStore = defineStore('network', {
    state: () => ({
        card: card,
    }),
    actions: {

        // async getDashboardStats(data) {
        //     showLoader()
        //     await partnerService.getDashboardStats(data).then((response) => {
        //         this.dashbardStats = response
        //     })
        //     hideLoader()
        // },

        // async getPartnerAccountData(id) {
        //     showLoader()
        //     await partnerService.getPartnerAccountData(id).then((response) => {
        //         this.partnerAccount = response
        //     })
        //     hideLoader()
        // },

        // async savePartnerAccount(data) {
        //     showLoader()
        //     let response = await partnerService.savePartnerAccount(data);

        //     addAlert('Saved successfully', 'success')

        //     hideLoader()
        // },



    },
    getters: {},
})

