<script setup>
import Demographic from '@/views/apps/user/list/Demographic.vue';
import EligibilityCheck from '@/views/apps/user/list/EligibilityCheck.vue';
import Insurance from '@/views/apps/user/list/Insurance.vue';
import NextOfKin from '@/views/apps/user/list/NextOfKin.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
const store = useStore()
const isDisable = ref(true);
const currentTab = ref('0')
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isDataEnable:{
    type: Boolean,
  }
})
onBeforeMount(() => {
  console.log("isDataEnable",props.isDataEnable);
})
const isTabEnable = computed(() => {
  isDisable.value = true;
});

const emit = defineEmits([
  'closeForm',
  'patientData'
]);

const closeNavigationDrawer = () => {
  currentTab.value = 0;
  emit('update:isDrawerOpen', false)  
  emit('reset-form')
  TabsUpdate();
  
}

const addNewUser = async userData => {
  console.log('UserDataDrawn', userData);
  emit('userData',userData);
  isDisable.value = false;
  emit('update:isDrawerOpen', true)
  if(userData.checkIsFormOpen == 'saveClose'){
    currentTab.value = 0;
    emit('update:isDrawerOpen', false)
  }
  await nextTick();
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

const TabsUpdate = async() => {
  isDisable.value  = true;
  currentTab.value = 0;
  await store.dispatch('savePatientPorfile', {
      patientId: null,
      firstName: null,
      lastName:null
  }) 
}
</script>

<template>
  <div v-if="isTabEnable"></div>
  <VNavigationDrawer
    temporary
    :width="800"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
   
  >
    
    <AppDrawerHeaderSection
      title="Add Patient Profile"
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
            <VTab>Demographic Test</VTab>
            <VTab :disabled="isDisable">Next of Kin</VTab>
            <VTab :disabled="isDisable">Insurance</VTab>
            <!-- <VTab :disabled="isDisable">Sec Insurance</VTab> -->
            <!-- <VTab :disabled="isDisable">Payment</VTab> -->
            <VTab :disabled="isDisable">Eligibility Check</VTab>
            <!-- <VTab :disabled="isDisable">Pre Auth</VTab> -->
          </VTabs>
            <VCardText>
              <VWindow v-model="currentTab">
                <VWindowItem
                  key="1"
                >
                <Demographic  @patientData=addNewUser  
                  @customEvent="closeNavigationDrawer"
                  @UpdateTab="TabsUpdate"
                  @reset-form="resetForm"
                  
                />
                </VWindowItem>
                <VWindowItem
                  key="2"
                >
                  <NextOfKin  @patientData=updateNewUser  
                  @customEvent="closeNavigationDrawer"  />
                </VWindowItem>
                <VWindowItem
                  key="3"
                >
                 <Insurance  @patientData=updateNewUser  
                 @customEvent="closeNavigationDrawer"   
                 />
                </VWindowItem>
                <!-- <VWindowItem
                  key="4"
                >
                  <SecInsurance   @patientData=updateNewUser  
                  @customEvent="closeNavigationDrawer" 
                  />
                </VWindowItem> -->
                <!-- <VWindowItem
                  key="4"
                >
                  <Payment   @patientData=updateNewUser  
                  @customEvent="closeNavigationDrawer"  />
                </VWindowItem> -->
                <VWindowItem
                  key="4"
                >
                 <EligibilityCheck     @patientData=updateNewUser  
                 @customEvent="closeNavigationDrawer" />
                </VWindowItem>
                <!-- <VWindowItem
                  key="7"
                >
                  <PreAuth  @patientData=updateNewUser  
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
