import { $api } from '@/utils/api';
import moment from 'moment-timezone';
import baseService from './baseService';
class PatientService extends baseService {


    async getPatientsList() {
        let res = await $api(PATIENT_API_DATATABLE, {
            method: 'GET',
        })

        return res.data.map(this.mapListPatientData)
    }
    async getPatientsListWithOutMap() {
        let res = await $api(PATIENT_API_DATATABLE, {
            method: 'GET',
        })

        return res.data
    }
    async saveDemographic(data, id) {
        let res = await $api(id ? `${UPDATE_PATIENT_API}/${id}` : REGISTER_PATIENT_API, {
            method: 'POST',
            body: data,
        })
        console.log("res", res);
        return res
    }

    async affiliateSaveDemographic(data, id) {
        let res = await $api(`${AFFILIATE_UPDATE_PATIENT}/${id}`, {
            method: 'POST',
            body: data,
        })
        console.log("res", res);
        return res
    }



    async saveAvater(data, id) {
        let res = await $api(`${SAVE_PATIENT_AVATER_API}/${id}?path=patientinformation/patientphotograph`, {
            method: 'POST',
            body: data.formData,
        })

        return res.data
    }

    // saveInsurance(data, id) {
    //     return $api(`${data.insuranceId ? UPDATE_INSURACNE_API : SAVE_INSURACNE_API}/${id}`, {
    //         method: 'POST',
    //         body: data,
    //     })
    // }

    async saveInsurance(data, id) {
        const url = data.insuranceId
            ? `${UPDATE_INSURACNE_API}/${id}`
            : `${SAVE_INSURACNE_API}/${id}`;

        return $api(url, {
            method: 'POST',
            body: data,
        });
    }

    async saveAffiliateInsurance(data, id) {
        const url = data.insuranceId
            ? `${AFFILIATE_UPDATE_INSURACNE_API}/${id}`
            : `${AFFILIATE_SAVE_INSURACNE_API}/${id}`;

        return $api(url, {
            method: 'POST',
            body: data,
        });
    }



    async saveDemographic(data, id) {
        let res = await $api(id ? `${UPDATE_PATIENT_API}/${id}` : REGISTER_PATIENT_API, {
            method: 'POST',
            body: data,
        })
        console.log("res", res);
        return res
    }

    saveAffiliateNextofkin(data, id) {
        return $api(`${AFFILIATE_GUARDIAN_UPDATE}/${id}`, {
            method: 'POST',
            body: data,
        })
    }

    saveNextofkin(data, id) {
        return $api(`${UPDATE_NEXTOFKIN_API}/${id}`, {
            method: 'POST',
            body: data,
        })
    }

    async getPatient(id) {
        let res = await $api(`${GET_SINGLE_PATIENT_API}/${id}`, {
            method: 'GET',
        })

        return this.mapPatientData(res.data)
    }

    async loadAffilatePatient(id) {
        let res = await $api(`${GET_AFFIIATE_SINGLE_PATIENT_API}/${id}`, {
            method: 'POST',
        })

        return this.mapPatientData(res.data)
    }

    async getPatientPortalDashboard(start_date, end_date, id) {
        let res = await $api(`${PATIENT_DASHBOARD_PORTAL_API}/${id}`, {
            method: 'POST',
            body: {
                start_date: start_date,
                end_date: end_date,
            },
        })

        return res
    }



    async getPatientTags(id) {
        let res = await $api(`${PATIENT_TAGS_API}/${id}`, {
            method: 'GET',

        })

        return res
    }
    async getDocumentList(id) {
        let res = await $api(`${GET_PDF_LIST}/${id}`, {
            method: 'GET',

        })

        return res
    }

    async getLastRecentAppointment(id) {
        let res = await $api(`${GET_LAST_RECENT_APPOINTMENTS}/${id}`, {
            method: 'GET',

        })

        return res
    }





    async patientHistory(id) {
        let res = await $api(`${PATIENT_TAGS_API}/${id}`, {
            method: 'GET',

        })

        return res.data[0]
    }

    async updateTags(data, id) {

        let res = await $api(`${UPDATE_TAGS_API}/${id}`, {
            method: 'POST',
            body: {
                tags: data
            },
        })

        return res
    }

