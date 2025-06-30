<script setup>
import { useLaborderStore } from '@/stores/laborderStore';
import { usePatientStore } from '@/stores/patientStore';
import AddOrder from '@/views/provider/patients/LabOrders/add.vue';
import PatientFileView from '@/views/provider/patients/LabOrders/PatientFileView.vue';
import { format } from 'date-fns';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const patientStore = usePatientStore()
const laborderStore = useLaborderStore()
const itemProps = ref([]);
const viewDrawer = ref(false)
const isDialogVisible = ref(false)
const isHideSubjectiveArray = ref(null);
const isEditDialogVisible = ref(false)
const statusValue = ref()
const isHideSubjectiveEntries = ref()
const isHideDeactivatedMeds = ref(false)
const presherbsrc = ref(null)
const sourceFilters = ref(null)
const deleteDialog = ref(false)
const delId = ref(null)
const selectedData = ref();
const sortByData = ref([{ 'key': 'order_id', 'order': 'desc' }])
const dataTable = ref(null);
const emit = defineEmits([
  'update:isDrawerOpen',
  'statusUpdate'
])


const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  style: {
    type: String,
    required: false,
    default: 'margin-top:0px;'
  }
})
const headers = [
  {
    title: 'ID',
    key: 'order_id',

  },
  {
    title: 'Lab Name',
    key: 'lab_name',

  },

  {
    title: 'Test Name',
    key: 'items',

  },

  {
    title: 'Status',
    key: 'status',

  },
  {
    title: 'Created At',
    key: 'created_at',
  },
  {
    title: 'Updated At',
    key: 'updated_at',
  },

  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    searchable: false
  },
]


const reload = () => dataTable.value.reload()

watch(() => laborderStore.isDrawerOpen, (val) => {
  if (!val) {
    reload()
  }
})

watch(() => patientStore.id, (newVal) => {
  reload()
}
)

const formatDateTime = (date) => {
  return format(date, 'MM-dd-yyyy');
};


const medicanFilter = () => {

  isHideSubjectiveArray.value = [];
  if (isHideSubjectiveEntries.value == true) {
    isHideSubjectiveArray.value = ["Supplement-Subjective", "Rx-Subjective"];
    //  isHideSubjectiveArray.value = "['Supplement-Subjective' , 'Supplement-Inventory', 'Supplement-SuperBill',  'Supplement' ]";
  }
  // sourceFilters.value = 'all';
  if (presherbsrc.value == "Supplement Only") {
    sourceFilters.value = ["Supplement-Subjective", "Supplement-Inventory", "Supplement-SuperBill", "Supplement"];
  }
  // sourceFilters.value = 'all';
  if (presherbsrc.value == 'Medican Only') {
    sourceFilters.value = ["Rx-Subjective", "Rx-eRx", "Rx-Manual/Fax"];
  }
  if (presherbsrc.value == 'All') {
    sourceFilters.value = 'all';
  }
}

// Create a computed object holding the values to be watched
const watchedValues = computed(() => ({
  presherbsrc: presherbsrc.value,
  isHideSubjectiveEntries: isHideSubjectiveEntries.value,
  isHideDeactivatedMeds: isHideDeactivatedMeds.value
}));


watch(watchedValues, (newValues) => {
  const { presherbsrc: newPresherbSrc, isHideSubjectiveEntries: newIsHideSubjectiveEntries, isHideDeactivatedMeds: newIsHideDeactivatedMeds } = newValues;
  presherbsrc.value = newPresherbSrc;
  isHideSubjectiveArray.value = newIsHideSubjectiveEntries;

  if (newIsHideDeactivatedMeds) {
    statusValue.value = 'inactive';
  } else {
    statusValue.value = 'all';
  }

  medicanFilter();
});

const closeNavigationDrawers = () => {
  console.log('closeNavigationDrawers');
  laborderStore.unloadLaborder();
  selectedData.value = null;
  isEditDialogVisible.value = false;
  isDialogVisible.value = false;


  reload();
}

const handleDrawerModelValueUpdate = val => {

  emit('update:isDrawerOpen', val)

}


const getStatusColor = (status) => {
  switch (status) {
    case "complete":
      return "success"; // Success
    case "Wait For Payment":
      return "warning"; // Warning
    case "Processing":
      return "info"; // Info
    case "Shipped":
      return "success"; // Shipped Status
    default:
      return "info"; // Default
  }
};

