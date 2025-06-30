<script setup>
import { useBuilderStore } from '@/stores/builderStore';
import { requiredValidator } from '@core/utils/validators';

import { useRoute, useRouter } from 'vue-router';
import draggable from 'vuedraggable/src/vuedraggable';
import Appointment from './components/Appointment.vue';
import Blank from './components/Blank.vue';
import ComboForms from './components/ComboForms.vue';
import Forms from './components/Forms.vue';
import MultipleForms from './components/MultipleForms.vue';
import Payment from './components/Payment.vue';
import Products from './components/Products.vue';

const builderStore = useBuilderStore()
const route = useRoute();
const router = useRouter();

let id = route.params.id;
const baseURL = `${window.location.protocol}//${window.location.host}${router.options.history.base}`;
const link = ref(baseURL + '/patient/review-cart?bid=' + btoa(id))
const patientSignup = ref(baseURL + '/patient/signup?bid=' + btoa(id))
const snackbar = ref(false);

builderStore.resetBuilder()

if (id) builderStore.getNewBuilderById(id)

const dragableItems = computed(() =>
  builderStore.dragableItems.filter(item => item.value === "forms" || item.value === "comboforms" || item.value === "multipleforms" ||
    !builderStore.layout.find(obj => obj.type === item.value)
  )
)

const widgetComponent = {
  payment: Payment,
  appointment: Appointment,
  products: Products,
  blank: Blank,
  forms: Forms,
  comboforms: ComboForms,
  multipleforms: MultipleForms,

}
const bulderForm = ref();
const dragOptions = {
  animation: 200,
  group: {
    name: 'widgets',
    pull: 'clone',
    put: false
  }
};

const widgetDragOptions = {
  animation: 200,
  group: {
    name: 'widgets',
    put: true
  }
};

// Remove widget from column
const removeWidget = (column, widgetIndex) => {
  column.splice(widgetIndex, 1);
};

const selectedWidget = ref(null);


const onDropData = (evt, target) => {
  console.log('dragged item', evt, target);
  if (evt.added && evt.added.element.isSideBar) {
    builderStore.draggedIndex = evt.added.newIndex;
    selectedWidget.value = evt.added.element;
    console.log('selectedWidget.value', selectedWidget.value);
    if (target.widgets) {
      target.widgets.splice(builderStore.draggedIndex, 1);
      builderStore.apendChild = target.widgets;
    } else {
      target.splice(builderStore.draggedIndex, 1);
      builderStore.apendChild = target;
    }
    builderStore.selectedWidget = null
    if (selectedWidget.value.value !== 'productForm' && selectedWidget.value.value !== 'categoryForm') {
      console.log('here', selectedWidget.value)
      builderStore.isDialog = true;
    } else {
      builderStore.selectedWidget = {
        title: selectedWidget.value?.title.charAt(0).toUpperCase() + selectedWidget.value?.title.slice(1),
        type: selectedWidget.value?.value,
        config: {}
      };

      builderStore.addItem(builderStore.selectedWidget);
    }

  }
};

const editDialog = (widget, widgetIndex) => {
  console.log('widget', widget, widgetIndex)
  selectedWidget.value = {
    value: widget.type,
    title: widget.title,
  }
  builderStore.selectedWidget = widget
  builderStore.isDialog = true;
};

const saveData = async () => {
  const { valid } = await bulderForm.value.validate();
  if (valid) {
    await builderStore.saveNewBuilder()
    console.log('Position in layout:', builderStore.layout);
  }
};
const copyToClipboard = () => {
  navigator.clipboard.writeText(link.value).then(() => {
    snackbar.value = true; // Show success message
  });
};

const copyLinkToClipboard = () => {
  navigator.clipboard.writeText(patientSignup.value).then(() => {
    snackbar.value = true; // Show success message
  });
};
</script>

