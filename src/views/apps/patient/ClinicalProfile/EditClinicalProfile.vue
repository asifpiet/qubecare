<script setup>
import FamilyHistory from '@/views/apps/patient/ClinicalProfile/FamilyHistory.vue';
import Immunization from '@/views/apps/patient/ClinicalProfile/Immunization.vue';
import PatientFamilyHistory from '@/views/apps/patient/ClinicalProfile/PatientFamilyHistory.vue';
import ReproductiveSection from '@/views/apps/patient/ClinicalProfile/ReproductiveSection.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
const store = useStore()
const emit = defineEmits([
    'immunization'
]);
// const props = defineProps({
//   generalData:{
//     type: Object,
//     required: true,
//   }
// });

const message =ref('')
const smoking = ref('');
const pastSmoking = ref(false);
const bloodGroup = ref('');
const generalNotes = ref('');
const foodAllergyNotes =ref('');
const ineffectiveMedsNotes =ref('');
const additionalAllergies = ref([]);
const isTonalSnackbarVisible =ref();
const drugAllergyNotes =ref('');
const additionalDrug = ref([]);
const additinalIneffectiveMeds = ref([]);
const selectedRestrictions = ref([]);
const isKnownDrugAllergies =ref(false)
const immunizationsNotes =ref()
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

const selectedAllergies = ref([]);
const newAllergy = ref('');
const newDrug = ref();
const newMed = ref();
const patientAllergies = ref([]);
const restrictionsNotes =ref();
const firstRestrictionGroups = [
  
    { label: 'Vegetarian', value: 'Vegetarian' },
    { label: 'Vegan', value: 'Vegan' },
    { label: 'Organic', value: 'Organic' },
  ];
  
  const secRestrictionGroups =   [
    { label: 'Egg Restriction', value: 'Egg' },
    { label: 'Salt Restriction', value: 'Salt' },
    { label: 'Fat Restriction', value: 'Fat' },
  ];


  const thirdRestrictionGroups =  [
    { label: 'Starch/Carbohydrate Restriction', value: 'Starch/Carbohydrate' },
    { label: 'Soy Restriction', value: 'Soy' },
    { label: 'Calorie Restriction', value: 'Calorie' },
  ];
  const fourthRestrictionGroups =  [
    { label: 'Dairy Restriction', value: 'Dairy' },
    { label: 'Wheat Restriction', value: 'Wheat' },
    { label: 'Gluten Restriction', value: 'Gluten' },
  
  ];
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

const covidVaccines = [
  { text: 'Select', value: '' },
  { text: 'Moderna', value: 'Moderna' },
  { text: 'AstraZeneca', value: 'AstraZeneca' },
  { text: 'J&J', value: 'J&J' },
  { text: 'Pfizer-BioNTech', value: 'Pfizer-BioNTech' },
  { text: 'Novavax', value: 'Novavax' },
];



function addAllergyField() {
  additionalAllergies.value.push('');
}

function removeAllergyField(index) {
  additionalAllergies.value.splice(index, 1);
}

function addDrugField() {
  additionalDrug.value.push('');
}

function removeDrugField(index) {
  additionalDrug.value.splice(index, 1);
}

function addMedField() {
  additinalIneffectiveMeds.value.push('');
}

function removeMedField(index) {
  additinalIneffectiveMeds.value.splice(index, 1);
}

const onSubmitClinicalProfile = async () => {
  console.log(store.getters.getPatientPorfile.uuid)
    await store.dispatch('saveClinicalProfile',{
      id: store.getters.getPatientPorfile.uuid,
      smoking: smoking.value, 
      pastSmoking: pastSmoking.value, 
      bloodGroup: bloodGroup.value, 
      generalNotes: generalNotes.value,
      selectedAllergies: selectedAllergies.value,
      foodAllergyNotes: foodAllergyNotes.value,
      additionalAllergies: additionalAllergies.value,
      additionalDrug: additionalDrug.value,
      isKnownDrugAllergies: isKnownDrugAllergies.value,
      drugAllergyNotes: drugAllergyNotes.value,
      ineffectiveMeds: additinalIneffectiveMeds.value,
      ineffectiveMedsNotes: ineffectiveMedsNotes.value
    })
    isTonalSnackbarVisible.value = true;
    message.value = 'Clinical Profile updated';
} 

