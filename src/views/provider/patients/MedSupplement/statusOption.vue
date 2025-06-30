<script setup>
import { useMedicationStore } from '@/stores/medicationStore';
import { useTheme } from 'vuetify';
const medicationStore = useMedicationStore()
const statusNote = ref('');
const status = ref('Wait For Payment');
const refForm = ref()
const refInputEl = ref()
const vuetifyTheme = useTheme()
const emit = defineEmits([
    'statusUpdate',
])
const props = defineProps({
    prescriptionId: {
        type: String,
        required: true,
    }
})


const onSubmit = async () => {
    refForm.value?.validate().then(async ({ valid }) => {
        if (valid) {
            medicationStore.signature = null
            let res = await medicationStore.updatePrescriptionStaus(props.prescriptionId)
            console.log("res", res);
            emit('statusUpdate', true);

        }
    });

}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};


const getStatusColor = (status) => {
    switch (status) {
        case "complete":
            return "success"; // Success
        case "Wait For Payment":
            return "warning"; // Warning
        case "Processing":
            return "info"; // Info
        case "Shipped":
            return "success"; // Shipped Status
        default:
            return "info"; // Default
    }
};

const deleteItem = async (id, index) => {
    await medicationStore.deleteStatusHistory(id);
    medicationStore.statusHisotry.splice(index, 1);

};




</script>

<template>

    <VRow no-gutters>
        <VCol cols="12" sm="8" lg="8" :class="$vuetify.display.smAndUp ? 'border-e' : 'border-b'">
            <VCard :title="$t('Tracking Activity')">
                <VCardText>
                    <VTimeline truncate-line="both" line-inset="9" align="start" side="end" line-color="primary"
                        density="compact">
                        <VTimelineItem v-for="(item, index) in medicationStore.statusHisotry" :key="item.id"
                            :dot-color="'primary'" size="x-small" :disabled="item.status === 'Wait For Payment'">

                            <div class="d-flex justify-space-between align-center">
                                <div class="app-timeline-title">
                                    <VChip v-if="item.status == 'complete'" color="success" rounded="xl">
                                        {{ $t('Approved') }}
                                    </VChip>
                                    <VChip v-else :color="getStatusColor(item.status)" rounded="xl">
                                        {{ item.status }}
                                    </VChip>
                                </div>

                                <div class="d-flex flex-column align-end">
                                    <div class="app-timeline-meta">
                                        {{ formatDate(item.changed_at) }}
                                    </div>
                                    <IconBtn @click="deleteItem(item.id, index)" class="mt-1"
                                        v-if="item.status === 'Sent To Pharmacy'">
                                        <VIcon icon="tabler-trash" color="red" />
                                    </IconBtn>
                                </div>
                            </div>

                            <p class="app-timeline-text mb-0 mt-3">
                                {{ item.note }}
                            </p>
                            <p class="app-timeline-text mb-0 mt-3" v-if="item.status == 'Shipped'">
                                {{ medicationStore.tracking_number }}
                            </p>
                        </VTimelineItem>

                    </VTimeline>

                </VCardText>
            </VCard>
        </VCol>

        <VCol cols="12" sm="4" v-if="medicationStore.current_status !== 'Shipped'">
            <!-- <VCardTitle class="mb-2 mt-4">{{ $t('Status') }}</VCardTitle> -->
            <v-form ref="refForm">
                <VCardText class="">
                    <AppSelect v-model="medicationStore.status" :label="$t('Status')" :placeholder="$t('Status')"
                        :items="['Sent To Pharmacy', 'Shipped']" :rules="[requiredValidator]" class="field-required" />
                </VCardText>



                <VCardText class="" v-if="medicationStore.status == 'Shipped'">
                    <AppTextField v-model="medicationStore.tracking_number" :label="$t('Tracking Info')"
                        :placeholder="$t('Tracking Info')" :rules="[requiredValidator]" />
                </VCardText>


                <VCardText class="d-flex flex-column justify-center align-center text-center">

                    <v-textarea v-model="medicationStore.signatureNote" :label="$t('Note')" rows="5"
                        :placeholder="$t('Note')" />

                    <VBtn class="mt-8" @click="onSubmit" block>
                        {{ $t('Update') }}
                    </VBtn>
                </VCardText>
            </v-form>
        </VCol>
    </VRow>

</template>
<style scoped>
:deep(.field-required)>label:after {
    content: '*';
    color: rgb(var(--v-theme-error));

}
</style>
<style lang="scss">
.revenue-report {
    .apexcharts-legend {
        gap: 1rem;
    }

    @media (max-width: 599px) {
        .apexcharts-legend.apx-legend-position-top.apexcharts-align-right {
            justify-content: flex-start;
            padding: 0;
        }
    }
}

.v-timeline-divider {
    color: red !important;
}
</style>
