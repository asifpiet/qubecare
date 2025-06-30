<script setup>
import {
    requiredValidator,
    validUSAPhone
} from '@core/utils/validators';
import { statesList } from '@/utils/states';
import { useLabStore } from '@/stores/labStore';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { VForm } from 'vuetify/components/VForm';

const labStore = useLabStore()
labStore.unloadLab()
const props = defineProps({
    lab: {
        type: Number,
        default: null,
        required: false,
    }
})

if (props.lab?.id)
    await labStore.loadLab(props.lab)
const addDialog = ref(false)
const states = statesList;
const sortedStates = computed(() => {
    return states.slice().sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
});
const refVForm = ref(null)
const statusList = [{ value: 'active', title: 'active' }, { value: 'inactive', title: 'inactive' }]
const closeAdd = () => {
    addDialog.value = false
}

const save = async () => {
    const { valid } = await refVForm.value.validate()
    console.log(valid)
    if (valid) {
        try {
            labStore.saveLab()
            labStore.isDrawerOpen = false
        } catch (error) {
            console.error(error)
        }

        closeAdd()
    }
}

const resetForm = () => {
    refVForm.value?.reset()
}

const formatPhoneNumber = () => {
    const numericValue = labStore.lab.phone_number.replace(/\D/g, '');
    if (numericValue.length <= 10) {
        labStore.lab.phone_number = numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else {
        const truncatedValue = numericValue.slice(0, 10);
        labStore.lab.phone_number = truncatedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
};
</script>

<template>
    <VNavigationDrawer temporary location="end" width="800" @update:model-value="labStore.isDrawerOpen = false"
        :model-value="labStore.isDrawerOpen">
        <!-- 👉 Header -->
        <AppDrawerHeaderSection :title="labStore.id ? $t('Edit Lab') : $t('Add Lab')"
            @cancel="labStore.isDrawerOpen = false" />
        <VDivider />

        <VCard flat>
            <PerfectScrollbar :options="{ wheelPropagation: false }" class="h-100">
                <VCardText style="block-size: calc(100vh - 5rem);">
                    <VForm ref="refVForm" @submit.prevent="">
                        <VRow>



                            <!-- fullName -->
                            <VCol cols="12" md="12">
                                <AppTextField v-model="labStore.lab.name" :label="$t('Name')" :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="12">
                                <AppTextField v-model="labStore.lab.address" :label="$t('Address')"
                                    :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="6">
                                <AppTextField v-model="labStore.lab.city" :label="$t('City')"
                                    :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="6">
                                <label>{{ $t('State') }} </label>
                                <v-autocomplete clearable v-model="labStore.lab.state"
                                                    label="" :items="sortedStates"
                                                    item-title="name" item-value="abbreviation"
                                                    :rules="[requiredValidator]"
                                                    density="comfortable"></v-autocomplete>
                            </VCol>
                            <VCol cols="12" md="6">
                                <AppTextField v-model="labStore.lab.zipcode" :label="$t('Zipcode')"
                                    :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="6">
                                <AppTextField v-model="labStore.lab.country" :label="$t('Country')"
                                    :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="6">
                                <label>{{ $t('Phone Number') }} </label>
                                <VTextField v-model="labStore.lab.phone_number" label=""
                                    pattern="^\(\d{3}\) \d{3}-\d{4}$"
                                    :rules="[requiredValidator, validUSAPhone]"
                                    @input="formatPhoneNumber" max="14" density="comfortable"
                                        />
                            </VCol>
                            <VCol cols="12" md="6">
                                <AppTextField v-model="labStore.lab.fax_number" :label="$t('Fax')"
                                    :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="6">
                                <AppSelect v-model="labStore.lab.status" :rules="[requiredValidator]" :label="$t('Status')"
                                    :placeholder="$t('Status')" :items="statusList" item-value="value" item-title="title" />
                            </VCol>




                            <VCol cols="12">
                                <div class="d-flex justify-start">
                                    <VBtn type="submit" color="primary" class="me-4" @click="save">
                                        {{ $t('Save') }}
                                    </VBtn>
                                    <VBtn color="error" variant="outlined" @click="resetForm">
                                        {{ $t('Discard') }} 
                                    </VBtn>
                                </div>
                            </VCol>
                        </VRow>
                    </VForm>
                </VCardText>
            </PerfectScrollbar>
        </VCard>
    </VNavigationDrawer>
</template>

<style lang="scss">
.v-navigation-drawer__content {
    overflow-y: hidden !important;
}
</style>