const viewFiles = (item) => {
  viewDrawer.value = true
  laborderStore.isDrawerOpen = true
  itemProps.value = item;
}

const deleteData = async(item) => {
    delId.value = item.order_id
    deleteDialog.value = true
}

const deleteItemConfirm = async () => {
    deleteDialog.value = false
    await laborderStore.deleteLaborder(delId.value)
    reload();
}

const getLabNames = (items) => {
  if (!Array.isArray(items.items)) return ''
  return items.items
    .map(item => item.lab_name)
    .filter(name => !!name) // removes null/undefined/empty values
    .join(', ')
}

const getTestNames = (items) => {
  if (!Array.isArray(items)) return ''
  return items
    .map(item => item.test_name)
    .filter(name => !!name) // removes null/undefined/empty values
    .join(', ')
}
</script>

<template>
  <section>
    <DataTable ref="dataTable" cardTitle="" :btnTitle="$t('Add Lab Order')" :headers="headers"
      :api="ADMIN_GET_LABORDERS_API + '/' + props.patient.id" :sortBy="sortByData"
      @onBtnClick="[laborderStore.isDrawerOpen = true, isDialogVisible = true, selectedData = null]">
      <template #item.lab_name="{ item }">
        <div class="text-body-1 text-high-emphasis text-capitalize wb">
          {{ getLabNames(item) }}
        </div>
      </template>

      <template #item.items="{ item }">
        <div class="text-body-1 text-high-emphasis text-capitalize wb">
          {{ getTestNames(item.items) }}
        </div>
      </template>

        <template #item.created_at="{ item }">
          <span>{{ formatDateTime(item.created_at) }}</span>
        </template>

        <template #item.updated_at="{ item }">
          <span>{{ formatDateTime(item.updated_at) }}</span>
        </template>
      <!-- <template #item.status="{ item }">
        <VChip v-if="item.status == 'complete'" color="success" rounded="xl">
          {{ $t('Approved') }}
        </VChip>
        <VChip v-else :color="getStatusColor(item.status)" rounded="xl">
          {{ item.status }}
        </VChip>

      </template> -->
      <template #item.actions="{ item }">
        <IconBtn @click="viewFiles(item)">
          <VTooltip
              activator="parent"
              location="top"
          >
              View
          </VTooltip>
          <VIcon icon="tabler-eye" />
        </IconBtn>
        <IconBtn @click="deleteData(item)">
          <VTooltip
              activator="parent"
              location="top"
          >
              Delete
          </VTooltip>
          <VIcon icon="tabler-trash" />
        </IconBtn>
        

      </template>
    </DataTable>

    <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content" :model-value="isDialogVisible"
      @update:model-value="handleDrawerModelValueUpdate">

      <AppDrawerHeaderSection :title="$t('Add Lab Order')"
        @cancel="[isDialogVisible = !isDialogVisible, selectedData = null, reload(), laborderStore.unloadLaborder()]" />
      <PerfectScrollbar :options="{ wheelPropagation: false }">
        <AddOrder :patient="props.patient" :data="selectedData" @customEvent="closeNavigationDrawers"
          v-if="laborderStore.isDrawerOpen" />
      </PerfectScrollbar>
    </VNavigationDrawer>

    <VDialog v-model="deleteDialog" max-width="500px">
    <VCard>
      <VCardTitle>
        {{ $t('Are you sure you want to delete this item?') }}
      </VCardTitle>

      <VCardActions>
        <VSpacer />

        <VBtn color="error" variant="outlined" @click="deleteDialog = false">
          {{ $t('Cancel') }}
        </VBtn>

        <VBtn color="success" variant="elevated" @click="deleteItemConfirm">
          {{ $t('Ok') }}
        </VBtn>

        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
  <PatientFileView :itemProps="itemProps" v-if="laborderStore.isDrawerOpen && viewDrawer"/>
  </section>

</template>
<style scope>
/* .v-table__wrapper {
    overflow: hidden !important;
} */
.wb{
    white-space: normal;
    word-break: break-word;
}
.backgroundColor {
  background-color: #e0f2ef;
}
</style>
