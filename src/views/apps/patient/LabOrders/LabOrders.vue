<script setup>
import { useMedicationStore } from '@/stores/medicationStore';
import { usePatientStore } from '@/stores/patientStore';
import LabOrders from '@/views/provider/patients/LabOrders/index.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
const store = useStore()
const patientStore = usePatientStore()
const medicationStore = useMedicationStore()
const isDialogVisible = ref(false)
const search = ref('')
const itemsPerPage = ref(10);
const isHideSubjectiveArray = ref(null);
const medData = ref(null);
const isEditDialogVisible = ref(false)
const statusValue = ref()
const isHideSubjectiveEntries = ref()
const isHideDeactivatedMeds = ref(false)
const presherbsrc = ref(null)
const sourceFilters = ref(null)
const selectedMedicine = ref();
const sortByData = ref([{ 'key': 'drug', 'order': 'desc' }])
const dataTable = ref(null);
const emit = defineEmits([
  'update:isDrawerOpen',
])
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
  isDrawerOpen: {
    type: Boolean,
    required: true,
  }
})
const headers = [
  {
    title: 'Prescription Formula/Herb',
    key: 'drug',
  },
  {
    title: 'Dosing Detail',
    key: 'refills',

  },
  {
    title: 'started',
    key: 'start_date',

  },
  {
    title: 'Discounted',
    key: 'end_date',

  },
  {
    title: 'Source',
    key: 'presherb_src',
    name: 'presherb_src'
  },
  // {
  //   title: 'Actions',
  //   key: 'actions',
  //   sortable: false,
  //   searchable: false
  // },
]


const reload = () => dataTable.value.reload()

watch(() => medicationStore.isDrawerOpen, (val) => {
  if (!val) {
    reload()
  }
})


const srcOptions = [
  'All',
  'Medican Only',
  'Supplement Only',
];

const medicanFilter = () => {
  console.log("presherbsrc", presherbsrc.value);
  console.log('xcxccxc', isHideSubjectiveEntries.value);
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

  // console.log(isHideDeactivatedMeds.value);

  //loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
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

const editMed = (item) => {
  console.log("item", item);
  selectedMedicine.value = item.prescription_id;
  medicationStore.isDrawerOpen = true;
  isDialogVisible.value = true;
}
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
}



const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}
const closeNavigationDrawers = () => {
  console.log('closeNavigationDrawers');
  isEditDialogVisible.value = false;
  isDialogVisible.value = false;
  reload();
}
</script>

<template>
  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">

    <AppDrawerHeaderSection :title="$t('Lab Orders') + ' (' + props.patient.demographic.fullName + ')'"
      @cancel="closeNavigationDrawer" />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <LabOrders :patient="props.patient" />
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
<style scope>
/* .v-table__wrapper {
  overflow: hidden !important;
} */
</style>
