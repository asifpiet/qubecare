<script setup>
import {
    cookieRef,
    namespaceConfig,
} from '@layouts/stores/config'
import { useStorage } from '@vueuse/core'
import { onMounted, onUnmounted } from 'vue'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()

onMounted(() => {
    vuetifyTheme.themes.value[vuetifyTheme.name.value].colors.primary = '#49A38C'
    vuetifyTheme.themes.value[vuetifyTheme.name.value].colors['primary-darken-1'] = '#49A38C'
    cookieRef(`${vuetifyTheme.name.value}ThemePrimaryColor`, null).value = '#49A38C'
    cookieRef(`${vuetifyTheme.name.value}ThemePrimaryDarkenColor`, null).value = '#49A38C'
    useStorage(namespaceConfig('initial-loader-color'), null).value = '#49A38C'
})

onUnmounted(() => {
    // vuetifyTheme.themes.value[vuetifyTheme.name.value].colors.primary = staticPrimaryColor
    // vuetifyTheme.themes.value[vuetifyTheme.name.value].colors['primary-darken-1'] = staticPrimaryDarkenColor
    // cookieRef(`${vuetifyTheme.name.value}ThemePrimaryColor`, null).value = staticPrimaryColor
    // cookieRef(`${vuetifyTheme.name.value}ThemePrimaryDarkenColor`, null).value = staticPrimaryDarkenColor
    // useStorage(namespaceConfig('initial-loader-color'), null).value = staticPrimaryColor
})
const primaryColor = ref('#49A38C');
const styleObject = computed(() => ({
    '--v-theme-primary': primaryColor.value,
}));
</script>
<template>
    <div id="custom-theme" :style=styleObject>
        <slot></slot>
    </div>

</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

/* .bg-primary {
    background-color: #49A38C !important;
} */
* {
    font-family: 'Poppins', sans-serif;
}

.v-btn.bg-primary:hover {
    background-color: #49A38C !important;
}

.bg-custom-color {
    background: #49A38C !important;
}

.bg-custom {
    background: #F8F8F9 !important;
}

p,
span,
strong {
    font-family: "Public Sans", sans-serif, -apple-system, blinkmacsystemfont, "Segoe UI", roboto, "Helvetica Neue", arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.bg-white {
    background-color: white;
}

.formeo input {
    padding-top: var(--v-field-input-padding-top) !important;
    padding-bottom: var(--v-field-input-padding-bottom) !important;
}

.formeo select {
    height: 2.5em !important;
}
</style>
