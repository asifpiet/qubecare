<script setup>
import { useMedicationStore } from '@/stores/medicationStore';
import { usePatientStore } from '@/stores/patientStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import AddMedican from '@/views/provider/patients/MedSupplement/AddMedican.vue';
import prescription from '@/views/provider/patients/MedSupplement/prescription.vue';
import StatusOption from '@/views/provider/patients/MedSupplement/statusOption.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

import { useStore } from 'vuex';
const store = useStore()
const patientStore = usePatientStore()
const medicationStore = useMedicationStore()
const practitionerStore = usePractitionerStore()
// medicationStore.unloadMedicineList()
const isDialogVisible = ref(false)
const search = ref('')
// const needs_followup = ref(null)
// const numberOfDays = ref(null)
const isFormValid = ref();
const refForm = ref()
const itemProps = ref([]);
const itemsPerPage = ref(10);
const isHideSubjectiveArray = ref(null);
const medData = ref(null);
const isEditDialogVisible = ref(false)
const prescriptionId = ref(null)
const isSignatureDialogVisible = ref(false)
const isStatusUpdateDialogVisible = ref(false)
const statusValue = ref()
const isHideSubjectiveEntries = ref()
const isPrescriptionDialogVisible = ref(false)
const isHideDeactivatedMeds = ref(false)
const presherbsrc = ref(null)
const sourceFilters = ref(null)
const selectedMedicine = ref();
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);
const signatureRef = ref(null)
const signature = ref(null)
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
        key: 'id',

    },
    {
        title: 'Date',
        key: 'date',

    },
    {
        title: 'Patient',
        key: 'patient_name',

    },
    {
        title: 'Doctor',
        key: 'practitioner_name',
    },
    // {
    //     title: 'Provider',
    //     key: 'provider_name',

    // },

    {
        title: 'Status',
        key: 'status',

    },

    // {
    //     title: 'Actions',
    //     key: 'actions',
    //     sortable: false,
    //     searchable: false
    // },
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
    medicationStore.getPrescriptionById(item.id)
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
    medicationStore.needs_followup = null;
    medicationStore.numberOfDays = null;
};
const state = reactive({
    count: 0,
    option: {
        penColor: "rgb(0, 0, 0)",
        backgroundColor: "rgb(255,255,255)"
    },
    disabled: false
})

