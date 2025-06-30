<script setup>
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})
import { patientAuthService } from '@/services/auth/patientAuthService';
import { useBuilderStore } from '@/stores/builderStore';
import { usePatientRegStore } from '@/stores/patientRegStore';
import { addAlert } from '@/utils/showLoader';
import NavBarI18n from '@core/components/I18n.vue';
import {
    emailValidator,
    requiredValidator,
    validUSAPhone
} from '@core/utils/validators';
import { themeConfig } from '@themeConfig';

const termsConditionUrl = import.meta.env.VITE_TERMS_AND_CONDITION_URL ?? 'https://peptidewebmd.com/terms-and-conditions/';
const privacyPolicyUrl = import.meta.env.VITE_PRIVACY_POLICY_URL ?? 'https://peptidewebmd.com/privacy-policy/';
const emit = defineEmits(['completed']);
const builderStore = useBuilderStore()
const patientRegStore = usePatientRegStore()
const isMobile = ref(window.innerWidth <= 768);
const refVForm = ref()
const isPasswordVisible = ref(false)
const dob = ref(null)
const disableSubmit = ref(false)
const errors = ref({
    name: undefined,
    last_name: undefined,
    phone: undefined,
    email: undefined,
    password: undefined,
    dob: undefined,
    address: undefined,
    city: undefined,
    state: undefined,
    zipcode: undefined,
    country: undefined,
    termAndCondtiton: undefined,
    receviceSMs: undefined,
    isPolicy: undefined,
})
const genders = ref([
    { name: 'Male', abbreviation: 'Male' },
    { name: 'Female', abbreviation: 'Female' },
    { name: 'Other', abbreviation: 'Other' },
]);

const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};
const onSubmit = async () => {
    refVForm.value?.validate().then(async ({ valid: isValid }) => {
        console.log('isValid ', isValid)
        if (isValid) {
            if (calculateAge(dob.value) >= 18) {
                register()

            } else {
                addAlert('You must be 18+', 'error')
            }

        }

    })
}

const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    return `${month}-${day}-${year}`;
};
const register = async () => {
    if (dob.value) {
        const dateParts = dob.value.split("/");
        if (dateParts.length === 3) {
            const [month, day, year] = dateParts; // Ensure it splits into 3 parts
            const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
            patientRegStore.patient.dob = formattedDate;
        } else {
            console.error("Invalid date format for dob:", patientRegStore.patient.dob);
        }
    } else {
        console.error("dob is not defined or invalid");
    }

    patientRegStore.patient.provider_id = builderStore.provider_id

    showLoader()
    disableSubmit.value = true
    try {
        await patientAuthService.register(patientRegStore.patient)
        patientRegStore.forms = []
        emit('completed')
    } catch (e) {

    }
    disableSubmit.value = false
    hideLoader()
}

