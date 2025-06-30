<script setup>
import Demographic from '@/views/apps/patient/edit/Demographic.vue';
// import EligibilityCheck from '@/views/apps/patient/edit/EligibilityCheck.vue';
import Insurance from '@/views/apps/patient/edit/Insurance.vue';
import NextOfKin from '@/views/apps/patient/edit/NextOfKin.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
const currentTab = ref('0')
const fetchEditPatientData = ref()
onBeforeMount(()=>{

});
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  
})
const emit = defineEmits([
  'closeForm',
  'patientData',
  'closePatientForm'
]);

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)  
  emit('closePatientForm');
}
const addNewUser = async userData => {
  console.log('UserDataDrawn', userData);
  emit('userData',userData);
  emit('update:isDrawerOpen', true)
  if(userData.checkIsFormOpen == 'saveClose'){
    emit('update:isDrawerOpen', false)
  }
}

const updateNewUser = async userData => {
  console.log('UserDataDrawn', userData);
  emit('updateUserData',userData);
  emit('update:isDrawerOpen', true)
  if(userData.checkIsFormOpen == 'saveClose'){
    emit('update:isDrawerOpen', false)
  }
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

//watch(
  //fetchEditPatientData.value = '';
//   () => props.isPatient,
//   (newUser) => {
//     if (newUser) {
//       fetchEditPatientData.value = newUser;
//       console.log("fetchEditPatientData",fetchEditPatientData.value);
//     }
//   },
//   { immediate: true }
// );
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="800"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
   
  >
    
    <AppDrawerHeaderSection
      title="Edit Patient Profile"
      @cancel="closeNavigationDrawer"
    />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <VTabs
            v-model="currentTab"
            class="v-tabs-pill"
          >
            <VTab>Demographic</VTab>
            <VTab >Next of Kin</VTab>
            <VTab>Insurance</VTab>
            <!-- <VTab>Sec Insurance</VTab> -->
            <!-- <VTab>Payment</VTab> -->
            <!-- <VTab>Eligibility Check</VTab> -->
            <!-- <VTab>Pre Auth</VTab> -->
          </VTabs>
          <VDivider class="mt-3"/>
            <VCardText>
              <VWindow v-model="currentTab">
                <VWindowItem
                  key="1"
                >
                <Demographic
                  @patientData=updateNewUser  
                  @customEvent="closeNavigationDrawer"
                
                />
                </VWindowItem>
                <VWindowItem
                  key="2"
                >
                  <NextOfKin 
                  @patientData=updateNewUser 
                  @customEvent="closeNavigationDrawer"  />
                </VWindowItem>
                <VWindowItem
                  key="3"
                >
                 <Insurance 
                 @patientData=updateNewUser  
                 @customEvent="closeNavigationDrawer"   
                 />
                </VWindowItem>
                <!-- <VWindowItem
                  key="4"
                >
                  <SecInsurance  
                  @patientData=updateNewUser  
                  @customEvent="closeNavigationDrawer" 
                  />
                </VWindowItem> -->
                <!-- <VWindowItem
                  key="5"
                >
                  <Payment 
                  @patientData=updateNewUser  
                  @customEvent="closeNavigationDrawer"  />
                </VWindowItem> -->
                <!-- <VWindowItem
                  key="4"
                >
                 <EligibilityCheck  
                 @patientData=updateNewUser  
                 @customEvent="closeNavigationDrawer" />
                </VWindowItem> -->
                <!-- <VWindowItem
                  key="7"
                >
                  <PreAuth 
                  @patientData=updateNewUser  
                  @customEvent="closeNavigationDrawer"
                  />
                </VWindowItem> -->
              </VWindow>
            </VCardText>
         </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
