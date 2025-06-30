<script setup>

import { usePatientStore } from '@/stores/patientStore';
import { useUserStore } from '@/stores/userStore';
import ChartWidgt from '@/views/apps/widgets/ChartWidgt.vue';
import ChatWidget from '@/views/apps/widgets/ChatWidget.vue';

import AppoinmentsWidget from '@/views/apps/widgets/AppoinmentsWidget.vue';
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
import TabsWidget from '@/views/apps/widgets/TabsWidget.vue';
import TagsWidget from '@/views/apps/widgets/TagsWidget.vue';
import TaskOrderWidget from '@/views/apps/widgets/TaskOrderWidget.vue';
import TransacrptionWidget from '@/views/apps/widgets/TransacrptionWidget.vue';
import VitalsWidget from '@/views/apps/widgets/VitalsWidget.vue';
import Demographics from '@/views/provider/patients/Demographics/Demographics.vue';
import { useStore } from 'vuex';
const patientStore = usePatientStore()
//patientStore.unloadPatient()
const userStore = useUserStore()
const store = useStore()
const loadPatient = ref(true)
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  patientId: {
    type: Number,
    required: false,
  }
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
  'tabs-widget': TabsWidget,
  multi_form_render: MultiFormRender,
  chat: ChatWidget,
  intake_form: IntakeFormWidget,
  consent_form: ConsentForm,
  vitals: VitalsWidget,
  notes: NotesWidget,
  previous_appointments: AppoinmentsWidget,
  transcrption: TransacrptionWidget
}
console.log(props.data)
const name = ref(null);
const data = ref({});

</script>

<template>



  <VCol :cols="props.data.cols">
    <DynamicCard :meta="props.data.metaConfig">

      <component v-for="widget in props.data.child" :is="widgetComponent[widget.widget_type]" :widgetData="widget"
        :patientId="Number(props.patientId)" />
    </DynamicCard>
  </VCol>








</template>
