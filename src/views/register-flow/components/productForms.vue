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
import deepToRaw from '@/pages/apps/settings/intake-questions/deepToRaw';
import jsonConvert from '@/pages/apps/settings/intake-questions/jsonConvert.js';

const refVForm = ref()
let renderer = null
let formData = null
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
    console.log('formRef',props.formRef)
    let formApi = await $api(GET_REG_FORM_DATA+'/'+props.formId, {
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
        console.log('formData',Object.fromEntries(formData.entries()),renderer)
};

</script>
<template>
    
            <form :ref="props.formRef" @submit.prevent="save()">
                <VRow> 
                    
                    <VCol cols="12">
                        <div class="mt-2 formeo-wrap" ref="refVForm" ></div>
                    </VCol>
                    
                </VRow>
            </form>   
</template>
