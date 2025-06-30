<script setup>
  import { ref } from 'vue';
  const sections = ref([
  { title: 'Xrays and Special Studies', info: '' },
  { title: 'Surgical History', info: '' },
  { title: 'Antibiotic History', info: '' },
  { title: 'Accidents/Injuries/Transfusions', info: '' },
  { title: 'Hospitalization', info: '' },
  { title: 'Screening Tests', info: '' },
  { title: 'Dental History', info: '' },
  { title: 'Recent Lab Work', info: '' },
]);
const props = defineProps({
  entries: {
    type: Array,
    required: true,
  },
  
})
const emit = defineEmits([
    'immunization'
]);

  const immunizations = ref([{
    date: '',
    name: '',
    nameKey: 'UNK',
    practitionerLocation: '',
    administered: 'false',
    reason: '',
    type: '',
    typeKey: 'UNK',
    administeredLocation: '',
    administeredLocationKey: 'UNK',
    fundingSource: '',
    vfcEligibility: '',
    batch: '',
    manufacturer: '',
    manufacturerKey: 'UNK',
    expiryDate: '',
    administeredBy: '',
    consent: '',
    quantity: '',
    comments: '',
  }]);

  const setEntries = computed(() => {
      console.log("props",props.entries);
      if(props.entries.immunizationsEntries){
        immunizations.value = props.entries.immunizationsEntries.map((entry) => ({
      date: entry.date || '',
      name: entry.name || '',
      nameKey: entry.nameKey || 'UNK',
      practitionerLocation: entry.practitionerLocation || '',
      administered: entry.administered ? 'true' : 'false',
      reason: entry.reason || '',
      type: entry.type || '',
      typeKey: entry.typeKey || 'UNK',
      administeredLocation: entry.administeredLocation || '',
      administeredLocationKey: entry.administeredLocationKey || 'UNK',
      fundingSource: entry.fundingSource || '',
      vfcEligibility: entry.vfcEligibility || '',
      batch: entry.batch || '',
      manufacturer: entry.manufacturer || '',
      manufacturerKey: entry.manufacturerKey || 'UNK',
      expiryDate: entry.expiryDate || '',
      administeredBy: entry.administeredBy || '',
      consent: entry.consent || '',
      quantity: entry.quantity || '',
      comments: entry.comments || '',
        }));
      }
      if(props.entries.sections){
          sections.value = props.entries.sections.map((item) => ({
          title: item.title,
          info: item.description || '', // Default to empty string if no description
        }));
      }

  });
  
  
  // Sample data for select options
  const locations = [
    { value: '10204', text: 'TKO Wellness-NV' },
    { value: '17412', text: 'Test Location' },
    { value: '18285', text: 'Vagas' },
  ];
  
  const administeredOptions = [
    { value: 'false', text: 'Yes' },
    { value: 'true', text: 'No' },
  ];
  
  const fundingSources = [
    { value: '', text: 'Select' },
    { value: 'VXC1', text: 'Federal funds' },
    { value: 'PHC68', text: 'Military funds' },
    { value: 'OTH', text: 'Other' },
    { value: 'PHC70', text: 'Private funds' },
    { value: 'VXC2', text: 'State funds' },
    { value: 'VXC3', text: 'Tribal funds' },
    { value: 'UNK', text: 'Unknown' },
    { value: 'VXC50', text: 'Public Blended CVP' },
  ];
  
  const vfcEligibilityOptions = [
    { value: '', text: 'Select' },
    { value: 'V01', text: 'Not VFC eligible' },
    { value: 'V02', text: 'VFC eligible Medicaid/Medicaid Managed Care' },
    { value: 'V03', text: 'VFC eligible - Uninsured' },
    { value: 'V04', text: 'VFC eligible - American Indian/Alaskan Native' },
    { value: 'V05', text: 'VFC eligible - Under-insured' },
    { value: 'V07', text: 'Local-specific eligibility' },
  ];
  
  // Validation rules
  const dateRules = [(v) => !!v || 'Please enter a date'];
  const nameRules = [(v) => !!v || 'Please enter a vaccine name'];
  const locationRules = [(v) => !!v || 'Please select a location'];
  const reasonRules = [(v) => immunization.administered === 'true' || !!v || 'Please mention reason if not administered'];
  const typeRules = [(v) => !!v || 'Please enter vaccine type'];
  const administeredLocationRules = [(v) => !!v || 'Please select administered location'];
  const fundingSourceRules = [(v) => !!v || 'Please select a funding source'];
  const vfcEligibilityRules = [(v) => !!v || 'Please select VFC eligibility'];
  const batchRules = [(v) => !!v || 'Please enter batch'];
  const manufacturerRules = [(v) => !!v || 'Please enter manufacturer'];
  const expiryRules = [(v) => !!v || 'Please select expiry date'];
  const administeredByRules = [(v) => !!v || 'Please enter the administrator\'s name'];
  const quantityRules = [(v) => !!v || 'Please enter a quantity greater than zero'];
  
  // Methods
  const addMore = () => {
    immunizations.value.push({
      date: new Date(),
      name: '',
      nameKey: 'UNK',
      practitionerLocation: '',
      administered: 'false',
      reason: '',
      type: '',
      typeKey: 'UNK',
      administeredLocation: '',
      administeredLocationKey: 'UNK',
      fundingSource: '',
      vfcEligibility: '',
      batch: '',
      manufacturer: '',
      manufacturerKey: 'UNK',
      expiryDate: '',
      administeredBy: '',
      consent: '',
      quantity: '',
      comments: '',
    });
  };
  
  const removeEntry = (index) => {
    immunizations.value.splice(index, 1);
  };
  
  const submitToRegistry = () => {
    // Logic to submit all entries to the registry
    // console.log('Submitting to registry:', immunizations.value);
  };
  const onSubmitImmunization = () => {
    // Logic to submit all entries to the registry
    emit('immunizationEntries',{
      immunizationsEntries: immunizations.value,
      sections:sections.value
    })
    
    // console.log('Submitting to registry:', immunizations.value);
  };
  
  </script>
  
