<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { FormeoRenderer } from 'formeo';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import "../../../../../node_modules/formeo/dist/formeo.min.css";
import deepToRaw from '../../../../pages/apps/settings/intake-questions/deepToRaw';
import jsonConvert from '../../../../pages/apps/settings/intake-questions/jsonConvert.js';
import loadSignature from '@/views/apps/patient/Intake/app.js';
import PdfViewr from '@/views/apps/patient/ConsentForm/PdfViewr.vue';
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';
const route = useRoute();
const formsStore = useFormsStore()
const refVForm = ref()
const intakeSettingForm = ref()
const store = useStore()
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
    required: false,
  },
  isDataEnable: {
    type: Boolean,
  },
  intakefieldData: {
    type: Object,
  }

})
console.log('props.patient', props.patient)
const fullname = computed(() => {
  fullName.value = props.patient.firstName + ' ' + props.patient.lastName;
})
const name = ref(null)
let renderer = null
let formData = null
let id = props.intakefieldData.form_id;
let rowid = props.intakefieldData.id;
let fdata = props.intakefieldData.data;
const data = ref({})
const storedData = ref({})

const tempData = ref([])
const isSignatureModalVisible = ref(false);
const signatureImageSrc = ref('');
const isFileModalVisible = ref(false);
const fileSrc = ref('');
const showFileModal = (src) => {
  fileSrc.value = src;
  isFileModalVisible.value = true;
};
const showSignatureModal = (src) => {
  signatureImageSrc.value = src;
  isSignatureModalVisible.value = true;
};
window.showSignatureModal = showSignatureModal;
window.showFileModal = showFileModal;

