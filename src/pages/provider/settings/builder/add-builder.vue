<script setup>

import { useBuilderStore } from '@/stores/builderStore';
import LoadBuilder from './LoadBuilder.vue';

const builderStore = useBuilderStore()

</script>
<template>
    <LoadBuilder></LoadBuilder>
</template>
