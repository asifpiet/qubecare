<script setup>


import UserBioPanel from '@/views/apps/patient/view/UserBioPanel.vue';
import AddVital from '@/views/apps/patient/vitals/addvitalClicnical.vue';

import { useStore } from 'vuex';
const currentTab = ref('item-1')
const tabItemContent = 'Candy canes donut chupa chups candy canes lemon drops oat cake wafer. Cotton candy candy canes marzipan carrot cake. Sesame snaps lemon drops candy marzipan donut brownie tootsie roll. Icing croissant bonbon biscuit gummi bears. Pudding candy canes sugar plum cookie chocolate cake powder croissant.'
const userData = ref()
// 
import avatar1 from '@images/avatars/avatar-1.png';
const subjectNotes = ref('')
const objectNotes = ref('') 
const annontableImage = ref('') 
const assesmentDiagonist = ref('') 
const planPractioner = ref('') 
const practitionerNotes = ref('') 
const refForm = ref()
const store = useStore()
// const userData = ref(null);
const route = useRoute()
const userTab = ref(null)
const isLoading = ref(null)
const isTonalSnackbarVisible = ref(null)
const childRef = ref(null); 
const generalNotes = ref(null); 
const formValue = ref({}); 
const accountData = {
  avatarImg: avatar1,

}
const puuid =ref()
const panelOpen = ref(false); 
const vitalData =ref({
  provider: '',
    provider_id:'',
    weight_lbs: '',
    weight_oz: '',
    temperature: '',
    height_ft: '',
    height_in: '',
    bmi: '',
    blood_presssure: '',
    diastolic: '',
    respiratory_rate: '',
    pulse: '',
    bloodSugar: '',
    fasting: '',
    saturation: '',
    headCircumference_in: '',
    neck_in: '',
    shoulders_in: '',
    chest_in: '',
    waist_in: '',
    hips_in: '',
    lean_body_mass_lbs: '',
    left_forearm_in: '',
    left_wrist_in: '',
    right_forearm_in: '',
    right_wrist_in: '',
    left_bicep_in: '',
    right_bicep_in: '',
    left_thigh_in: '',
    right_thigh_in: '',
    left_calf_in: '',
    right_calf_in: '',
    body_fat: '',
    activity_level: '',
    hip_to_waist: '',
    resting_metabolic_rate_kcal: '',
    with_activity_metabolic_rate_kcal: '',
    fluid: '',
    fluid_oz: '',
    protein: '',
    protein_gms: '',
    protein_bmi: '',
    frame: '',
    ideal_body_weight_lbs: '',
    ibw_percentage: '',
    adjusted_body_weight_abw_lbs: '',
    recommendation_weight: '',
    notes: '',
    subjective_notes: '',
    due_datesdasd: '',
    catagri_template: '',
})
const accountDataLocal = ref(structuredClone(accountData))
const refInputEl = ref()
const ImageBase64 = ref();
const prescription = ref('');  
const returnToClinic = ref(null);  
const returnOptions = ['1Wk', '2Wks', '3Wks', '1Mth', '2Mths', '3Mths', '4Mths', '5Mths', '6Mths']; 
const prescriptions = reactive([  
  {  
    formula: null,  
    beforeBreakfast: null,  
    breakfast: null,  
    beforeLunch: null,  
    lunch: null,  
    beforeDinner: null,  
    dinner: null,  
    beforeSleep: null,  
    notes: null,  
    rx: null,  
  },  
]);  
let temData=store.getters.getVitalClinic
const changeAvatar = file => {
  const fileReader = new FileReader()
  const { files } = file.target
  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        accountDataLocal.value.avatarImg = fileReader.result
      }
      ImageBase64.value = fileReader.result.split(',')[1];
      annontableImage.value = files[0]
        temData['custom_annotable_image'] = ImageBase64.value
     
    }
  }
}

const getDashboardData = async() => {
  isLoading.value = true
  await store.dispatch('editPatientProfile', {
    id:route.params.id
  })
  userData.value = store.getters.getPatientPorfile;
  isLoading.value = false
}