<template>
    <v-container>
      <div v-if="setEntries"></div>
      <div class="tw-om-box-inner">
        <div class="tw-om-box-header">
          <span class="font-medium text-base">Immunization Entry</span>
          <input type="hidden" name="patimmutbl_edit-3" maxlength="255" />
        </div>
  
        <v-form>
          <v-row v-for="(immunization, index) in immunizations" :key="index" class="mb-5">
  <v-col cols="12" sm="6" md="4">
    <v-text-field
      label="Date"
      v-model="immunization.date"
      type="date"
      :rules="[dateRules]"
    ></v-text-field>
  </v-col>
  
  <v-col cols="12" sm="6" md="4">
    <v-text-field
      label="Name"
      v-model="immunization.name"
      placeholder="Type few letters to search"
      autocomplete="off"
      :rules="[nameRules]"
    ></v-text-field>
    <input type="hidden" v-model="immunization.nameKey" />
  </v-col>

  <v-col cols="12" sm="6" md="4">
    <v-select
      label="Practitioner Location"
      v-model="immunization.practitionerLocation"
      :items="locations"
      :rules="[locationRules]"
      item-title="text"
      item-value="value"
    ></v-select>
  </v-col>

  <v-col cols="12" sm="6" md="4">
    <v-select
      label="Is the vaccine administered?"
      v-model="immunization.administered"
      :items="administeredOptions"
      item-title="text"
      item-value="value"
    ></v-select>
  </v-col>

  <v-col cols="12" sm="6" md="4">
    <v-text-field
      label="If not administered, reason:"
      v-model="immunization.reason"
      :rules="[reasonRules]"
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="6" md="4">
    <v-text-field
      label="Type"
      v-model="immunization.type"
      placeholder="Type few letters to search"
      autocomplete="off"
      :rules="[typeRules]"
    ></v-text-field>
    <input type="hidden" v-model="immunization.typeKey" />
  </v-col>

  <v-col cols="12" sm="6" md="4">
    <v-text-field
      label="Administered Location"
      v-model="immunization.administeredLocation"
      placeholder="Type few letters to search"
      autocomplete="off"
      :rules="[administeredLocationRules]"
    ></v-text-field>
    <input type="hidden" v-model="immunization.administeredLocationKey" />
  </v-col>

  <v-col cols="12" sm="6" md="4">
    <v-select
      label="Vaccine Funding Source"
      v-model="immunization.fundingSource"
      :items="fundingSources"
      :rules="[fundingSourceRules]"
      item-title="text"
      item-value="value"
    ></v-select>
  </v-col>

  <v-col cols="12" sm="6" md="4">
    <v-select
      label="VFC Eligibility"
      v-model="immunization.vfcEligibility"
      :items="vfcEligibilityOptions"
      :rules="[vfcEligibilityRules]"
      item-title="text"
      item-value="value"
    ></v-select>
  </v-col>

  <v-col cols="12" sm="6" md="4">
    <v-text-field
      label="Batch"
      v-model="immunization.batch"
      :rules="[batchRules]"
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="6" md="4">
    <v-text-field
      label="Manufacturer"
      v-model="immunization.manufacturer"
      placeholder="Type few letters to search"
      autocomplete="off"
      :rules="[manufacturerRules]"
    ></v-text-field>
    <input type="hidden" v-model="immunization.manufacturerKey" />
  </v-col>

  <v-col cols="12" sm="6" md="4">
    <v-text-field
      label="Expiry"
      v-model="immunization.expiryDate"
      type="date"
      :rules="[expiryRules]"
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="6" md="4">
    <v-text-field
      label="Given by"
      v-model="immunization.administeredBy"
      :rules="[administeredByRules]"
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="6" md="4">
    <v-text-field
      label="Patient Consent?"
      v-model="immunization.consent"
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="6" md="4">
    <v-text-field
      label="Quantity In ml"
      v-model="immunization.quantity"
      type="number"
      :rules="[quantityRules]"
    ></v-text-field>
  </v-col>

  <v-col cols="12">
    <v-textarea
      label="Comments"
      v-model="immunization.comments"
    ></v-textarea>
  </v-col>

  <v-col cols="12" class="text-right">
    <v-btn @click="removeEntry(index)" class="tw-om-bl-btn-sec-small space-x-2">
      <v-icon left>mdi-delete</v-icon>
      <span>Remove Entry</span>
    </v-btn>
  </v-col>
