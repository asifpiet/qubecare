<script setup>
import { dateFormate } from '@/plugins/globalFunctions';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
const store = useStore()
const isFormValid = ref(false)
const  isLoading = ref(false)
const refForm = ref()
const name = ref()
const typeOfItem= ref()
const lastDate = ref()
const nextDate = ref()
const screeningDetails = ref()
const flag = ref()
const id = ref();
const patientId =ref();
const medical_prob_id = ref(); 
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  healthMantainceData:{
    type: Array,
  }
})

const viewHealthMantaince = computed(async() => {
  console.log("healthMantainceDataEdit",props.healthMantainceData);
  if(props.healthMantainceData){

  medical_prob_id.value = props.healthMantainceData.medical_prob_id;
  name.value = props.healthMantainceData.title;
  typeOfItem.value = props.healthMantainceData.type_of_item;
  lastDate.value = dateFormate(props.healthMantainceData.begdate);
  nextDate.value = dateFormate(props.healthMantainceData.enddate);
  screeningDetails.value = props.healthMantainceData.screening_detail;
  flag.value = props.healthMantainceData.flag;
  patientId.value = props.healthMantainceData.uuid;
  
  return true;
  }
});
const emit = defineEmits([
  'closeForm',
  'patientData'
]);

const closeNavigationDrawer = () => {
  
  emit('update:isDrawerOpen', false)  
  emit('reset-form')
  
  
}
const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const onSubmit = async() => {
  isLoading.value = true
  refForm.value?.validate().then(async({ valid }) => {
    if (valid) {
      const newEntryId = Date.now();
      // let heathMantaince = store.getters.getPatientPorfile.healthMantaince;
      
      emit('updateHealthMantaince', {
          medical_problem_id:medical_prob_id.value, 
          name:name.value,
          typeOfItem:typeOfItem.value,
          lastDate:lastDate.value,
          nextDate: nextDate.value,
          screeningDetails: screeningDetails.value,
          flag: flag.value,
          patientId: patientId.value
        })
      
         
    }
  })
  
}
</script>

<template>
    <div v-if="viewHealthMantaince"></div>
    <VNavigationDrawer
    temporary
    :width="800"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
   
  >
    
    <AppDrawerHeaderSection
      title="Edit Health Maintenance"
      @cancel="closeNavigationDrawer"
    />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
            
              <VForm
                ref="refForm"
                v-model="isFormValid"
            >
            <VRow>
              <VCol cols="6">
                <AppTextField
                  v-model="name"
                  :rules="[requiredValidator]"
                  label="Health Maintenance Name"
                  placeholder="Health Maintenance Name"
                 
                  
                />
              </VCol>
              <VCol cols="6">
                <AppSelect
                  v-model="typeOfItem"
                  :rules="[requiredValidator]"
                  label="Type Of Item"
                  placeholder="Type Of Item"
                  :items="['BP Screening', 'Breast  Screening' ,'Cervical  Screening', 'Colorectal Screening', 'COPD Screening',
                    'Diabetes Eye Exam',
                    'Hyptertension Screening',
                    'Ovarian Screening',
                    'Prostate Screening',
                    'Skin Screening',
                    'Thyroid Screening',
                    'Custom'
                  ]"
                />
                </VCol>

                <VCol cols="6">
                <AppTextField
                  v-model="lastDate"
                  :rules="[requiredValidator]"
                  type="date"
                  label="Last Date"
                  placeholder="Last Date"
                  
                  
                />
                </VCol>
                
                <VCol cols="6">
                <AppTextField
                  v-model="nextDate"
                  :rules="[requiredValidator]"
                  type="date"
                  label="Next Date"
                  placeholder="Next Date"
                  
                  
                />
                </VCol>
                
              <VCol cols="12">
                <v-textarea
                  v-model="screeningDetails"
                  :rules="[requiredValidator]"
                  label="Screening Details"
                  placeholder="Screening Details"
                />
              </VCol>
              <VCol cols="12">
                <p>Flag</p>
                <VRadioGroup
                    v-model="flag"
                    inline
                >
                    <VRadio
                    label="Normal"
                    value="Normal"
                    />
                    <VRadio
                    label="Monitored"
                    value="Monitored"
                    />
                    <VRadio
                    label="Alert"
                    value="Alert"
                    />
                </VRadioGroup>
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
            
         </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
