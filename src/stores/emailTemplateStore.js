import { emailTemplateService } from '@/services/emailTemplateServices'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'


const template = {
    name: '',
    html: '',
    status: '',
    editor_doc: '',
    id: '',
}

export const useEmailTemplateStore = defineStore('emailTemplate', {
    state: () => ({
        templates: [],
        template: { ...template },
        selectedtemplate: null,
        isDrawerOpen: false,
        isCustomDrawerOpen: false,
        emailTemplateField: [],
        updateConfigtemplate: []
    }),
    actions: {

        async getTemplateList() {
            await emailTemplateService.getEmailTemplateList().then((response) => {
                this.templates = response
            })
        },
        unloadTemplate() {
            this.template = { ...template }
            this.emailTemplateField = []
        },
        async getTemplate(id) {
            showLoader()
            await emailTemplateService.getEmailTemplate(id).then((response) => {
                this.template = response;
            })
            hideLoader()
        },



        async saveTemplate() {
            showLoader()
            await emailTemplateService.saveEmailTemplate(this.template).then((response) => {
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
            await emailTemplateService.deleteEmailTemplate(id)
            hideLoader()
            addAlert('Deleted successfully', 'success')

        },

        async getSelectedEmailField() {
            this.emailTemplateField = [];
            showLoader()
            await emailTemplateService.getSelectedEmailField().then((response) => {
                const transformedData = {};
                response.forEach(item => {
                    const fieldName = item.name;  // Get the 'name' as the key
                    const templateId = item.template_id;  // Set an empty string for the field
                    transformedData[fieldName] = templateId;
                });
                this.emailTemplateField = transformedData;
                console.log("getEmailTemplateField", this.emailTemplateField);
            })
            hideLoader()
        },

        async updateConfigEmailTemplate() {
            showLoader()
            this.updateConfigtemplate = {};
            let payload = this.emailTemplateField;
            for (let key in payload) {
                if (payload.hasOwnProperty(key)) {
                    // Remove spaces from the key
                    const newKey = key.replace(/\s+/g, '');

                    // Add the transformed data (key without spaces and corresponding value) to the object
                    this.updateConfigtemplate[newKey] = payload[key];
                }
            }
            await emailTemplateService.updateConfigEmailTemplate(this.updateConfigtemplate).then((response) => {
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
