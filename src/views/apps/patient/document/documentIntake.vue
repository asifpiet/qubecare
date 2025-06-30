<script setup>
import { useFormsStore } from '@/stores/formsStore';
import loadSignature from '@/views/apps/patient/Intake/app.js';
import { FormeoRenderer } from 'formeo';
import moment from 'moment-timezone';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
//import "../../../../../node_modules/formeo/dist/formeo.min.css";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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




const generatePDFFromView = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const element = refVForm.value;
  if (!element) return;

  try {
    const buttons = element.querySelectorAll('button');
    buttons.forEach(button => {
      button.style.display = 'none';
    });
    const scale = 2;
    const canvas = await html2canvas(element, { scale, useCORS: true });


    buttons.forEach(button => {
      button.style.display = '';
    });

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

    const imgData = canvas.toDataURL('image/png');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10;


    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 20;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;
    }


    pdf.addPage();
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    let format = 'MM-DD-YYYY HH:mm:ss'
    let yOffset = 20;

    const addTextWithLineBreaks = (text, x, y, maxWidth, lineHeight) => {
      const lines = pdf.splitTextToSize(text, maxWidth);
      lines.forEach((line) => {
        pdf.text(line, x, y);
        y += lineHeight;
      });
      return y;
    };
    const maxWidth = pageWidth - 20;
    const lineHeight = 10;
    yOffset = addTextWithLineBreaks(`Name: ${signatureData.value?.signature?.metadata?.currentUser.fullName || 'N/A'}`, 10, yOffset, maxWidth, lineHeight);
    yOffset = addTextWithLineBreaks(`Time: ${moment.utc(signatureData.value?.signature?.timestamp).tz(signatureData.value?.signature?.metadata?.currentUser.time_zone).format(format) || 'N/A'}`, 10, yOffset, maxWidth, lineHeight);
    yOffset = addTextWithLineBreaks(`Time Zone: ${signatureData.value?.signature?.metadata?.currentUser.time_zone || 'N/A'}`, 10, yOffset, maxWidth, lineHeight);
    yOffset = addTextWithLineBreaks(`IP Address: ${signatureData.value?.signature?.metadata?.ipAddress || 'N/A'}`, 10, yOffset, maxWidth, lineHeight);
    yOffset = addTextWithLineBreaks(`Platform: ${signatureData.value?.signature?.metadata?.platform || 'N/A'}`, 10, yOffset, maxWidth, lineHeight);
    yOffset = addTextWithLineBreaks(`User Agent: ${signatureData.value?.signature?.metadata?.userAgent || 'N/A'}`, 10, yOffset, maxWidth, lineHeight);

    if (signatureData.value?.signature?.imageData) {

      pdf.addImage(signatureData.value?.signature?.imageData, 'PNG', 10, yOffset, 60, 20);
      yOffset += 30;
    } else {
      console.error('Signature image data is missing or invalid.');
    }


    const pdfBlob = pdf.output('blob');

    return pdfBlob;

  } catch (error) {
    console.error('Error generating PDF:', error);
    return null;
  }
};


onMounted(async () => {
  console.log('props.selectedFormId', props.selectedFormId, props.storedData)
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
  // tempData = setFieldValues(props.storedData.data, jsonConvert(deepToRaw(formsStore.intakeFormData.data)))
  tempData = jsonConvert(deepToRaw(formsStore.intakeFormData.data))
  console.log(tempData)
  // console.log('tempData>>',tempData,jsonConvert(deepToRaw(formsStore.getIntakeFormData.data)))
  console.log(tempData.fields)
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
          const { getData } = loadSignature(node, currentUser.value, signatureData);
          // Update signatureData initially
          signatureData.value = getData();
        }
      }
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
  console.log(JSON.stringify(signatureData.value?.signature?.imageData));
  formData.append('pid', props.patient.id)
  formData.append('form_id', id)
  formData.append('schema', JSON.stringify(viewSchema.value))
  formData.append('orginal_form_schema', JSON.stringify(tempData))
  formData.append('signatureMetaData', JSON.stringify(signatureData.value.signature.metadata))
  if (data.value?.type == 'consent-forms') {
    const pdfBlob = await generatePDFFromView();
    console.log(pdfBlob)

    if (pdfBlob) {

      formData.append('pdf_file', pdfBlob);
    }
  }

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
  <VSnackbar v-model="isTonalSnackbarVisible" location="top end" variant="flat" color="success">
    Intake saved.
  </VSnackbar>


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
            <VBtn type="submit">Save</VBtn>
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
</style>
