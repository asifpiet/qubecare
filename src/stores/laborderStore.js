import { laborderService } from '@/services/laborderService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'

const labOrderItems = {
    items: [
        {
            lab_id: '',
            test_id: '',
            priority: '',
            notes: '',
            status: '',
        }
    ]
}

export const useLaborderStore = defineStore('laborders', {
    state: () => ({
        id: null,
        patient_id: '',
        labOrderItems: { ...labOrderItems },
        isDrawerOpen: false,
    }),
    actions: {

        async loadLaborder(data) {
            this.id = data.id
            this.labOrderItems = data.labOrderItems
        },

        unloadLaborder() {
            this.id = null
            this.patient_id = null
            this.labOrderItems.items = [
                {
                    lab_id: '',
                    test_id: '',
                    priority: '',
                    notes: '',
                    status: '',
                }
            ]
        },

        async getLaborderByID() {
            await laborderService.getLaborderByID().then((response) => {
                this.laborder = response
            })
        },

        async saveLaborder() {
            showLoader()
            let response = await laborderService.saveLaborder(
                                {id: this.id, patient_id: this.patient_id, items: this.labOrderItems.items}
                                , this.id
                            );
            if (response && response?.message) {
                addAlert('Saved successfully', 'success')
            }
            else {
                addAlert('Something went wrong', 'error')
            }

            hideLoader()
        },

        async deleteLaborder(id) {
            showLoader()
            try {
                await laborderService.deleteLaborder(id)
                hideLoader()
                addAlert('Deleted successfully', 'success')
            } catch (error) {
                hideLoader()
                addAlert('Something went wrong', 'error')
            }
        },

        async savePatientLaborderFiles(data) {
            showLoader()
            let response = await laborderService.savePatientLaborderFiles(data);
            if (response && response?.message) {
                addAlert(response?.message, 'success')
            }
            else {
                addAlert('Something went wrong', 'error')
            }
            hideLoader()
            return response
        },

    },
    getters: {

    },
})

