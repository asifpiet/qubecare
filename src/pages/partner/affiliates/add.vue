<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Partner Affiliates View',
    },
})
import { useAuth } from '@/composables/useAuth';
import { usePartnerStore } from '@/stores/partnerStore';
import { addAlert } from '@/utils/showLoader';
import { useConfigStore } from '@core/stores/config';
import {
    emailValidator,
    requiredValidator,
    validUSAPhone
} from '@core/utils/validators';
import { useRouter } from 'vue-router';
import { VDateInput } from 'vuetify/lib/labs/components.mjs';

const router = useRouter()
const { currentUser, currentRole, authService } = useAuth()


const partnerStore = usePartnerStore()
const store = useConfigStore()

store.skin = 'default'
const email = ref()
const refVForm = ref()
const name = ref()
const last_name = ref()
const dob = ref()
const phone = ref()
const gender = ref(null)
const genders = ref([
    { name: 'Male', abbreviation: 'Male' },
    { name: 'Female', abbreviation: 'Female' },
    { name: 'Other', abbreviation: 'Other' },
]);

const errors = ref({
    name: undefined,
    last_name: undefined,
    phone_no: undefined,
    email: undefined,
    password: undefined,
    dob: undefined,
})
onMounted(async () => {
})

const onSubmit = async () => {
    refVForm.value?.validate().then(async ({ valid: isValid }) => {
        console.log('isValid ', isValid)
        if (isValid) {
            console.log('Age', calculateAge(dob.value))
            if (calculateAge(dob.value) >= 18) {
                await register()
                console.log('form submitted ', errors.value)
            } else {
                addAlert('You must be 18+', 'error')
            }

        }

    })
};

const getCurrentDate = () => {
    const today = new Date();
    console.log("today", today);
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    return `${month}-${day}-${year}`;
};
const register = async () => {
    const parts = String(dob.value).split(" ");
    const monthMap = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12"
    };

    // Extract the year, month, and day, and map the month to a number
    const year = parts[3];
    const month = monthMap[parts[1]];
    const day = parts[2].padStart(2, '0');  // Ensure day is two digits

    // Combine into desired format
    const formattedDate = `${year}-${month}-${day}`;
    console.log("Gender", gender.value, dob.value);

    let dataForm = {
        first_name: name.value,
        last_name: last_name.value,
        phone_no: phone.value,
        email: email.value,
        dob: formattedDate,
        gender: gender.value.toLowerCase(),
        partner_id: currentUser.value.id,
        partner_email: currentUser.value.email,
    }

    showLoader()
    try {
        await partnerStore.registerAffiliate(dataForm)
        addAlert("Registered Successfully", 'success')
        router.push({ name: 'partner-affiliates' })
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
        } else {
            addAlert(e.response?.data?.message ?? e.message, 'error');
        }
    }
    hideLoader()


};

const formatPhoneNumber = () => {
    // Remove non-numeric characters from the input
    const numericValue = phone.value.replace(/\D/g, '');

    // Apply formatting logic
    if (numericValue.length <= 10) {
        phone.value = numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else {
        // Limit the input to a maximum of 14 characters
        const truncatedValue = numericValue.slice(0, 10);
        phone.value = truncatedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
};
const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
};
</script>

<template>
    <VCard :title="$t('Create Affiliate')"
        :subtitle="$t('Please fill out the information below to create an affiliate account')">
        <VDivider />
        <VCardText>
            <VForm ref="refVForm" @submit.prevent="onSubmit">
                <VRow>
                    <VCol cols="12" md="6">
                        <VTextField v-model="name" :label="$t('First Name')" type="text" :rules="[requiredValidator]"
                            :error-messages="errors.name" density="comfortable" />
                    </VCol>
                    <VCol cols="12" md="6">
                        <VTextField v-model="last_name" :label="$t('Last Name')" type="text"
                            :rules="[requiredValidator]" :error-messages="errors.last_name" density="comfortable" />
                    </VCol>
                    <VCol cols="12" md="6">
                        <VTextField v-model="email" :label="$t('Email Address')" type="email"
                            :rules="[requiredValidator, emailValidator]" :error-messages="errors.email"
                            density="comfortable" />
                    </VCol>
                    <VCol cols="12" md="6">
                        <v-select v-model="gender" :label="$t('Gender')" :items="genders" item-title="name"
                            item-value="abbreviation" :rules="[requiredValidator]" :error-messages="errors.gender"
                            density="comfortable">
                        </v-select>
                    </VCol>
                    <VCol cols="12" md="6">
                        <VTextField v-model="phone" :label="$t('Phone Number')" pattern="^\(\d{3}\) \d{3}-\d{4}$"
                            :rules="[requiredValidator, validUSAPhone]" :error-messages="errors.phone_no"
                            placeholder="i.e. (000) 000-0000" @input="formatPhoneNumber" max="14"
                            density="comfortable" />
                    </VCol>
                    <VCol cols="12" md="6">
                        <v-date-input v-model="dob" :max="getCurrentDate()" :rules="[requiredValidator]"
                            :error-messages="errors.dob" :label="$t('Date of Birth')" :placeholder="$t('Date of Birth')"
                            prepend-icon="" variant="outlined" density="comfortable" ok-text="OK"
                            cancel-text="Cancel"></v-date-input>
                    </VCol>

                </VRow>
                <VRow>
                    <VCol cols="12">
                        <div class="d-flex justify-end mt-8">
                            <VBtn color="success" type="submit">
                                {{ $t('Register') }}
                            </VBtn>
                        </div>
                    </VCol>
                </VRow>

            </VForm>
        </VCardText>
    </VCard>
</template>

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
