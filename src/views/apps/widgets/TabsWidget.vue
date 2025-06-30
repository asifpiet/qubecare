<script setup>
import AppoinmentsWidget from '@/views/apps/widgets/AppoinmentsWidget.vue';
import ChartWidgt from '@/views/apps/widgets/ChartWidgt.vue';
import ChatWidget from '@/views/apps/widgets/ChatWidget.vue';
import ClinicalProfileWidget from '@/views/apps/widgets/ClinicalProfileWidget.vue';
import ConsentForm from '@/views/apps/widgets/ConsentFormWidget.vue';
import DocumentWidget from '@/views/apps/widgets/DocumentWidget.vue';
import GoToCallWidget from '@/views/apps/widgets/GoToCallWidget.vue';
import HealthMaintenenceWidget from '@/views/apps/widgets/HealthMaintenenceWidget.vue';
import IntakeFormWidget from '@/views/apps/widgets/IntakeFormWidget.vue';
import ListView from '@/views/apps/widgets/ListView.vue';
import MultiFormRender from '@/views/apps/widgets/MultiFormRender.vue';
import NotesWidget from '@/views/apps/widgets/NotesWidget.vue';
import PatientDetail from '@/views/apps/widgets/PatientDetail.vue';
import PrecriptionWidget from '@/views/apps/widgets/PrecriptionWidget.vue';
import RenderVualizeImage from '@/views/apps/widgets/RenderVualizeImage.vue';
import tableWidgt from '@/views/apps/widgets/tableWidgt.vue';
import TagsWidget from '@/views/apps/widgets/TagsWidget.vue';
import TaskOrderWidget from '@/views/apps/widgets/TaskOrderWidget.vue';
import TransacrptionWidget from '@/views/apps/widgets/TransacrptionWidget.vue';
import VitalsWidget from '@/views/apps/widgets/VitalsWidget.vue';
import Demographics from '@/views/provider/patients/Demographics/Demographics.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const activeTab = ref(0)
const props = defineProps({
  data: {
    type: Object,
    required: false,
  },
  patientId: {
    type: Number,
    required: false,
  },
  widgetData: {
    type: Object,
    required: false,
  },
})
const widgetComponent = {
  visulize_chart: RenderVualizeImage,
  line_chart: ChartWidgt,
  bar_chart: ChartWidgt,
  table: tableWidgt,
  horizontal_bar_chart: ChartWidgt,
  list_view: ListView,
  tags_view: TagsWidget,
  patient_detail_prescrption: PatientDetail,
  prescrption: PrecriptionWidget,
  demographics: Demographics,
  patient_documents: DocumentWidget,
  health_maintenance: HealthMaintenenceWidget,
  clinical_profile: ClinicalProfileWidget,
  tasks_orders: TaskOrderWidget,
  got_to_call: GoToCallWidget,
  multi_form_render: MultiFormRender,
  chat: ChatWidget,
  intake_form: IntakeFormWidget,
  consent_form: ConsentForm,
  vitals: VitalsWidget,
  notes: NotesWidget,
  previous_appointments: AppoinmentsWidget,
  transcrption: TransacrptionWidget,
}

const translatedTabs = computed(() => {
  return props.widgetData.tabs.map(tab => ({
    ...tab,
    title: t(tab.title)
  }));
});

</script>

<template>

  <VCol :cols="props.widgetData.cols">


    <v-tabs v-model="activeTab" class="shift-arraow-right pb-0">

      <v-tab v-for="(tab, index) in translatedTabs" :key="index" :value="index">

        <v-icon :icon="tab.icon" class="mr-2"></v-icon> {{ tab.title }}
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <v-window-item v-for="(tab, index) in props.widgetData.tabs" :key="index" :value="index">

        <v-row style="padding: 5px;">
          <v-col v-for="widget in tab.widgets" :key="widget.id" cols="12">
            <component :is="widgetComponent[widget.widget_type]" :widgetData="widget" :patientId="props.patientId" />
          </v-col>
        </v-row>

      </v-window-item>
    </v-window>

  </VCol>
</template>
