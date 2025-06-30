<script setup>
import { requiredValidator } from '@core/utils/validators';
import { FormeoEditor } from 'formeo';
import { useStore } from 'vuex';
import "../../../../../node_modules/formeo/dist/formeo.min.css";
import patchEditor from './patchEditor.js';

const store = useStore();
const refVForm = ref()
const intakeSettingForm = ref()
const name = ref(null)
const description = ref(null)
const status = ref(false)
let editor = null
let formData = null
const aiDescription = ref(null)
onMounted(async () => {
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
                //     {
                //   tag: 'input',
                //   attrs: {
                //     type: 'radio',
                //     required: false
                //   },
                //   config: {
                //     label: 'Radio Group',
                //     disabledAttrs: ['type']
                //   },
                //   meta: {
                //     group: 'common',
                //     icon: 'radio-group',
                //     id: 'radio'
                //   },
                //   options: (() => {
                //     let options = [1, 2, 3].map(i => {
                //       return {
                //         label: 'Radio ' + i,
                //         value: 'radio-' + i,
                //         selected: false
                //       };
                //     });
                //     let otherOption = {
                //         label: 'Other',
                //         value: 'other',
                //         selected: false
                //       };
                //     options.push(otherOption);
                //     return options;
                //   })(),
                //   action: {
                //     mouseover: evt => {
                //       console.log(evt);
                //       const {target} = evt;
                //       if (target.value === 'other') {
                //         const otherInput = target.cloneNode(true);
                //         otherInput.type = 'text';
                //         target.parentElement.appendChild(otherInput);
                //       }
                //     }
                //   }
                // },
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
    console.log('refVForm',refVForm.value)
    if(data)
        editor = new FormeoEditor(options,data)
    else
        editor = new FormeoEditor(options)

    patchEditor(editor)
};

// const renderer = new FormeoRenderer(options)
// renderer.render(formData)
const submitForm = async () => {  
    const { valid } = await intakeSettingForm.value.validate()
    console.log(valid)
    if (valid) {
        formData = editor.formData
        console.log('formData',formData)
        await store.dispatch('AddIntakeQuestionsForm',{
            name: name.value,
            description: description.value,
            status: status.value,
            data: formData,
        });
    }
};
const generateForm = async() => {
    store.dispatch('updateIsLoading', true)
    if(!aiDescription.value)
    {
        store.dispatch('updateIsLoading', false)
        store.dispatch('updateIsTonalSnackbar', true)
        store.dispatch('updateErrorMessage', 'Please Enter AI Description')
        return
    }
    try {
        const res = await $api(POST_INTAKE_AI_DESCRIPTION, {
                method: 'POST',
                body: {
                    prompt: aiDescription.value,
                },
                
            }
            
            )
        store.dispatch('updateIsLoading', false)
        // store.dispatch('updateSuccessIsTonalSnackbar', true)
        // store.dispatch('updateErrorMessage', 'Form generated successfully')
        console.log('settings update res',res);
        makeFormeoForm(res.message)
    } catch (error) {
        store.dispatch('updateIsLoading', false)
        store.dispatch('updateIsTonalSnackbar', true)
        store.dispatch('updateErrorMessage', 'Something went wrong')
        console.error('Error in API:', error.response || error.message || error);
    }
};
const clearAiForm = async() => {
    aiDescription.value = null
    makeFormeoForm(null)
};
</script>
<template>
    <VCard title="Add Intake Questions">
        <VCardText>
            <VForm ref="intakeSettingForm">
                <VRow>  
                    <VCol cols="12" lg="4">  
                        <AppTextField  
                            v-model="name"  
                            label="Form Name"  
                            placeholder="e.g. Weight Loss"  
                            :rules="[requiredValidator]"  
                        />  
                    </VCol> 
                    <VCol cols="12" lg="6">  
                        <AppTextField  
                            v-model="description"  
                            label="Desctiption"  
                            placeholder="e.g. Type Anything..."   
                        />  
                    </VCol>
                    <VCol cols="12" lg="2">
                        <label>&nbsp;</label>
                        <v-checkbox
                            v-model="status"
                            label="Active"
                        ></v-checkbox>
                    </VCol> 
                </VRow>
                <VRow>
                    <VCol cols="12" lg="9">
                        <AppTextarea
                        v-model="aiDescription"
                        label="Generate by AI"
                        placeholder="e.g. Weight Loss"
                        prepend-inner-icon="tabler-brand-openai"
                        rows="1"
                        />
                    </VCol>
                    <VCol cols="12" lg="3" md="3" sm="12">
                        <VBtn class="mt-6 mr-2" @click="generateForm" :disabled="!aiDescription">Generate</VBtn> 
                        <VBtn class="mt-6" color="secondary" @click="clearAiForm" :disabled="!aiDescription">Clear</VBtn>
                    </VCol>
                </VRow>

                <div class="mt-2 formeo-wrap" ref="refVForm" ></div>
                <VRow class="mt-2">  
                    <VCol cols="4">  
                        <VBtn @click="submitForm">Save</VBtn> 
                    </VCol> 
                </VRow>
            </VForm> 
            
        </VCardText>
    </VCard>
</template>
<style>
.clear-form{
    display: none;
}
.save-form{
    display: none;
}
.formeo-controls{display: block;}
</style>
