<script setup>
import { useWidgetBuilderStore } from '@/stores/widgetBuilderStore';
import AddWidget from '@/views/apps/widgets/AddWidgetDrag.vue';
import { useI18n } from 'vue-i18n';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import draggable from 'vuedraggable/src/vuedraggable';
import { useStore } from 'vuex';
const { t } = useI18n();
const widgtStore = useWidgetBuilderStore()
const store = useStore()
const isDialog = ref(false)
const apendChild = ref([])
const draggedIndex = ref()
definePage({
  meta: {
    action: 'read',
    subject: 'Builder Setup',
  },
})
const route = useRoute()
const page = route.query.page
const type = route.query.type
const page_name = route.query.page_name
await widgtStore.getWidgetBuilder(page)
const sidebarWidgetsFilter = ref([])
const sidebarWidgets = ref([
  { title: 'Table', value: 'table', isSideBar: true, icon: 'tabler-table', role: ['global', 'patient'], isCustom: false },
  { title: 'List View', value: 'list_view', isSideBar: true, icon: 'tabler-file-chart', role: ['patient'], isCustom: false },
  { title: 'Tags View', value: 'tags_view', isSideBar: true, icon: 'tabler-file-chart', role: ['patient'], isCustom: false },
  { title: 'Visualize Chart', value: 'visulize_chart', isSideBar: true, icon: 'tabler-file-chart', role: ['patient'], isCustom: false },
  { title: 'Bar Chart', value: 'bar_chart', isSideBar: true, icon: 'tabler-chart-bar', role: ['global', 'patient'], isCustom: false },
  { title: 'Horizontal Bar Chart', value: 'horizontal_bar_chart', isSideBar: true, icon: 'tabler-chart-arrows', role: ['global', 'patient'], isCustom: false },
  { title: 'Line Chart', value: 'line_chart', isSideBar: true, icon: 'tabler-chart-line', role: ['global', 'patient'], isCustom: false },
  { title: 'Patient Detail', value: 'patient_detail_prescrption', isSideBar: true, icon: 'tabler-file-chart', role: ['patient'], isCustom: true },
  { title: 'Multi Form Render', value: 'multi_form_render', isSideBar: true, icon: 'tabler-form', role: ['patient'], isCustom: true },
  { title: 'Prescriptions', value: 'prescrption', isSideBar: true, icon: 'tabler-pill', role: ['patient'], isCustom: true },
  { title: 'Demographics', value: 'demographics', isSideBar: true, icon: 'tabler-file-info', role: ['patient'], isCustom: true },
  { title: 'Patient Documents', value: 'patient_documents', isSideBar: true, icon: 'tabler-file-type-doc', role: ['patient'], isCustom: true },
  { title: 'Health Maintenance', value: 'health_maintenance', isSideBar: true, icon: 'tabler-heart-rate-monitor', role: ['patient'], isCustom: true },
  { title: 'Clinical Profile', value: 'clinical_profile', isSideBar: true, icon: 'tabler-hospital-circle', role: ['patient'], isCustom: true },
  { title: 'Tasks/Orders', value: 'tasks_orders', isSideBar: true, icon: 'tabler-stack-forward', role: ['patient'], isCustom: true },
  { title: 'Go To Call', value: 'got_to_call', isSideBar: true, icon: 'tabler-phone', role: ['patient'], isCustom: true },
  { title: 'Chat', value: 'chat', isSideBar: true, icon: 'tabler-message', role: ['patient'], isCustom: true },
  { title: 'Intake/Charting Form', value: 'intake_form', isSideBar: true, icon: 'tabler-clipboard-text', role: ['patient'], isCustom: true },
  { title: 'Consent Form', value: 'consent_form', isSideBar: true, icon: 'tabler-file-text', role: ['patient'], isCustom: true },
  { title: 'Vitals', value: 'vitals', isSideBar: true, icon: 'tabler-heart-rate-monitor', role: ['patient'], isCustom: true },
  { title: 'Notes', value: 'notes', isSideBar: true, icon: 'tabler-notes', role: ['patient'], isCustom: true },
  { title: 'Transcriptions', value: 'transcrption', isSideBar: true, icon: 'tabler-calendar', role: ['patient'], isCustom: true },
  { title: 'Previous Appointments', value: 'previous_appointments', isSideBar: true, icon: 'tabler-calendar', role: ['patient'], isCustom: true },
])