const onSubmitDietRestriction = async() => {
    await store.dispatch('saveDietAndRestriction',{
      patientId: store.getters.getPatientPorfile.patient_id,
      selectedDeitRestrictions: selectedRestrictions.value, 
      restrictionsNotes: restrictionsNotes.value, 
    })
} 
const onSubmitImmunization = async(data) => {
    console.log('immunizationData',data);
    await store.dispatch('onSubmitImmunization',{
      id: store.getters.getPatientPorfile.patient_id,
      selectedImmunizations: selectedImmunizations.value, 
      selectedCovidVaccine: selectedCovidVaccine.value, 
      immunizationsNotes:immunizationsNotes.value,
      data
      
    })
}
const onSubmitPersonalFamilyHistory = async(data) => {
    console.log("familyHistory",data);
    await store.dispatch('onSubmitPersonalFamilyHistory',{
      id: store.getters.getPatientPorfile.uuid,
      data
    });
}
const onSubmitReproductive = async(data) => {
    console.log("onSubmitReproductive",data);
    await store.dispatch('onSubmitReproductive',{
      id: store.getters.getPatientPorfile.patient_id,
      data
    });
} 

const onSubmitPatientFamilyContition = async(data) => {
    console.log("onSubmitPatientFamilyContition",data);
    await store.dispatch('onSubmitPatientFamilyCondition',{
      patientId: store.getters.getPatientPorfile.patient_id,
      data
    });
} 
const generalProfileData = ref({});
const dietData = ref({});
const immunizationData = ref({});
const immunizationEntries = ref({});
const reproductiveData = ref({});
const patientFamilyData = ref({});
const personalFamilyData = ref({});

const getClinicalProfileData = async () => {
      // await store.dispatch('getImmunization',{
      //   patientId: store.getters.getPatientPorfile.patientId
      // });
      // await store.dispatch('getPersonalFamilyHistory',{
      //   patientId: store.getters.getPatientPorfile.uuid
      // });
      
      // await store.dispatch('getReporductiveData',{
      //   patientId: store.getters.getPatientPorfile.patientId
      // });

      // await store.dispatch('getPatientFamilyCondition',{
      //   patientId: store.getters.getPatientPorfile.patientId
      // });

      
      //General Profile
      let allergyData = store.getters.getGeneralProfileData;
      const generalProfileData = allergyData.data;
      console.log("generalProfileData",generalProfileData);
      if(generalProfileData){
          console.log('enter');
          smoking.value = generalProfileData.smoking || '';
          pastSmoking.value = false;
          if(generalProfileData.pastSmoking == 1){
            pastSmoking.value = true;
          }
          bloodGroup.value = generalProfileData.bloodGroup || '';
          generalNotes.value = generalProfileData.generalNotes || '';
          drugAllergyNotes.value = generalProfileData.drugAllergyNotes || '';
          isKnownDrugAllergies.value = generalProfileData.isKnownDrugAllergies === '1';
          // foodAllergyNotes.value = generalProfileData.additionalFoodAllergies?.join(', ') || '';
          ineffectiveMedsNotes.value = generalProfileData.ineffectiveMedsNotes || '';
          // additionalAllergies.value = generalProfileData.additionalFoodAllergies || [];
          additionalDrug.value =  generalProfileData.additionalDrugAllergies?.[0]?.split(',') || [];
          additinalIneffectiveMeds.value = generalProfileData.ineffectiveMeds?.[0]?.split(',') || [];
          selectedAllergies.value = generalProfileData.selectedAllergies?.[0]?.split(',') || [];
          additionalAllergies.value = generalProfileData.additionalFoodAllergies?.[0]?.split(',') || [];
      }    
      // Handle arrays with default values if empty
      
     
      //Diet Data
      dietData.value = store.getters.getDietData;
      if(dietData.value){
      restrictionsNotes.value = dietData.value.restrictions_notes;
      selectedRestrictions.value = dietData.value.selected_deit_restrictions;
      }
      // immunizationData Data
      immunizationData.value = store.getters.getImmunizationData;
      if(immunizationData.value){
      
        // console.log("immunizationData",immunizationData.value);
      selectedImmunizations.value = immunizationData.value.selectedImmunizations;
      selectedCovidVaccine.value  =immunizationData.value.selectedCovidVaccine;
      immunizationsNotes.value  =immunizationData.value.immunizationsNotes;
      immunizationEntries.value = immunizationData.value;
      }
      
      let familyHistory = store.getters.getPatientFamilyHistoryData;
      console.log("familyHistory",familyHistory);
      if(familyHistory){
        personalFamilyData.value = familyHistory.data;
      }
      // console.log("familyHistory",familyHistory);
        //reproductiveData
      reproductiveData.value = store.getters.getReporductiveData;
      
      
      //patientFamilyData
//       if(patientFamilyData.value){
         patientFamilyData.value = store.getters.getPatientFamilyConditiondData;
//       }
 };

