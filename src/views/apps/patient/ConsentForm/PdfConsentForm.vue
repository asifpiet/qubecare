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
const refVForm = ref();
const store = useStore();
const name = ref(null);
const description = ref(null);
const yourName = ref(null);
const signature = ref(null);
let renderer = null;
const data = ref({});
const storedData = ref({});
let tempData = null;
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
})
let patientConsentFormItem = props.storedData;
let formId = props.selectedFormId;
const dateOnly = props.storedData.created_at.split(' ')[0];
// PDF generation method
const generatePDF = async () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const margin = 10; // Margin in mm
  const element = document.querySelector("#pdfContent"); // ID of the element to capture

  await html2canvas(element).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth, pdfHeight);
    pdf.save("consent_form.pdf");
  });
};




onMounted(async () => {
  console.log('patientConsentFormItem', patientConsentFormItem)
  await formsStore.getPatientConsentFormData(formId, props.patient.id)

  storedData.value = formsStore.patientConsentFormData;
  await formsStore.getConsentFormDataById(formId)
  // await store.dispatch('getConsentFormById', { id: formId });
  data.value = formsStore.consentFormData;
  name.value = data.value?.name;
  description.value = data.value?.description;
  yourName.value = patientConsentFormItem?.name;
  signature.value = patientConsentFormItem?.signature;

  const options = {
    renderContainer: refVForm.value,
    elements: {},
    controls: {
      disable: {
        elements: ['number'],
        groups: ['layout'],
        formActions: true,
      },
    },
  };
  tempData = setFieldValues(patientConsentFormItem.data, jsonConvert(deepToRaw(formsStore.consentFormData.data)));
  renderer = new FormeoRenderer(options);
  renderer.render(tempData);

  const inputs = document.querySelectorAll('.formeo input');
  inputs.forEach(input => {
    input.style.border = 'none';
  });
});

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
onUnmounted(() => {
  const inputs = document.querySelectorAll('.formeo input');
  inputs.forEach(input => {
    input.style.border = '1px solid silver';
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
      <p><b>Your Name:</b> {{ yourName }}</p>
      <p><b>Date:</b> {{ dateTimeFormat(dateOnly) }}</p>
      <img :src="signature" alt="Signature" />
    </div>

  </div>
</template>
