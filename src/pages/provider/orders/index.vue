<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Order View',
    },
})
import { usePatientStore } from '@/stores/patientStore';
import cart from '@/views/provider/components/cart.vue';

const patientStore = usePatientStore()
const sortByData = ref([{ 'key': 'order_id', 'order': 'desc' }])
const dataTable = ref(null);
const selectedProduct = ref(null)
const showOrderModal = ref(false);
const selectedOrder = ref(null);

const emit = defineEmits([
    'saveProductData'
]);

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
        title: 'Shipping Address',
        key: 'shipping_address1',
        width: '250px',
    },
    {
        title: 'Total Amount',
        key: 'total_amount',
    },
    {
        title: 'Actions',
        key: 'actions',
        sortable: false,
        align: 'center',
    },
]

const reload = () => dataTable.value.reload()

onMounted(async () => {
    reload()
})

const capitalize = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Helper function to format full address
const formatFullAddress = (item) => {
    let address = item.shipping_address1 || '';

    if (item.shipping_address2) {
        address += `, ${item.shipping_address2}`;
    }

    if (item.shipping_city && item.shipping_state && item.shipping_zipcode) {
        address += `<br>${item.shipping_city}, ${item.shipping_state} ${item.shipping_zipcode}`;
    }

    if (item.shipping_country) {
        address += `<br>${item.shipping_country}`;
    }

    return address;
}

// Open modal and set selected order
const viewOrderDetails = (order) => {
    selectedOrder.value = order;
    showOrderModal.value = true;
    console.log('order.items', order.items)
    patientStore.appointment_order.provider_id = order.provider_id
    patientStore.appointment_order.order_id = order.order_id
    patientStore.appointment_order.builder_id = order.builder_id
    patientStore.appointment_order.items = order.items
    patientStore.appointment_order.discounted_amount = order.discounted_amount
    patientStore.appointment_order.promo_code = order.promo_code
}

// Close the modal
const closeModal = () => {
    showOrderModal.value = false;
}
</script>

<template>
    <section>
        <DataTable ref="dataTable" :cardTitle="$t('Orders')" btnTitle="" :headers="headers"
            :api="GET_APPOINTMENT_ORDERS" :sortBy="sortByData">
            <template #item.patient_name="{ item }">
                <div class="d-flex align-center gap-x-4">
                    <span class="cursor-pointer text-primary">{{
                        item.patient_name || 'No name provided' }} </span>
                </div>
            </template>
            <template #item.shipping_address1="{ item }">
                <div v-html="formatFullAddress(item)" class="address-cell"></div>
            </template>
            <template #item.total_amount="{ item }">
                <div class="d-flex align-center gap-x-4">
                    <span>${{ item.total_amount }} </span>
                </div>
            </template>
            <template #item.actions="{ item }">
                <v-btn size="small" color="primary" variant="outlined" @click="viewOrderDetails(item)">
                    {{ $t('View') }}
                </v-btn>
            </template>
        </DataTable>

        <!-- Order Details Modal -->
        <v-dialog v-model="showOrderModal" max-width="600px">
            <v-card v-if="selectedOrder">
                <v-card-title class="text-h5 pa-4">
                    {{ $t('Order ID:') }} {{ selectedOrder.order_id }}
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="3">
                            <p class="font-weight-bold mb-1"> {{ $t('Patient ID') }}: </p>
                            <p>{{ selectedOrder.patient_id }}</p>
                        </v-col>
                        <v-col cols="12" sm="9">
                            <p class="font-weight-bold mb-1">{{ $t('Patient Name') }}: </p>
                            <p>{{ selectedOrder.patient_name || 'No name provided' }}</p>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="9">
                            <p class="font-weight-bold mb-1">{{ $t('Shipping Address') }}: </p>
                            <p v-html="formatFullAddress(selectedOrder)"></p>
                        </v-col>
                        <v-col cols="3" v-if=patientStore.appointment_order.promo_code>
                            <p class="font-weight-bold mb-1">{{ $t('Promo Code') }}: </p>
                            <p v-html="patientStore.appointment_order.promo_code"></p>
                        </v-col>
                    </v-row>

                    <v-divider class="my-3"></v-divider>

                    <cart :hideTotals="false"></cart>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="text" @click="closeModal">{{ $t('Close') }} </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </section>
</template>

<style scoped>
::v-deep .v-data-table .v-data-table__wrapper::-webkit-scrollbar {
    width: 10px;
}

.address-cell {
    max-width: 250px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    white-space: normal;
    line-height: 1.4;
}
</style>
