<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { useWidgetBuilderStore } from '@/stores/widgetBuilderStore';
import Intake from '@/views/apps/patient/Intake/Intake.vue';
import updateForm from '@/views/apps/patient/Intake/updateForm.vue';
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';
import { nextTick, onMounted, ref } from 'vue';

const widgtStore = useWidgetBuilderStore();
const formsStore = useFormsStore();
const patient = ref({});
const tags = ref([]); // Use a ref to store tags
const storedData = ref({});
const mergedArray = ref({});
const tagifyInstances = ref([]); // Store Tagify instances
const rowId = ref(0);
const props = defineProps({
  widgetData: {
    type: Object,
    required: true,
  },
  patientId: {
    type: Number,
    required: false,
  },
});

const isIntakeDrawerVisible = ref(false);
const isUpdateIntakeDrawerVisible = ref(false);
const handleEditClick = (id, row) => {
  if (props.widgetData.id == id) {
    isUpdateIntakeDrawerVisible.value = true;
    rowId.value = row;
  }
};

if (props.patientId) {
  patient.value.id = props.patientId;
}

await widgtStore.listView(props.widgetData.widget_type, props.widgetData.id, props.patientId ? props.patientId : '');

const updateTagifyInstances = () => {
  tagifyInstances.value.forEach((tagify, index) => {
    if (tagify && tags.value[index]) {
      tagify.removeAllTags(); // Clear existing tags
      console.log("Adding tags:", tags.value[index]); // Debugging: Log the tags to be added
      tagify.addTags(tags.value[index]); // Add new tags
    }
  });
};

// Watch for changes in tagData and update tags
watch(
  () => widgtStore.tagData,
  (newTagData) => {
    nextTick(() => {
      const tagifyInputs = document.querySelectorAll('.tags-input');
      tagifyInputs.forEach((input, index) => {
        const tagify = new Tagify(input, {
          whitelist: [], // Optional: Predefined list of tags
          dropdown: {
            enabled: 0, // Show dropdown after typing
          },
        });

        // Store the Tagify instance
        tagifyInstances.value[index] = tagify;

        // Set initial value if tags are available
        if (tags.value && tags.value[index]) {
          tagify.addTags(tags.value[index]);
        }
      });
    });
  },
  { immediate: true }
);

// Initialize Tagify instances
onMounted(() => {
  nextTick(() => {
    const tagifyInputs = document.querySelectorAll('.tags-input');
    tagifyInputs.forEach((input, index) => {
      const tagify = new Tagify(input, {
        whitelist: [], // Optional: Predefined list of tags
        dropdown: {
          enabled: 0, // Show dropdown after typing
        },
      });

      // Store the Tagify instance
      tagifyInstances.value[index] = tagify;

      // Set initial value if tags are available
      if (tags.value && tags.value[index]) {
        tagify.addTags(tags.value[index]);
      }
    });
  });
});



const getKeysFromTagData = () => {
  if (widgtStore.tagData && widgtStore.tagData.length > 0) {
    return widgtStore.tagData.map((item) => {
      // Get the first key in the object
      const firstKey = Object.keys(item)[0];

      // Get the value of the first key
      const firstKeyValue = item[firstKey];

      // Parse the value if it's a JSON string
      try {
        const parsedValue = JSON.parse(firstKeyValue);
        if (Array.isArray(parsedValue)) {
          // If the parsed value is an array, extract the `value` property from each object
          return parsedValue.map((obj) => obj.value);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }

      // If parsing fails or the value is not an array, return the raw value
      return [firstKeyValue];
    });
  }
  return [];
};
const closeIntakeForm = async () => {
  await widgtStore.listView(props.widgetData.widget_type, props.widgetData.id, props.patientId ? props.patientId : '');
  isIntakeDrawerVisible.value = false;
  isUpdateIntakeDrawerVisible.value = false

};
</script>
<template>
  <DynamicCard :meta="props.widgetData.metaConfig" :title="props.widgetData.widget_name">
    <div class="text-right" style="align-self: flex-start;">
      <IconBtn @click="isIntakeDrawerVisible = true" v-if="widgtStore.tagData.length == 0">
        <VIcon icon="tabler-edit" class="text-primary" />
      </IconBtn>
    </div>

    <!-- List on the left -->
    <v-col align="start" justify="space-between">
      <div class="d-flex flex-wrap ml-3">
        <div v-for="(item, index) in widgtStore.tagData" :key="index"
          v-if="widgtStore.tagData && widgtStore.tagData.length > 0">
          <!-- Input and edit icon container -->
          <div class="input-with-icon">
            <!-- Tagify input field -->
            <input type="text" class="tags-input" :data-index="index" :value="getKeysFromTagData()[index].join(', ')"
              readonly />
            <!-- Edit icon -->
            <div class="edit-icon" v-if="props.widgetData.form_id && props.widgetData.metaConfig.editBtn">
              <IconBtn @click="handleEditClick(props.widgetData.id, item.form_value_id)">
                <VIcon icon="tabler-edit" class="text-primary" />
              </IconBtn>
            </div>
          </div>
        </div>
      </div>
    </v-col>
  </DynamicCard>

  <VDialog v-model="isUpdateIntakeDrawerVisible" max-width="800" v-if="props.widgetData.form_id">
    <DialogCloseBtn @click="isUpdateIntakeDrawerVisible = false" />
    <VCard>
      <VCardText>
        <updateForm v-if="isUpdateIntakeDrawerVisible && props.widgetData.form_id" @closePopup="closeIntakeForm"
          :patient="patient" :storedData="storedData" :rowId="rowId" :selectedFormId="props.widgetData.form_id" />
      </VCardText>
    </VCard>
  </VDialog>
  <VDialog v-model="isIntakeDrawerVisible" max-width="800" v-if="props.widgetData.form_id">
    <DialogCloseBtn @click="isIntakeDrawerVisible = false" />
    <VCard>
      <VCardText>
        <Intake v-if="isIntakeDrawerVisible && props.widgetData.form_id" @closePopup="closeIntakeForm"
          :patient="patient" :storedData="storedData" :rowId="rowId" :selectedFormId="props.widgetData.form_id" />
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped>
.canvas-container {
  position: relative;
  margin: 0 auto;
  width: 100%;
  height: 600px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tags-input {
  width: 100%;
  /* Take up full width */
  padding: 8px 32px 8px 8px;
  /* Add padding for the icon */
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

.edit-icon {
  position: absolute;
  right: 8px;
  /* Position at the end of the input */
  top: 50%;
  /* Center vertically */
  transform: translateY(-50%);
  /* Center vertically */
  cursor: pointer;
  /* Show pointer cursor on hover */
}

:deep(.tags-input-container) {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

:deep(.tags-input) {
  border: none;
  outline: none;
  padding: 4px;
  flex-grow: 1;
  min-width: 100px;
}
</style>
