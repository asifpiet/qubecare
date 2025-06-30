<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Widget list',
  },
})
import { useWidgetBuilderStore } from '@/stores/widgetBuilderStore';
import AddWidgetType from '@/views/apps/widgets/AddWidget.vue';
import ChartWidgt from '@/views/apps/widgets/ChartWidgt.vue';
import ListView from '@/views/apps/widgets/ListView.vue';
import RenderVualizeImage from '@/views/apps/widgets/RenderVualizeImage.vue';
import tableWidgt from '@/views/apps/widgets/tableWidgt.vue';

import { useStore } from 'vuex';
const widgtStore = useWidgetBuilderStore()
const store = useStore()
const dataTable = ref(null);

const isDialog = ref(false)
const isDialogChart = ref(false)
const isDialogListView = ref(false)
const isDialogImageChart = ref(false)
const isAddNewUserDrawerVisible = ref(false)

const isAddOrderDrawerVisible = ref(false)

const isEditInventoryDrawerVisible = ref(false)
const isTonalSnackbarVisible = ref(false)
const isDeleteTonalSnackbarVisible = ref();
const selectedMore = ref()

const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])

const isDisable = ref();
const search = ref('')
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);
const itemsPerPage = ref(10);
const widgetData = ref(null)
const editItem = ref({})
const emit = defineEmits([
  'saveProductData'

]);
const headers = [
  {
    title: 'ID',
    key: 'id',
    name: 'id',
  },
  {
    title: 'Widget Name',
    key: 'widget_name',
    name: 'widget_name',
  },
  {
    title: 'Widget Type',
    key: 'widget_type',
    name: 'widget_type',
  },


  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    searchable: false
  },
]





const deleteUser = async (id) => {
  // await store.dispatch('deleteWidget', {
  //   id
  // })
  widgtStore.deleteWidget(id)
  reload()
}


onMounted(async () => {
  //loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
})
const isTabEnable = async () => {
  isDisable.value = true
  await store.dispatch('savePatientPorfile', {
    patientId: null,
    firstName: null,
    lastName: null
  })
}


const loadWidgt = (item) => {
  if (item.widget_type == "visulize_chart") {
    isDialogImageChart.value = true
    widgetData.value = item
  } else if (item.widget_type == "list_view") {
    isDialogListView.value = true
    widgetData.value = item
  } else if (item.widget_type != 'table') {
    isDialogChart.value = true;
    widgetData.value = item
  } else {
    isDialog.value = true;
    widgetData.value = item
  }

}
const reload = () => dataTable.value.reload()
watch(() => widgtStore.isDrawerOpen, (val) => {
  if (!val) {
    reload()
  }
})
</script>

<template>
  <section>


    <DataTable ref="dataTable" cardTitle="Widgets" btnTitle="Add New Widgets" :headers="headers" :api="WIDGT_LIST"
      :sortBy="sortByData" @onBtnClick="[widgtStore.isDrawerOpen = true]">

      <template #item.actions="{ item }">
        <IconBtn @click="deleteUser(item.id)" v-if="$can('read', 'Widget Delete')">
          <VIcon icon="tabler-trash" />
        </IconBtn>
        <IconBtn @click="loadWidgt(item)" v-if="$can('read', 'Widget View')">
          <VIcon icon="tabler-eye" />
        </IconBtn>
      </template>
    </DataTable>




    <VDialog v-model="widgtStore.isDrawerOpen" max-width="800">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="widgtStore.isDrawerOpen = !widgtStore.isDrawerOpen" />
      <AddWidgetType @saveWidgetData="saveWidget" @dataSave="setNotifcation" />
    </VDialog>




    <VDialog v-model="isDialog" max-width="800">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialog = !isDialog" />
      <tableWidgt :widgetData="widgetData" />
    </VDialog>


    <VDialog v-model="isDialogChart" max-width="800">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogChart = !isDialogChart" />
      <ChartWidgt :widgetData="widgetData" />
    </VDialog>

    <VDialog v-model="isDialogImageChart">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogImageChart = !isDialogImageChart" />
      <RenderVualizeImage :widgetData="widgetData" />
    </VDialog>
    <VDialog v-model="isDialogListView">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogListView = !isDialogListView" />
      <ListView :widgetData="widgetData" />
    </VDialog>




  </section>
</template>
