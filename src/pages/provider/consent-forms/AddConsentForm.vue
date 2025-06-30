<script setup>
import { useAuth } from '@/composables/useAuth';
import { requiredValidator } from '@core/utils/validators';
import { FormeoEditor } from 'formeo';
import { useStore } from 'vuex';
import "../../../../node_modules/formeo/dist/formeo.min.css";
import patchEditor from '../intakeQuestion/patchEditor.js';
const { currentRole, authService, currentUser } = useAuth()
const emit = defineEmits(['submit'])
const store = useStore();
const refVForm = ref()
const consentFormSettingForm = ref()
const name = ref(null)
const practitioners = ref([])
const practitioner = ref(null)
const description = ref(null)
const status = ref(false)
let editor = null
let formData = null
const userData = useCookie('userData')
onMounted(async () => {


  let options = {
    editorContainer: refVForm.value,
    config: {
      SCOPE_SUPERTYPE: {
        SCOPE_SUBTYPE: {
          SETTING_PART: {}
        }
      }
    },
  }
  console.log('refVForm', refVForm.value)
  editor = new FormeoEditor(options)

  patchEditor(editor)
});

// const renderer = new FormeoRenderer(options)
// renderer.render(formData)
const submitForm = async () => {
  const { valid } = await consentFormSettingForm.value.validate()
  console.log(valid)
  if (valid) {
    formData = editor.formData
    console.log('formData', formData)
    await store.dispatch('AddConsentForm', {
      uuid: currentUser.value.uuid,
      name: name.value,
      description: description.value,
      status: status.value,
      data: formData,
    });
    emit('submit', 'success')
  }
};
</script>
<template>
  <VCard title="Add Consent Form">
    <VCardText>
      <VForm ref="consentFormSettingForm">
        <VRow>
          <VCol cols="12" lg="5">
            <AppTextField v-model="name" label="Form Name" placeholder="" :rules="[requiredValidator]" />
          </VCol>

          <VCol cols="12" lg="2">
            <label>&nbsp;</label>
            <v-checkbox v-model="status" label="Active"></v-checkbox>
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12">
            <TiptapEditor v-model="description" class="border rounded basic-editor" />
          </VCol>
        </VRow>
        <div class="mt-2 formeo-wrap" ref="refVForm"></div>
        <VRow class="mt-2">
          <VCol cols="12" lg="4">
            <VBtn @click="submitForm">Save</VBtn>
          </VCol>
        </VRow>
      </VForm>

    </VCardText>
  </VCard>
</template>
<style>
.clear-form {
  display: none;
}

.save-form {
  display: none;
}

.formeo-controls {
  display: block;
}
</style>
<style lang="scss">
.basic-editor {
  .ProseMirror {
    block-size: 400px;
    outline: none;
    overflow-y: auto;
    padding-inline: 0.5rem;
  }
}
</style>
