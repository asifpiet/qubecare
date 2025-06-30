import { invoiceService } from '@/services/invoiceService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'

export const useInvoiceStore = defineStore('invoice', {
    state: () => ({
        id: null,
        invoice: null,
        isDrawerOpen: false,
        stats: null,
        payIntentData: null,
        storedCard: null,
        order_data: null
    }),
    actions: {

        async getInvoiceState() {
            showLoader()
            await invoiceService.getInvoiceState().then((response) => {
                this.stats = response
            })
            hideLoader()
        },

        async getInvoiceByID(id) {
            showLoader()
            await invoiceService.getInvoiceByID(id).then((response) => {
                console.log('response > ',response)
                this.invoice = response
                this.order_data = response.order_data
            })
            hideLoader()
        },
        async getPatientInvoiceByID(id) {
            showLoader()
            await invoiceService.getPatientInvoiceByID(id).then((response) => {
                this.invoice = response
                this.order_data = response.order_data
            })
            hideLoader()
        },



        // async getRoles() {
        //     await roleService.getRoles().then((response) => {
        //         this.roles = response
        //     })
        // },

        async saveInvoice(data, id = null) {
            showLoader()
            let response = await invoiceService.saveInvoice(data, id);
            if (response && response?.data) {
                this.invoice = response?.data
                addAlert('Saved successfully', 'success')
            }
            else {
                addAlert('Something went wrong', 'error')
            }

            hideLoader()
        },

        async payInvoice(data) {
            showLoader()
            try {
                let response = await invoiceService.payInvoice(data);
                console.log(response)
                this.payIntentData = response
                addAlert(response.message, 'success')
                hideLoader()
            } catch (e) {
                addAlert('Something went wrong', 'error')
                hideLoader()
            }




        },

        async getStoredCard(patient_id) {
            showLoader()
            await invoiceService.getStoredCard(patient_id).then((response) => {
                this.storedCard = response.data
            })
            hideLoader()
        },

        async getPatientStoredCard(patient_id) {
            showLoader()
            await invoiceService.getPatientStoredCard(patient_id).then((response) => {
                this.storedCard = response.data
            })
            hideLoader()
        },

        async patientPayInvoice(data) {
            showLoader()
            try {
                let response = await invoiceService.patientPayInvoice(data);
                console.log(response)
                this.payIntentData = response
                addAlert(response.message, 'success')
                hideLoader()
            } catch (e) {
                addAlert('Something went wrong', 'error')
                hideLoader()
            }




        },



    },
    getters: {

    },
})

