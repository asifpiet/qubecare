<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { useWidgetBuilderStore } from '@/stores/widgetBuilderStore';
import { addAlert } from '@/utils/showLoader';
import ChartForm from '@/views/apps/widgets/forms/ChartForm.vue';
import TableForm from '@/views/apps/widgets/forms/TableForm.vue';
import VualizeImageForm from '@/views/apps/widgets/forms/VualizeImageForm.vue';

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
const formsStore = useFormsStore()
const store = useStore()
const visulizImage = ref(false)
const refForm = ref()
const widgtType = ref(null);
const widgetRoleList = ref([{ title: 'Global', value: 'global' }, { title: 'Patient', value: 'patient' }]);
const dataSrc = ref(null);
const dataSrcList = ref(['Table', 'Form']);

const formTypeList = ref([{ title: 'Charting Forms', value: 'charting-forms' }, { title: 'Simple Forms', value: 'simple-forms' }]);
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

const perviousWidgetList = ref([]);
const perviousSlect = ref(null);
const widgtName = ref(null);
const intakeForms = ref([]);
const dataSrcCheck = ref(false);
const widgetRole = ref(null);
const widgtCondition = ref(false)

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
  widgtStore.addWidget.fieldArray = []
  widgtStore.addWidget.mergedFields = []

  //await widgtStore.getIntakeFormsList() //store.dispatch('getIntakeFormsList');
  //intakeForms.value = await widgtStore.intakeFormList;

  widgetRole.value = props.type
  await widgtStore.widgetList()
  perviousWidgetList.value = widgtStore.widgetListData.filter(f => f.widget_type == props.draggedWidget.value)
  widgtType.value = props.draggedWidget.value
  await getChartDataAndCodition(widgtType.value)
});

const getFormField = async () => {
  if (widgtStore.addWidget.form) {
    await widgtStore.getFormField(widgtStore.addWidget.form) //store.dispatch('getFormField', { id: form.value });

    widgtStore.addWidget.formField = widgtStore.formField
    console.log(widgtStore.addWidget.formField)
    widgtStore.addWidget.mergedFields = [
      ...widgtStore.addWidget.formField.map(item => toRaw(item)),

      { label: 'divider', name: '' },
      ...widgtStore.addWidget.patienField,

    ]
  } else {
    widgtStore.addWidget.mergedFields = []
    widgtStore.addWidget.formField = []
  }
}
const getChartDataAndCodition = async (type) => {
  const chartTypes = {
    'bar_chart': getChartData,
    'bubble_chart': bubleChartData,
    'horizontal_bar_chart': horizantolBarChart,
    'line_Area_chart': lineChartAreaData,
    'line_chart': lineChartData,
    'polar_area_chart': polerChartArea,
    'radar_chart': radarChartData,
    'scatter_chart': scatterhartData
  };

  const chartFunction = chartTypes[type];
  let chart = chartFunction ? chartFunction(chartJsCustomColors) : null;
  widgtStore.addWidget.chartSampleData = chart
  return widgtStore.addWidget.chartSampleData
}



const fieldGetFromCustom = async () => {
  if (widgtStore.addWidget.datafrom == 'invoices') {
    widgtStore.addWidget.formField = widgtStore.addWidget.invoiceField
    widgtStore.addWidget.mergedFields = [
      ...widgtStore.addWidget.formField.map(item => toRaw(item)),



    ]
  } else if (widgtStore.addWidget.datafrom == 'patient_data') {
    widgtStore.addWidget.formField = widgtStore.addWidget.patienField
    widgtStore.addWidget.mergedFields = [

      ...widgtStore.addWidget.patienField,

    ]
  }
}
const getFormType = async () => {
  if (widgtStore.addWidget.formType) {
    await formsStore.getFormByType(widgtStore.addWidget.formType)//store.dispatch('getFormField', { id: form.value });
    widgtStore.addWidget.form = null;
    intakeForms.value = formsStore.forms;
  }
}


