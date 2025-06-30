<script setup>
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})
import { usePatientStore } from '@/stores/patientStore';
import NavBarI18n from '@core/components/I18n.vue';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';


const patientStore = usePatientStore()
const route = useRoute('patient-setPassword-id')
const router = useRouter()
patientStore.unloadsetPassword()
const errors = ref({
    password: undefined,
});
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const refVForm = ref()
patientStore.setPassword.token = route.params.id;
const confirmedValidator = (value) => {
    return value === patientStore.setPassword.password || 'The Confirm Password field confirmation does not match';
};
const onSubmit = async () => {

    refVForm.value?.validate().then(async ({ valid: isValid }) => {
        console.log('isValid ', isValid)
        if (isValid) {
            // showLoader()
            try {

                await patientStore.createPassword();
                router.replace(route.query.to ? String(route.query.to) : '/patient/login')
                addAlert('Password has been successfully created.', 'success');
            } catch (e) {
                console.error('Error Response:', e.response);

                if (e.response?.status === 422) {
                    const errorMessages = e.response?._data?.errors;
                    if (errorMessages) {
                        const formattedMessages = Object.values(errorMessages)
                            .flat()
                            .join(' ');
                        addAlert(formattedMessages, 'error');
                    } else {
                        addAlert('something went wrong.', 'error');
                    }
                }
                else if (e.response?.status === 400) {
                    console.log('404', e.response?._data?.error);
                    addAlert(e.response?._data?.error, 'error');
                }
                else {
                    console.log('else', e.message, e.response);
                    addAlert(e.response?._data?.message ?? e.message, 'error');
                }

            }
            hideLoader()

        }

    })
}


</script>

<template>
     <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
     :languages="themeConfig.app.i18n.langConfig" class="language-btn" />
    <VRow class="auth-wrapper bg-surface" no-gutters>





        <VCol cols="12" md="12" class="d-flex align-center justify-center">
            <VCard flat border :max-width="400" class="mt-12 mt-sm-0 pa-4">

                <div class="auth-logo pt-1 py-5 d-flex justify-content-center align-items-center text-center gap-x-3">
                    <VNodeRenderer :nodes="themeConfig.app.logo" />
                    <h1 class="auth-title">
                        {{ themeConfig.app.title }}
                    </h1>
                </div>


                <VCardText>
                    <h4 class="text-h4 mb-1 pt-9">
                        {{ $t('Create Password') }}
                    </h4>

                </VCardText>

                <VCardText>
                    <VForm ref="refVForm" @submit.prevent="onSubmit">
                        <VRow>
                            <!-- email -->
                            <VCol cols="12">
                                <VTextField v-model="patientStore.setPassword.password" :label="$t('Password')"
                                    placeholder="············" :rules="[requiredValidator, setPasswordValidator]"
                                    :error-messages="errors.password" autofocus
                                    :type="isPasswordVisible ? 'text' : 'password'" maxlength="8"
                                    :append-inner-icon="isPasswordVisible ? 'tabler-eye' : 'tabler-eye-off '"
                                    @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                            </VCol>
                            <VCol cols="12">
                                <VTextField v-model="patientStore.setPassword.password_confirmation"
                                    :label="$t('Confirm Password')" placeholder="············" maxlength="8"
                                    :rules="[requiredValidator, confirmedValidator]"
                                    :type="isConfirmPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye' : 'tabler-eye-off '"
                                    @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />
                            </VCol>
                            <!-- Reset link -->
                            <VCol cols="12">
                                <VBtn block type="submit">
                                    {{ $t('Create') }}
                                </VBtn>
                            </VCol>

                            <!-- back to login -->
                        </VRow>
                    </VForm>
                </VCardText>
            </VCard>
        </VCol>
    </VRow>
</template>

<style lang="scss" scoped>
@use "@core/scss/template/pages/page-auth.scss";

.language-btn {
  position: absolute;
  right: 0;
}
</style>
