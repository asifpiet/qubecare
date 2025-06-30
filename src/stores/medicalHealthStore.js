import { medicalHealthService } from '@/services/medicalHealthService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'


const healthMaintenance = {
    name: '',
    typeOfItem: '',
    lastDate: '',
    nextDate: '',
    screeningDetails: '',
    flag: '',
    medical_problem_id: ''
}

export const useMedicalHealthStore = defineStore('healthMaintenance', {
    state: () => ({
        // id: null,
        healthMaintenance: { ...healthMaintenance },
        isDrawerOpen: false,
    }),
    actions: {

        unloadHealthMaintenance() {
            this.healthMaintenance = { ...healthMaintenance }
        },

        setHealthMaintenance(data) {
            this.healthMaintenance = medicalHealthService.mapHeatlhData(data);
            console.log("data", this.healthMaintenance);
        },


        async loadHealthMaintenance(id) {
            showLoader()
            await medicalHealthService.getHealthMaintenance(id).then((response) => {
                this.healthMaintenance = response;
                console.log("healthMaintenance", this.healthMaintenance);
            })
            hideLoader()
        },
        async saveHealthMaintenance(id) {
            showLoader()
            await medicalHealthService.saveHealthMaintenance(this.healthMaintenance, id).then((response) => {
                if (response && response?.message) {
                    addAlert(response?.message, 'success')
                }
                else {
                    addAlert(response?.error, 'error')
                }
            })
            hideLoader()
        },

    },
    getters: {

    },
})    
