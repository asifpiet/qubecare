<script setup>
import { useRoleStore } from '@/stores/roleStore';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { VForm } from 'vuetify/components/VForm';

const roleStore = useRoleStore()
roleStore.unloadRole()
const props = defineProps({
    role: {
        type: Number,
        default: null,
        required: false,
    }
})

if (props.role?.id)
    await roleStore.loadRole(props.role)
const addDialog = ref(false)

const refVForm = ref(null)
const statusList = [{ value: 1, title: 'Active' }, { value: 0, title: 'In Active' }]
const closeAdd = () => {
    addDialog.value = false
}

const save = async () => {
    const { valid } = await refVForm.value.validate()
    console.log(valid)
    if (valid) {
        try {
            roleStore.saveRole()
            roleStore.isDrawerOpen = false
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
    <VNavigationDrawer temporary location="end" width="800" @update:model-value="roleStore.isDrawerOpen = false"
        :model-value="roleStore.isDrawerOpen">
        <!-- 👉 Header -->
        <AppDrawerHeaderSection :title="roleStore.id ? $t('Edit Role') : $t('Add Role')"
            @cancel="roleStore.isDrawerOpen = false" />
        <VDivider />

        <VCard flat>
            <PerfectScrollbar :options="{ wheelPropagation: false }" class="h-100">
                <VCardText style="block-size: calc(100vh - 5rem);">
                    <VForm ref="refVForm" @submit.prevent="">
                        <VRow>



                            <!-- fullName -->
                            <VCol cols="12" md="12">
                                <AppTextField v-model="roleStore.role.name" :label="$t('Name')" :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="12">
                                <AppTextField v-model="roleStore.role.guard_name" :label="$t('Guard')"
                                    :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="12">
                                <AppSelect v-model="roleStore.role.status" :rules="[requiredValidator]" :label="$t('Status')"
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