const formConditions = computed(() => {
  const src = dataSrc.value;
  const type = widgtType.value;

  const conditionSets = {
    Table: {
      'visulize_chart': {
        showTableForm: false,
        showChartForm: false,
        showVisualizeForm: true,
        datafromCodition: false,
        dataSrcCheck: false,
        forceFormSource: true
      },
      'list_view': {
        showTableForm: true,
        showChartForm: false,
        showVisualizeForm: false,
        datafromCodition: true,
        dataSrcCheck: false
      },
      'tags_view': {
        showTableForm: true,
        showChartForm: false,
        showVisualizeForm: false,
        datafromCodition: true,
        dataSrcCheck: false,
        forceFormSource: true
      },
      'table': {
        showTableForm: true,
        showChartForm: false,
        showVisualizeForm: false,
        datafromCodition: true,
        dataSrcCheck: false
      },
      'default': {
        showTableForm: false,
        showChartForm: true,
        showVisualizeForm: false,
        datafromCodition: true,
        dataSrcCheck: false
      }
    },
    Form: {
      'visulize_chart': {
        showTableForm: false,
        showChartForm: false,
        showVisualizeForm: true,
        datafromCodition: false,
        dataSrcCheck: true,
        forceFormSource: true
      },
      'list_view': {
        showTableForm: true,
        showChartForm: false,
        showVisualizeForm: false,
        datafromCodition: false,
        dataSrcCheck: false
      },
      'tags_view': {
        showTableForm: true,
        showChartForm: false,
        showVisualizeForm: false,
        datafromCodition: false,
        dataSrcCheck: false
      },
      'table': {
        showTableForm: true,
        showChartForm: false,
        showVisualizeForm: false,
        datafromCodition: false,
        dataSrcCheck: false
      },
      'default': {
        showTableForm: false,
        showChartForm: true,
        showVisualizeForm: false,
        datafromCodition: false,
        dataSrcCheck: false
      }
    }
  };

  const sourceSet = conditionSets[src] || conditionSets.Form;
  return sourceSet[type] || sourceSet.default;
});
watch(
  [dataSrc, widgtType],
  ([newSrc, newType]) => {
    widgtStore.addWidget.form = null;
    widgtStore.addWidget.datafrom = null;
    widgtStore.addWidget.agrigateBy = null
    widgtStore.addWidget.mergedFields = []
    widgtStore.addWidget.formField = []
    if (formConditions.value.forceFormSource) {
      dataSrc.value = 'Form';
    }
  }
);