const items = ref([  
      { title: '1', content: 'Sweet roll ice cream chocolate bar...' },  
      { title: '2', content: 'Ice cream croissant sugar plum...' },  
      { title: '3', content: 'I love cupcake gingerbread...' },  
      { title: '4', content: 'Bonbon tart caramels marshmallow...' },  
    ]);  

// const { data: userData } = await useApi(`${PATIENT_API}/${ route.params.id }`)
const datasave = computed(async() => {
  
  isLoading.value = true
 
  await store.dispatch('editPatientProfile', {
    id:route.params.id
  })
  userData.value = store.getters.getPatientPorfile;
  isLoading.value = false

  return true;
})



const validationErrors = ref([]);  

const validateVitalData = () => {  
  validationErrors.value = [];  
console.log(vitalData.value.weight_lbs.trim())
  // Example validation rules  
  if (!vitalData.value.weight_lbs.trim()) {  
      validationErrors.value.push("Weight (lbs) is required.");  
  }  
  
  if (!vitalData.value.height_ft.trim()) {  
      validationErrors.value.push("Height in feet must be a number.");  
  } 
  if (!vitalData.value.weight_oz.trim()) {  
      validationErrors.value.push("Height in feet must be a number.");  
  }  
  if (!vitalData.value.temperature.trim()) {  
      validationErrors.value.push("Temperature is required.");  
  }   
  if (!vitalData.value.height_ft.trim()) {  
      validationErrors.value.push("Height Feet is required.");  
  } 
  if (!vitalData.value.height_in.trim()) {  
      validationErrors.value.push("Height Inch is required.");  
  } 
  if (!vitalData.value.bmi.trim()) {  
      validationErrors.value.push("BMI is required.");  
  } 
  if (!vitalData.value.blood_presssure.trim()) {  
      validationErrors.value.push("Blood Pressure (Systolic) mmHg is required.");  
  } 
  if (!vitalData.value.diastolic.trim()) {  
      validationErrors.value.push("(Diastolic) mmHg is required.");  
  }
  if (!vitalData.value.respiratory_rate.trim()) {  
      validationErrors.value.push("(Respiratory Rate (RPM) is required.");  
  }  
  if (!vitalData.value.pulse.trim()) {  
      validationErrors.value.push("(Pulse (BPM) is required.");  
  } 
  if (!vitalData.value.bloodSugar.trim()) {  
      validationErrors.value.push("(Blood Sugar is required.");  
  } 
  if (!vitalData.value.fasting.trim()) {  
      validationErrors.value.push("Fasting is required.");  
  } 
  if (!vitalData.value.saturation.trim()) {  
      validationErrors.value.push("O2 Saturation is required.");  
  } 
 
  // Add more validation rules as needed...  
  
  
  
  // Return if any errors were found  
  return validationErrors.value.length === 0;  
};  


// Method for the parent's submit button  
const submitForm = async () => { 
  console.log('Submitting:', prescriptions, returnToClinic.value); 
  console.log(vitalData.value) 
  console.log(objectNotes.value) 
  console.log(annontableImage.value) 
  console.log(assesmentDiagonist.value)
  console.log(planPractioner.value)
  console.log(practitionerNotes.value)
  let ortherdata = {}
  ortherdata.objectiveNotes =objectNotes.value
  //ortherdata.annontableImage = annontableImage.value
  ortherdata.assesmentDiagonist = assesmentDiagonist.value
  //ortherdata.planPractioner = planPractioner.value
  ortherdata.practitionerNotes = practitionerNotes.value
  ortherdata.generalNotes = generalNotes.value
  
  let data = {
    type:route.params.type,
    vital: vitalData.value,
    otherData: ortherdata,
    planPractioner: {
      note:planPractioner.value,
      prescriptions: prescriptions,
      returnToClinic:returnToClinic.value
    }
  }
  console.log(data)
  if (childRef.value) {  
    childRef.value.onSubmit(); // Call child onSubmit method  
  
  } 
  if (validateVitalData()) { 
    let uuid = store.getters.getPatientPorfile.uuid 
    
    await store.dispatch('addClinicalRecard',{
         uuid:uuid,
        json_data: JSON.stringify(data),
        annontableImage:annontableImage.value
    });
      
     vitalData.value={}
     objectNotes.value=null
     annontableImage.value=null
     assesmentDiagonist.value=null
     planPractioner.value=null
     practitionerNotes.value = null
   
   
          
         // Here you can call an API or perform another action  
  } 
     
};

