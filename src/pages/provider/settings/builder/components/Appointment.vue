<script setup>
import {
    requiredValidator,
} from '@core/utils/validators';
import { useBuilderStore } from '@/stores/builderStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import { computed, watch } from 'vue';

const practitionerStore = usePractitionerStore();
practitionerStore.practitionersList();

const builderStore = useBuilderStore();
const props = defineProps({
    draggedWidget: {
        type: Object,
        required: false
    }
});
const refVForm = ref()
const isAdd = !builderStore.selectedWidget
if (isAdd) {
    builderStore.selectedWidget = {
        title: props.draggedWidget?.title.charAt(0).toUpperCase() + props.draggedWidget?.title.slice(1),
        type: props.draggedWidget?.value,
        config: {
            practitioners: [],
            practitioner_fee: 0,
            appointment_types: [] // Add appointment types as array for multiple selection
        }
    };
}

const practitionersWithAllOption = computed(() => {
    return [
        { id: 'all', fullName: 'All practitioners' },
        ...practitionerStore.practitioners
    ];
});

// Appointment type options
const appointmentTypeOptions = [
    { value: 'telehealth_visit', title: 'Telehealth Visit' },
    { value: 'office_visit', title: 'Office Visit' }
];

watch(() => builderStore.selectedWidget?.config?.practitioners, (newValue, oldValue) => {
    if (newValue.includes('all') && !oldValue?.includes('all')) {
        builderStore.selectedWidget.config.practitioners = practitionersWithAllOption.value.map(practitioner => practitioner.id).filter(id => id !== 'all');
    }
});

const addItem = () => {
    refVForm.value?.validate().then(async ({ valid: isValid }) => {
        console.log('isValid ', isValid)
        if (isValid) {
            // Check if appointment_types is filled (required field validation)
            if (!builderStore.selectedWidget.config.appointment_types ||
                builderStore.selectedWidget.config.appointment_types.length === 0) {
                return; // Don't proceed if validation fails
            }

            builderStore.addItem(builderStore.selectedWidget);
            builderStore.isDialog = false;
        }
    })
};
</script>

<template>
    <VCard title="Appointment">
        <VCardText>
            <VForm ref="refVForm" @submit.prevent="">
                <v-row>
                    <v-col cols="12" md="4">
                        <AppSelect v-model="builderStore.selectedWidget.config.practitioners"
                            :label="$t('Practitioners')" :items="practitionersWithAllOption" item-value="id"
                            item-title="fullName" multiple clearable :rules="[requiredValidator]" />
                    </v-col>
                    <v-col cols="12" md="4">
                        <label>{{ $t('Practitioner Fee') }} </label>
                        <VTextField v-model="builderStore.selectedWidget.config.practitioner_fee" label=""
                            :rules="[requiredValidator]" density="comfortable" type="number" />
                    </v-col>
                    <v-col cols="12" md="4">
                        <AppSelect v-model="builderStore.selectedWidget.config.appointment_types"
                            :label="$t('Appointment Type')" :items="appointmentTypeOptions" item-value="value"
                            item-title="title" :rules="[requiredValidator]" multiple density="comfortable" />
                    </v-col>
                </v-row>
                <v-row v-if="isAdd">
                    <v-col cols="12" md="3">
                        <v-btn @click="addItem"> {{ $t('Add') }} </v-btn>
                    </v-col>
                </v-row>
            </VForm>
        </VCardText>
    </VCard>
</template>
