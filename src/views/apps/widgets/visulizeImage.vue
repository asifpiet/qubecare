<script setup>



  const props = defineProps({
  visulizeImageData:{
    type: Object,
    required: true,
    },
    mergedFields:{
    type: Array,
    required: true,
    },
    filedObject:{
    type: Object,
    required: true,
    },
    fieldArray:{
    type: Array,
    required: true,
    },
    chartSampleData:{
    type: Object,
    required: true,
    },
    
  })
  const canvasWidth = 800; // Example width in pixels
const canvasHeight = 600;
const fixedWidth = 400; // Fixed width of the image
const fixedHeight =500; // Fixed height of the image
   // const { width: canvasWidth, height: canvasHeight } = useElementSize(document.body);

    const onImageUpload = () => {
      if (props.visulizeImageData.uploadedImage) {
        const file = props.visulizeImageData.uploadedImage;
        const image = new Image();
        image.src = URL.createObjectURL(file);
        props.visulizeImageData.imageFile=file
        console.log(file)
        image.onload = () => {
          props.visulizeImageData.bgImage = image;
          props.visulizeImageData.imageUrl = image.src;
        };
      }
    };

    const addDataPoint = (e) => {
      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      props.visulizeImageData.newPoint.x = pointer.x;
      props.visulizeImageData.newPoint.y = pointer.y;
      props.visulizeImageData.newPoint.angle = 0; // Default angle
      props.visulizeImageData.newPoint.length = 100; // Default length
      props.visulizeImageData.dialog = true;
    };
const updateLabel = (filedObject) => {  
  console.log(filedObject)
      // Remove the selected name from formField when it is being used  
      //filedObject.title = formField.value.filter(f => f.name !== filedObject.name); 
      const existingLabel = props.mergedFields.find(f => f.name === filedObject)?.label;
  props.filedObject.label = existingLabel
  props.filedObject.key=filedObject
      props.filedObject.isForm=true 
  props.filedObject.title = existingLabel 
  props.visulizeImageData.newPoint.label = existingLabel
  props.visulizeImageData.newPoint.key=filedObject
    }; 
const saveDataPoint = () => {
  props.mergedFields = props.mergedFields.filter(f => f.name !== props.filedObject.name);
  
      // Convert angle to radians for trigonometric calculations
      
      props.fieldArray.push({ ...props.filedObject });  
      props.visulizeImageData.points.push({ 
        ...props.visulizeImageData.newPoint, 
        angle: ( props.visulizeImageData.newPoint.angle * Math.PI) / 180 
      });
      console.log(props.visulizeImageData.points)
      props.chartSampleData=props.visulizeImageData.points
      props.visulizeImageData.newPoint.label = '';
      props.visulizeImageData.newPoint.value = '';
      props.visulizeImageData.newPoint.angle = 0;
      
      props.visulizeImageData.newPoint.length = 100;
      props.visulizeImageData.dialog = false;
      let valueDat = props.mergedFields.filter(f => f.name !== props.filedObject.name);
      if (valueDat !== -1) {
      props.mergedFields.splice(valueDat, 1); // Removes one element at the found index
      }
      props.filedObject.name=null
    props.filedObject = { name: null, label: '', sortable:false,searchable:false,isForm:true };
    };

const viewDataPoint = (point) => {
      console.log(point)
      //alert(`Point: ${point.label || 'Unnamed'}, Value: ${point.value || 'N/A'}, X: ${point.x}, Y: ${point.y}, Length: ${point.length}, Angle: ${(point.angle * 180) / Math.PI}°`);
      props.visulizeImageData.dialog = false;
    };

    const removeWidgt = (index) => {
  const fieldToRemove = props.fieldArray[index].name;
  const fieldLabel = props.fieldArray[index].label;

  if (fieldToRemove) {
    const isPatientField = fieldArray.value[index].isForm === true;

    if (isPatientField) {
      // Check if the field already exists in formField
      const removedFieldIndex = props.mergedFields.findIndex(field => field.name === fieldToRemove);
      if (removedFieldIndex === -1) {
        props.mergedFields.push({
          name: fieldToRemove,
          label: fieldLabel || fieldToRemove,
        });
      }
    }
    // Update mergedFields with latest formField and patientField values
    props.fieldArray.splice(index, 1);
   

   
    console.log('Updated mergedFields:', mergedFields.value);
    console.log('Updated fieldArray:', fieldArray.value);
    // Remove the field from fieldArray
    

  
  }
};


</script>




