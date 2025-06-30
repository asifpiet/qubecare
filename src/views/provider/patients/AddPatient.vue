<script setup>
import { usePatientStore } from '@/stores/patientStore';
import Demographic from '@/views/apps/patient/list/Demographic.vue';

// import EligibilityCheck from '@/views/apps/patient/list/EligibilityCheck.vue';
import Insurance from '@/views/apps/patient/list/Insurance.vue';
import NextOfKin from '@/views/apps/patient/list/NextOfKin.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const patientStore = usePatientStore()
patientStore.unloadPatient()
const isDisable = ref(true);
const currentTab = ref('0')
const props = defineProps({
    patientId: {
        type: Number,
        default: null,
        required: false,
    }
})
if (props.patientId)
    patientStore.loadPatient(props.patientId)
onBeforeMount(() => { })

</script>

<template>
    <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content"
        @update:model-value="patientStore.isDrawerOpen = false" :model-value="patientStore.isDrawerOpen">

        <AppDrawerHeaderSection :title="patientStore.id ? $t('Edit Patient') : $t('Add Patient')"
            @cancel="patientStore.isDrawerOpen = false" />

        <VDivider />

        <PerfectScrollbar :options="{ wheelPropagation: false }">
            <VCard>
                <VCardText>
                    <VTabs v-model="currentTab" class="border-bottom-none" bg-color="deep-purple-accent-4">
                        <VTab>{{ $t('Demographic') }}</VTab>
                        <VTab :disabled="!patientStore.id">{{ $t('Next of Kin') }} </VTab>
                        <VTab :disabled="!patientStore.id">{{ $t('Insurance') }}</VTab>
                    </VTabs>
                    <VCardText>
                        <VWindow v-model="currentTab">
                            <VWindowItem key="1">
                                <Demographic />
                            </VWindowItem>
                            <VWindowItem key="2">
                                <NextOfKin />
                            </VWindowItem>
                            <VWindowItem key="3">
                                <Insurance />
                            </VWindowItem>
                        </VWindow>
                    </VCardText>
                </VCardText>
            </VCard>
        </PerfectScrollbar>
    </VNavigationDrawer>
</template>
<style>
.border-bottom-none {
    border-bottom: none !important;
}
</style>
