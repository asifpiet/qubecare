<script setup>
import { useMedicationStore } from '@/stores/medicationStore';
import { useTheme } from 'vuetify';
const medicationStore = useMedicationStore()
const statusNote = ref('');
const status = ref('Wait For Payment');
const vuetifyTheme = useTheme()
const emit = defineEmits([
    'statusUpdate',
])



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



</script>

<template>

    <VRow no-gutters>
        <VCol cols="12" sm="8" lg="12" :class="$vuetify.display.smAndUp ? 'border-e' : 'border-b'">
            <VCard :title="$t('Tracking Activity')">
                <VCardText>
                    <div v-if="medicationStore.statusHisotry && medicationStore.statusHisotry.length">
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

                                    <div class="app-timeline-meta">
                                        {{ formatDate(item.changed_at) }}
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
                    </div>

                    <div v-else>
                        <div class="text-center py-3">No Tracking Activity</div>
                    </div>


                </VCardText>
            </VCard>
        </VCol>
    </VRow>

</template>

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
