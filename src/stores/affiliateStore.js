import { affiliateService } from '@/services/affiliateService'
import { hideLoader, showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'

export const useAffiliateStore = defineStore('affiliate', {
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
        affiliateAccount: null,
        paymentProcessed: false
    }),
    actions: {

        async getAffiliateDashboardData(data) {
            showLoader()
            await affiliateService.getAffiliateDashboardData(data).then((response) => {
                this.dashbardStats = response
            })
            hideLoader()
        },

        async getAffiliateAccountData(id) {
            showLoader()
            await affiliateService.getAffiliateAccountData(id).then((response) => {
                this.affiliateAccount = response
            })
            hideLoader()
        },

        async saveAffiliateAccount(data) {
            showLoader()
            try {
                let response = await affiliateService.saveAffiliateAccount(data);
                console.log(response);
                addAlert('Saved successfully', 'success');
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

        async perocessAffiliateWithdaw(data) {
            showLoader()
            this.paymentProcessed = false
            try {
                let response = await affiliateService.perocessAffiliateWithdaw(data);
                this.paymentProcessed = true
                addAlert('Request sent successfully', 'success')
            } catch (e) {
                addAlert('Something went wring', 'error')
            }


            hideLoader()
        },

        async savePassword(data) {
            let response = await affiliateService.savePassword(data);
            return response
        },

        async updateProfile(data) {
            showLoader()
            try {
                await affiliateService.updateProfile(data);
            } catch (e) {
                addAlert('Something went wring', 'error')
            }


            hideLoader()
        },

        async createSupportTicket(data) {
            showLoader()
            try {
                let response = await affiliateService.createSupportTicket(data);
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

