<script setup>
import { useFormsStore } from '@/stores/formsStore';
import loadSignature from '@/views/apps/patient/Intake/app.js';
import { FormeoRenderer } from 'formeo';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import "../../../../../node_modules/formeo/dist/formeo.min.css";
import deepToRaw from '../../../../pages/apps/settings/intake-questions/deepToRaw';
import jsonConvert from '../../../../pages/apps/settings/intake-questions/jsonConvert.js';
const formsStore = useFormsStore()

const refVForm = ref()
const intakeSettingForm = ref()
const store = useStore()
const isLoading = ref(false)
const isTonalSnackbarVisible = ref(false)
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
  selectedFormId: {
    type: Number,
    required: true,
  },
  storedData: {
    type: Object,
    required: true,
  },
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isDataEnable: {
    type: Boolean,
  }
})
const name = ref(null)
let renderer = null
let formData = null
let id = props.selectedFormId;
const data = ref({})
let tempData = null
const viewSchema = ref([])
onMounted(async () => {
  console.log('props.selectedFormId', props.selectedFormId)
  await formsStore.getQuestionnaireFormDataById(id)
  data.value = formsStore.questionnaireFormData
  name.value = data.value?.name
  const controlOptions = {
    disable: {
      elements: ['number'],
      groups: ['layout'],
      formActions: true,
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
  console.log("props.storedData.data", props.storedData.data)
  tempData = setFieldValues(props.storedData.data, jsonConvert(deepToRaw(formsStore.questionnaireFormData.data)))
  // console.log('tempData>>',tempData,jsonConvert(deepToRaw(formsStore.getIntakeFormData.data)))
  let filedData = Object.values(tempData.fields)
  viewSchema.value = getOrderedFieldNamesWithLabels(tempData)
  console.log(viewSchema.value)
  for (let data in filedData) {
    let field = filedData[data]
    if (field.tag === 'signature-pad') {
      field.children[0].children[1].attrs.name = field.attrs.name
      field.action = {
        render: (node) => {
          console.log(node)
          loadSignature(node)
        }
      }
    }
  }
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
      switch (field.tag) {
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
  'patientData',
  'closePopup'
]);

const submitForm = async () => {
  const formData = new FormData(intakeSettingForm.value)
  // const fileFields = intakeSettingForm.value.querySelectorAll('input[type="file"]')

  // // Create an object to store non-file form data
  // const formDataObj = {}

  // // Get all file field names
  // const fileFieldNames = Array.from(fileFields).map(field => field.name)

  // // Handle regular form fields, excluding fields that have files
  // for (const [key, value] of formData.entries()) {
  //   if (!fileFieldNames.includes(key) && !key.includes('[]')) {
  //     formDataObj[key] = value
  //   }
  // }

  // // Create final FormData for submission
  // const finalFormData = new FormData()

  // // Add JSON stringified non-file form data
  // finalFormData.append('form_data', JSON.stringify(formDataObj))

  // // Add files directly to FormData
  // fileFields.forEach(fileField => {
  //   const fieldName = fileField.name
  //   const files = fileField.files

  //   if (files.length > 0) {
  //     if (fieldName.includes('[]')) {
  //       Array.from(files).forEach(file => {
  //         finalFormData.append(fieldName, file)
  //       })
  //     } else {
  //       finalFormData.append(fieldName, files[0])
  //     }
  //   }
  // })

  // Add other required fields
  formData.append('pid', props.patient.id)
  formData.append('form_id', id)
  formData.append('schema', JSON.stringify(viewSchema.value))
  try {
    await formsStore.savePatientIntakeForm(formData)
    formsStore.isDialog = false
    isTonalSnackbarVisible.value = true
    emit('closePopup', false)
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}
function getOrderedFieldNamesWithLabels(schema) {
  const orderedFields = [];

  // Traverse stages
  for (const stageId in schema.stages) {
    const stage = schema.stages[stageId];
    // Traverse rows in the stage
    stage.children.forEach(rowId => {
      const row = schema.rows[rowId];
      // Traverse columns in the row
      row.children.forEach(columnId => {
        const column = schema.columns[columnId];
        // Traverse fields in the column
        column.children.forEach(fieldId => {
          const field = schema.fields[fieldId];
          // Add the field name and label to the ordered list
          const fieldName = field.attrs.name

          orderedFields.push({
            name: field.attrs.name,
            label: field.config.label,
            type: field?.attrs.type || field?.config.controlId
          });

        });
      });
    });
  }

  return orderedFields;
}
</script>

<template>




  <VCard flat>
    <VCardText>
      <form ref="intakeSettingForm" @submit.prevent="submitForm">
        <VRow>
          <VCol cols="12">
            <h3 class="ml-2 mb-2">{{ name }}</h3>
          </VCol>

          <VCol cols="12">
            <div class="mt-2 formeo-wrap" ref="refVForm"></div>
          </VCol>

        </VRow>

        <VRow class="mt-2">
          <VCol cols="4">
            <VBtn type="submit">Save</VBtn>
          </VCol>
        </VRow>
      </form>
    </VCardText>
  </VCard>



</template>
<style></style>
