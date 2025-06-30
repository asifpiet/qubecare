<script setup>
definePage({
    meta: {
        layout: 'blank',
        public: true
    },
})
import { patientAuthService } from '@/services/auth/patientAuthService';
import { usePatientRegStore } from '@/stores/patientRegStore';
import { addAlert, hideLoader, showLoader } from '@/utils/showLoader';
import NavBarI18n from '@core/components/I18n.vue';
import {
    emailValidator,
    requiredValidator
} from '@core/utils/validators';
import { themeConfig } from '@themeConfig';

const patientRegStore = usePatientRegStore()

const appName = import.meta.env.VITE_APP_NAME ?? 'Peptide WebMD';
const refVForm = ref()
const isPasswordVisible = ref(false)
const errors = ref({
    password: undefined,
    email: undefined,
})
const emit = defineEmits(['completed']);
const onSubmit = async () => {

    refVForm.value?.validate().then(async ({ valid: isValid }) => {
        console.log('isValid ', isValid)
        if (isValid) {
            showLoader()
            try {
                let response = await patientAuthService.login(patientRegStore.patient.email, patientRegStore.patient.password)
                patientRegStore.forms = response.userData.forms
                emit('completed')
            } catch (e) {
                addAlert(e.response?._data?.message ?? 'Something went wrong', 'error')
            }
            hideLoader()
        }

    })
}

const changeEmailSignUp = () => {
    patientRegStore.currentState = 'checklogin'
};
</script>

<template>
    <!-- <div class="p-0">
        <h5 class="text-h5 mb-1 text-left">
            Welcome! Need Our MD?
        </h5>
        <p>That's great, you've got an account! Welcome back!
        </p>
    </div> -->
    <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
:languages="themeConfig.app.i18n.langConfig" class="language" />
    <div class="text-center mb-6">
        <h3 class="mt-6">Welcome to {{ appName }} 👋</h3>
        <small><b>{{ $t('You’ve got an account, please login') }} </b></small>
    </div>
    <VForm ref="refVForm" @submit.prevent="onSubmit">
        <VRow>
            <VCol cols="12" md="12" class="pb-0">
                <div class="float-right">
                    <small><span style="color: #b1c3d5;">{{ $t('This is not your email?') }} </span><span><a class=" cursor-pointer"
                                @click="changeEmailSignUp()">{{ $t('(Change)') }}</a></span></small>
                </div>

            </VCol>
            <VCol cols="12" md="12">
                <VTextField v-model="patientRegStore.patient.email" :label="$t('Email Address')" type="email"
                    :rules="[requiredValidator, emailValidator]" :error-messages="errors.email" density="comfortable"
                    readonly prepend-inner-icon="tabler-mail" />

            </VCol>
            <VCol cols="12">
                <VTextField v-model="patientRegStore.patient.password" :label="$t('Password')" placeholder="············"
                    :rules="[requiredValidator]" :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible" prepend-inner-icon="tabler-lock" />
            </VCol>
            <VCol cols="12" class="pt-0 pb-2">
                <small class="float-right"><router-link :to="'/patient/forgot'" class="underline"><span
                            style="color: #49A38C!important;">
                            {{ $t('Forgot Password?') }}'</span></router-link></small>

            </VCol>
        </VRow>

        <VRow>
            <VCol class="text-center" cols="12">
                <VBtn type="submit" class="text-center px-5" rounded="lg" block>
                    {{ $t('Login') }}
                </VBtn>
            </VCol>
        </VRow>


        <VRow>
        </VRow>
    </VForm>
</template>
