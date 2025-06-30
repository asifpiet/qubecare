<script setup>
import deepToRaw from '@/pages/apps/settings/intake-questions/deepToRaw';
import jsonConvert from '@/pages/apps/settings/intake-questions/jsonConvert.js';
import { useFormsStore } from '@/stores/formsStore';
import { usePatientRegStore } from '@/stores/patientRegStore';
import loadSignature from '@/views/apps/patient/Intake/app.js';
import "@node_modules/formeo/dist/formeo.min.css";
import { FormeoRenderer } from 'formeo';
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const emit = defineEmits(['completed']);
const formsStore = useFormsStore()
const router = useRouter()
const route = useRoute('patient-forms-id')
const { currentUser, currentRole } = useAuth()
const patientRegStore = usePatientRegStore()
const visibility = ref('hidden')
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },
  selectedFormId: {
    type: Number,
    required: true,
  },
  patient: {
    type: Object,
    required: true,
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
const signatureData = ref(null);

onMounted(async () => {
  //   console.log("sds", props.name);
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


const renderForm = async () => {
  let formApi = await $api(GET_REG_FORM_DATA + '/' + route.params.id, {
    method: 'GET',
    onResponseError({ response }) {
      console.error('Error in form API:', response);
    }
  });
  // const currentUser = await patientAuthService.fetchProfile();
  // console.log('currentUser', currentUser)
  let patientUser = {}
  patientUser.fullName = currentUser.value.fullName
  patientUser.time_zone = currentUser.value.time_zone
  formdataApi.value = formApi.data
  console.log('formApi.data.data', formApi.data.data)
  tempData = jsonConvert(deepToRaw(formApi.data.data))
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
          const { getData } = loadSignature(node, patientUser, signatureData);
          // Update signatureData initially
          signatureData.value = getData();
        }
      }
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
watch(() => route.params.id, () => {
  renderForm()
})


const save = async () => {
  disableSubmit.value = true
  formData = new FormData((formRef.value))
  formData.append('pid', currentUser.value.id)
  formData.append('form_id', route.params.id)
  formData.append('orginal_form_schema', JSON.stringify(tempData))
  if (signatureData.value) {
    formData.append('signatureMetaData', JSON.stringify(signatureData.value.signature.metadata))
  }
  await patientRegStore.saveForm(formData)
  await formsStore.updateStatus(currentUser.value.id, route.params.id)
  // POST_REQUEST_STATUS
  patientRegStore.submittedForm.push(route.params.id)
  console.log('formData', Object.fromEntries(formData.entries()), renderer)
  disableSubmit.value = false
  addAlert('Successfully saved', 'success')
  await nextTick(() => {
    router.replace(route.query.to ? String(route.query.to) : '/patient/forms')
  })
};

</script>
<template>
  <VRow style="min-height: 92dvh; margin: 0px;position: relative;top: 0px;"
    :style="[isMobile ? { marginTop: '0px' } : { marginTop: '0px' }, { visibility: visibility }]" class="bg-custom">

    <VCol cols="12" md="12" class="col-order-2" :class="isMobile ? '' : 'align-center justify-center pa-4'"
      style="max-width: 800px;margin: 0 auto;background: white;">

      <div>
        <div>
          <form ref="formRef" @submit.prevent="save()">
            <VRow>
              <VCol cols="12" class="text-center">
                <h3>{{ props.name }}</h3>
              </VCol>

              <VCol cols="12">
                <div class="mt-2 formeo-wrap" ref="refVForm"></div>
              </VCol>
              <VCol cols="12">
                <VBtn @click="save" block :disabled="disableSubmit">{{ $t('Save') }}</VBtn>
              </VCol>

            </VRow>
          </form>
        </div>
      </div>
    </VCol>
  </VRow>
</template>
