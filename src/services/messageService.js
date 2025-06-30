import { $api } from '@/utils/api';
import baseService from './baseService';

class MessageService extends baseService {

    async loadUsers() {
        const { currentUser } = GLOBAL_VARIABLE.useAuth
        let res = await $api(currentUser.value.user_type == 'patient' ? `${PATEINT_GET_MESSAGE_USERS}` : `${GET_MESSAGE_USERS}`, {
            method: 'GET',
        })

        return res
    }

    async getMessagesByUser(id) {
        const { currentUser } = GLOBAL_VARIABLE.useAuth

        let res = await $api(currentUser.value.user_type == 'patient' ? `${PATIENT_GET_USER_MESSAGES}/${id}` : `${GET_USER_MESSAGES}/${id}`, {
            method: 'GET',
        })

        return res
    }

    async sendMessage(data) {
        const { currentUser } = GLOBAL_VARIABLE.useAuth
        let res = await $api(currentUser.value.user_type == 'patient' ? `${PATIENT_SEND_MESSAGE_CHAT}` : `${SEND_MESSAGE_CHAT}`, {
            method: 'POST',
            body: data,
        })
        return res
    }
    async markMessagesAsRead(id) {
        const { currentUser } = GLOBAL_VARIABLE.useAuth
        let res = await $api(currentUser.value.user_type == 'patient' ? `${PATIENT_READ_MESSAGE}/${id}` : `${READ_MESSAGE}/${id}`, {
            method: 'PUT',
        })

        return res
    }



    async loadUsersPatient() {
        const { currentUser } = GLOBAL_VARIABLE.useAuth
        let res = await $api(`${PATEINT_GET_MESSAGE_USERS}`, {
            method: 'GET',
        })

        return res
    }

    async getMessagesByUserPatient(id) {
        const { currentUser } = GLOBAL_VARIABLE.useAuth
        let res = await $api(`${PATIENT_GET_USER_MESSAGES}/${id}`, {
            method: 'GET',
        })

        return res
    }

    async sendMessagePatient(data) {
        const { currentUser } = GLOBAL_VARIABLE.useAuth
        let res = await $api(`${PATIENT_SEND_MESSAGE_CHAT}`, {
            method: 'POST',
            body: data,
        })
        return res
    }
    async markMessagesAsReadPatient(id) {
        const { currentUser } = GLOBAL_VARIABLE.useAuth
        let res = await $api(`${PATIENT_READ_MESSAGE}/${id}`, {
            method: 'PUT',
        })

        return res
    }
    async getUserByAppoimnet(id) {
        const { currentUser } = GLOBAL_VARIABLE.useAuth
        let res = await $api(`${GET_USER_BYAPPOINMNET}/${id}`, {
            method: 'GET',
        })

        return res
    }
}

export const messageService = new MessageService()
