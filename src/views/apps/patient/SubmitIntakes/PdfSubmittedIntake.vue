<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { FormeoRenderer } from 'formeo';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import "../../../../../node_modules/formeo/dist/formeo.min.css";
import deepToRaw from '../../../../pages/apps/settings/intake-questions/deepToRaw';
import jsonConvert from '../../../../pages/apps/settings/intake-questions/jsonConvert.js';

const formsStore = useFormsStore()
const refVForm = ref()
const store = useStore()
const fullName = ref();

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
const dateOnly = props.storedData.created_at.split(' ')[0];
const [year, month, day] = dateOnly.split("-");
const formattedDate = `${month}-${day}-${year}`;
const fullname = computed(() => {
  fullName.value = props.patient.firstName + ' ' + props.patient.lastName;
})
const name = ref(null)
const description = ref(null)
const yourName = ref(null)
const signature = ref(null)
let renderer = null
let patientConsentFormItem = props.storedData;
const form = ref()
let tempData = null
await formsStore.getSubmittedIntakeFormData(patientConsentFormItem.form_id, patientConsentFormItem.type)
onMounted(async () => {

  // await store.dispatch('getSubmittedIntakeFormData',{
  //     form_id:store.getters.getPatientConsentFormItem.form_id,
  //     type: store.getters.getPatientConsentFormItem.type
  // });
  form.value = formsStore.submittedIntakeForm


  name.value = patientConsentFormItem?.form_name
  description.value = patientConsentFormItem?.description
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
  tempData = setFieldValues(patientConsentFormItem.data, jsonConvert(deepToRaw(formsStore.submittedIntakeForm.data)))
  // console.log('tempData>>',tempData,jsonConvert(deepToRaw(store.getters.getConsentFormData.data)))
  renderer = new FormeoRenderer(options)
  renderer.render(tempData)

  const inputs = document.querySelectorAll('.formeo input');
  inputs.forEach(input => {
    input.style.border = 'none';
  });

  const textAreas = document.querySelectorAll('.formeo textarea');
  textAreas.forEach(textArea => {
    textArea.style.border = 'none';
  });
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

// PDF generation method
const generatePDF = async () => {
  store.dispatch('updateIsLoading', true);
  const pdf = new jsPDF('p', 'mm', 'a4');
  const margin = 10; // Margin in mm
  const element = document.querySelector("#pdfContent"); // ID of the element to capture

  await html2canvas(element).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth, pdfHeight);
    pdf.save("sumitted_intake.pdf");
  });

  store.dispatch('updateIsLoading', false);
};

const emit = defineEmits([
  'closeForm',
  'patientData'
]);
onUnmounted(() => {
  const inputs = document.querySelectorAll('.formeo input');
  inputs.forEach(input => {
    input.style.border = '1px solid silver';
  });

  const textareas = document.querySelectorAll('.formeo textarea');
  textareas.forEach(textarea => {
    textarea.style.border = '1px solid silver';
  });
});
</script>

<template>
  <div style="padding: 15px;">
    <v-btn @click="generatePDF" size="small" class="mb-4">Download PDF</v-btn>
    <div id="pdfContent">
      <h3>{{ name }}</h3>
      <div v-html="description" style="border: 1px solid silver; border-radius: 5px; min-height: 200px; padding: 5px;">
      </div>
      <div ref="refVForm" class="mt-2 formeo-wrap"></div>
      <p v-if="yourName"><b>Your Name:</b> {{ yourName }}</p>
      <p><b>Date:</b> {{ formattedDate }}</p>
      <img :src="signature" alt="Signature" v-if="signature" />
    </div>

  </div>
</template>
<style></style>
