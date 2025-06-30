<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import Demographic from './components/Demographic.vue';
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
  'patientData'
]);

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)  
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
      title="Edit Patient"
      @cancel="closeNavigationDrawer"
    />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- <VTabs
            v-model="currentTab"
            class="v-tabs-pill"
          >
            <VTab>Demographic</VTab>
          </VTabs>
          <VDivider class="mt-3"/> -->
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
              </VWindow>
            </VCardText>
         </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
