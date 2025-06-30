<script setup>
import { useWidgetBuilderStore } from '@/stores/widgetBuilderStore';
import visulizeImage from '@/views/apps/widgets/visulizeImage.vue';
import { getChartData } from '@/views/charts/chartjs/ChartJsBarChart.vue';
import { bubleChartData } from '@/views/charts/chartjs/ChartJsBubbleChart.vue';
import { horizantolBarChart } from '@/views/charts/chartjs/ChartJsHorizontalBarChart.vue';
import { lineChartAreaData } from '@/views/charts/chartjs/ChartJsLineAreaChart.vue';
import { lineChartData } from '@/views/charts/chartjs/ChartJsLineChart.vue';
import { polerChartArea } from '@/views/charts/chartjs/ChartJsPolarAreaChart.vue';
import { radarChartData } from '@/views/charts/chartjs/ChartJsRadarChart.vue';
import { scatterhartData } from '@/views/charts/chartjs/ChartJsScatterChart.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
const widgtStore = useWidgetBuilderStore()
const store = useStore()
const isDisable = ref(true);
const currentTab = ref('0')
const isLoading = ref(false)
const visulizImage = ref(false)
const visulizImageDialog = ref(false)
const refForm = ref()
const widgtType = ref(null);
const dataSrcCondition = ref(false)
const widgetRoleList = ref([{ title: 'Global', value: 'global' }, { title: 'Patient', value: 'patient' }]);
const dataformateList = ref(['Table', 'List']);
const dataformate = ref(null);
const datafrom = ref(null);
const dataSrc = ref(null);
const dataSrcList = ref(['Table', 'Form']);
const datafromList = ref([{ title: 'Patient Profile', value: 'patient_data' }, { title: 'Invoices', value: 'invoices' }]);
const datafromCodition = ref(false)
const widgtTypeList = ref([
  { title: 'Table', value: 'table', role: ['global', 'patient'] },
  { title: 'List View', value: 'list_view', role: ['patient'] },
  { title: 'Tags View', value: 'tags_view', role: ['patient'] },
  //{ title: 'View Form', value: 'view_form', role: ['patient'] },
  { title: 'Visualize Chart', value: 'visulize_chart', role: ['patient'] },
  { title: 'Bar Chart', value: 'bar_chart', role: ['global', 'patient'] },
  //{ title:'Bubble Chart',value: 'bubble_chart' },
  { title: 'Horizontal Bar Chart', value: 'horizontal_bar_chart', role: ['global', 'patient'] },
  //{ title:'Line Area Chart',value: 'line_Area_chart' },
  { title: 'Line Chart', value: 'line_chart', role: ['global', 'patient'] },
  // { title:'Polar Area Chart',value: 'polar_area_chart' },
  //  { title:'Radar Chart',value: 'radar_chart' },
  //{ title: 'Scatter Chart',value: 'scatter_chart' },
]);
const widgtTypeListFilter = ref([])
const visulizeImageData = ref({

  uploadedImage: null,
  imageUrl: '',
  dialog: false,
  bgImage: null,
  newPoint: { x: 0, y: 0, label: '', key: '', value: '', angle: 0, length: 100 }, // Added length
  points: [],
  imageFile: null

})
const dataSetByList = ref(['Date', 'Month', 'Year']);
const dataSetBy = ref(null);
const chartSampleData = ref(null);
const agrigateBy = ref(null);
const perviousWidgetList = ref([]);
const perviousSlect = ref(null);
const widgtName = ref(null);
const patientList = ref([]);
const chartType = ref(null);
const intakeForms = ref([]);
const form = ref(null);
const formField = ref([]);
const dataSrcCheck = ref(false);
const widgetRole = ref(null);
const widgtCondition = ref(false)
const patientListCondition = ref(false)
const fieldArray = ref([]);
const filedObject = ref({ name: null, key: null, label: null, sortable: false, searchable: false, isForm: false })
const mergedFields = ref([])
const patienField = [
  { label: 'Patient ID', name: 'patient_data.id', key: null, isForm: false, sortable: false, searchable: false },
  { label: 'Full Name', name: 'patient_data.full_name', key: null, isForm: false, sortable: false, searchable: false },
  { label: 'First Name', name: 'patient_data.fname', key: null, isForm: false, sortable: false, searchable: false },
  { label: 'Last Name', name: 'patient_data.lname', key: null, isForm: false, sortable: false, searchable: false },
  { label: 'Avatar URL', name: 'patient_data.avatar', key: null, isForm: false, sortable: false, searchable: false },
  { label: 'Middle Name', name: 'patient_data.mname', key: null, isForm: false, sortable: false, searchable: false },
  { label: 'Email Address', name: 'patient_data.email', key: null, isForm: false, sortable: false, searchable: false },
  { label: 'Date of Birth', name: 'patient_data.DOB', key: null, isForm: false, sortable: false, searchable: false },
  //{ label: 'Sex at Birth', name: 'patient_extra_data.sex_at_birth', key: null, isForm: false, sortable: false, searchable: false },
  //{ label: 'Preferred Phone', name: 'patient_extra_data.preferred_phone', key: null, isForm: false, sortable: false, searchable: false },
  { label: 'Contact Phone', name: 'patient_data.phone_contact', key: null, isForm: false, sortable: false, searchable: false },
  { label: 'Cell Phone', name: 'patient_data.phone_cell', key: null, isForm: false, sortable: false, searchable: false },
  { label: 'Street', name: 'patient_data.street', key: null, isForm: false, sortable: false, searchable: false },
  { label: 'Zip', name: 'patient_data.postal_code', key: null, isForm: false, sortable: false, searchable: false },
  { label: 'City', name: 'patient_data.city', key: null, isForm: false, sortable: false, searchable: false },
  { label: 'State', name: 'patient_data.state', key: null, isForm: false, sortable: false, searchable: false },
]
const invoiceField = [
  { label: 'Invoice ID', name: 'invoices.id', key: null, isForm: false, sortable: false, searchable: false },
  { label: 'Invoice Number', name: 'invoices.invoice_id', key: null, isForm: false, sortable: false, searchable: false },
  { label: 'Issue Date', name: 'invoices.created_at', key: null, isForm: false, sortable: false, searchable: false },
  { label: 'Total', name: 'invoices.grand_total', key: null, isForm: false, sortable: false, searchable: false },
  { label: 'Status', name: 'invoices.status', key: null, isForm: false, sortable: false, searchable: false },

]
const chartJsCustomColors = {
  white: '#fff',
  yellow: '#ffe802',
  primary: '#836af9',
  areaChartBlue: '#2c9aff',
  barChartYellow: '#ffcf5c',
  polarChartGrey: '#4f5d70',
  polarChartInfo: '#299aff',
  lineChartYellow: '#d4e157',
  polarChartGreen: '#28dac6',
  lineChartPrimary: '#9e69fd',
  lineChartWarning: '#ff9800',
  horizontalBarInfo: '#26c6da',
  polarChartWarning: '#ff8131',
  scatterChartGreen: '#28c76f',
  warningShade: '#ffbd1f',
  areaChartBlueLight: '#84d0ff',
  areaChartGreyLight: '#edf1f4',
  scatterChartWarning: '#ff9f43',
}
const props = defineProps({
  draggedWidget: {
    type: Object,
    required: false
  },
  type: {
    type: String,
    required: false
  },
})