const iconPickerDialog = ref(false);
const selectedTabIndex = ref(null);

const openIconPicker = (index) => {
  selectedTabIndex.value = index;
  iconPickerDialog.value = true;
};

const selectIcon = (column, icon) => {
  if (selectedTabIndex.value !== null) {
    column.tabs[selectedTabIndex.value].icon = icon;
    iconPickerDialog.value = false;
  }
};
const clearTabContent = (column, tab) => {
  tab.title = `Tab ${column.tabs.indexOf(tab) + 1}`; // Reset to default title
  tab.icon = ''; // Clear the icon
};
const selectBackgroundColor = (color) => {
  if (widgtStore.metaSelect) {
    widgtStore.metaSelect.backgroundColor = color;
  }
};
const availableIcons = ref([
  'tabler-home',
  'tabler-user',
  'tabler-settings',
  'tabler-chart-bar',
  'tabler-file',
  'tabler-stack-forward',
  'tabler-hospital-circle',
  'tabler-heart-rate-monitor',
  'tabler-file-type-doc',
  'tabler-file-info',
  'tabler-pill',
  'tabler-chart-line',
  'tabler-chart-arrows',
  'tabler-table',
  'tabler-message',
  'tabler-clipboard-text',
  'tabler-file-text',
  'tabler-heart-rate-monitor',
  'tabler-notes'
  // Add more icons as needed
]);
const newWidget = ref({
  widget_name: 'Patient Detail and Prescrptions',
  widget_type: 'patient_detail_prescrption', // Add widget type
  widget_role: 'patient', // Default role (can be dynamic)
  icon: '',
  fields: [],
  metaConfig: {
    addBtn: false,
    card: false,
    deleteBtn: true,
    divider: false,
    editBtn: true,
    title: false,
    backgroundColor: '#FFFFFF',
  },
})


const translateSidebarWidgetsFilter = computed(() => {
  sidebarWidgetsFilter.value = sidebarWidgets.value.filter(widget =>
    widget.role.includes(type)
  );

  return sidebarWidgetsFilter.value.map(widget => ({
    ...widget,
    title: t(widget.title)
  }));

});

// sidebarWidgetsFilter.value = sidebarWidgets.value.filter(widget =>
//   widget.role.includes(type)
// );


const columnSizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12'];

const dragOptions = {
  animation: 200,
  group: {
    name: 'widgets',
    pull: 'clone',
    put: false
  }
};

const columnDragOptions = {
  animation: 200,
  group: 'columns'
};

const widgetDragOptions = {
  animation: 200,
  group: {
    name: 'widgets',
    put: true
  }
};
const addTabsToRow = (row) => {
  row.child.push({
    type: 'col-widget',
    cols: '6',
    child: [{
      type: 'tabs-widget',
      widget_type: 'tabs-widget',
      cols: '12',
      activeTab: 0,
      tabs: [{
        title: 'Tab 1', icon: '', widgets: []
      }]
    }],
    metaConfig: {
      card: false,

    }
  });

};

const addTab = (column) => {
  column.tabs.push({
    title: `Tab ${column.tabs.length + 1}`,
    icon: '',
    widgets: []
  });
};

const validateTabName = (tabs, index) => {
  const tab = tabs[index];
  if (!tab.title.trim()) {
    tab.title = `Tab ${index + 1}`
    tab.icon = ''
  }
};

const removeTab = (column, index) => {
  if (column.tabs.length > 1) {
    column.tabs.splice(index, 1);
    column.activeTab = Math.min(column.activeTab, column.tabs.length - 1);
  }
};
const removeWidgetFromTab = (tab, widgetIndex) => {
  tab.widgets.splice(widgetIndex, 1);
};
// Add new empty row
const addRow = () => {
  widgtStore.layout.push({
    type: 'row-widget',
    child: [],
    metaConfig: {
      card: false,

    }
  });
};

