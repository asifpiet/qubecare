<script setup>
import { useBuilderStore } from '@/stores/builderStore';
import { onBeforeMount, onMounted, ref } from 'vue';
const types = {
    login: 'Confirm Shipping Details',
    appointment: 'Schedule your visit',
    payment: ' Make the payment',
}
const builderStore = useBuilderStore()
const flow = builderStore.layout.filter(flow => ['login', 'appointment', 'payment'].indexOf(flow.type) !== -1).map(
    flow => { return { type: flow.type, title: types[flow.type] } }
)
flow.push({ type: 'final', title: 'Meet with Your Provider' })
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
    <VCard class="bg-transparent d-flex flex-column justify-center align-center"
        :class="isMobile ? '' : 'auth-card pa-2 plan-card'"
        style="min-width: 90%;border: none;box-shadow: none;background-color:transparent;" color="">
        <v-card-text class="text-center">
            <h4 style="text-decoration: underline;font-weight: 700;">{{ $t('NEXT STEPS') }}</h4>
            <v-list class="bg-transparent text-yellow-theme-button" style="background-color: transparent;">
                <v-list-item-group>
                    <v-list-item v-for="(step, index) in flow" :key="step.type">
                        <v-list-item-content>
                            <v-list-item-title class="text-left">
                                {{ index + 1 }}) {{ step.title }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>

        </v-card-text>
    </VCard>

</template>
