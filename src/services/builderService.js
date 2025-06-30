import { $api } from '@/utils/api';
import baseService from './baseService';

class BuilderService extends baseService {

    async getNewBuilderById(id) {
        let res = await $api(`${GET_NEW_BUILDER}/${id}`, {
            method: 'GET',
        })

        return res.data
    }

    async saveNewBuilder(data, id) {
        let res = await $api(id ? `${UPDATE_NEW_BUILDER}/${id}` : STORE_NEW_BUILDER, {
            method: id ? 'PUT' : 'POST',
            body: data,
        })
        return res
    }

    async getUnauthBuilderById(id) {
        let res = await $api(`${GET_BUILDER_DATA_BY_ID}/${id}`, {
            method: 'GET',
        })

        return res.data
    }

    async getBuildersList(id) {
        let res = await $api(`${GET_PROVIDER_BUILDERS}/${id}`, {
            method: 'GET',
        })

        return res.data
    }

    async deleteBuilder(id) {
        let res = await $api(`${DELETE_NEW_BUILDER}/${id}`, {
            method: 'DELETE',
        })

        return res
    }

    async getAllThemesList(id) {
        let res = await $api(`${GET_THEMES_LIST}`, {
            method: 'GET',
        })

        return res.data
    }

    async saveBuilder(data, id) {
        let res = await $api(id ? `${UPDATE_BUILDER}/${id}` : STORE_BUILDER, {
            method: 'POST',
            body: data,
        })
        return res
    }

    async saveBuilderConfig(data, type, id) {
        let res = await $api(type == 'update' ? `${UPDATE_BUILDER_CONFIG}/${id}` : `${STORE_BUILDER_CONFIG}/${id}`, {
            method: 'POST',
            body: data,
        })
        return res
    }

    async getBuilderItem(id) {
        let res = await $api(`${GET_BUILDER_DATA}/${id}`, {
            method: 'GET',
        })

        return res.data
    }
}

export const builderService = new BuilderService()
