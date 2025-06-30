<script setup>
definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})
import { FormeoRenderer } from 'formeo';
import { onMounted, ref } from 'vue';

import "../../../../node_modules/formeo/dist/formeo.min.css";
import deepToRaw from '../../apps/settings/intake-questions/deepToRaw';
import jsonConvert from '../../apps/settings/intake-questions/jsonConvert.js';

const builderData = JSON.parse(localStorage.getItem('builderData'));
const products = JSON.parse(localStorage.getItem('cart_products'));
const state = reactive({
  count: 0,
  option: {
    penColor: "rgb(0, 0, 0)",
    backgroundColor: "rgb(255,255,255)"
  },
  disabled: false
})
const refVForm = ref()
const questionerSettingForm = ref()
let renderer = null
let formData = null
const yourName = ref(null)
const signatureRef = ref(null)
const signature = ref(null)
const data = ref({})
const storedData = ref({})
let tempData = null
const props = defineProps({
    formRef: {
        required: true,
    },
    formId: {
        type: String,
        required: true,
    }
})
onMounted(async () => {

    let formApi = await $api(GET_REG_QUESTIONNAIRE_DATA+'/'+props.formId, {
                        method: 'GET',
                        onResponseError({ response }) {
                            console.error('Error in form API:', response);
                        }
                    });
    

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

    tempData = jsonConvert(deepToRaw(formApi.data.data))
    // console.log('tempData',props.formRef)
    renderer = new FormeoRenderer(options)
    renderer.render(tempData)
    
});

const save = async () => {  
        console.log(props.formRef.value)
        formData = new FormData((props.formRef.value))
        console.log('formData>',Object.fromEntries(formData.entries()),renderer)
        
};

</script>
<template>
    
            <form :ref="props.formRef" @submit.prevent="save()">
                <VRow>  
                    <VCol cols="12">  
                        <h2 class="ml-2 mb-2">{{ $t('Fill The Questionnaire') }}</h2>
                    </VCol>
                    
                    <VCol cols="12">
                        <div class="mt-2 formeo-wrap" ref="refVForm" ></div>
                    </VCol>
                    
                </VRow>
            </form>   
</template>
