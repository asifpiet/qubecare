import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        showLoader: false,
        alerts: []
    }),
    actions: {
    },
    getters: {

    },
})