getClinicalProfileData(); 


</script>
<template>
      <!-- <VSnackbar
      v-model="isTonalSnackbarVisible"
      location="top end"
      variant="flat"
      color="success"
    >
    {{ message }}

    <template #actions>
              <VBtn
                  icon
                  color="white"
                  @click="isTonalSnackbarVisible = false"
                >
                  x
              </VBtn>
    </template>
     </VSnackbar> -->
      <VExpansionPanels multiple>
        <VExpansionPanel
        >
          <VExpansionPanelTitle>
          <b>General</b>
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <VCardText class="pl-0 pr-0">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="tw-om-input-label">Smoking</div>
                  <v-radio-group v-model="smoking" inline>
                    <v-radio label="Yes" value="Yes"></v-radio>
                    <v-radio label="No" value="no"></v-radio>
                  </v-radio-group>
                  <v-checkbox v-model="pastSmoking" label="Past" />
                </v-col>

                <v-col cols="12" md="6">
                  <div class="tw-om-input-label">Blood Type</div>
                  <v-radio-group v-model="bloodGroup" inline>
                    <v-radio label="A-" value="A-"></v-radio>
                    <v-radio label="A+" value="A+"></v-radio>
                    <v-radio label="AB-" value="AB-"></v-radio>
                    <v-radio label="AB+" value="AB+"></v-radio>
                    <v-radio label="B-" value="B-"></v-radio>
                    <v-radio label="B+" value="B+"></v-radio>
                    <v-radio label="O-" value="O-"></v-radio>
                    <v-radio label="O+" value="O+"></v-radio>
                    <v-radio label="Not Known" value="Unknown"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="12">
                  <v-textarea
                    v-model="generalNotes"
                    label="General Section Notes"
                    rows="3"
                    style="resize: none;"
                  ></v-textarea>
                </v-col>
              </v-row>
              <VRow>
  <!-- Food Allergies Card -->
  <VCol cols="12" md="4">
    <v-card>
      <v-card-title>
        <span class="tw-om-regtxt">Food Allergies</span>
      </v-card-title>
      <!-- <v-card-text> -->
        <VRow class="px-2">
          <VCol cols="12" sm="6">
            <div v-for="allergy in firstColumnAllergies" :key="allergy.value">
              <v-checkbox
                v-model="selectedAllergies"
                :label="allergy.label"
                :value="allergy.value"
                class="tw-om-chkbox"
              />
            </div>
          </VCol>
          <VCol cols="12" sm="6">
            <div v-for="allergy in secondColumnAllergies" :key="allergy.value">
              <v-checkbox
                v-model="selectedAllergies"
                :label="allergy.label"
                :value="allergy.value"
                class="tw-om-chkbox"
              />
            </div>
          </VCol>
          <VCol cols="12">
            <v-textarea
              v-model="foodAllergyNotes"
              label="Notes"
              rows="3"
              style="resize: none;"
            ></v-textarea>
          </VCol>
          <VCol cols="12">
            <div class="d-flex align-center mb-2">
              <v-text-field
                v-model="newAllergy"
                label="Search Allergy"
                @keyup.enter="addAllergyField"
                class="mb-2 mr-1"
              />
              <v-btn @click="addAllergyField" icon>
                <v-icon>tabler-plus</v-icon>
              </v-btn>
          </div>
            <VCardTitle class="pb-0 pt-0 mb-3">Allergen</VCardTitle>
            <div v-for="(input, index) in additionalAllergies" :key="index" class="d-flex align-center mb-2">
              <v-text-field
                v-model="additionalAllergies[index]"
                label="Allergy"
                class="mr-2"
              />
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
        <span class="tw-om-regtxt">Drug/Herb Allergy Details</span>
      </v-card-title>
      <!-- <v-card-text> -->
        <VRow class="px-2">
          <VCol cols="12">
            <div class="d-flex align-center mb-2">
            <v-text-field
              v-model="newDrug"
              label="Search Drug"
              @keyup.enter="addDrugField"
              class="mb-2 mr-1"
            />
            <v-btn @click="addDrugField" icon>
              <v-icon>tabler-plus</v-icon>
            </v-btn>
            </div>
            <VCardTitle class="pb-0 pt-0 mb-3">Drug/Herb</VCardTitle>
            <div v-for="(input, index) in additionalDrug" :key="index" class="d-flex align-center mb-2">
              <v-text-field
                v-model="additionalDrug[index]"
                label="Drug"
                class="mr-2"
              />
              <v-btn @click="removeDrugField(index)" icon>
                <v-icon>tabler-trash</v-icon>
              </v-btn>
            </div>
          </VCol>
          <VCol cols="12">
            <VCheckbox
              v-model="isKnownDrugAllergies"
              label="No Known Drug Allergies"
            />
          </VCol>
          <VCol cols="12">
            <v-textarea
              v-model="drugAllergyNotes"
              label="Notes"
              rows="3"
              style="resize: none;"
            ></v-textarea>
          </VCol>
        </VRow>
      <!-- </v-card-text> -->
    </v-card>
  </VCol>

  <!-- Ineffective Meds Card -->
  <VCol cols="12" md="4">
    <v-card>
      <v-card-title>
        <span class="tw-om-regtxt">Ineffective Meds</span>
      </v-card-title>
      <!-- <v-card-text> -->
        <VRow class="px-2">
          <VCol cols="12">
            <div class="d-flex align-center mb-2">
            <v-text-field
              v-model="newMed"
              label="Search Meds"
              @keyup.enter="addMedField"
              class="mb-2 mr-1"
            />
            <v-btn @click="addMedField" icon>
              <v-icon>tabler-plus</v-icon>
            </v-btn>
          </div>
            <VCardTitle class="pb-0 pt-0 mb-3">Meds</VCardTitle>
            <div v-for="(input, index) in additinalIneffectiveMeds" :key="index" class="d-flex align-center mb-2">
              <v-text-field
                v-model="additinalIneffectiveMeds[index]"
                label="Med"
                class="mr-2"
              />
              <v-btn @click="removeMedField(index)" icon>
                <v-icon>tabler-trash</v-icon>
              </v-btn>
            </div>
          </VCol>
          <VCol cols="12">
            <v-textarea
              v-model="ineffectiveMedsNotes"
              label="Notes"
              rows="3"
              style="resize: none;"
            ></v-textarea>
          </VCol>
        </VRow>
      <!-- </v-card-text> -->
    </v-card>
  </VCol>

  <!-- Submit Button -->
  <VCol cols="12">
    <VBtn @click="onSubmitClinicalProfile" class="me-3">
      Update Clinical Profile
    </VBtn>
  </VCol> 
