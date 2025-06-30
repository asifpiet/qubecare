<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Builder Edit',
    },
})
import { useBuilderStore } from '@/stores/builderStore';
import { useRoute, useRouter } from 'vue-router';
import LoadBuilder from '../LoadBuilder.vue';

const builderStore = useBuilderStore()
const route = useRoute();
const router = useRouter();


</script>
<template>
    <LoadBuilder></LoadBuilder>
</template>
