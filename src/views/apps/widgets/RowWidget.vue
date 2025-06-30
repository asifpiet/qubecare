<script setup>
import ColWidget from '@/views/apps/widgets/ColWidget.vue';
import TabsWidget from '@/views/apps/widgets/TabsWidget.vue';
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  patientId: {
    type: Number,
    required: false,
  }
})
const widgetComponent = {
  'col-widget': ColWidget,
  'tabs-widget': TabsWidget,


}
console.log(props.data)

</script>

<template>
  <VRow>
    <VCol>
      <DynamicCard :meta="props.data.metaConfig">
        <VRow>

          <component v-for="widget in props.data.child" :is="widgetComponent[widget.type]" :data="widget"
            :patientId="props.patientId" />

        </VRow>
      </DynamicCard>
    </VCol>
  </VRow>





</template>