onBeforeMount(async () => {

  await widgtStore.getIntakeFormsList() //store.dispatch('getIntakeFormsList');
  intakeForms.value = await widgtStore.intakeFormList;

  widgetRole.value = props.type
  await widgtStore.widgetList()
  perviousWidgetList.value = widgtStore.widgetListData.filter(f => f.widget_type == props.draggedWidget.value)
  widgtType.value = props.draggedWidget.value
});


const closeNavigationDrawer = () => {
  currentTab.value = 0;
  // emit('update:isDrawerOpen', false)
  widgtStore.isDrawerOpen = false
  //emit('reset-form')
  //TabsUpdate();

}
watch(
  () => form.value,
  async (form_id) => {
    console.log('>>', form.value)
    await widgtStore.getFormField(form.value) //store.dispatch('getFormField', { id: form.value });

    formField.value = widgtStore.formField
    console.log(formField.value)
    mergedFields.value = [
      ...formField.value.map(item => toRaw(item)),

      { label: 'divider', name: '' },
      ...patienField,

    ]
  }
);
watch(
  () => widgtType.value,
  async (form_id) => {

    if (widgtType.value == 'visulize_chart') {
      visulizImage.value = true
      widgtCondition.value = false
      datafromCodition.value = false
      dataSrc.value = 'Form'
      dataSrcCheck.value = true
      //dataSrcCondition.value = false
    } else if (widgtType.value == 'list_view') {
      datafromCodition.value = true
      widgtCondition.value = false
      visulizImage.value = false
      dataSrc.value = 'Table'
      dataSrcCheck.value = false
      //dataSrcCondition.value = true
    } else if (widgtType.value == 'tags_view') {
      datafromCodition.value = true
      widgtCondition.value = false
      visulizImage.value = false
      dataSrc.value = 'Form'
      dataSrcCheck.value = true
      //dataSrcCondition.value = true
    } else if (widgtType.value != 'table') {
      widgtCondition.value = true
      visulizImage.value = false
      datafromCodition.value = false
      dataSrc.value = 'Form'
      dataSrcCheck.value = false
      // dataSrcCondition.value = false
    } else {
      widgtCondition.value = false
      visulizImage.value = false
      datafromCodition.value = false
      dataSrc.value = 'Form'
      dataSrcCheck.value = false
      // dataSrcCondition.value = false
    }

  }
);

