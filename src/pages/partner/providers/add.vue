<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Partner Providers View',
    },
})
import {
    alphabeticValidator,
    emailValidator,
    requiredValidator,
    validUSAPhone
} from '@core/utils/validators';
import { useConfigStore } from '@core/stores/config';
import { usePartnerStore } from '@/stores/partnerStore';
import { useAuth } from '@/composables/useAuth'
import { addAlert, hideLoader, showLoader } from '@/utils/showLoader'
import { useRouter } from 'vue-router';

const { currentUser, currentRole, authService } = useAuth()
const partnerStore = usePartnerStore()
const store = useConfigStore()

store.skin = 'default'
const first_name = ref()
const last_name = ref()
const email = ref()
const username = ref()
const company_name = ref()
const textMessageNumber = ref('');
const router = useRouter()
const refVForm = ref()
const partner_commission = ref(null)
const accessRights = ref({
    admin: true,
    practitioner: false,
    patientPortal: false,
});

const errors = ref({
    name: undefined,
    email: undefined,
})
onMounted(async () => {
})
const formatPhoneNumber = (inputValue) => {
    const numericValue = inputValue.replace(/\D/g, '');
    if (numericValue.length <= 10) {
        return numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else {
        const truncatedValue = numericValue.slice(0, 10);
        return truncatedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
};
const updatePhone = (field, event) => {
    const formattedValue = formatPhoneNumber(event.target.value);
    if (field === 'phoneNumber') {
        textMessageNumber.value = formattedValue;
    } else {

    }
};
const submitForm = async () => {
    const { valid } = await refVForm.value.validate()
    console.log(valid)
    if (valid) {
        let dataForm = {
            firstName: first_name.value,
            lastName: last_name.value,
            emailAddress: email.value,
            textMessageNumber: textMessageNumber.value,
            accessRights: accessRights.value,
            username: username.value,
            company_name: company_name.value,
            partner_commission: partner_commission.value,
            partner_id: currentUser.value.id,
        }
        showLoader()
        try {
            await partnerStore.registerProvider(dataForm)
            addAlert("Registered Successfully", 'success')
            router.push({ name: 'partner-providers' })
        } catch (e) {
            console.error('Error Response:', e.response);

            if (e.response?.status === 422) {
                const errorMessages = e.response?._data?.error;
                if (errorMessages) {
                    const formattedMessages = Object.values(errorMessages)
                        .flat()
                        .join(' ');
                    addAlert(formattedMessages, 'error');
                } else {
                    addAlert('Something went wrong', 'error');
                }
            } else if (e.response?.status === 409) {
                addAlert(e.response?._data?.data, 'error');
            } else if (e.response?.status === 500) {
                // Handle 500 errors with the specific structure you provided
                if (e.response?._data?.error) {
                    addAlert(e.response?._data?.error, 'error');
                } else {
                    addAlert(e.response?._data?.message || 'Server error occurred', 'error');
                }
            } else {
                addAlert(e.response?._data?.message ?? e.message, 'error');
            }
        }
        hideLoader()



    } else {
        console.error('Form is invalid');
    }
};
</script>

<template>
    <VCard :title="$t('Create Provider')"
        :subtitle="$t('Please fill out the information below to create a provider account')">
        <VDivider />
        <VCardText>
            <VForm ref="refVForm" @submit.prevent="">
                <VRow>

                    <VCol cols="12" md="6">
                        <AppTextField class="field-required" v-model="first_name" :label="$t('First Name')" type="name"
                            :rules="[requiredValidator,alphabeticValidator]" :error-messages="errors.first_name" density="comfortable" />
                    </VCol>
                    <VCol cols="12" md="6">
                        <AppTextField class="field-required" v-model="last_name" :label="$t('Last Name')" type="name"
                            :rules="[requiredValidator,alphabeticValidator]" :error-messages="errors.last_name" density="comfortable" />
                    </VCol>
                    <VCol cols="12" md="6">
                        <AppTextField class="field-required" v-model="email" :label="$t('Email')" type="email"
                            :rules="[requiredValidator, emailValidator]" :error-messages="errors.email"
                            density="comfortable" />
                    </VCol>
                    <VCol cols="12" md="6">
                        <AppTextField class="field-required" v-model="textMessageNumber"
                            pattern="^\(\d{3}\) \d{3}-\d{4}$" :rules="[requiredValidator, validUSAPhone]"
                            :label="$t('Text Message Number')" hint="For Password Reset" max="14"
                            @input="(e) => updatePhone('phoneNumber', e)" placeholder="i.e. (000) 000-0000" />


                    </VCol>
                    <VCol cols="12" md="6">
                        <AppTextField class="field-required" v-model="company_name" :label="$t('Company Name')"
                            type="text" :rules="[requiredName]" :error-messages="errors.company_name"
                            density="comfortable" />
                    </VCol>
                    <VCol cols="12" md="6">
                        <AppTextField class="field-required" v-model="username" :label="$t('Username')"
                            :rules="[requiredValidator]" :placeholder="$t('Username')" />
                    </VCol>
                    <VCol cols="12" md="6">
                        <AppTextField class="field-required" v-model="partner_commission" :label="$t('Commission in Percentage')"
                            type="number" min="0" :rules="[requiredValidator]" placeholder="e.g 1.00" />
                    </VCol>
                    <VCol cols="12">
                        <div class="d-flex justify-end mt-8">
                            <VBtn color="success" type="button" @click="submitForm">
                                {{ $t('Register') }}
                            </VBtn>
                        </div>
                    </VCol>
                </VRow>

            </VForm>
        </VCardText>
    </VCard>
</template>
<style scoped>
:deep(.field-required)>label:after {
    content: '*';
    color: rgb(var(--v-theme-error));

}
</style>

<style lang="scss">
.checkout-card {
    margin-block: 3.5rem 5.25rem;
}

@media (max-width: 960px) and (min-width: 600px) {
    .checkout-page {
        .v-container {
            padding-inline: 2rem !important;
        }
    }
}

@media (max-width: 600px) {
    .checkout-card {
        margin-block-start: 6rem;
    }
}
</style>
