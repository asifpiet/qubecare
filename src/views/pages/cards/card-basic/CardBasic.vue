<script setup>
import EditClinicalProfile from '@/views/apps/patient/ClinicalProfile/EditClinicalProfile.vue';
import avatar1 from '@images/avatars/avatar-1.png';
import avatar2 from '@images/avatars/avatar-2.png';
import avatar3 from '@images/avatars/avatar-3.png';
import avatar4 from '@images/avatars/avatar-4.png';
import { useStore } from 'vuex';
const store = useStore()
const isDialogVisible = ref(false)
const smoking = ref('');
const bloodGroup = ref('');
const generalNotes = ref('');
const foodAllergyNotes =ref('');
const ineffectiveMedsNotes =ref('');
const additionalAllergies = ref([]);
const drugAllergyNotes =ref('');
const additionalDrug = ref([]);
const additinalIneffectiveMeds = ref([]);
const selectedRestrictions = ref([]);
const selectedAllergies = ref([]);
const dietData = ref([]);
const restrictionsNotes =ref();
const immunizationData = ref({});
const immunizationsNotes =ref()
const selectedImmunizations = ref([]);
const reproductiveData = ref({});
const sexuallyActive =ref();
const sexualOrientation =ref();
const generalAlergyData = ref({});
const avatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
]
const isCardDetailsVisible = ref(false)
const getClinicalData = async() => {
  console.log("getClinicalData");
  await store.dispatch('getClinicalProfile',{
        uuid: store.getters.getPatientPorfile.uuid,
        patientId: store.getters.getPatientPorfile.patient_id
  });
  // await store.dispatch('getGeneralProfile',{
  //       patientId: store.getters.getPatientPorfile.uuid
  // });
  // await store.dispatch('getDietAndRestriction',{
  //       patientId: store.getters.getPatientPorfile.patientId
  // });
  // await store.dispatch('getImmunization',{
  //       patientId: store.getters.getPatientPorfile.patientId
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
  let allergyData = store.getters.getGeneralProfileData;
  generalAlergyData.value = allergyData.data;
  const generalProfileData = allergyData.data;
  if(generalProfileData){
    smoking.value = generalProfileData.smoking;
    bloodGroup.value = generalProfileData.bloodGroup || '';
    generalNotes.value = generalProfileData.generalNotes || '';
    selectedAllergies.value = generalProfileData.selectedAllergies?.[0]?.split(',') || [];
    console.log("data",selectedAllergies.value);
    additionalDrug.value =  generalProfileData.additionalDrugAllergies?.[0]?.split(',') || [];
    drugAllergyNotes.value = generalProfileData.drugAllergyNotes || '';
    ineffectiveMedsNotes.value = generalProfileData.ineffectiveMedsNotes || '';
    additinalIneffectiveMeds.value = generalProfileData.ineffectiveMeds?.[0]?.split(',') || [];
  }
  
  dietData.value = store.getters.getDietData;
  if(dietData.value){
      restrictionsNotes.value = dietData.value.restrictions_notes;
      selectedRestrictions.value = dietData.value.selected_deit_restrictions;
  }
  immunizationData.value = store.getters.getImmunizationData;
  if(immunizationData.value){
      selectedImmunizations.value = immunizationData.value.selectedImmunizations;
      immunizationsNotes.value  =immunizationData.value.immunizationsNotes;
  }
  reproductiveData.value = store.getters.getReporductiveData;  
  console.log("reproductiveData",reproductiveData.value);
  if(reproductiveData.value){
        let rep = reproductiveData.value.sexually_active;
        if(rep == 'true'){
          sexuallyActive.value = 'Yes';
        }
        sexualOrientation.value = reproductiveData.value.sexual_orientation;
  }
  // console.log("generalASIF",generalProfileData);
}
const closePpup = () => {
  isDialogVisible.value = false;
  getClinicalData();
}
getClinicalData();
</script>

