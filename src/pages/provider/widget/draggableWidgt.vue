<script setup>
import { useWidgetBuilderStore } from '@/stores/widgetBuilderStore';
import AddWidgetDrag from '@/views/apps/widgets/AddWidgetDrag.vue';
import draggable from 'vuedraggable/src/vuedraggable';
import { useStore } from 'vuex';
const widgtStore = useWidgetBuilderStore()
const store = useStore()
const isDialog = ref(false)
const apendChild = ref([])
const draggedIndex = ref()
definePage({
  meta: {
    action: 'read',
    subject: 'Intake Questions View',
  },
})

await widgtStore.getWidgetBuilder(2)

const sidebarWidgets = ref([
  { title: 'Table', value: 'table', isSideBar: true, icon: 'tabler-table' },
  { title: 'View Form', value: 'table', isSideBar: true, icon: 'tabler-table' },
  { title: 'Visualize Chart', value: 'visulize_chart', isSideBar: true, icon: 'tabler-file-chart' },
  { title: 'Bar Chart', value: 'bar_chart', isSideBar: true, icon: 'tabler-chart-bar' },
  { title: 'Horizontal Bar Chart', value: 'horizontal_bar_chart', isSideBar: true, icon: 'tabler-chart-bar-horizontal' },
  { title: 'Line Chart', value: 'line_chart', isSideBar: true, icon: 'tabler-chart-line' },
])

const columnSizes = ['1', '2', '3', '4', '5', '6', '7', '9', '8', '10', '12'];

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

// Add new empty row
const addRow = () => {
  widgtStore.layout.push({
    type: 'row-widget',
    child: []
  });
};
const addTabsToRow = (row) => {
  row.child.push({
    type: 'tabs-widget',
    cols: '12',
    activeTab: 0,
    tabs: [{ title: 'Tab 1', widgets: [] }]
  });
};

const addTab = (column) => {
  column.tabs.push({
    title: `Tab ${column.tabs.length + 1}`,
    widgets: []
  });
};

