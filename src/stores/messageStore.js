import { messageService } from '@/services/messageService';
import { defineStore } from 'pinia';

export const useMessageStore = defineStore('message', {
    state: () => ({
        usersList: [],
        messageList: [],
        activeUser: null,
        onlineUsers: [],
        unreadMessages: {},
        pusherInstance: null,
        getUserAppoimnet: null
    }),
    actions: {
        // Load users list
        async loadUsers() {
            try {
                const response = await messageService.loadUsers();
                this.usersList = response;
            } catch (error) {
                console.error('Failed to load users', error);
            }
        },

        // Fetch messages for a specific user
        async getMessagesByUser(id) {
            showLoader();
            try {
                const response = await messageService.getMessagesByUser(id);
                this.messageList = response;
                this.activeUser = id;
                this.markMessagesAsRead(id);
            } catch (error) {
                console.error('Failed to get messages', error);
            }
            hideLoader();
        },

        // Send message with enhanced handling
        async sendMessage(data, id) {
            try {
                showLoader();
                const response = await messageService.sendMessage(data, id);

                // Update message list
                if (response.data) {
                    this.messageList.push(response.data);
                }

                // Broadcast message via Pusher
                //this.broadcastMessage(response.data);
            } catch (error) {
                console.error('Message send failed', error);
            } finally {
                hideLoader();
            }
        },





        // Mark messages as read
        async markMessagesAsRead(senderId) {
            try {
                await messageService.markMessagesAsRead(senderId);
                this.unreadMessages[senderId] = 0;
            } catch (error) {
                console.error('Failed to mark messages as read', error);
            }
        },

        async loadUsersPatient() {
            try {
                const response = await messageService.loadUsersPatient();
                this.usersList = response;
            } catch (error) {
                console.error('Failed to load users', error);
            }
        },

        // Fetch messages for a specific user
        async getMessagesByUserPatient(id) {
            showLoader();
            try {
                const response = await messageService.getMessagesByUserPatient(id);
                this.messageList = response;
                this.activeUser = id;
                this.markMessagesAsReadPatient(id);
            } catch (error) {
                console.error('Failed to get messages', error);
            }
            hideLoader();
        },

        // Send message with enhanced handling
        async sendMessagePatient(data, id) {
            try {
                showLoader();
                const response = await messageService.sendMessagePatient(data, id);

                // Update message list
                if (response.data) {
                    this.messageList.push(response.data);
                }

                // Broadcast message via Pusher
                //this.broadcastMessage(response.data);
            } catch (error) {
                console.error('Message send failed', error);
            } finally {
                hideLoader();
            }
        },





        // Mark messages as read
        async markMessagesAsReadPatient(senderId) {
            try {
                await messageService.markMessagesAsReadPatient(senderId);
                this.unreadMessages[senderId] = 0;
            } catch (error) {
                console.error('Failed to mark messages as read', error);
            }
        },
        async getUserByAppoimnet(id) {
            try {
                let data = await messageService.getUserByAppoimnet(id);
                this.getUserAppoimnet = data
                this.usersList.push(data)
            } catch (error) {
                console.error('Failed to mark messages as read', error);
            }
        },



    },
    getters: {
        // Get unread message count for a user
        getUnreadMessageCount() {
            return (userId) => this.unreadMessages[userId] || 0;
        },

        // Check if a user is online
        isUserOnline() {
            return (userId) => this.onlineUsers.some(user => user.id === userId);
        }
    }
});
