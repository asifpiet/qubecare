import { $api } from '@/utils/api';
import baseService from './baseService';

class FormsService extends baseService {

    async getFormByType(type) {
        let res = await $api(`${GET_CUSTOM_FORMS}/${type}`, {
            method: 'GET',
        })

        return res
    }
    async getFormPDFConsent(id) {
        let res = await $api(`${GET_PDF_URL}/${id}`, {
            method: 'GET',
        })

        return res
    }
    async getFormById() {
        let res = await $api(`${GET_CUSTOM_FORM}`, {
            method: 'GET',
        })

        return res
    }
    async genratePdf(url) {
        let res = await $api(`${url}`, {
            method: 'GET',
        })

        return res
    }
    async saveForm(data, id) {
        let res = await $api(id ? `${UPDATE_CUSTOM_FORM}/${id}` : STORE_CUSTOM_FORM, {
            method: id ? 'PUT' : 'POST',
            body: data,
        })
        return res
    }

    async deleteForm(id) {
        let res = await $api(`${DELETE_CUSTOM_FORM}/${id}`, {
            method: 'DELETE',
        })
        return res
    }

    async getIntakeFormsList() {
        let res = await $api(`${GET_INTAKE_FORMS_LIST}`, {
            method: 'GET',
        })

        return res
    }

    async savePatientIntakeForm(data) {

        return await $api(`${STORE_INTAKE_FORM_DATA}`, {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'multipart/form-data',

            },
        })
    }
    async updatePatientIntakeForm(data, rowId) {

        return await $api(`${UPDATE_INTAKE_FORM_DATA}/` + rowId, {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'multipart/form-data',

            },
        })
    }

    async getIntakeFormDataById(id) {
        let res = await $api(`${GET_INTAKE_FORM_DATA}/${id}`, {
            method: 'GET',
        })

        return res
    }

    async getPatientIntakeFormsData(id, pid, rowid) {
        const { currentRole } = GLOBAL_VARIABLE.useAuth
        console.log(currentRole.value)
        let res = await $api(currentRole.value == 'patient' ? `/frontend${GET_PATIENT_INTAKE_FORM_DATA}/${id}/${pid}/${rowid}` : `${GET_PATIENT_INTAKE_FORM_DATA}/${id}/${pid}/${rowid}`, {
            method: 'GET',
        })

        return res
    }
    async getPatientIntakeSimpleFormsData(id, pid, currentUser) {

        let res = await $api(currentUser.user_type == 'patient' ? `/frontend${GET_PATIENT_INTAKE_SIMPLE_FORM_DATA}/${id}/${pid}` : `${GET_PATIENT_INTAKE_SIMPLE_FORM_DATA}/${id}/${pid}`, {
            method: 'GET',
        })

        return res
    }
    async getConsentFormsList() {
        let res = await $api(`${GET_CONSENT_FORMS_LIST}`, {
            method: 'GET',
        })

        return res
    }

    async getConsentFormDataById(id) {
        let res = await $api(`${GET_CONSENT_FORM_BY_ID}/${id}`, {
            method: 'GET',
        })

        return res.data
    }

    async savePatientConsentForm(data) {
        return await $api(`${STORE_PATIENT_CONSENT_FORM}`, {
            method: 'POST',
            body: data,
        })
    }

    async getPatientConsentFormData(id, pid) {
        let res = await $api(`${GET_PATIENT_CONSENT_FORM_DATA}/${id}/${pid}`, {
            method: 'GET',
        })

        return res.data
    }

    async getQuestionnaireFormsList() {
        let res = await $api(`${GET_QUESTIONER_FORMS_LIST}`, {
            method: 'GET',
        })

        return res
    }

    async getQuestionnaireFormDataById(id) {
        let res = await $api(`${GET_QUESTIONER_QUESTION_BY_ID}/${id}`, {
            method: 'GET',
        })

        return res.data
    }

    async savePatientQuestionnaireForm(data) {
        return await $api(`${STORE_QUESTIONER_FORM_DATA}`, {
            method: 'POST',
            body: data,
        })
    }

    async getPatientQuestionnaireFormsData(id, pid) {
        let res = await $api(`${GET_PATIENT_QUESTIONER_FORM_DATA}/${id}/${pid}`, {
            method: 'GET',
        })

        return res.data
    }

    async getSubmittedIntakeFormData(form_id, type) {
        let res = await $api(`${GET_PATIENT_SUBMITTED_INTAKE_DATA}/${form_id}/${type}`, {
            method: 'GET',
        })

        return res
    }

    async saveIntakeForm(data, id) {
        let res = await $api(id ? `${UPDATE_INTAKE_QUESTION_BY_ID}/${id}` : STORE_INTAKE_QUESTIONS, {
            method: 'POST',
            body: data,
        })
        return res
    }

    async getIntakeFormData(id) {
        let res = await $api(`${GET_INTAKE_QUESTION_BY_ID}/${id}`, {
            method: 'GET',
        })

        return res.data
    }

    async deleteIntakeQuestionsForm(id) {
        let res = await $api(`${DELETE_INTAKE_QUESTION_BY_ID}/${id}`, {
            method: 'DELETE',
        })

        return res
    }

    async saveQuestionnaireForm(data, id) {
        let res = await $api(id ? `${UPDATE_QUESTIONER_QUESTION_BY_ID}/${id}` : STORE_QUESTIONER_QUESTIONS, {
            method: 'POST',
            body: data,
        })
        return res
    }

    async getQuestionerQuestionsFormById(id) {
        let res = await $api(`${GET_QUESTIONER_QUESTION_BY_ID}/${id}`, {
            method: 'GET',
        })

        return res.data
    }

    async deleteQuestionerQuestionsForm(id) {
        let res = await $api(`${DELETE_QUESTIONER_QUESTION_BY_ID}/${id}`, {
            method: 'DELETE',
        })

        return res
    }

    async saveConsentForm(data, id) {
        let res = await $api(id ? `${UPDATE_CONSENT_FORM_BY_ID}/${id}` : STORE_CONSENT_FORM, {
            method: 'POST',
            body: data,
        })
        return res
    }

    async getConsentFormById(id) {
        let res = await $api(`${GET_CONSENT_FORM_BY_ID}/${id}`, {
            method: 'GET',
        })

        return res.data
    }

    async deleteConsentForm(id) {
        let res = await $api(`${DELETE_CONSENT_FORM_BY_ID}/${id}`, {
            method: 'DELETE',
        })

        return res
    }
    async updateStatus(pid, form_id) {
        let res = await $api(`${POST_REQUEST_STATUS}`, {
            method: 'PUT',
            body: {
                form_id: form_id,
                patient_id: pid,
                status: "complete"
            }
        })

        return res
    }
    async getPatientMultiForm(id) {
        let res = await $api(`${PATIENT_FORM_GET_API}/${id}`, {
            method: 'GET',
        })

        return res.data
    }



}

export const formsService = new FormsService()