const validateTabName = (tabs, index) => {
  const tab = tabs[index];
  if (!tab.title.trim()) {
    tab.title = `Tab ${index + 1}`;
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

// Add new column to row
const addColumn = (row) => {
  row.child.push({
    type: 'col-widget',
    cols: '6',
    child: []
  });
};

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


const onDropDat1a = (evt, data) => {
  if (evt.added && evt.added.element.isSideBar) {
    widgtStore.draggedIndex = evt.added.newIndex;
    selectedWidget.value = evt.added.element;
    data.child.splice(widgtStore.draggedIndex, 1)
    widgtStore.apendChild = data.child//[draggedIndex.value]
    console.log('Position in layout:', widgtStore.apendChild, widgtStore.draggedIndex);

    console.log('Position in layout:', draggedIndex.value);
    widgtStore.isDialog = true;
  }
  console.log(evt, data)
};
const onDropData = (evt, target) => {
  if (evt.added && evt.added.element.isSideBar) {
    widgtStore.draggedIndex = evt.added.newIndex;
    selectedWidget.value = evt.added.element;

    if (target.widgets) {
      target.widgets.splice(widgtStore.draggedIndex, 1);
      widgtStore.apendChild = target.widgets;
    } else {
      target.child.splice(widgtStore.draggedIndex, 1);
      widgtStore.apendChild = target.child;
    }

    widgtStore.isDialog = true;
  }
};
const getData = (data) => {
  isDialog.value = false;
  console.log('test ===== ', widgtStore.layout)
};
const saveData = async () => {
  await widgtStore.saveWidgetBuilder(widgtStore.layout, 2)
  console.log('Position in layout:', widgtStore.layout);
};

</script>

<template>
  <v-app>
    <v-navigation-drawer permanent width="250">
      <v-list>
        <v-list-subheader>Drag Widgets</v-list-subheader>
        <draggable v-model="sidebarWidgets" v-bind="dragOptions" item-key="id" class="widget-sidebar">
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
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <div class="d-flex justify-space-between mb-4">
          <v-btn color="primary" @click="addRow" prepend-icon="tabler-plus">Add Row</v-btn>
          <v-btn color="primary" @click="saveData" prepend-icon="tabler-plus">Save</v-btn>
        </div>

        <draggable v-model="widgtStore.layout" item-key="type" v-bind="columnDragOptions">
          <template #item="{ element: row, index: rowIndex }">
            <v-sheet class="mb-4 pa-4" rounded elevation="1">
              <div class="d-flex justify-space-between align-center mb-4">
                <div class="d-flex align-center">
                  <v-icon class="handle mr-2" icon="mdi-drag"></v-icon>
                  <v-btn size="small" @click="addColumn(row)" prepend-icon="tabler-plus">Add Column</v-btn>
                  <v-btn size="small" @click="addTabsToRow(row)" prepend-icon="tabler-plus" class="ml-2">Add
                    Tabs</v-btn>
                </div>
                <v-btn icon="tabler-trash" size="small" color="error" variant="text"
                  @click="removeRow(rowIndex)"></v-btn>
              </div>

              <v-row>
                <draggable v-model="row.child" item-key="type" v-bind="columnDragOptions" class="row">
                  <template #item="{ element: column, index: columnIndex }">
                    <v-col :cols="column.cols">
                      <v-card class="column-card">
                        <v-card-title class="d-flex align-center justify-space-between">
                          <div class="d-flex align-center">
                            <v-icon class="handle mr-2" icon="mdi-drag"></v-icon>
                            <span>Column</span>
                          </div>
                          <div class="d-flex align-center">
                            <v-select v-model="column.cols" :items="columnSizes" density="compact" hide-details
                              class="column-size-select mx-2" style="max-width: 100px"></v-select>
                            <v-btn icon="tabler-trash" size="small" color="error" variant="text"
                              @click="removeColumn(row, columnIndex)"></v-btn>
                          </div>
                        </v-card-title>

                        <v-card-text>
                          <template v-if="column.type === 'tabs-widget'">
                            <v-tabs v-model="column.activeTab">
                              <template v-for="(tab, idx) in column.tabs" :key="idx">
                                <v-tab :value="idx" class="tab-item">
                                  <v-text-field v-model="tab.title" density="compact" hide-details variant="plain"
                                    class="tab-input" @blur="validateTabName(column.tabs, idx)"
                                    @keyup.enter="$event.target.blur()" />
                                  <v-btn icon="tabler-x" size="x-small" variant="text" density="compact" class="ml-1"
                                    @click.stop="removeTab(column, idx)" :disabled="column.tabs.length === 1" />
                                </v-tab>
                              </template>
                              <v-btn icon="tabler-plus" size="small" @click="addTab(column)" class="ml-2"></v-btn>
                            </v-tabs>
                            <v-window v-model="column.activeTab">
                              <v-window-item v-for="(tab, idx) in column.tabs" :key="idx" :value="idx">
                                <draggable :list="tab.widgets" v-bind="widgetDragOptions" class="widget-list"
                                  item-key="id" @change="(evt) => onDropData(evt, tab)">
                                  <template #item="{ element: widget, index: widgetIndex }">
                                    <v-card class="mb-2 widget-card">
                                      <v-card-title class="d-flex align-center justify-space-between">
                                        <div class="d-flex align-center">
                                          <v-icon class="handle mr-2" icon="tabler-drag-drop-2"></v-icon>
                                          {{ widget.widget_name }}
                                        </div>
                                        <v-btn icon="tabler-trash" size="small" color="error" variant="text"
                                          @click="removeWidgetFromTab(tab, widgetIndex)"></v-btn>
                                      </v-card-title>
                                    </v-card>
                                  </template>
                                </draggable>
                              </v-window-item>
                            </v-window>
                          </template>
                          <template v-else>
                            <draggable :list="column.child" v-bind="widgetDragOptions" class="widget-list" item-key="id"
                              @change="(evt) => onDropData(evt, column)">
                              <template #item="{ element: widget, index: widgetIndex }">
                                <v-card class="mb-2 widget-card">
                                  <v-card-title class="d-flex align-center justify-space-between">
                                    <div class="d-flex align-center">
                                      <v-icon class="handle mr-2" icon="tabler-drag-drop-2"></v-icon>
                                      {{ widget.widget_name }}
                                    </div>
                                    <v-btn icon="tabler-trash" size="small" color="error" variant="text"
                                      @click="removeWidget(column, widgetIndex)"></v-btn>
                                  </v-card-title>
                                </v-card>
                              </template>
                            </draggable>
                          </template>
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
      <AddWidgetDrag :dragged-widget="selectedWidget" />
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
