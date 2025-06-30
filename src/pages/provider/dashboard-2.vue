<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Dashboard View',
  },
})
import loadWidget from '@/pages/provider/widget/loadWidget.vue';
import { useWidgetBuilderStore } from '@/stores/widgetBuilderStore';
const widgtStore = useWidgetBuilderStore()
const type = 'global'


await widgtStore.getPage(type)
const page = await widgtStore.pageData.id
console.log('widgtStore.pageData', widgtStore.pageData)





</script>

<template>


  <loadWidget :page="page" :type="type" />
</template>
