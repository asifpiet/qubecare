<script setup>
definePage({ 
  meta: {
    layout: 'blank',
    public: true
},
})
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter()
const route = useRoute()
const referral = atob(route.query.ref);
onMounted(async () => {
    localStorage.setItem('partner_email', referral)
    router.replace(route.query.to ? String(route.query.to) : '/affiliate/register');
});
</script>
<template></template>
