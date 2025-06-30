<script setup>
import {
    requiredValidator
} from '@core/utils/validators';
import { useLabStore } from '@/stores/labStore';
import { useLabtestStore } from '@/stores/labtestStore';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { VForm } from 'vuetify/components/VForm';

const labtestStore = useLabtestStore()
const labStore = useLabStore()
labtestStore.unloadLabtest()
const props = defineProps({
    labtest: {
        type: Number,
        default: null,
        required: false,
    }
})
await labStore.getLabs()
if (props.labtest?.id)
    await labtestStore.loadLabtest(props.labtest)
const addDialog = ref(false)

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
            labtestStore.saveLabtest()
            labtestStore.isDrawerOpen = false
        } catch (error) {
            console.error(error)
        }

        closeAdd()
    }
}

const resetForm = () => {
    refVForm.value?.reset()
}
</script>

<template>
    <VNavigationDrawer temporary location="end" width="800" @update:model-value="labtestStore.isDrawerOpen = false"
        :model-value="labtestStore.isDrawerOpen">
        <!-- 👉 Header -->
        <AppDrawerHeaderSection :title="labtestStore.id ? $t('Edit Lab Test') : $t('Add Lab Test')"
            @cancel="labtestStore.isDrawerOpen = false" />
        <VDivider />

        <VCard flat>
            <PerfectScrollbar :options="{ wheelPropagation: false }" class="h-100">
                <VCardText style="block-size: calc(100vh - 5rem);">
                    <VForm ref="refVForm" @submit.prevent="">
                        <VRow>



                            <!-- fullName -->
                            <VCol cols="12" md="12">
                                <v-autocomplete clearable v-model="labtestStore.labtest.lab_id"
                                                        :label="$t('Select Lab')" :items="labStore.labs"
                                                        item-title="name" item-value="id"
                                                        :rules="[requiredValidator]" density="comfortable"></v-autocomplete>
                            </VCol>
                            <VCol cols="12" md="12">
                                <AppTextField v-model="labtestStore.labtest.test_name" :label="$t('Test Name')"
                                    :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="12">
                                <AppSelect v-model="labtestStore.labtest.status" :rules="[requiredValidator]" :label="$t('Status')"
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