onMounted(async () => {
  console.log('fdata', fdata);
  await formsStore.getPatientIntakeFormsData(id, props.patient.id, rowid)
  console.log(formsStore.schema)
  let schemaData = formsStore.orginal_schema

  // await store.dispatch('getPatientIntakeFormsData',{
  //     id:id,
  //     uuid: store.getters.getPatientPorfile.uuid
  // });
  storedData.value = fdata

  //await formsStore.getIntakeFormDataById(id)
  data.value = formsStore.intakeFormData
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

  tempData.value = setFieldValues1(fdata, jsonConvert(deepToRaw(schemaData)))
  console.log(fdata)
  //tempData.value = setFieldValues(fdata, schemaData)
  console.log('tempData1 == ', tempData.value)
  let filedData = Object.values(tempData.value.fields)

  for (let data in filedData) {
    let field = filedData[data]
    if (field.tag === 'signature-pad') {
      field.children[0].children[1].attrs.name = field.attrs.name
      field.action = {
        render: (node) => {
          console.log(node)
          //loadSignature(node)
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
  }
  // console.log('tempData>>',tempData,jsonConvert(deepToRaw(store.getters.getIntakeFormData.data)))
  renderer = new FormeoRenderer(options)
  renderer.render(tempData.value)
  Object.keys(tempData.value.fields).forEach((key) => {
    const field = tempData.value.fields[key];
    evaluateConditions(field, tempData.value.fields, refVForm.value);
  });
})
const isImage = computed(() => {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];
  return imageExtensions.some((ext) => fileSrc.value.endsWith(ext));
});
const isPdf = computed(() => {
  return fileSrc.value.endsWith('.pdf');
});
const evaluateConditions = (field, fields, formContainer) => {
  if (!field.conditions) return true;

  console.log('Target Field Name:', field.attrs.name);

  return field.conditions.every((condition) => {
    const { if: conditions, then: actions } = condition;
    const conditionResult = conditions.every((cond) => {
      const sourceFieldKey = cond.source.split('.')[1];
      const sourceField = fields[sourceFieldKey];
      const sourceValue = sourceField.attrs.value || sourceField.value;
      return sourceValue === cond.target;
    });
    if (conditionResult && actions) {
      console.log(actions);
      actions.forEach((action) => {
        const targetFieldKey = action.target.split('.')[1];
        const targetField = fields[targetFieldKey];

        if (targetField) {
          // Find the target field's DOM element
          const targetFieldElement = formContainer.querySelector(
            `[name="${targetField.attrs.name}"]`
          );
          console.log(targetFieldElement.parentElement)
          if (targetFieldElement) {
            switch (action.assignment) {
              case 'equals':
                targetField.attrs[action.targetProperty] = action.value;
                targetFieldElement.parentElement.removeAttribute('hidden');
                console.log(`Action: Set ${action.targetProperty} of ${targetFieldKey} to ${action.value}`);
                break;


              default:
                console.warn(`Unknown action assignment: ${action.assignment}`);
                break;
            }
          }
        }
      });
    }

    return conditionResult;
  });
};
const fieldValues = ref([])

const setFieldValues1 = (inputData, jsonData) => {
  // Deep clone to avoid reactivity issues
  const modifiedJsonData = JSON.parse(JSON.stringify(jsonData));

  Object.keys(modifiedJsonData.fields).forEach(key => {
    const field = modifiedJsonData.fields[key];
    const fieldName = field.attrs.name;
    field.attrs.readOnly = true;
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
          field.attrs.readOnly = true;


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


          } else if (field.attrs.type === "file") {
            field.tag = 'div';
            const fileSrc = inputData[fieldName];
            const isImage = /\.(png|jpg|jpeg|gif|bmp|webp)$/i.test(fileSrc); // Check for image extensions
            const isPdf = /\.pdf$/i.test(fileSrc); // Check for PDF extension

            if (isImage) {
              // Display the image and a "View File" button
              field.innerHTML = `
              <img src="${fileSrc}" style="max-width: 200px; max-height: 100px;" />
               <button type="button" class="view-file-btn btn btn-primary" onclick="showFileModal('${fileSrc}')">
                  <i class="tabler-eye v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i>
                </button>
              `;
            } else if (isPdf) {
              // Display a text link to open the PDF file
              field.innerHTML = `
                <p>PDF File:  <button type="button" class="view-file-btn btn btn-primary" onclick="showFileModal('${fileSrc}')">
                  <i class="tabler-eye v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i>View Pdf
                </button>
              `;
            } else {
              // Handle unsupported file types
              field.innerHTML = `
                <p>Unsupported file type: <a href="${fileSrc}" target="_blank">Download File</a></p>
              `;
            }
          } else {
            // Other input types
            field.attrs.value = inputData[fieldName];
          }
          field.attrs.readOnly = true;

          break;
        case 'signature-pad':
          field.attrs.readOnly = true;
          field.tag = 'div'; // Change tag to a container div
          field.attrs.class = "signature-container"; // Add custom class
          field.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 10px;">
              <img src="${inputData[fieldName]}" alt="Signature" style="max-width: 200px; max-height: 100px;" />
              <button type="button" class="view-signature-btn btn btn-primary" style="" onclick="showSignatureModal('${inputData[fieldName]}')">
                View Signature
              </button>
            </div>
          `;
          break;
        case 'drag-drop-file':
          // Multiselect: initialize tags input
          field.tag = 'div'; // Change tag to a container div

          const fileSrc = inputData[fieldName];
          const isImage = /\.(png|jpg|jpeg|gif|bmp|webp)$/i.test(fileSrc); // Check for image extensions
          const isPdf = /\.pdf$/i.test(fileSrc); // Check for PDF extension

          if (isImage) {
            // Display the image and a "View File" button
            field.innerHTML = `
              
                <img src="${fileSrc}" style="max-width: 300px; max-height: 300px;" />
                <button type="button" class="view-file-btn btn btn-primary" onclick="showFileModal('${fileSrc}')">
                  <i class="tabler-eye v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i>
                </button>
              
              `;
          } else if (isPdf) {
            // Display a text link to open the PDF file
            field.innerHTML = `
            
                <p>PDF File:  <button type="button" class="view-file-btn btn btn-primary" onclick="showFileModal('${fileSrc}')">
                  <i class="tabler-eye v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i>View Pdf
                </button>
              `;
          } else {
            // Handle unsupported file types
            field.innerHTML = `
                <p>Unsupported file type: <a href="${fileSrc}" target="_blank">Download File</a></p>
              `;
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
function getOrderedFieldNamesWithLabels(inputData, schema) {
  const orderedFields = [];

  schema.forEach((field) => {
    const fieldName = field.name;

    let fieldValue = "";
    if (inputData && inputData[fieldName] != null && inputData[fieldName] !== "") {
      fieldValue = inputData[fieldName];
    } else {
      fieldValue = field.content;
    }

    orderedFields.push({
      name: fieldName,
      label: field.label,
      value: fieldValue,
      tag: field.tag,
    });
  });

  return orderedFields;
}
function getOrderedFieldNamesWithLabelsTest(inputData, schema) {
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
          if (inputData && inputData[fieldName] != null && inputData[fieldName] != '') {
            orderedFields.push({
              name: field.attrs.name,
              label: field.config.label,
              value: inputData[fieldName]
            });
          }
        });
      });
    });
  }

  return orderedFields;
}
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
  <VDialog v-model="isFileModalVisible" max-width="800">
    <DialogCloseBtn @click="[isFileModalVisible = !isFileModalVisible]" />

    <!-- Image View for PNG and JPEG types -->
    <VCard class="pdf-container" v-if="fileSrc">

      <img :src="fileSrc" width="100%" v-if="isImage" />
      <div v-if="isPdf"></div>

      <iframe v-if="isPdf" :src="fileSrc" :style="{
        transform: `scale(${scale})`,
        transformOrigin: 'top center'
      }" width="100%" height="600px" @load="handleLoad" frameborder="0" class="pdf-iframe" />
    </VCard>

    <!-- PDF View for other types -->

  </VDialog>
  <VDialog v-model="isSignatureModalVisible" max-width="600">
    <DialogCloseBtn @click="isSignatureModalVisible = !isSignatureModalVisible" />
    <VCard>
      <VCardTitle>{{ $t('Signature Preview') }}</VCardTitle>
      <VDivider />
      <VCardText>
        <!-- Signature Image -->


        <!-- VList for Additional Information -->
        <VList>
          <VListItem>
            <VListItemTitle>{{ $t('Signer Name') }}</VListItemTitle>
            <VListItemSubtitle>{{ formsStore.signature_meta.currentUser.fullName }}</VListItemSubtitle>
          </VListItem>

          <VListItem>
            <VListItemTitle>{{ $t('Date Time') }}</VListItemTitle>
            <VListItemSubtitle>{{ dateTimeFormat(formsStore.signature_meta.timestamp) }}</VListItemSubtitle>
          </VListItem>
          <VListItem>
            <VListItemTitle>{{ $t('Time Zone') }}</VListItemTitle>
            <VListItemSubtitle>{{ formsStore.signature_meta.currentUser.time_zone }}</VListItemSubtitle>
          </VListItem>
          <VListItem>
            <VListItemTitle>{{ $t('IP Address') }}</VListItemTitle>
            <VListItemSubtitle>{{ formsStore.signature_meta.ipAddress }}</VListItemSubtitle>
          </VListItem>
          <VListItem>
            <VListItemTitle>{{ $t('Platform') }}</VListItemTitle>
            <VListItemSubtitle>{{ formsStore.signature_meta.platform }}</VListItemSubtitle>
          </VListItem>
          <VListItem>
            <VListItemTitle>{{ $t('User Agent') }}</VListItemTitle>
            <VListItemSubtitle>{{ formsStore.signature_meta.userAgent }}</VListItemSubtitle>
          </VListItem>
        </VList>
        <img :src="signatureImageSrc" alt="Signature" style="max-width: 100%; height: auto;" />
      </VCardText>
      <VCardActions>
        <VBtn color="primary" @click="isSignatureModalVisible = false">{{ $t('Close') }}</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
<style scoped>
.single-line {
  padding: 10px;
}
</style>
