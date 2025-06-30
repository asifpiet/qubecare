<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { FormeoRenderer } from 'formeo';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import "../../../node_modules/formeo/dist/formeo.min.css";
import deepToRaw from '@/pages/apps/settings/intake-questions/deepToRaw';
import jsonConvert from '@/pages/apps/settings/intake-questions/jsonConvert.js';
import loadSignature from '@/views/apps/patient/Intake/app.js';
const route = useRoute();
const formsStore = useFormsStore()
const refVForm = ref()
const intakeSettingForm = ref()
const store = useStore()
const isLoading = ref(false)
const isTonalSnackbarVisible = ref(false)
const fullName = ref();
definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})
const props = defineProps({
  patient: {
    type: Object,
    required: false,
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

const name = ref(null)
let renderer = null
let formData = null
//let id = props.intakefieldData.form_id;
//let rowid = props.intakefieldData.id;
//console.log('fdata', route.query.data);
let apiUrl = route.query.url
let fdata = '' //props.intakefieldData.data;
const data = ref({})
const storedData = ref({})

const tempData = ref([])
const isSignatureModalVisible = ref(false);
const signatureImageSrc = ref('');

const showSignatureModal = (src) => {
  signatureImageSrc.value = src;
  isSignatureModalVisible.value = true;
};
console.log(apiUrl)
await formsStore.genratePdf(apiUrl)
let dataForm = formsStore.savePatientIntakFormData
console.log(dataForm)
onMounted(async () => {




  let schemaData = dataForm.orginal_form_schema


  storedData.value = dataForm.data

  //await formsStore.getIntakeFormDataById(id)
  //data.value = formsStore.intakeFormData
  //name.value = data.value?.name
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

  tempData.value = setFieldValues1(dataForm.data, jsonConvert(deepToRaw(schemaData)))

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
  }
  // console.log('tempData>>',tempData,jsonConvert(deepToRaw(store.getters.getIntakeFormData.data)))
  renderer = new FormeoRenderer(options)
  renderer.render(tempData.value)
})


const fieldValues = ref([])
const setFieldValues = (inputData, jsonData) => {
  console.log(jsonData)
  fieldValues.value = getOrderedFieldNamesWithLabels(inputData, jsonData);

  return fieldValues.value.map((field) => {
    let fieldContent = field.value;

    // Check if the field has a specific tag
    if (["h1", "h2", "h3", "h4", "h5", "h6", "p"].includes(field.tag)) {
      fieldContent = `<${field.tag}>${fieldContent}</${field.tag}>`;
    }

    return {
      name: field.name,
      label: field.label,
      value: fieldContent,
      tag: field.tag
    };
  });
};
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
            field.options[fieldIndexInMerged].disabled = true;
          } else if (field.attrs.type === "radio") {
            const fieldIndexInMerged = field.options.findIndex(val => val.value === inputData[fieldName]);
            field.options[fieldIndexInMerged].selected = true;
            field.options.map(item => {
              if (item.selected === true) {
                return { ...item, disabled: true }; // Add `disabled: true` to the object
              }
              return item; // Return the object unchanged if `selected` is not `true`
            });

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
            </div>
          `;
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




          </VCol>

          <VCol cols="12">
            <div class="mt-2 formeo-wrap" ref="refVForm"></div>
          </VCol>
        </VRow>


      </form>
    </VCardText>
  </VCard>
  <VCard>

    <VDivider />
    <VCardText>
      <!-- Signature Image -->


      <!-- VList for Additional Information -->
      <VList>
        <VListItem>
          <VListItemTitle>Signer Name</VListItemTitle>
          <VListItemSubtitle>{{ dataForm.signature_meta.currentUser.fullName }}</VListItemSubtitle>
        </VListItem>

        <VListItem>
          <VListItemTitle>Date Time</VListItemTitle>
          <VListItemSubtitle>{{ dateTimeFormat(dataForm.signature_meta.timestamp) }}</VListItemSubtitle>
        </VListItem>
        <VListItem>
          <VListItemTitle>Time Zone</VListItemTitle>
          <VListItemSubtitle>{{ dataForm.signature_meta.currentUser.time_zone }}</VListItemSubtitle>
        </VListItem>
        <VListItem>
          <VListItemTitle>IP Address</VListItemTitle>
          <VListItemSubtitle>{{ dataForm.signature_meta.ipAddress }}</VListItemSubtitle>
        </VListItem>
        <VListItem>
          <VListItemTitle>Platform</VListItemTitle>
          <VListItemSubtitle>{{ dataForm.signature_meta.platform }}</VListItemSubtitle>
        </VListItem>
        <VListItem>
          <VListItemTitle>User Agent</VListItemTitle>
          <VListItemSubtitle>{{ dataForm.signature_meta.userAgent }}</VListItemSubtitle>
        </VListItem>
      </VList>
      <img :src="dataForm.signature_meta.imageData" alt="Signature" style="max-width: 100%; height: auto;" />
    </VCardText>

  </VCard>
  <VDialog v-model="isSignatureModalVisible" max-width="600">
    <DialogCloseBtn @click="isSignatureModalVisible = !isSignatureModalVisible" />
    <VCard>
      <VCardTitle>Signature Preview</VCardTitle>
      <VDivider />
      <VCardText>
        <!-- Signature Image -->


        <!-- VList for Additional Information -->
        <VList>
          <VListItem>
            <VListItemTitle>Signer Name</VListItemTitle>
            <VListItemSubtitle>{{ formsStore.signature_meta.currentUser.fullName }}</VListItemSubtitle>
          </VListItem>

          <VListItem>
            <VListItemTitle>Date Time</VListItemTitle>
            <VListItemSubtitle>{{ dateTimeFormat(formsStore.signature_meta.timestamp) }}</VListItemSubtitle>
          </VListItem>
          <VListItem>
            <VListItemTitle>Time Zone</VListItemTitle>
            <VListItemSubtitle>{{ formsStore.signature_meta.currentUser.time_zone }}</VListItemSubtitle>
          </VListItem>
          <VListItem>
            <VListItemTitle>IP Address</VListItemTitle>
            <VListItemSubtitle>{{ formsStore.signature_meta.ipAddress }}</VListItemSubtitle>
          </VListItem>
          <VListItem>
            <VListItemTitle>Platform</VListItemTitle>
            <VListItemSubtitle>{{ formsStore.signature_meta.platform }}</VListItemSubtitle>
          </VListItem>
          <VListItem>
            <VListItemTitle>User Agent</VListItemTitle>
            <VListItemSubtitle>{{ formsStore.signature_meta.userAgent }}</VListItemSubtitle>
          </VListItem>
        </VList>
        <img :src="signatureImageSrc" alt="Signature" style="max-width: 100%; height: auto;" />
      </VCardText>
      <VCardActions>
        <VBtn color="primary" @click="isSignatureModalVisible = false">Close</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
<style></style>
