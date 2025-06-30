<script setup>
definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})
import deepToRaw from '@/pages/apps/settings/intake-questions/deepToRaw';
import jsonConvert from '@/pages/apps/settings/intake-questions/jsonConvert.js';
import { patientAuthService } from '@/services/auth/patientAuthService';
import { useBuilderStore } from '@/stores/builderStore';
import { useFormsStore } from '@/stores/formsStore';
import { usePatientRegStore } from '@/stores/patientRegStore';
import loadSignature from '@/views/apps/patient/Intake/app.js';
import initializeDragDropFileUpload from '@/views/apps/patient/Intake/dragDropFileUpload.js';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';
import { FormeoRenderer } from 'formeo';
import { onMounted, watch } from 'vue';
import "../../../node_modules/formeo/dist/formeo.min.css";
const formsStore = useFormsStore()
const { currentUser, currentRole, logout } = useAuth()
const currentUserGet = ref()
const emit = defineEmits(['completed']);
const builderStore = useBuilderStore();
const patientRegStore = usePatientRegStore()
const visibility = ref('hidden')
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  justRender: {
    type: Boolean,
    required: false
  },
  inline: {
    type: Boolean,
    required: false
  },
  showNav: {
    type: Boolean,
    required: false
  },
})
const formRef = ref()
const refVForm = ref(null)
const disableSubmit = ref(false)
let renderer = null
let formData = null
let tempData = null
const formdataApi = ref(null)
const viewSchema = ref([])
// const redirect = patientRegStore.submittedForm.length > 0 && patientRegStore.submittedForm.includes(props.data.config.formId);
// if (redirect) {
//     console.log('redirect', redirect)
//     // emit('completed')
// }
const signatureData = ref(null);
let fdata = null

const exists = patientRegStore.forms.includes(props.data.config.formId);
if (exists) {
  if (!props.justRender) { emit('completed') }
  else {
    props.data.config.checked = true
    props.data.config.submitted = true
  }
}


onMounted(async () => {
  if (props.justRender)
    getSelectedLayout()

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

  renderer = new FormeoRenderer(options)
  await renderForm()
  visibility.value = 'unset'
})