<template>
  <VRow>
    
    <VCol
      cols="12"
      md="12"
      sm="6"
    >
      <VCard>
        <VCardActions>
          <div class="px-3 py-2">
          <VBtn  prepend-icon="tabler-edit" @click="isDialogVisible=true">
            Edit Clinical Profile
          </VBtn>
          
          </div>
        </VCardActions>
        <VCardText class=" pt-0" >
          <VTable class="mb-4 border rounded pt-0" v-if="$can('read', 'General')">
            <thead>
            <tr>
              <th><b>General</b></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Blood Group</td>
              <td> {{ bloodGroup}}</td>
            </tr>
            <tr>
              <td>Smoking:</td>
              <td>{{smoking}}</td>
            </tr>
            <tr>
              <td>General Notes</td>
              <td>{{ generalNotes}}</td>
            </tr>
            <tr>
              <td>Food Allergies</td>
              <td><p><VChip
                      v-for="(allergy, index) in selectedAllergies"
                      :key="index"
                      color="primary"
                      class="mr-1 mt-1"
                    >
                      {{ allergy }}
                    </VChip>
                  </p>
                <p>Note: </p></td>
            </tr>
            <tr>
              <td>Herb/Drug Allergies</td>
                <td>
                  <p></p>
                  <p>
                    <VChip
                      v-for="(drug, index) in additionalDrug"
                      :key="index"
                      color="primary"
                      class="mr-1 mt-1"
                    >
                      {{ drug }}
                    </VChip>
                  </p>
                  <!-- <span> <VChip color="primary" class="mr-1 mt-1 text-wrap">No Known Drug Allergies</VChip></span>   -->
                  <p>Note:   {{ drugAllergyNotes}}</p>
                </td>
            </tr>
            <tr>
              <td>Ineffective Meds</td>
                <td>
                  <p></p>
                  <p>
                    <VChip
                      v-for="(med, index) in additinalIneffectiveMeds"
                      :key="index"
                      color="primary"
                      class="mr-1 mt-1"
                    >
                      {{ med }}
                    </VChip>
                  </p>
                  
                  <p>Note:   {{ ineffectiveMedsNotes}}</p>
                </td>
            </tr>
          </tbody>
          </VTable>
        </VCardText>

        <VCardActions>
          <VBtn @click="isCardDetailsVisible = !isCardDetailsVisible">
            Show More
          </VBtn>

          <VSpacer />

          <VBtn
            icon
            size="small"
            @click="isCardDetailsVisible = !isCardDetailsVisible"
          >
            <VIcon :icon="isCardDetailsVisible ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
          </VBtn>
        </VCardActions>

        <VExpandTransition>
          <div v-show="isCardDetailsVisible">
            <VDivider />
            <VCardText>
            <VTable class="mb-4 border rounded pt-0" v-if="$can('read', 'Diet and other Restrictions')">
            <thead>
              <tr>
                <th><b>Dietary Restrictions</b></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Diet Restriction</td>
                  <td>
                    <p></p>
                    <p>
                      <VChip
                        v-for="(diet, index) in selectedRestrictions"
                        :key="index"
                        color="primary"
                        class="mr-1 mt-1"
                      >
                      {{ diet }}
                    </VChip>
                      </p>
                    <p>Note:  {{ restrictionsNotes }}</p>
                  </td>
              </tr>
            </tbody>
          </VTable>
          <VTable class="mb-4 border rounded pt-0" v-if="$can('read', 'Immunization')">
            <thead>
              <tr>
                <th><b>Immunization</b></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
                <tr>
                <td>Immunization</td>
                  <td>
                      <p> 
                        <VChip
                        v-for="(item, index) in selectedImmunizations"
                        :key="index"
                        color="primary"
                        class="mr-1 mt-1"
                      >
                      {{ item }}
                    </VChip>
                      </p>
                      <p>Other:   <VChip color="primary" class="mr-1 mt-1">{{ immunizationsNotes }}</VChip></p>
                    </td>
                </tr>
              </tbody> 
            </VTable> 
            
            <!-- <VTable class="mb-4 border rounded pt-0">
            <thead>
              <tr>
                <th><b>Personal and Family History</b></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
                <tr>
                <td>ADD/ADHD:</td>
                  <td>
                      <p><VChip color="primary" class="mr-1 mt-1">Self</VChip>
                      <VChip color="primary" class="mr-1 mt-1">Tetanus shot</VChip>
                      <VChip color="primary" class="mr-1 mt-1">Haemophilus influenzae,</VChip>
                      </p>
                    </td>
                </tr>
                <tr>
                <td>Anemia</td>
                  <td>
                      <p><VChip color="primary" class="mr-1 mt-1">Self</VChip>
                      <VChip color="primary" class="mr-1 mt-1">Tetanus shot</VChip>
                      <VChip color="primary" class="mr-1 mt-1">Haemophilus influenzae,</VChip>
                      </p>
                    </td>
                </tr>
                <tr>
                <td>Allergies</td>
                  <td>
                      <p><VChip color="primary" class="mr-1 mt-1">Self</VChip>
                      <VChip color="primary" class="mr-1 mt-1">Tetanus shot</VChip>
                      <VChip color="primary" class="mr-1 mt-1">Haemophilus influenzae,</VChip>
                      </p>
                    </td>
                </tr>
              </tbody> 
            </VTable> -->

            <VTable class="mb-4 border rounded pt-0" v-if="$can('read', 'Reproductive Section')">
            <thead>
              <tr>
                <th><b>Reproductive Section</b></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>Sexually Active</td>
                  <td>
                    {{  sexuallyActive }}    
                  </td>
                </tr>
                <tr>
                   <td>Sexual Orientation</td>
                  <td>
                    {{  sexualOrientation }}
                    </td>
                </tr>
              </tbody> 
            </VTable>
            </VCardText>
          </div>
        </VExpandTransition>
      </VCard>
    </VCol>
  </VRow>
  <VDialog
    v-model="isDialogVisible"
    max-width="1300"
    persistent
  >
    <DialogCloseBtn @click="closePpup" />
      <VCard title="Edit Clinical Profile">
        <VCardText>
          <EditClinicalProfile   
            />
        </VCardText>
      </VCard>
    </VDialog>
</template>

<style lang="scss" scoped>
.avatar-center {
  position: absolute;
  border: 3px solid rgb(var(--v-theme-surface));
  inset-block-start: -2rem;
  inset-inline-start: 1rem;
}

// membership pricing
.member-pricing-bg {
  position: relative;
  background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
}

.membership-pricing {
  sup {
    inset-block-start: 9px;
  }
}

.v-btn {
  transform: none;
}
</style>
