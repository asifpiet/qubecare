<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Message View',
  },
})

import Chat from '@/components/Chat.vue'
</script>
<template>
  <Chat></Chat>
</template>
