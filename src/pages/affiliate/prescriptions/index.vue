<script setup>
import PatientStatusOption from '@/pages/affiliate/prescriptions/affiliateStatusOption.vue';
import { useMedicationStore } from '@/stores/medicationStore';
import { usePatientStore } from '@/stores/patientStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import prescription from '@/views/provider/patients/MedSupplement/prescription.vue';

import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
const { currentUser, currentRole } = useAuth()
const store = useStore()
const patientStore = usePatientStore()
const medicationStore = useMedicationStore()
const practitionerStore = usePractitionerStore()
const isStatusUpdateDialogVisible = ref(false)
// medicationStore.unloadMedicineList()
const isDialogVisible = ref(false)
const search = ref('')
const isFormValid = ref();
const refForm = ref()
const itemProps = ref([]);
const itemsPerPage = ref(10);
const isHideSubjectiveArray = ref(null);
const medData = ref(null);
const isEditDialogVisible = ref(false)
const prescriptionId = ref(null)
const isSignatureDialogVisible = ref(false)
const statusValue = ref()
const isHideSubjectiveEntries = ref()
const isPrescriptionDialogVisible = ref(false)
const isHideDeactivatedMeds = ref(false)
const presherbsrc = ref(null)
const sourceFilters = ref(null)
const selectedMedicine = ref();
const sortByData = ref([{ 'key': 'provider_name', 'order': 'desc' }])
const dataTable = ref(null);
const signatureRef = ref(null)
const signature = ref(null)
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
        title: 'Patient',
        key: 'patient_name',

    },
    {
        title: 'Date',
        key: 'date',

    },
    {
        title: 'Doctor',
        key: 'practitioner_name',
    },
    {
        title: 'Provider',
        key: 'provider_name',

    },
    {
        title: 'Amount',
        key: 'total_amount',

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


const reload = () => dataTable.value.reload()

watch(() => medicationStore.isDrawerOpen, (val) => {
    if (!val) {
        reload()
    }
})

watch(() => patientStore.id, (newVal) => {
    console.log('navAppointmentToggle', newVal);
    reload()
}
)


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
    console.log("item", item.id);
    selectedMedicine.value = item.id;
    medicationStore.isDrawerOpen = true;
    isEditDialogVisible.value = true;
}

const viewPrescription = (item) => {
    medicationStore.getPatientPrescriptionById(item.id)
    isPrescriptionDialogVisible.value = true;
    itemProps.value = item;
}
const closeNavigationDrawers = () => {
    console.log('closeNavigationDrawers');
    medicationStore.unloadMedication();
    selectedMedicine.value = null;
    isEditDialogVisible.value = false;
    isDialogVisible.value = false;


    reload();
}

const clear = () => {
    signatureRef.value.clear()
};
const state = reactive({
    count: 0,
    option: {
        penColor: "rgb(0, 0, 0)",
        backgroundColor: "rgb(255,255,255)"
    },
    disabled: false
})

const getStatusColor = (status) => {
    switch (status) {
        case "pending":
            return "info"; // Success
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



const history = async (id) => {
    medicationStore.status = null;
    medicationStore.signatureNote = null;
    medicationStore.tracking_number = null;
    let res = await medicationStore.getAffiliateStatusHisotry(id);
    console.log("res", res);
    prescriptionId.value = id;
    isStatusUpdateDialogVisible.value = true;


}
</script>

<template>
    <section>
        <VDivider />
        <DataTable ref="dataTable" :cardTitle="$t('Prescriptions')" btnTitle="" :headers="headers"
            :api="AFFILIATE_PATIENT_PRESCRIPTION" :sortBy="sortByData"
            @onBtnClick="[medicationStore.isDrawerOpen = true, isDialogVisible = true, selectedMedicine = null]">
            <template #item.date="{ item }">
                <div class="text-body-1 text-high-emphasis text-capitalize">
                    {{ item.date }}
                </div>
            </template>
            <template #item.status="{ item }">
                <VChip v-if="item.status == 'complete'" color="success" rounded="xl">
                    {{ $t('Approved') }}
                </VChip>
                <VChip v-else :color="getStatusColor(item.status)" rounded="xl">
                    {{ item.status }}
                </VChip>



            </template>
            <template #item.total_amount="{ item }">
                <div class="text-body-1 text-high-emphasis text-capitalize">
                    ${{ parseFloat(item.total_amount).toFixed(2) }}
                </div>
            </template>


            <template #item.actions="{ item }">
                <!-- <IconBtn @click="editMed(item)">
                    <VIcon icon="tabler-edit" />
                </IconBtn> -->
                <IconBtn @click="viewPrescription(item)">
                    <VIcon icon="tabler-eye" />
                </IconBtn>
                <IconBtn @click="history(item.id)">
                    <VIcon icon="tabler-shopping-cart"></VIcon>
                </IconBtn>


                <!-- v-if="item.status == 'pending'" -->
                <!-- <VBtn size="small" @click="[isSignatureDialogVisible = true, prescriptionId = item.id]"
                    v-if="item.status === 'pending'">Approve</VBtn> -->
            </template>
        </DataTable>
    </section>

    <!-- <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content" :model-value="isDialogVisible"
        @update:model-value="handleDrawerModelValueUpdate">

        <AppDrawerHeaderSection :title="'Add Prescription'"
            @cancel="[isDialogVisible = !isDialogVisible, selectedMedicine = null, medicationStore.prescriptionId = null, reload(), medicationStore.unloadMedication()]" />
        <AddMedican :patient="props.patient" :medicine="selectedMedicine" @customEvent="closeNavigationDrawers"
            v-if="medicationStore.isDrawerOpen" />
    </VNavigationDrawer> -->


    <!-- <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content"
        :model-value="isEditDialogVisible" @update:model-value="handleDrawerModelValueUpdate">

        <AppDrawerHeaderSection :title="'Edit Prescription'"
            @cancel="[isEditDialogVisible = !isEditDialogVisible, selectedMedicine = null, medicationStore.prescriptionId = null, reload(), medicationStore.unloadMedication()]" />
        <AddMedican :patient="props.patient" :medicine="selectedMedicine" @customEvent="closeNavigationDrawers"
            v-if="medicationStore.isDrawerOpen && selectedMedicine" />

    </VNavigationDrawer> -->


    <VNavigationDrawer v-model="isPrescriptionDialogVisible" temporary :width="600" location="end"
        class="scrollable-content">
        <AppDrawerHeaderSection title="View Prescription"
            @cancel="[isPrescriptionDialogVisible = !isPrescriptionDialogVisible, selectedMedicine = null, medicationStore.prescriptionId = null, reload()]" />
        <VDivider />
        <PerfectScrollbar :options="{ wheelPropagation: false }">
            <prescription :itemProps="itemProps" />
        </PerfectScrollbar>
    </VNavigationDrawer>


    <VDialog v-model="isStatusUpdateDialogVisible" max-width="800">
        <DialogCloseBtn @click="[isStatusUpdateDialogVisible = !isStatusUpdateDialogVisible, reload()]" />
        <VCard>
            <VCardText>
                <PatientStatusOption :prescriptionId=prescriptionId v-if="prescriptionId"
                    @statusUpdate="[isStatusUpdateDialogVisible = false, reload()]" />
            </VCardText>
        </VCard>
    </VDialog>
</template>
<style scope>
/* .v-table__wrapper {
    overflow: hidden !important;
} */

.backgroundColor {
    background-color: #e0f2ef;
}
</style>
