<script setup>
import { useStore } from 'vuex';
const store = useStore()
const isLoading = ref(false)
const isFormValid = ref(false)
const content = ref('');
const refForm = ref()
const weight_lbs = ref();
const weight_oz = ref();
const temperature = ref();
const height_ft = ref();
const height_in = ref();
const ibm = ref();
const blood_presssure = ref();
const diastolic = ref();
const respiratory_rate = ref();
const pulse = ref();
const bloodSugar = ref();

const fasting = ref();
const saturation = ref();
const headCircumference_in = ref();
const neck_in = ref();
const shoulders_in = ref();
const chest_in = ref();
const waist_in = ref();
const hips_in = ref();
const lean_body_mass_lbs = ref();
const left_forearm_in = ref();
const left_wrist_in = ref();


const right_forearm_in = ref();
const right_wrist_in = ref();
const left_bicep_in = ref();
const right_bicep_in = ref();
const left_thigh_in = ref();
const right_thigh_in = ref();
const left_calf_in = ref();
const right_calf_in = ref();
const body_fat = ref();
const estimation_calculation = ref();
const activity_level = ref();


const hip_to_waist = ref();
const resting_metabolic_rate_kcal = ref();
const with_activity_metabolic_rate_kcal = ref();
const fluid = ref();
const fluid_oz = ref();
const protein = ref();
const protein_gms = ref();
const protein_bmi = ref();
const frame = ref();
const ideal_body_weight_lbs = ref();
const ibw_percentage = ref();

const adjusted_body_weight_abw_lbs = ref();
const recommendation_weight = ref();
const notes = ref();
const subjective_notes = ref();
const today = ref(new Date());



const isTextMessageDialogVisible = ref(true);
const closeNavigationDrawer = () => {
    isTextMessageDialogVisible.value = false;  
}

const editorInit = ref({
  height: 500,
  menubar: false,
  plugins: 'link image code',
  toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | code'
});
const emit = defineEmits([
  'update:isDrawerOpen',
])

