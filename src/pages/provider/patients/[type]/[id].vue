<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'New Follow Up',
  },
})

import { useFollowUpStore } from '@/stores/followUpStore';
import { usePatientStore } from '@/stores/patientStore';
import UserBioPanel from '@/views/provider/patients/UserBioPanel.vue';
import AddVital from '@/views/provider/patients/vitals/addvitalClicnical.vue';
import avatar1 from '@images/avatars/avatar-1.png';
const patientStore = usePatientStore()
const followUpStore = useFollowUpStore()
patientStore.unloadPatient()
const route = useRoute()
const patientId = route.params.id;
const annontableImage = ref('')
const childRef = ref(null);
const accountData = {
  avatarImg: avatar1,
}
patientStore.loadPatient(patientId);
let path  = route.path;
const segments = path.split("/");
followUpStore.json_data.type = segments[3];
const accountDataLocal = ref(structuredClone(accountData))
const refInputEl = ref()
const ImageBase64 = ref();
const prescription = ref('');
const changeAvatar = file => {
  const fileReader = new FileReader()
  const { files } = file.target
  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        accountDataLocal.value.avatarImg = fileReader.result
        followUpStore.annontableImage = fileReader.result
      }
      ImageBase64.value = fileReader.result.split(',')[1];
      annontableImage.value = files[0]
      // temData['custom_annotable_image'] = ImageBase64.value

    }
  }
}







const validationErrors = ref([]);

const validateVitalData = () => {
  validationErrors.value = [];
  console.log(followUpStore.json_data.vital.weight_lbs.trim())
  // Example validation rules  
  if (!followUpStore.json_data.vital.weight_lbs.trim()) {
    validationErrors.value.push("Weight (lbs) is required.");
  }

  if (!followUpStore.json_data.vital.height_ft.trim()) {
    validationErrors.value.push("Height in feet must be a number.");
  }
  if (!followUpStore.json_data.vital.weight_oz.trim()) {
    validationErrors.value.push("Height in feet must be a number.");
  }
  if (!followUpStore.json_data.vital.temperature.trim()) {
    validationErrors.value.push("Temperature is required.");
  }
  if (!followUpStore.json_data.vital.height_ft.trim()) {
    validationErrors.value.push("Height Feet is required.");
  }
  if (!followUpStore.json_data.vital.height_in.trim()) {
    validationErrors.value.push("Height Inch is required.");
  }
  if (!followUpStore.json_data.vital.bmi.trim()) {
    validationErrors.value.push("BMI is required.");
  }
  if (!followUpStore.json_data.vital.blood_presssure.trim()) {
    validationErrors.value.push("Blood Pressure (Systolic) mmHg is required.");
  }
  if (!followUpStore.json_data.vital.diastolic.trim()) {
    validationErrors.value.push("(Diastolic) mmHg is required.");
  }
  if (!followUpStore.json_data.vital.respiratory_rate.trim()) {
    validationErrors.value.push("(Respiratory Rate (RPM) is required.");
  }
  if (!followUpStore.json_data.vital.pulse.trim()) {
    validationErrors.value.push("(Pulse (BPM) is required.");
  }
  if (!followUpStore.json_data.vital.bloodSugar.trim()) {
    validationErrors.value.push("(Blood Sugar is required.");
  }
  if (!followUpStore.json_data.vital.fasting.trim()) {
    validationErrors.value.push("Fasting is required.");
  }
  if (!followUpStore.json_data.vital.saturation.trim()) {
    validationErrors.value.push("O2 Saturation is required.");
  }
   return validationErrors.value.length === 0;
};



const submitForm = async () => {
  if (validateVitalData()) { 
  let res = followUpStore.saveClinicalData(patientStore.patient.id)
  console.log("res", patientStore.patient, patientStore.patient.id);
    return res;
  }
  
}

const addRow = () => {
  followUpStore.json_data.planPractioner.prescriptions.push({
    formula: '',
    beforeBreakfast: '',
    breakfast: '',
    beforeLunch: '',
    lunch: '',
    beforeDinner: '',
    dinner: '',
    beforeSleep: '',
    notes: '',
    rx: '',
  });
};

const removeRow = (index) => {
  followUpStore.json_data.planPractioner.prescriptions.splice(index, 1);
};