watch(
  () => widgtType.value,
  async (form_id) => {
    form.value = null
    datafrom.value = null
    if (widgtType.value == 'bar_chart') {
      const dataInstance = getChartData(chartJsCustomColors);
      console.log(dataInstance);
      chartSampleData.value = dataInstance
    } else if (widgtType.value == 'bubble_chart') {
      const dataInstance = bubleChartData(chartJsCustomColors);
      console.log(dataInstance);
      chartSampleData.value = dataInstance


    } else if (widgtType.value == 'horizontal_bar_chart') {
      const dataInstance = horizantolBarChart(chartJsCustomColors);
      console.log(dataInstance);
      chartSampleData.value = dataInstance


    }
    else if (widgtType.value == 'line_Area_chart') {
      const dataInstance = lineChartAreaData(chartJsCustomColors);
      console.log(dataInstance);
      chartSampleData.value = dataInstance


    } else if (widgtType.value == 'line_chart') {
      const dataInstance = lineChartData(chartJsCustomColors);
      console.log(dataInstance);
      chartSampleData.value = dataInstance


    } else if (widgtType.value == 'polar_area_chart') {
      const dataInstance = polerChartArea(chartJsCustomColors);
      console.log(dataInstance);
      chartSampleData.value = dataInstance


    } else if (widgtType.value == 'radar_chart') {
      const dataInstance = radarChartData(chartJsCustomColors);
      console.log(dataInstance);
      chartSampleData.value = dataInstance


    }
    else if (widgtType.value == 'scatter_chart') {
      const dataInstance = scatterhartData(chartJsCustomColors);
      console.log(dataInstance);
      chartSampleData.value = dataInstance


    } else if (widgtType.value == 'table') {
      chartSampleData.value = null
    }



  }
);
watch(
  () => datafrom.value,
  async (form_id) => {
    if (datafrom.value == 'invoices') {
      formField.value = invoiceField
      mergedFields.value = [
        ...formField.value.map(item => toRaw(item)),

        { label: 'divider', name: '' },
        ...patienField,

      ]
    } else if (datafrom.value == 'patient_data') {
      formField.value = patienField
      mergedFields.value = [
        ...formField.value.map(item => toRaw(item)),

        { label: 'divider', name: '' },
        ...patienField,

      ]
    }
  })
