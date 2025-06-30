<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { hideLoader, showLoader } from '@/utils/showLoader';
import { requiredValidator } from '@core/utils/validators';
import { FormeoEditor } from 'formeo';
import "../../../../../../node_modules/formeo/dist/formeo.min.css";
import deepToRaw from '../deepToRaw.js';
import jsonConvert from '../jsonConvert.js';
import patchEditor from '../patchEditor.js';

const formsStore = useFormsStore();
formsStore.unloadForm()

const props = defineProps({
  formType: {
    type: String,
    required: true,
  },
  formItem: {
    type: Object,
    required: false,
  }
})
formsStore.type = props.formType
if (props.formItem?.id) {
  formsStore.loadForm(props.formItem)
}
console.log('props.formType', props.formType)

const refVForm = ref()
const formRef = ref()
let editor = null
const aiDescription = ref(null)
let data = props.formItem ? jsonConvert(deepToRaw(props.formItem.data)) : null

onMounted(async () => {
  if (formsStore.isDrawerOpen) {
    formsStore.name = null
    makeFormeoForm(null)
  } else {
    makeFormeoForm(data)
  }

});

const makeFormeoForm = (data) => {
  let formType = props.formType

  // Base configuration for common controls
  const baseControls = {
    sortable: false,
    groupOrder: ['common', 'html'],
    disable: {},
    elements: [],
    elementOrder: {
      common: []
    }
  }

  // Custom email element configuration
  const emailElement = {
    tag: 'input',
    config: {
      label: 'Email',
      disabledAttrs: ['type'],
      lockedAttrs: ['required', 'className'],
    },
    meta: {
      group: 'common',
      id: 'email',
      icon: '@',
    },
    attrs: {
      className: 'custom-email',
      type: 'email',
      required: true,
    }
  }

  const signatureElement = {
    tag: 'signature-pad', // The custom tag for your signature field
    config: {
      label: 'Signature',
      disabledAttrs: ['type'],
      lockedAttrs: ['className'],
    },
    meta: {
      group: 'common',
      icon: '✍️',
      id: 'signature',
    },
    attrs: {
      className: 'signature-pad',
    },
    children: [
      {
        tag: 'div',
        attrs: {
          className: 'canvas-wrapper',
        },
        children: [
          {
            tag: 'canvas',
          },
          { tag: 'input', attrs: { type: 'hidden', name: 'signature-data', className: 'signature-hidden-input' } }
        ],
      },
      {
        tag: 'div',
        attrs: {
          className: 'signature-pad--footer',
        },
        children: [

          {
            tag: 'div',
            attrs: {
              className: 'signature-pad--actions',
            },
            children: [
              {
                tag: 'div',
                attrs: {
                  className: 'column',
                },
                children: [
                  {
                    tag: 'button',
                    attrs: {
                      type: 'button',
                      className: 'button clear',
                      'data-action': 'clear',
                    },
                    content: 'Clear',
                  },





                ],
              },

            ],
          },

        ],
      },
    ],
  };
  // Custom signature element configuration
  const customParagraphElement = {
    tag: 'p',
    config: {
      label: 'Custom Paragraph', // Empty label to hide it
      lockedAttrs: ['className'], // Lock contenteditable attribute
      editableContent: true, hideLabel: true
    },
    meta: {
      group: 'common',
      icon: '📄',
      id: 'custom-paragraph',
    },
    attrs: {
      className: 'custom-paragraph',
    },
    content: 'Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.',
  };
  const tagsInputElement = {
    tag: 'input',
    config: {
      label: 'Tags Input',
      disabledAttrs: ['type'],
      lockedAttrs: ['className'],
    },
    meta: {
      group: 'common',
      icon: '🏷️',
      id: 'tag-input',
    },
    attrs: {
      className: 'tags-input',
      type: 'text',
      placeholder: 'Add tags...',
    },
  };

  const patientFNameField = {
    tag: 'input',
    config: {
      label: 'Patient First Name',
      disabledAttrs: ['type'],
      lockedAttrs: ['className'],
    },
    meta: {
      group: 'common',
      icon: '👤',
      id: 'patient-first-name',
    },
    attrs: {
      className: 'patient-first-name',
      type: 'text',
      name: 'patient_custom_fname',
      readonly: true,
      placeholder: 'Enter  patient first name',
    },
  };
  const patientLastNameField = {
    tag: 'input',
    config: {
      label: 'Patient Last Name',
      disabledAttrs: ['type'],
      lockedAttrs: ['className'],
    },
    meta: {
      group: 'common',
      icon: '👤',
      id: 'patient-last-name',
    },
    attrs: {
      className: 'patient-last-name',
      type: 'text',
      name: 'patient_custom_lname',
      readonly: true,
      required: true,
      placeholder: 'Enter patient last name',
    },
  };
  const patientGenderField = {
    tag: 'select',
    config: {
      label: 'Patient Gender',
      disabledAttrs: ['type'],
      lockedAttrs: ['className'],
    },
    meta: {
      group: 'common',
      icon: '🚻',
      id: 'patient-gender',
    },
    attrs: {
      className: 'patient-gender',
      name: 'patient_custom_gender_identity',
      required: true,
    },
    options: [
      { label: 'Male', value: 'Male' },
      { label: 'Female', value: 'Female' },
      { label: 'Other', value: 'other' },
    ],
  };

  const patientDobField = {
    tag: 'input',
    config: {
      label: 'Patient DOB',
      disabledAttrs: ['type'],
      lockedAttrs: ['className'],
    },
    meta: {
      group: 'common',
      icon: '📅',
      id: 'patient-dob',
    },
    attrs: {
      className: 'patient-dob',
      type: 'date',
      name: 'patient_custom_DOB',
      required: true,
    },
  };

  const patientEmailField = {
    tag: 'input',
    config: {
      label: 'Patient Email',
      disabledAttrs: ['type'],
      lockedAttrs: ['className'],
    },
    meta: {
      group: 'common',
      icon: '📧',
      id: 'patient-email',
    },
    attrs: {
      className: 'patient-email',
      type: 'email',
      placeholder: 'Enter patient email',
      name: 'patient_custom_email',
      required: true,
      readonly: true,
    },
  };

  const patientPhoneField = {
    tag: 'input',
    config: {
      label: 'Patient Phone',
      disabledAttrs: ['type'],
      lockedAttrs: ['className'],
    },
    meta: {
      group: 'common',
      icon: '📞',
      id: 'patient-phone',
    },
    attrs: {
      className: 'patient-phone',
      type: 'tel',
      placeholder: 'Enter patient phone number',
      name: 'patient_extra_data_preferred_phone',
      required: true,
      readonly: true,
    },
  };
  const dragDropFileField = {
    tag: 'drag-drop-file', // Use a div to create a custom container
    config: {
      label: 'Drag & Drop File Upload',
      disabledAttrs: ['type'], // Disable editing the type attribute
      lockedAttrs: ['className'], // Lock the className attribute
    },
    meta: {
      group: 'common',
      icon: '📂',
      id: 'drag-drop-file',
    },
    attrs: {
      className: 'drag-drop-file-container',
      required: true,
      type: 'file',
    },
    content: `
        <div class="drag-drop-container">
        <div class="drag-drop-area">
          <p>Drag and drop or click to upload ID</p>
          <p class="file-types">Accepted: JPEG, PNG, PDF (Max 5MB)</p>
          <input type="file" class="file-input" accept=".jpeg,.jpg,.png,.pdf"  style="opacity: 0; position: absolute; z-index: -1;" />
          <div class="file-list"></div>
        </div>
      </div>
  `,
  };
  // Customize controls based on form type
  switch (formType) {
    case 'document-forms':
      baseControls.elements = [dragDropFileField]
      baseControls.elementOrder.common = ['upload']
      baseControls.disable.elements = [
        'button', 'checkbox', 'date-input', 'hidden',
        'number', 'radio', 'select', 'text-input', 'textarea'
      ]
      break;

    case 'consent-forms':
      baseControls.elements = [emailElement, signatureElement, customParagraphElement, dragDropFileField]
      baseControls.elementOrder.common = [
        'text-input', 'email', 'signature', 'checkbox',
        'date-input', 'select',
      ]
      break;
    case 'simple-forms':
      baseControls.elements = [emailElement, signatureElement, customParagraphElement, tagsInputElement, dragDropFileField,
        patientFNameField,
        patientLastNameField,
        patientGenderField,
        patientDobField,
        patientEmailField,
        patientPhoneField,]
      baseControls.elementOrder.common = [
        'patient-first-name',
        'patient-last-name',
        'patient-gender',
        'patient-dob',
        'patient-email',
        'patient-phone',
        'button', 'checkbox', 'date-input', 'signature', 'hidden',
        'upload', 'number', 'radio', 'select',
        'text-input', 'textarea'
      ]
      break;
    default:
      baseControls.elements = [emailElement, signatureElement, customParagraphElement, dragDropFileField]
      baseControls.elementOrder.common = [

        'button', 'checkbox', 'date-input', 'signature', 'hidden',
        'upload', 'number', 'radio', 'select',
        'text-input', 'textarea'
      ]
  }

  let options = {
    editorContainer: refVForm.value,
    controls: baseControls,
    config: {
      SCOPE_SUPERTYPE: {
        SCOPE_SUBTYPE: {
          SETTING_PART: {}
        }
      }
    },
  }

  console.log('refVForm', refVForm.value)
  if (data) {
    editor = new FormeoEditor(options, data)
  } else {
    editor = new FormeoEditor(options)
  }

  patchEditor(editor)
}

