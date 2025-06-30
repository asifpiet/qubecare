<!-- SignatureFieldRenderer.vue -->
<script setup>
import { ref } from 'vue';
import Vue3Signature from 'vue3-signature';

const props = defineProps({
    data: {
        type: Object,
        required: true,
    }
});

const signatureRef = ref(null);
const state = reactive({
    option: {
        penColor: "rgb(0, 0, 0)",
        backgroundColor: "rgb(255,255,255)"
    },
    disabled: false
});

const clear = () => {
    signatureRef.value?.clear();
};

// Method to get signature data
const getSignature = () => {
    return signatureRef.value?.save('image/jpeg');
};

// Expose methods to parent
defineExpose({
    clear,
    getSignature
});
</script>

<template>
    <div class="signature-field-wrapper">
        <label v-if="data.config.label" class="signature-label">{{ data.config.label }}</label>
        <Vue3Signature ref="signatureRef" :sigOption="state.option" :w="'auto'" :h="'100px'" :disabled="state.disabled"
            style="border: 1px solid silver; border-radius: 5px;" />
        <VBtn @click="clear" color="secondary" size="x-small" class="mt-2">
            Clear
        </VBtn>
    </div>
</template>

<style scoped>
.signature-field-wrapper {
    margin: 10px 0;
}

.signature-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
}
</style>
