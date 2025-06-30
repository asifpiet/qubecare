<script setup>
import CreateAppointment from '@/pages/patient/appointment/newAppointment.vue';
import PatientStatusOption from '@/pages/patient/prescriptions/patientStatusOption.vue';
import { useMedicationStore } from '@/stores/medicationStore';
import { usePatientStore } from '@/stores/patientStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import prescription from '@/views/provider/patients/MedSupplement/prescription.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { VBtn } from 'vuetify/components/VBtn';
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
const isCardDetaiDialogVisible = ref(false)
const statusValue = ref()
const isHideSubjectiveEntries = ref()
const isPrescriptionDialogVisible = ref(false)
const isHideDeactivatedMeds = ref(false)
const presherbsrc = ref(null)
const sourceFilters = ref(null)
const isCreareAppointmentDialogVisible = ref(false);
const selectedMedicine = ref();
const sortByData = ref([{ 'key': 'provider_name', 'order': 'desc' }])
const dataTable = ref(null);
const signatureRef = ref(null)
const signature = ref(null)
const paymentForm = ref()
const cardNumber = ref('')
const expiry = ref('')
const cvv = ref('')
const prescription_id = ref(null)
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

const onSubmit = async (t) => {
    refForm.value?.validate().then(async ({ valid }) => {
        if (valid) {
            signature.value = signatureRef.value.save(t)
            medicationStore.signature = signatureRef.value.save(t);
            console.log("signatureRef", signatureRef.value.save(t))
            let res = await medicationStore.updatePrescriptionStaus(prescriptionId.value)
            console.log("res", res);
            isSignatureDialogVisible.value = false;
            reload();

        }
    });
}

const history = async (id) => {
    medicationStore.status = null;
    medicationStore.signatureNote = null;
    medicationStore.tracking_number = null;
    let res = await medicationStore.getPatientStatusHisotry(id);
    console.log("res", res);
    prescriptionId.value = id;
    isStatusUpdateDialogVisible.value = true;


}

const refill = async (id) => {
    prescription_id.value = id;
    let resp = await medicationStore.refillPrescriptionRequest(prescription_id.value);
    if (resp && resp.message == 'Something went wrong while refilling the prescription.') {
        isCardDetaiDialogVisible.value = true;
    } else {
        prescription_id.value = null;
        isCreareAppointmentDialogVisible.value = true;
    }
    // addAlert(resp, 'error');



}


const cardNumberFormat = () => {
    cardNumber.value = cardNumber.value.replace(/\D/g, '').substring(0, 16);

};
const formatExpiry = () => {
    // Automatically format the input to MM/YY format
    expiry.value = expiry.value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d{2})/, '$1/$2');
};
const handleCVVInput = () => {
    // Remove non-digit characters from input
    cvv.value = cvv.value.replace(/\D/g, '');
};

watch(() => medicationStore.isReorderComplete, (val) => {
    if (!val) {
        isCreareAppointmentDialogVisible.value = true;
    }
})


const onSubmitCard = async () => {
    const { valid: isValid } = await paymentForm.value?.validate();
    console.log('isValid ', isValid);
    let [month, year] = expiry.value.split("/");
    if (isValid) {
        let data = {
            card_number: cardNumber.value,
            cvv: cvv.value,
            expiration_month: month,
            expiration_year: year
        }
        console.log("prescription_id", prescription_id.value, data);
        let res = await medicationStore.refillPrescriptionRequest(prescription_id.value, data);
        isCardDetaiDialogVisible.value = false;
        reload();
        prescription_id.value = null;
        isCreareAppointmentDialogVisible.value = true;
    }
};
</script>

