import { patientService } from '@/services/patientService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'

const demographic = {
    firstName: '',
    lastName: '',
    fullName: '',
    middleName: '',
    preferredName: '',
    email: '',
    contactMethod: '',
    personalID: '',
    dateOfBirth: '',
    sexatBirth: '',
    genderIdentity: '',
    race: '',
    pronoun: '',
    ageGroup: '',
    timezone: null,
    preferredPhone: '',
    alternativePhone: '',
    textmsgNumber: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    primaryPractitioner: '',
    primaryCarePhysician: '',
    guardian: '',
    emergencyContactNumber: '',
    emergencyContactNameRelation: '',
    patientMaritalStatus: '',
    occupation: '',
    referredBy: '',
    patientNote: '',
    password: '',
    status: 'active',
    isportalAccess: '',
    profilePicture: '',
    avatar: '',

}
const nextofkin = {
    nextKinRelation: '',
    nextkinFirstName: '',
    nextkinLastName: '',
    nextkinPhone: '',
    nextkinAddress: '',
    nextkinCity: '',
    nextkinState: '',
    nextkinZipCode: '',
    nextKinGuarantor: ''

}
const insurance = {
    insurance: '',
    insuredPlanOrProgramName: '',
    insuredIDNumber: '',
    insuredGroupNameNo: '',
    employersSchoolName: '',
    relationshiptoInsured: '',
    insuredName: '',
    insuredDateOfBirth: '',
    insuredGender: '',
    coPayment: '',
    coInsurance: '',
    insuranceDeductible: '',
    insuredAddress: '',
    insuredCity: '',
    insuredState: '',
    insuredZip: '',
    insuredPhone: '',
    payerName: '',
    payerID: '',
    payerAddress: '',
    payerCity: '',
    payerState: '',
    payerZip: '',
    referringProviderName: '',
    referringProviderNPI: '',
    referringProviderTaxonomy: '',
    type: "secondary",
}

const logisticData = [
    {
        icon: 'tabler-calendar',
        color: 'primary',
        title: 'Upcoming Appointments',
        value: 0,
        change: 0,
        isHover: false,
        footerText: ''
    },
    // {
    //     icon: 'tabler-calendar',
    //     color: 'warning',
    //     title: 'Missed Appointments',
    //     value: 0,
    //     change: 0,
    //     isHover: false,
    //     footerText: ''
    // },
    {
        icon: 'tabler-file-invoice',
        color: 'error',
        title: 'Invoices',
        value: 0,
        change: 0,
        isHover: false,
        footerText: ''
    },
    {
        icon: 'tabler-shopping-cart',
        color: 'info',
        title: 'Orders',
        value: 0,
        change: 0,
        isHover: false,
        footerText: ''
    }
];


const passwordReset = {
    email: '',
    passcode: '',
    password: '',
    password_confirmation: ''
}

