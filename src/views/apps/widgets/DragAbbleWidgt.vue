<script setup>
import { onMounted, ref } from "vue";
import { draggable } from 'vuedraggable';


const rows = ref([]);
const availableWidgets = ref([
  { id: 1, name: "Weather Widget", description: "Shows weather updates" },
  { id: 2, name: "News Widget", description: "Shows latest news" },
  { id: 3, name: "Stock Widget", description: "Shows stock prices" }
]);
const theme = ref("light");

// Add a new row
const addRow = () => {
  const newRow = {
    id: Date.now(),
    columns: [{ id: Date.now(), size: 12, widgets: [] }],
  };
  rows.value.push(newRow);
};

// Remove a row
const removeRow = (rowIndex) => {
  rows.value.splice(rowIndex, 1);
};

// Add a new column
const addColumn = (rowIndex) => {
  const newColumn = { id: Date.now(), size: 6, widgets: [] };
  rows.value[rowIndex].columns.push(newColumn);
};

// Remove a column
const removeColumn = (row, colIndex) => {
  row.columns.splice(colIndex, 1);
};

// Toggle site-wide theme
const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme.value);
};

// Fetch widgets when mounted (simulated)
onMounted(() => {
  // Simulate fetching data
  // e.g., rows.value = await fetchRows();
});
</script>

<template>
  <VContainer>
    <!-- Draggable Rows -->
    <draggable v-model="rows" group="rows" item-key="id" class="drag-container" ghost-class="drag-ghost">
      <template #item="{ element, index }">
        <VRow class="row-builder">
          <VCol>
            <div class="row-header">
              <span>Row {{ index + 1 }}</span>
              <VBtn icon @click="addColumn(index)">
                <VIcon>tabler-plus</VIcon>
              </VBtn>
              <VBtn icon @click="removeRow(index)">
                <VIcon>tabler-trash</VIcon>
              </VBtn>
            </div>
          </VCol>

          <!-- Draggable Columns -->
          <draggable v-model="element.columns" group="columns" item-key="id" class="drag-column" ghost-class="drag-ghost">
            <template #item="{ element: column, index: colIndex }">
              <VCol :cols="column.size">
                <div class="column-builder">
                  <span>Column {{ colIndex + 1 }}</span>
                  <VSlider v-model="column.size" min="1" max="12" step="1" label />
                  <VBtn icon @click="removeColumn(element, colIndex)">
                    <VIcon>tabler-trash</VIcon>
                  </VBtn>

                  <!-- Draggable Widgets -->
                  <draggable v-model="column.widgets" group="widgets" item-key="id" class="drag-widget">
                    <template #item="{ element: widget }">
                      <VCard v-if="widget" class="widget-card">
                        <VCardTitle>{{ widget.name }}</VCardTitle>
                        <VCardText>{{ widget.description }}</VCardText>
                      </VCard>
                    </template>
                  </draggable>
                </div>
              </VCol>
            </template>
          </draggable>
        </VRow>
      </template>
    </draggable>

    <!-- Add New Row Button -->
    <VBtn class="mt-4" @click="addRow">Add Row</VBtn>

    <!-- Widget Sidebar -->
    <VCard class="widget-sidebar">
      <VCardTitle>Available Widgets</VCardTitle>
      <draggable v-model="availableWidgets" group="widgets" item-key="id" class="drag-widget-sidebar">
        <template #item="{ element: widget }">
          <VCard v-if="widget" class="widget-card" @click="addWidgetToColumn(widget)">
            <VCardTitle>{{ widget.name }}</VCardTitle>
            <VCardText>{{ widget.description }}</VCardText>
          </VCard>
        </template>
      </draggable>
    </VCard>

    <!-- Theme Toggle -->
    
  </VContainer>
</template>

<style scoped>
.drag-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.row-builder {
  background: var(--v-surface);
  border: 1px solid var(--v-divider);
  padding: 16px;
  border-radius: 8px;
}

.column-builder {
  background: var(--v-surface);
  border: 1px solid var(--v-divider);
  padding: 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.widget-card {
  margin: 8px 0;
  padding: 12px;
  border: 1px solid var(--v-divider);
}

.widget-sidebar {
  position: fixed;
  right: 16px;
  top: 16px;
  width: 300px;
  height: calc(100vh - 32px);
  overflow-y: auto;
  background: var(--v-surface);
  border: 1px solid var(--v-divider);
  padding: 16px;
}

.drag-widget-sidebar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
