<script setup>
definePage({
    meta: {
        layout: 'blank',
        public: true
    },
})
import { usePatientRegStore } from '@/stores/patientRegStore';
import NavBarI18n from '@core/components/I18n.vue';
import {
    emailValidator,
    requiredValidator
} from '@core/utils/validators';
import { themeConfig } from '@themeConfig';

const patientRegStore = usePatientRegStore()

const appName = import.meta.env.VITE_APP_NAME ?? 'Peptide WebMD';
const refVForm = ref()
const errors = ref({
    password: undefined,
    email: undefined,
})

const onSubmit = async () => {

    refVForm.value?.validate().then(async ({ valid: isValid }) => {

        if (isValid) {
            await patientRegStore.checkPatientEmail()

        }

    })
}

</script>

<template>
     <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
     :languages="themeConfig.app.i18n.langConfig" class="language" />
    <div class="text-center mb-6">
        <h3 class="mt-6">{{ $t('Welcome to') }} {{ appName }} 👋</h3>
        <small><b>{{ $t('Enter your email to get started') }} </b></small>
    </div>
    <VForm ref="refVForm" @submit.prevent="onSubmit">
        <VRow>
            <VCol cols="12" md="12">
                <VTextField v-model="patientRegStore.patient.email" :label="$t('Email Address')" type="email"
                    :rules="[requiredValidator, emailValidator]" :error-messages="errors.email" density="comfortable"
                    :disabled="patientRegStore.canLogin" prepend-inner-icon="tabler-mail" />

            </VCol>
        </VRow>

        <VRow>
            <VCol class="text-center" cols="12">
                <VBtn type="submit" class="text-center px-5" rounded="lg" block>
                    {{ $t('Continue') }}
                </VBtn>
            </VCol>
        </VRow>


        <VRow>
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
