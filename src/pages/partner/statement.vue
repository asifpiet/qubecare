<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Partner Statements View',
    },
})

import { useRouter } from 'vue-router';
import { generateMultipleStatementsPDF } from './statementGen';
import StatementTemplate from './StatementTemplate.vue';

const { currentUser } = useAuth()
const router = useRouter()
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);
const isUserAddDialogVisible = ref(false)
const isDialogVisible = ref(false)
const statementData = ref(null)
const headers = [
    { title: 'Balance', key: 'total_commission' },
    { title: 'Month/Year', key: 'date' },
    { title: 'Actions', key: 'actions', sortable: false, searchable: false },
]

const reload = () => dataTable.value.reload()
// Fetch users when the component mounts
onMounted(() => {
    reload()
})

const formatAmount = (amount) => {
    return Number(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

const viewStatement = async (item) => {
    console.log('item', item)
    isDialogVisible.value = true

    item.user_name = currentUser.value.fullName
    statementData.value = item
    // try {
    //     const pdfDoc = await generateMultipleStatementsPDF(item);
    //     // Open PDF in new window
    //     pdfDoc.open();

    //     // Or if you want to download instead:
    //     // pdfDoc.download(`statement-${item.user_id}.pdf`);
    // } catch (error) {
    //     console.error('Error generating PDF:', error);
    //     // Handle error appropriately
    // }
};

const downloadPdf = async () => {
    // const pdfDoc = await generateMultipleStatementsPDF(statementData.value);
    // pdfDoc.download(`statement-${statementData.value.id}.pdf`);
    generateMultipleStatementsPDF(statementData.value)
        .then(pdf => {
            pdf.download(); // Default filename
            // or pdf.download('custom-filename.pdf');
        })
        .catch(error => {
            console.error('PDF Generation Error:', error);
        });
};

const downloadStatement = async (item) => {
    item.user_name = currentUser.value.fullName
    try {
        const pdfDoc = await generateMultipleStatementsPDF(item);
        // Open PDF in new window
        // pdfDoc.open();

        // Or if you want to download instead:
        pdfDoc.download(`statement-${item.id}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        // Handle error appropriately
    }
};

// const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${month}-${year}`;
// };

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${year}`;
};

</script>



<template>

    <DataTable ref="dataTable" :cardTitle="$t('Statements')" btnTitle="" :headers="headers" :api="GET_PARTNER_STATEMENTS"
        :sortBy="sortByData">
        <template #item.total_commission="{ item }">
            <span>{{ `$${formatAmount(item.total_commission)}` }}</span>
        </template>

        <template #item.date="{ item }">
            <span>{{ formatDate(item.date) }}</span>
        </template>

        <template #item.actions="{ item }">
            <IconBtn @click="viewStatement(item)">
                <VIcon icon="tabler-pdf" />
            </IconBtn>

            <!-- <IconBtn @click="downloadStatement(item)">
                <VIcon icon="tabler-download" />
            </IconBtn> -->
        </template>

    </DataTable>
    <VDialog v-model="isDialogVisible" width="800">

        <!-- Dialog close btn -->
        <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

        <!-- Dialog Content -->
        <VCard>
            <VCardText>
                <StatementTemplate :data="statementData"></StatementTemplate>
            </VCardText>
        </VCard>
    </VDialog>
</template>
