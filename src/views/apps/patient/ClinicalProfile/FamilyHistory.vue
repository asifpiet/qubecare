<template>
    <v-container>
      <div v-if="persnalData"></div>
      <v-form>
        <v-row class="mb-4">
          <!-- <v-col cols="12" md="4" v-for="(condition, index) in conditions" :key="index">
            <v-select
              v-model="selectedConditions[index]"
              :items="options"
              :label="condition"
              multiple
              chips
              placeholder="Select options"
            ></v-select>
          </v-col> -->
          <v-col cols="12" md="4" v-for="(condition, index) in conditions" :key="index">
            <v-select
              v-model="selectedConditions[condition]"
              :items="options"
              :label="condition"
              multiple
              chips
              placeholder="Select options"
            ></v-select>
          </v-col>
          <VCol cols="12">
            <VCardTitle>{{ $t(`If deceased, relevant info:`) }}</VCardTitle>
          </VCol>
          <v-col cols="12" md="4">
          <v-textarea
            v-model="mother"
            :label="$t('Mother')"
            rows="4"
            placeholder="Enter details..."
            outlined
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="4">
          <v-textarea
            v-model="father"
            :label="$t('Father')"
            rows="4"
            placeholder="Enter details..."
            outlined
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="4">
          <v-textarea
            v-model="sibling"
            :label="$t('Sibling')"
            rows="4"
            placeholder="Enter details..."
            outlined
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="4">
          <v-textarea
            v-model="maternalGrandmother"
            :label="$t('MaternalGrandmother')"
            rows="4"
            placeholder="Enter details..."
            outlined
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="4">
          <v-textarea
            v-model="maternalGrandfather"
            :label="$t('MaternalGrandfather')"
            rows="4"
            placeholder="Enter details..."
            outlined
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="4">
          <v-textarea
            v-model="paternalGrandmother"
            :label="$t('PaternalGrandmother')"
            rows="4"
            placeholder="Enter details..."
            outlined
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="4">
          <v-textarea
            v-model="paternalGrandfather"
            :label="$t('PaternalGrandfather')"
            rows="4"
            placeholder="Enter details..."
            outlined
          ></v-textarea>
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
  import { ref } from 'vue';
  const mother =ref()
 const father =ref()
 const sibling =ref()
 const maternalGrandmother =ref()
 const maternalGrandfather =ref()
 const paternalGrandmother =ref()
 const paternalGrandfather =ref()
 
 const selectedConditions = ref({});
//  const familyInfo = ref({});
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
  const textareaValues = ref(Array(8).fill('')); // Initialize an array for each label
  const emit = defineEmits([
    'personalFamilyHistory'
  ]);

  const props = defineProps({
    personalFamilyHistory: {
    type: Object,
    required: true,
  },
  
})


  
const persnalData = computed(() => {

  if(props.personalFamilyHistory){
      console.log("personalFamilyHistory",props.personalFamilyHistory);
  // Destructure familyInfo into refs
  // const familyInfo = props.personalFamilyHistory|| {};
  mother.value = props.personalFamilyHistory.history_mother || '';
  father.value = props.personalFamilyHistory.history_father || '';
  sibling.value = props.personalFamilyHistory.history_siblings || '';
  maternalGrandmother.value = props.personalFamilyHistory.maternal_grand_mother || '';
  maternalGrandfather.value = props.personalFamilyHistory.maternal_grand_father || '';
  paternalGrandmother.value = props.personalFamilyHistory.paternal_grand_mother || '';
  paternalGrandfather.value = props.personalFamilyHistory.paternal_grand_father || '';

  // Populate selectedConditions
  selectedConditions.value = props.personalFamilyHistory.slectedConditions || {};
  }
});
  

  

  const submitForm = () => {
    emit('personalFamilyHistory',{
          selectedConditions:selectedConditions.value,
          Mother:mother.value,
            Father:father.value,
            Sibling:sibling.value,
            MaternalGrandmother:maternalGrandmother.value,
            MaternalGrandfather:maternalGrandfather.value,
            PaternalGrandmother:paternalGrandmother.value,
            PaternalGrandfather:paternalGrandmother.value,
          
          
        
      

        
    })
    
    // Handle form submission logic here
    
    console.log(selectedConditions.value);
  };
  </script>
  
  <style scoped>
  /* Add any custom styles here */
  </style>
  