</VRow>

            </VCardText>
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel
        >
          <VExpansionPanelTitle>
            <b>Diet and other Restrictions</b>
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <v-card-text>
  <VRow>
    <!-- First Column -->
    <VCol cols="12" sm="6" md="3">
      <div v-for="allergy in firstRestrictionGroups" :key="allergy.value">
        <v-checkbox
          v-model="selectedRestrictions"
          :label="allergy.label"
          :value="allergy.value"
          class="tw-om-chkbox"
        />
      </div>
    </VCol>

    <!-- Second Column -->
    <VCol cols="12" sm="6" md="3">
      <div class="space-y-2">
        <div v-for="allergy in secRestrictionGroups" :key="allergy.value">
          <v-checkbox
            v-model="selectedRestrictions"
            :label="allergy.label"
            :value="allergy.value"
            class="tw-om-chkbox"
          />
        </div>
      </div>
    </VCol>

    <!-- Third Column -->
    <VCol cols="12" sm="6" md="3">
      <div class="space-y-2">
        <div v-for="allergy in thirdRestrictionGroups" :key="allergy.value">
          <v-checkbox
            v-model="selectedRestrictions"
            :label="allergy.label"
            :value="allergy.value"
            class="tw-om-chkbox"
          />
        </div>
      </div>
    </VCol>

    <!-- Fourth Column -->
    <VCol cols="12" sm="6" md="3">
      <div class="space-y-2">
        <div v-for="allergy in fourthRestrictionGroups" :key="allergy.value">
          <v-checkbox
            v-model="selectedRestrictions"
            :label="allergy.label"
            :value="allergy.value"
            class="tw-om-chkbox"
          />
        </div>
      </div>
    </VCol>

    <!-- Textarea for Additional Notes -->
    <VCol cols="12">
      <v-textarea
        v-model="restrictionsNotes"
        label="Other Restrictions"
        rows="3"
        style="resize: none;"
      ></v-textarea>
    </VCol>

    <!-- Submit Button -->
    <VCol cols="12">
      <VBtn @click="onSubmitDietRestriction" class="me-3">
        Update Restriction
      </VBtn>
    </VCol>
  </VRow>
