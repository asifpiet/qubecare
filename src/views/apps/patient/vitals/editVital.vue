<script setup>

const { currentUser, currentRole, logout } = useAuth()

const isLoading = ref(false)
const isFormValid = ref(false)
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
const due_datesdasd = ref();
const catagri_template = ref();
const categari_template_array = ref([
  'AESTH_Injectables Note (Dermal filler Neuromodulator)',
  'AESTH_Laser, RF, and DG therapy',
  'AESTH_Low Level Laser',
  'IV_IV Therapy Note (SOAP)',
  'WL_SOAP Note Wellness for PLAN',
  'WL_Weight Loss Progress Note (short)'

])
const props = defineProps({
  editVitalData: {
    type: Object,
    required: true,
  }
});
const closeNavigationDrawer = () => {
  isTextMessageDialogVisible.value = false;
}

const editVital = computed(async () => {
  console.log("EditVitalData", props.editVitalData);
  weight_lbs.value = props.editVitalData.weight_lbs
  weight_oz.value = props.editVitalData.weight_oz
  temperature.value = props.editVitalData.temperature
  height_ft.value = props.editVitalData.height_ft
  height_in.value = props.editVitalData.height_in
  ibm.value = props.editVitalData.bmi
  blood_presssure.value = props.editVitalData.blood_pressure
  diastolic.value = props.editVitalData.diastolic
  respiratory_rate.value = props.editVitalData.respiratory_rate
  pulse.value = props.editVitalData.pulse
  bloodSugar.value = props.editVitalData.bloodSugar
  fasting.value = props.editVitalData.fasting
  saturation.value = props.editVitalData.saturation
  headCircumference_in.value = props.editVitalData.headCircumference_in
  neck_in.value = props.editVitalData.neck_in
  shoulders_in.value = props.editVitalData.shoulders_in
  chest_in.value = props.editVitalData.chest_in
  waist_in.value = props.editVitalData.waist_in
  hips_in.value = props.editVitalData.hips_in
  lean_body_mass_lbs.value = props.editVitalData.lean_body_mass_lbs
  left_forearm_in.value = props.editVitalData.left_forearm_in
  left_wrist_in.value = props.editVitalData.left_wrist_in
  right_forearm_in.value = props.editVitalData.right_forearm_in
  right_wrist_in.value = props.editVitalData.right_wrist_in
  left_bicep_in.value = props.editVitalData.left_bicep_in
  right_bicep_in.value = props.editVitalData.right_bicep_in
  left_thigh_in.value = props.editVitalData.left_thigh_in
  right_thigh_in.value = props.editVitalData.right_thigh_in
  left_calf_in.value = props.editVitalData.left_calf_in
  right_calf_in.value = props.editVitalData.right_calf_in
  body_fat.value = props.editVitalData.body_fat
  activity_level.value = props.editVitalData.activity_level
  hip_to_waist.value = props.editVitalData.hip_to_waist
  resting_metabolic_rate_kcal.value = props.editVitalData.resting_metabolic_rate_kcal
  with_activity_metabolic_rate_kcal.value = props.editVitalData.with_activity_metabolic_rate_kcal
  fluid.value = props.editVitalData.fluid
  fluid_oz.value = props.editVitalData.fluid_oz
  protein.value = props.editVitalData.protein
  protein_gms.value = props.editVitalData.protein_gms
  protein_bmi.value = props.editVitalData.protein_bmi
  frame.value = props.editVitalData.frame
  ideal_body_weight_lbs.value = props.editVitalData.ideal_body_weight_lbs
  ibw_percentage.value = props.editVitalData.ibw_percentage
  adjusted_body_weight_abw_lbs.value = props.editVitalData.adjusted_body_weight_abw_lbs
  recommendation_weight.value = props.editVitalData.recommendation_weight
  notes.value = props.editVitalData.notes
  subjective_notes.value = props.editVitalData.subjective_notes
  catagri_template.value = props.editVitalData.catagri_template
  return true;
});

const editorInit = ref({
  height: 500,
  menubar: false,
  plugins: 'link image code',
  toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | code'
});
const emit = defineEmits([
  'update:isDrawerOpen',
  'updateVital'
])