watch(dataSrc, (src) => {
  console.log(src)
  if (src == 'Table') {
    form.value = null
    datafrom.value = null
    if (widgtType.value == 'visulize_chart') {
      visulizImage.value = true
      widgtCondition.value = false
      datafromCodition.value = false
      datafromCodition.value = true
    } else if (widgtType.value == 'list_view') {
      datafromCodition.value = true
      widgtCondition.value = false
      visulizImage.value = false
      datafromCodition.value = true
    } else if (widgtType.value == 'tags_view') {
      datafromCodition.value = true
      widgtCondition.value = false
      visulizImage.value = false
      dataSrc.value = 'Form'
      dataSrcCheck.value = true
      //dataSrcCondition.value = true
    } else if (widgtType.value != 'table') {
      widgtCondition.value = true
      visulizImage.value = false
      datafromCodition.value = false
      datafromCodition.value = true
    } else {
      widgtCondition.value = false
      visulizImage.value = false
      datafromCodition.value = false
      datafromCodition.value = true
    }

  } else if (src == 'Form') {
    form.value = null
    datafrom.value = null
    if (widgtType.value == 'visulize_chart') {
      visulizImage.value = true
      widgtCondition.value = false
      datafromCodition.value = false
      datafromCodition.value = false
    } else if (widgtType.value == 'list_view') {
      datafromCodition.value = true
      widgtCondition.value = false
      visulizImage.value = false
      datafromCodition.value = false
    } else if (widgtType.value == 'tags_view') {
      datafromCodition.value = true
      widgtCondition.value = false
      visulizImage.value = false
      datafromCodition.value = false
      dataSrcCheck.value = false
      //dataSrcCondition.value = true
    } else if (widgtType.value != 'table') {
      widgtCondition.value = true
      visulizImage.value = false
      datafromCodition.value = false
      datafromCodition.value = false
    } else {
      widgtCondition.value = false
      visulizImage.value = false
      datafromCodition.value = false
      datafromCodition.value = false
    }

  }

});
watch(widgetRole, (newRole) => {
  console.log(newRole)
  console.log(widgtTypeList.value)
  widgtTypeListFilter.value = widgtTypeList.value.filter(widget =>
    widget.role.includes(newRole)
  );

  widgtType.value = null; // Reset selected widget 

});



const onSubmit = async () => {
  let formData = {
    widgtName: widgtName.value,
    widgtType: widgtType.value,
    form: form.value,
    fieldArray: fieldArray.value,
    //chartType: chartType.value,
    //widgetRole: chartRole.value,
    widgetRole: widgetRole.value,
    dataSrc: dataSrc.value,
    datafrom: datafrom.value,
    visulizImage: visulizImage.value ? visulizImage.value : false,
    imageData: visulizImage.value ? visulizeImageData.value.imageFile : '',
    dataSetBy: dataSetBy.value,
    chartSampleData: visulizImage.value ? visulizeImageData.value.points : chartSampleData.value
  }
  console.log(refForm.value?.validate())
  refForm.value?.validate().then(async ({ valid }) => {
    if (!widgtCondition.value && !datafromCodition.value) {
      if (!form.value && !datafrom.value) {
        store.commit('setErrorMsg', true)
        store.commit('setShowMsg', 'Please First Select Form  !')
        return true
      }
    }


    if (valid) {


      if (widgtCondition.value) {
        fieldArray.value.push({ name: agrigateBy.value, key: agrigateBy.value, label: null, sortable: false, searchable: false, isForm: true })
      }

      let formData = {
        widgtName: widgtName.value,
        widgtType: widgtType.value,
        form: form.value,
        fieldArray: fieldArray.value,
        widgetRole: widgetRole.value,
        dataSrc: dataSrc.value,
        datafrom: datafrom.value,
        visulizImage: visulizImage.value ? visulizImage.value : false,
        imageData: visulizImage.value ? visulizeImageData.value.imageFile : '',
        dataSetBy: dataSetBy.value,
        chartSampleData: visulizImage.value ? visulizeImageData.value.points : chartSampleData.value
      }
      let data = {
        json_data: JSON.stringify(formData),
        imageData: formData.imageData
      }
      await widgtStore.saveWidget(data)
      widgtStore.isDialog = false
      widgtStore.isDrawerOpen = false

    }
  });

}
const removeFieldFromMerged = (fieldToRemove) => {
  // Find if the field exists in mergedFields
  const fieldIndexInMerged = mergedFields.value.findIndex(field => field.name === fieldToRemove.name);

  // If the field exists in mergedFields, remove it
  if (fieldIndexInMerged !== -1) {
    mergedFields.value.splice(fieldIndexInMerged, 1); // Remove the field from mergedFields
  }
};

