import { userService } from '@/services/userService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'


export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        isDrawerOpen: false,
    }),
    actions: {

        async getUserByID(id) {
            showLoader()
            await userService.getUserByID(id).then((response) => {
                this.user = response
            })
            hideLoader()
        },

        async saveUser(data, id = null) {
            showLoader()
            let response = await userService.saveUser(data, id);
            if (response && response.messages) {
                addAlert(response.data, 'error')
            } else {
                addAlert('Saved successfully', 'success')
            }


            hideLoader()
            return response
        },

    },
    getters: {

    },
})

