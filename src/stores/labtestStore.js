import { labtestService } from '@/services/labtestService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'

const labtest = {
    lab_id: '',
    test_name: '',
    status: '',
}

export const useLabtestStore = defineStore('labtests', {
    state: () => ({
        id: null,
        labtest: { ...labtest },
        isDrawerOpen: false,
        labtests: [],
    }),
    actions: {

        async loadLabtest(data) {
            this.id = data.id
            this.labtest = data.labtest
        },

        unloadLabtest() {
            this.id = null
            this.labtest = { ...labtest }
        },

        async getLabtestByID() {
            await labtestService.getLabtestByID().then((response) => {
                this.labtest = response
            })
        },

        async getLabtests(id) {
            await labtestService.getLabtests(id).then((response) => {
                this.labtests = response
            })
        },

        async saveLabtest() {
            showLoader()
            let response = await labtestService.saveLabtest(this.labtest, this.id);
            if (response && response?.message) {
                addAlert('Saved successfully', 'success')
            }
            else {
                addAlert('Something went wrong', 'error')
            }

            hideLoader()
        },

        async deleteLabtest(id) {
            showLoader()
            try {
                await labtestService.deleteLabtest(id)
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

