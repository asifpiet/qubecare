<template>
    <div>
        <div id="eddie-avatar-container"></div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
    enabled: {
        type: Boolean,
        default: true
    }
});

let scriptElement = null;

onMounted(() => {
    if (props.enabled) {
        // Configure Eddie
        window.EddieConfig = {
            container: '#eddie-avatar-container',
            // base_url: "http://127.0.0.1:8000",
        };

        // Load the script
        scriptElement = document.createElement('script');
        scriptElement.src = 'https://adi.qubecare.ai/adi/script.js';
        document.body.appendChild(scriptElement);
    }
});

onUnmounted(() => {
    // Clean up when component is destroyed
    if (scriptElement && document.body.contains(scriptElement)) {
        document.body.removeChild(scriptElement);
    }
});
</script>
