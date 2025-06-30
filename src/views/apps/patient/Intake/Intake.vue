<script setup>
import { useFormsStore } from '@/stores/formsStore';
import loadSignature from '@/views/apps/patient/Intake/app.js';
import initializeDragDropFileUpload from '@/views/apps/patient/Intake/dragDropFileUpload.js';
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';
import { FormeoRenderer } from 'formeo';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
//import "../../../../../node_modules/formeo/dist/formeo.min.css";
import deepToRaw from '../../../../pages/apps/settings/intake-questions/deepToRaw';
import jsonConvert from '../../../../pages/apps/settings/intake-questions/jsonConvert.js';
const formsStore = useFormsStore()
const refVForm = ref()
const viewSchema = ref([])
const intakeSettingForm = ref()
const store = useStore()
const isLoading = ref(false)
const isTonalSnackbarVisible = ref(false)
const { currentUser, isAuthenticated } = useAuth()
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
  selectedPractitionerId: {
    type: Number,
    required: false,
  },
  isDrawerOpen: {
    type: Boolean,
    required: false,
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
let practitionerId = props.selectedPractitionerId ? props.selectedPractitionerId : null;
const pdfContainer = ref(null);
const signatureData = ref(null);
let fdata = null

function formatPhoneNumber(input) {
  // Remove all non-digit characters
  let phoneNumber = input.value.replace(/\D/g, '');

  // Apply the USA phone number format: (123) 456-7890
  if (phoneNumber.length > 3 && phoneNumber.length <= 6) {
    phoneNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else if (phoneNumber.length > 6) {
    phoneNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }

  // Update the input value
  input.value = phoneNumber;
}

onMounted(async () => {
  console.log('props.selectedFormId', props.selectedFormId, currentUser.value)
  isLoading.value = true
  await formsStore.getIntakeFormDataById(id)

  data.value = formsStore.intakeFormData
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
  if (data.value.type === 'simple-forms') {
    await formsStore.getPatientIntakeSimpleFormsData(id, props.patient.id, currentUser.value)
    fdata = formsStore.patientIntakeFormData
    console.log('ccc', fdata)
    let schemaData = formsStore.orginal_schema
    tempData = setFieldValues1(fdata, jsonConvert(deepToRaw(schemaData)))
  } else {
    tempData = jsonConvert(deepToRaw(formsStore.intakeFormData.data))

  }

  console.log('tempData>>', tempData)
  // console.log('tempData>>',tempData,jsonConvert(deepToRaw(formsStore.getIntakeFormData.data)))
  console.log(tempData.fields)
  let filedData = Object.values(tempData.fields)
  viewSchema.value = getOrderedFieldNamesWithLabels(tempData)
  console.log(viewSchema.value)
  for (let data in filedData) {
    let field = filedData[data]

    if (field.tag === 'signature-pad') {
      field.children[0].children[1].attrs.name = field.attrs.name
      if (!field.children[0].children[0].attrs) {
        field.children[0].children[0].attrs = {};
      }
      field.children[0].children[0].attrs.width = 750;
      field.children[0].children[0].attrs.height = 150;
      field.action = {
        render: (node) => {
          console.log(node)
          const { getData } = loadSignature(node, currentUser.value, signatureData);
          // Update signatureData initially
          signatureData.value = getData();
        }
      }
    }


    if (field.tag === 'drag-drop-file') {
      field.action = {
        render: (node) => {
          console.log('Rendering tag-input field:', node);
          initializeDragDropFileUpload(node);
        },
      };
    }
    if (field.config.controlId === 'tag-input') {
      field.action = {
        render: (node) => {
          console.log('Rendering tag-input field:', node);
          new Tagify(node, {
            whitelist: [], // Optional: Predefined list of tags
            dropdown: {
              enabled: 0, // Show dropdown after typing
            },
          });
        },
      };
    }
    if (field.attrs?.name === 'patient_extra_data_preferred_phone') {
      field.action = {
        render: (node) => {
          console.log('Rendering preferred phone field:', node);

          // Format the phone number on input
          node.addEventListener('input', (event) => {
            formatPhoneNumber(event.target);
          });

          // Format the phone number if it has a pre-filled value
          if (node.value) {
            formatPhoneNumber(node);
          }
        },
      };
    }
    if (field.tag === 'input' && field.attrs?.type === 'checkbox') {

      field.action = {
        render: (node) => {
          console.log('Rendering checkbox field:', node);

          // Set required attribute on the actual DOM element
          if (field.attrs.required) {
            node.required = true;
          }


        }
      };
    }

  }

  // Object.entries(tempData.fields).forEach(field => {



  //   if (field[1].tag === 'signature-pad') {
  //     field[1].children[0].children[1].attrs.name = field[1].attrs.name
  //     field[1].action = {
  //       render: (node) => {
  //         console.log(node)


  //         loadSignature(node)
  //       }
  //     }
  //   }


  // });

  console.log(options)
  renderer = new FormeoRenderer(options)
  renderer.render(tempData)

  addFileInputListeners()
  isLoading.value = false
})
function getSelectedObject(options) {
  return options.find(option => option.selected);
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

          if (field.tag == 'h1') {
            console.log(field.attrs.tag)
            orderedFields.push({
              name: field.attrs.name,
              label: field?.content,
              type: field?.attrs.type || field?.config.controlId,
              tag: Array.isArray(field.attrs.tag) ? getSelectedObject(field.attrs.tag).value : field.attrs.tag,
              content: field?.content
            });
          } else if (field?.tag == 'p') {
            orderedFields.push({
              name: field.attrs.name,
              label: field?.content,
              type: field?.attrs.type || field?.config.controlId,
              tag: field.tag,
              content: field?.content
            });
          } else {
            orderedFields.push({
              name: field.attrs.name,
              label: field.config.label,
              type: field?.attrs.type || field?.config.controlId,
              tag: field.tag,
              content: ""
            });
          }


        });
      });
    });
  }

  return orderedFields;
}
const setFieldValues1 = (inputData, jsonData) => {
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
          console.log(field.attrs)
          field.attrs.innerHTML = inputData[fieldName];
          field.innerHTML = inputData[fieldName];



          break;
        case 'input':
          if (field.attrs.type === "checkbox") {
            // Checkbox: mark checked if the value is truthy
            const fieldIndexInMerged = field.options.findIndex(val => val.value === inputData[fieldName]);
            field.options[fieldIndexInMerged].checked = true;
            //field.options[fieldIndexInMerged].disabled = true;
          } else if (field.attrs.type === "radio") {
            const fieldIndexInMerged = field.options.findIndex(val => val.value === inputData[fieldName]);
            field.options[fieldIndexInMerged].selected = true;
          }
          break;
        default:
          // Default case for other field types
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

const submitForm = async () => {
  console.log(intakeSettingForm.value);

  if (signatureData.value?.signature?.required) {
    addAlert('Please provide a valid signature before submitting the form.', 'error'); // Or use a better notification system
    return; // Stop the form submission
  }
  const formData = new FormData(intakeSettingForm.value)

  formData.append('pid', props.patient.id)
  formData.append('form_id', id)
  //formData.append('schema', JSON.stringify(viewSchema.value))
  formData.append('orginal_form_schema', JSON.stringify(tempData))
  if (signatureData.value) {
    console.log(JSON.stringify(signatureData.value?.signature?.imageData));
    formData.append('signatureMetaData', JSON.stringify(signatureData.value.signature.metadata))
  }

  // if (data.value?.type == 'consent-forms') {
  //   const pdfBlob = await generatePDFFromView();
  //   console.log(pdfBlob)

  //   if (pdfBlob) {

  //     formData.append('pdf_file', pdfBlob);
  //   }
  // }

  if (practitionerId) {
    formData.append('practitioner_id', practitionerId)
  }
  try {
    await formsStore.savePatientIntakeForm(formData)
    formsStore.isDialog = false
    isTonalSnackbarVisible.value = true
    emit('closePopup', false)
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

const handleFileChange = (event) => {
  const fileInput = event.target
  const fieldName = fileInput.name
  console.log(`Files selected for ${fieldName}:`, fileInput.files)
}

const addFileInputListeners = () => {
  const fileInputs = intakeSettingForm.value?.querySelectorAll('input[type="file"]')
  fileInputs?.forEach(input => {
    input.addEventListener('change', handleFileChange)
  })
}

// const submitForm = async () => {
//   formData = new FormData(intakeSettingForm.value)
//   console.log('formData', Object.fromEntries(formData.entries()), renderer)
//   await formsStore.savePatientIntakeForm({
//     pid: props.patient.id,
//     form_id: id,
//     data: Object.fromEntries(formData.entries()),
//   })
//   formsStore.isDialog = false
//   emit('closePopup', false)
// };

</script>

<template>

  <!-- <VProgressLinear indeterminate color="primary" v-if="isLoading" /> -->
  <!-- <VSnackbar v-model="isTonalSnackbarVisible" location="top end" variant="flat" color="success">
    Intake saved.
  </VSnackbar> -->


  <VCard flat>

    <VCardText>

      <form ref="intakeSettingForm" @submit.prevent="submitForm" enctype="multipart/form-data">
        <VRow>
          <VCol cols="12">


            <h3 class="ml-2 mb-2">{{ name }}</h3>
          </VCol>

          <VCol cols="12">
            <div class="mt-2 formeo-wrap" ref="refVForm"></div>
          </VCol>

        </VRow>

        <VRow class="mt-2" v-if="!isLoading">
          <VCol cols="4">
            <VBtn type="submit" class="submit-button">{{ $t('Save') }}</VBtn>
          </VCol>
        </VRow>
      </form>
    </VCardText>
  </VCard>



</template>
<style>
.formeo-wrap input[type="file"] {
  display: block;
  margin: 8px 0;
}

.formeo input[type=date] {
  max-width: 100% !important;
  display: block;
}

.drag-drop-container {
  border: 2px dashed rgb(73 163 140 / 0.3);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  max-width: 400px;
  margin: 0 auto;
}

.drag-drop-area {
  position: relative;
}

.drag-drop-area.dragover {
  border-color: #007bff;
  background-color: #f0f8ff;
}

.drag-drop-area p {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.file-types {
  font-size: 14px;
  color: #888;
  margin-top: 5px;
}

.file-list {
  margin-top: 10px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px solid #eee;
}

.file-size {
  color: #888;
  font-size: 14px;
}
</style>
<style scoped>
::v-deep(.canvas-wrapper canvas) {
  border: 1px dashed #49a38c;
  border-radius: 5px;
}

:deep(.signature-pad) {
  width: 100%;
  height: 148px;
  cursor: crosshair;
  touch-action: none;
  user-select: none;
}

:deep(.signature-pad-container) {
  position: relative;
  width: 100%;
  height: 148px;
  border: 1px dashed #49a38c;
  border-radius: 4px;
  background-color: white;
  margin-bottom: 16px;
}

:deep(.canvas-wrapper) {
  width: 100%;
  height: 100%;
  position: relative;
}

:deep(.canvas-wrapper canvas) {
  width: 100%;
  height: 100%;
}

:deep(.signature-pad--footer) {
  position: absolute;
  bottom: 15px;
  right: 3px;
}

:deep(.signature-pad--actions .clear) {
  background-color: white;
  border: 1px solid #49a38c;
  color: #49a38c;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
}

:deep(.signature-pad--actions .clear:hover) {
  background-color: #e9f5f2;
}

:deep(.signature-placeholder) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #7f8c8d;
  font-size: 14px;
  pointer-events: none;
  opacity: 0.7;
}

:deep(.formeo input) {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 9px 12px;
  width: 100%;
  outline: none;
  background: white;
  transition: all 0.3s ease;
  height: 41px;

}



:deep(.formeo select) {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 7px 12px;
  width: 100%;
  outline: none;
  background: white;
  transition: all 0.3s ease;
  height: 41px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23333"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 18px;
  padding-right: 30px;

}

:deep(.formeo select:hover) {
  border-color: #bbb;
}

:deep(.formeo select:focus) {
  border-color: #49a38c;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

:deep(.formeo textarea) {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px 12px;
  width: 100%;
  outline: none;
  background: white;
  transition: all 0.3s ease;
}

:deep(.formeo input:focus) {
  border-color: #49a38c;
  box-shadow: 0 0 0 2px #e9f5f2;
}

:deep(.formeo textarea:focus) {
  border-color: #49a38c;
  box-shadow: 0 0 0 2px #e9f5f2;
}

:deep(.formeo textarea) {
  min-height: 100px;
  resize: vertical;
}

:deep(.formeo input[type="checkbox"]),
:deep(.formeo input[type="radio"]) {
  margin-right: 10px;
  height: 18px;
  width: 18px;
  accent-color: #49a38c;
  cursor: pointer;
}

:deep(.formeo .f-field-group .f-checkbox) {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 5px;
  transition: all 0.2s ease;
  cursor: pointer;
  /* Make the div clickable */

}

:deep(.formeo .f-radio) {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 5px;
  transition: all 0.2s ease;

}

:deep(.formeo .f-field-group .f-checkbox:hover),
:deep(.formeo .f-field-group .f-radio:hover) {
  background-color: #e9f5f2;
}

:deep(.formeo label) {
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity, 1));
}

:deep(.formeo h1) {
  color: #3d8a76;
  position: relative;
  font-weight: 600;
  padding-bottom: 10px;
  margin-bottom: 18px;
  border-bottom: 2px solid #e9f5f2;
}

:deep(.formeo h1::after) {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 80px;
  height: 2px;
  background-color: #49a38c;
}



:deep(.f-field-group:has(.f-radio):not(:first-child)) {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}





:deep(.custom-paragraph) {
  max-height: 330px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #49a38c;
  border-radius: 5px;
  line-height: 1.5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0px 0;
}

:deep(.tags-input-container) {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

:deep(.tags-input) {
  border: none;
  outline: none;
  padding: 4px;
  flex-grow: 1;
  min-width: 100px;
}
</style>