const onSubmit = async() => {
  isLoading.value = true
  refForm.value?.validate().then(async({ valid }) => {
    if (valid) {
    //   console.log('lastnae',lastName.value);
      
      emit('addVital', {
        id: store.getters.getPatientPorfile.patientId,
        vitals:[
          ...store.getters.getPatientPorfile.vitals,
          {
            provider:'Zeeshan Anjum',
            created_date:today.value,
            weight_lbs: weight_lbs.value,
            weight_oz: weight_oz.value,
            temperature: temperature.value,
            height_ft:height_ft.value,
            height_in: height_in.value,
            ibm: ibm.value,
            blood_presssure:blood_presssure.value,
            diastolic:diastolic.value,
            respiratory_rate:respiratory_rate.value,
            pulse:pulse.value,
            bloodSugar:bloodSugar.value,
            fasting:fasting.value,
            saturation:saturation.value,
            headCircumference_in:headCircumference_in.value,
            neck_in: neck_in.value,
            shoulders_in: shoulders_in.value,
            chest_in: chest_in.value,
            waist_in:waist_in.value,
            hips_in: hips_in.value,
            lean_body_mass_lbs: lean_body_mass_lbs.value,
            left_forearm_in:left_forearm_in.value,
            left_wrist_in:left_wrist_in.value,
            right_forearm_in:right_forearm_in.value,
            right_wrist_in:right_wrist_in.value,
            left_bicep_in:left_bicep_in.value,
            right_bicep_in:right_bicep_in.value,
            left_thigh_in:left_thigh_in.value,
            right_thigh_in:right_thigh_in.value,
            left_calf_in: left_calf_in.value,
            right_calf_in: right_calf_in.value,
            body_fat: body_fat.value,
            activity_level:activity_level.value,
            hip_to_waist: hip_to_waist.value,
            resting_metabolic_rate_kcal: resting_metabolic_rate_kcal.value,
            with_activity_metabolic_rate_kcal:with_activity_metabolic_rate_kcal.value,
            fluid:fluid.value,
            fluid_oz:fluid_oz.value,
            protein:protein.value,
            protein_gms:protein_gms.value,
            protein_bmi:protein_bmi.value,
            frame:frame.value,
            ideal_body_weight_lbs:ideal_body_weight_lbs.value,
            ibw_percentage: ibw_percentage.value,
            adjusted_body_weight_abw_lbs: adjusted_body_weight_abw_lbs.value,
            recommendation_weight: recommendation_weight.value,
            notes:notes.value,
            subjective_notes: subjective_notes.value,
        }
          
      ]
        
      })
        isLoading.value = false;
        nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
        closeNavigationDrawer();  
        })
    }else{
        
      isLoading.value = false;
    }
  })
  
}
</script>
<template>
            <VForm
                ref="refForm"
                v-model="isFormValid"
            >
            <VRow>
              <VCol cols="4">
                <AppTextField
                  v-model="weight_lbs"
                  
                  label="Weight (lbs)"
                  placeholder="Weight (lbs)"
                 
                  
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="weight_oz"
                  
                  label="Weight(oz)"
                  placeholder="Weight (oz)"
                />
                </VCol>

                <VCol cols="4">
                <AppTextField
                  v-model="temperature"
                  
                  label="Temperature(F)"
                  placeholder="Temperature(F)"
                  
                  
                />
                </VCol>
                
                <VCol cols="4">
                <AppTextField
                  v-model="height_ft"
                  
                  label="Height (ft)"
                  placeholder="Height (ft)"
                  
                  
                />
                </VCol>
                <VCol cols="4">
                <AppTextField
                  v-model="height_in"
                  
                  label="Height (in)"
                  placeholder="Height (in)"
                  
                  
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="ibm"
                  
                  label="Respiratory Rate (RPM)"
                  placeholder="BMI"
                  
                  
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="blood_presssure"
                  
                  label="Blood Pressure (Systolic) mmHg"
                  placeholder="Blood Pressure (Systolic) mmHg"
                  
                  
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="diastolic"
                  
                  label="(Diastolic) mmHg"
                  placeholder="(Diastolic) mmHg"
                  
                  
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="respiratory_rate"
                  
                  label="Respiratory Rate (RPM)"
                  placeholder="Respiratory Rate (RPM)"
                  
                  
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="pulse"
                  
                  label="Pulse (BPM)"
                  placeholder="Pulse (BPM)"
                  
                  
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="bloodSugar"
                  
                  label="Blood Sugar"
                  placeholder="Blood Sugar"
                  
                  
                />
              </VCol>
                <VCol cols="6">
                <AppSelect
                    v-model="fasting"
                    
                    label="Fasting"
                    placeholder="Fasting"
                   :items="['Fasting', 'Non-Fasting']"
                  
                />
              
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="saturation"
                  
                  label="O2 Saturation"
                  placeholder="O2 Saturation"
                  
                  
                />
              </VCol>
             
              <VCol cols="4">
                <AppTextField
                  v-model="headCircumference_in"
                  label="Head Circumference (In)"
                  placeholder="Head Circumference"
                />
              </VCol>

              <VCol cols="4">
                <AppTextField
                  v-model="neck_in"
                  label="Neck (In)"
                  placeholder="Neck"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="shoulders_in"
                  label="Shoulders (In)"
                  placeholder="Shoulders"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="chest_in"
                  label="Chest (In)"
                  placeholder="Chest"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="waist_in"
                  label="Waist (In)"
                  placeholder="Waist"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="hips_in"
                  label="Hips (In)"
                  placeholder="Hips"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="lean_body_mass_lbs"
                  label="Lean Body Mass (Lbs)"
                  placeholder="Lean Body Mass (Lbs)"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="left_forearm_in"
                  label="Left Forearm (In)"
                  placeholder="Left Forearm"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="left_wrist_in"
                  label="Left Wrist (In)"
                  placeholder="Left Wrist (In)"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="right_forearm_in"
                  label="Right Forearm (In)"
                  placeholder="Right Forearm"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="right_wrist_in"
                  label="Right Wrist (In)"
                  placeholder="Right Wrist"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="left_bicep_in"
                  label="Left Bicep (In)"
                  placeholder="Left Bicep"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="right_bicep_in"
                  label="Right Bicep (In)"
                  placeholder="Right Bicep"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="left_thigh_in"
                  label="Left Thigh (In)"
                  placeholder="Left Thigh"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="right_thigh_in"
                  label="Right Thigh (In)"
                  placeholder="Right Thigh"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="left_calf_in"
                  label="Left Calf (In)"
                  placeholder="Left Calf"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="right_calf_in"
                  label="Right Calf (In)"
                  placeholder="Right Calf"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="body_fat"
                  label="Body Fat (%)"
                  placeholder="Body Fat"
                />
              </VCol>
              <VCol cols="12" class="py-0"> Estimation (ADIME)Calculate </VCol>
              <VCol cols="6">
                <AppSelect
                    v-model="activity_level"
                    
                    label="Activity Level"
                    placeholder="Activity Level"
                   :items="['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extremely Active']"
                  
                />
              
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="hip_to_waist"
                  label="Hip To Waist"
                  placeholder="Hip To Waist"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="resting_metabolic_rate_kcal"
                  label="Resting Metabolic Rate (kcal)"
                  placeholder="Resting Metabolic Rate"
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="with_activity_metabolic_rate_kcal"
                  label="With Activity Metabolic Rate (kcal)"
                  placeholder="With Activity Metabolic Rate"
                />
              </VCol>
              <VCol cols="6">
                <AppSelect
                    v-model="fluid"
                    
                    label="Fluid"
                    placeholder="Fluid"
                   :items="['x25', 'x27.5', 'x30']"
                />
                </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="fluid_oz"
                  label="Fluid (oz)"
                  placeholder="Fluid (oz)"
                />
              </VCol>

              <VCol cols="4">
                <AppSelect
                    v-model="protein"
                    
                    label="Protein"
                    placeholder="Protein"
                   :items="['x0.8', 'x0.9', 'x1.0']"
                />
                </VCol>

              <VCol cols="4">
                <AppTextField
                  v-model="protein_gms"
                  label="Protein (gms)"
                  placeholder="Protein (gms)"
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="protein_bmi"
                  label="BMI"
                  placeholder="BMI"
                  readnly
                />
              </VCol>

              <VCol cols="4">
                <AppSelect
                    v-model="frame"
                    
                    label="Frame"
                    placeholder="Frame"
                   :items="['normal', 'small', 'large']"
                />
                </VCol>

                <VCol cols="4">
                <AppTextField
                  v-model="ideal_body_weight_lbs"
                  label="Ideal Body Weight (lbs)"
                  placeholder="Ideal Body Weight "
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="ibw_percentage"
                  label="BW %"
                  placeholder="BW %"
                  readnly
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="adjusted_body_weight_abw_lbs"
                  label="Adjusted Body Weight- ABW"
                  placeholder="Adjusted Body Weight- ABW"
                  readnly
                />
              </VCol>
              
              <VCol cols="6">
                <AppSelect
                    v-model="recommendation_weight"
                    
                    label="Recommendation Weight"
                    placeholder="Recommendation Weight"
                   :items="['Use Actual', 'Use Adjusted']"
                />
                </VCol>
                <VCol cols="12">
                <v-textarea
                  v-model="notes"
                  label="Notes"
                  
                  rows="5"
                  placeholder="Notes"
                />
                </VCol>
                <VCol cols="12">Subjective Notes</VCol>
                <VCol cols="6">
                    <VBtn> SOAP Templates</VBtn>
                </VCol>
                <VCol cols="12">
                    <AppSelect
                    v-model="due_datesdasd"
                    
                    label="Categorize Templates"
                    placeholder="Categorize Templates"
                   :items="['AESTH_Injectables Note (Dermal filler; Neuromodulator)',
                         'AESTH_Laser, RF, and DG therapy',
                         'AESTH_Low Level Laser',
                         'IV_IV Therapy Note (SOAP)',
                         'WL_SOAP Note Wellness for PLAN',
                         'WL_Weight Loss Progress Note (short)'
                         ]"
                />
                </VCol>
                <VCol cols="12">
                    <!-- <Editor v-model="content" :init="editorInit"></Editor> -->
                <v-textarea
                  v-model="subjective_notes"
                  label="Editor Text" 
                  
                  rows="5"
                  placeholder="Editor Text"
                />
                </VCol>
                <VCol cols="12">
                <VBtn
                  @click="onSubmit"
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
            </VRow>
        </VForm>        
         
</template>
