<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Consent Add',
    },
})
import { useFormsStore } from '@/stores/formsStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import { requiredValidator } from '@core/utils/validators';
import { FormeoEditor } from 'formeo';
import "../../../../../node_modules/formeo/dist/formeo.min.css";
import patchEditor from '../intake-questions/patchEditor.js';

const practitionerStore = usePractitionerStore();
const formsStore = useFormsStore();
const refVForm = ref()
const consentFormSettingForm = ref()
const name = ref(null)
const practitioners = ref([])
const practitioner = ref(null)
const description = ref(null)
const status = ref(false)
let editor = null
let formData = null
const aiDescription = ref(null)

await practitionerStore.practitionersList()
onMounted(async () => {
    const practitionersData = practitionerStore.practitioners;
    practitioners.value = practitionersData.map(practitioner => ({
        name: `${practitioner.fname} ${practitioner.lname}`, // Display text
        id: practitioner.uuid, // Value
    }))

    makeFormeoForm(null)
});

const makeFormeoForm = (data) => {
    let options = {
        editorContainer: refVForm.value,
        controls: {
            sortable: false,
            groupOrder: ['common', 'html'],
            disable: {
                // elements: ['button'],
            },
            elements: [
                {
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
                    },
                },
            ],
            elementOrder: {
                common: [
                    'button',
                    'checkbox',
                    'date-input',
                    'hidden',
                    'upload',
                    'number',
                    'radio',
                    'select',
                    'text-input',
                    'textarea',
                ],
            },
        },
        config: {
            SCOPE_SUPERTYPE: {
                SCOPE_SUBTYPE: {
                    SETTING_PART: {}
                }
            }
        },
    }
    console.log('refVForm', refVForm.value)
    if (data)
        editor = new FormeoEditor(options, data)
    else
        editor = new FormeoEditor(options)

    patchEditor(editor)
};

const submitForm = async () => {
    const { valid } = await consentFormSettingForm.value.validate()
    console.log(valid)
    if (valid) {
        formData = editor.formData
        console.log('formData', formData)
        await formsStore.saveConsentForm(
            {
                uuid: practitioner.value,
                name: name.value,
                description: description.value,
                status: status.value,
                data: formData,
            }
        )
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
    <VCard :title="$t('Add Consent Form')">
        <VCardText>
            <VForm ref="consentFormSettingForm">
                <VRow>
                    <VCol cols="12" lg="5">
                        <AppTextField v-model="name" :label="$t('Form Name')" placeholder=""
                            :rules="[requiredValidator]" />
                    </VCol>
                    <VCol cols="12" lg="5">
                        <AppSelect v-model="practitioner" :label="$t('Practitioner')" placeholder=""
                            :items="practitioners" item-value="id" item-title="name" :rules="[requiredValidator]" />
                    </VCol>
                    <VCol cols="12" lg="2">
                        <label>&nbsp;</label>
                        <v-checkbox v-model="status" :label="$t('Active')"></v-checkbox>
                    </VCol>
                </VRow>
                <VRow>
                    <VCol cols="12">
                        <TiptapEditor v-model="description" class="border rounded basic-editor" />
                    </VCol>
                </VRow>
                <VRow>
                    <VCol cols="9">
                        <AppTextarea v-model="aiDescription" :label="$t('Generate by AI')"
                            :placeholder="$t('e.g. Consent for OTP')" prepend-inner-icon="tabler-brand-openai"
                            rows="1" />
                    </VCol>
                    <VCol cols="12" lg="3" md="3" sm="12">
                        <VBtn class="mt-6 mr-2" @click="generateForm" :disabled="!aiDescription">{{ $t('Generate') }}
                        </VBtn>
                        <VBtn class="mt-6" color="secondary" @click="clearAiForm" :disabled="!aiDescription">{{
                            $t('Clear') }}
                        </VBtn>
                    </VCol>
                </VRow>
                <div class="mt-2 formeo-wrap" ref="refVForm"></div>
                <VRow class="mt-2">
                    <VCol cols="4">
                        <VBtn @click="submitForm">{{ $t('Save') }}</VBtn>
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
