<script setup>
import { onBeforeMount, onMounted, ref } from 'vue';
const steps = ref([
    {
        description:'1) Basic Information'
    },
    {
        description:'2) Verification'
    },
    {
        description:'3) Confirmation'
    }
]);
const isMobile = ref(window.innerWidth <= 768);
const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};
onBeforeMount(async () => {
})
onMounted(async () => {

    window.addEventListener('resize', checkIfMobile);
});
</script>
<template>
    <VCard class="bg-transparent d-flex flex-column justify-center align-center" :class="isMobile ? '' : 'auth-card pa-2 plan-card'" style="min-width: 90%;border: none;box-shadow: none;" color="">
    <v-card-text class="text-center">
        <h4 style="text-decoration: underline;font-weight: 700;color: black;">NEXT STEPS</h4>
        <v-list class="bg-transparent text-yellow-theme-button" style="color: black;">
            <v-list-item-group>
                <v-list-item v-for="step in steps" :key="step.id">
                    <v-list-item-content>
                        <v-list-item-title class="text-left">
                            {{ step.description }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-card-text>
</VCard>

</template>
<style>
.bg-transparent{
background-color: transparent !important;
}
</style>
