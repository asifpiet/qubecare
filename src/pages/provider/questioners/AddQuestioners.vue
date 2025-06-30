<script setup>
import { requiredValidator } from '@core/utils/validators';
import { FormeoEditor } from 'formeo';
import { useStore } from 'vuex';
import "../../../../node_modules/formeo/dist/formeo.min.css";
import patchEditor from '../intakeQuestion/patchEditor.js';
const emit = defineEmits(['submit'])
const store = useStore();
const refVForm = ref()
const questionerSettingForm = ref()
const name = ref(null)
const description = ref(null)
const status = ref(false)
let editor = null
let formData = null
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
    console.log('refVForm',refVForm.value)
    editor = new FormeoEditor(options)

    patchEditor(editor)
});

// const renderer = new FormeoRenderer(options)
// renderer.render(formData)
const submitForm = async () => {  
    const { valid } = await questionerSettingForm.value.validate()
    console.log(valid)
    if (valid) {
        formData = editor.formData
        console.log('formData',formData)
        await store.dispatch('AddQuestionerQuestionsForm',{
            name: name.value,
            description: description.value,
            status: status.value,
            data: formData,
        });
        emit('submit','success')
    }
};
</script>
<template>
    <VCard title="Add Questioner Questions">
        <VCardText>
            <VForm ref="questionerSettingForm">
                <VRow>  
                    <VCol cols="12" md="4">  
                        <AppTextField  
                            v-model="name"  
                            label="Form Name"  
                            placeholder="e.g. Weight Loss"  
                            :rules="[requiredValidator]"  
                        />  
                    </VCol> 
                    <VCol cols="12" md="6">  
                        <AppTextField  
                            v-model="description"  
                            label="Desctiption"  
                            placeholder="e.g. Type Anything..."   
                        />  
                    </VCol>
                    <VCol cols="12" md="2">
                        <label>&nbsp;</label>
                        <v-checkbox
                            v-model="status"
                            label="Active"
                        ></v-checkbox>
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
