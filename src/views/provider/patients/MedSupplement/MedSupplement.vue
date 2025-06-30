<script setup>
import { useMedicationStore } from '@/stores/medicationStore';
import EditMedSupplement from '@/views/provider/patients/MedSupplement/EditMedAndSupplment.vue';
const medicationStore = useMedicationStore()
const isDialogVisible = ref(false)
const emit = defineEmits([
    'update:isDrawerOpen',
    'addMedican'
])

const props = defineProps({
    patient: {
        type: Object,
        required: true,
    }
})

const rxSources = ['Rx-Subjective', 'Rx-eRx', 'Rx-Manual/Fax'];
const supplementSources = ['Supplement-Inventory', 'Supplement-Subjective', 'Supplement-Superbill', 'Supplement']
const rxSourcesList = ref({});
const supplementList = ref();
const getMedAndSupplement = async () => {
    medicationStore.getMedicationList(props.patient.id, 'all', 'all')

    rxSourcesList.value = medicationStore.medications.filter(item =>
        rxSources.includes(item.presherb_src)
    );
    supplementList.value = medicationStore.medications.filter(item =>
        supplementSources.includes(item.presherb_src)
    );
    console.log("metaData", rxSourcesList.value, supplementList.value);
}

getMedAndSupplement();
</script>

<template>
    <VCard>
        <VCardActions>

            <VSpacer />
            <div class="px-3 pt-2 pb-0">
                <VBtn prepend-icon="tabler-edit" @click="isDialogVisible = !isDialogVisible"
                    v-if="$can('read', 'All Meds/Supplements Edit')">
                    Edit Meds&Supplement
                </VBtn>
            </div>
        </VCardActions>
        <!-- <VDivider class="mb-1 mt-0 pt-0"/> -->
        <div v-if="rxSourcesList || supplementList">

            <VCardTitle>Rx</VCardTitle>
            <VCardText class="pt-0">
                <span v-for="item in rxSourcesList" :key="item.uuid">
                    <VChip color="primary" class="mr-1 mt-1"> {{ item.drug }}</VChip>
                </span>
            </VCardText>

            <VCardTitle>Supplements</VCardTitle>
            <VCardText class="pt-0">
                <span v-for="item in supplementList" :key="item.uuid">
                    <VChip color="primary" class="mr-1 mt-1"> {{ item.drug }}</VChip>
                </span>
            </VCardText>
        </div>
        <div v-else>
            <p class="text-center">No Found Data</p>
        </div>

    </VCard>
    <VDialog v-model="isDialogVisible" max-width="1200">
        <DialogCloseBtn @click="[isDialogVisible = !isDialogVisible, getMedAndSupplement()]" />
        <VCard title="Medication">
            <VCardText>
                <EditMedSupplement :patient="props.patient" />
            </VCardText>
        </VCard>
    </VDialog>
    <!--  -->
</template>
