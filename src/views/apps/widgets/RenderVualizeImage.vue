<script setup>
const patientId = ref('')
import { useWidgetBuilderStore } from '@/stores/widgetBuilderStore';
import { reactive, ref } from 'vue';
const widgtStore = useWidgetBuilderStore()
const props = defineProps({
  widgetData: {
    type: Object,
    required: true,
  },
  patientId: {
    type: Number,
    required: false,
  }
})

const dialog = ref(false);
const newPoint = reactive({ x: 0, y: 0, label: '', value: '', angle: 0, length: 100 }); // Added length

const canvasWidth = 800; // Example width in pixels
const canvasHeight = 600;
const fixedWidth = 400; // Fixed width of the image
const fixedHeight = 500; // Fixed height of the image



const addDataPoint = (e) => {
  const stage = e.target.getStage();
  const pointer = stage.getPointerPosition();
  newPoint.x = pointer.x;
  newPoint.y = pointer.y;
  newPoint.angle = 0; // Default angle
  newPoint.length = 100; // Default length
  dialog.value = true;
};


if (props.patientId) {
  patientId.value = props.patientId
}


await widgtStore.getChartImage(props.widgetData.widget_type, props.widgetData.id, patientId.value)




</script>




<template>

  <!-- Image Upload -->

  <DynamicCard :meta="props.widgetData.metaConfig" :title="props.widgetData.widget_name">
    <!-- Interactive Canvas -->
    <div v-if="widgtStore.chartImage" class="canvas-container">
      <v-stage ref="stage" :config="{ width: canvasWidth, height: canvasHeight }" @click="addDataPoint">
        <v-layer>

          <!-- Background Image -->
          <v-image :config="{
            image: widgtStore.chartImage,
            width: fixedWidth, // Set the fixed width
            height: fixedHeight, // Set the fixed height
            x: (canvasWidth - fixedWidth) / 2, // Center horizontally
            y: (canvasHeight - fixedHeight) / 2, // Center vertically
          }" />

          <!-- Data Points with Directional Arrows -->
          <template v-for="(point, index) in widgtStore.imagePointValue" :key="index">
            <!-- Arrow -->
            <v-arrow :config="{
              points: [
                point.x,
                point.y,
                point.x + Math.cos(point.angle) * point.length,
                point.y + Math.sin(point.angle) * point.length
              ],
              pointerLength: 10,
              pointerWidth: 10,
              fill: 'black',
              stroke: 'black',
              strokeWidth: 2,
            }" />
            <!-- Value at Arrow Endpoint -->
            <<v-text :config="{
              x: point.x + Math.cos(point.angle) * point.length, // End of arrow X coordinate
              y: point.y + Math.sin(point.angle) * point.length, // End of arrow Y coordinate
              text: `${point.label || 'Point'}: ${point.value || ''}`, // Text content
              fontSize: 14,
              fill: 'blue',
              offsetX: 10, // Adjust horizontal offset to slightly separate the text from the arrow
              offsetY: -10, // Adjust vertical offset to align better
            }" />
            <!-- Circle -->
            <v-circle :config="{
              x: point.x,
              y: point.y,
              radius: 5,
              fill: 'red',
              stroke: 'black',
              strokeWidth: 1,
            }" @click="viewDataPoint(point)" />
          </template>
        </v-layer>
      </v-stage>
    </div>
  </DynamicCard>



</template>
<style scoped>
.canvas-container {
  position: relative;
  margin: 0 auto;
  width: 100%;
  /* Set desired width */
  height: 600px;
  /* Set desired height */
  border: 1px solid #ddd;
  /* Optional: Add a border for visual reference */
  background-color: #f9f9f9;
  /* Optional: Set a background color */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
