<script setup>
import { useMedicationStore } from '@/stores/medicationStore';
import { useTemplateStore } from '@/stores/templateStore';
import { ref } from 'vue';
const props = defineProps({
    patient: {
        type: Object,
        required: true,
    },
    medicine: {
        type: String,
        required: true,
    }
})

const signatureRef = ref(null)
const signature = ref(null)
const medicationStore = useMedicationStore()
medicationStore.unloadMedication()
const templateStore = useTemplateStore()
medicationStore.getMedicineList()
const selectedtemplate = ref()
// Form data
const refForm = ref()
// Options for selects
const DoseOptions = ['1 - 0 - 1', '1 - 0 - 0', '0 - 0 - 1', '1 - 1 - 1', '1 - 1 - 0', '0 - 1 - 0', '0 - 1 - 1'];
const whenOptions = ['Before Food', 'After Food', 'Before BreakFast', 'After BreakFast', 'Before Lunch', 'After Lunch',
    'Before Dinner', 'After Dinner', 'Empty Stomach'];
const DurationOptions = ['1 Day', '1 Week', '1 month', '2 months', '3 months', '4 months', '5 months', '6 months'];
const TypeOPtions = ['Tablet', 'Capsule', 'creams', 'injections', 'Syrup'];
const frequencyOPtions = ['Daily', 'AlternateDay', 'weekly', 'monthly', 'stat', 'sos', 'weekly twice', 'weekly thrice'];
const dispRefillsOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const dispSubsOptions = [
    { text: 'Substitution Allowed', value: 1 },
    { text: 'As Written', value: 2 },
];
const selectedStates = ref([]);
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


console.log("selectedHealth", props.medicine);
if (props.medicine) {
    // console.log()
    console.log("selectedHealth", props.medicine);
    medicationStore.prescriptionId = props.medicine;
    medicationStore.getPrescriptionById(props.medicine);
}
const closeNavigationDrawer = () => {
    emit('customEvent', false)
};
const onSubmit = async (t) => {
    refForm.value?.validate().then(async ({ valid }) => {
        if (valid) {

            let res = await medicationStore.savePrescription(props.patient.id)
            console.log("res", res);

            closeNavigationDrawer();
            return res;
        }
    });
}
const templateList = computed(() => {

    return templateStore.templates.map(user => ({
        ...user,
        template_name: `${user.template_name}`,
    }))
});

const medicineList = computed(() => {
    console.log("msd", medicationStore.medicineLists);
    return medicationStore.medicineLists.map(medicine => ({
        ...medicine,
        medicine_name: `${medicine.drug_name ?? 'Unknown Name'}`,
    }));
});

// templateStore.getTemplateList()


watch(selectedtemplate, async (val) => {
    console.log("val", val);
    if (val && typeof val === "number") {
        await templateStore.getTemplate(val);
        let data = templateStore.template;
        medicationStore.mapMedicanData(data)
    }
});



const onSelectValue = (selectedItem, index) => {
    if (!selectedItem || selectedItem.header) return; // Ignore headers

    console.log("Selected Item & Index:", selectedItem, index);
    console.log("Available Medicines:", medicationStore.medicineLists);

    // Find the selected medicine object
    // if(selectedItem.type=='package'){
    //     const selectedMedicine = selectedItem.prescription_items.find(item => item.medicine_id === selectedItem.id);

    // }
    // const selectedMedicine = medicationStore.medicineLists.find(item => item.id === selectedItem.id);

    // if (!selectedMedicine) {
    //     console.warn(`Medicine with ID ${selectedItem.id} not found`);
    //     return;
    // }

    console.log("Selected Medicine:", selectedItem);

    // Remove the existing medicine at the given index


    let prescriptionItems = [];

    if (selectedItem.type === 'package' && selectedItem.prescription_items?.length) {
        // Package type: Extract from prescription_items array
        removeMedicine(index);

        prescriptionItems = [...selectedItem.prescription_items];
    } else if (selectedItem.type === 'previous') {
        removeMedicine(index);
        // Previous type: Convert single object to array format
        prescriptionItems = [{
            medicine_id: selectedItem.medicine_id,
            variation_id: selectedItem.variation_id,
            dose: selectedItem.dose,
            when: selectedItem.when,
            frequency: selectedItem.frequency,
            duration: selectedItem.duration,
            notes: selectedItem.notes
        }];
    } else {
        removeMedicine(index);
        // Standard medicine selection
        prescriptionItems = [{
            medicine_id: selectedItem.id,
            variation_id: null, // Reset variation
            dose: "",
            when: "",
            frequency: "",
            duration: "",
            notes: ""
        }];
    }

    console.log("Prescription Items to Add:", prescriptionItems);

    // Add to store
    medicationStore.prescription.newPrescription.splice(index, 0, ...prescriptionItems);

    // addMedicine(); // Ensure this function updates the store correctly
};