onMounted(() => {
  console.log(route)
  const userData = useCookie('userData').value;
  puuid.value = store.getters.getPatientPorfile.uuid
  
  getDashboardData();
});


const updateTags = async patientData => {
  isLoading.value = true;
  console.log("updateNewUser",patientData);
  let uuid =  store.getters.getPatientPorfile.uuid;
  const res = await $api(UPDATE_TAGS_API+'/'+uuid, {
      method: 'POST',
      body: patientData,
    });
    console.log("res",res);

  if(res){
    getDashboardData();
  }  
}

const updatePatient = async patientData => {
  isLoading.value = true;
  console.log("updateNewUser",patientData);
  let uuid =  store.getters.getPatientPorfile.uuid;
  
  const res = await $api(UPDATE_PATIENT_API+'/'+uuid, {
      method: 'POST',
      body: patientData,
  });
  
  
  console.log("res",res);

  if(res){
    isTonalSnackbarVisible.value = true;
    getDashboardData();
  }
  
  isLoading.value =false;
  isTonalSnackbarVisible.value = true;
}
const searchBenefits = () => {  
  // Implement search functionality  
};  

const addRow = () => {  
  prescriptions.push({  
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
  prescriptions.splice(index, 1);  
};  

const copyToAll = () => {  
  const firstRow = prescriptions[0];  
  prescriptions.forEach((item, index) => {  
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

const submit = () => {  
  // Implement form submission logic  
 
};  
</script>

<template>

  
  
    <VRow v-if="userData">
      <VCol
        cols="12"
        md="5"
        lg="3"
      >
        <UserBioPanel :user-data="userData" 
          @patientData="updatePatient"
          @patientTags="updateTags"
        
        />
      </VCol>

      <VCol
        cols="12"
        md="7"
        lg="9"
      >
      <div v-if="validationErrors.length > 0" style="color: red;">  
        <h3>Validation Errors:</h3>  
        <ul>  
          <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>  
        </ul>  
      </div>  
      <VExpansionPanels>  
          <VExpansionPanel   elevation="0" >  
            <VExpansionPanelTitle collapse-icon="tabler-minus" expand-icon="tabler-plus">  
              Vitals
            </VExpansionPanelTitle>  
            <VExpansionPanelText>  
              
              <AddVital   :vitalData="vitalData" ref="childRef"/>
          
            </VExpansionPanelText>  
          </VExpansionPanel>  

          <VExpansionPanel elevation="0" v-if="route.params.type=='new-initial-consult' || route.params.type=='new-follow-up'">  
            <VExpansionPanelTitle collapse-icon="tabler-minus" expand-icon="tabler-plus">  
              Subjective Notes
            </VExpansionPanelTitle>  
            <VExpansionPanelText>  
              <TiptapEditor
                v-model="vitalData.subjective_notes"
                class="border rounded"
                :rules="[requiredValidator]"
               
              /> 
             </VExpansionPanelText>  
          </VExpansionPanel>   
        
          <VExpansionPanel elevation="0" v-if="route.params.type=='new-initial-consult' || route.params.type=='new-follow-up'">  
            <VExpansionPanelTitle collapse-icon="tabler-minus" expand-icon="tabler-plus">  
              Objective notes
            </VExpansionPanelTitle>  
            <VExpansionPanelText>  
              <TiptapEditor
                v-model="objectNotes"
                class="border rounded"
                :rules="[requiredValidator]" 
            
              /> 
            </VExpansionPanelText>  
          </VExpansionPanel> 
          <VExpansionPanel elevation="0" v-if="route.params.type=='new-basic-notes'">  
            <VExpansionPanelTitle collapse-icon="tabler-minus" expand-icon="tabler-plus">  
              General notes
            </VExpansionPanelTitle>  
            <VExpansionPanelText>  
              <TiptapEditor
                v-model="generalNotes"
                class="border rounded"
                :rules="[requiredValidator]" 
              
              /> 
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
              <TiptapEditor
                v-model="assesmentDiagonist"
                class="border rounded"
                :rules="[requiredValidator]" 
           
              /> 
            </VExpansionPanelText>  
          </VExpansionPanel>  
          <VExpansionPanel elevation="0">  
            <VExpansionPanelTitle collapse-icon="tabler-minus" expand-icon="tabler-plus">  
              Plan (Practitioner Recommendations)
            </VExpansionPanelTitle>  
            <VExpansionPanelText>  
              <TiptapEditor
                v-model="planPractioner"
                class="border rounded"
                :rules="[requiredValidator]" 
           
              /> 
              <PerfectScrollbar :options="{ wheelPropagation: false }">
                <v-container>  
            
                  
                  <v-row style="margin-bottom: 10px;" > 
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
                            <tr v-for="(item, index) in prescriptions" :key="index">  
                              <td>  
                              <VIcon icon="tabler-trash" @click="removeRow(index)"/>
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
                        <v-select  
                          v-model="returnToClinic"  
                          :items="returnOptions"  
                          label="Return to clinic"  
                        />  
                      </v-col>  
                

                </v-container>  
              </PerfectScrollbar>
             
            </VExpansionPanelText>  
          </VExpansionPanel> 
          <VExpansionPanel elevation="0" v-if="route.params.type=='new-initial-consult' || route.params.type=='new-follow-up'">  
            <VExpansionPanelTitle collapse-icon="tabler-minus" expand-icon="tabler-plus">  
              Practitioner Notes (Private)
            </VExpansionPanelTitle>  
            <VExpansionPanelText>  
              <TiptapEditor
                v-model="practitionerNotes"
                class="border rounded"
                :rules="[requiredValidator]"
                @input="handleInput($event,'practitionerNotes')"  
              /> 
            </VExpansionPanelText>  
          </VExpansionPanel>
          
        </VExpansionPanels>
          <VCol cols="12">
                    <VBtn
                      @click="submitForm"
                    class="me-3"
                    
                    >
                    Save
                    </VBtn>
                    <VBtn
                      type="reset"
                      variant="tonal"
                      color="error"
                      class="ml-3"
                      @click="closeNavigationDrawer"
                    >
                    Close
                    </VBtn>
            </VCol>
      </VCol>
          
    </VRow>






</template>
<style scoped>
.table-container {  
  max-height: 400px; /* Set a maximum height for the table */  
  overflow-y: auto; /* Enable vertical scrolling */  
  border: 1px solid #e0e0e0; /* Add a border around the table */  
  border-radius: 8px; /* Rounded corners */  
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */  
}  

.v-table {  
  width: 100%; /* Full width */  
  border-collapse: collapse; /* Remove gaps between cells */  
}  

.v-table th, .v-table td {  
  padding: 12px; /* Add padding for better spacing */  
  text-align: left; /* Align text to the left */  
}  

.v-table th {  
  background-color: #f5f5f5; /* Light background for headers */  
  font-weight: bold; /* Bold text for headers */  
  border-bottom: 2px solid #e0e0e0; /* Bottom border for headers */  
}  

.v-table tr:nth-child(even) {  
  background-color: #f9f9f9; /* Zebra striping for rows */  
}  

.v-table tr:hover {  
  background-color: #f1f1f1; /* Highlight row on hover */  
}  
</style>
