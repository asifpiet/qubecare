<script setup>
import { FormeoRenderer } from 'formeo';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import "../../../../../node_modules/formeo/dist/formeo.min.css";
import deepToRaw from '../../../../pages/apps/settings/intake-questions/deepToRaw';
import jsonConvert from '../../../../pages/apps/settings/intake-questions/jsonConvert.js';

const route = useRoute();

const refVForm = ref()
const consentForm = ref()
const store = useStore()
const isLoading = ref(false)
const searchQuery = ref('')
const isTonalSnackbarVisible = ref(false)
const isSelectLabDialogVisible = ref(false)
const itemsPerPage = ref(10)
const fullName = ref();
const consentform = ref([])
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isDataEnable:{
    type: Boolean,
  }
})
const fullname =  computed(() => {
    fullName.value = store.getters.getPatientPorfile.firstName+' '+store.getters.getPatientPorfile.lastName;
    
     console.log("fullname",fullName.value);
})
const name = ref(null)
const description = ref(null)
const yourName = ref(null)
const signature = ref(null)
let renderer = null
let formData = null
let formId = store.getters.getConsentFormId;
let patientConsentFormItem = store.getters.getPatientConsentFormItem;
let practitionerId = store.getters.getPractitionerId;
const data = ref({})
const form = ref()
let tempData = null

onMounted(async () => {
    
    await store.dispatch('getSubmittedIntakeFormData',{
        form_id:store.getters.getPatientConsentFormItem.form_id,
        type: store.getters.getPatientConsentFormItem.type
    });
    form.value = store.getters.getSubmittedIntakeForm

    
    name.value = patientConsentFormItem?.form_name
    description.value = store.getters.getSubmittedIntakeForm?.description
    yourName.value = patientConsentFormItem?.name
    signature.value = patientConsentFormItem?.signature
    const controlOptions = {
        disable: {
            elements: ['number'],
            groups: ['layout'],
            formActions: true, // cancel and save buttons will not be shown
            // formActions: ['clearBtn'], // only the clear button will be disabled
        },
    }
    let options = {
        renderContainer: refVForm.value,
        controls: controlOptions,
        elements: {},
        config: {
            SCOPE_SUPERTYPE: {
                SCOPE_SUBTYPE: {
                    SETTING_PART: {}
                }
            }
        },

    }
    tempData = setFieldValues(patientConsentFormItem.data,jsonConvert(deepToRaw(store.getters.getSubmittedIntakeForm.data)))
    // console.log('tempData>>',tempData,jsonConvert(deepToRaw(store.getters.getConsentFormData.data)))
    renderer = new FormeoRenderer(options)
    renderer.render(tempData)
})

const setFieldValues = (inputData, jsonData) => {
    // Deep clone to avoid reactivity issues
    const modifiedJsonData = JSON.parse(JSON.stringify(jsonData));

    Object.keys(modifiedJsonData.fields).forEach(key => {
        const field = modifiedJsonData.fields[key];
        const fieldName = field.attrs.name;
        if (inputData && inputData.data[fieldName] != null) {
            // Try multiple ways of setting the value
            field.attrs.value = inputData.data[fieldName];
            field.value = inputData.data[fieldName];
            
            // Specific handling for different field types
            switch(field.tag) {
                case 'textarea':
                    field.attrs.innerHTML = inputData.data[fieldName];
                    field.innerHTML = inputData.data[fieldName];
                    break;
                case 'input':
                    field.attrs.value = inputData.data[fieldName];
                    break;
            }
        }
    });
    return modifiedJsonData;
};

const emit = defineEmits([
  'closeForm',
  'patientData'
]);

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)  
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

</script>

<template>
    <div v-if="fullname"></div>
    
    <VDialog v-model="isLoading" width="110" height="150" color="primary">
        <VCardText class="" style="color: white !important;">
          <div class="demo-space-x">
            <VProgressCircular :size="40" color="primary" indeterminate />
          </div>
        </VCardText>
      </VDialog>
      <VSnackbar
      v-model="isTonalSnackbarVisible"
      location="top end"
      variant="flat"
      color="success"
    >
    Consent saved.
    </VSnackbar>
    
    <!-- <VNavigationDrawer
    temporary
    :width="800"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
   
  > -->
 
    <!-- <AppDrawerHeaderSection
      :title='"Consent ("+fullName+")"' 
      @cancel="closeNavigationDrawer"
    /> -->

    <!-- <VDivider /> -->

    <!-- <PerfectScrollbar :options="{ wheelPropagation: false }"> -->
      <!-- <VCard flat>
        <VCardText>   -->
            <form ref="consentForm" @submit.prevent="submitForm">
                <VRow>  
                    <VCol cols="12">  
                        <h3 class="ml-2 mb-2">{{ name }}</h3>
                        <!-- <AppTextField  
                            v-model="name"  
                            label="Form Name"  
                            placeholder="e.g. Weight Loss"  
                            :rules="[requiredValidator]" 
                            disabled 
                        />   -->
                    </VCol>
                    <VCol cols="12">
                        <div v-html="description" style="border: 1px solid silver;border-radius: 5px;min-height: 200px;padding: 5px;"></div>
                    </VCol>
                    
                    <VCol cols="12">
                        <div class="mt-2 formeo-wrap" ref="refVForm" ></div>
                    </VCol>
                    <VCol cols="12" v-if="yourName">
                        <AppTextField  
                            v-model="yourName"  
                            label="Your Name"  
                            placeholder=""  
                            :rules="[requiredValidator]" 
                        />
                    </VCol>
                    <VCol cols="12" v-if="signature"><img :src="signature"/></VCol>

                </VRow>
                
            </form>    
         <!-- </VCardText>
      </VCard> -->
      
      
    <!-- </PerfectScrollbar> -->
  <!-- </VNavigationDrawer> -->
</template>
<style>
</style>