const isRowEmpty = (row) => {
    // Check if all fields are empty (or falsy)
    return !row.medicine_id &&
        !row.variation_id &&
        !row.dose &&
        !row.when &&
        !row.frequency &&
        !row.duration &&
        !row.notes;
};

const onMedicineSelect = (index) => {
    // Only check if this is the last row in the prescription list
    if (index + 1 === medicationStore.prescription.newPrescription.length) {
        const currentRow = medicationStore.prescription.newPrescription[index];

        // Only add a new row if the current row is not completely empty
        if (!isRowEmpty(currentRow)) {
            addMedicine();
        }
    }
};

function addMedicine() {
    // Add a new empty medicine object to the list
    medicationStore.prescription.newPrescription.push({
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
    medicationStore.prescription.newPrescription.splice(index, 1);
}

const getVariationsForMedicine = (medicineId) => {
    console.log("medicineId", medicineId);
    let medicine;
    if (!medicineId) return []; // If no medicine ID, return an empty array.
    if (typeof medicineId === "object") {
        medicine = medicationStore.medicineLists.find(med => med.id === medicineId.id);
    } else {
        medicine = medicationStore.medicineLists.find(med => med.id === medicineId);
    }
    if (!medicine || !medicine.variations) return [];

    let variations = medicine.variations;

    // If variations is an object (single entry), convert it to an array
    if (!Array.isArray(variations)) {
        variations = [variations];
    }

    // Extract only `id` and `variation_name`
    return variations;
};





</script>

<template>
    <v-form ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit('image/jpeg')">
        <VCardText>
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
                            <tr v-for="(medicine, index) in medicationStore.prescription.newPrescription" :key="index"
                                class="mb-3 py-3">
                                <td :style="{ 'min-width': '210px' }">
                                    <v-autocomplete v-model="medicine.medicine_id"
                                        :items="medicationStore.medicineLists" item-title="drug_name" item-value="id"
                                        :placeholder="$t('Search Medicine')" :menu-props="{ maxHeight: '150px' }"
                                        @update:model-value="onSelectValue($event, index)" return-object>
                                        <template v-slot:item="{ props, item }">
                                            <template v-if="item.raw.header">
                                                <v-list-subheader><b>{{ item.raw.header
                                                        }}</b></v-list-subheader>
                                            </template>
                                            <template v-else>
                                                <v-list-item v-bind="props">
                                                    <div v-if="item.raw.type === 'previous'"
                                                        class="prescription-details">
                                                        <small>Dosage: <b>{{ item.raw.dose || 'N/A' }} </b></small>
                                                        <small> When: <b>{{ item.raw.when || 'N/A' }} </b></small>
                                                        <small> Frequency: <b>{{ item.raw.frequency || 'N/A'
                                                                }}</b></small>
                                                        <small> Duration: <b>{{ item.raw.duration || 'N/A'
                                                                }}</b></small>
                                                    </div>
                                                </v-list-item>
                                            </template>
                                        </template>

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
</template>

<style scoped>
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

.prescription-details {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
}

.prescription-details p {
    margin: 2px 0;
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
