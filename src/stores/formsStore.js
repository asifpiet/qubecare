import { formsService } from '@/services/formsService'
import { hideLoader, showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'
export const useFormsStore = defineStore('forms', {
    state: () => ({
        id: null,
        name: null,
        data: {},
        type: null,
        isDrawerOpen: false,
        isDrawerOpenEdit: false,
        forms: [],
        savePatientIntakFormData: null,
        intakeForms: [],
        intakeFormData: { name: null, data: {} },
        patientIntakeFormData: { data: {} },
        consentForms: [],
        consentFormData: { name: null, data: {} },
        patientConsentFormData: { data: {} },
        questionnaireForms: [],
        questionnaireFormData: { name: null, data: {} },
        patientQuestionnaireFormData: { data: {} },
        submittedIntakeForm: {},
        patientSubmittedForm: null,
        schema: [],
        orginal_schema: null,
        signature_meta: null,
        pdf_url: null,
        intakeQuestion: {
            id: null,
            name: null,
            description: null,
            status: null,
            data: {}
        },

        questionerQuestion: {
            id: null,
            name: null,
            description: null,
            status: null,
            data: {}
        },
        consentForm: {
            id: null,
            name: null,
            description: null,
            status: null,
            uuid: null,
            data: {}
        },
        isDialog: false
    }),
    actions: {

        async getFormByType(type) {
            let response = await formsService.getFormByType(type)
            this.forms = response.data

        },
        async getFormPDFConsent(id) {
            let response = await formsService.getFormPDFConsent(id)
            this.pdf_url = response.pdf_url

        },
        async getFormById(id) {
            let response = await formsService.getFormById(id)

        },
        async genratePdf(url) {
            let response = await formsService.genratePdf(url)
            this.savePatientIntakFormData = response
        },
        loadForm(data) {
            this.id = data.id
            this.name = data.name
            this.data = data.data
            this.type = data.type
        },

        unloadForm() {
            this.id = null
            this.name = null
            this.data = {}
            this.type = null
        },

        async saveForm() {
            showLoader()
            await formsService.saveForm({ data: this.data, name: this.name, type: this.type }, this.id)
            hideLoader()
            addAlert('Successfully saved', 'success')

        },

        async deleteForm(id) {
            showLoader()
            await formsService.deleteForm(id)
            hideLoader()
            addAlert('Deleted saved', 'success')

        },

        async getIntakeFormsList() {
            await formsService.getIntakeFormsList().then((response) => {
                this.intakeForms = response
            })
        },

        async savePatientIntakeForm(data) {
            showLoader()
            let response = await formsService.savePatientIntakeForm(data)
            this.savePatientIntakFormData = response
            hideLoader()
            addAlert('Successfully saved', 'success')

        },
        async updatePatientIntakeForm(data, rowId) {
            showLoader()
            let response = await formsService.updatePatientIntakeForm(data, rowId)
            this.savePatientIntakFormData = response
            hideLoader()
            addAlert('Successfully saved', 'success')

        },
        async getIntakeFormDataById(id) {
            showLoader()
            await formsService.getIntakeFormDataById(id).then((response) => {
                this.intakeFormData = response
            })
            hideLoader()
        },
        async viewIntakeFormDataById(id) {
            await formsService.viewIntakeFormDataById(id).then((response) => {
                this.intakeFormData = response
            })
        },



        async getPatientIntakeFormDataById(id) {
            await formsService.getPatientIntakeFormDataById(id).then((response) => {
                this.intakeFormData = response
            })
        },



        async getPatientIntakeFormsData(id, pid, rowid) {
            await formsService.getPatientIntakeFormsData(id, pid, rowid).then((response) => {
                console.log(response)
                this.patientIntakeFormData = response.data
                this.schema = response.schema
                this.orginal_schema = response.orginal_form_schema
                this.signature_meta = response.signature_meta
            })
        },
        async getPatientIntakeSimpleFormsData(id, pid, currentUser) {
            await formsService.getPatientIntakeSimpleFormsData(id, pid, currentUser).then((response) => {
                console.log(response)
                this.patientIntakeFormData = response.data
                this.schema = response.schema
                this.orginal_schema = response.orginal_form_schema
                this.signature_meta = response.signature_meta
            })
        },
        async getConsentFormsList() {
            await formsService.getConsentFormsList().then((response) => {
                this.consentForms = response
            })
        },

        async getConsentFormDataById(id) {
            await formsService.getConsentFormDataById(id).then((response) => {
                this.consentFormData = response
            })
        },

        async savePatientConsentForm(data) {
            showLoader()
            await formsService.savePatientConsentForm(data)
            hideLoader()
            addAlert('Successfully saved', 'success')

        },

        async getPatientConsentFormData(id, pid) {
            await formsService.getPatientConsentFormData(id, pid).then((response) => {
                this.patientConsentFormData = response
            })
        },

        async getQuestionnaireFormsList() {
            await formsService.getQuestionnaireFormsList().then((response) => {
                this.questionnaireForms = response
            })
        },

        async getQuestionnaireFormDataById(id) {
            await formsService.getQuestionnaireFormDataById(id).then((response) => {
                this.questionnaireFormData = response
            })
        },

        async savePatientQuestionnaireForm(data) {
            showLoader()
            await formsService.savePatientQuestionnaireForm(data)
            hideLoader()
            addAlert('Successfully saved', 'success')

        },

        async getPatientQuestionnaireFormsData(id, pid) {
            await formsService.getPatientQuestionnaireFormsData(id, pid).then((response) => {
                this.patientQuestionnaireFormData = response
            })
        },

        async getSubmittedIntakeFormData(id, pid) {
            await formsService.getSubmittedIntakeFormData(id, pid).then((response) => {
                this.submittedIntakeForm = response
            })
        },

        async saveIntakeForm(data, id = null) {
            showLoader()
            let response = await formsService.saveIntakeForm(data, id);
            console.log("response", response);
            if (response && response?.message && response?.data) {
                addAlert(response?.message, 'success')
            }
            else if (response && response?.message) {
                addAlert(response?.message, 'success')
            }
            else {
                addAlert(response?.error, 'error')
            }

            hideLoader()
        },

        async getIntakeFormData(id) {
            await formsService.getIntakeFormData(id).then((response) => {
                this.intakeQuestion = response
            })
        },

        async deleteIntakeQuestionsForm(id) {
            showLoader()
            await formsService.deleteIntakeQuestionsForm(id)
            addAlert('Deleted successfully', 'success')
            hideLoader()
        },

        async saveQuestionnaireForm(data, id = null) {
            showLoader()
            let response = await formsService.saveQuestionnaireForm(data, id);
            console.log("response", response);
            if (response && response?.message && response?.data) {
                addAlert(response?.message, 'success')
            }
            else if (response && response?.message) {
                addAlert(response?.message, 'success')
            }
            else {
                addAlert(response?.error, 'error')
            }

            hideLoader()
        },

        async getQuestionerQuestionsFormById(id) {
            await formsService.getQuestionerQuestionsFormById(id).then((response) => {
                this.questionerQuestion = response
            })
        },

        async deleteQuestionerQuestionsForm(id) {
            showLoader()
            await formsService.deleteQuestionerQuestionsForm(id)
            addAlert('Deleted successfully', 'success')
            hideLoader()
        },

        async saveConsentForm(data, id = null) {
            showLoader()
            let response = await formsService.saveConsentForm(data, id);
            console.log("response", response);
            if (response && response?.message && response?.data) {
                addAlert(response?.message, 'success')
            }
            else if (response && response?.message) {
                addAlert(response?.message, 'success')
            }
            else {
                addAlert(response?.error, 'error')
            }

            hideLoader()
        },

        async getConsentFormById(id) {
            await formsService.getConsentFormById(id).then((response) => {
                this.consentForm = response
            })
        },



        async deleteConsentForm(id) {
            showLoader()
            await formsService.deleteConsentForm(id)
            addAlert('Deleted successfully', 'success')
            hideLoader()
        },

        async updateStatus(pid, form_id) {
            await formsService.updateStatus(pid, form_id).then((response) => {
                console.log(response)
            })
        },

        async getPatientMultiForm(pid) {
            await formsService.getPatientMultiForm(pid).then((response) => {
                this.patientSubmittedForm = response
            })
        },

    },
    getters: {

    },
})

