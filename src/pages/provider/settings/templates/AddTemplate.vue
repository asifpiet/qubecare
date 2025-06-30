<script setup>
import { useMedicationStore } from '@/stores/medicationStore';
import { useTemplateStore } from '@/stores/templateStore';
import { ref } from 'vue';
const props = defineProps({
    patient: {
        type: Object,
        required: true,
    },
    templateId: {
        type: String,
        required: true,
    }
})
const templateStore = useTemplateStore()
templateStore.unloadTemplate()
const medicationStore = useMedicationStore()
medicationStore.unloadMedication()

medicationStore.getTemplateMedicineList()
const selectedtemplate = ref()
// Form data

const refForm = ref()
const DoseOptions = ['1 - 0 - 1', '1 - 0 - 0', '0 - 0 - 1', '1 - 1 - 1', '1 - 1 - 0', '0 - 1 - 0', '0 - 1 - 1'];
const whenOptions = ['Before Food', 'After Food', 'Before BreakFast', 'After BreakFast', 'Before Lunch', 'After Lunch',
    'Before Dinner', 'After Dinner', 'Empty Stomach'];
const DurationOptions = ['1 Day', '1 Week', '1 month', '2 months', '3 months', '4 months', '5 months', '6 months'];
const frequencyOPtions = ['Daily', 'AlternateDay', 'weekly', 'monthly', 'stat', 'sos', 'weekly twice', 'weekly thrice'];

const dispDaysOptions = ['1', '5', '7', '10', '14', '30', '40', '60', '90', '120'];
const dispRefillsOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
const dispSubsOptions = [
    { text: 'Substitution Allowed', value: '1' },
    { text: 'As Written', value: '2' },
];
const items = ['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming'];
const srcOptions = [
    'Rx-Subjective',
    'Rx-eRx',
    'Rx-Manual/Fax',
    'Supplement-Inventory',
    'Supplement-Subjective',
    'Supplement-Superbill',
    'Supplement',
];
const emit = defineEmits([
    'update:isDrawerOpen',
    'customEvent'
])

if (props.templateId) {
    templateStore.getTemplate(props.templateId)
}
const closeNavigationDrawer = () => {
    emit('customEvent', false)
};
const onSubmit = async () => {
    refForm.value?.validate().then(async ({ valid }) => {
        if (valid) {
            let res = await templateStore.saveTemplate()
            console.log("res", res);
            closeNavigationDrawer();
            return res;
        }
    });
}

const onMedicineSelect = (index) => {
    if (index + 1 == templateStore.prescription.newPrescription.length) {
        addMedicine();
    }
}
function addMedicine() {
    // Add a new empty medicine object to the list
    templateStore.prescription.newPrescription.push({
        medicine_id: '',
        variation_id: '',
        dose: '',
        when: '',
        frequency: '',
        duration: '',
        notes: ''
    });
}
function removeMedicine(index) {
    // Remove a medicine row
    templateStore.prescription.newPrescription.splice(index, 1);
}

const getVariationsForMedicine = (medicineId) => {
    const medicine = medicationStore.templateMedicineLists.find(med => med.id === medicineId);
    return medicine ? medicine.variations : [];
}
</script>