<template>
  <div>
    <VContainer>
      <!-- Image Upload -->
       <VRow>
      <VCol cols="12" md="12">
      <VFileInput 
        label="Upload Human Body Image"
        accept="image/*"
        v-model="props.visulizeImageData.uploadedImage"
        @change="onImageUpload"
      />
    </VCol>
  </VRow>
      <!-- Interactive Canvas -->
      <div v-if="props.visulizeImageData.imageUrl" class="canvas-container">
        <v-stage ref="stage" :config="{ width: canvasWidth, height: canvasHeight }" @click="addDataPoint">
          <v-layer>
            <!-- Background Image -->
            <v-image 
            :config="{
              image: props.visulizeImageData.bgImage,
              width: fixedWidth, // Set the fixed width
              height: fixedHeight, // Set the fixed height
              x: (canvasWidth - fixedWidth) / 2, // Center horizontally
              y: (canvasHeight - fixedHeight) / 2, // Center vertically
            }" />

            <!-- Data Points with Directional Arrows -->
            <template v-for="(point, index) in props.visulizeImageData.points" :key="index">
              <!-- Arrow -->
              <v-arrow
                :config="{
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
                }"
              />
              <!-- Value at Arrow Endpoint -->
              <v-text
              :config="{
                x: point.x + Math.cos(point.angle) * point.length, // End of arrow X coordinate
                y: point.y + Math.sin(point.angle) * point.length, // End of arrow Y coordinate
                text: `${point.label || 'Point'}: ${point.value || ''}`, // Text content
                fontSize: 14,
                fill: 'blue',
                offsetX: 10, // Adjust horizontal offset to slightly separate the text from the arrow
                offsetY: -10, // Adjust vertical offset to align better
              }"
            />
              <!-- Circle -->
              <v-circle
                :config="{
                  x: point.x,
                  y: point.y,
                  radius: 5,
                  fill: 'red',
                  stroke: 'black',
                  strokeWidth: 1,
                }"
                @click="viewDataPoint(point)"
              />
            </template>
          </v-layer>
        </v-stage>
      </div>

      <!-- Popup Dialog -->
      <VDialog v-model="props.visulizeImageData.dialog" max-width="400">
        <VCard>
          <VCardTitle>Add Data Point</VCardTitle>
          <VCardText>
            <VCol cols="12" md="12" >  
                            <AppSelect
                                  v-model="props.filedObject.name"
                                  label="Form Field"
                                  placeholder="Select a field"
                                  :items="props.mergedFields"
                                  item-value="name"
                                  item-title="label"
                                  @update:model-value="updateLabel"
                                >
                                  <template #item="{ item, props }">
                                  
                                    <template v-if="item.title=='divider'">
                                      <h4 style="padding-left:5px;">Patient:</h4>
                                      <v-divider />
                                    </template>
                                    <template v-else>
                                      <v-list-item v-bind="props">
                                        <v-list-item-title></v-list-item-title>
                                      </v-list-item>
                                    </template>
                                  </template>
                                </AppSelect>
                       </VCol>
            <VCol cols="12" md="12" >           
            <VTextField v-model=" props.visulizeImageData.newPoint.label" label="Label" outlined />
            </VCol>
            <VTextField v-model=" props.visulizeImageData.newPoint.value" label="Value" outlined style="display: none;"/>
            <VSlider
              v-model="props.visulizeImageData.newPoint.angle"
              label="Arrow Direction (degrees)"
              min="0"
              max="360"
              step="1"
              track-fill-color="blue"
            />
            <VSlider
              v-model="props.visulizeImageData.newPoint.length"
              label="Arrow Length"
              min="50"
              max="200"
              step="10"
              track-fill-color="green"
            />
          </VCardText>
          <VCardActions>
            <VBtn color="primary" @click="saveDataPoint">Save</VBtn>
            <VBtn text @click="props.visulizeImageData.dialog = false">Cancel</VBtn>
          </VCardActions>
        </VCard>
      </VDialog>

      <!-- View Saved Data -->
      <VExpansionPanels >
        <VExpansionPanel v-for="(point, index) in props.visulizeImageData.points" :key="index" style="display: none;">
          <VExpansionPanelTitle >
            {{ point.label || `Point ${index + 1}` }}
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            X: {{ point.x }}, Y: {{ point.y }}, Value: {{ point.value }}, Length: {{ point.length }}, Angle: {{ (point.angle * 180) / Math.PI }}°
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </VContainer>
  </div>
</template>



<style scoped>

.canvas-container {
  position: relative;
  margin: 0 auto;
  width: 100%; /* Set desired width */
  height: 600px; /* Set desired height */
  border: 1px solid #ddd; /* Optional: Add a border for visual reference */
  background-color: #f9f9f9; /* Optional: Set a background color */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
