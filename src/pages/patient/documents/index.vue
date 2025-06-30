<script setup>
import AddDocument from '@/pages/patient/documents/newDocument.vue';
import EditDocument from '@/views/apps/patient/document/editDocument.vue';
import { useStore } from 'vuex';
const { currentUser, currentRole } = useAuth()
const store = useStore()
const isLoading = ref(false)
const isDocumentDialogVisible = ref(false)
const isEditDocumentDialogVisible = ref(false)
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const filterDocument = ref([]);
const dataTable = ref(null);
const props = defineProps({
    patient: {
        type: Object,
        required: true,
    },
    isDrawerOpen: {
        type: Boolean,
        required: true,
    },
    isDataEnable: {
        type: Boolean,
    }
})

const headers = [
    {
        title: 'ID',
        key: 'id',
    },
    // {
    //     title: 'Date',
    //     key: 'docdate',
    // },
    {
        title: 'Title',
        key: 'name',
    },
    {
        title: 'Type',
        key: 'mimetype',
    },
    {
        title: 'Download',
        key: 'url',
    },


]



onMounted(async () => {
    dataTable.value.reload()
})

const emit = defineEmits([
    'closeForm',
    'patientData'
]);

const closeNavigationDrawer = () => {
    emit('update:isDrawerOpen', false)
}

const handleDrawerModelValueUpdate = val => {
    emit('update:isDrawerOpen', val)
}

const editDocument = async (vid) => {
    isLoading.value = true;
    isEditDocumentDialogVisible.value = true;
    let pid = props.patient.id;
    const res = await $api('/api' + PATIENT_API + '/' + pid, {
        method: 'GET',
    });
    filterDocument.value = res.documents.filter(row => row.id === vid)
    isLoading.value = false;
    return true;
}

const deleteVital = async vid => {
    let documents = filterDocument.value[0].documents;
    isLoading.value = true;
    const index = documents.filter(row => row.id === vid);
    if (index !== -1) {
        documents.splice(index, 1);

    } else {
        console.log('Row not found');
    }



    isLoading.value = false;
};

const closePopupWindow = () => {
    isDocumentDialogVisible.value = false;
    isEditDocumentDialogVisible.value = false;
    dataTable.value.reload()

}
const downloadPDF = async (item) => {
    window.open(item.url, "_blank");
}


</script>

<template>
    <VCardText>
        <DataTable ref="dataTable" cardTitle="Documents" btnTitle="Upload Documents" :headers="headers"
            :api="GET_PATIENT_DOCUMENT" :sortBy="sortByData" @onBtnClick="isDocumentDialogVisible = true">
            <template #item.url="{ item }">
                <div class="d-flex align-center gap-x-4" v-if="$can('read', 'Patient Documents Download View')">
                    <span @click="downloadPDF(item)" class="cursor-pointer text-primary"
                        style="text-decoration: underline;">Download</span>
                </div>

            </template>
        </DataTable>

    </VCardText>
    <VDialog v-model="isDocumentDialogVisible" width="600">
        <DialogCloseBtn @click="isDocumentDialogVisible = false" />
        <VCard title="Create New Document">
            <VCardText>
                <AddDocument @addDocument="updateNewUser" @closePoup=closePopupWindow :patient="props.patient" />
            </VCardText>
        </VCard>
    </VDialog>
    <VDialog v-model="isEditDocumentDialogVisible" width="600">
        <DialogCloseBtn @click="isEditDocumentDialogVisible = false" />
        <VCard title="Edit Document">
            <VCardText>
                <EditDocument :editDocumentData="filterDocument" @closePoup=closePopupWindow />
            </VCardText>
        </VCard>
    </VDialog>
</template>
<style lang="scss">
.app-autocomplete__option:contains('Heading:') {
    font-weight: bold;
    color: #333;
}
</style>
