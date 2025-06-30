<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Intake Questions Edit',
    },
})
import { useFormsStore } from '@/stores/formsStore';
import { requiredValidator } from '@core/utils/validators';
import { FormeoEditor } from 'formeo';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import "../../../../../../node_modules/formeo/dist/formeo.min.css";
import deepToRaw from '../../intake-questions/deepToRaw.js';
import jsonConvert from '../../intake-questions/jsonConvert.js';
import patchEditor from '../../intake-questions/patchEditor.js';

const formsStore = useFormsStore();
const route = useRoute();
const refVForm = ref()
const questionerSettingForm = ref()
const name = ref(null)
const description = ref(null)
const status = ref(false)
let editor = null
let formData = null
let id = route.params.id;
const data = ref({})
const aiDescription = ref(null)
await formsStore.getQuestionerQuestionsFormById(id)
onMounted(async () => {
    data.value = formsStore.questionerQuestion
    name.value = data.value?.name
    description.value = data.value?.description
    status.value = data.value?.status == 1 ? true : false

    makeFormeoForm(jsonConvert(deepToRaw(formsStore.questionerQuestion.data)))
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
    if (data)
        editor = new FormeoEditor(options, data)
    else
        editor = new FormeoEditor(options)

    patchEditor(editor)
};

const submitForm = async () => {
    const { valid } = await questionerSettingForm.value.validate()
    console.log(valid)
    if (valid) {
        formData = editor.formData
        console.log('formData', formData)
        await formsStore.saveQuestionnaireForm(
            {
                name: name.value,
                description: description.value,
                status: status.value,
                data: formData,
            },
            id
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
    <VCard title="Edit Questionnaire Form">
        <VCardText>
            <VForm ref="questionerSettingForm">
                <VRow>
                    <VCol cols="12" md="4">
                        <AppTextField v-model="name" label="Form Name" placeholder="e.g. Weight Loss"
                            :rules="[requiredValidator]" />
                    </VCol>
                    <VCol cols="12" md="6">
                        <AppTextField v-model="description" label="Desctiption" placeholder="e.g. Type Anything..." />
                    </VCol>
                    <VCol cols="12" md="2">
                        <label>&nbsp;</label>
                        <v-checkbox v-model="status" label="Active"></v-checkbox>
                    </VCol>
                </VRow>
                <VRow>
                    <VCol cols="12" md="9">
                        <AppTextarea v-model="aiDescription" label="Generate by AI" placeholder="e.g. Weight Loss"
                            prepend-inner-icon="tabler-brand-openai" rows="1" />
                    </VCol>
                    <VCol cols="12" md="3">
                        <VBtn class="mt-6 mr-2" @click="generateForm" :disabled="!aiDescription">Generate</VBtn>
                        <VBtn class="mt-6" color="secondary" @click="clearAiForm" :disabled="!aiDescription">Clear
                        </VBtn>
                    </VCol>
                </VRow>
                <div class="mt-2 formeo-wrap" ref="refVForm"></div>
                <VRow class="mt-2">
                    <VCol cols="12" md="4">
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