const emit = defineEmits([
  'saveData'
]);
const submitForm = async () => {
  const { valid } = await formRef.value.validate()
  console.log(valid)
  if (valid) {
    formsStore.data = editor.formData
    await formsStore.saveForm()
    formsStore.data = null
    formsStore.name = null
    emit('saveData', true)

    if (formsStore.isDrawerOpen) {
      if (refVForm.value) {
        refVForm.value.innerHTML = '';
      }
      makeFormeoForm(null);
      aiDescription.value = null;
    }
    //formsStore.data = ''
    formsStore.isDrawerOpen = false
    formsStore.isDrawerOpenEdit = false
  }
};
const generateForm = async () => {

  showLoader()
  try {
    const res = await $api(POST_INTAKE_AI_DESCRIPTION, {
      method: 'POST',
      body: {
        prompt: aiDescription.value,
      },

    }

    )
    makeFormeoForm(res.message)
    addAlert('Generated successfully', 'success')
    hideLoader()
  } catch (error) {
    hideLoader()
    addAlert('Something went wrong', 'error')
    console.error('Error in API:', error.response || error.message || error);
  }
};
const clearAiForm = async () => {
  aiDescription.value = null
  makeFormeoForm(null)
};
</script>
<template>
  <VForm ref="formRef">
    <VRow>
      <VCol cols="12" lg="12">
        <AppTextField v-model="formsStore.name" :label="$t('Form Name')" :placeholder="$t('e.g Weight Loss')"
          :rules="[requiredValidator]" />
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12" lg="9">
        <AppTextarea v-model="aiDescription" :label="$t('Generate by AI')" :placeholder="$t('e.g Weight Loss')"
          prepend-inner-icon="tabler-brand-openai" rows="1" />
      </VCol>
      <VCol cols="12" lg="3" md="3" sm="12">
        <VBtn class="mt-6 mr-2" @click="generateForm" :disabled="!aiDescription">{{ $t('Generate') }}</VBtn>
        <VBtn class="mt-6" color="secondary" @click="clearAiForm" :disabled="!aiDescription"> {{ $t('Clear') }}
        </VBtn>
      </VCol>
    </VRow>

    <div class="mt-2 formeo-wrap" ref="refVForm"></div>
    <VRow class="mt-2">
      <VCol cols="4">
        <VBtn @click="submitForm"> {{ $t('Save') }}</VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
<style>
.clear-form {
  display: none;
}

.formeo input[type=date] {
  max-width: 100%;
  display: block;
}

.save-form {
  display: none;
}

.formeo-controls {
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
</style>
