import { paymentService } from '@/services/paymentService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'

export const usePaymentStore = defineStore('payment', {
    state: () => ({
        conectStripe: null,
        statusConnection: null,
        processPayment: null
    }),
    actions: {

        async savePaymentMethod(data) {
            showLoader()
            await paymentService.savePaymentMethod(data)
            hideLoader()
            addAlert('Added successfully', 'success')

        },
        async stripeConnect(provider_id) {
            showLoader()
            await paymentService.stripeConnect(provider_id).then((response) => {
                this.conectStripe = response
            })
            hideLoader()
            addAlert('Conect successfully', 'success')
        },

        async getStatusConnection() {
            //showLoader()
            await paymentService.getStatusConnection().then((response) => {
                this.statusConnection = response
            })
            hideLoader()
            //addAlert('Conect successfully', 'success')
        },
        async paymentProcess(data) {
            showLoader()
            await paymentService.paymentProcess(data).then((response) => {
                this.processPayment = response
            })
            hideLoader()
            addAlert('Conect successfully', 'success')
        },

    },
    getters: {

    },
})

