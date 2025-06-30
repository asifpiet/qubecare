<script setup>
import { requiredValidator } from '@core/utils/validators';
import { FormeoEditor } from 'formeo';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import "../../../../node_modules/formeo/dist/formeo.min.css";
import deepToRaw from '../intakeQuestion/deepToRaw.js';
import jsonConvert from '../intakeQuestion/jsonConvert.js';
import patchEditor from '../intakeQuestion/patchEditor.js';
const emit = defineEmits(['submit'])
const route = useRoute();
const props = defineProps({
  formId: {
    type: Number,
    required: false,
  },
})

const store = useStore();
const refVForm = ref()
const questionerSettingForm = ref()
const name = ref(null)
const description = ref(null)
const status = ref(false)
let editor = null
let formData = null
let id = props.formId;
const data = ref({})
onMounted(async () => {
    await store.dispatch('getQuestionerQuestionsFormById',{id:id});
    data.value = store.getters.getQuestionerQuestion
    name.value = data.value?.name
    description.value = data.value?.description
    status.value = data.value?.status==1? true : false
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
    console.log('refVForm',refVForm.value,jsonConvert(deepToRaw(store.getters.getQuestionerQuestion.data)))
    editor = new FormeoEditor(options,jsonConvert(deepToRaw(store.getters.getQuestionerQuestion.data)))

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
        await store.dispatch('updateQuestionerQuestionsForm',{
            id: id,
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
    <VCard title="Edit Questioner Questions">
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
