import { templateService } from '@/services/templateService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'


const template = {
    template_name: '',
    presherb_name: '',
    presherb_dispense_days: '',
    presherb_dispense_refills: '',
    presherb_dispense_subtitution: '',
    presherb_notes: '',
    presherb_start_on: '',
    presherb_discontinue: '',
    presherb_src: '',
    BB: '',
    B: '',
    BL: '',
    L: '',
    BD: '',
    D: '',
    status: '',
    id: '',
}


const prescription = {
    template_name: '',
    id: '',
    newPrescription: [
        {
            medicine_id: '',
            variation_id: '',
            dose: '',
            when: '',
            frequency: '',
            duration: '',
            notes: '',
        },
        {
            medicine_id: '',
            variation_id: '',
            dose: '',
            when: '',
            frequency: '',
            duration: '',
            notes: '',
        }

    ],

}



export const useTemplateStore = defineStore('template', {
    state: () => ({
        templates: [],
        prescription: { ...prescription },
        template: { ...template },
        selectedtemplate: null,
        isDrawerOpen: false,
    }),
    actions: {




        unloadTemplate() {
            this.template = { ...template },
                this.prescription = { ...prescription }
        },

        async getTemplateList() {
            await templateService.getTemplateList().then((response) => {
                this.templates = response
            })
        },

        async getTemplate(id) {
            showLoader()
            await templateService.getTemplate(id).then((response) => {
                this.prescription.template_name = response.template_name;
                this.prescription.id = response.id;
                this.prescription.newPrescription = response.prescription_items;
                console.log("template", response);
            })
            hideLoader()
        },
        async saveTemplate() {
            showLoader()
            this.prescription.newPrescription = this.prescription.newPrescription.filter(item => {
                // Check if all fields are empty for this item
                return !(item.medicine_id === "" && item.variation_id === "" && item.dose === "" && item.when === "" && item.frequency === "" && item.duration === "" && item.notes === "");
            });
            await templateService.saveTemplate(this.prescription).then((response) => {
                if (response && response?.message) {
                    addAlert(response?.message, 'success')
                }
                else {
                    addAlert(response?.error, 'error')
                }
            })
            hideLoader()
        },

        async deleteTemplate(id) {
            showLoader()
            await templateService.deleteTemplate(id)
            hideLoader()
            addAlert('Deleted successfully', 'success')

        },

    },
    getters: {

    },
})    
