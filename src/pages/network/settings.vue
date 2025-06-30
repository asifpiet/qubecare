<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Network Settings View',
    },
});

import {
    cardNumberValidator,
    cvvValidator,
    expiryValidator,
    requiredValidator
} from '@core/utils/validators';

import { useNetworkStore } from '@/stores/networkStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const { currentUser, currentRole, logout } = useAuth()
const networkStore = useNetworkStore()
const store = useStore();
const router = useRouter();
const userData = currentUser
// Form state
const formRef = ref(null);
const account_number = ref(null);
const routing_number = ref(null);
const ach = ref(null);
const address = ref(null);

onMounted(async () => {
    await networkStore.getPartnerAccountData(userData.value?.id)
    account_number.value = networkStore.partnerAccount.account_number;
});

// Submit handler
const handleSubmit = async () => {
    if (formRef.value?.validate()) {
        await saveAccountSetting()
    }
};

const saveAccountSetting = async () => {
    await partnerStore.savePartnerAccount(
        {
            partner_id: userData.value?.id,
            account_number: account_number.value,
            routing_number: routing_number.value,
            ach: ach.value,
            address: address.value,
        }
    )
};
// Validation rules
const required = (v) => !!v || 'Field is required';

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
</script>

<template>
    <v-container>
        <v-form ref="formRef">
            <v-row>
                <v-col cols="12" sm="12">
                    <h3>Card Information</h3>
                </v-col>
                <v-col cols="12" sm="12">
                    <VTextField v-model="cardNumber" label="Card Number"
                        :rules="[requiredValidator, cardNumberValidator]" placeholder="xxxxxxxxxxxxxxxx"
                        @input="cardNumberFormat" density="comfortable" />
                </v-col>

                <VCol cols="12" lg="6" md="6">
                    <VTextField v-model="expiry" label="Expiration Date" :rules="[requiredValidator, expiryValidator]"
                        placeholder="MM/YY" @input="formatExpiry" density="comfortable" />
                </VCol>
                <VCol cols="12" lg="6" md="6">
                    <VTextField v-model="cvv" :rules="[requiredValidator, cvvValidator]" label="CVV" maxlength="3"
                        @input="handleCVVInput" density="comfortable" />
                </VCol>


                <v-btn color="primary" class="mt-4" @click="handleSubmit">
                    Submit
                </v-btn>
            </v-row>
        </v-form>
    </v-container>
</template>