const setPassword = {
    token: '',
    password: '',
}
const dataWidget = {
    'patient_id': '', // Use .value to access the ref's value
    'practitioner': '',
    'id': '',
}
export const usePatientStore = defineStore('patientstore', {
    state: () => ({
        id: null,
        uuid: null,
        tags: [],
        start_date: null,
        end_date: null,
        patientHistory: [],
        setPassword: { ...setPassword },
        demographic: { ...demographic },
        nextofkin: { ...nextofkin },
        insurance: { ...insurance },
        isDrawerOpen: false,
        isSubDrawerOpen: false,
        patients: [],
        patientsOutMap: [],
        appointments: [],
        lastRecentAppointments: [],
        appointmentMonthlyDates: [],
        appointmentMonthlyData: [],
        googleAppointments: [],
        rescheduleAppointment: [],
        logisticData: { ...logisticData },
        passwordReset: { ...passwordReset },
        dataWidget: { ...dataWidget },
        messagesListBySubject: null,
        patientMessagesListBySubject: null,
        messagesList: null,
        patientMessagesList: [],
        documents: [],
        appointment_order: { order_id: null, provider_id: null, builder_id: null, items: [], discounted_amount: 0, promo_code: null }
    }),
    actions: {

        async patientsList() {
            await patientService.getPatientsList().then((response) => {
                console.log(response)
                this.patients = response
            })
        },
        async patientsListWithOutMap() {
            await patientService.getPatientsListWithOutMap().then((response) => {
                console.log(response)
                this.patientsOutMap = response
            })
        },
        async loadPatient(id) {
            showLoader()
            // addAlert('Loading Patient', 'info')
            // addAlert('Loading Patient', 'primary')
            await patientService.getPatient(id).then((response) => {
                this.id = response.id
                this.uuid = response.uuid
                this.demographic = response.demographic
                this.nextofkin = response.nextofkin
                // this.insurance = response.insurance
            })


            await patientService.getPatientInsurance(id).then((response) => {
                if (response)
                    this.insurance = response
                else
                    this.insurance = { ...insurance }
            })

            hideLoader()
        },
        async loadAffilatePatient(id) {
            showLoader()
            // addAlert('Loading Patient', 'info')
            // addAlert('Loading Patient', 'primary')
            await patientService.loadAffilatePatient(id).then((response) => {
                this.id = response.id
                this.uuid = response.uuid
                this.demographic = response.demographic
                this.nextofkin = response.nextofkin
                // this.insurance = response.insurance
            })


            await patientService.getAffiliatePatientInsurance(id).then((response) => {
                if (response)
                    this.insurance = response
                else
                    this.insurance = { ...insurance }
            })

            hideLoader()
        },

        async patientTags(id) {
            this.tags = [];
            await patientService.getPatientTags(id).then((response) => {
                if (response)
                    this.tags = response.tags;
                console.log("patientTagsNew", this.tags);
            })
        },

        async updateTags() {
            showLoader()
            let response = await patientService.updateTags(this.tags, this.id);
            console.log("response", response);
            if (response && response?.message) {
                addAlert(response?.message, 'success')
            }

            hideLoader()
        },

        async getPatientHistory(id) {
            this.tags = [];
            await patientService.patientHistory(id).then((response) => {
                if (response)
                    this.patientHistory = response;
                console.log("patientHistory", this.patientHistory);
            })
        },

        unloadPatient() {
            this.id = null
            this.uuid = null
            this.demographic = { ...demographic }
            this.nextofkin = { ...nextofkin }
            this.insurance = { ...insurance }

        },
        unloadDateRange() {
            this.start_date = null
            this.end_date = null
        },
        unloadsetPassword() {
            this.setPassword = { ...setPassword }
        },
        async saveDemographic(formData) {
            showLoader()
            let response = await patientService.saveDemographic({ formData, ...this.demographic }, this.id);
            console.log("response", response);
            if (response && response?.message && response?.data) {
                addAlert(response?.message, 'success')
                await this.loadPatient(response?.data.id);
                if (formData && this.id) {
                    console.log("Uploading avatar...");
                    const avatarResponse = await patientService.saveAvater({ formData }, this.id);
                    console.log('Avatar upload response:', avatarResponse);

                    // Update profile picture in store if successful
                    if (avatarResponse) {
                        this.demographic.profilePicture = this.demographic.profilePicture;
                    }
                }
                return true;
            }
            else if (response && response?.message) {
                addAlert(response?.message, 'success')
                await this.loadPatient(this.id)
                if (formData && this.id) {
                    console.log("Uploading avatar...");
                    const avatarResponse = await patientService.saveAvater({ formData }, this.id);
                    console.log('Avatar upload response:', avatarResponse);

                    // Update profile picture in store if successful
                    if (avatarResponse) {
                        this.demographic.profilePicture = this.demographic.profilePicture;
                    }
                }
                return true;
            }
            else {
                addAlert(response?.error, 'error')
                hideLoader()
            }
            // this.isDrawerOpen = false


            hideLoader()
        },
        saveInsurance() {
            patientService.saveInsurance(this.insurance, this.id).then((response) => {
                if (response.message)
                    addAlert(response?.message, 'success')
            })
        },
        saveAffiliateInsurance() {
            patientService.saveAffiliateInsurance(this.insurance, this.id).then((response) => {
                if (response.message) {
                    addAlert(response?.message, 'success')
                }

            })
        },

        saveAffiliateNextofkin() {
            patientService.saveAffiliateNextofkin(this.nextofkin, this.id).then((response) => {
                // this.nextofkin = response
            })
        },
        saveNextofkin() {
            showLoader()
            patientService.saveNextofkin(this.nextofkin, this.id).then((response) => {
                if (response.message) {
                    addAlert(response?.message, 'success')
                    return true;
                }



                // this.nextofkin = response
            })
            hideLoader()

        },


        async affiliateSaveDemographic(formData) {
            showLoader()
            let response = await patientService.affiliateSaveDemographic({ formData, ...this.demographic }, this.id);
            console.log("response", response);
            if (response && response?.message && response?.data) {
                addAlert(response?.message, 'success')
                this.loadAffilatePatient(response?.data.id)
            }
            else if (response && response?.message) {
                addAlert(response?.message, 'success')
                this.loadAffilatePatient(this.id)
            }
            else {
                addAlert(response?.error, 'error')
                hideLoader()
            }
            this.isDrawerOpen = false
            await patientService.saveAvater({ formData, ...this.demographic }, this.id).then((response) => {
                console.log('saveAvater response', response)
            })

            hideLoader()
        },
        copyNextFromDemographic() {
            this.nextofkin.nextkinFirstName = this.demographic.firstName;
            this.nextofkin.nextkinLastName = this.demographic.lastName;
            this.nextofkin.nextkinPhone = this.demographic.preferredPhone;
            this.nextofkin.nextkinAddress = this.demographic.address;
            this.nextofkin.nextkinCity = this.demographic.city;
            this.nextofkin.nextkinState = this.demographic.state;
            this.nextofkin.nextkinZipCode = this.demographic.zipcode;
        },

        copyInsuranceFromDemographic() {
            this.insurance.insuredPhone = this.demographic.preferredPhone;
            this.insurance.insuredAddress = this.demographic.address;
            this.insurance.insuredCity = this.demographic.city;
            this.insurance.insuredState = this.demographic.state;
            this.insurance.insuredZip = this.demographic.zipcode;
        },
        async calendarAppointments(data) {
            showLoader()
            await patientService.getCalendarAppointments(data).then((response) => {
                this.appointments = response.appointments
                this.googleAppointments = response.googel_events
            })
            hideLoader()
        },

        async saveCalendarAppointment(data, id) {
            showLoader()
            let response = await patientService.saveCalendarAppointment(data, id)
            addAlert('Appointment saved successfully', 'success')
            hideLoader()
            return response.appointment

        },

        async updatePatientAppointment(data, id) {
            showLoader()
            let response = await patientService.updatePatientAppointment(data, id)
            addAlert('Appointment update successfully', 'success')
            hideLoader()
            return response.appointment

        },

        async createSupportTicket(data) {
            showLoader()
            try {
                let response = await patientService.createSupportTicket(data);
                addAlert('Ticket created successfully', 'success')
            } catch (e) {
                console.log(e);
                addAlert("Something went wrong", "error")

            }
            hideLoader();
        },
        async cancelAppointment(id) {
            showLoader()
            let response = await patientService.cancelAppointment(id)
            addAlert('Appointment canceled successfully', 'success')
            hideLoader()
            return response.appointment

        },


        async getDocumentList(id) {
            showLoader()
            await patientService.getDocumentList(id).then((response) => {
                this.documents = response
                console.log('docuemtns', this.documents);
            })
            hideLoader()


        },

        async getLastRecentAppointment(id) {
            console.log('fffff ', id)
            this.lastRecentAppointments = [];
            showLoader()
            await patientService.getLastRecentAppointment(id).then((response) => {
                this.lastRecentAppointments = response
                console.log('lastRecentAppointments', this.lastRecentAppointments);
            })
            hideLoader()


        },
        async AddEmail(data, id) {
            showLoader()
            await patientService.AddEmail(data, id)
            hideLoader()
            addAlert('Sent successfully', 'success')

        },

        async AddPhoneLog(data, id) {
            showLoader()
            await patientService.AddPhoneLog(data, id)
            hideLoader()
            addAlert('Added successfully', 'success')

        },

        async AddMessage(data, id) {
            showLoader()
            await patientService.AddMessage(data, id)
            hideLoader()
            addAlert('Added successfully', 'success')

        },
        async AddMessageOnBaseSubject(data, id) {
            showLoader()
            await patientService.AddMessageOnBaseSubject(data, id)
            hideLoader()
            addAlert('send Message Successfully!', 'success')

        },

        async getMessagesList(id) {
            showLoader()

            await patientService.getMessagesList(id).then((response) => {
                this.messagesList = response
            })

            hideLoader()


        },

        async getPatientMessagesList(id) {
            showLoader()

            await patientService.getPatientMessagesList(id).then((response) => {
                this.patientMessagesList = response
            })

            hideLoader()


        },

        async getPatientMessagBySubject(id) {
            showLoader()

            await patientService.getPatientMessagBySubject(id).then((response) => {
                this.patientMessagesListBySubject = response
            })

            hideLoader()


        },

        async getMessagBySubject(id) {
            showLoader()

            await patientService.getMessagBySubject(id).then((response) => {
                this.messagesListBySubject = response
            })

            hideLoader()


        },
        async addDocument(data, id) {
            showLoader()
            await patientService.addDocument(data, id)
            hideLoader()
            addAlert('Uploaded successfully', 'success')

        },

        async addPatientDocument(data, id) {
            showLoader()
            await patientService.addPatientDocument(data, id)
            hideLoader()
            addAlert('Uploaded successfully', 'success')

        },

        async getPatientPortalDashboard(id) {
            showLoader()
            await patientService.getPatientPortalDashboard(this.start_date, this.end_date, id).then((response) => {
                if (response)
                    this.logisticData[0].value = response.upcomingAppointmentCount ?? 0; // Default to 0 if value is null or undefined
                // this.logisticData[1].value = response.missedAppointmentsCounts ?? 0; // Default to 0 if value is null or undefined
                this.logisticData[1].value = response.invoices?.length ?? 0; // Number of invoices
                this.logisticData[2].value = response.totalAppointments ?? 0; // Total appointments
                this.appointmentMonthlyDates = response.monthly;
                this.appointmentMonthlyData = response.monthlyData;
                console.log("Dashboard", this.logisticData);
            })
            hideLoader()
        },

        async sendFormRequest(data) {
            showLoader();
            const response = await patientService.sendFormRequest(data);
            hideLoader();
            return response;
        },

        async resetPassword() {
            showLoader();
            const response = await patientService.resetPassword({ ...this.passwordReset });
            hideLoader();
            return response;
        },

        async createPassword() {
            showLoader();
            const response = await patientService.createPassword({ ...this.setPassword });
            hideLoader();
            return response;
        },

        async forgotPassword(email) {

            showLoader();
            this.passwordReset.email = email;
            // Call the forgot password API
            const response = await patientService.forgotPassword(email);
            return response;
            // Log the response for debugging
            console.log("Response:", response.message);

            // Handle success or error messages
            // if (response.message === "Password reset passcode has been sent to your email.") {
            //     addAlert(response.message, 'success');
            //     return response.message;
            // } else {
            //     addAlert(response.message, 'error');
            // }
            hideLoader();
        },

        async resetPassword() {
            showLoader();
            const response = await patientService.resetPassword({ ...this.passwordReset });
            hideLoader();
            return response;
        },



        async changeAvatar(formData, id) {
            showLoader()
            await patientService.changeAvatar(formData, id).then((response) => {
                if (response)
                    console.log("response", response);
            })
            hideLoader()
        },
        async getPatientMe(id) {
            showLoader()
            await patientService.getPatientMe(id).then((response) => {
                if (response)
                    console.log("response", response);
                this.demographic.firstName = response.firstName;
                this.demographic.lastName = response.lastName;
                this.demographic.email = response.email;
                this.demographic.preferredPhone = response.extraData.preferred_phone;
                this.demographic.contactMethod = response.extraData.contact_method;
                this.demographic.dateOfBirth = response.dateOfBirth;
                this.demographic.sexatBirth = response.sexatBirth;
                this.demographic.genderIdentity = response.genderIdentity;
                this.demographic.ageGroup = response.extraData.age_group;
                this.demographic.alternativePhone = response.extraData.alternative_phone;
                this.demographic.address = response.address;
                this.demographic.timezone = response.timezone;
                this.demographic.city = response.city;
                this.demographic.state = response.state;
                this.demographic.status = response.status;
                this.demographic.zipcode = response.zipcode;
                this.demographic.primaryCarePhysician = response.extraData.primary_care_physician;
                this.demographic.emergencyContactNumber = response.extraData.emergency_contact;
                this.demographic.emergencyContactNameRelation = response.extraData.emergency_contact_name_relation;
                this.demographic.patientMaritalStatus = response.extraData.maarital_status;
                this.demographic.race = response.race;
                this.demographic.patientNote = response.extraData.note;
                this.demographic.profilePicture = response.profilePicture;
                this.demographic.avatar = response.avatar;
            })
            hideLoader()
        },



        async patientCancelAppointment(id) {
            showLoader()
            await patientService.patientCancelAppointment(id).then((response) => {
                if (response)
                    addAlert(response.message, 'success')
                console.log("response", response.message);
            })

            hideLoader()
        },
        async updatePatientMe(id) {
            showLoader()
            await patientService.updatePatientMe(this.demographic, id).then((response) => {
                if (response)
                    addAlert(response.message, 'success')
                console.log("response", response.message);
            })

            hideLoader()
        },



        async updateAppointmentStatus(id) {
            showLoader()
            await patientService.updateAppointmentStatus(id).then((response) => {
                if (response)
                    addAlert(response.message, 'success')
                console.log("response", response.message);
            })

            hideLoader()
        },

        async getAppointmentOrder(id) {
            try {
                let orderRes = await patientService.getAppointmentOrder(id);
                if (orderRes) {
                    this.appointment_order = orderRes;
                }
                console.log("getAppointmentOrder ", orderRes);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.error("Order not found");
                } else {
                    console.error("Error fetching order:", error);
                }
            }
        }










    },
    getters: {
        patientId: (state) => state.id,
        patient: (state) => {
            const { demographic, id, uuid, nextofkin } = state
            return { demographic, id, uuid, nextofkin }
        }
    },
})