<template>

    <VCardText>
        <v-form ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit()">
            <VCardText>
                <v-row>
                    <v-col cols="12" sm="12">
                        <v-text-field v-model="templateStore.prescription.template_name" :rules="[requiredValidator]"
                            :label="$t('Package Name')" maxlength="255" placeholder=""></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <div class="scrollable-table-container">
                        <v-table density="compact" border>
                            <thead>
                                <tr class="backgroundColor">
                                    <th>{{ $t('Medicine') }}</th>
                                    <th>{{ $t('Variation') }}</th>
                                    <th>{{ $t('Dose') }}</th>
                                    <th>{{ $t('When') }}</th>
                                    <th>{{ $t('Frequency') }}</th>
                                    <th>{{ $t('Duration') }}</th>
                                    <th>{{ $t('Notes') }}</th>
                                    <th>{{ $t('Actions') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(medicine, index) in templateStore.prescription.newPrescription" :key="index"
                                    class="mb-3 py-3">
                                    <td :style="{ 'min-width': '210px' }">
                                        <v-autocomplete v-model="medicine.medicine_id"
                                            :items="medicationStore.templateMedicineLists" item-title="drug_name"
                                            item-value="id" :placeholder="$t('Search Medicine')"
                                            @click="onMedicineSelect(index)" :menu-props="{ maxHeight: '150px' }">
                                        </v-autocomplete>
                                    </td>

                                    <td :style="{ 'min-width': '200px' }">
                                        <v-autocomplete v-model="medicine.variation_id"
                                            :items="getVariationsForMedicine(medicine.medicine_id)"
                                            item-title="variation_name" item-value="id" :placeholder="$t('Variation')"
                                            @click="onMedicineSelect(index)" :menu-props="{ maxHeight: '150px' }">
                                        </v-autocomplete>
                                    </td>

                                    <td :style="{ 'min-width': '150px' }">
                                        <v-select v-model="medicine.dose" :items="DoseOptions" :placeholder="$t('Dose')"
                                            @click="onMedicineSelect(index)">
                                        </v-select>
                                    </td>

                                    <!-- When -->
                                    <td :style="{ 'min-width': '180px' }">
                                        <v-select v-model="medicine.when" :items="whenOptions" :placeholder="$t('When')"
                                            @click="onMedicineSelect(index)">
                                        </v-select>
                                    </td>

                                    <!-- Frequency -->
                                    <td :style="{ 'min-width': '200px' }">
                                        <v-select v-model="medicine.frequency" :items="frequencyOPtions"
                                            :placeholder="$t('Frequency')" @click="onMedicineSelect(index)">
                                        </v-select>
                                    </td>

                                    <!-- Duration -->
                                    <td :style="{ 'min-width': '150px' }">
                                        <v-select v-model="medicine.duration" :items="DurationOptions"
                                            :placeholder="$t('Duration')" @click="onMedicineSelect(index)">
                                        </v-select>
                                    </td>

                                    <!-- Notes -->
                                    <td :style="{ 'min-width': '150px', 'padding': '10px 10px' }">
                                        <v-textarea v-model="medicine.notes" :placeholder="$t('Notes here..')" rows="2"
                                            @click="onMedicineSelect(index)">
                                        </v-textarea>
                                    </td>

                                    <!-- Delete Button -->
                                    <td v-if="index > 0">
                                        <IconBtn @click="removeMedicine(index)">
                                            <VIcon icon="tabler-trash" />
                                        </IconBtn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </div>
                </v-row>

                <v-row>
                    <v-col>
                        <VBtn class="me-3" type="submit">
                            {{ $t('Save') }}
                        </VBtn>
                        <VBtn variant="tonal" color="error" class="ml-1" @click="closeNavigationDrawer">
                            {{ $t('Close') }}
                        </VBtn>
                    </v-col>
                </v-row>
            </VCardText>
        </v-form>
    </VCardText>


</template>


<style scope>
.scrollable-table-container {
    max-height: 500px;
    width: 100%;
    /* Ensure it takes full width of its parent */
    overflow-x: auto;
    /* Enable horizontal scrolling */
    overflow-y: auto;
    /* Enable vertical scrolling */
    display: block;
}

.scrollable-table {
    width: 100%;
    /* Ensure it stretches to take full available width */
    min-width: 1400px;
    /* Adjust this value to ensure table is wider than its container */
    table-layout: auto;
}


.v-table th,
.v-table td {
    white-space: nowrap;
    /* Prevent content from breaking to a new line */
}

.v-table td {
    padding: 8px;
    /* Adjust padding as needed */
}

.backgroundColor {
    background-color: #e0f2ef;
}

/* .v-table__wrapper {
    border-radius: inherit;
     overflow: auto; 
    flex: 1 1 auto;
    width: auto;
    overflow-x: scroll !important;
} */
</style>