const onSubmit = async (t) => {
    console.log('onSubmit');
    refForm.value?.validate().then(async ({ valid }) => {
        console.log('onSubmit', valid);
        if (valid) {
            signature.value = signatureRef.value.save(t)
            medicationStore.signature = signatureRef.value.save(t);
            console.log("signatureRef", signatureRef.value.save(t))
            medicationStore.status = 'complete';
            let res = await medicationStore.updatePrescriptionStaus(prescriptionId.value)
            console.log("res", res);
            isSignatureDialogVisible.value = false;
            reload();

        }
        else {
            console.log('else');
        }
    });
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

const history = async (id) => {
    medicationStore.status = null;
    medicationStore.signatureNote = null;
    medicationStore.tracking_number = null;
    let res = await medicationStore.getStatusHisotry(id);
    console.log("res", res);
    prescriptionId.value = id;
    isStatusUpdateDialogVisible.value = true;


}

const allowPositiveNumbers = (event) => {
    const value = event.target.value;
    event.target.value = value.replace(/\D/g, '');
};
</script>

<template>
    <section>
        <DataTable ref="dataTable" cardTitle="Prescriptions" btnTitle="" :headers="headers"
            :api="PROVIDER_PRESCRIPTION_API" :sortBy="sortByData"
            @onBtnClick="[medicationStore.isDrawerOpen = true, isDialogVisible = true, selectedMedicine = null, medicationStore.getMedicineList()]">
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
                <!-- <VChip v-if="item.status == 'pending'">{{ item.status }}</VChip>
        <VChip v-if="item.status == 'complete'" color="success"> {{ $t('Approved') }}</VChip>
        <VChip v-if="item.status == 'Wait For Payment'" color="success"> {{ $t('Wait For Payment') }}</VChip>
        <VChip v-if="item.status == 'Sent To Pharmacy'" color="success"> {{ $t('Sent To Pharmacy') }}</VChip>
        <VChip v-if="item.status == 'Shipped'" color="success"> {{ $t('Shipped') }}</VChip> -->

            </template>
            <template #item.actions="{ item }">
                <IconBtn @click="editMed(item)">
                    <VIcon icon="tabler-edit" />
                </IconBtn>
                <IconBtn @click="viewPrescription(item)" v-if="item.status !== 'pending'">
                    <VIcon icon="tabler-eye" />
                </IconBtn>
                <!-- v-if="item.status == 'pending'" -->
                <VBtn size="small" @click="[isSignatureDialogVisible = true, prescriptionId = item.id]"
                    v-if="item.status === 'pending' || item.status === 'Reorder Pending'">{{ $t('Approve') }}</VBtn>
                <!-- <VBtn size="small" v-if="item.status == 'Shipped'" @click="history(item.id)">{{ $t('View History') }}</VBtn> -->
                <!-- <VBtn size="small" @click="history(item.id)" >{{
          $t('Update Status') }}</VBtn> -->
                <IconBtn @click="history(item.id)"
                    v-if="item.status !== 'pending' && item.status !== 'Reorder Pending'">
                    <VIcon icon="tabler-shopping-cart"></VIcon>
                </IconBtn>

            </template>
        </DataTable>

        <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content"
            :model-value="isDialogVisible" @update:model-value="handleDrawerModelValueUpdate">

            <AppDrawerHeaderSection :title="$t('Add Prescription')"
                @cancel="[isDialogVisible = !isDialogVisible, selectedMedicine = null, medicationStore.prescriptionId = null, reload(), medicationStore.unloadMedication()]" />
            <PerfectScrollbar :options="{ wheelPropagation: false }">
                <AddMedican :patient="props.patient" :medicine="selectedMedicine" @customEvent="closeNavigationDrawers"
                    v-if="medicationStore.isDrawerOpen" />
            </PerfectScrollbar>
        </VNavigationDrawer>


        <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content"
            :model-value="isEditDialogVisible" @update:model-value="handleDrawerModelValueUpdate">

            <AppDrawerHeaderSection :title="$t('Edit Prescription')"
                @cancel="[isEditDialogVisible = !isEditDialogVisible, selectedMedicine = null, medicationStore.prescriptionId = null, reload(), medicationStore.unloadMedication()]" />
            <AddMedican :patient="props.patient" :medicine="selectedMedicine" @customEvent="closeNavigationDrawers"
                v-if="medicationStore.isDrawerOpen && selectedMedicine" />

        </VNavigationDrawer>


        <VNavigationDrawer v-model="isPrescriptionDialogVisible" temporary :width="800" location="end"
            class="scrollable-content">
            <AppDrawerHeaderSection :title="$t('View Prescription')"
                @cancel="[isPrescriptionDialogVisible = !isPrescriptionDialogVisible, selectedMedicine = null, medicationStore.prescriptionId = null, reload()]" />
            <VDivider />
            <PerfectScrollbar :options="{ wheelPropagation: false }">
                <prescription :itemProps="itemProps" />
            </PerfectScrollbar>
        </VNavigationDrawer>


        <VDialog v-model="isSignatureDialogVisible" max-width="350">
            <DialogCloseBtn @click="[isSignatureDialogVisible = !isSignatureDialogVisible,
            medicationStore.needs_followup = null,
            medicationStore.numberOfDays = null,
            reload()]" />
            <VCard title="Signature">
                <VCardText>
                    <v-form ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit('image/jpeg')">
                        <!-- <VCardTitle>{{ $t('Signature') }}</VCardTitle> -->
                        <v-row>

                            <v-col cols="12">
                                <div class="tw-om-input-label"> {{ $t('Follow Up') }} </div>
                                <v-radio-group v-model="medicationStore.needs_followup" inline
                                    :rules="[requiredFieldValidator]">
                                    <v-radio :label="$t('Yes')" value="Yes" />
                                    <v-radio :label="$t('No')" value="No" />
                                </v-radio-group>
                            </v-col>
                            <v-col cols="12" v-if="medicationStore.needs_followup == 'Yes'">
                                <AppTextField v-model="medicationStore.numberOfDays" type="number"
                                    :label="$t('Number Of Days')" :placeholder="$t('Number Of Days')"
                                    @input="allowPositiveNumbers" :rules="[requiredValidator]" />
                            </v-col>
                            <VCol cols="12">
                                <!-- <v-textarea v-model="medicationStore.signatureNote" :label="$t('Note')" rows="4" :placeholder="$t('Note')"
                class="mb-3" /> -->
                                <Vue3Signature style="border: 1px solid silver; border-radius: 5px;" ref="signatureRef"
                                    :sigOption="state.option" :rules="[requiredValidator]" :w="'auto'" :h="'90px'"
                                    :disabled="state.disabled" class="example mb-3">
                                </Vue3Signature>

                                <VBtn @click="clear" variant="tonal" color="error" size="small">{{ $t('Clear') }}</VBtn>
                                <VBtn @click="onSubmit" size="small" class="ml-3"> {{ $t('Submit') }}</VBtn>
                            </VCol>
                        </v-row>
                    </v-form>
                </VCardText>
            </VCard>
        </VDialog>

        <VDialog v-model="isStatusUpdateDialogVisible" max-width="800">
            <DialogCloseBtn @click="[isStatusUpdateDialogVisible = !isStatusUpdateDialogVisible, reload()]" />
            <VCard>
                <VCardText>
                    <StatusOption :prescriptionId=prescriptionId v-if="prescriptionId"
                        @statusUpdate="[isStatusUpdateDialogVisible = false, reload()]" />
                </VCardText>
            </VCard>
        </VDialog>

    </section>

</template>
<style scope>
/* .v-table__wrapper {
    overflow: hidden !important;
} */

.backgroundColor {
    background-color: #e0f2ef;
}
</style>
