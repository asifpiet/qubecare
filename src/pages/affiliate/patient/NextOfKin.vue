<script setup>
import { usePatientStore } from '@/stores/patientStore';

const patientStore = usePatientStore()
// const nextofkin = patientStore.nextofkin
const isFormValid = ref(false)
const isLoading = ref(false)
const refForm = ref()
const isTonalSnackbarVisible = ref(false)
const states = statesList;
const formatPhoneNumber = () => {
    // Remove non-numeric characters from the input
    const numericValue = patientStore.nextofkin.phone.replace(/\D/g, '');

    // Apply formatting logic
    if (numericValue.length <= 10) {
        patientStore.nextofkin.phone = numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else {
        // Limit the input to a maximum of 14 characters
        const truncatedValue = numericValue.slice(0, 10);
        patientStore.nextofkin.phone = truncatedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
};


const saveAndClose = async () => {
    if (await onSubmit())
        patientStore.isDrawerOpen = false
}

const onSubmit = async (trigger) => {
    isLoading.value = true;

    return refForm.value?.validate().then(({ valid }) => {
        if (valid) {
            patientStore.saveAffiliateNextofkin()
            isTonalSnackbarVisible.value = true;
            isLoading.value = false;
            if (trigger == 'saveClose') {

                emit('UpdateTab', true)
                nextTick(() => {
                    refForm.value?.reset()
                    refForm.value?.resetValidation()
                    isLoading.value = false;
                })
            }
        }
        return false;
    })
}

const CopyFromDemographic = () => {
    patientStore.copyNextFromDemographic()
}
</script>
<template>
    <VDialog v-model="isLoading" width="110" height="150" color="primary">
        <VCardText class="" style="color: white !important;">
            <div class="demo-space-x">
                <VProgressCircular :size="40" color="primary" indeterminate />
            </div>
        </VCardText>
    </VDialog>
    <VSnackbar v-model="isTonalSnackbarVisible" location="top end" variant="flat" color="success">
        {{ $t('NextKin created.') }}
    </VSnackbar>
    <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
        <VRow>
            <VCol cols="12">
                <VBtn @click="CopyFromDemographic">
                    {{ $t('Copy From Demographic') }}

                </VBtn>
            </VCol>
            <VCol cols="4">
                <AppSelect v-model="patientStore.nextofkin.nextKinRelation" :label="$t('Relationship')"
                    :placeholder="$t('Relationship')" :rules="[requiredValidator]"
                    :items="['Self', 'Spouse', 'Child', 'Other']" />
            </VCol>
            <!-- 👉 Full name -->
            <VCol cols="4">
                <AppTextField v-model="patientStore.nextofkin.nextkinFirstName" :rules="[requiredValidator]"
                    :label="$t('First Name')" :placeholder="$t('First Name')" />
            </VCol>

            <VCol cols="4">
                <AppTextField v-model="patientStore.nextofkin.nextkinLastName" :rules="[requiredValidator]"
                    :label="$t('Last Name')" :placeholder="$t('Last Name')" />
            </VCol>





            <VCol cols="6">
                <AppTextField v-model="patientStore.nextofkin.nextkinPhone" pattern="^\(\d{3}\) \d{3}-\d{4}$"
                    :rules="[requiredValidator, validUSAPhone]" :label="$t('Phone')" max="14" @input="formatPhoneNumber"
                    placeholder="i.e. (000) 000-0000" />
            </VCol>
            <VCol cols="6">
                <AppTextField v-model="patientStore.nextofkin.nextkinAddress" :rules="[requiredValidator]"
                    :label="$t('Address')" :placeholder="$t('Address')" />
            </VCol>
            <VCol cols="4">
                <AppTextField v-model="patientStore.nextofkin.nextkinCity" :rules="[requiredValidator]"
                    :label="$t('City')" :placeholder="$t('City')" />
            </VCol>
            <VCol cols="4">
                <AppSelect v-model="patientStore.nextofkin.nextkinState" :label="$t('State')" :placeholder="$t('State')"
                    :rules="[requiredValidator]" :items="states" item-title="name" item-value="abbreviation" />
            </VCol>
            <VCol cols="4">
                <AppTextField v-model="patientStore.nextofkin.nextkinZipCode" type="number" :rules="[requiredValidator]"
                    :label="$t('Zipcode')" :placeholder="$t('Zipcode')" />
            </VCol>

            <VCol cols="12">
                <VCheckbox v-model="patientStore.nextofkin.nextKinGuarantor"
                    :label="$t('Is also the Guarantor (financially responsible). If unchecked, patient is the Guarantor')" />
            </VCol>


            <!-- 👉 Submit and Cancel -->
            <VCol cols="12">
                <VBtn @click="saveAndClose" class="me-3">
                    {{ $t('Save and Close') }}
                </VBtn>
                <VBtn @click="onSubmit" class="me-3">
                    {{ $t('Save') }}
                </VBtn>
                <VBtn type="reset" variant="tonal" color="error" class="me-3 mt-1"
                    @click="patientStore.isDrawerOpen = false">
                    {{ $t('Close') }}
                </VBtn>
            </VCol>
        </VRow>
    </VForm>
</template>
