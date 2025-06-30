<script setup>
import { useFollowUpStore } from '@/stores/followUpStore';
import { ref } from 'vue';
const followUpStore = useFollowUpStore()
const { currentUser, currentRole, logout } = useAuth()

const refForm = ref()
const today = ref(new Date());
followUpStore.json_data.vital.provider_id = currentUser.value.id;
const emit = defineEmits([
  'update:isDrawerOpen',
  'addVital'
])

</script>
<template>
  <VForm ref="refForm">
    <VRow>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.weight_lbs" label="Weight (lbs)" placeholder="Weight (lbs)"
          :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.weight_oz" :rules="[requiredValidator]" label="Weight(oz)"
          placeholder="Weight (oz)" />
      </VCol>

      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.temperature" :rules="[requiredValidator]"
          label="Temperature(F)" placeholder="Temperature(F)" />
      </VCol>

      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.height_ft" :rules="[requiredValidator]" label="Height (ft)"
          placeholder="Height (ft)" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.height_in" :rules="[requiredValidator]" label="Height (in)"
          placeholder="Height (in)" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.bmi" :rules="[requiredValidator]" label="BMI"
          placeholder="BMI" />
      </VCol>
      <VCol cols="6">
        <AppTextField v-model="followUpStore.json_data.vital.blood_presssure" :rules="[requiredValidator]"
          label="Blood Pressure (Systolic) mmHg" placeholder="Blood Pressure (Systolic) mmHg" />
      </VCol>

      <VCol cols="6">
        <AppTextField v-model="followUpStore.json_data.vital.diastolic" :rules="[requiredValidator]"
          label="(Diastolic) mmHg" placeholder="(Diastolic) mmHg" />
      </VCol>
      <VCol cols="6">
        <AppTextField v-model="followUpStore.json_data.vital.respiratory_rate" :rules="[requiredValidator]"
          label="Respiratory Rate (RPM)" placeholder="Respiratory Rate (RPM)" />
      </VCol>
      <VCol cols="6">
        <AppTextField v-model="followUpStore.json_data.vital.pulse" :rules="[requiredValidator]" label="Pulse (BPM)"
          placeholder="Pulse (BPM)" />
      </VCol>
      <VCol cols="6">
        <AppTextField v-model="followUpStore.json_data.vital.bloodSugar" :rules="[requiredValidator]"
          label="Blood Sugar" placeholder="Blood Sugar" />
      </VCol>
      <VCol cols="6">
        <AppSelect v-model="followUpStore.json_data.vital.fasting" :rules="[requiredValidator]" label="Fasting"
          placeholder="Fasting" :items="['Fasting', 'Non-Fasting']" />

      </VCol>
      <VCol cols="6">
        <AppTextField v-model="followUpStore.json_data.vital.saturation" :rules="[requiredValidator]"
          label="O2 Saturation" placeholder="O2 Saturation" />
      </VCol>

      <VCol cols="6">
        <AppTextField v-model="followUpStore.json_data.vital.headCircumference_in" label="Head Circumference (In)"
          placeholder="Head Circumference" />
      </VCol>

      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.neck_in" label="Neck (In)" placeholder="Neck" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.shoulders_in" label="Shoulders (In)"
          placeholder="Shoulders" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.chest_in" label="Chest (In)" placeholder="Chest" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.waist_in" label="Waist (In)" placeholder="Waist" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.hips_in" label="Hips (In)" placeholder="Hips" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.lean_body_mass_lbs" label="Lean Body Mass (Lbs)"
          placeholder="Lean Body Mass (Lbs)" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.left_forearm_in" label="Left Forearm (In)"
          placeholder="Left Forearm" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.left_wrist_in" label="Left Wrist (In)"
          placeholder="Left Wrist (In)" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.right_forearm_in" label="Right Forearm (In)"
          placeholder="Right Forearm" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.right_wrist_in" label="Right Wrist (In)"
          placeholder="Right Wrist" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.left_bicep_in" label="Left Bicep (In)"
          placeholder="Left Bicep" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.right_bicep_in" label="Right Bicep (In)"
          placeholder="Right Bicep" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.left_thigh_in" label="Left Thigh (In)"
          placeholder="Left Thigh" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.right_thigh_in" label="Right Thigh (In)"
          placeholder="Right Thigh" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.left_calf_in" label="Left Calf (In)"
          placeholder="Left Calf" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.right_calf_in" label="Right Calf (In)"
          placeholder="Right Calf" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.body_fat" label="Body Fat (%)" placeholder="Body Fat" />
      </VCol>
      <VCol cols="12" class="py-0"> Estimation (ADIME)Calculate </VCol>
      <VCol cols="6">
        <AppSelect v-model="followUpStore.json_data.vital.activity_level" label="Activity Level"
          placeholder="Activity Level"
          :items="['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extremely Active']" />

      </VCol>

      <VCol cols="6">
        <AppTextField v-model="followUpStore.json_data.vital.hip_to_waist" label="Hip To Waist"
          placeholder="Hip To Waist" />
      </VCol>

      <VCol cols="6">
        <AppTextField v-model="followUpStore.json_data.vital.resting_metabolic_rate_kcal"
          label="Resting Metabolic Rate (kcal)" placeholder="Resting Metabolic Rate" />
      </VCol>

      <VCol cols="6">
        <AppTextField v-model="followUpStore.json_data.vital.with_activity_metabolic_rate_kcal"
          label="With Activity Metabolic Rate (kcal)" placeholder="With Activity Metabolic Rate" />
      </VCol>
      <VCol cols="6">
        <AppSelect v-model="followUpStore.json_data.vital.fluid" label="Fluid" placeholder="Fluid"
          :items="['x25', 'x27.5', 'x30']" />
      </VCol>

      <VCol cols="6">
        <AppTextField v-model="followUpStore.json_data.vital.fluid_oz" label="Fluid (oz)" placeholder="Fluid (oz)" />
      </VCol>

      <VCol cols="4">
        <AppSelect v-model="followUpStore.json_data.vital.protein" label="Protein" placeholder="Protein"
          :items="['x0.8', 'x0.9', 'x1.0']" />
      </VCol>

      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.protein_gms" label="Protein (gms)"
          placeholder="Protein (gms)" />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.protein_bmi" label="Protein BMI" placeholder="BMI"
          readnly />
      </VCol>

      <VCol cols="4">
        <AppSelect v-model="followUpStore.json_data.vital.frame" label="Frame" placeholder="Frame"
          :items="['normal', 'small', 'large']" />
      </VCol>

      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.ideal_body_weight_lbs" label="Ideal Body Weight (lbs)"
          placeholder="Ideal Body Weight " />
      </VCol>
      <VCol cols="4">
        <AppTextField v-model="followUpStore.json_data.vital.ibw_percentage" label="BW %" placeholder="BW %" readnly />
      </VCol>

      <VCol cols="6">
        <AppTextField v-model="followUpStore.json_data.vital.adjusted_body_weight_abw_lbs"
          label="Adjusted Body Weight- ABW" placeholder="Adjusted Body Weight- ABW" readnly />
      </VCol>

      <VCol cols="6">
        <AppSelect v-model="followUpStore.json_data.vital.recommendation_weight" label="Recommendation Weight"
          placeholder="Recommendation Weight" :items="['Use Actual', 'Use Adjusted']" />
      </VCol>
      <VCol cols="12">
        <v-textarea v-model="followUpStore.json_data.vital.notes" label="Notes" rows="5" placeholder="Notes" />
      </VCol>




    </VRow>
  </VForm>

</template>
