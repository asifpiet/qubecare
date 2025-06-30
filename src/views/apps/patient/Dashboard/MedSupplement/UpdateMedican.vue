<script setup>
  import { computed, ref } from 'vue';
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
  const status =ref();
  // Options for selects
  const dispDaysOptions = [1, 5, 7, 10, 14, 30, 40, 60, 90, 120];
  const dispRefillsOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const dispSubsOptions = [
    { text: 'Substitution Allowed', value: 1 },
    { text: 'As Written', value: 2 },
  ];
  const props = defineProps({
    medSupplementData:{
      type:Object,
      require:true
    }
  });
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
}
const prescriptions_id = ref();
const medSupplementData = computed(() => {
    console.log("props",props.medSupplementData);
      if(props.medSupplementData){
          presherbname.value =  props.medSupplementData.drug,
          presherbdispdays.value = props.medSupplementData.presherb_dispense_days,
          presherbdisprefills.value = props.medSupplementData.refills,
          presherbdispsubs.value = props.medSupplementData.presherb_dispense_subtitution,
          presherbnotes .value = props.medSupplementData.note,
          presherbstarton .value =props.medSupplementData.start_date,
          presherbdisconton .value =props.medSupplementData.end_date,
          presherbsrc .value =props.medSupplementData.presherb_src,
          bb.value = props.medSupplementData.BB,
          bx.value = props.medSupplementData.B,
          bl.value = props.medSupplementData.BL,
          lx.value = props.medSupplementData.L,
          bd.value =props.medSupplementData.BD,
          dx.value =props.medSupplementData.D,
          // bs.value =props.medSupplementData,
          status.value = props.medSupplementData.status,
          prescriptions_id.value = props.medSupplementData.prescriptions_id
      }    
});
const onSubmit = async() => {
      console.log('tets');
      refForm.value?.validate().then(async({ valid }) => {
        if (valid) {
          emit('updateMedican', {
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
          status:status.value,
          prescriptions_id: prescriptions_id.value
          
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
      <div v-if="medSupplementData"></div>
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
              placeholder="Herb Name"
            ></v-text-field>
          
            <!-- <v-col cols="12" sm="6">  -->
            <!-- <v-select
              v-model="presherbdispdays"
              :items="dispDaysOptions"
              label="Dispense Days"
              placeholder="Select Days"
            ></v-select>
  
            <v-select
              v-model="presherbdisprefills"
              :items="dispRefillsOptions"
              label="Refills"
              placeholder="Select Refills"
            ></v-select>
  
            <v-select
              v-model="presherbdispsubs"
              :items="dispSubsOptions"
              label="Substitution"
              placeholder="Select Substitution"
            ></v-select> -->
          <!-- </v-col> -->
          <v-row class="pt-4">
          <v-col cols="4">
            <v-select
              v-model="presherbdispdays"
              :items="dispDaysOptions"
              label="Dispense Days"
              placeholder="Select Days"
            ></v-select>
          </v-col>
  
          <v-col cols="4">
            
            <v-select
              v-model="presherbdisprefills"
              :items="dispRefillsOptions"
              label="Refills"
              placeholder="Select Refills"
            ></v-select>
          </v-col>
  
          <v-col cols="4">
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
            <div class="py-3">
            <v-select
              v-model="status"
              :items="['Active', 'Inactive']"
              label="Status"
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
                Udpate
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
  