const removeWidgt = (index) => {
  const fieldToRemove = fieldArray.value[index].name;
  const fieldLabel = fieldArray.value[index].label;

  if (fieldToRemove) {
    const isPatientField = fieldArray.value[index].isForm === true;

    if (isPatientField) {
      // Check if the field already exists in formField
      const removedFieldIndex = formField.value.findIndex(field => field.name === fieldToRemove);
      if (removedFieldIndex === -1) {
        store.dispatch('updateFormField', {
          name: fieldToRemove,
          label: fieldLabel || fieldToRemove,
        });
      }
    } else {
      // Check if the field already exists in patientField
      const removedFieldpatienFieldIndex = patienField.findIndex(field => field.name === fieldToRemove);
      if (removedFieldpatienFieldIndex === -1) {
        patienField.push({
          name: fieldToRemove,
          label: fieldLabel || fieldToRemove,
        });
      }
    }

    // Update mergedFields with latest formField and patientField values
    fieldArray.value.splice(index, 1);
    mergedFields.value = [
      ...formField.value.map(item => toRaw(item)), // Ensure reactive values are properly handled
      { label: 'divider', name: '' },
      ...patienField,
    ];

    mergedFields.value = mergedFields.value.filter(
      field => !fieldArray.value.some(f => f.name === field.name)
    );
    console.log('Updated mergedFields:', mergedFields.value);
    console.log('Updated fieldArray:', fieldArray.value);
    // Remove the field from fieldArray



  }
};


const openDialogImage = () => {
  if (!form.value && !datafrom.value) {
    store.commit('setErrorMsg', true)
    store.commit('setShowMsg', 'Please First Select Form  !')
  } else {
    visulizImageDialog.value = true
  }
};

const updateLabel = (filedObject) => {
  // Remove the selected name from formField when it is being used  
  //filedObject.title = formField.value.filter(f => f.name !== filedObject.name); 
  filedObject.title = filedObject.label
};


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
  } else {
    data.isForm = false
    data.key = data.name.replace('patient_data.', '')
  }
  console.log('Merged fields before filtering:', mergedFields.value);

  const existingLabel = mergedFields.value.find(f => f.name === data.name)?.label;
  mergedFields.value = mergedFields.value.filter(f => f.name !== data.name);



  if (existingLabel) {
    data.label = existingLabel; // Set field label if exists in formField 
    data.fieldName = existingLabel;
    data.title = data.label;

  }

  mergedFields.value = mergedFields.value.filter(f => f.name !== filedObject.name);
  // Push a clone of filedObject into fieldArray to maintain state  
  fieldArray.value.push({ ...data });
  // Reset the filedObject for new entries  
  filedObject.value = { name: null, label: '', sortable: false, searchable: false };
};
const widgetLoadBuilder = () => {

  let data = perviousWidgetList.value.filter(f => f.wid_id == perviousSlect.value);

  widgtStore.apendChild.splice(widgtStore.draggedIndex, 0, {
    ...data[0],
    metaConfig: {
      card: true,
      title: true,
      divider: true,
      editBtn: false,
      addBtn: false,
      deleteBtn: false
    },
  })
  widgtStore.isDialog = false
  console.log(widgtStore.layout)
}
</script>

