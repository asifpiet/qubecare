<script setup>
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})
import { usePractitionerStore } from '@/stores/practitionerStore';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import { useRoute, useRouter } from 'vue-router';

const practitionerStore = usePractitionerStore()
const route = useRoute('provider-setPassword-id')
const router = useRouter()
const errors = ref({
    password: undefined,
});
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const refVForm = ref()
const password = ref(null)
const password_confirmation = ref(null)
let token = route.params.id;
const confirmedValidator = (value) => {
    return value === password.value || 'The Confirm Password field confirmation does not match';
};
const onSubmit = async () => {

    refVForm.value?.validate().then(async ({ valid: isValid }) => {
        console.log('isValid ', isValid)
        if (isValid) {
            // showLoader()
            try {

                await practitionerStore.savePassword({ token: token, password: password.value });
                router.push({ name: 'provider-login' })
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
                                <AppTextField v-model="password" :label="$t('Password')" placeholder="············"
                                    :rules="[requiredValidator, passwordValidator]"
                                    :type="isPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                                    @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                            </VCol>
                            <VCol cols="12">
                                <VTextField v-model="password_confirmation" :label="$t('Confirm Password')"
                                    placeholder="············" :rules="[requiredValidator, confirmedValidator]"
                                    :type="isConfirmPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye' : 'tabler-eye-off '"
                                    @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />
                            </VCol>
                            <!-- Reset link -->
                            <VCol cols="12">
                                <VBtn block type="submit">
                                    {{ $t('Create')}}
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

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
