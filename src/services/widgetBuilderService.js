import { $api } from '@/utils/api';
import baseService from './baseService';

class WidgetBuilderService extends baseService {


    async saveWidget(payload) {

        const formData = new FormData();
        for (const key in payload) {
            formData.append(key, payload[key]);
        }
        const resp = await $api(SAVE_WIDGET, {
            method: 'POST',
            headers: {
                'Accept': 'multipart/form-data',

            },
            body: formData,
        })


        return resp
    }
    saveWidgetBuilder(data, page) {
        return $api(SAVE_WIDGET_BUILDER + '/' + page, {
            method: 'POST',
            body: data,
        })
    }

    getWidgetBuilder(page) {
        return $api(GET_WIDGET_BUILDER + '/' + page, {
            method: 'GET',
        })
    }
    getChartData(widget_type, widget_id, patientId) {
        if (patientId) {
            patientId = '/' + patientId
        }
        return $api(WIDGT_DATA + '/' + widget_type + '/' + widget_id + patientId, {
            method: 'GET',
        })
    }
    async getMultiFormRender(widget_type, widget_id, patientId) {
        if (patientId) {
            patientId = '/' + patientId
        }
        let res = await $api(GET_PATIENT_FORM_LIST + patientId, {
            method: 'GET',
        })
        console.log(res)
        return res.data
    }
    deleteWidget(id) {
        return $api(DELETE_WIDGET + '/' + id, {
            method: 'DELETE',

        })
    }
    async getFormField(id) {
        const res = await $api(GET_FORM_FIELD + '/' + id, {
            method: 'GET',
        })
        return res
    }
    async getIntakeFormsList() {

        const res = await $api(GET_INTAKE_FORMS_LIST, {
            method: 'GET',
        })
        return res

    }
    async widgetList() {

        const res = await $api(DROP_WIDGET_LIST, {
            method: 'GET',
        })
        return res.data
    }
    async getPage(type, page_name) {

        const res = await $api(GET_BUILDER_PAGE + type + '/' + page_name, {
            method: 'GET',
        })
        return res
    }


}

export const widgetBuilderService = new WidgetBuilderService()
