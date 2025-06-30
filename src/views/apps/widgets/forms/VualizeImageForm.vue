<script setup>
import { useWidgetBuilderStore } from '@/stores/widgetBuilderStore';
import { addAlert } from '@/utils/showLoader';
import visulizeImage from '@/views/apps/widgets/visulizeImage.vue';
const widgtStore = useWidgetBuilderStore()
const visulizeImageData = ref({

  uploadedImage: null,
  imageUrl: '',
  dialog: false,
  bgImage: null,
  newPoint: { x: 0, y: 0, label: '', key: '', value: '', angle: 0, length: 100 }, // Added length
  points: [],
  imageFile: null

})
const openDialogImage = () => {
  if (!widgtStore.addWidget.form && !widgtStore.addWidget.datafrom) {
    addAlert('Please First Select Form  !', 'error')

  } else {
    widgtStore.addWidget.visulizImageDialog = true
  }
};
</script>

<template>

  <VCol cols="12">

    <v-btn @click="openDialogImage" color="primary">{{ $t('Set Image Point Chart') }}</v-btn>

  </VCol>
  <VDialog v-model="widgtStore.addWidget.visulizImageDialog">
    <DialogCloseBtn @click="widgtStore.addWidget.visulizImageDialog = false" />
    <VCard :title="$t('Set Point Data')">

      <VCardText>
        <visulizeImage :visulizeImageData="widgtStore.addWidget.visulizeImageData"
          :mergedFields="widgtStore.addWidget.formField" :filedObject="widgtStore.addWidget.filedObject"
          :fieldArray="widgtStore.addWidget.fieldArray" :chartSampleData="widgtStore.addWidget.chartSampleData" />
        <VBtn text @click="widgtStore.addWidget.visulizImageDialog = false">Add</VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
