import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const isListenerInitialized = ref(false);
export const useChatStore = defineStore('chat', {
  // ℹ️ arrow function recommended for full type inference
  state: () => ({
    contacts: [],
    chatsContacts: [],
    profileUser: undefined,
    activeChat: null,
    notification: {},
    chatLogPS: null,
    unreadMsg: { messages: [] },
    msg: null,
    attachments: null,
  }),
  actions: {
    async fetchChatsAndContacts(q) {
      console.log(q)
      const { currentUser } = GLOBAL_VARIABLE.useAuth
      const { data, error } = await useApi(createUrl(currentUser.value.user_type == 'patient' ? `${PATEINT_GET_MESSAGE_USERS}` : `${GET_MESSAGE_USERS}`, {
        query: {
          q,
        },
      }))


      const { chatsContacts, contacts, profileUser } = data.value

      const filteredChatsContacts = chatsContacts.filter((contact) =>
        contact.fullName.toLowerCase().includes(q.toLowerCase())
      );

      const filteredContacts = contacts.filter((contact) =>
        contact.fullName.toLowerCase().includes(q.toLowerCase())
      );

      // Update the state with filtered data
      this.chatsContacts = filteredChatsContacts;
      this.contacts = filteredContacts;
      this.profileUser = profileUser

    },
    setChatLogPS(chatLogPS) {
      this.chatLogPS = chatLogPS;
      console.log('chatLogPS set in store:', this.chatLogPS);
    },

    scrollToBottomInChatLog() {
      if (this.chatLogPS) {

        const scrollEl = this.chatLogPS.$el || this.chatLogPS;
        console.log('Scrolling to bottom with chatLogPS:', scrollEl);
        scrollEl.scrollTop = scrollEl.scrollHeight + 2;
        setTimeout(() => {
          // Calculate the height of the last message (including date)
          const lastMessage = scrollEl.querySelector('.chat-group:last-child');
          if (lastMessage) {
            const lastMessageHeight = lastMessage.offsetHeight;
            scrollEl.scrollTop = scrollEl.scrollHeight + lastMessageHeight;
          }
        }, 50);
      } else {
        console.error('chatLogPS is not defined in the store.');
      }
    },
    async initPusherListeners(chat) {
      // if (isListenerInitialized.value) return;
      const { currentUser } = GLOBAL_VARIABLE.useAuth
      const accessToken = getCurrentAccessToken()//useCookie('accessToken').value;
      const apiEndpoint = BASE_URL;
      window.Pusher = Pusher;
      const key = import.meta.env.VITE_PUSHER_APP_KEY;
      const cluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;
      window.Echo = new Echo({
        broadcaster: 'pusher',

        key: key,
        cluster: cluster,
        forceTLS: true,
        authEndpoint: currentUser.value.user_type == 'patient' ? `${apiEndpoint}${PATIENT_BROADCAST_API}` : `${apiEndpoint}${PROVIDER_BROADCAST_API}`,
        auth: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            AccessToken: `${accessToken}`
          },
        },
      });


      if (chat) {


        window.Echo.private(`message-${chat.id}`)
          .listen('OnNewMessage', async (event) => {
            console.log('ne message == ', event)
            console.log(`Listening to channel: message-${chat.id}`);
            const messageExists = this.activeChat.chat.messages.some(val => val.id === event.id);

            if (!messageExists) {
              this.activeChat.chat.messages.push(event);
              this.scrollToBottomInChatLog();
              if (currentUser.value.id != event.senderId) {
                addAlert(`New message received: ${event.message}`, 'success');
              }

            }
          });
      }
      //window.Echo.leave(`message-${chat.id}`)
      if (currentUser.value.user_type == 'patient') {
        console.log(`notification-patient-${currentUser.value.id}`);

        // Remove existing listener (if any)
        window.Echo.leave(`notification-patient-${currentUser.value.id}`);

        // Add new listener
        window.Echo.private(`notification-patient-${currentUser.value.id}`)
          .listen('UnreadMessages', async (event) => {
            console.log('message patient: ' + JSON.stringify(event), this.unreadMsg.message);

            if (event.messages) {
              const fieldIndexInMerged = this.unreadMsg.messages.findIndex(val => val.id === event.messages.id);
              console.log(fieldIndexInMerged);

              // Add the message only if it doesn't already exist
              if (fieldIndexInMerged === -1) {
                this.unreadMsg.messages.push(event.messages);

              }
            }
          });
      } else {
        console.log(`notification-user-${currentUser.value.id}`);

        // Remove existing listener (if any)
        window.Echo.leave(`notification-user-${currentUser.value.id}`);

        // Add new listener
        window.Echo.private(`notification-user-${currentUser.value.id}`)
          .listen('UnreadMessages', async (event) => {
            console.log('message user: ' + JSON.stringify(event));

            const fieldIndexInMerged = this.unreadMsg.messages.findIndex(val => val.id === event.messages.id);

            // Add the message only if it doesn't already exist
            if (fieldIndexInMerged === -1) {
              this.unreadMsg.messages.push(event.messages);
            }
          });
      }

      isListenerInitialized.value = true;

    },
    async getChat(userId) {
      const { currentUser } = GLOBAL_VARIABLE.useAuth
      const res = await $api(currentUser.value.user_type == 'patient' ? `frontend${CHAT_CONVERSATION}/${userId}` : `${CHAT_CONVERSATION}/${userId}`)

      this.activeChat = res
      // this.markMessagesAsRead(this.activeChat?.contact.id)
      this.initPusherListeners(res.chat)
    },
    async sendMsg(message, attachments) {
      console.log('storeAAttchemn', attachments);
      this.msg = ''
      const senderId = this.profileUser?.id
      const { currentUser } = GLOBAL_VARIABLE.useAuth
      const formData = new FormData()
      formData.append('content', message)
      if (currentUser.value.user_type == 'patient') {
        formData.append('provider_id', this.activeChat?.contact.id)
      } else {
        formData.append('patient_id', this.activeChat?.contact.id)
      }

      if (attachments && attachments.length > 0) {

        formData.append('type', 'file')
        attachments.forEach((attachment, index) => {
          formData.append(`attachment[${index}]`, attachment)
        })
      } else {
        formData.append('type', 'text')
        formData.append(`attachment[]`, '')
      }
      // let data = {}
      // if (currentUser.value.user_type == 'patient') {
      //   data = {
      //     content: message,
      //     provider_id: this.activeChat?.contact.id,


      //   }
      // } else {
      //   data = {
      //     content: message,
      //     patient_id: this.activeChat?.contact.id,

      //   }
      // }

      let res = await $api(currentUser.value.user_type == 'patient' ? `${PATIENT_SEND_MESSAGE_CHAT}` : `${SEND_MESSAGE_CHAT}`, {
        method: 'POST',
        body: formData,
      })
      // const response = await $api(`apps/chat/chats/${this.activeChat?.contact.id}`, {
      //   method: 'POST',
      //   body: { message, senderId },
      // })

      const { msg, chat } = res

      // ? If it's not undefined => New chat is created (Contact is not in list of chats)
      if (chat !== undefined) {
        const activeChat = this.activeChat

        this.chatsContacts.push({
          ...activeChat.contact,
          chat: {
            id: chat.id,
            lastMessage: [msg],
            unseenMsgs: 0,
            messages: [msg],
          },
        })
        if (this.activeChat) {
          this.activeChat.chat = {
            id: chat.id,
            messages: [],
            unseenMsgs: 0,
            userId: this.activeChat?.contact.id,
          }
        }
      }
      else {
        this.activeChat?.chat?.messages.push()
      }

      // Set Last Message for active contact
      const contact = this.chatsContacts.find(c => {
        if (this.activeChat)
          return c.id === this.activeChat.contact.id

        return false
      })

      if (contact) {
        contact.chat.lastMessage = msg
        return true;
      }

    },
    async markMessagesAsRead(id) {
      const { currentUser } = GLOBAL_VARIABLE.useAuth
      let res = await $api(currentUser.value.user_type == 'patient' ? `${PATIENT_READ_MESSAGE}/${id}` : `${READ_MESSAGE}/${id}`, {
        method: 'PUT',
      })

      console.log(res)
    },
    async unreadMsag() {
      const { currentUser } = GLOBAL_VARIABLE.useAuth
      let res = await $api(currentUser.value.user_type == 'patient' ? `frontend${CHAT_UNREADMSG}` : `${CHAT_UNREADMSG}`, {
        method: 'GET',
      })
      this.unreadMsg = res
      console.log(res)
    },
    async seenAllNotification(ids) {
      const { currentUser } = GLOBAL_VARIABLE.useAuth
      let res = await $api(currentUser.value.user_type == 'patient' ? `frontend${SEEN_ALL_NOTIFACTION}` : `${SEEN_ALL_NOTIFACTION}`, {
        method: 'POST',
        body: { ids: ids },
      })
      this.unreadMsg = res
      console.log(res)
    }

  },
})
