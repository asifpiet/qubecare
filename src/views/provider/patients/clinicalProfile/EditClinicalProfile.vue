<script setup>
import { useClinicalProfileStore } from '@/stores/clinicalProfileStore';
import FamilyHistory from '@/views/provider/patients/clinicalProfile/FamilyHistory.vue';
import Immunization from '@/views/provider/patients/clinicalProfile/Immunization.vue';
import PatientFamilyHistory from '@/views/provider/patients/clinicalProfile/PatientFamilyHistory.vue';
import ReproductiveSection from '@/views/provider/patients/clinicalProfile/ReproductiveSection.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
const clinicalProfileStore = useClinicalProfileStore()
const store = useStore()
const { t } = useI18n();
const emit = defineEmits([
    'immunization'
]);
const props = defineProps({
    patient: {
        type: Object,
        required: true,
    },
})

const allergies = ref([
    'Egg Allergy',
    'Fish',
    'Milk',
    'Nuts',
    'Peanuts',
    'Shellfish',
    'Soy',
    'Wheat Allergy',
]);

const firstColumnAllergies = [
    { label: 'Egg', value: 'Egg Allergy' },
    { label: 'Fish', value: 'Fish' },
    { label: 'Milk', value: 'Milk' },
    { label: 'Nuts', value: 'Nuts' },
];

const secondColumnAllergies = [
    { label: 'Peanuts', value: 'Peanuts' },
    { label: 'Shellfish', value: 'Shellfish' },
    { label: 'Soy', value: 'Soy' },
    { label: 'Wheat', value: 'Wheat Allergy' },
];


const translatedAllergies = computed(() => {
  return firstColumnAllergies.map(data => ({
    ...data,
    label: t(data.label)
    }));
});


const translatedSecondColumnAllergies = computed(() => {
  return secondColumnAllergies.map(data => ({
    ...data,
    label: t(data.label)
    }));
});

const newAllergy = ref('');
const newDrug = ref();
const newMed = ref();
const firstRestrictionGroups = [

    { label: 'Vegetarian', value: 'Vegetarian' },
    { label: 'Vegan', value: 'Vegan' },
    { label: 'Organic', value: 'Organic' },
];

const secRestrictionGroups = [
    { label: 'Egg Restriction', value: 'Egg' },
    { label: 'Salt Restriction', value: 'Salt' },
    { label: 'Fat Restriction', value: 'Fat' },
];


const thirdRestrictionGroups = [
    { label: 'Starch/Carbohydrate Restriction', value: 'Starch/Carbohydrate' },
    { label: 'Soy Restriction', value: 'Soy' },
    { label: 'Calorie Restriction', value: 'Calorie' },
];
const fourthRestrictionGroups = [
    { label: 'Dairy Restriction', value: 'Dairy' },
    { label: 'Wheat Restriction', value: 'Wheat' },
    { label: 'Gluten Restriction', value: 'Gluten' },

];

const translatedFirstRestrictionGroups = computed(() => {
  return firstRestrictionGroups.map(data => ({
    ...data,
    label: t(data.label)
    }));
});

const translatedSecRestrictionGroups = computed(() => {
  return secRestrictionGroups.map(data => ({
    ...data,
    label: t(data.label)
    }));
});

const translatedThirdRestrictionGroups = computed(() => {
  return thirdRestrictionGroups.map(data => ({
    ...data,
    label: t(data.label)
    }));
});

