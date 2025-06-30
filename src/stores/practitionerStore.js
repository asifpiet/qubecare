import { practitonerService } from '@/services/practitionerService'
import { defineStore } from 'pinia'
export const usePractitionerStore = defineStore('practitioner', {
    state: () => ({
        practitioners: [],
        loggedInPractitioner: {},
        locations: [],
        slots: {},
        practitionerProfile: {},
        navAppointmentToggle: 'calendar',
        navUsersToggle: false,
        upcomingAppointments: [],
        startDate: null,
        endDate: null,
        appointmentDrawer: false,
        products: [],
        practitioner: null
    }),
    actions: {
        async practitionersList() {
            await practitonerService.getPractitionersList().then((response) => {
                this.practitioners = response
            })
        },
        async affiliatePatientPractitionersList(id) {
            this.practitioners = [];
            await practitonerService.affiliatePatientPractitionersList(id).then((response) => {
                this.practitioners = response
            })
        },

        async getloggedInPractitioner(id) {
            await practitonerService.getLoggedInPractitioner(id).then((response) => {
                this.loggedInPractitioner = response
            })
        },

        async locaiationsList() {
            await practitonerService.getLocationsList().then((response) => {
                this.locations = response
            })
        },

        async getSlots(data, id) {
            await practitonerService.getPractitionerSlots(data, id).then((response) => {
                this.slots = response
            })
        },

        async getPractitionerProfile(id) {
            await practitonerService.getPractitionerProfile(id).then((response) => {
                this.practitionerProfile = response
            })
        },
        async getAdminProfile(id) {
            await practitonerService.getAdminProfile(id).then((response) => {
                this.practitionerProfile = response
            })
        },

        async updatePractitionerProfile(data, id) {
            showLoader()
            await practitonerService.updatePractitionerProfile(data, id).then((response) => {
                addAlert('Successfully updated', 'success')
            })
            hideLoader()
        },
        async updateAdminProfile(data, id) {
            showLoader()
            await practitonerService.updateAdminProfile(data, id).then((response) => {
                addAlert('Successfully updated', 'success')
            })
            hideLoader()
        },
        async getUpcomingAppointments() {
            await practitonerService.getUpcomingAppointments({ start_date: this.startDate, end_date: this.endDate }).then((response) => {
                console.log('getUpcomingAppointments', response)
                this.upcomingAppointments = response
            })
        },

        async savePassword(data) {
            let response = await practitonerService.savePassword(data);
            return response
        },

        async getPractitionerProducts() {
            let response = await practitonerService.getPractitionerProducts();
            this.products = response.data
        },

        async getPractitionerInfoUnAuth(id) {
            let response = await practitonerService.getPractitionerInfoUnAuth(id);
            this.practitioner = response.data
        },

        async getHubSpotAuth(id) {
            showLoader()
            await practitonerService.getHubSpotAuth().then((response) => {
                addAlert('Successfully connected', 'success')
            })
            hideLoader()
        },
    },
    getters: {

    },
})
