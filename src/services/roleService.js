// import { $api } from '@/utils/api';
import baseService from './baseService';

class RoleService extends baseService {

    async getRoles(id) {
        let res = await $api(`${ROLES_LIST_DROPDOWN_API}`, {
            method: 'GET',
        })

        return res.data
    }

    async saveRole(data, id) {
        let res = await $api(id ? `${ADMIN_UPDATE_ROLES_BY_ID_API}/${id}` : ADMIN_GET_ROLES_SAVE_API, {
            method: 'POST',
            body: data,
        })
        return res
    }

    async getRoleByID(id) {
        let res = await $api(`${ADMIN_GET_ROLES_BY_ID_API}/${id}`, {
            method: 'GET',
        })

        return res.data
    }

    async deleteRole(id) {
        let res = await $api(`${ADMIN_DELETE_ROLES_BY_ID_API}/${id}`, {
            method: 'DELETE',
        })

        return res
    }

    async getRolePermissions(id) {
        let res = await $api(`${ADMIN_GET_PERMISSION_ROLE_API}/${id}`, {
            method: 'GET',
        })

        return res.data
    }

    async saveRolePermissions(data, id) {
        let res = await $api(`${ADMIN_UPDATE_PERMISSION_API}/${id}`, {
            method: 'POST',
            body: data,
        })
        return res
    }

    async refreshAbilities() {
        let res = await $api(`${REFRESH_ABLITIES_LINK}`, {
            method: 'GET',
        })

        return res.permissions
    }

    mapRoleData(data) {
        return {
            id: data.id,
            role: {
                name: data.name,
                guard_name: data.guard_name,
                status: data.status === 1 ? 'Active' : 'Inactive',
            },
        }
    }

}

export const roleService = new RoleService()
