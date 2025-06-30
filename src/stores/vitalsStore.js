import { vitalsService } from '@/services/vitalsService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'

export const useVitalsStore = defineStore('vitals', {
    state: () => ({
        getVitalById: {},
    }),
    actions: {

        async AddVital(data, id) {
            showLoader()
            await vitalsService.AddVital(data, id)
            hideLoader()
            addAlert('Added successfully', 'success')

        },

        async getVitalByIdAction(pid, eid, vid, id) {
            await vitalsService.getVitalByIdAction(pid, eid, vid, id).then((response) => {
                this.getVitalById = response
            })
        },

        async EditVital(data, id) {
            showLoader()
            await vitalsService.EditVital(data, id)
            hideLoader()
            addAlert('Saved successfully', 'success')

        },

        async deleteVital(id) {
            showLoader()
            await vitalsService.deleteVital(id)
            hideLoader()
            addAlert('Deleted successfully', 'success')

        },


    },
    getters: {

    },
})