<template>


  <VDivider />

  <PerfectScrollbar :options="{ wheelPropagation: false }">
    <VCard flat>
      <VCardText>
        <v-form ref="refForm">
          <VRow>
            <VCol cols="10">

              <AppSelect v-model="perviousSlect" label="Select Widget" placeholder="" :items="perviousWidgetList"
                item-value="wid_id" item-title="widget_name" />
            </VCol>
            <v-row>
              <!-- Submit Button in a Separate Row, Centered -->
              <v-col cols="12" class="mt-8">
                <v-btn @click="widgetLoadBuilder" color="primary">Add Widget</v-btn>
              </v-col>
            </v-row>
          </VRow>
          <v-row>
            <!-- Price, Prescription Checkbox, Intake Form, and Questionnaire Form in the Third Row -->



            <VCol cols="12" md="12">
              <AppTextField v-model="widgtName" label="Widget Name" type="text" :rules="[requiredValidator]" />
            </VCol>

            <VCol cols="12">
              <AppSelect v-model="widgetRole" label="Widget Role" placeholder="" :items="widgetRoleList"
                :rules="[requiredValidator]" item-value="value" item-title="title" />
            </VCol>

            <VCol cols="12">
              <AppSelect v-model="widgtType" label="Widget Type" placeholder="" :items="widgtTypeListFilter"
                :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12">
              <AppSelect v-model="dataSrc" label="Data Source" placeholder="" :items="dataSrcList"
                :disabled="dataSrcCheck" />
            </VCol>

            <VCol cols="12" v-if="datafromCodition">
              <AppSelect v-model="datafrom" label="Data From Table" placeholder="" :items="datafromList"
                item-value="value" item-title="title" />
            </VCol>





            <VCol cols="12" v-if="!datafromCodition">
              <AppSelect v-model="form" label="Form" placeholder="" :items="intakeForms" item-value="id"
                item-title="name" />
            </VCol>
            <VCol cols="12" v-if="!widgtCondition && visulizImage">

              <v-btn @click="openDialogImage" color="primary">Set Image Point Chart</v-btn>

            </VCol>
            <VCol cols="12" md="10" v-if="!widgtCondition && !visulizImage">
              <AppSelect v-model="filedObject.name" label="Form Field" placeholder="Select a field"
                :items="mergedFields" item-value="name" item-title="label">
                <template #item="{ item, props }">

                  <template v-if="item.title == 'divider'">
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
            <VCol cols="12" v-if="widgtCondition">
              <AppSelect v-model="dataSetBy" label="Data Set By" placeholder="" :items="dataSetByList" />
            </VCol>
            <VCol cols="12" md="12" v-if="widgtCondition">
              <AppSelect v-model="agrigateBy" label="Agrigate Value" placeholder="Select a field" :items="formField"
                item-value="name" item-title="label">

              </AppSelect>
            </VCol>

            <VCol cols="12" md="2" class="mt-6" v-if="!widgtCondition && !visulizImage">
              <VBtn size="small" prepend-icon="tabler-plus" @click="addWidget(filedObject)">
                Add More

              </VBtn>
            </VCol>
            <VCol cols="12" v-if="!widgtCondition && !visulizImage">

              <div class="add-diagonoses-form">
                <div v-for="(field, index) in fieldArray" :key="index" class="item">
                  <VRow align="center"> <!-- Utilize VRow to manage flex layout -->

                    <VCol cols="12" md="3">
                      <AppTextField v-model="field.fieldName" label="Name" type="text" readOnly />
                    </VCol>
                    <VCol cols="12" md="3">

                      <AppTextField v-model="field.label" label="Label" type="text" @input="updateLabel(field)" />
                    </VCol>
                    <VCol cols="12" md="2">
                      <VLabel for="Sort">
                        Sort
                      </VLabel>
                      <VSwitch v-model="field.sortable" />
                    </VCol>
                    <VCol cols="12" md="2">
                      <VLabel for="filter">
                        Searchable
                      </VLabel>
                      <VSwitch v-model="field.searchable" />
                    </VCol>
                    <VCol cols="12" md="2">
                      <div class="d-flex justify-end mt-5"> <!-- Flexbox for aligning items -->
                        <VBtn size="small" prepend-icon="tabler-trash" @click="removeWidgt(index)" color="error">
                          Remove

                        </VBtn>

                      </div>
                    </VCol>
                  </VRow>
                </div>


              </div>
            </VCol>


          </v-row>
          <v-row>
            <!-- Submit Button in a Separate Row, Centered -->
            <v-col cols="12">
              <v-btn @click="onSubmit" color="primary">Submit</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </VCardText>
    </VCard>
    <VDialog v-model="visulizImageDialog">
      <DialogCloseBtn @click="visulizImageDialog = false" />
      <VCard title="Set Point Data">
        <VCardText>
          <visulizeImage v-if="!widgtCondition && visulizImage" :visulizeImageData="visulizeImageData"
            :mergedFields="formField" :filedObject="filedObject" :fieldArray="fieldArray"
            :chartSampleData="chartSampleData" />
          <VBtn text @click="visulizImageDialog = false">Add</VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </PerfectScrollbar>

</template>
