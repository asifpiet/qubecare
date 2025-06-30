import { roleService } from '@/services/roleService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'

const role = {
    name: '',
    guard_name: '',
    status: '',
}

export const useRoleStore = defineStore('roles', {
    state: () => ({
        id: null,
        role: { ...role },
        isDrawerOpen: false,
        roles: [],
        rolePermissions: null,
        permissions: null
    }),
    actions: {

        async loadRole(data) {
            this.id = data.id
            this.role = data.role
        },

        unloadRole() {
            this.id = null
            this.role = { ...role }
        },

        async getRoleByID() {
            await roleService.getRoleByID().then((response) => {
                this.role = response
            })
        },

        async getRoles() {
            await roleService.getRoles().then((response) => {
                this.roles = response
            })
        },

        async saveRole() {
            showLoader()
            let response = await roleService.saveRole(this.role, this.id);
            if (response && response?.message) {
                addAlert('Saved successfully', 'success')
            }
            else {
                addAlert('Something went wrong', 'error')
            }

            hideLoader()
        },

        async deleteRole(id) {
            showLoader()
            try {
                await roleService.deleteRole(id)
                hideLoader()
                addAlert('Deleted successfully', 'success')
            } catch (error) {
                hideLoader()
                addAlert('Something went wrong', 'error')
            }
        },

        async getRolePermissions(id) {
            await roleService.getRolePermissions(id).then((response) => {
                this.rolePermissions = response
            })
        },

        async saveRolePermissions(data, id) {
            showLoader()
            let response = await roleService.saveRolePermissions(data, id);
            if (response && response?.message) {
                addAlert('Saved successfully', 'success')
            }
            else {
                addAlert('Something went wrong', 'error')
            }

            hideLoader()
        },

        async refreshAbilities() {
            await roleService.refreshAbilities().then((response) => {
                this.permissions = response
            })
        },

    },
    getters: {

    },
})