</v-row>

  
          <v-btn @click="addMore" class="mt-4" color="primary">Add Immunization Entry</v-btn>
  
          <!-- <div class="text-right mt-5">
            <v-btn @click="submitToRegistry" class="tw-om-bl-btn-sec-small space-x-2">
              <span>Submit All To Registry</span>
            </v-btn>
          </div> -->
        </v-form>
      </div>
    </v-container>
    <v-container>
    <v-row class="tw-om-box-content" id="block">
      <v-col
        v-for="(section, index) in sections"
        :key="index"
        cols="12" md="4" 
        class="mb-4"
      >
        <v-card>
          <v-card-title>
            <span class="tw-om-regtxt">{{ section.title }}</span>
          </v-card-title>
          <v-card-text>
            <v-textarea
              v-model="section.info"
              :label="'Info (' + section.title + ')'"
              rows="4"
              class="tw-om-txt-medium resize-none"
            ></v-textarea>
          </v-card-text>
        </v-card>
      </v-col>
      <VCol cols="12">
                <VBtn
                  @click="onSubmitImmunization"
                 class="me-3"
                >
                 Update Immunization
                </VBtn>
                
              </VCol>
    </v-row>
  </v-container>
  </template>
  <style scoped>
  .tw-om-input-label {
    font-weight: bold;
  }
  .tw-om-pink-badge {
    color: pink;
  }
  .tw-om-regtxt {
  font-weight: bold;
  font-size: 1.2em;
}
.tw-om-txt-medium {
  width: 100%;
}
  </style>
  