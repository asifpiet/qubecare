<script setup>
import { dateFormat } from '@/plugins/globalFunctions';
import { usePatientStore } from '@/stores/patientStore';
import { useTaskStore } from '@/stores/taskStore';

import AddTasksOrdersDrawer from '@/views/provider/patients/tasks/AddTasksOrdersDrawer.vue';
// import EditTasksOrdersDrawer from '@/views/apps/patient/tasksOrders/EditTasksOrdersDrawer.vue';
import { useStore } from 'vuex';
const store = useStore()
const patientStore = usePatientStore()
const taskStore = useTaskStore()
const taskId = ref();
const sortByData = ref([{ 'key': 'title', 'order': 'desc' }])
const dataTable = ref(null);
const emit = defineEmits([
    'update:isDrawerOpen',
    'healthMantaince'
]);
const props = defineProps({
    patient: {
        type: Object,
        required: true,
    }
})
const headers = [
    {
        title: 'Title',
        key: 'title',
    },
    {
        title: 'Order Type',
        key: 'task_type',
    },
    {
        title: 'Due Date',
        key: 'due_date',
    },
    {
        title: 'Status',
        key: 'activityStatus',
    },

    {
        title: 'Actions',
        key: 'actions',
        sortable: false,
        searchable: false
    },
]

const reload = () => dataTable.value.reload()

watch(() => taskStore.isDrawerOpen, (val) => {
    if (!val) {
        reload()
    }
})

watch(() => patientStore.id, (newVal) => {
    console.log('navAppointmentToggle', newVal);
    reload()
}
)
const editTask = async item => {
    console.log("editTask", item);
    taskId.value = item.id;
    taskStore.isDrawerOpen = true;

}

</script>

<template>
    <DataTable ref="dataTable" :cardTitle="$t('Tasks')" :btnTitle="$t('Add New Task')" :headers="headers"
        :api="GET_TASK_API_LIST + '/' + props.patient.id" :sortBy="sortByData"
        @onBtnClick="[taskStore.isDrawerOpen = true, taskId = null]">

        <template #item.due_date="{ item }">
            <div class="text-body-1 text-high-emphasis text-capitalize">
                {{ dateFormat(item.due_date) }}
            </div>
        </template>
        <template #item.activityStatus="{ item }">
            <VChip size="small" color="primary">
                <span class="font-weight-medium">{{ item.activityStatus }}</span>
            </VChip>

        </template>


        <template #item.actions="{ item }">
            <IconBtn @click="editTask(item)" v-if="$can('read', 'Tasks Edit')">
                <VIcon icon="tabler-edit" />
            </IconBtn>
        </template>
    </DataTable>

    <AddTasksOrdersDrawer :patient="props.patient.id" :selectedTask="taskId" v-if="taskStore.isDrawerOpen"
        @customEvent="reload()" />

</template>
