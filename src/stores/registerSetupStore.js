import { registerSetupService } from '@/services/registerSetupService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'

export const useRegisterSetupStore = defineStore('registerProvider', {
    state: () => ({
        providerRegister: null,
        completeSetup: {},
        wizardStup: {},
        companySetting: {}

    }),
    actions: {
        async providerRegister(data) {
            showLoader()
            //addAlert('Loading Patient', 'info')
            // addAlert('Loading Patient', 'primary')
            await registerSetupService.providerRegister(data).then((response) => {
                console.log(response.message)
                this.providerRegister = response

                if (response.message) {
                    addAlert('successfully provider register!', 'success')
                } else {
                    addAlert('succesfully widget Add', response.data)
                }
            })

            hideLoader()
        },
        async completSetup(data) {
            showLoader()
            //addAlert('Loading Patient', 'info')
            // addAlert('Loading Patient', 'primary')
            await registerSetupService.completSetup(data).then((response) => {
                console.log(response)
            })

            hideLoader()
        },
        async getCompletSetup() {
            showLoader()
            //addAlert('Loading Patient', 'info')
            // addAlert('Loading Patient', 'primary')
            await registerSetupService.getCompletSetup().then((response) => {
                console.log(response)
                this.completeSetup = response
            })

            hideLoader()
        },
        async getWizardStup() {
            showLoader()
            //addAlert('Loading Patient', 'info')
            // addAlert('Loading Patient', 'primary')
            await registerSetupService.wizardStup().then((response) => {
                console.log(response)
                this.wizardStup = response
            })

            hideLoader()
        },
        async saveCompanySetting(data) {
            showLoader()
            //addAlert('Loading Patient', 'info')
            // addAlert('Loading Patient', 'primary')
            await registerSetupService.saveCompanySetting(data).then((response) => {
                console.log(response)
                if (response.status == 'error') {
                    addAlert(response.message, 'error')

                } else {
                    addAlert('Successfully saved!', 'success')
                }

            })


            hideLoader()
        },
        async getCompanySetting() {
            showLoader()

            await registerSetupService.getCompanySetting().then((response) => {
                console.log(response)
                this.companySetting = response
            })

            hideLoader()
        },
        async saveSignature(data) {
            showLoader()
            console.log(data)
            await registerSetupService.saveSignature(data).then((response) => {
                console.log(response)
                addAlert('Successfully saved!', 'success')
            })

            hideLoader()
        },
        async savePaymentMethod(data) {
            showLoader()
            console.log(data)
            await registerSetupService.savePaymentMethod(data).then((response) => {
                console.log(response)
                addAlert('Successfully saved!', 'success')
            })

            hideLoader()
        },

    },

    getters: {
        getNewWidgetData: (state) => state.widgetDataNew,
    },
})
