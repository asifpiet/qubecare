<script setup>
import { useWidgetBuilderStore } from '@/stores/widgetBuilderStore';
const widgtStore = useWidgetBuilderStore()
const addWidget = (data) => {
  // Filter out the selected field name from formField  
  console.log('Data received:', data.name);
  if (!data || !data.name) {
    console.error('Invalid data:', data);
    return; // Exit the function if data is invalid  
  }
  if (data.name.startsWith('key_')) {
    data.isForm = true
    data.key = data.name
  } else if (data.name.startsWith('invoices')) {
    data.isForm = false
    data.key = data.name.replace('invoices.', '')
  } else if (data.name.startsWith('patient_custom')) {
    data.isForm = false
    widgtStore.addWidget.mergedFields = widgtStore.addWidget.mergedFields.filter(f => f.name !== data.name);
    let input = data.name;

    // Remove the 'patient_' prefix
    if (input.startsWith('patient_custom_')) {
      input = input.slice('patient_custom_'.length);
    }
    data.key = input
    // Replace underscores with spaces and capitalize each word
    input = input.replace(/_/g, ' ') // Replace underscores with spaces
      .split(' ')         // Split into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' ');
    data.label = input
    data.title = input
    data.name = data.name.replace('patient_custom_', 'patient_data.')
    data.fieldName = input
  } else if (data.name.startsWith('patient_extra_data')) {
    data.isForm = false
    widgtStore.addWidget.mergedFields = widgtStore.addWidget.mergedFields.filter(f => f.name !== data.name);
    let input = data.name;

    // Remove the 'patient_' prefix
    if (input.startsWith('patient_extra_data_')) {
      input = input.slice('patient_extra_data_'.length);
    }
    data.key = input
    // Replace underscores with spaces and capitalize each word
    input = input.replace(/_/g, ' ') // Replace underscores with spaces
      .split(' ')         // Split into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' ');
    data.label = input
    data.title = input
    data.name = data.name.replace('patient_extra_data_', 'patient_extra_data.')
    data.fieldName = input
  } else {
    data.isForm = false
    data.key = data.name.replace('patient_data.', '')
  }
  console.log('Merged fields before filtering:', data);

  const existingLabel = widgtStore.addWidget.mergedFields.find(f => f.name === data.name)?.label;
  widgtStore.addWidget.mergedFields = widgtStore.addWidget.mergedFields.filter(f => f.name !== data.name);



  if (existingLabel) {
    data.label = existingLabel; // Set field label if exists in formField 
    data.fieldName = existingLabel;
    data.title = data.label;

  }
  console.log('Merged fields before filtering:', widgtStore.addWidget.mergedFields);
  widgtStore.addWidget.mergedFields = widgtStore.addWidget.mergedFields.filter(f => f.name !== widgtStore.addWidget.filedObject.name);
  // Push a clone of filedObject into fieldArray to maintain state  
  widgtStore.addWidget.fieldArray.push({ ...data });
  // Reset the filedObject for new entries  
  widgtStore.addWidget.filedObject = { name: null, label: '', sortable: false, searchable: false };
};
const removeWidgt = (index) => {
  const fieldToRemove = widgtStore.addWidget.fieldArray[index].name;
  const fieldLabel = widgtStore.addWidget.fieldArray[index].label;

  if (fieldToRemove) {
    const isPatientField = widgtStore.addWidget.fieldArray[index].isForm === true;

    if (isPatientField) {
      // Check if the field already exists in formField
      const removedFieldIndex = widgtStore.addWidget.formField.findIndex(field => field.name === fieldToRemove);
      if (removedFieldIndex === -1) {
        store.dispatch('updateFormField', {
          name: fieldToRemove,
          label: fieldLabel || fieldToRemove,
        });
      }
    } else {
      // Check if the field already exists in patientField
      const removedFieldpatienFieldIndex = widgtStore.addWidget.patienField.findIndex(field => field.name === fieldToRemove);
      if (removedFieldpatienFieldIndex === -1) {
        widgtStore.addWidget.patienField.push({
          name: fieldToRemove,
          label: fieldLabel || fieldToRemove,
        });
      }
    }

    // Update mergedFields with latest formField and patientField values
    widgtStore.addWidget.fieldArray.splice(index, 1);
    widgtStore.addWidget.mergedFields = [
      ...widgtStore.addWidget.formField.map(item => toRaw(item)), // Ensure reactive values are properly handled
      { label: 'divider', name: '' },
      ...widgtStore.addWidget.patienField,
    ];

    widgtStore.addWidget.mergedFields = widgtStore.addWidget.mergedFields.filter(
      field => !widgtStore.addWidget.fieldArray.some(f => f.name === field.name)
    );
    console.log('Updated mergedFields:', widgtStore.addWidget.mergedFields);
    console.log('Updated fieldArray:', widgtStore.addWidget.fieldArray);
    // Remove the field from fieldArray



  }
};
const updateLabel = (filedObject) => {
  // Remove the selected name from formField when it is being used  
  //filedObject.title = formField.value.filter(f => f.name !== filedObject.name); 
  widgtStore.addWidget.filedObject.title = widgtStore.addWidget.filedObject.label
};
</script>

<template>

  <VCol cols="12" md="10">
    <AppSelect v-model="widgtStore.addWidget.filedObject.name" :label="$t('Form Field')" :placeholder="$t('Select a field')"
      :items="widgtStore.addWidget.mergedFields" item-value="name" item-title="label">
      <template #item="{ item, props }">

        <template v-if="item.title == 'divider'">
          <h4 style="padding-left:5px;">{{ $t('Patient')}}:</h4>
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



  <VCol cols="12" md="2" class="mt-6">
    <VBtn size="small" prepend-icon="tabler-plus" @click="addWidget(widgtStore.addWidget.filedObject)">
      {{ $t('Add More')}}

    </VBtn>
  </VCol>
  <VCol cols="12">

    <div class="add-diagonoses-form">
      <div v-for="(field, index) in widgtStore.addWidget.fieldArray" :key="index" class="item">
        <VRow align="center"> <!-- Utilize VRow to manage flex layout -->

          <VCol cols="12" md="3">
            <AppTextField v-model="field.fieldName" :label="$t('Name')" type="text" readOnly />
          </VCol>
          <VCol cols="12" md="3">

            <AppTextField v-model="field.label" :label="$t('Label')" type="text" @input="updateLabel(field)" />
          </VCol>
          <VCol cols="12" md="2">
            <VLabel for="Sort">
              {{ $t('Sort')}}
            </VLabel>
            <VSwitch v-model="field.sortable" />
          </VCol>
          <VCol cols="12" md="2">
            <VLabel for="filter">
              {{ $t('Searchable') }}
            </VLabel>
            <VSwitch v-model="field.searchable" />
          </VCol>
          <VCol cols="12" md="2">
            <div class="d-flex justify-end mt-5"> <!-- Flexbox for aligning items -->
              <VBtn size="small" prepend-icon="tabler-trash" @click="removeWidgt(index)" color="error">
                {{ $t('Remove')}}

              </VBtn>

            </div>
          </VCol>
        </VRow>
      </div>


    </div>
  </VCol>
</template>
