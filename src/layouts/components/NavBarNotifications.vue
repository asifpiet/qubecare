<script setup>
import { useChatStore } from '@/views/apps/chat/useChatStore';
import avatar3 from '@images/avatars/avatar-3.png';
import avatar4 from '@images/avatars/avatar-4.png';
import avatar5 from '@images/avatars/avatar-5.png';
import paypal from '@images/cards/paypal-rounded.png';
const store = useChatStore()
const notifications = ref([
  {
    id: 1,
    img: avatar4,
    title: 'Congratulation Flora! 🎉',
    subtitle: 'Won the monthly best seller badge',
    time: 'Today',
    isSeen: true,
  },
  {
    id: 2,
    text: 'Tom Holland',
    title: 'New user registered.',
    subtitle: '5 hours ago',
    time: 'Yesterday',
    isSeen: false,
  },
  {
    id: 3,
    img: avatar5,
    title: 'New message received 👋🏻',
    subtitle: 'You have 10 unread messages',
    time: '11 Aug',
    isSeen: true,
  },
  {
    id: 4,
    img: paypal,
    title: 'PayPal',
    subtitle: 'Received Payment',
    time: '25 May',
    isSeen: false,
    color: 'error',
  },
  {
    id: 5,
    img: avatar3,
    title: 'Received Order 📦',
    subtitle: 'New order received from john',
    time: '19 Mar',
    isSeen: true,
  },
])


onMounted(async () => {
  await store.unreadMsag()
  notifications.value = store.unreadMsg.messages
  console.log('store.unreadMsg', notifications.value)
  await store.initPusherListeners()

})
watch(
  () => store.unreadMsg.messages,
  (newMessages) => {
    console.log(newMessages);
    if (newMessages) {
      const sortedMessages = newMessages.slice().sort((a, b) => {
        return new Date(b.time) - new Date(a.time);
      });

      notifications.value = sortedMessages;
    }

  },
  { deep: true }
);
const removeNotification = notificationId => {
  notifications.value.forEach((item, index) => {
    if (notificationId === item.id)
      notifications.value.splice(index, 1)
  })
}

const markRead = async (notificationId) => {
  console.log(notificationId)
  notifications.value.forEach(item => {
    notificationId.forEach(id => {
      if (id === item.id)
        item.isSeen = true
    })
  })
  await store.seenAllNotification(notificationId)
  await store.unreadMsag()
  notifications.value = store.unreadMsg.messages
}

const markUnRead = notificationId => {
  notifications.value.forEach(item => {
    notificationId.forEach(id => {
      if (id === item.id)
        item.isSeen = false
    })
  })
}

const handleNotificationClick = notification => {
  console.log('fff')
  if (!notification.isSeen)
    markRead([notification.id])
}
</script>

<template>
  <Notifications :notifications="notifications" @remove="removeNotification" @read="markRead" @unread="markUnRead"
    @click:notification="handleNotificationClick" />
</template>