const getSelectedLayout = () => {
  console.log("props.data", props.data)
  // builderStore.layout
  const comboFormsObj = builderStore.layout.find(item => item.type === "comboforms" || item.type === "multipleforms");

  if (comboFormsObj && comboFormsObj.config && comboFormsObj.config.forms) {
    // Get the form with a specific formId
    const formIdToFind = props.data.config.formId; // Change this to the desired formId
    const formObj = comboFormsObj.config.forms.find(form => form.formId === formIdToFind);
    console.log('formObj ', formObj);
  } else {
    console.log("Combo Forms not found or has no forms.");
  }
}
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
const renderForm = async () => {
  let formApi = await $api(GET_REG_FORM_DATA + '/' + props.data.config.formId, {
    method: 'GET',
    onResponseError({ response }) {
      console.error('Error in form API:', response);
    }
  });

  console.log('ccc', fdata)
  const currentUser = await patientAuthService.fetchProfile();
  currentUserGet.value = currentUser.userData

  console.log('currentUser', currentUser)

  let patientUser = {}
  patientUser.fullName = currentUser.userData.fullName
  patientUser.time_zone = currentUser.userData.time_zone
  formdataApi.value = formApi.data
  console.log('formApi.data.data', formApi.data.data)
  if (formApi.data.type === 'simple-forms') {
    await formsStore.getPatientIntakeSimpleFormsData(props.data.config.formId, currentUser.userData.id, currentUser.userData)
    fdata = formsStore.patientIntakeFormData
    let schemaData = formsStore.orginal_schema
    tempData = setFieldValues1(fdata, jsonConvert(deepToRaw(schemaData)))
  } else {
    tempData = jsonConvert(deepToRaw(formApi.data.data))
  }

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
          const { getData } = loadSignature(node, patientUser, signatureData);
          // Update signatureData initially
          signatureData.value = getData();
        }
      }
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
    if (field.tag === 'drag-drop-file') {
      field.action = {
        render: (node) => {
          console.log('Rendering tag-input field:', node);
          initializeDragDropFileUpload(node);
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
  renderer.render(tempData)
};
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
watch(() => props.data.config.formId, () => {
  renderForm()
})


const save = async () => {
  if (signatureData.value?.signature?.required) {
    addAlert('Please provide a valid signature before submitting the form.', 'error'); // Or use a better notification system
    return; // Stop the form submission
  }
  disableSubmit.value = true
  const currentUser = await patientAuthService.fetchProfile();

  formData = new FormData((formRef.value))
  formData.append('pid', currentUser.userData.id)
  formData.append('form_id', props.data.config.formId)
  //formData.append('schema', JSON.stringify(viewSchema.value))
  formData.append('orginal_form_schema', JSON.stringify(tempData))
  if (signatureData.value) {
    formData.append('signatureMetaData', JSON.stringify(signatureData.value.signature.metadata))
  }

  console.log(formdataApi.value?.type)
  // if (formdataApi.value?.type == 'consent-forms') {
  //   const pdfBlob = await generatePDFFromView();
  //   console.log(pdfBlob)

  //   if (pdfBlob) {

  //     formData.append('pdf_file', pdfBlob);
  //   }
  // }
  await patientRegStore.saveForm(formData)
  patientRegStore.submittedForm.push(props.data.config.formId)
  console.log('formData', Object.fromEntries(formData.entries()), renderer)
  disableSubmit.value = false
  if (!props.justRender) { emit('completed') }
  else {
    props.data.config.checked = true
    props.data.config.submitted = true
  }

};

watch(
  () => currentUserGet.value?.company?.logo,
  (newLogo) => {
    if (newLogo) {
      themeConfig.app.logo = h('div', { innerHTML: `<img src="${newLogo}" alt="Logo" style="width:160px;">` });
    }
  },
  { immediate: true } // Trigger the watcher immediately on component mount
);
const logo = computed(() => {
  console.log(currentUserGet.value)
  return themeConfig.app.logo;
});
const isValid = () => {
  console.log('formRef.value',formRef.value.checkValidity())
  if (signatureData.value?.signature?.required) {
    addAlert('Please provide a valid signature before submitting the form.', 'error'); // Or use a better notification system
    return false; // Stop the form submission
  } else {
    return formRef.value.reportValidity()
  }

}
defineExpose({
  save,
  isValid
})
</script>
<template>
  <div class="text-center" v-if="props.showNav"
    style="padding: 25px 10px 10px 10px; border-bottom: 1px solid #c0c0c0b0;position: fixed; width: 100%; z-index: 1004;background: white;">
    <VNodeRenderer :nodes="logo" />
  </div>
  <VRow style="position: relative;" :style="{
    top: props.showNav ? (props.justRender ? '0px' : '60px') : '0px',
    visibility: visibility
  }" class="d-flex align-center justify-center">
    <VCol cols="12" md="12" class=" d-flex justify-center align-center"
      :class="!props.inline && props.showNav ? 'px-8 py-8' : 'py-8'">
      <div :style="props.justRender ? 'width: 100%' : 'max-width: 800px;'" class=""
        :class="!props.inline ? 'custom-card' : ''">
        <VCardText :class="!props.inline ? '' : 'px-0 py-0'">
          <VRow :class="!props.inline ? 'form-row-external' : ''">
            <VCol cols="12" md="12" class="col-order-2" :class="isMobile ? '' : 'align-center justify-center pa-4'"
              style=" background: white;" :style="props.justRender ? '' : 'margin: auto;'">
              <div>
                <div>
                  <form ref="formRef" @submit.prevent="save()" enctype="multipart/form-data">
                    <VRow>
                      <VCol cols="12">
                        <div class="mt-2 formeo-wrap" ref="refVForm"></div>
                      </VCol>
                      <VCol cols="12" v-if="!props.inline">
                        <VBtn type="submit" @click="save" block :disabled="disableSubmit" class="submit-button">{{
                          $t('Next') }}
                        </VBtn>
                      </VCol>
                    </VRow>
                  </form>
                </div>
              </div>
              <div class="security-badge mt-4" v-if="!props.inline">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>{{ $t('HIPAA Compliant | Secure & Confidential Medical Information') }}</span>
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </div>
    </VCol>
  </VRow>
</template>
<style scoped>
/* ::v-deep(.formeo-wrap input:invalid) {
  background-color: ivory;
  border: none;
  outline: 2px solid red;
  border-radius: 5px;
} */

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

::v-deep(.form-row-external) {
  min-height: calc(90vh - 50px);
}

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
</style>
<style scoped>
::v-deep(.canvas-wrapper canvas) {
  border: 1px dashed #49a38c;
  border-radius: 5px;
}

.custom-card {
  background-color: white;
  border-radius: 12px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
  /* max-height: 560px; */
  /* overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: #49a38c #ecf0f1; */
}

::v-deep(h1),
::v-deep(h2),
::v-deep(h3),
::v-deep(h4),
::v-deep(h5) {
  color: #3d8a76;
}

::v-deep(label) {
  color: #333333 !important;
}

.security-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  font-size: 13px;
  color: #7f8c8d;
  gap: 8px;
}

.security-badge ::v-deep(svg) {
  width: 18px;
  height: 18px;
  color: #3d8a76;
}
</style>
<style>
.formeo-wrap input[type="file"] {
  display: block;
  margin: 8px 0;
}

.tags-input-container {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tags-input {
  border: none;
  outline: none;
  padding: 4px;
  flex-grow: 1;
  min-width: 100px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag {
  background-color: #7367f0;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tag-remove {
  cursor: pointer;
  font-size: 14px;
}

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
