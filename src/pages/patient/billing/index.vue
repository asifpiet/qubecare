<script setup>
import { useMedicationStore } from '@/stores/medicationStore';
import { usePatientStore } from '@/stores/patientStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
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
        title: 'Invoice #',
        key: 'Invoice_number',
    },
    {
        title: 'Description',
        key: 'description',

    },
    {
        title: 'Amount',
        key: 'amount',

    },
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
    isCardDetaiDialogVisible.value = true;


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
        <DataTable ref="dataTable" :cardTitle="$t('Billings')" btnTitle="" :headers="headers"
            :api="PATIENT_BILLING + '/' + currentUser.id" :sortBy="sortByData"
            @onBtnClick="[medicationStore.isDrawerOpen = true, isDialogVisible = true, selectedMedicine = null]">
            <template #item.date="{ item }">
                <div class="text-body-1 text-high-emphasis text-capitalize">
                    {{ item.date }}
                </div>
            </template>
            <template #item.status="{ item }">
                <VChip v-if="item.status == 'Completed'" color="success" rounded="xl">
                    {{ $t('Approved') }}
                </VChip>
                <VChip v-else :color="getStatusColor(item.status)" rounded="xl">
                    {{ item.status }}
                </VChip>

            </template>
        </DataTable>
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
