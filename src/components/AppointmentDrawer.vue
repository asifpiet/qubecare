<script setup>
import { usePractitionerStore } from '@/stores/practitionerStore';

const practitionerStore = usePractitionerStore()
const props = defineProps({
    appointment: {
        type: String,
        required: true,
    },
})
</script>
<template>
    <VNavigationDrawer temporary :width="350" location="end" class="scrollable-content"
        @update:model-value="practitionerStore.appointmentDrawer = false"
        :model-value="practitionerStore.appointmentDrawer">

        <PerfectScrollbar :options="{ wheelPropagation: false }">
            <!-- <VCard flat> -->
            <VCardText class="pt-5 position-relative"> <!-- Added position-relative -->
                <!-- Close button -->
                <div class="position-absolute top-0 right-0 pt-4">
                    <VBtn variant="text" density="compact" icon="tabler-x" color="secondary"
                        @click="practitionerStore.appointmentDrawer = false" />
                </div>

                <p class="mb-1 text-body-1 font-weight-medium">Appointment Date & Time</p>
                <div>
                    <!-- <p class="mb-0" v-if="props.appointment.date_start_time"
                        style="font-family: 'Inter'; font-weight: 500; font-size: 20px; line-height: normal;">
                        {{ dateTimeFormat(props.appointment.date_start_time, 'MMMM DD, hh:mm A') }}
                    </p> -->
                    <p class="mb-3">
                        <span class="d-flex gap-x-2 align-center">
                            <VIcon size="20" color="grey" icon="tabler-video" />
                            <div class="text-body-1 font-weight-medium" style="font-size: 14px !important;color: grey;">
                                Patient Checkup
                            </div>
                        </span>
                    </p>
                    <VBtn @click="startCall">
                        <VIcon start icon="tabler-video" />
                        Start Televisit
                    </VBtn>
                </div>
            </VCardText>
            <VDivider />
            <!-- </VCard> -->
        </PerfectScrollbar>
    </VNavigationDrawer>
</template>