// Add new column to row
const addColumn = (row) => {
  row.child.push({
    type: 'col-widget',
    cols: '6',
    child: [],
    metaConfig: {
      card: false,

    }
  });
};
const openConfigDialog = (rowIndex, row, type) => {
  console.log(rowIndex, row, type)
  if (row.type === "tabs-widget") {



  }
  widgtStore.configType = type
  widgtStore.apendChild = row
  widgtStore.draggedIndex = rowIndex
  widgtStore.editBuilderCofigDialog = true
  widgtStore.metaSelect = row.metaConfig
  console.log(rowIndex, row, row.metaConfig)
}

// Remove widget from column
const removeWidget = (column, widgetIndex) => {
  column.child.splice(widgetIndex, 1);
};

// Remove column from row
const removeColumn = (row, columnIndex) => {
  row.child.splice(columnIndex, 1);
};

// Remove row
const removeRow = (rowIndex) => {
  widgtStore.layout.splice(rowIndex, 1);
};

// Check if row is empty
const isRowEmpty = (row) => {
  return row.child.length === 0;
};
const selectedWidget = ref(null);

const addCustomWidget = (target, selectedWidget) => {
  if (selectedWidget.isCustom) {
    newWidget.value.widget_name = selectedWidget.title
    newWidget.value.widget_type = selectedWidget.value
    newWidget.value.icon = selectedWidget.icon
    if (target.widgets) {
      target.widgets.push(newWidget.value);
    } else {
      target.child.push(newWidget.value);
    }
  } else {
    widgtStore.isDialog = true;
  }
}
const onDropData = (evt, target) => {
  if (evt.added && evt.added.element.isSideBar) {
    widgtStore.draggedIndex = evt.added.newIndex;
    selectedWidget.value = evt.added.element;

    // Remove the widget from the source (sidebar)
    if (target.widgets) {
      target.widgets.splice(widgtStore.draggedIndex, 1);
      widgtStore.apendChild = target.widgets;
    } else {
      target.child.splice(widgtStore.draggedIndex, 1);
      widgtStore.apendChild = target.child;
    }

    console.log(selectedWidget.value);

    // Check if the target is a tabs-widget
    if (target.type === 'tabs-widget') {
      // Get the active tab
      const activeTab = target.tabs[target.activeTab];

      if (selectedWidget.value.isCustom) {
        const newWidget = {
          widget_name: selectedWidget.value.title,
          widget_type: selectedWidget.value.value,
          icon: selectedWidget.value.icon,
          fields: [],
          metaConfig: {
            addBtn: false,
            card: false,
            deleteBtn: true,
            divider: false,
            editBtn: true,
            title: false,
            backgroundColor: '#FFFFFF',
          },
        };

        // Add the widget to the active tab's widgets array
        activeTab.widgets.push(newWidget);
      } else {
        widgtStore.isDialog = true;
      }
    } else {
      // Handle non-tabs-widget targets (e.g., regular columns)
      if (selectedWidget.value.isCustom) {
        const newWidget = {
          widget_name: selectedWidget.value.title,
          widget_type: selectedWidget.value.value,
          icon: selectedWidget.value.icon,
          fields: [],
          metaConfig: {
            addBtn: false,
            card: false,
            deleteBtn: true,
            divider: false,
            editBtn: true,
            title: false,
            backgroundColor: '#FFFFFF',
          },
        };

        // Add the widget to the target (column)
        if (target.widgets) {
          target.widgets.push(newWidget);
        } else {
          target.child.push(newWidget);
        }
      } else {
        widgtStore.isDialog = true;
      }
    }
  }
};
const getData = (data) => {
  isDialog.value = false;
  console.log('test ===== ', widgtStore.layout)
};
const saveData = async () => {
  await widgtStore.saveWidgetBuilder(widgtStore.layout, page)
  console.log('Position in layout:', widgtStore.layout);
};

</script>