const translatedFourthRestrictionGroups = computed(() => {
  return fourthRestrictionGroups.map(data => ({
    ...data,
    label: t(data.label)
    }));
});
const selectedImmunizations = ref([]);
const selectedCovidVaccine = ref('');
const checkboxGroups = [
    [
        { label: 'Polio', value: 'Polio' },
        { label: 'Tetanus shot', value: 'Tetanus shot' },
        { label: 'Haemophilus influenzae', value: 'Haemophilus influenzae' },
        { label: 'Pneumococcal infections', value: 'Pneumococcal infections' },
    ],
    [
        { label: 'Measles/Mumps/Rubella', value: 'Measles/Mumps/Rubella' },
        { label: 'Pertussis', value: 'Pertussis' },
        { label: 'Human papillomavirus', value: 'Human papillomavirus' },
        { label: 'Rotavirus', value: 'Rotavirus' },
    ],
    [
        { label: 'Diphtheria', value: 'Diphtheria' },
        { label: 'Chickenpox', value: 'Chickenpox' },
        { label: 'Influenza', value: 'Influenza' },
        { label: 'Shingles', value: 'Shingles' },
    ],
    [
        { label: 'Hepatitis A', value: 'Hepatitis A' },
        { label: 'Hepatitis B', value: 'Hepatitis B' },
        { label: 'Meningococcal meningitis', value: 'Meningococcal meningitis' },
    ],
];



const translatedCheckboxGroups = computed(() => {
  return checkboxGroups.map(group => 
    group.map(data => ({
      ...data,
      label: t(data.label)  // Assuming `t` is the translation function
    }))
  );
});
const covidVaccines = [
    { text: 'Select', value: '' },
    { text: 'Moderna', value: 'Moderna' },
    { text: 'AstraZeneca', value: 'AstraZeneca' },
    { text: 'J&J', value: 'J&J' },
    { text: 'Pfizer-BioNTech', value: 'Pfizer-BioNTech' },
    { text: 'Novavax', value: 'Novavax' },
];



function addAllergyField() {
    clinicalProfileStore.generalProfile.additionalFoodAllergies.push('');
}

function removeAllergyField(index) {
    clinicalProfileStore.generalProfile.additionalFoodAllergies.splice(index, 1);
}

function addDrugField() {
    clinicalProfileStore.generalProfile.additionalDrugAllergies.push('');
}

function removeDrugField(index) {
    clinicalProfileStore.generalProfile.additionalDrugAllergies.splice(index, 1);
}

function addMedField() {
    clinicalProfileStore.generalProfile.ineffectiveMeds.push('');
}

function removeMedField(index) {
    clinicalProfileStore.generalProfile.ineffectiveMeds.splice(index, 1);
}

const onSubmitClinicalProfile = async () => {
    return clinicalProfileStore.saveClinicalProfile(props.patient.id)
}