<template>
  <v-snackbar v-model="snackbar" timeout="2000">
    {{ $t('Copied to clipboard!') }}
  </v-snackbar>
  <v-app>
    <v-navigation-drawer permanent width="250">
      <v-list>
        <v-list-subheader> {{ $t('Drag Widgets') }}</v-list-subheader>
        <draggable v-model="dragableItems" v-bind="dragOptions" item-key="id" class="widget-sidebar">
          <template #item="{ element: widget }">
            <v-list-item class="mb-2 draggable-widget" :disabled="widget.isDisable">
              <template v-slot:prepend>
                <v-icon :icon="widget.icon" class="handle"></v-icon>
              </template>
              <v-list-item-title>{{ widget.title }}</v-list-item-title>
            </v-list-item>
          </template>
        </draggable>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <v-form ref="bulderForm">
          <v-sheet class="mb-4 pa-4" rounded elevation="1">
            <v-row>
              <v-col>
                <v-card-text>
                  <v-row class="mb-2">
                    <v-col cols="12" md="12" v-if="id">
                      <h5 class="text-h5 mb-5">
                        {{ $t('Share the product selection link') }}
                      </h5>
                      <div class="d-flex gap-4 align-center flex-wrap">
                        <AppTextField v-model="link" label="" readonly />
                        <div class="d-flex align-self-end gap-x-2">
                          <VBtn @click="copyToClipboard" icon class="rounded" color="secondary">
                            <VIcon color="white" icon="tabler-copy" />
                          </VBtn>
                        </div>
                      </div>
                      <h5 class="text-h5 mb-5 mt-3">
                        {{ $t('Share the signup link') }}
                      </h5>
                      <div class="d-flex gap-4 align-center flex-wrap">
                        <AppTextField v-model="patientSignup" label="" readonly />
                        <div class="d-flex align-self-end gap-x-2">
                          <VBtn @click="copyLinkToClipboard" icon class="rounded" color="secondary">
                            <VIcon color="white" icon="tabler-copy" />
                          </VBtn>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="12">
                      <label>{{ $t('Builder Name') }}</label>
                      <VTextField v-model="builderStore.name" label="" :rules="[requiredValidator]"
                        density="comfortable" />
                    </v-col>
                  </v-row>
                  <v-card class="mb-2 widget-card" :disabled="true">
                    <v-card-title class="d-flex align-center justify-space-between">
                      <div class="d-flex align-center">
                        <v-icon class="handle mr-2" icon="tabler-drag-drop-2"></v-icon>
                        {{ builderStore.layout[0].title }}
                      </div>
                    </v-card-title>
                  </v-card>
                  <draggable :list="builderStore.layout" v-bind="widgetDragOptions" class="widget-list" item-key="id"
                    @change="(evt) => onDropData(evt, builderStore.layout)">
                    <template #item="{ element: widget, index: widgetIndex }">
                      <v-card class="mb-2 widget-card" v-if="widget.type !== 'login'" style="cursor: all-scroll;">
                        <v-card-title class="d-flex align-center justify-space-between">
                          <div class="d-flex align-center">
                            <v-icon class="handle mr-2" icon="tabler-drag-drop-2"></v-icon>
                            {{ widget.title }}
                          </div>

                          <div class="d-flex align-center">
                            <v-btn icon="tabler-edit" size="small" color="error" variant="text"
                              v-if="widget.type !== 'productForm' && widget.type !== 'categoryForm'"
                              @click="editDialog(widget, widgetIndex)"></v-btn>
                            <v-btn icon="tabler-trash" size="small" color="error" variant="text"
                              @click="removeWidget(builderStore.layout, widgetIndex)"></v-btn>

                          </div>
                        </v-card-title>
                      </v-card>
                    </template>
                  </draggable>
                </v-card-text>
              </v-col>
            </v-row>
          </v-sheet>

          <div class="d-flex justify-space-between mb-4">
            <v-btn color="primary" @click="saveData" prepend-icon="tabler-plus">{{ $t('Save') }}</v-btn>
          </div>
        </v-form>
      </v-container>
    </v-main>

    <VDialog v-model="builderStore.isDialog" max-width="800">
      <DialogCloseBtn @click="builderStore.isDialog = !builderStore.isDialog" />
      <component :dragged-widget="selectedWidget" :is="widgetComponent[selectedWidget.value]" />
    </VDialog>
  </v-app>
</template>

<style scoped>
.scrollable-container {
  max-height: calc(100vh - 64px);
  /* Adjust 64px for subheader and padding */
  overflow: hidden;
  /* Prevent native scrollbars */
  display: flex;
  flex-direction: column;
}

.widget-sidebar {
  padding: 8px;
}

.widget-sidebar {
  padding: 8px;
}

.draggable-widget {
  cursor: move;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
}

.handle {
  cursor: move;
}

.widget-list {
  min-height: 100px;
  padding: 8px 0;
}

.column-card {
  height: 100%;
  border: 1px solid #e0e0e0;
}

.widget-card {
  background: #f5f5f5;
}

.row {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}

.sortable-ghost {
  opacity: 0.5;
  background: #c8ebfb !important;
}

.sortable-drag {
  opacity: 0.9;
}

.column-size-select :deep(.v-field__input) {
  padding: 4px 8px;
}
</style>
