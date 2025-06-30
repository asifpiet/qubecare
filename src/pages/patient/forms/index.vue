<script setup>
import Intake from '@/pages/patient/forms/Intake.vue';
import { dateFormat } from '@/plugins/globalFunctions';
import { useStore } from 'vuex';
const { currentUser, currentRole } = useAuth()
const store = useStore()
const isLoading = ref(false)
const isDocumentDialogVisible = ref(false)
const isViewConsentFormDrawerVisible = ref(false)
const isEditDocumentDialogVisible = ref(false)
const sortByData = ref([{ 'key': 'form_name', 'order': 'desc' }])
const filterDocument = ref([]);
const dataTable = ref(null);
const intakeFormId = ref(null)
const storedData = ref({})
const formName = ref(null);
const intakefieldValue = ref([]);
const isIntakeDrawerVisible = ref(false)
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
        title: 'Requested Form',
        key: 'form_name',
    },
    {
        title: 'Provider',
        key: 'provider_name',
    },
    {
        title: 'Requested Date',
        key: 'date',
    },
    {
        title: 'Status',
        key: 'status',
    },
    {
        title: 'Actions',
        key: 'actions',
        sortable: false,
        searchable: false
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

const showForm = async (item) => {
    console.log("item", item);
    intakeFormId.value = item.form_id;
    formName.value = item.form_name;
    // console.log("item", formName.value);
    isIntakeDrawerVisible.value = true
};

const openIntakeModal = async (item) => {
    intakefieldValue.value = item;

    isViewConsentFormDrawerVisible.value = true;
    storedData.value = item
};



</script>

<template>
    <DataTable ref="dataTable" :cardTitle="$t('Forms Request')" btnTitle="" :headers="headers"
        :api="GET_PATIENT_REQUEST_FORM" :sortBy="sortByData" @onBtnClick="isDocumentDialogVisible = true">

        <template #item.date="{ item }">
            <div class="text-body-1 text-high-emphasis text-capitalize">
                {{ dateFormat(item.date) }}
            </div>
        </template>
        <template #item.status="{ item }">
            <div class="text-body-1 text-high-emphasis text-capitalize">
                <span v-if="item.status == 'Complete'">
                    <VChip color="success">{{ item.status }}</VChip>
                </span>
                <span v-else>
                    <VChip color="info">{{ item.status }}</VChip>
                </span>
            </div>
        </template>
        <template #item.actions="{ item }">
            <div class="text-body-1 text-high-emphasis text-capitalize" v-if="item.status == 'Pending'">
                <VBtn size="small" @click="showForm(item)">{{ $t('Fill Out') }} </VBtn>
            </div>
            <!-- <div class="text-body-1 text-high-emphasis text-capitalize" v-if="item.status == 'Complete'">
                <VIcon icon="tabler-eye" />
            </div> -->
            <!-- <div class="text-body-1 text-high-emphasis text-capitalize" v-if="item.status == 'Complete'">
                <VBtn size="small" @click="showForm(item)">Edit </VBtn>
            </div> -->
            <!-- <IconBtn @click="openIntakeModal(item)" v-if="item.status == 'Complete'">
                <VIcon icon="tabler-eye" />
            </IconBtn> -->
        </template>
    </DataTable>


    <VDialog v-model="isIntakeDrawerVisible" max-width="800">
        <DialogCloseBtn @click="[isIntakeDrawerVisible = false, dataTable.reload()]" />
        <VCard>
            <VCardText>
                <Intake v-if="isIntakeDrawerVisible" :name="formName" @closePopup="closeIntakeForm"
                    :patient="props.patient" :storedData="storedData" :selectedFormId="intakeFormId"
                    @completed="[isIntakeDrawerVisible = false, dataTable.reload()]" />
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
