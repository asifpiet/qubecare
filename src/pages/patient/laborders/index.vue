<script setup>
import { useLaborderStore } from '@/stores/laborderStore';
import { usePatientStore } from '@/stores/patientStore';
import PatientFileUpload from '@/views/provider/patients/LabOrders/PatientFileUpload.vue';
import PatientFileView from '@/views/provider/patients/LabOrders/PatientFileView.vue';
import { format } from 'date-fns';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const patientStore = usePatientStore()
const laborderStore = useLaborderStore()

const isDialogVisible = ref(false)
const itemProps = ref([]);
const drawName = ref(null);
const sortByData = ref([{ 'key': 'order_id', 'order': 'desc' }])
const dataTable = ref(null);

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


const openDrawer = (item,name) => {
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
</script>

<template>
    <section>
        <VDivider />
        <DataTable ref="dataTable" :cardTitle="$t('Lab Orders')" btnTitle="" :headers="headers"
            :api="PATIENT_GET_LABORDERS_API" :sortBy="sortByData">
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
                <IconBtn @click="openDrawer(item,'view')">
                    <VTooltip
                        activator="parent"
                        location="top"
                    >
                        View
                    </VTooltip>
                    <VIcon icon="tabler-eye" />
                </IconBtn>
                <IconBtn @click="openDrawer(item,'upload')">
                    <VTooltip
                        activator="parent"
                        location="top"
                    >
                        Upload
                    </VTooltip>
                    <VIcon icon="tabler-upload" />
                </IconBtn>

            </template>
        </DataTable>
    </section>

    <PatientFileUpload :itemProps="itemProps" v-if="laborderStore.isDrawerOpen && drawName === 'upload'"/>
    <PatientFileView :itemProps="itemProps" v-if="laborderStore.isDrawerOpen && drawName === 'view'"/>


</template>
<style scope>
/* .v-table__wrapper {
    overflow: hidden !important;
} */

.backgroundColor {
    background-color: #e0f2ef;
}
</style>
