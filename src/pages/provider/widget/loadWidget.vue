<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Widget View',
  },
})
const props = defineProps({
  page: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  patientId: {
    type: Number,
    required: false
  },
  page_name: {
    type: String,
    required: false
  },

})
import RowWidget from '@/views/apps/widgets/RowWidget.vue';


import { useWidgetBuilderStore } from '@/stores/widgetBuilderStore';
const widgtStore = useWidgetBuilderStore()

const layout = [
  {
    type: 'row-widget',
    child: [
      {
        type: 'col-widget',
        cols: '8',
        child: [
          { id: 14, widget_name: 'New image', widget_type: "visulize_chart" },

        ]
      },
      {
        type: 'col-widget',
        cols: '4',
        child: [
          { id: 5, widget_name: 'Bar chart', widget_type: "bar_chart" },

        ]
      }
    ]
  }
]
await widgtStore.getWidgetBuilder(props.page)











</script>

<template>
  <VRow v-if="$can('read', 'Builder Setup')">
    <VCol cols="12" md="12" sm="12" class="d-flex justify-end">
      <RouterLink
        :to="{ name: 'provider-widget-dashboard-setup', query: { page: props.page, type: props.type, page_name: props.page_name, patientId: props.patientId ? props.patientId : '' } }"
        class="font-weight-medium text-link">
        <VBtn variant="outlined" class="w-100">{{ $t('Edit') }}</VBtn>
      </RouterLink>
    </VCol>
  </VRow>
  <RowWidget v-for="row in widgtStore.layout" :is="row.type" :data="row" :patientId="patientId" />






</template>