const copyToAll = () => {
  const firstRow = followUpStore.json_data.planPractioner.prescriptions[0];
  followUpStore.json_data.planPractioner.prescriptions.forEach((item, index) => {
    if (index !== 0) {
      item.beforeBreakfast = firstRow.beforeBreakfast;
      item.breakfast = firstRow.breakfast;
      item.beforeLunch = firstRow.beforeLunch;
      item.lunch = firstRow.lunch;
      item.beforeDinner = firstRow.beforeDinner;
      item.dinner = firstRow.dinner;
      item.beforeSleep = firstRow.beforeSleep;
      item.notes = firstRow.notes;
      item.rx = firstRow.rx;
    }
  });
};
  
</script>

<template>



  <VRow>
    <VCol cols="12" md="5" lg="3">
      <UserBioPanel :patient="patientStore.patient" />
    </VCol>

    <VCol cols="12" md="7" lg="9">
      <div v-if="validationErrors.length > 0" style="color: red;">
        <h3>Validation Errors:</h3>
        <ul>
          <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
        </ul>
      </div>
      <VExpansionPanels>
        <VExpansionPanel elevation="0">
          <VExpansionPanelTitle collapse-icon="tabler-minus" expand-icon="tabler-plus">
            Vitals
          </VExpansionPanelTitle>
          <VExpansionPanelText>

            <AddVital ref="childRef" />

          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel elevation="0"
          v-if="followUpStore.json_data.type == 'new-initial-consult' || followUpStore.json_data.type == 'new-follow-up'">
          <VExpansionPanelTitle collapse-icon="tabler-minus" expand-icon="tabler-plus">
            Subjective Notes
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <TiptapEditor v-model="followUpStore.json_data.vital.subjective_notes" class="border rounded" :rules="[requiredValidator]" />
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel elevation="0"
          v-if="followUpStore.json_data.type == 'new-initial-consult' || followUpStore.json_data.type == 'new-follow-up'">
          <VExpansionPanelTitle collapse-icon="tabler-minus" expand-icon="tabler-plus">
            Objective notes
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <TiptapEditor v-model="followUpStore.json_data.otherData.objectiveNotes" class="border rounded" :rules="[requiredValidator]" />
          </VExpansionPanelText>
        </VExpansionPanel>
        <VExpansionPanel elevation="0" v-if="followUpStore.json_data.type == 'new-basic-notes'">
          <VExpansionPanelTitle collapse-icon="tabler-minus" expand-icon="tabler-plus">
            General notes
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <TiptapEditor v-model="followUpStore.json_data.otherData.generalNotes" class="border rounded" :rules="[requiredValidator]" />
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel elevation="0">
          <VExpansionPanelTitle collapse-icon="tabler-minus" expand-icon="tabler-plus">
            Custom Annotable Image
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <div class="d-flex mb-10">


              <VAvatar rounded size="100" class="me-6" :image="accountDataLocal.avatarImg" />

              <!-- 👉 Upload Photo -->
              <form class="d-flex flex-column justify-center gap-4">
                <div class="d-flex flex-wrap gap-4">
                  <VBtn color="primary" @click="refInputEl?.click()">
                    <VIcon icon="ri-upload-cloud-line" class="d-sm-none" />
                    <span class="d-none d-sm-block">Upload Logo</span>
                  </VBtn>
                  <input ref="refInputEl" type="file" name="file" accept=".jpeg,.png,.jpg,GIF" hidden
                    @input="changeAvatar">
                </div>
                <p class="text-body-1 mb-0">
                  Allowed JPG, GIF or PNG. Max size of 800K
                </p>
              </form>
            </div>

          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel elevation="0">
          <VExpansionPanelTitle collapse-icon="tabler-minus" expand-icon="tabler-plus">
            Assessment/Diagnosis & Services
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <TiptapEditor v-model="followUpStore.json_data.otherData.assesmentDiagonist" class="border rounded"
              :rules="[requiredValidator]" />
          </VExpansionPanelText>
        </VExpansionPanel>
        <VExpansionPanel elevation="0">
          <VExpansionPanelTitle collapse-icon="tabler-minus" expand-icon="tabler-plus">
            Plan (Practitioner Recommendations)
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <TiptapEditor v-model="followUpStore.json_data.planPractioner.note" class="border rounded"
              :rules="[requiredValidator]" />
            <PerfectScrollbar :options="{ wheelPropagation: false }">
              <v-container>


                <v-row style="margin-bottom: 10px;">
                  <v-col cols="1">
                    <v-icon @click="addRow" style="cursor: pointer;">tabler-plus</v-icon>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Add Prescription/Supplements" v-model="prescription" />
                  </v-col>
                </v-row>




                <v-table>
                  <thead>
                    <tr>
                      <th>Rmove</th> <!-- Checkbox column -->
                      <th>Prescription Formula/Herb</th>
                      <th>Before Breakfast</th>
                      <th>Breakfast</th>
                      <th>Before Lunch</th>
                      <th>Lunch</th>
                      <th>Before Dinner</th>
                      <th>Dinner</th>
                      <th>Before Sleep</th>
                      <th>Notes</th>
                      <th>Rx</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in followUpStore.json_data.planPractioner.prescriptions" :key="index">
                      <td>
                        <VIcon icon="tabler-trash" @click="removeRow(index)" />
                      </td>
                      <td>
                        <v-text-field v-model="item.formula" />
                      </td>
                      <td>
                        <v-text-field v-model="item.beforeBreakfast" />
                      </td>
                      <td>
                        <v-text-field v-model="item.breakfast" />
                      </td>
                      <td>
                        <v-text-field v-model="item.beforeLunch" />
                      </td>
                      <td>
                        <v-text-field v-model="item.lunch" />
                      </td>
                      <td>
                        <v-text-field v-model="item.beforeDinner" />
                      </td>
                      <td>
                        <v-text-field v-model="item.dinner" />
                      </td>
                      <td>
                        <v-text-field v-model="item.beforeSleep" />
                      </td>
                      <td>
                        <v-text-field v-model="item.notes" />
                      </td>
                      <td>
                        <v-checkbox v-model="item.rx" />
                      </td>

                    </tr>
                  </tbody>
                </v-table>


                <v-col style="display: none;">
                  <v-btn @click="copyToAll">Copy 1 Days To All Empty</v-btn>
                </v-col>
                <v-col cols="4">
                  <v-select v-model="followUpStore.json_data.planPractioner.returnToClinic"
                    :items="followUpStore.returnOptions" label="Return to clinic" />
                </v-col>


              </v-container>
            </PerfectScrollbar>

          </VExpansionPanelText>
        </VExpansionPanel>
        <VExpansionPanel elevation="0"
          v-if="followUpStore.json_data.type == 'new-initial-consult' || followUpStore.json_data.type == 'new-follow-up'">
          <VExpansionPanelTitle collapse-icon="tabler-minus" expand-icon="tabler-plus">
            Practitioner Notes (Private)
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <TiptapEditor v-model="followUpStore.json_data.otherData.practitionerNotes" class="border rounded" :rules="[requiredValidator]"
              @input="handleInput($event, 'practitionerNotes')" />
          </VExpansionPanelText>
        </VExpansionPanel>

      </VExpansionPanels>
      <VCol cols="12">
        <VBtn @click="submitForm" class="me-3">
          Save
        </VBtn>
        <VBtn type="reset" variant="tonal" color="error" class="ml-3" @click="closeNavigationDrawer">
          Close
        </VBtn>
      </VCol>
    </VCol>

  </VRow>






</template>
<style scoped>
.table-container {
  max-height: 400px;
  /* Set a maximum height for the table */
  overflow-y: auto;
  /* Enable vertical scrolling */
  border: 1px solid #e0e0e0;
  /* Add a border around the table */
  border-radius: 8px;
  /* Rounded corners */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  /* Subtle shadow for depth */
}

.v-table {
  width: 100%;
  /* Full width */
  border-collapse: collapse;
  /* Remove gaps between cells */
}

.v-table th,
.v-table td {
  padding: 12px;
  /* Add padding for better spacing */
  text-align: left;
  /* Align text to the left */
}

.v-table th {
  background-color: #f5f5f5;
  /* Light background for headers */
  font-weight: bold;
  /* Bold text for headers */
  border-bottom: 2px solid #e0e0e0;
  /* Bottom border for headers */
}

.v-table tr:nth-child(even) {
  background-color: #f9f9f9;
  /* Zebra striping for rows */
}

.v-table tr:hover {
  background-color: #f1f1f1;
  /* Highlight row on hover */
}
</style>