<template>

  <v-app>
    <v-navigation-drawer permanent width="250">
      <PerfectScrollbar :options="{ wheelPropagation: false, suppressScrollX: true, maxScrollbarLength: 100 }">
        <v-list class="mb-6">
          <v-list-subheader>{{ $t('Drag Widgets') }}</v-list-subheader>
          <draggable v-model="translateSidebarWidgetsFilter" v-bind="dragOptions" item-key="id" class="widget-sidebar">
            <template #item="{ element: widget }">
              <v-list-item class="mb-2 draggable-widget">
                <template v-slot:prepend>
                  <v-icon :icon="widget.icon" class="handle"></v-icon>
                </template>
                <v-list-item-title>{{ widget.title }}</v-list-item-title>
              </v-list-item>
            </template>
          </draggable>
        </v-list>
      </PerfectScrollbar>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <div class="d-flex justify-space-between mb-4">
          <!-- Add Row Button (Left) -->
          <v-btn color="primary" @click="addRow" prepend-icon="tabler-plus">{{ $t('Add Row') }}</v-btn>

          <!-- Group Save and View Buttons (Right) -->
          <div class="d-flex align-center gap-2">
            <!-- Save Button -->
            <v-btn color="primary" @click="saveData" prepend-icon="tabler-check">{{ $t('Save') }}</v-btn>
            <RouterLink :to="{ path: '/provider/calendar' }" class="text-decoration-none "
              v-if="page_name == 'patient_call'">
              <v-btn color="secondary" prepend-icon="tabler-arrow-left">{{ $t('Back') }} </v-btn>
            </RouterLink>
            <!-- View Button -->
            <RouterLink :to="{ path: '/provider/patients/dashboard/' + route.query.patientId }"
              class="text-decoration-none" v-if="page_name != 'patient_call'">
              <VBtn variant="outlined">{{ $t('View') }} </VBtn>
            </RouterLink>
          </div>
        </div>

        <draggable v-model="widgtStore.layout" item-key="type" v-bind="columnDragOptions">
          <template #item="{ element: row, index: rowIndex }">
            <v-sheet class="mb-4 pa-4" rounded elevation="1">
              <div class="d-flex justify-space-between align-center mb-4">
                <div class="d-flex align-center">
                  <v-icon class="handle mr-2" icon="mdi-drag"></v-icon>
                  <v-btn size="small" @click="addColumn(row)" prepend-icon="tabler-plus">{{ $t('Add Column') }}</v-btn>
                  <v-btn size="small" @click="addTabsToRow(row)" prepend-icon="tabler-plus" class="ml-2">
                    {{ $t('Add Tabs') }} </v-btn>
                </div>
                <div class="d-flex align-center">
                  <v-btn icon="tabler-edit" size="small" color="error" variant="text"
                    @click="openConfigDialog(rowIndex, row, 'row-widget')"></v-btn>
                  <v-btn icon="tabler-trash" size="small" color="error" variant="text"
                    @click="removeRow(rowIndex)"></v-btn>

                </div>
              </div>

              <v-row>
                <draggable v-model="row.child" item-key="type" v-bind="columnDragOptions" class="row">
                  <template #item="{ element: column, index: columnIndex }">
                    <v-col :cols="column.cols">
                      <v-card class="column-card">
                        <v-card-title class="d-flex align-center justify-space-between">
                          <div class="d-flex align-center">
                            <v-icon class="handle mr-2" icon="mdi-drag"></v-icon>
                            <span>{{ $t('Column') }}</span>
                          </div>
                          <div class="d-flex align-center">
                            <v-select v-model="column.cols" :items="columnSizes" density="compact" hide-details
                              class="column-size-select mx-2" style="max-width: 100px"></v-select>

                            <div class="d-flex align-center">
                              <v-btn icon="tabler-edit" size="small" color="error" variant="text"
                                @click="openConfigDialog(columnIndex, column, 'col-widget')"></v-btn>
                              <v-btn icon="tabler-trash" size="small" color="error" variant="text"
                                @click="removeColumn(row, columnIndex)"></v-btn>

                            </div>
                          </div>
                        </v-card-title>

                        <v-card-text>


                          <draggable :list="column.child" v-bind="widgetDragOptions" class="widget-list" item-key="id"
                            @change="(evt) => onDropData(evt, column)">

                            <template #item="{ element: widget, index: widgetIndex }">

                              <div v-if="widget.type === 'tabs-widget'">
                                <v-tabs v-model="widget.activeTab">
                                  <template v-for="(tab, idx) in widget.tabs" :key="idx">
                                    <v-tab :value="idx" class="tab-item">
                                      <v-icon :icon="tab.icon" class="mr-1"></v-icon>
                                      <v-text-field v-model="tab.title" density="compact" hide-details variant="plain"
                                        class="tab-input" @blur="validateTabName(widget.tabs, idx)"
                                        @keyup.enter="$event.target.blur()" />

                                      <v-btn icon="tabler-icons" size="x-small" variant="text" density="compact"
                                        class="ml-1" @click.stop="openIconPicker(idx)" />
                                      <v-btn icon="tabler-x" size="x-small" variant="text" density="compact"
                                        class="ml-1" @click.stop="removeTab(widget, idx)"
                                        :disabled="widget.tabs.length === 1" />

                                    </v-tab>
                                  </template>
                                  <v-btn icon="tabler-plus" size="small" @click="addTab(widget)" class="ml-2"></v-btn>
                                  <VDialog v-model="iconPickerDialog" max-width="600">
                                    <VCard>
                                      <VCardTitle>{{ $t('Select Icon') }}</VCardTitle>
                                      <VCardText>
                                        <v-row>
                                          <v-col v-for="icon in availableIcons" :key="icon" cols="2">
                                            <v-btn :icon="icon" @click="selectIcon(widget, icon)" />
                                          </v-col>
                                        </v-row>
                                      </VCardText>
                                    </VCard>
                                  </VDialog>
                                </v-tabs>
                                <v-window v-model="widget.activeTab">
                                  <v-window-item v-for="(tab, idx) in widget.tabs" :key="idx" :value="idx">
                                    <draggable :list="tab.widgets" v-bind="widgetDragOptions" class="widget-list"
                                      item-key="id" @change="(evt) => onDropData(evt, tab)">
                                      <template #item="{ element: widget, index: widgetIndex }">
                                        <v-card class="mb-2 widget-card">
                                          <v-card-title class="d-flex align-center justify-space-between">
                                            <div class="d-flex align-center">
                                              <v-icon class="handle mr-2" icon="tabler-drag-drop-2"></v-icon>
                                              {{ widget.widget_name }}
                                            </div>
                                            <div class="d-flex align-center">
                                              <v-btn icon="tabler-edit" size="small" color="error" variant="text"
                                                @click="openConfigDialog(widgetIndex, widget, 'widget')"></v-btn>
                                              <v-btn icon="tabler-trash" size="small" color="error" variant="text"
                                                @click="removeWidgetFromTab(tab, widgetIndex)"></v-btn>
                                            </div>
                                          </v-card-title>
                                        </v-card>

                                      </template>
                                    </draggable>
                                  </v-window-item>
                                </v-window>
                              </div>
                              <div v-else>
                                <v-card class="mb-2 widget-card">
                                  <v-card-title class="d-flex align-center justify-space-between">
                                    <div class="d-flex align-center">
                                      <v-icon class="handle mr-2" icon="tabler-drag-drop-2"></v-icon>
                                      {{ widget.widget_name }}
                                    </div>

                                    <div class="d-flex align-center">
                                      <v-btn icon="tabler-edit" size="small" color="error" variant="text"
                                        @click="openConfigDialog(widgetIndex, widget, 'widget')"></v-btn>
                                      <v-btn icon="tabler-trash" size="small" color="error" variant="text"
                                        @click="removeWidget(column, widgetIndex)"></v-btn>

                                    </div>
                                  </v-card-title>
                                </v-card>
                              </div>

                            </template>

                          </draggable>

                        </v-card-text>
                      </v-card>
                    </v-col>
                  </template>
                </draggable>
              </v-row>
            </v-sheet>
          </template>
        </draggable>
      </v-container>
    </v-main>

    <VDialog v-model="widgtStore.isDialog" max-width="800">

      <DialogCloseBtn @click="widgtStore.isDialog = !widgtStore.isDialog" />
      <AddWidget :dragged-widget="selectedWidget" :type="type" />
    </VDialog>
    <VDialog v-model="widgtStore.editBuilderCofigDialog" max-width="400">
      <DialogCloseBtn @click="widgtStore.editBuilderCofigDialog = !widgtStore.editBuilderCofigDialog" />
      <VCard flat>
        <VCardText>
          <VCol cols="12" md="12" v-if="Object.hasOwn(widgtStore.metaSelect, 'card')">
            <div class="d-flex align-center">
              <VLabel class="text-body-2 me-2">{{ $t('Is Card Show:') }}</VLabel>
              <VSwitch v-model="widgtStore.metaSelect.card" color="primary" hide-details density="compact" />
            </div>
          </VCol>
          <VCol cols="12" md="12" v-if="Object.hasOwn(widgtStore.metaSelect, 'title')">
            <div class="d-flex align-center">
              <VLabel class="text-body-2 me-2">{{ $t('Is Title Show:') }}</VLabel>
              <VSwitch v-model="widgtStore.metaSelect.title" color="primary" hide-details density="compact" />
            </div>
          </VCol>
          <VCol cols="12" md="12" v-if="Object.hasOwn(widgtStore.metaSelect, 'divider')">
            <div class="d-flex align-center">
              <VLabel class="text-body-2 me-2">{{ $t('Is Divider Show:') }}</VLabel>
              <VSwitch v-model="widgtStore.metaSelect.divider" color="primary" hide-details density="compact" />
            </div>
          </VCol>
          <VCol cols="12" md="12" v-if="Object.hasOwn(widgtStore.metaSelect, 'editBtn')">
            <div class="d-flex align-center">
              <VLabel class="text-body-2 me-2">{{ $t('Is Edit Button:') }}</VLabel>
              <VSwitch v-model="widgtStore.metaSelect.editBtn" color="primary" hide-details density="compact" />
            </div>
          </VCol>
          <VCol cols="12" md="12">
            <div class="d-flex align-center" v-if="Object.hasOwn(widgtStore.metaSelect, 'addBtn')">
              <VLabel class="text-body-2 me-2">{{ $t('Is Add Button:') }} </VLabel>
              <VSwitch v-model="widgtStore.metaSelect.addBtn" color="primary" hide-details density="compact" />
            </div>
          </VCol>
          <VCol cols="12" md="12">
            <div class="d-flex align-center" v-if="Object.hasOwn(widgtStore.metaSelect, 'deleteBtn')">
              <VLabel class="text-body-2 me-2">{{ $t('Is Delete Button:') }} </VLabel>
              <VSwitch v-model="widgtStore.metaSelect.deleteBtn" color="primary" hide-details density="compact" />
            </div>
          </VCol>
          <VCol cols="12" md="12">
            <VLabel class="text-body-2 mb-2">{{ $t('Background Color:') }} </VLabel>
            <div class="d-flex align-center gap-2">
              <!-- Pre-defined colors -->
              <div class="color-picker-container d-flex flex-wrap gap-1">
                <div
                  v-for="color in ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#BBDEFB', '#C8E6C9', '#FFECB3', '#FFCCBC', '#D1C4E9', '#e0f2ef']"
                  :key="color" class="color-swatch" :style="{ backgroundColor: color }"
                  @click="selectBackgroundColor(color)"></div>
              </div>
            </div>
          </VCol>

          <!-- Custom Color Input -->
          <VCol cols="12" md="12">
            <VTextField v-model="widgtStore.metaSelect.backgroundColor" :label="$t('Custom Color Code')"
              placeholder="#FFFFFF" :hint="$t('Enter a valid hex color code')" density="compact" class="mt-2">
              <template v-slot:append>
                <div class="color-preview"
                  :style="{ backgroundColor: widgtStore.metaSelect.backgroundColor || '#FFFFFF' }"></div>
              </template>
            </VTextField>
          </VCol>
        </VCardText>
      </VCard>
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

.ps {
  max-height: calc(100vh - 64px);
  overflow: hidden !important;
}

.ps__rail-x,
.ps__rail-y {
  background-color: transparent !important;
}

.ps__thumb-x,
.ps__thumb-y {
  background-color: rgba(0, 0, 0, 0.5) !important;
  border-radius: 4px !important;
}

.ps__thumb-y {
  width: 6px !important;
}

.ps__thumb-x {
  height: 6px !important;
}

.tab-item {
  display: inline-flex;
  align-items: center;
  width: auto;
  /* Adjust width based on content */
  min-width: 100px;
  /* Minimum width for better usability */
  padding: 0 8px;
  /* Add padding for better spacing */
}

.tab-input {
  flex: 1;
  /* Allow the text field to grow and shrink */
  min-width: 50px;
  /* Minimum width for the text field */
  margin: 0 4px;
  /* Add margin for spacing */
}

.v-btn {
  flex-shrink: 0;
  /* Prevent buttons from shrinking */
}

.color-picker-container {
  max-width: 100%;
}

.color-swatch {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #e0e0e0;
  transition: transform 0.2s;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}
</style>
