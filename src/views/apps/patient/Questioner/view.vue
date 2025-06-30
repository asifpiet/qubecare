<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { FormeoRenderer } from 'formeo';
import { onMounted, ref } from 'vue';
import "../../../../../node_modules/formeo/dist/formeo.min.css";
import deepToRaw from '../../../../pages/apps/settings/intake-questions/deepToRaw';
import jsonConvert from '../../../../pages/apps/settings/intake-questions/jsonConvert.js';

const formsStore = useFormsStore()
const refVForm = ref()
const intakeSettingForm = ref()
const isLoading = ref(false)
const isTonalSnackbarVisible = ref(false)
const fullName = ref();
const props = defineProps({
    patient: {
        type: Object,
        required: true,
    },
    isDrawerOpen: {
        type: Boolean,
        required: true,
    },
    isDataEnable: {
        type: Boolean,
    },
    intakefieldData: {
        type: Object,
    }

})
const fullname = computed(() => {
    fullName.value = props.patient.firstName + ' ' + props.patient.lastName;
})
const name = ref(null)
let renderer = null
let formData = null
let id = props.intakefieldData.form_id;
let fdata = props.intakefieldData.data;
const data = ref({})
const storedData = ref({})
let tempData = null

onMounted(async () => {
    console.log('fdata', fdata);
    storedData.value = fdata

    await formsStore.getQuestionnaireFormDataById(id)
    data.value = formsStore.questionnaireFormData
    name.value = data.value?.name
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
    tempData = setFieldValues(fdata.data, jsonConvert(deepToRaw(formsStore.questionnaireFormData.data)))
    // console.log('tempData>>',tempData,jsonConvert(deepToRaw(store.getters.getIntakeFormData.data)))
    renderer = new FormeoRenderer(options)
    renderer.render(tempData)
})

const setFieldValues = (inputData, jsonData) => {
    // Deep clone to avoid reactivity issues
    const modifiedJsonData = JSON.parse(JSON.stringify(jsonData));

    Object.keys(modifiedJsonData.fields).forEach(key => {
        const field = modifiedJsonData.fields[key];
        const fieldName = field.attrs.name;
        if (inputData && inputData[fieldName] != null) {
            // Try multiple ways of setting the value
            field.attrs.value = inputData[fieldName];
            field.value = inputData[fieldName];

            // Specific handling for different field types
            switch (field.tag) {
                case 'textarea':
                    field.attrs.innerHTML = inputData[fieldName];
                    field.innerHTML = inputData[fieldName];
                    break;
                case 'input':
                    field.attrs.value = inputData[fieldName];
                    break;
            }
        }
    });
    return modifiedJsonData;
};

const emit = defineEmits([
    'closeForm',
    'patientData',
    'closePopup'
]);



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
    <VSnackbar v-model="isTonalSnackbarVisible" location="top end" variant="flat" color="success">
        Intake saved.
    </VSnackbar>


    <VCard flat>
        <VCardText>
            <form ref="intakeSettingForm" @submit.prevent="">
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
                        <div class="mt-2 formeo-wrap" ref="refVForm"></div>
                    </VCol>

                </VRow>

                <!-- <VRow class="mt-2">  
                    <VCol cols="4">  
                        <VBtn type="submit">Save</VBtn> 
                    </VCol> 
                </VRow> -->
            </form>
        </VCardText>
    </VCard>



</template>
<style></style>