const onSubmitDietRestriction = async () => {
    return clinicalProfileStore.saveDiet(props.patient.id)
}
const generalProfileData = ref({});
const dietData = ref({});
const immunizationData = ref({});
const immunizationEntries = ref({});
const reproductiveData = ref({});
const patientFamilyData = ref({});
const personalFamilyData = ref({});
</script>
<template>
    
    <VExpansionPanels multiple>
        <VExpansionPanel>
            <VExpansionPanelTitle>
                <b>{{ $t('General') }}</b>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
                <VCardText class="pl-0 pr-0">
                    <v-row>
                        <v-col cols="12" md="6">
                            <div class="tw-om-input-label"> {{ $t('Smoking') }} </div>
                            <v-radio-group v-model="clinicalProfileStore.generalProfile.smoking" inline>
                                <v-radio :label="$t('Yes')" value="Yes"></v-radio>
                                <v-radio :label="$t('No')" value="no"></v-radio>
                            </v-radio-group>
                            <v-checkbox v-model="clinicalProfileStore.generalProfile.pastSmoking" :label="$t('Past')" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <div class="tw-om-input-label"> {{ $t('Blood Type') }} </div>
                            <v-radio-group v-model="clinicalProfileStore.generalProfile.bloodGroup" inline>
                                <v-radio label="A-" value="A-"></v-radio>
                                <v-radio label="A+" value="A+"></v-radio>
                                <v-radio label="AB-" value="AB-"></v-radio>
                                <v-radio label="AB+" value="AB+"></v-radio>
                                <v-radio label="B-" value="B-"></v-radio>
                                <v-radio label="B+" value="B+"></v-radio>
                                <v-radio label="O-" value="O-"></v-radio>
                                <v-radio label="O+" value="O+"></v-radio>
                                <v-radio :label="$t('Not Known')" value="Unknown"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-textarea v-model="clinicalProfileStore.generalProfile.generalNotes"
                                :label="$t('General Notes')" rows="3" style="resize: none;"></v-textarea>
                        </v-col>
                    </v-row>
                    <VRow>
                        <!-- Food Allergies Card -->
                        <VCol cols="12" md="4">
                            <v-card>
                                <v-card-title>
                                    <span class="tw-om-regtxt">{{ $t('Food Allergies') }}</span>
                                </v-card-title>
                                <!-- <v-card-text> -->
                                <VRow class="px-2">
                                    <VCol cols="12" sm="6">
                                        <div v-for="allergy in translatedAllergies" :key="allergy.value">
                                            <v-checkbox v-model="clinicalProfileStore.generalProfile.selectedAllergies"
                                                :label="allergy.label" :value="allergy.value" class="tw-om-chkbox" />
                                        </div>
                                    </VCol>
                                    <VCol cols="12" sm="6">
                                        <div v-for="allergy in translatedSecondColumnAllergies" :key="allergy.value">
                                            <v-checkbox v-model="clinicalProfileStore.generalProfile.selectedAllergies"
                                                :label="allergy.label" :value="allergy.value" class="tw-om-chkbox" />
                                        </div>
                                    </VCol>
                                    <VCol cols="12">
                                        <v-textarea v-model="clinicalProfileStore.generalProfile.foodAllergyNotes"
                                            :label="$t('Notes')" rows="3" style="resize: none;"></v-textarea>
                                    </VCol>
                                    <VCol cols="12">
                                        <div class="d-flex align-center mb-2">
                                            <v-text-field v-model="newAllergy" :label="$t('Search')"
                                                @keyup.enter="addAllergyField" class="mb-2 mr-1" />
                                            <v-btn @click="addAllergyField" icon>
                                                <v-icon>tabler-plus</v-icon>
                                            </v-btn>
                                        </div>
                                        <VCardTitle class="pb-0 pt-0 mb-3">{{ $t('Allergen') }}</VCardTitle>
                                        <div v-for="(input, index) in clinicalProfileStore.generalProfile.additionalFoodAllergies"
                                            :key="index" class="d-flex align-center mb-2">
                                            <v-text-field
                                                v-model="clinicalProfileStore.generalProfile.additionalFoodAllergies[index]"
                                                label="Allergy" class="mr-2" />
                                            <v-btn @click="removeAllergyField(index)" icon>
                                                <v-icon>tabler-trash</v-icon>
                                            </v-btn>
                                        </div>
                                    </VCol>
                                </VRow>
                                <!-- </v-card-text> -->
                            </v-card>
                        </VCol>

                        <!-- Drug/Herb Allergy Details Card -->
                        <VCol cols="12" md="4">
                            <v-card>
                                <v-card-title>
                                    <span class="tw-om-regtxt">{{ $t('Drug/Herb Allergy Details') }}</span>
                                </v-card-title>
                                <!-- <v-card-text> -->
                                <VRow class="px-2">
                                    <VCol cols="12">
                                        <div class="d-flex align-center mb-2">
                                            <v-text-field v-model="newDrug" :label="$t('Search')"
                                                @keyup.enter="addDrugField" class="mb-2 mr-1" />
                                            <v-btn @click="addDrugField" icon>
                                                <v-icon>tabler-plus</v-icon>
                                            </v-btn>
                                        </div>
                                        <VCardTitle class="pb-0 pt-0 mb-3">{{ $t('Drug/Herb') }}</VCardTitle>
                                        <div v-for="(input, index) in clinicalProfileStore.generalProfile.additionalDrugAllergies"
                                            :key="index" class="d-flex align-center mb-2">
                                            <v-text-field
                                                v-model="clinicalProfileStore.generalProfile.additionalDrugAllergies[index]"
                                                :label="$t('Drug')" class="mr-2" />
                                            <v-btn @click="removeDrugField(index)" icon>
                                                <v-icon>tabler-trash</v-icon>
                                            </v-btn>
                                        </div>
                                    </VCol>
                                    <VCol cols="12">
                                        <VCheckbox v-model="clinicalProfileStore.generalProfile.isKnownDrugAllergies"
                                            :label="$t('No Known Drug Allergies')" />
                                    </VCol>
                                    <VCol cols="12">
                                        <v-textarea v-model="clinicalProfileStore.generalProfile.drugAllergyNotes"
                                            :label="$t('Notes')" rows="3" style="resize: none;"></v-textarea>
                                    </VCol>
                                </VRow>
                                <!-- </v-card-text> -->
                            </v-card>
                        </VCol>

                        <!-- Ineffective Meds Card -->
                        <VCol cols="12" md="4">
                            <v-card>
                                <v-card-title>
                                    <span class="tw-om-regtxt">{{ $t('Ineffective Meds') }}</span>
                                </v-card-title>
                                <!-- <v-card-text> -->
                                <VRow class="px-2">
                                    <VCol cols="12">
                                        <div class="d-flex align-center mb-2">
                                            <v-text-field v-model="newMed" :label="$t('Search')"
                                                @keyup.enter="addMedField" class="mb-2 mr-1" />
                                            <v-btn @click="addMedField" icon>
                                                <v-icon>tabler-plus</v-icon>
                                            </v-btn>
                                        </div>
                                        <VCardTitle class="pb-0 pt-0 mb-3">{{ $t('Meds') }}</VCardTitle>
                                        <div v-for="(input, index) in clinicalProfileStore.generalProfile.ineffectiveMeds"
                                            :key="index" class="d-flex align-center mb-2">
                                            <v-text-field
                                                v-model="clinicalProfileStore.generalProfile.ineffectiveMeds[index]"
                                                label="Med" class="mr-2" />
                                            <v-btn @click="removeMedField(index)" icon>
                                                <v-icon>tabler-trash</v-icon>
                                            </v-btn>
                                        </div>
                                    </VCol>
                                    <VCol cols="12">
                                        <v-textarea v-model="clinicalProfileStore.generalProfile.ineffectiveMedsNotes"
                                            :label="$t('Notes')" rows="3" style="resize: none;"></v-textarea>
                                    </VCol>
                                </VRow>
                                <!-- </v-card-text> -->
                            </v-card>
                        </VCol>

                        <!-- Submit Button -->
                        <VCol cols="12">
                            <VBtn @click="onSubmitClinicalProfile" class="me-3">
                               {{ $t('Update Clinical Profile')}} 
                            </VBtn>
                        </VCol>
                    </VRow>

                </VCardText>
            </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
            <VExpansionPanelTitle>
                <b>{{ $t('Diet and other Restrictions') }}</b>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
                <v-card-text>
                    <VRow>
                        <!-- First Column -->
                        <VCol cols="12" sm="6" md="3">
                            <div v-for="allergy in translatedFirstRestrictionGroups" :key="allergy.value">
                                <v-checkbox v-model="clinicalProfileStore.diet.selected_deit_restrictions"
                                    :label="allergy.label" :value="allergy.value" class="tw-om-chkbox" />
                            </div>
                        </VCol>
                        


                        <!-- Second Column -->
                        <VCol cols="12" sm="6" md="3">
                            <div class="space-y-2">
                                <div v-for="allergy in translatedSecRestrictionGroups" :key="allergy.value">
                                    <v-checkbox v-model="clinicalProfileStore.diet.selected_deit_restrictions"
                                        :label="allergy.label" :value="allergy.value" class="tw-om-chkbox" />
                                </div>
                            </div>
                        </VCol>

                        <!-- Third Column -->
                        <VCol cols="12" sm="6" md="3">
                            <div class="space-y-2">
                                <div v-for="allergy in translatedThirdRestrictionGroups" :key="allergy.value">
                                    <v-checkbox v-model="clinicalProfileStore.diet.selected_deit_restrictions"
                                        :label="allergy.label" :value="allergy.value" class="tw-om-chkbox" />
                                </div>
                            </div>
                        </VCol>

                        <!-- Fourth Column -->
                        <VCol cols="12" sm="6" md="3">
                            <div class="space-y-2">
                                <div v-for="allergy in translatedFourthRestrictionGroups" :key="allergy.value">
                                    <v-checkbox v-model="clinicalProfileStore.diet.selected_deit_restrictions"
                                        :label="allergy.label" :value="allergy.value" class="tw-om-chkbox" />
                                </div>
                            </div>
                        </VCol>

                        <!-- Textarea for Additional Notes -->
                        <VCol cols="12">
                            <v-textarea v-model="clinicalProfileStore.diet.restrictions_notes"
                                :label="$t('Other Restrictions')" rows="3" style="resize: none;"></v-textarea>
                        </VCol>

                        <!-- Submit Button -->
                        <VCol cols="12">
                            <VBtn @click="onSubmitDietRestriction" class="me-3">
                               {{ $t('Update Restriction')}} 
                            </VBtn>
                        </VCol>
                    </VRow>
                </v-card-text>

            </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
            <VExpansionPanelTitle>
                <b>{{ $t('Immunizations') }}</b>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
                <v-form>
                    <v-row>
                        <v-col v-for="(group, index) in translatedCheckboxGroups" :key="index" cols="12" sm="6" md="4" lg="3">
                            <div class="space-y-1">
                                <div v-for="item in group" :key="item.value">
                                    <v-checkbox v-model="clinicalProfileStore.Immunizations.selectedImmunizations"
                                        :label="item.label" :value="item.value" class="tw-om-chkbox" ></v-checkbox>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12" sm="6" md="4" lg="3">
                            <div class="space-y-1">
                                <div class="flex items-center space-x-2">
                                    <v-checkbox v-model="clinicalProfileStore.Immunizations.selectedImmunizations"
                                        :label="$t('Covid')" value="Covid" class="tw-om-chkbox"></v-checkbox>
                                    <v-select v-model="clinicalProfileStore.Immunizations.selectedCovidVaccine"
                                        :items="covidVaccines" item-value="value" item-title="text" label="Select"
                                        class="border border-gray-200"></v-select>
                                </div>
                            </div>
                        </v-col>
                        <VCol cols="12" md="12">
                            <v-textarea v-model="clinicalProfileStore.Immunizations.immunizationsNotes" :label="$t('Other')"
                                rows="3" style="resize: none;"></v-textarea>
                        </VCol>
                    </v-row>
                </v-form>
                <Immunization :patient="props.patient" @immunizationEntries="onSubmitImmunization"
                    :entries="immunizationEntries" />
            </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
            <VExpansionPanelTitle>
                <b>{{ $t('Personal and Family History Conditions') }}</b>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
                <FamilyHistory :patient="props.patient" @personalFamilyHistory="onSubmitPersonalFamilyHistory"
                    :personal-family-history="personalFamilyData" />
            </VExpansionPanelText>
        </VExpansionPanel>


        <VExpansionPanel>
            <VExpansionPanelTitle>
                <b>{{ $t('Reproductive Section') }}</b>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
                <ReproductiveSection :patient="props.patient" @onSaveReproductive="onSubmitReproductive"
                    :reproductive="reproductiveData" />
            </VExpansionPanelText>
        </VExpansionPanel>


        <VExpansionPanel>
            <VExpansionPanelTitle>
                <b>{{ $t('Patient Family History') }}</b>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
                <PatientFamilyHistory :patient="props.patient"
                    @onSavePatientFamilyHistory="onSubmitPatientFamilyContition" :patientfamily="patientFamilyData" />
            </VExpansionPanelText>
        </VExpansionPanel>

    </VExpansionPanels>
</template>



<style scoped>
.tw-om-regtxt {
    font-weight: bold;
}

.tw-om-input-label {
    font-size: 1rem;
    margin-bottom: 0.5rem;
}


/* Add your styles here */
.tw-om-chkbox {
    margin: 0.5em 0;
}
</style>
