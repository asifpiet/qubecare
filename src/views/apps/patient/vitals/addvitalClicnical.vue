<script setup>
import { defineExpose, ref } from 'vue';
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

const due_datesdasd = ref();
const providerName = ref();
const vitalData =ref({
    provider: '',
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
const isTextMessageDialogVisible = ref(true);
const props = defineProps({
    vitalData: {
    type: Object,
    required: true,
  }
});
const localData = ref(props.vitalData);

const editorInit = ref({
  height: 500,
  menubar: false,
  plugins: 'link image code',
  toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | code'
});
const emit = defineEmits([
  'update:isDrawerOpen',
    'addVital'
])
onMounted(() => {
  const userData = useCookie('userData').value;
  console.log('userData',userData)
  providerName.value = userData.fullName
  props.vitalData.provider_id = userData.id
  props.vitalData.provider = userData.fullName
})
// let temData=store.getters.getVitalClinic
// const handleInput = async (newValue,key) => {
//   console.log(newValue.data, key)
//   if (newValue.data) {
//     temData[key] = newValue.data
//   } else {
//     temData[key] = newValue
//   }
  

//   store.dispatch('saveVitalData',temData)
// }
const onSubmit = async() => {
  isLoading.value = true

  refForm.value?.validate().then(async({ valid }) => {
    if (valid) {
    //   console.log('lastnae',lastName.value);
      console.log('test')
     
      emit('addVital', {
       
            provider:providerName.value,
            weight_lbs: props.vitalData.weight_lbs,
            weight_oz: props.vitalData.weight_oz,
            temperature: props.vitalData.temperature,
            height_ft:props.vitalData.height_ft,
            height_in: props.vitalData.height_in,
            bmi: props.vitalData.bmi,
            blood_presssure:props.vitalData.blood_presssure,
            diastolic:props.vitalData.diastolic,
            respiratory_rate:props.vitalData.respiratory_rate,
            pulse:props.vitalData.pulse,
            bloodSugar:props.vitalData.bloodSugar,
            fasting:props.vitalData.fasting,
            saturation:props.vitalData.saturation,
            headCircumference_in:props.vitalData.headCircumference_in,
            neck_in: props.vitalData.neck_in,
            shoulders_in: props.vitalData.shoulders_in,
            chest_in: props.vitalData.chest_in,
            waist_in:props.vitalData.waist_in,
            hips_in: props.vitalData.hips_in,
            lean_body_mass_lbs: props.vitalData.lean_body_mass_lbs,
            left_forearm_in:props.vitalData.left_forearm_in,
            left_wrist_in:props.vitalData.left_wrist_in,
            right_forearm_in:props.vitalData.right_forearm_in,
            right_wrist_in:props.vitalData.right_wrist_in,
            left_bicep_in:props.vitalData.left_bicep_in,
            right_bicep_in:props.vitalData.right_bicep_in,
            left_thigh_in:props.vitalData.left_thigh_in,
            right_thigh_in:props.vitalData.right_thigh_in,
            left_calf_in: props.vitalData.left_calf_in,
            right_calf_in: props.vitalData.right_calf_in,
            body_fat:props.vitalData.body_fat,
            activity_level:props.vitalData.activity_level,
            hip_to_waist: props.vitalData.hip_to_waist,
            resting_metabolic_rate_kcal: props.vitalData.resting_metabolic_rate_kcal,
            with_activity_metabolic_rate_kcal:props.vitalData.with_activity_metabolic_rate_kcal,
            fluid:props.vitalData.fluid,
            fluid_oz:props.vitalData.fluid_oz,
            protein:props.vitalData.protein,
            protein_gms:props.vitalData.protein_gms,
            protein_bmi:props.vitalData.protein_bmi,
            frame:props.vitalData.frame,
            ideal_body_weight_lbs:props.vitalData.ideal_body_weight_lbs,
            ibw_percentage: props.vitalData.ibw_percentage,
            adjusted_body_weight_abw_lbs: props.vitalData.adjusted_body_weight_abw_lbs,
            recommendation_weight: props.vitalData.recommendation_weight,
            notes:props.vitalData.notes,
            subjective_notes: props.vitalData.subjective_notes,
            due_datesdasd:props.vitalData.due_datesdasd,
            catagri_template:props.vitalData.catagri_template
      })
        isLoading.value = false;
        // nextTick(() => {
        // refForm.value?.reset()
        // refForm.value?.resetValidation()
       
        // })
    }else{
        
      isLoading.value = false;
    }
  })

}
defineExpose({  
  onSubmit  
}); 
</script>
<template>
            <VForm
                ref="refForm"
        @submit.prevent="onSubmit"
            >
            <VRow>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.weight_lbs"
                  
                  label="Weight (lbs)"
                  placeholder="Weight (lbs)"
                  :rules="[requiredValidator]"  
          
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.weight_oz"
                  :rules="[requiredValidator]"  
                  label="Weight(oz)"
                  placeholder="Weight (oz)"
 
                />
                </VCol>

                <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.temperature"
                  :rules="[requiredValidator]"  
                  label="Temperature(F)"
                  placeholder="Temperature(F)"
         
                  
                />
                </VCol>
                
                <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.height_ft"
                  :rules="[requiredValidator]"  
                  label="Height (ft)"
                  placeholder="Height (ft)"

                  
                />
                </VCol>
                <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.height_in"
                  :rules="[requiredValidator]"  
                  label="Height (in)"
                  placeholder="Height (in)"
                 
                  
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.bmi"
                  :rules="[requiredValidator]"  
                  label="BMI"
                  placeholder="BMI"
                
                  
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="props.vitalData.blood_presssure"
                  :rules="[requiredValidator]"  
                  label="Blood Pressure (Systolic) mmHg"
                  placeholder="Blood Pressure (Systolic) mmHg"
   
                  
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="props.vitalData.diastolic"
                  :rules="[requiredValidator]"  
                  label="(Diastolic) mmHg"
                  placeholder="(Diastolic) mmHg"
               
                  
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="props.vitalData.respiratory_rate"
                  :rules="[requiredValidator]"  
                  label="Respiratory Rate (RPM)"
                  placeholder="Respiratory Rate (RPM)"
                 
                  
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="props.vitalData.pulse"
                  :rules="[requiredValidator]"  
                  label="Pulse (BPM)"
                  placeholder="Pulse (BPM)"
              
                  
                />
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="props.vitalData.bloodSugar"
                  :rules="[requiredValidator]"  
                  label="Blood Sugar"
                  placeholder="Blood Sugar"
            
                  
                />
              </VCol>
                <VCol cols="6">
                <AppSelect
                    v-model="props.vitalData.fasting"
                    :rules="[requiredValidator]"  
                    label="Fasting"
                    placeholder="Fasting"
                   :items="['Fasting', 'Non-Fasting']"
             
                />
              
              </VCol>
              <VCol cols="6">
                <AppTextField
                  v-model="props.vitalData.saturation"
                  :rules="[requiredValidator]"  
                  label="O2 Saturation"
                  placeholder="O2 Saturation"
          
                  
                />
              </VCol>
             
              <VCol cols="6">
                <AppTextField
                  v-model="props.vitalData.headCircumference_in"
                  label="Head Circumference (In)"
                  placeholder="Head Circumference"
           
                />
              </VCol>

              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.neck_in"
                  label="Neck (In)"
                  placeholder="Neck"
               
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.shoulders_in"
                  label="Shoulders (In)"
                  placeholder="Shoulders"
   
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.chest_in"
                  label="Chest (In)"
                  placeholder="Chest"
               
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.waist_in"
                  label="Waist (In)"
                  placeholder="Waist"
  
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.hips_in"
                  label="Hips (In)"
                  placeholder="Hips"
         
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.lean_body_mass_lbs"
                  label="Lean Body Mass (Lbs)"
                  placeholder="Lean Body Mass (Lbs)"
          
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.left_forearm_in"
                  label="Left Forearm (In)"
                  placeholder="Left Forearm"
 
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.left_wrist_in"
                  label="Left Wrist (In)"
                  placeholder="Left Wrist (In)"
     
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.right_forearm_in"
                  label="Right Forearm (In)"
                  placeholder="Right Forearm"
         
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.right_wrist_in"
                  label="Right Wrist (In)"
                  placeholder="Right Wrist"
        
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.left_bicep_in"
                  label="Left Bicep (In)"
                  placeholder="Left Bicep"
           
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.right_bicep_in"
                  label="Right Bicep (In)"
                  placeholder="Right Bicep"
                
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.left_thigh_in"
                  label="Left Thigh (In)"
                  placeholder="Left Thigh"

                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.right_thigh_in"
                  label="Right Thigh (In)"
                  placeholder="Right Thigh"

                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.left_calf_in"
                  label="Left Calf (In)"
                  placeholder="Left Calf"
         
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.right_calf_in"
                  label="Right Calf (In)"
                  placeholder="Right Calf"
              
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.body_fat"
                  label="Body Fat (%)"
                  placeholder="Body Fat"
              
                />
              </VCol>
              <VCol cols="12" class="py-0"> Estimation (ADIME)Calculate </VCol>
              <VCol cols="6">
                <AppSelect
                    v-model="props.vitalData.activity_level"
                    
                    label="Activity Level"
                    placeholder="Activity Level"
                   :items="['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extremely Active']"
  
                  
                />
              
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="props.vitalData.hip_to_waist"
                  label="Hip To Waist"
                  placeholder="Hip To Waist"
      
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="props.vitalData.resting_metabolic_rate_kcal"
                  label="Resting Metabolic Rate (kcal)"
                  placeholder="Resting Metabolic Rate"
            
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="props.vitalData.with_activity_metabolic_rate_kcal"
                  label="With Activity Metabolic Rate (kcal)"
                  placeholder="With Activity Metabolic Rate"

                />
              </VCol>
              <VCol cols="6">
                <AppSelect
                    v-model="props.vitalData.fluid"
                    
                    label="Fluid"
                    placeholder="Fluid"
                   :items="['x25', 'x27.5', 'x30']"
                
                />
                </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="props.vitalData.fluid_oz"
                  label="Fluid (oz)"
                  placeholder="Fluid (oz)"
     
                />
              </VCol>

              <VCol cols="4">
                <AppSelect
                    v-model="props.vitalData.protein"
                    
                    label="Protein"
                    placeholder="Protein"
                   :items="['x0.8', 'x0.9', 'x1.0']"
              
                />
                </VCol>

              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.protein_gms"
                  label="Protein (gms)"
                  placeholder="Protein (gms)"
     
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.protein_bmi"
                  label="Protein BMI"
                  placeholder="BMI"
                  readnly
 
                />
              </VCol>

              <VCol cols="4">
                <AppSelect
                    v-model="props.vitalData.frame"
                    
                    label="Frame"
                    placeholder="Frame"
                   :items="['normal', 'small', 'large']"
     
                />
                </VCol>

                <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.ideal_body_weight_lbs"
                  label="Ideal Body Weight (lbs)"
                  placeholder="Ideal Body Weight "
 
                />
              </VCol>
              <VCol cols="4">
                <AppTextField
                  v-model="props.vitalData.ibw_percentage"
                  label="BW %"
                  placeholder="BW %"
                  readnly
                
                />
              </VCol>

              <VCol cols="6">
                <AppTextField
                  v-model="props.vitalData.adjusted_body_weight_abw_lbs"
                  label="Adjusted Body Weight- ABW"
                  placeholder="Adjusted Body Weight- ABW"
                  readnly
             
                />
              </VCol>
              
              <VCol cols="6">
                <AppSelect
                    v-model="props.vitalData.recommendation_weight"
                    
                    label="Recommendation Weight"
                    placeholder="Recommendation Weight"
                   :items="['Use Actual', 'Use Adjusted']"
                
                />
                </VCol>
                <VCol cols="12">
                <v-textarea
                  v-model="props.vitalData.notes"
                  label="Notes"
                  
                  rows="5"
                  placeholder="Notes"
                
                />
                </VCol>
              
              
               
               
            </VRow>
            </VForm>        
         
</template>
