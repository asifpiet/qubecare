<script setup>
  import { ref } from 'vue';
  
  // Form data
  const refForm = ref()
  const presherbname = ref("");
  const presherbdispdays = ref();
  const presherbdisprefills = ref();
  const presherbdispsubs = ref();
  const presherbnotes = ref("");
  const presherbstarton = ref("");
  const presherbdisconton = ref("");
  const presherbsrc = ref("");
  const bb = ref();
  const bx = ref();
  const bl = ref();
  const lx = ref();
  const bd = ref();
  const dx = ref();
  const bs =ref();
  // Options for selects
  const dispDaysOptions = [1, 5, 7, 10, 14, 30, 40, 60, 90, 120];
  const dispRefillsOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const dispSubsOptions = [
    { text: 'Substitution Allowed', value: 1 },
    { text: 'As Written', value: 2 },
  ];
  const selectedStates = ref([]);
  const items = ['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming'];
  const srcOptions = [
    'Rx-Subjective',
    'Rx-eRx',
    'Rx-Manual/Fax',
    'Supplement-Inventory',
    'Supplement-Subjective',
    'Supplement-Superbill',
    'Supplement',
  ];
  const emit = defineEmits([
  'update:isDrawerOpen',
  'customEvent'
])


const closeNavigationDrawer = () => {
  emit('customEvent', false)  
};
const onSubmit = async() => {
      console.log('tets');
      refForm.value?.validate().then(async({ valid }) => {
        if (valid) {
          emit('addMedican', {
          presherbname:presherbname.value,
          presherbdispdays:presherbdispdays.value,
          presherbdisprefills:presherbdisprefills.value,
          presherbdispsubs:presherbdispsubs.value,
          presherbnotes:presherbnotes.value,
          presherbstarton:presherbstarton.value,
          presherbdisconton:presherbdisconton.value,
          presherbsrc:presherbsrc.value,
          bb:bb.value,
          bx:bx.value,
          bl:bl.value,
          lx:lx.value,
          bd:bd.value,
          dx:dx.value,
          bs:bs.value,
          status:''
          
          })
        }
      });  
  }
  const onSub =() => {
    console.log("selectedStates",selectedStates.value);
  }
  // Doses data
  // const doses = ref([{ amount: '' , type: 'BB'}, { amount: '' , type:'B'}, { amount: '', type:'BL' }, { amount: '' , type:'L' }, { amount: '' , type:'BD' }, { amount: '' , type:'D'}]);
  
  // Methods
  const update = () => {
    // Update logic
  };
  
  const deactivate = () => {
    // Deactivate logic
  };
  
  const deactivateAndCreateNew = () => {
    // Deactivate and create new logic
  };
  
  const deleteEntry = () => {
    // Delete logic
  };
  </script>
  
<template>
    <!-- <v-container> -->
      <v-form  
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit">
        <VCardText>
        <v-row>
            
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="presherbname"
              :rules="[requiredValidator]"
              label="Herb Name"
              maxlength="255"
              placeholder=""
            ></v-text-field>
          
            <v-row class="pt-4" dense>
  <v-col cols="12" md="4">
    <v-select
      v-model="presherbdispdays"
      :items="dispDaysOptions"
      label="Dispense Days"
      placeholder="Select Days"
    ></v-select>
  </v-col>

  <v-col cols="12" md="4">
    <v-select
      v-model="presherbdisprefills"
      :items="dispRefillsOptions"
      label="Refills"
      placeholder="Select Refills"
    ></v-select>
  </v-col>

  <v-col cols="12" md="4">
    <v-select
      v-model="presherbdispsubs"
      :items="dispSubsOptions"
      label="Substitution"
      placeholder="Select Substitution"
      item-title="text"
      item-value="value"
    ></v-select>
  </v-col>
</v-row>

         
            
            <v-row>
              <v-col cols="4" >
                <v-text-field 
                  v-model="bb"
                  label="BB"
                  
                ></v-text-field>
              </v-col>
              <v-col cols="4" >
                <v-text-field 
                  v-model="bx"
                  label="B"
                  
                ></v-text-field>
              </v-col>
              <v-col cols="4" >
                <v-text-field 
                  v-model="bl"
                  label="BL"
                  
                ></v-text-field>
              </v-col>
              <v-col cols="4" >
                <v-text-field 
                  v-model="lx"
                  label="L"
                  
                ></v-text-field>
              </v-col>
              <v-col cols="4" >
                <v-text-field 
                  v-model="bd"
                  label="BD"
                  
                ></v-text-field>
              </v-col>
              <v-col cols="4" >
                <v-text-field 
                  v-model="dx"
                  label="D"
                  
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" class="py-3"> 
                <v-textarea
                v-model="presherbnotes"
                label="Notes"
                placeholder="Notes here.."
                rows="2"
                ></v-textarea>
                </v-col>
            </v-row>    
          </v-col>
  
          <v-col cols="12" sm="6" class="py-3 mb-3">
            <div class="py-3">
            <v-text-field
              v-model="presherbstarton"
              label="Start Date"
              type="date"
              placeholder="YYYY-MM-DD"
            ></v-text-field>
            </div>   
            <div class="py-3">
            <v-text-field
              v-model="presherbdisconton"
              label="Discontinue Date"
              type="date"
              placeholder="YYYY-MM-DD"
            ></v-text-field>
            </div>
            <div class="py-3">
            <v-select
              v-model="presherbsrc"
              :items="srcOptions"
              label="Source"
              placeholder="Select Source"
            ></v-select>
            </div>
          </v-col>
        </v-row>
  
        <v-row>
          <v-col>
            <VBtn
                class="me-3"
                type="submit"
                >
                Save
                </VBtn>
                <VBtn
                  variant="tonal"
                  color="error"
                  class="ml-1"
                  @click="closeNavigationDrawer"
                >
                Close
                </VBtn>
            
            </v-col>
        </v-row>
        </VCardText>
      </v-form>
    <!-- </v-container> -->
  </template>
  
  
  <style scoped>
  /* Add any additional styles here */
  </style>
  