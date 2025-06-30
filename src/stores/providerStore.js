import { providerService } from '@/services/providerService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'


const passwordReset = {
    email: '',
    verification_code: '',
    password: '',
    password_confirmation: ''
}

const setPassword = {
    token: '',
    password: '',
}

export const useProviderStore = defineStore('provider', {

    state: () => ({


        dashboard: {
            stats: [],
            monthly: [],
            totalPaitient: 0,
            patientPercentageChange: 0,
            upcomingAppointments: [],
            upcomingAppointmentCount: 0,
            missedAppointments: 0,
            invoices: [],
            totalInvoice: 0,
            totalOrderPrice: 0,
            totalOrder: 0,
            totalOrderItem: 0,
            onboarding_total_tasks: 0,
            onboarding_completed_tasks: 0,
            onboarding_completed_percentage: 0,
            appointmentsThisWeek: 0,
            appointmentsNextWeek: 0,
            totalPractitionerRevenue: 0,
            revenuePercentageChange: 0,
            totalUnpaidInvoices: 0,
            builder_id: null,
        },
        appointementReport: [],
        providerReport: [],
        invocieReport: [],
        ProviderChat: [],
        invocieStats: [],
        timeLineReport: [],
        prescriptionReport: [],
        langauge: 'en',
        label: 'English',
        start_date: null,
        end_date: null,
        status: null,
        provider: null,
        passwordReset: { ...passwordReset },
        setPassword: { ...setPassword },

    }),


    actions: {
        async getDashbaordStats() {
            showLoader()
            await providerService.getDashbaordStats(this.start_date, this.end_date).then((response) => {
                this.dashboard = response;
                console.log("dashboard", this.dashboard);
            })
            hideLoader()
        },
        async getAppointmentReport() {
            this.appointementReport = [];
            showLoader()
            await providerService.getAppointmentReport(this.start_date, this.end_date, this.status, this.provider).then((response) => {
                this.appointementReport = response;
                console.log("appointment", this.appointementReport);
            })
            hideLoader()
        },
        async downloadFile(type, module) {
            showLoader()
            await providerService.downloadFile(type, module, this.start_date, this.end_date, this.provider).then((response) => {
                console.log("appointment", response);
            })
            hideLoader()
        },

        async getProviderReport() {
            this.providerReport = [];
            showLoader()
            await providerService.getProviderReport(this.start_date, this.end_date).then((response) => {
                this.providerReport = response;
                console.log("providerReport", this.providerReport);
            })
            hideLoader()
        },
        async getInvocieReport() {
            this.invocieReport = [];
            showLoader()
            await providerService.getInvocieReport(this.start_date, this.end_date).then((response) => {
                this.invocieReport = response;
                console.log("invocieReport", this.invocieReport);
            })
        },

        async getInvocieStats() {
            this.invocieStats = [];
            showLoader()
            await providerService.getInvoiceStats().then((response) => {
                this.invocieStats = response;
                console.log("getInvoiceState", this.invocieStats);
            })


            hideLoader()
        },


        async forgotPassword(email) {

            showLoader();
            this.passwordReset.email = email;
            // Call the forgot password API
            const response = await providerService.forgotPassword(email);
            return response;

            hideLoader();
        },


        async resetPassword() {
            showLoader();
            const response = await providerService.resetPassword({ ...this.passwordReset });
            hideLoader();
            return response;
        },


        async getTimeLineReport() {
            this.timeLineReport = [];
            showLoader()
            await providerService.getTimeLineReport(this.start_date, this.end_date).then((response) => {
                this.timeLineReport = response;
                console.log("timeLineReport", this.timeLineReport);
            })
            hideLoader()
        },
        async getPrescriptionReport() {
            this.prescriptionReport = [];
            showLoader()
            await providerService.getPrescriptionReport(this.start_date, this.end_date).then((response) => {
                this.prescriptionReport = response;
                console.log("prescriptionReport", this.prescriptionReport);
            })
            hideLoader()
        },
        async importxls(data, delete_exist) {
            showLoader()
            await providerService.importxls(data, delete_exist).then((response) => {
                console.log("response", response);
                addAlert('CSV Import successfully', 'success')
            })
            hideLoader()
        },



    },
    getters: {

    },
})    