const onSubmit = async () => {
  let formData = {
    widgtName: widgtName.value,
    widgtType: widgtType.value,
    form: widgtStore.addWidget.form,
    fieldArray: widgtStore.addWidget.fieldArray,
    //chartType: chartType.value,
    //widgetRole: chartRole.value,
    widgetRole: widgetRole.value,
    dataSrc: dataSrc.value,
    datafrom: widgtStore.addWidget.datafrom,
    visulizImage: formConditions.value.showVisualizeForm ? formConditions.value.showVisualizeForm : false,
    imageData: formConditions.value.showVisualizeForm ? widgtStore.addWidget.visulizeImageData.imageFile : '',
    dataSetBy: widgtStore.addWidget.dataSetBy,
    chartSampleData: formConditions.value.showVisualizeForm ? widgtStore.addWidget.visulizeImageData.points : widgtStore.addWidget.chartSampleData
  }
  console.log(formData)

  refForm.value?.validate().then(async ({ valid }) => {
    if (!widgtCondition.value && !datafromCodition.value) {
      if (!widgtStore.addWidget.form && !widgtStore.addWidget.datafrom) {
        store.commit('setErrorMsg', true)
        store.commit('setShowMsg', 'Please First Select Form  !')
        addAlert('Please First Select Form  !', 'error')
        return true
      }
    }


    if (valid) {


      if (formConditions.value.showChartForm) {
        if (!widgtStore.addWidget.agrigateBy) {
          addAlert('Please First Select Form Fields Agrigate Value !', 'error')
          return true
        }
        widgtStore.addWidget.fieldArray.push({ name: widgtStore.addWidget.agrigateBy, key: widgtStore.addWidget.agrigateBy, label: null, sortable: false, searchable: false, isForm: true })
      } else {
        if (widgtStore.addWidget.fieldArray.length == 0) {
          addAlert('Please First Select Form Fields and click add more !', 'error')
          return true
        }
      }

      let formData = {
        widgtName: widgtName.value,
        widgtType: widgtType.value,
        form: widgtStore.addWidget.form,
        fieldArray: widgtStore.addWidget.fieldArray,
        //chartType: chartType.value,
        //widgetRole: chartRole.value,
        widgetRole: widgetRole.value,
        dataSrc: dataSrc.value,
        datafrom: widgtStore.addWidget.datafrom,
        visulizImage: formConditions.value.showVisualizeForm ? formConditions.value.showVisualizeForm : false,
        imageData: formConditions.value.showVisualizeForm ? widgtStore.addWidget.visulizeImageData.imageFile : '',
        dataSetBy: widgtStore.addWidget.dataSetBy,
        chartSampleData: formConditions.value.showVisualizeForm ? widgtStore.addWidget.visulizeImageData.points : widgtStore.addWidget.chartSampleData
      }
      let data = {
        json_data: JSON.stringify(formData),
        imageData: formData.imageData
      }
      await widgtStore.saveWidget(data)
      widgtStore.isDialog = false
      widgtStore.isDrawerOpen = false
      widgtStore.addWidget.dataSetBy = null
      widgtStore.addWidget.datafrom = null
      widgtStore.addWidget.visulizeImageData.points = null
      widgtStore.addWidget.chartSampleData = null
      widgtStore.addWidget.agrigateBy = null
      widgtStore.addWidget.visulizeImageData.points = []
      widgtStore.addWidget.visulizeImageData.imageUrl = null
      widgtStore.addWidget.visulizeImageData.uploadedImage = null
    }
  });

}

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

              <AppSelect v-model="perviousSlect" :label="$t('Select Widget')" placeholder="" :items="perviousWidgetList"
                item-value="wid_id" item-title="widget_name" />
            </VCol>
            <v-row>
              <!-- Submit Button in a Separate Row, Centered -->
              <v-col cols="12" class="mt-8">
                <v-btn @click="widgetLoadBuilder" color="primary">{{ $t('Add Widget')}}</v-btn>
              </v-col>
            </v-row>
          </VRow>
          <v-row>
            <!-- Price, Prescription Checkbox, Intake Form, and Questionnaire Form in the Third Row -->

            <VCol cols="12" md="12">
              <AppTextField v-model="widgtName" :label="$t('Widget Name')" type="text" :rules="[requiredValidator]" />
            </VCol>

            <VCol cols="12" style="display: none;">
              <AppSelect v-model="widgetRole" :label="$t('Widget Role')" placeholder="" :items="widgetRoleList"
                :rules="[requiredValidator]" item-value="value" item-title="title" />
            </VCol>

            <VCol cols="12" style="display: none;">
              <AppSelect v-model="widgtType" :label="$t('Widget Type')" placeholder="" :items="widgtTypeList"
                :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12">
              <AppSelect v-model="dataSrc" :label="$t('Data Source')" placeholder="" :items="dataSrcList"
                :disabled="formConditions.dataSrcCheck" />
            </VCol>

            <VCol cols="12" v-if="formConditions.datafromCodition">
              <AppSelect v-model="widgtStore.addWidget.datafrom" :label="$t('Data From Table')" placeholder=""
                :items="datafromList" item-value="value" item-title="title" @update:modelValue="fieldGetFromCustom" />
            </VCol>
            <VCol cols="12" v-if="!formConditions.datafromCodition">
              <AppSelect v-model="widgtStore.addWidget.formType" :label="$t('Form Type')" placeholder="" :items="formTypeList"
                item-value="value" item-title="title" @update:modelValue="getFormType" />
            </VCol>
            <VCol cols="12" v-if="!formConditions.datafromCodition">
              <AppSelect v-model="widgtStore.addWidget.form" :label="$t('Form')" placeholder="" :items="intakeForms"
                item-value="id" item-title="name" @update:modelValue="getFormField" />
            </VCol>

            <TableForm v-if="formConditions.showTableForm" />
            <ChartForm v-if="formConditions.showChartForm" />
            <VualizeImageForm v-if="formConditions.showVisualizeForm" />
          </v-row>
          <v-row>
            <!-- Submit Button in a Separate Row, Centered -->
            <v-col cols="12">
              <v-btn @click="onSubmit" color="primary">{{ $t('Submit') }}</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </VCardText>
    </VCard>

  </PerfectScrollbar>

</template>
