<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Messages View',
  },
})

import Chat from '@/components/Chat.vue'
</script>
<template>
  <Chat></Chat>
</template>
