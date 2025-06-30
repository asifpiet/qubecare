<script setup>
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
})
</script>
<template>
    <VRow style="min-height: 101.7dvh; max-height: 101.7dvh; margin: 0px;"
        :style="isMobile ? { marginTop: '90px' } : { marginTop: '0px' }">
        <VCol cols="12" md="12" class="bg-custom col-order-1"
            :class="isMobile ? '' : 'auth-wrapper d-flex align-center justify-center pa-4'">

            <VCard>
                <VCardText>
                    <div v-html="props.data.config.description"></div>
                </VCardText>
            </VCard>
        </VCol>
    </VRow>
</template>
