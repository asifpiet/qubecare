<script setup>
import { useWidgetBuilderStore } from '@/stores/widgetBuilderStore';
const widgtStore = useWidgetBuilderStore()
</script>

<template>

  <VCol cols="12">
    <AppSelect v-model="widgtStore.addWidget.dataSetBy" :label="$t('Data Set By')" placeholder=""
      :items="widgtStore.addWidget.dataSetByList" />
  </VCol>
  <VCol cols="12" md="12">
    <AppSelect v-model="widgtStore.addWidget.agrigateBy" :label="$t('Agrigate Value')" :placeholder="$t('Select a field')"
      :items="widgtStore.addWidget.formField" item-value="name" item-title="label">

    </AppSelect>
  </VCol>
</template>
