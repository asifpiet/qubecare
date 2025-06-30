import { patientRegService } from '@/services/patientRegService';
import { addAlert } from '@/utils/showLoader';
import { defineStore } from 'pinia';

const patient = {
    id: null,
    email: null,
    password: null,
    first_name: null,
    last_name: null,
    dob: null,
    phone_no: null,
    gender: null,
    isPolicy: false,
    termAndCondtiton: false,
    receviceSMs: false,
    isportalAccess: true,
    provider_id: null,
    affiliate_email: null
}
const appointment = {
    id: null,
    appointment_date: null,
    appointment_time: null,
    timezone: 'EST',
    month: null,
    timeSlotString: null,
    timeSlotFormatedString: null,
    formatedDateString: null,
    formatted_datetime: null,
    start_time: null,
    appointment_type: null,
    practitioner_fee: 0
}
export const usePatientRegStore = defineStore('patientReg', {
    state: () => ({
        currentIndex: 0,
        currentProfileState: 0,
        currentPage: null,
        products: [],
        cart_products: [],
        order_id: null,
        wp_order_id: null,
        patient: patient,
        currentState: 'checklogin',
        patient_data: null,
        appointment: appointment,
        paymentProcessed: false,
        submittedForm: [],
        forms: [],
        patientExist: false,
        appliedCoupon: null,
        discountAmount: 0,
    }),
    actions: {

        resetCoupon() {
            this.appliedCoupon = null;
            this.discountAmount = 0;
        },

        setAppointment(data) {
            this.appointment.appointment_date = data.appointment_date
            this.appointment.appointment_time = data.appointment_time
            this.appointment.timezone = data.timezone
            this.appointment.timeSlotString = data.timeSlotString
            this.appointment.timeSlotFormatedString = data.timeSlotFormatedString
            this.appointment.formatted_datetime = data.formatted_datetime
            this.appointment.formatedDateString = data.formatedDateString
            this.appointment.start_time = data.start_time
        },

        setState(data) {
            console.log('data?.patient', data)
            this.currentIndex = data?.currentIndex ?? 0
            this.products = data?.products ?? []
            this.cart_products = data?.cart_products ?? []
            this.patient = data?.patient ?? {}
            this.currentState = data?.currentState ?? 'checklogin'
            this.patient_data = data?.patient_data ?? null
            this.appointment = data?.appointment ?? appointment
            this.forms = data?.forms ?? []
            this.submittedForm = data?.submittedForm ?? []
            this.order_id = data?.order_id ?? null
            this.wp_order_id = data?.wp_order_id ?? null
            this.patient.affiliate_email = data?.patient ? data?.patient?.affiliate_email : null
        },

        async bookAppointment(data) {
            showLoader()
            let res = await patientRegService.bookAppointment(data);
            if (res.appointment.id)
                this.appointment.id = res.appointment.id
            addAlert('Appointment booked successfully', 'success')
            hideLoader()
        },

        async saveOrder(data) {
            showLoader()
            let orderRes = await patientRegService.saveOrder(data);
            console.log('Order Response', orderRes.order.id)
            // this.paymentProcessed = true
            if (orderRes.order.id) this.order_id = orderRes.order.id
            addAlert('Payment Successful', 'success')
            hideLoader()
        },

        async saveForm(data) {
            showLoader()
            let res = await patientRegService.saveForm(data);
            this.paymentProcessed = true
            hideLoader()
        },

        async getProductByProviderId(id) {
            let response = await patientRegService.getProductByProviderId(id);
            this.products = response
        },

        async checkPatientEmail(data) {
            showLoader()
            let res = await patientRegService.checkPatientEmail(data);
            if (res.message.trim() === "Exists") {
                this.currentState = 'login'
                this.patientExist = true
            } else {
                this.currentState = 'register'
                this.patientExist = false
            }
            hideLoader()
        },

        async loginPatient() {
            showLoader()
            try {
                let response = await patientRegService.loginPatient({ email: this.patient.email, password: this.patient.password });
                this.patient_data = response.userData
            } catch (e) {
                console.log(e);
                addAlert("Sorry, that email or password didn't work.", "error")

            }
            hideLoader()
        },

        async registerPatient() {
            showLoader()
            try {
                let response = await patientRegService.registerPatient(this.patient);
                console.log('response', response)
                this.currentIndex = 2

                if (response.error)
                    addAlert(response.error, "error")
                else
                    addAlert("Registered successfully", "success")
            } catch (e) {
                console.log(e);
                addAlert(e.response?.data.errors, "error")

            }
            hideLoader()
        },

        async updateOrderState(data, id) {
            try {
                let response = await patientRegService.updateOrderState(data, id);

            } catch (e) {
                console.log(e);
                addAlert("Something went wrong", "error")

            }
        },

        async saveAffiliateOrder(data) {
            showLoader()
            let orderRes = await patientRegService.saveAffiliateOrder(data);
            console.log('Order Response', orderRes.order.id)
            // this.paymentProcessed = true
            if (orderRes.order.id) this.order_id = orderRes.order.id
            addAlert('Order processed Successfully', 'success')
            hideLoader()
        },

        async bookAffiliateAppointment(data) {
            showLoader()
            let res = await patientRegService.bookAffiliateAppointment(data);
            if (res.appointment.id)
                this.appointment.id = res.appointment.id
            addAlert('Appointment booked successfully', 'success')
            hideLoader()
        },

    },
    getters: {

    },
})