</v-card-text>

          </VExpansionPanelText>
        </VExpansionPanel>

          <VExpansionPanel
          >
            <VExpansionPanelTitle>
              <b>Immunizations</b>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <v-form>
      <v-row>
        <v-col v-for="(group, index) in checkboxGroups" :key="index" cols="12" sm="6" md="4" lg="3">
          <div class="space-y-1">
            <div v-for="item in group" :key="item.value">
              <v-checkbox
                v-model="selectedImmunizations"
                :label="item.label"
                :value="item.value"
                class="tw-om-label"
              ></v-checkbox>
            </div>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="3">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <v-checkbox
                v-model="selectedImmunizations"
                label="Covid"
                value="Covid"
                class="tw-om-label"
              ></v-checkbox>
              <v-select
                v-model="selectedCovidVaccine"
                :items="covidVaccines"
                item-value="value"
                item-title="text"
                label="Select"
                class="border border-gray-200"
              ></v-select>
            </div>
          </div>
        </v-col>
            <VCol cols="12" md="12">
                    <v-textarea
                      v-model="immunizationsNotes"
                      label="Other"
                      rows="3"
                      style="resize: none;"
                    ></v-textarea>
          </VCol>
          </v-row>
        </v-form>
            <Immunization  @immunizationEntries="onSubmitImmunization"
            :entries="immunizationEntries"  
            />
            </VExpansionPanelText>
          </VExpansionPanel>

          <VExpansionPanel
        >
          <VExpansionPanelTitle>
            <b>Personal and Family History Conditions</b>
          </VExpansionPanelTitle>
          <VExpansionPanelText>
               <FamilyHistory @personalFamilyHistory = "onSubmitPersonalFamilyHistory" 
                :personal-family-history="personalFamilyData"
               />
          </VExpansionPanelText>
        </VExpansionPanel>


        <VExpansionPanel
        >
          <VExpansionPanelTitle>
            <b>Reproductive Section</b>
          </VExpansionPanelTitle>
          <VExpansionPanelText>
               <ReproductiveSection  @onSaveReproductive="onSubmitReproductive"
               :reproductive="reproductiveData"
               />
          </VExpansionPanelText>
        </VExpansionPanel>
        

        <VExpansionPanel
        >
          <VExpansionPanelTitle>
          <b>Patient Family History</b>
          </VExpansionPanelTitle>
          <VExpansionPanelText>
               <PatientFamilyHistory  @onSavePatientFamilyHistory="onSubmitPatientFamilyContition" 
               :patientfamily="patientFamilyData"
               />
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