const onSubmit = async () => {
  isLoading.value = true
  refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      console.log('lastnae', props.editVitalData);
      const userData = currentUser.value;
      emit('updateVital', {
        provider: userData.fullName,
        provider_id: userData.id,
        weight_lbs: weight_lbs.value,
        vital_id: props.editVitalData.id,
        weight_oz: weight_oz.value,
        temperature: temperature.value,
        height_ft: height_ft.value,
        height_in: height_in.value,
        bmi: ibm.value,
        blood_presssure: blood_presssure.value,
        diastolic: diastolic.value,
        respiratory_rate: respiratory_rate.value,
        pulse: pulse.value,
        bloodSugar: bloodSugar.value,
        fasting: fasting.value,
        saturation: saturation.value,
        headCircumference_in: headCircumference_in.value,
        neck_in: neck_in.value,
        shoulders_in: shoulders_in.value,
        chest_in: chest_in.value,
        waist_in: waist_in.value,
        hips_in: hips_in.value,
        lean_body_mass_lbs: lean_body_mass_lbs.value,
        left_forearm_in: left_forearm_in.value,
        left_wrist_in: left_wrist_in.value,
        right_forearm_in: right_forearm_in.value,
        right_wrist_in: right_wrist_in.value,
        left_bicep_in: left_bicep_in.value,
        right_bicep_in: right_bicep_in.value,
        left_thigh_in: left_thigh_in.value,
        right_thigh_in: right_thigh_in.value,
        left_calf_in: left_calf_in.value,
        right_calf_in: right_calf_in.value,
        body_fat: body_fat.value,
        activity_level: activity_level.value,
        hip_to_waist: hip_to_waist.value,
        resting_metabolic_rate_kcal: resting_metabolic_rate_kcal.value,
        with_activity_metabolic_rate_kcal: with_activity_metabolic_rate_kcal.value,
        fluid: fluid.value,
        fluid_oz: fluid_oz.value,
        protein: protein.value,
        protein_gms: protein_gms.value,
        protein_bmi: protein_bmi.value,
        frame: frame.value,
        ideal_body_weight_lbs: ideal_body_weight_lbs.value,
        ibw_percentage: ibw_percentage.value,
        adjusted_body_weight_abw_lbs: adjusted_body_weight_abw_lbs.value,
        recommendation_weight: recommendation_weight.value,
        notes: notes.value,
        subjective_notes: subjective_notes.value,
        due_datesdasd: due_datesdasd.value,
        catagri_template: catagri_template.value
      })
      isLoading.value = false;
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
        closeNavigationDrawer();
      })
    } else {

      isLoading.value = false;
    }
  })

}
</script>
<template>
  <div v-if="editVital"></div>
  <VForm ref="refForm" v-model="isFormValid">
    <VRow>
      <VCol cols="4">
        <AppTextField  type="number"  v-model="weight_lbs" :label="$t('Weight (lbs)')" :placeholder="$t('Weight (lbs)')" />
      </VCol>
      <VCol cols="4">
        <AppTextField type="number"  v-model="weight_oz" :label="$t('Weight (oz)')" :placeholder="$t('Weight (oz)')"  />
      </VCol>

      <VCol cols="4">
        <AppTextField type="number"  v-model="temperature" :label="$t('Temperature (F)')"  :placeholder="$t('Temperature (F)')" />
      </VCol>

      <VCol cols="4">
        <AppTextField type="number"  v-model="height_ft" :label="$t('Height (ft)')"  :placeholder="$t('Height (ft)')" />
      </VCol>
      <VCol cols="4">
        <AppTextField type="number"  v-model="height_in" :label="$t('Height (In)')"  :placeholder="$t('Height (In)')" />
      </VCol>
      <VCol cols="4">
        <AppTextField type="number"  v-model="ibm" :label="$t('Respiratory Rate (RPM)')"  :placeholder="$t('Respiratory Rate (RPM)')" />
      </VCol>
      <VCol cols="6">
        <AppTextField v-model="blood_presssure" :label="$t('Blood Pressure (Systolic) mmHg')" 
        :placeholder="$t('Blood Pressure (Systolic) mmHg')"  />
      </VCol>

      <VCol cols="6">
        <AppTextField v-model="diastolic" :label="$t('(Diastolic) mmHg')"  :placeholder="$t('(Diastolic) mmHg')" 
          :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="6">
        <AppTextField  type="number" v-model="respiratory_rate" :label="$t('Respiratory Rate (RPM)')"  :placeholder="$t('Respiratory Rate (RPM)')" 
          :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="6">
        <AppTextField  type="number" v-model="pulse" :label="$t('Pulse (BPM)')"  :placeholder="$t('Pulse (BPM)')" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="6">
        <AppTextField type="number"  v-model="bloodSugar" :label="$t('Blood Sugar')"  :placeholder="$t('Blood Sugar')"  :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="6">
        <AppSelect v-model="fasting" :label="$t('Fasting')"  :placeholder="$t('Fasting')" :items="['Fasting', 'Non-Fasting']"
          :rules="[requiredValidator]" />

      </VCol>

      <VCol cols="6">
        <AppTextField  type="number" v-model="saturation" :label="$t('O2 Saturation')"  :placeholder="$t('O2 Saturation')" 
          :rules="[requiredValidator]" />
      </VCol>

      <VCol cols="6">
        <AppTextField type="number"  v-model="headCircumference_in":label="$t('Head Circumference (In)')"  :placeholder="$t('Head Circumference (In)')" 
          :rules="[requiredValidator]" />
      </VCol>

      <VCol cols="4">
        <AppTextField  type="number" v-model="neck_in" :label="$t('Neck (In)')"  :placeholder="$t('Neck (In)')"   :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField  type="number" v-model="shoulders_in" :label="$t('Shoulders (In)')"  :placeholder="$t('Shoulders (In)')" 
          :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField type="number" v-model="chest_in" :label="$t('Chest (In)')"  :placeholder="$t('Chest (In)')"  :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField type="number" v-model="waist_in" :label="$t('Waist (In)')"  :placeholder="$t('Waist (In)')"   :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField type="number" v-model="hips_in"  :label="$t('Hips (In)')"  :placeholder="$t('Hips (In)')"    :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField type="number" v-model="lean_body_mass_lbs" :label="$t('Lean Body Mass (Lbs)')"  :placeholder="$t('Lean Body Mass (Lbs)')"  
          :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField  type="number" v-model="left_forearm_in" :label="$t('Left Forearm (In)')"  :placeholder="$t('Left Forearm (In)')" 
          :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField type="number" v-model="left_wrist_in" :label="$t('Left Wrist (In)')"  :placeholder="$t('Left Wrist (In)')" 
          :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField type="number" v-model="right_forearm_in" :label="$t('Right Forearm (In)')"  :placeholder="$t('Right Forearm (In)')" 
          :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField type="number" v-model="right_wrist_in" :label="$t('Right Wrist (In)')"  :placeholder="$t('Right Wrist (In)')"
          :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField  type="number" v-model="left_bicep_in" :label="$t('Left Bicep (In)')"  :placeholder="$t('Left Bicep (In)')"  
          :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField  type="number" v-model="right_bicep_in" :label="$t('Right Bicep (In)')"  :placeholder="$t('Right Bicep (In)')" 
          :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField type="number" v-model="left_thigh_in" :label="$t('Left Thigh (In)')"  :placeholder="$t('Left Thigh (In)')" 
          :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField  type="number" v-model="right_thigh_in" :label="$t('Right Thigh (In)')"  :placeholder="$t('Right Thigh (In)')" 
          :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField  type="number" v-model="left_calf_in" :label="$t('Left Calf (In)')"  :placeholder="$t('Left Calf (In)')"
          :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField  type="number" v-model="right_calf_in" :label="$t('Right Calf (In)')"  :placeholder="$t('Right Calf (In)')" 
          :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField type="number" v-model="body_fat" :label="$t('Body Fat (%)')"  :placeholder="$t('Body Fat (%)')"   :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" class="py-0"> {{ $t('Estimation (ADIME) Calculate')}}  </VCol>
      <VCol cols="6">
        <AppSelect v-model="activity_level" :label="$t('Activity Level')"  :placeholder="$t('Activity Level')"
          :items="['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extremely Active']"
          :rules="[requiredValidator]" />

      </VCol>

      <VCol cols="6">
        <AppTextField type="number" v-model="hip_to_waist" :label="$t('Hip To Waist')"  :placeholder="$t('Hip To Waist')" 
          :rules="[requiredValidator]" />
      </VCol>

      <VCol cols="6">
        <AppTextField type="number"  v-model="resting_metabolic_rate_kcal" :label="$t('Resting Metabolic Rate (kcal)')" 
          :placeholder="$t('Resting Metabolic Rate (kcal)')"  :rules="[requiredValidator]" />
      </VCol>

      <VCol cols="6">
        <AppTextField  type="number"  v-model="with_activity_metabolic_rate_kcal"  :label="$t('With Activity Metabolic Rate (kcal)')"  
          :placeholder="$t('With Activity Metabolic Rate (kcal)')" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="6">
        <AppSelect  type="number" v-model="fluid" :label="$t('Fluid')"  :placeholder="$t('Fluid')"   :items="['x25', 'x27.5', 'x30']"
          :rules="[requiredValidator]" />
      </VCol>

      <VCol cols="6">
        <AppTextField type="number"  v-model="fluid_oz" :label="$t('Fluid (oz)')"  :placeholder="$t('Fluid (oz)')"  :rules="[requiredValidator]" />
      </VCol>

      <VCol cols="4">
        <AppSelect v-model="protein" :label="$t('Protein')"  :placeholder="$t('Protein')"  :items="['x0.8', 'x0.9', 'x1.0']"
          :rules="[requiredValidator]" />
      </VCol>

      <VCol cols="4">
        <AppTextField  type="number" v-model="protein_gms" :label="$t('Protein (gms)')"  :placeholder="$t('Protein (gms)')" 
          :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField  type="number" v-model="protein_bmi" :label="$t('BMI')"  :placeholder="$t('BMI')" readnly :rules="[requiredValidator]" />
      </VCol>

      <VCol cols="4">
        <AppSelect v-model="frame" :label="$t('Frame')"  :placeholder="$t('Frame')"  :items="['normal', 'small', 'large']"
          :rules="[requiredValidator]" />
      </VCol>

      <VCol cols="4">
        <AppTextField type="number" v-model="ideal_body_weight_lbs" :label="$t('Ideal Body Weight (lbs)')"  :placeholder="$t('Ideal Body Weight (lbs)')" 
          :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField  type="number" v-model="ibw_percentage" :label="$t('BW %')"  :placeholder="$t('BW %')"  readnly :rules="[requiredValidator]" />
      </VCol>

      <VCol cols="6">
        <AppTextField type="number" v-model="adjusted_body_weight_abw_lbs" :label="$t('Adjusted Body Weight- ABW')"
          :placeholder="$t('Adjusted Body Weight- ABW')" readnly />
      </VCol>

      <VCol cols="6">
        <AppSelect v-model="recommendation_weight" :label="$t('Recommendation Weight')"  :placeholder="$t('Recommendation Weight')"
          :items="['Use Actual', 'Use Adjusted']" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12">
        <v-textarea v-model="notes" :label="$t('Notes')"  :placeholder="$t('Notes')"  rows="5" />
      </VCol>
      <VCol cols="12">{{ $t('Subjective Notes') }}</VCol>
      <VCol cols="6" style="display: none;">
        <VBtn>{{ $t('SOAP Templates') }}  </VBtn>
      </VCol>
      <VCol cols="12">
        <AppSelect v-model="catagri_template" :label="$t('Categorize Templates')"  :placeholder="$t('Categorize Templates')"  :items="['AESTH_Injectables Note (Dermal filler; Neuromodulator)',
          'AESTH_Laser, RF, and DG therapy',
          'AESTH_Low Level Laser',
          'IV_IV Therapy Note (SOAP)',
          'WL_SOAP Note Wellness for PLAN',
          'WL_Weight Loss Progress Note (short)']" :rules="[requiredValidator]" />

      </VCol>
      <VCol cols="12">
        <!-- <Editor v-model="content" :init="editorInit"></Editor> -->
        <v-textarea v-model="subjective_notes"  :label="$t('Editor Text')"  :placeholder="$t('Editor Text')" rows="5"  />
      </VCol>
      <VCol cols="12">
        <VBtn @click="onSubmit" class="me-3">
          {{ $t('Save') }}
        </VBtn>
        <VBtn type="reset" variant="tonal" color="error" class="ml-3" @click="closeNavigationDrawer">
          {{ $t('Close') }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>

</template>
