import { locationService } from '@/services/locationService'
import { hideLoader, showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'
export const useLocationStore = defineStore('locations', {
    state: () => ({
        locations: [],
    }),
    actions: {

        async getLocations() {
            showLoader()
            await locationService.getLocations().then((response) => {
                this.locations = response
            })
            hideLoader()
        },

        async saveLocation(date, id = null) {
            showLoader()
            await locationService.saveLocation(date, id)
            addAlert('Saved successfully', 'success')
            hideLoader()
        },

    },
    getters: {

    },
})

