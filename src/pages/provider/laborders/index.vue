<script setup>
import { useLaborderStore } from '@/stores/laborderStore';
import { usePatientStore } from '@/stores/patientStore';
// import PatientFileUpload from '@/views/provider/patients/LabOrders/PatientFileUpload.vue';
import PatientFileView from '@/views/provider/patients/LabOrders/PatientFileView.vue';
import { format } from 'date-fns';

const patientStore = usePatientStore()
const laborderStore = useLaborderStore()
const isConfirmDialogVisible = ref(false)
const isDialogVisible = ref(false)
const itemProps = ref([]);
const drawName = ref(null);
const sortByData = ref([{ 'key': 'order_id', 'order': 'desc' }])
const dataTable = ref(null);
const itemToDelete = ref(null);
const emit = defineEmits([
  'update:isDrawerOpen',
])
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  }
})
const headers = [
  {
    title: 'ID',
    key: 'order_id',

  },
  {
    title: 'Patient',
    key: 'patient_name',

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


const openDrawer = (item, name) => {
  drawName.value = name
  laborderStore.isDrawerOpen = true;
  itemProps.value = item;
}


const formatDateTime = (date) => {
  return format(date, 'MM-dd-yyyy');
};

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

const confirmDelete = (item) => {
  itemToDelete.value = item; // Store the item to be deleted
  isConfirmDialogVisible.value = true; // Show the confirmation dialog
};

const handleConfirm = () => {
  if (itemToDelete.value) {
    deleteLabOrder(itemToDelete.value.id); // Delete the item
    isConfirmDialogVisible.value = false; // Close the dialog
    itemToDelete.value = null; // Reset the item
  }
};

const handleCancel = () => {
  console.log('dddd')
  isConfirmDialogVisible.value = false; // Close the dialog
  itemToDelete.value = null; // Reset the item
};

const deleteLabOrder = async (id) => {
  await laborderStore.deleteLaborder(id)
  reload()
}
</script>

<template>
  <section>
    <VDivider />
    <DataTable ref="dataTable" :cardTitle="$t('Lab Orders')" btnTitle="" :headers="headers"
      :api="PROVIDER_GET_LABORDERS_API" :sortBy="sortByData">
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
      <template #item.actions="{ item }">
        <IconBtn @click="openDrawer(item, 'view')">
          <VTooltip activator="parent" location="top">
            View
          </VTooltip>
          <VIcon icon="tabler-eye" />
        </IconBtn>

        <IconBtn @click="confirmDelete(item)">
          <VTooltip activator=" parent" location="top">
            Delete
          </VTooltip>
          <VIcon icon="tabler-trash" />
        </IconBtn>
        <!-- <IconBtn @click="openDrawer(item, 'upload')">
          <VTooltip activator="parent" location="top">
            Upload
          </VTooltip>
          <VIcon icon="tabler-upload" />
        </IconBtn> -->

      </template>
    </DataTable>
    <ConfirmDialog v-model:isDialogVisible="isConfirmDialogVisible"
      confirmation-question="Are you sure you want to delete this item?" confirm-title="Deleted!"
      confirm-msg="Item deleted successfully." cancel-title="Cancelled" cancel-msg="Deletion Cancelled!!"
      @confirm="handleConfirm" @cancel="handleCancel" />
  </section>

  <!-- <PatientFileUpload :itemProps="itemProps" v-if="laborderStore.isDrawerOpen && drawName === 'upload'" /> -->
  <PatientFileView :itemProps="itemProps" v-if="laborderStore.isDrawerOpen && drawName === 'view'" />


</template>
<style scope>
/* .v-table__wrapper {
    overflow: hidden !important;
} */

.backgroundColor {
  background-color: #e0f2ef;
}
</style>
