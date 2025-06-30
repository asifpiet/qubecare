import { partnerService } from '@/services/partnerService'
import { hideLoader, showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'

export const usePartnerStore = defineStore('partners', {
    state: () => ({
        dashbardStats: {
            total_revenue: null,
            total_withdrawals: null,
            total_affiliate_users: null,
            weekly_revenue: null,
            weekly_affiliate_users: null,
            weekly_withdrawals: null,
            line_chart: {
                data: [],
                labels: []
            }
        },
        partnerAccount: null,
        paymentProcessed: false
    }),
    actions: {

        async getDashboardStats(data) {
            showLoader()
            await partnerService.getDashboardStats(data).then((response) => {
                this.dashbardStats = response
            })
            hideLoader()
        },

        async getPartnerAccountData(id) {
            showLoader()
            await partnerService.getPartnerAccountData(id).then((response) => {
                this.partnerAccount = response
            })
            hideLoader()
        },

        async savePartnerAccount(data) {
            showLoader()
            try{
                let response = await partnerService.savePartnerAccount(data);

                addAlert('Saved successfully', 'success')
            } catch (e) {
                hideLoader()
                if (e.response && e.response.status === 422) {
                    const errors = e.response._data.errors;
                    const errorMessages = [];
                
                    for (const field in errors) {
                    errorMessages.push(...errors[field]); // flatten all messages
                    }
                
                    const combinedErrors = errorMessages.join(', ');
                    console.log('Validation Errors:', combinedErrors);
                    addAlert(combinedErrors, 'error'); // Optional: show in UI
                } else {
                    console.log('Error:', e);
                    addAlert('Something went wrong', 'error');
                }
            } 
            hideLoader()
        },

        async perocessPartnerWithdaw(data) {
            showLoader()
            this.paymentProcessed = false
            try {
                let response = await partnerService.perocessPartnerWithdaw(data);
                this.paymentProcessed = true
                addAlert('Request sent successfully', 'success')
            } catch (e) {
                addAlert('Something went wring', 'error')
            }


            hideLoader()
        },

        async registerProvider(data) {
            let response = await partnerService.registerProvider(data);
            return response
        },

        async registerAffiliate(data) {
            let response = await partnerService.registerAffiliate(data);
            return response
        },

        async updateProfile(data) {
            showLoader()
            try {
                await partnerService.updateProfile(data);
            } catch (e) {
                addAlert('Something went wring', 'error')
            }


            hideLoader()
        },

        async createSupportTicket(data) {
            showLoader()
            try {
                let response = await partnerService.createSupportTicket(data);
                addAlert('Ticket created successfully', 'success')
            } catch (e) {
                console.log(e);
                addAlert("Something went wrong", "error")

            }
            hideLoader()
        },


    },
    getters: {},
})

