// import { $api } from '@/utils/api';
import baseService from './baseService';

class UserService extends baseService {

    async saveUser(data, id) {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }
            let res = await $api(id ? `${UPDATE_USER_API}/${id}` : ADD_USER_API, {
                method: 'POST',
                body: formData,
            })
            return res
        } catch (error) {
            if (error.response?.status === 500) {
                const errorMessage = error.response._data;
                return errorMessage
            }
        }
    }

    async getUserByID(id) {
        let res = await $api(`${GET_SINGLE_USER}/${id}`, {
            method: 'GET',
        })

        return res.data
    }

    // async deleteRole(id) {
    //     let res = await $api(`${ADMIN_DELETE_ROLES_BY_ID_API}/${id}`, {
    //         method: 'DELETE',
    //     })

    //     return res
    // }

}

export const userService = new UserService()
