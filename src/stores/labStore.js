import { labService } from '@/services/labService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'

const lab = {
    name: '',
    address: '',
    city: '',
    state: '',
    country: 'United States',
    zipcode: '',
    phone_number: '',
    fax_number: '',
    status: '',
}

export const useLabStore = defineStore('labs', {
    state: () => ({
        id: null,
        lab: { ...lab },
        isDrawerOpen: false,
        labs: [],
    }),
    actions: {

        async loadLab(data) {
            this.id = data.id
            this.lab = data.lab
        },

        unloadLab() {
            this.id = null
            this.lab = { ...lab }
        },

        async getLabByID() {
            await labService.getLabByID().then((response) => {
                this.lab = response
            })
        },

        async getLabs() {
            await labService.getLabs().then((response) => {
                this.labs = response
            })
        },

        async saveLab() {
            showLoader()
            let response = await labService.saveLab(this.lab, this.id);
            if (response && response?.message) {
                addAlert('Saved successfully', 'success')
            }
            else {
                addAlert('Something went wrong', 'error')
            }

            hideLoader()
        },

        async deleteLab(id) {
            showLoader()
            try {
                await labService.deleteLab(id)
                hideLoader()
                addAlert('Deleted successfully', 'success')
            } catch (error) {
                hideLoader()
                addAlert('Something went wrong', 'error')
            }
        },

    },
    getters: {

    },
})