<template>
    <section>
        <VDivider />
        <DataTable ref="dataTable" :cardTitle="$t('Prescriptions')" btnTitle="" :headers="headers"
            :api="PATIENT_PRESCRIPTION_LIST + '/' + currentUser.id" :sortBy="sortByData"
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
            <template #item.actions="{ item }">
                <!-- <IconBtn @click="editMed(item)">
                    <VIcon icon="tabler-edit" />
                </IconBtn> -->
                <VBtn icon variant="text" color="medium-emphasis" @click="viewPrescription(item)">
                    <VIcon icon="tabler-eye" location="top" />
                    <VTooltip location="top" transition="scale-transition" activator="parent">
                        <span>{{ $t('Prescription') }}</span>
                    </VTooltip>
                </VBtn>

                <VBtn icon variant="text" color="medium-emphasis" @click="history(item.id)">
                    <VIcon icon="tabler-shopping-cart" location="top" />
                    <VTooltip location="top" transition="scale-transition" activator="parent">
                        <span>{{ $t('Tracking') }}</span>
                    </VTooltip>
                </VBtn>

                <VBtn icon variant="text" color="medium-emphasis" @click="refill(item.id)"
                    v-if="item.status == 'Shipped'">
                    <VIcon icon="tabler-repeat" location="top" />
                    <VTooltip location="top" transition="scale-transition" activator="parent">
                        <span>{{ $t('Reorder') }}</span>
                    </VTooltip>
                </VBtn>

                <!-- <VBtn icon variant="text" color="medium-emphasis" @click="isCreareAppointmentDialogVisible = true"
                    v-if="item.status == 'Reorder Pending'">
                    <VIcon icon="tabler-calendar" location="top" />
                    <VTooltip location="top" transition="scale-transition" activator="parent">
                        <span>{{ $t('Schedule Appointment') }}</span>
                    </VTooltip>
                </VBtn> -->




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

    <VDialog v-model="isCardDetaiDialogVisible" max-width="500">
        <DialogCloseBtn @click="[isCardDetaiDialogVisible = !isCardDetaiDialogVisible, reload()]" />

        <VCard>
            <VCardText>
                <VForm ref="paymentForm">
                    <div>
                        <h3 class="mb-0  custom-color custom-heading">
                            {{ $t('Secure Payment Information') }} &nbsp;
                            <!-- <VIcon>tabler-credit-card</VIcon> -->
                        </h3>
                        <small>{{ $t('Please provide your card details for payment.') }}</small>
                    </div>
                    <VRow>
                        <VCol cols="12" lg="12" md="12">
                            <label>{{ $t('Card Number') }}</label>
                            <VTextField v-model="cardNumber" label="" :rules="[requiredValidator, cardNumberValidator]"
                                placeholder="xxxx xxxx xxxx xxxx" @input="cardNumberFormat" density="comfortable" />
                        </VCol>
                        <VCol cols="12" lg="6" md="6">
                            <label>{{ $t('Expiration Date') }}</label>
                            <VTextField v-model="expiry" label="" :rules="[requiredValidator, expiryValidator]"
                                placeholder="MM/YY" @input="formatExpiry" density="comfortable" />
                        </VCol>
                        <VCol cols="12" lg="6" md="6">
                            <label>{{ $t('CVV') }}</label>
                            <VTextField v-model="cvv" :rules="[requiredValidator, cvvValidator]" placeholder="xxx"
                                label="" maxlength="3" @input="handleCVVInput" density="comfortable" />
                        </VCol>
                        <VCol cols="12">
                            <VBtn @click="onSubmitCard()"> Submit</VBtn>
                        </VCol>
                    </VRow>
                </VForm>
            </VCardText>
        </VCard>

    </VDialog>

    <!-- <VDialog v-model="isSignatureDialogVisible" max-width="350">
        <DialogCloseBtn @click="[isSignatureDialogVisible = !isSignatureDialogVisible, reload()]" />
        <VCard>
            <VCardText>
                <v-form ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit('image/jpeg')">
                    <VCardTitle>Signature</VCardTitle>
                    <v-row>

                        <VCol cols="12">
                            <Vue3Signature style="border: 1px solid silver; border-radius: 5px;" ref="signatureRef"
                                :sigOption="state.option" :rules="[requiredValidator]" :w="'auto'" :h="'90px'"
                                :disabled="state.disabled" class="example mb-3">
                            </Vue3Signature>
                            <VBtn @click="clear" variant="tonal" color="error" size="small">Clear</VBtn>
                            <VBtn @click="onSubmit" size="small" class="ml-3">Submit</VBtn>
                        </VCol>
                    </v-row>
                </v-form>
            </VCardText>
        </VCard>
    </VDialog> -->

    <VNavigationDrawer v-model="isCreareAppointmentDialogVisible" temporary :width="800" location="end"
        class="scrollable-content" style="z-index: 1009 !important;" persistent>
        <!-- @cancel="[isCreareAppointmentDialogVisible = !isCreareAppointmentDialogVisible]" -->
        <AppDrawerHeaderSection title="Schedule Your Appointment" />
        <VDivider />
        <PerfectScrollbar :options="{ wheelPropagation: false }">
            <CreateAppointment v-if="isCreareAppointmentDialogVisible" />
        </PerfectScrollbar>
    </VNavigationDrawer>



</template>
<style scope>
/* .v-table__wrapper {
    overflow: hidden !important;
} */

.backgroundColor {
    background-color: #e0f2ef;
}
</style>
