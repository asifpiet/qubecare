<script setup>
import html2pdf from 'html2pdf.js';
import { ref } from 'vue';
// Define props
const props = defineProps({
    data: {
        type: Object,
        required: true
    }
});

// Expose template ref to parent component
const pdfContent = ref(null);
defineExpose({ pdfContent });
console.log(props.data);

const downloadPDF = () => {
    const element = pdfContent.value;
    const opt = {
        margin: 10,
        filename: 'commission-summary.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
};
// Helper methods
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
};

const formatAmount = (amount) => {
    return Number(amount).toFixed(2);
};

const numberToWords = (number) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return formatter.format(number).toUpperCase() + ' DOLLARS';
};
</script>
<template>
    <div ref="pdfContent" class="pdf-container" style="">
        <!-- Main Header Section -->
        <div class="main-header">{{ $t('Commission Statements Summary') }}</div>
        <div class="period-date">{{ $t('Period:') }} {{ formatDate(props.data.date) }}</div>
        <div class="total-amount">{{ $t('Total Commission:') }} ${{ formatAmount(props.data.total_commission) }}</div>

        <!-- Each Statement Section -->
        <div v-for="(statement, index) in props.data.statements" :key="statement.id" class="statement"
            :class="{ 'page-break': index > 0 }">
            <div class="statement-header">{{ $t('Statement #') }} {{ statement.id }}</div>
            <div class="statement-date">{{ $t('Statement Date:') }}  {{ formatDate(statement.statement_date) }}</div>
            <br>
            <div class="section-header">{{ $t('Statement Details') }}  </div>
            <table class="statement-table">
                <thead>
                    <tr>
                        <th>{{ $t('Product ID') }}</th>
                        <th>{{ $t('Product') }}</th>
                        <th>{{ $t('Provider') }}</th>
                        <th>{{ $t('Amount') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in statement.statement_items" :key="item.product_id">
                        <td>{{ item.product_id }}</td>
                        <td>{{ item.product_name }}</td>
                        <td>{{ item.provider_name }}</td>
                        <td>${{ formatAmount(item.commission_amount) }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="statement-total">{{ $t('Statement Total:') }} ${{ formatAmount(statement.total_commission) }}</div>
            <br>


        </div>
        <!-- Check Section -->
        <div class="check-box">
            <div class="check-header">
                <div class="bank-info">
                    <div class="bank-name">{{ $t('Bank of America') }}</div>
                    <div class="bank-address">{{ $t('123 Banking Street') }}</div>
                    <div class="bank-address">{{ $t('Everett, MA 02549') }}</div>
                </div>
                <div class="check-details">
                    <div class="check-number">{{ $t('CHECK NO.1') }}</div>
                    <div class="check-date">{{ $t('DATE:') }} {{ formatDate(props.data.date) }}</div>
                </div>
            </div>
            <div class="pay-section">
                <div class="pay-to">{{ $t('PAY TO THE ORDER OF') }} {{ props.data.user_name || 'JOHN DOE' }}</div>
                <div class="pay-amount">${{ formatAmount(props.data.total_commission) }}</div>
            </div>
            <div class="amount-in-words">{{ numberToWords(props.data.total_commission) }}</div>
            <div class="check-footer">
                <div class="memo">{{ $t('MEMO: Commission Payment') }}  </div>
                <div class="signature">{{ $t('AUTHORIZED SIGNATURE') }} </div>
            </div>
            <div class="routing-number">:123456789: 987654321</div>
        </div>
    </div>
    <div class="text-center">
        <VBtn @click="downloadPDF" size="x-small">{{ $t('Download PDF') }} </VBtn>
    </div>
</template>



<style scoped>
.pdf-container {
    font-family: 'Roboto', sans-serif;
    padding: 20px;
    background-color: white;
}

.main-header {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
}

.period-date {
    font-size: 14px;
    text-align: center;
    margin-bottom: 5px;
}

.total-amount {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 30px;
}

.statement {
    margin-bottom: 30px;
}

.page-break {
    page-break-before: always;
}

.statement-header {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
}

.statement-date {
    font-size: 12px;
    margin-bottom: 5px;
}

.section-header {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
}

.statement-table {
    width: 100%;
    border-collapse: collapse;
    margin: 5px 0 15px 0;
}

.statement-table th {
    background-color: #f0f0f0;
    font-weight: bold;
    font-size: 12px;
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
}

.statement-table td {
    padding: 8px;
    border: 1px solid #ddd;
}

.statement-total {
    font-size: 14px;
    font-weight: bold;
    text-align: right;
}

.check-box {
    border: 1px solid #000;
    padding: 20px;
    margin-top: 20px;
}

.check-header {
    display: flex;
    justify-content: space-between;
}

.bank-info {
    width: 60%;
}

.bank-name {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
}

.bank-address {
    font-size: 10px;
    color: grey;
}

.check-details {
    width: 40%;
    text-align: right;
}

.check-number {
    font-size: 12px;
    font-weight: bold;
}

.check-date {
    font-size: 12px;
}

.pay-section {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.pay-to {
    width: 85%;
    font-size: 14px;
    border-bottom: 1px solid silver;
    padding-bottom: 5px;
}

.pay-amount {
    width: 15%;
    font-size: 14px;
    font-weight: bold;
    text-align: right;
    margin-left: 5px;
    padding: 5px;
    background: #f0f0f0;
    text-align: center;
}

.amount-in-words {
    font-size: 12px;
    font-style: italic;
    margin: 10px 0;
}

.check-footer {
    display: flex;
    justify-content: space-between;
}

.memo {
    font-size: 10px;
    color: grey;
}

.signature {
    font-size: 10px;
    text-decoration: underline;
    text-align: right;
}

.routing-number {
    font-size: 12px;
    text-align: center;
    margin-top: 20px;
}
</style>