    mapListPatientData(data) {
        return {
            id: `${data.id}`,
            uuid: data.uuid,
            demographic: {
                firstName: data.firstName,
                lastName: data.lastName,
                fullName: `${data.firstName} ${data.lastName}`,
                middleName: data.mname,
                preferredName: '',
                email: data.email,
                timezone: data.timezone,
                contactMethod: '',
                personalID: '',
                dateOfBirth: data.dateOfBirth,
                sexatBirth: data.sexatBirth,
                genderIdentity: '',
                race: '',
                pronoun: '',
                ageGroup: '',
                preferredPhone: data.preferredPhone,
                alternativePhone: '',
                textmsgNumber: '', // Assuming text message number is the preferred phone
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
                password: '', // Not provided in the data
                status: data.pStatus,
                isportalAccess: false
            },
            nextofkin: {},
            insurance: {}, // Assuming this should be an empty object as it's not provided in the data
        }
    }

    mapPatientData(data) {
        return {
            id: data.id,
            uuid: data.uuid,
            demographic: {
                firstName: data.firstName,
                lastName: data.lastName,
                fullName: `${data.firstName} ${data.lastName}`,
                middleName: data.middleName,
                preferredName: data.preferredName,
                email: data.email,
                contactMethod: data.contactMethod,
                personalID: data.personalID,
                dateOfBirth: data.dateOfBirth,
                sexatBirth: data.sexatBirth,
                genderIdentity: data.genderIdentity,
                race: data.race,
                timezone: data.timezone,
                pronoun: data.pronoun,
                ageGroup: data.ageGroup,
                preferredPhone: data.preferredPhone,
                alternativePhone: data.alternativePhone,
                textmsgNumber: data.textmsgNumber, // Assuming text message number is the preferred phone
                address: data.address,
                city: data.city,
                state: data.state,
                zipcode: data.zipcode,
                primaryPractitioner: data.primaryPractitioner,
                primaryCarePhysician: data.primaryCarePhysician,
                guardian: data.guardiansname,
                emergencyContactNumber: data.emergencyContactNumber,
                emergencyContactNameRelation: data.emergencyContactRelation,
                patientMaritalStatus: data.patientMaritalStatus,
                occupation: data.occupation,
                referredBy: data.referrerID,
                patientNote: data.patientNote,
                password: '', // Not provided in the data
                status: data.status,
                isportalAccess: data.allow_patient_portal === '1',
                profilePicture: data.profile_picture
            },
            nextofkin: {
                nextKinRelation: data.guardianrelationship || '', // Assuming these fields are part of the data
                nextkinFirstName: data.guardiansname?.split('-')[0] || '',
                nextkinLastName: data.guardiansname?.split('-')[1] || '',
                nextkinPhone: data.guardianphone || '',
                nextkinAddress: data.guardianaddress || '',
                nextkinCity: data.guardiancity || '',
                nextkinState: data.guardianstate || '',
                nextkinZipCode: data.guardianpostalcode || '',
                nextKinGuarantor: data.nextKinGuarantor || ''
            },
            insurance: {}, // Assuming this should be an empty object as it's not provided in the data
        }
    }


    async getPatientInsurance(id) {
        let res = await $api(`${GET_INSURACNE_API}/${id}`, {
            method: 'GET',
        })

        return res.data
    }


    async getAffiliatePatientInsurance(id) {
        let res = await $api(`${AFFILIATE_GET_INSURANCE}/${id}`, {
            method: 'GET',
        })

        return res.data
    }
    async getPatientMe(id) {
        let res = await $api(`${GET_PATIENT_PORTAL_API}/${id}`, {
            method: 'GET',
        })

        return res.profile
    }

    async getCalendarAppointments(data) {

        let res = await $api(`${GET_FILTERED_APPOINTMENT}`, {
            method: 'POST',
            body: data,
        })
        let appointments = await Promise.all(res.appointments.map(appointment =>
            this.updateAppointment(appointment)
        ))
        console.log(appointments)
        let googel_events = res.googel_events
        return { appointments, googel_events }
    }
    async updateAppointment(appointment) {
        const { currentUser } = GLOBAL_VARIABLE.useAuth
        console.log('ggg', currentUser.value.time_zone)
        let timzoneFound = currentUser.value.time_zone
        let date = moment.utc(appointment.start).tz(timzoneFound).format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z";
        let start_time = moment.utc(appointment.start).tz(timzoneFound).format("hh:mm A")
        let end_time = moment.utc(appointment.start).tz(timzoneFound).add(30, 'minutes').format("hh:mm A")
        let start = moment.utc(appointment.start).tz(timzoneFound).format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z";
        let end = moment.utc(appointment.start).tz(timzoneFound).add(30, 'minutes').format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z";;
        console.log(date, start_time)
        if (date && start_time) {
            return {
                ...appointment,
                date,
                start_time,
                end_time,
                start,
                end
            };
        }

        return appointment;
    }
    async saveCalendarAppointment(data, id) {
        let res = await $api(id ? `${UPDATE_APPOINTMENT}/${id}` : STORE_NEW_APPOINTMENT, {
            method: 'POST',
            body: data,
        })
        console.log("res", res);
        return res
    }

