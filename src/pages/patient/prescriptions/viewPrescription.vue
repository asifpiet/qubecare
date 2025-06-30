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
const medicationStore = useMedicationStore()
medicationStore.unloadMedication()
const templateStore = useTemplateStore()
const selectedtemplate = ref()
// Form data
const refForm = ref()
// Options for selects
const dispDaysOptions = [1, 5, 7, 10, 14, 30, 40, 60, 90, 120];
const dispRefillsOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const dispSubsOptions = [
    { text: 'Substitution Allowed', value: '1' },
    { text: 'As Written', value: '2' },
];
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

if (props.medicine) {
    console.log("selectedHealth", props.medicine);
    medicationStore.viewPatientPrescription(props.medicine)
}

watch(selectedtemplate, async (val) => {
    console.log("val", val);
    await templateStore.getTemplate(val.id);
    // console.log("templateData", templateStore.template);
    let data = templateStore.template;
    medicationStore.mapMedicanData(data)
}); 
</script>

<template>
    <!-- <v-container> -->
    <v-form ref="refForm">
        <VCardText>
            <v-row>
                <v-col cols="12" sm="6">
                    <v-text-field v-model="medicationStore.medication.presherb_name" :rules="[requiredValidator]"
                        label="Herb Name" maxlength="255" placeholder="" readOnly></v-text-field>

                    <v-row class="pt-4" dense>
                        <v-col cols="12" md="4">
                            <v-select v-model="medicationStore.medication.presherb_dispense_days"
                                :items="dispDaysOptions" label="Dispense Days" placeholder="Select Days"
                                readOnly></v-select>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-select v-model="medicationStore.medication.presherb_dispense_refills"
                                :items="dispRefillsOptions" label="Refills" placeholder="Select Refills"
                                readOnly></v-select>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-select v-model="medicationStore.medication.presherb_dispense_subtitution"
                                :items="dispSubsOptions" label="Substitution" placeholder="Select Substitution"
                                item-title="text" item-value="value" readOnly></v-select>
                        </v-col>
                    </v-row>



                    <v-row>
                        <v-col cols="4">
                            <v-text-field v-model="medicationStore.medication.BB" label="BB" readOnly></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="medicationStore.medication.B" label="B" readOnly></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="medicationStore.medication.BL" label="BL" readOnly></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="medicationStore.medication.L" label="L" readOnly></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="medicationStore.medication.BD" label="BD" readOnly></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="medicationStore.medication.D" label="D" readOnly></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="py-3">
                            <v-textarea v-model="medicationStore.medication.presherb_notes" label="Notes"
                                placeholder="Notes here.." rows="2" readOnly></v-textarea>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols="12" sm="6" class="py-3 mb-3">
                    <div class="py-3">
                        <v-text-field v-model="medicationStore.medication.presherb_start_on" label="Start Date"
                            type="date" placeholder="YYYY-MM-DD" readOnly></v-text-field>
                    </div>
                    <div class="py-3">
                        <v-text-field v-model="medicationStore.medication.presherb_discontinue" label="Discontinue Date"
                            type="date" placeholder="YYYY-MM-DD" readOnly></v-text-field>
                    </div>
                    <div class="py-3">
                        <v-select v-model="medicationStore.medication.presherb_src" :items="srcOptions" label="Source"
                            placeholder="Select Source" readOnly></v-select>
                    </div>
                </v-col>
            </v-row>
        </VCardText>
    </v-form>
    <!-- </v-container> -->
</template>


<style scoped>
/* Add any additional styles here */
</style>
