<script setup>

import ChartWidgt from '@/views/apps/widgets/ChartWidgt.vue';
import RenderVualizeImage from '@/views/apps/widgets/RenderVualizeImage.vue';
import tableWidgt from '@/views/apps/widgets/tableWidgt.vue';

import { useStore } from 'vuex';
const store = useStore()
const props = defineProps({
  widgetData:{
    type: Object,
    required: true,
    },  
  })

const isDialog = ref(false)
const isDialogChart = ref(false)

const emit = defineEmits([
  'saveProductData'

]);



onMounted(async () => {
 
})









</script>

<template>

   
    <VRow class="match-height">
      <VCol cols="12" v-if="widgetData.widget_type=='visulize_chart'">
    
        <RenderVualizeImage :widgetData="widgetData"/>
       </VCol>
       <VCol cols="12" v-if="widgetData.widget_type=='table'">
        <tableWidgt :widgetData="widgetData"/>
       
       </VCol>
       <VCol cols="12" v-if="widgetData.widget_type!='table' || widgetData.widget_type!='visulize_chart'">
        <ChartWidgt :widgetData="widgetData"/>
       </VCol>
    </VRow>
    
   
   
    
     
      
     

</template>