    async updatePatientAppointment(data, id) {
        let res = await $api(`${PATIENT_PORTAL_EDIT_BOOK_APPOINTMENT_API}/${id}`, {
            method: 'POST',
            body: data,
        })
        console.log("res", res);
        return res
    }

    async createSupportTicket(data) {
        let res = await $api(CREATE_PATIENT_SUPPORT_TICKET, {
            method: 'POST',
            body: data,
        })

        return res
    }



    async AddEmail(data, id) {
        let res = await $api(`${ADD_EMAIL_API}/${id}`, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async AddPhoneLog(data, id) {
        let res = await $api(`${ADD_PHONE_LOG}/${id}`, {
            method: 'POST',
            body: data,
        })

        return res
    }

    async AddMessage(data, id) {
        let res = await $api(`${Add_MESSAGE_API}/${id}`, {
            method: 'POST',
            body: data,
        })

        return res
    }
    async AddMessageOnBaseSubject(data, id) {
        let res = await $api(`${ADD_MESSAGE_ON_BASE_SUBJECT}/${id}`, {
            method: 'POST',
            body: data,
        })

        return res
    }
    async getMessagBySubject(id) {
        let res = await $api(`${GET_SUBJECT_MESSAGE}/${id}`, {
            method: 'GET',
        })

        return res
    }
    async getPatientMessagBySubject(id) {
        let res = await $api(`${GET_PATIENT_MESSAGE_BY_ID}/${id}`, {
            method: 'GET',
        })

        return res
    }
    async getMessagesList(id) {
        let res = await $api(`${GET_MESSAGE_LIST}/${id}`, {
            method: 'GET',
        })

        return res.data
    }

    async getPatientMessagesList(id) {
        let res = await $api(`${GET_PATIENT_MESSAGE_LIST}/${id}`, {
            method: 'GET',
        })

        return res.data
    }



    async addDocument(data, id) {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        let res = await $api(`${ADD_DOCUMENT_NEW}/${id}`, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'multipart/form-data',

            },
        })

        return res
    }

    async addPatientDocument(data, id) {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        let res = await $api(`${STORE_PATIENT_DOCUMENT}`, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'multipart/form-data',

            },
        })

        return res
    }

    async forgotPassword(email) {
        let res = await $api(`${PATIENT_FORGOT_PASSWORD_PORTAL_API}`, {
            method: 'POST',
            body: {
                email: email
            },
        })
        return res
    }



    async sendFormRequest(data) {
        let res = await $api(SAVE_REQUEST_FORM, {
            method: 'POST',
            body: data
        });

        return res
    }

    async updateAppointmentStatus(id) {
        return $api(`${PROVIDER_UPDATE_APPOINTMENT_STATUS}/${id}/Complete`, {
            method: 'PUT'
        })
    }
    async resetPassword(data) {
        let res = await $api(PATIENT_RESET_PASSWORD_PORTAL_API, {
            method: 'POST',
            body: data
        });

        return res
    }
    async createPassword(data) {
        let res = await $api(CREATE_PASSWORD_API, {
            method: 'POST',
            body: data
        });

        return res
    }



    async changeAvatar(formData, id) {
        let response = await $api(`${UPDATE_PATIENT_PROFILE_PORTAL_API}/${id}`, {
            method: 'POST',
            body: formData
        });

        return response
    }

    async updatePatientMe(data, id) {
        let response = await $api(`${UPDATE_PATIENT_PORTAL_API}/${id}`, {
            method: 'POST',
            body: data
        });

        return response
    }
    async patientCancelAppointment(id) {
        let response = await $api(`${PATIENT_CANCEL_APPOINTMENT}/${id}`, {
            method: 'DELETE',
        });

        return response
    }

    async cancelAppointment(id) {
        let response = await $api(`${CANCEL_APPOINTMENT}/${id}`, {
            method: 'PUT',
        });

        return response
    }

    async getAppointmentOrder(id) {
        let res = await $api(`${GET_APPOINTMENT_ORDER}/${id}`, {
            method: 'GET',
        })

        return res
    }

    async getOrderDetails(id) {
        let res = await $api(`${GET_PATIENT_ORDER_DETAILS}/${id}`, {
            method: 'GET',
        })

        return res
    }
}


export const patientService = new PatientService()
