<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { VForm } from 'vuetify/components/VForm';
import { useStore } from 'vuex';
const store = useStore()
const props = defineProps({
    isDrawerOpen: {
        type: Boolean,
        required: true,
    },
})
const isAddCustomerDrawerOpen = ref(false)
const isEditCustomerDrawerOpen = ref(false)

const editDialog = ref(false)
const addDialog = ref(false)
const deleteDialog = ref(false)
const search = ref('')
const status = ref('')

const refVForm = ref(null)
const refVFormAdd = ref(null)
const selectDropdown = ref(false)
const selectdataList = ref(null)
const statusList = [{ value: 1, title: 'Active' }, { value: 0, title: 'In Active' }]
const defaultItem = ref({
    id: -1,
    name: '',
    guard: '',
    status: ''
})
const requiredImageValidator = (value) => !!value || 'Please select an image file.'
const requiredExcelValidator = (value) => !!value || 'Please select an Excel file.'
const imageFile = ref(null)
const excelFile = ref(null)
const editedItem = ref(defaultItem.value)
const editedIndex = ref(-1)
const medicineList = ref([])
const isLoading = ref(false)
const currencySign = ref('$');
const imageBase64 = ref(null)
const excelBase64 = ref(null)

const close = () => {
    editDialog.value = false
    editedIndex.value = -1
    editedItem.value = { ...defaultItem.value }
}
const closeAdd = () => {
    addDialog.value = false
}



const save = async () => {
    const { valid } = await refVForm.value.validate()
    console.log(valid)
    if (valid) {
        try {

            await store.dispatch('saveRole', {
                name: defaultItem.value.name,
                guard: defaultItem.value.guard,
                status: defaultItem.value.status
            })


            if (!store.getters.getErrorMsg) {
                emit('addedMessage', 'success')
                defaultItem.value.id = null
                defaultItem.value.name = null
                defaultItem.value.guard = null
                defaultItem.value.status = null
            }
            emit('update:isDrawerOpen', false)


        } catch (error) {
            console.error(error)
        }
        addDialog.value = false

        closeAdd()
    }
}
const emit = defineEmits(['update:isDrawerOpen', 'addedMessage'])

const handleDrawerModelValueUpdate = val => {
    emit('update:isDrawerOpen', val)
}



const resetForm = () => {
    refVForm.value?.reset()
    emit('update:isDrawerOpen', false)
}
</script>

<template>
    <VNavigationDrawer :model-value="props.isDrawerOpen" temporary location="end" width="800"
        @update:model-value="handleDrawerModelValueUpdate">
        <!-- 👉 Header -->
        <AppDrawerHeaderSection :title="$t('Add Rolesdsa')" @cancel="$emit('update:isDrawerOpen', false)" />
        <VDivider />

        <VCard flat>
            <PerfectScrollbar :options="{ wheelPropagation: false }" class="h-100">
                <VCardText style="block-size: calc(100vh - 5rem);">
                    <VForm ref="refVForm" @submit.prevent="">
                        <VRow>



                            <!-- fullName -->
                            <VCol cols="12" md="12">
                                <AppTextField v-model="defaultItem.name" :label="$t('Name')"
                                    :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="12">
                                <AppTextField v-model="defaultItem.guard" :label="$t('Guard')"
                                    :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="12">
                                <AppSelect v-model="defaultItem.status" :rules="[requiredValidator]"
                                    :label="$t('Status')" :placeholder="$t('Status')" :items="statusList"
                                    item-value="value" item-title="title" />
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
