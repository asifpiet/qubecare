<template>
  <v-container>
    <div v-if="persnalData"></div>
    <v-form>
      <v-row class="mb-4">
        <v-col cols="12" md="4" v-for="(condition, index) in conditions" :key="index">
          <v-select v-model="clinicalProfileStore.personalFamilyHistoy.selectedConditions[index]" :items="options"
            :label="condition" multiple chips :placeholder="$t('Select options')"></v-select>
        </v-col>
        <VCol cols="12">
          <VCardTitle>{{ $t('If deceased, relevant info')}}:</VCardTitle>
        </VCol>
        <v-col cols="12" md="4">
          <v-textarea v-model="clinicalProfileStore.personalFamilyHistoy.Mother" :label="$t('Mother')" rows="4"
            :placeholder="$t('Enter details...')" outlined></v-textarea>
        </v-col>
        <v-col cols="12" md="4">
          <v-textarea v-model="clinicalProfileStore.personalFamilyHistoy.Father" :label="$t('Father')" rows="4"
            :placeholder="$t('Enter details...')" outlined></v-textarea>
        </v-col>
        <v-col cols="12" md="4">
          <v-textarea v-model="clinicalProfileStore.personalFamilyHistoy.Sibling" :label="$t('Sibling')" rows="4"
            :placeholder="$t('Enter details...')" outlined></v-textarea>
        </v-col>
        <v-col cols="12" md="4">
          <v-textarea v-model="clinicalProfileStore.personalFamilyHistoy.MaternalGrandmother"
            :label="$t('MaternalGrandmother')" rows="4" :placeholder="$t('Enter details...')" outlined></v-textarea>
        </v-col>
        <v-col cols="12" md="4">
          <v-textarea v-model="clinicalProfileStore.personalFamilyHistoy.MaternalGrandfather"
            :label="$t('MaternalGrandfather')" rows="4" :placeholder="$t('Enter details...')" outlined></v-textarea>
        </v-col>
        <v-col cols="12" md="4">
          <v-textarea v-model="clinicalProfileStore.personalFamilyHistoy.PaternalGrandmother"
            :label="$t('PaternalGrandmother')" rows="4" :placeholder="$t('Enter details...')" outlined></v-textarea>
        </v-col>
        <v-col cols="12" md="4">
          <v-textarea v-model="clinicalProfileStore.personalFamilyHistoy.PaternalGrandfather"
            :label="$t('PaternalGrandfather')" rows="4" :placeholder="$t('Enter details...')" outlined></v-textarea>
        </v-col>

      </v-row>

      <v-row>
        <v-col cols="12">
          <v-btn @click="submitForm" color="primary">{{ $t('Update Family History') }}</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import { useClinicalProfileStore } from '@/stores/clinicalProfileStore';
const clinicalProfileStore = useClinicalProfileStore()
const conditions = [
  'ADD/ADHD',
  'Allergies',
  'Anemia',
  'Anxiety',
  'Arthritis',
  'Asthma',
  'Autoimmune disease',
  'Blood Transfusion',
  'Cancer',
  'Cataracts',
  'Chemical Sensitivities',
  'Chronic Fatigue',
  'Congestive Heart Failure',
  'Clotting Disorder',
  'COPD',
  'Depression',
  'Diabetes',
  'Eczema',
  'Emphysema',
  'Fibromyalgia',
  'GERD',
  'Glaucoma',
  'Headaches/migraines',
  'Heart disease',
  'Heart Murmur',
  'High cholesterol',
  'HIV/AIDS',
  'Hypertension',
  'Irritable Bowel Syndrome',
  'Kidney Disease',
  'Lyme Disease',
  'Meningitis',
  'Menopause',
  'Mental illness',
  'Mononucleosis',
  'Nerve/Muscle Disease',
  'Obesity',
  'Osteoporosis',
  'Ovarian cysts/PCOS',
  'Parkinson Alzheimers',
  'Prostate disease',
  'Psoriasis',
  'Recurrent strep infections',
  'Seizures',
  'Sickle Cell Anemia',
  'Stroke',
  'Substance Abuse',
  'Thyroid Disease',
  'Tuberculosis',
  'Vaginal infections',
];

// Define the common options for relationships or treatments
const options = [
  'Self',
  'Mother',
  'Father',
  'Sibling',
  'Maternal Grandmother',
  'Maternal Grandfather',
  'Paternal Grandmother',
  'Paternal Grandfather',
];

const emit = defineEmits([
  'personalFamilyHistory'
]);

const props = defineProps({
  personalFamilyHistory: {
    type: Object,
    required: true,
  },
  patient: {
    type: Object,
    required: true,
  },

});
const submitForm = () => {
  return clinicalProfileStore.savePersnalFamilyHistory(props.patient.id)
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