const formatPhoneNumber = () => {
    const numericValue = patientRegStore.patient.phone_no.replace(/\D/g, '');
    if (numericValue.length <= 10) {
        patientRegStore.patient.phone_no = numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else {
        const truncatedValue = numericValue.slice(0, 10);
        patientRegStore.patient.phone_no = truncatedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
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

const changeEmailSignUp = () => {
    patientRegStore.currentState = 'checklogin'
};

const now = new Date()
const currentMonth = now.toLocaleString('default', { month: '2-digit' })
const currentYear = now.getFullYear()
</script>

<template>
      <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
      :languages="themeConfig.app.i18n.langConfig" class="language" />
    <VCardItem class="py-0 pz-0 px-0">
        <!-- <h5 class="text-h5 mb-1 text-left">
            Welcome! Need Our MD?
        </h5>
        <p>You'll need an account. Let get you setup!
        </p> -->
        <div class="text-center mb-6">
            <small><b>{{ $t(`You’ll need an account, let’s get you setup`)}}</b></small>
        </div>
        <VRow>
            <VCol cols="12" md="12">
                <div class="float-right mb-1">
                    <small><span style="color: #b1c3d5;">{{ $t('This is not your email?')}} </span><span><a class=" cursor-pointer"
                                @click="changeEmailSignUp()">{{ $t('(Change)') }}</a></span></small>
                </div>

            </VCol>
        </VRow>
    </VCardItem>
    <VForm ref="refVForm" @submit.prevent="onSubmit">
        <VRow>
            <VCol cols="12" md="12">
                <VTextField v-model="patientRegStore.patient.email" :label="$t('Email Address')" type="email"
                    :rules="[requiredValidator, emailValidator]" :error-messages="errors.email" density="comfortable"
                    readonly prepend-inner-icon="tabler-mail" />
            </VCol>
            <VCol cols="12" md="6">
                <VTextField v-model="patientRegStore.patient.first_name" :label="$t('First Name')" type="text"
                    :rules="[requiredValidator]" :error-messages="errors.name" density="comfortable"
                    prepend-inner-icon="tabler-user-square-rounded" />
            </VCol>
            <VCol cols="12" md="6">
                <VTextField v-model="patientRegStore.patient.last_name" :label="$t('Last Name')" type="text"
                    :rules="[requiredValidator]" :error-messages="errors.last_name" density="comfortable"
                    prepend-inner-icon="tabler-user-square-rounded" />
            </VCol>
        </VRow>
        <VRow>
            <VCol cols="12" md="12">
                <VTextField v-model="patientRegStore.patient.phone_no" :label="$t('Phone Number')"
                    pattern="^\(\d{3}\) \d{3}-\d{4}$" :rules="[requiredValidator, validUSAPhone]"
                    :error-messages="errors.phone" placeholder="i.e. (000) 000-0000" @input="formatPhoneNumber" max="14"
                    density="comfortable" prepend-inner-icon="tabler-phone" />
            </VCol>
            <VCol cols="12" md="6">
                <v-select v-model="patientRegStore.patient.gender" :label="$t('Gender')" :items="genders" item-title="name"
                    item-value="abbreviation" :rules="[requiredValidator]" :error-messages="errors.gender"
                    density="comfortable" prepend-inner-icon="tabler-gender-genderfluid">
                </v-select>
            </VCol>
            <VCol cols="12" md="6">
                <!-- <v-date-input v-model="patientRegStore.patient.dob" :max="getCurrentDate()" :rules="[requiredValidator]"
                    :error-messages="errors.dob" label="Date of Birth" placeholder="Date of Birth" prepend-icon=""
                    variant="outlined" density="comfortable" ok-text="OK" cancel-text="Cancel"></v-date-input> -->
                <AppDateTimePicker v-model="dob" :placeholder="$t('Date of Birth')" :error-messages="errors.dob"
                    :max="getCurrentDate()" :rules="[requiredValidator]" variant="outlined" density="comfortable"
                    :config="{ dateFormat: 'm/d/Y', disable: [{ from: `${currentYear}-${currentMonth}-20`, to: `${currentYear}-${currentMonth}-35` }] }"
                    prepend-inner-icon="tabler-calendar" />
            </VCol>
            <VCol cols="12">
                <VTextField v-model="patientRegStore.patient.password" :label="$t('Password')" placeholder="············"
                    :rules="[requiredValidator]" :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible" prepend-inner-icon="tabler-lock" />
            </VCol>
        </VRow>

        <VRow>
            <VCol cols="v-col" class="pb-0">
                <div class="d-flex align-items-center">
                    <div>
                        <VCheckbox v-model="patientRegStore.patient.termAndCondtiton"
                            :error-messages="errors.termAndCondtiton">
                        </VCheckbox>
                    </div>
                    <div style="margin-top: 6px;">
                        <span class="text-muted">
                           {{ $t('I agree to the')}}  <a :href="termsConditionUrl" target="_blank" style="color: #49A38C;">{{ $t(`Terms &
                                Conditions`)}}
                           </a>{{ $t('and') }}  <a :href="privacyPolicyUrl" target="_blank"
                                style="color: #49A38C;">{{ $t('Privacy Policy')}}</a>
                        </span>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <div>
                        <VCheckbox v-model="patientRegStore.patient.receviceSMs" :error-messages="errors.receviceSMs"
                            :rules="[requiredValidator]">
                        </VCheckbox>
                    </div>
                    <div style="margin-top: 6px;">
                        <span class="text-muted">
                            {{ $t('I agree to receive SMS & Email Notifications.')}}
                        </span>
                    </div>
                </div>
                <!-- <VCheckbox v-model="patientRegStore.patient.receviceSMs" :error-messages="errors.receviceSMs"
                    :rules="[requiredValidator]" label="I agree to receive SMS and Email Notifications." /> -->
                <!-- <div class="d-flex align-items-center">
                    <div>
                        <VCheckbox v-model="patientRegStore.patient.isPolicy"></VCheckbox>
                    </div>
                    <div style="margin-top: 8px;">
                        <span class="text-muted" style="cursor: pointer;">
                            I agree to the <a href="https://peptidewebmd.com/privacy-policy/" target="_blank"
                                style="color: #49A38C;">Privacy
                                Policy</a>
                        </span>
                    </div>
                </div> -->

            </VCol>
            <VCol class="text-center" cols="12">
                <VBtn type="submit" class="text-center px-5" rounded="lg" block :disabled="disableSubmit">
                   {{ $t('Sign Up') }} 
                </VBtn>
            </VCol>
        </VRow>
    </VForm>
</template>
<style scoped>
.language {
    position: absolute;
    top: 0;
    left: 0;
}
</style>