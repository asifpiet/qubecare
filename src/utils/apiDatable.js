import axios from 'axios';
import qs from 'qs';
import { GLOBAL_VARIABLE } from './constants';
const route = useRoute()
const router = useRouter()

const userData = useCookie('userData')
export default {

    async get(url, data, headers = {}) {
        const { currentRole } = GLOBAL_VARIABLE.useAuth
        const accessToken = getCurrentAccessToken();
        headers.Authorization = `Bearer ${accessToken}`;
        headers.AccessToken = `${accessToken}`;
        const res = await axios.get(url, data, { headers: headers });
        return res.data;
    },
    async getUpdat(url, data = {}, headers = {}) {
        const { currentRole } = GLOBAL_VARIABLE.useAuth

        const accessToken = getCurrentAccessToken();
        headers.Authorization = `Bearer ${accessToken}`;
        headers.AccessToken = `${accessToken}`;

        // Make sure to pass the data as query parameters
        try {
            const res = await axios.get(url, { params: data, headers: headers });
            return res.data;
        } catch (e) {
            if (e.status == '401') {


                useCookie('accessToken').value = null
                userData.value = null

                useCookie('userAbilityRules').value = null
                try {
                    console.log('GLOBAL_VARIABLE.ability ==== ', GLOBAL_VARIABLE.ability)
                    GLOBAL_VARIABLE.ability.update([]);
                } catch (error) { }

                await GLOBAL_VARIABLE.route.push('/login')

            }
        }


    },
    async post(url, data, headers = {}) {
        const { currentRole } = GLOBAL_VARIABLE.useAuth

        const accessToken = getCurrentAccessToken();//useCookie(currentRole.value + '-accessToken').value;
        headers.Authorization = `Bearer ${accessToken}`;
        headers.AccessToken = `${accessToken}`;

        const res = await axios.post(url, data, { headers: headers });
        return res.data;
    },

    async getDataTableRecord(url_api, payload, columns) {
        console.log('GET_TASK_API_LIST', url_api, columns)
        let url = BASE_URL + url_api || '/api' + url_api
        const defaultQuery = {
            draw: 0,
            columns: [],
            order: [],
            start: (payload.page - 1) * payload.itemsPerPage,
            length: payload.itemsPerPage,
            search: {
                value: payload.search,

            },
            ...payload.filters,

        }
        const i = 0;
        for (let column of columns) {
            defaultQuery.columns.push(
                {
                    data: column.key,
                    searchable: column.searchable == undefined ? true : column.searchable,
                    orderable: column.orderable == undefined ? true : column.orderable,
                    name: column.name ?? '',
                }
            )
        }
        for (let sort of payload.sortBy) {
            const index = columns.findIndex(column => column.key == sort.key)
            defaultQuery.order.push({
                column: index,
                dir: sort.order,
                name: columns[index]?.name ?? '',

            })
        }
        const data = await this.getUpdat(url, defaultQuery);


        return {
            items: data.data,
            total: data.recordsTotal,
        }
    },
    async getDataTableRecordByGet(url_api, payload, columns) {
        console.log('GET_TASK_API_LIST', url_api)
        let url = BASE_URL + url_api || '/api' + url_api
        const defaultQuery = {
            draw: 0,
            columns: [],
            order: [],
            start: (payload.page - 1) * payload.itemsPerPage,
            length: payload.itemsPerPage,
            search: {
                value: payload.search,

            },
            ...payload.filters,

        }
        const i = 0;
        for (let column of columns) {
            defaultQuery.columns.push(
                {
                    data: column.key,
                    searchable: column.searchable == undefined ? true : column.searchable,
                    orderable: column.orderable == undefined ? true : column.orderable,
                    name: '',
                }
            )
        }
        for (let sort of payload.sortBy) {
            const index = columns.findIndex(column => column.key == sort.key)
            defaultQuery.order.push({
                column: index,
                dir: sort.order,
                name: '',

            })
        }
        const data = await this.post(url, qs.stringify(defaultQuery));
        return {
            items: data.data,
            total: data.recordsTotal,
        }
    },
}
