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
    userData: {
        type: Object,
        required: true,
    }
})

const itemId = ref()
const editDialog = ref(false)
const refVForm = ref(null)
const statusList =[{value:1,title:'Active'},{value:0,title:'In Active'}]
const defaultItem = ref({
    id: '',
    name: '',
    guard: '',
    status:''
})
const editedItem = ref(defaultItem.value)
const editedIndex = ref(-1)

const close = () => {
    editDialog.value = false
    editedIndex.value = -1
    editedItem.value = { ...defaultItem.value }
}
const getSingleRole = computed(async () => {
    // if (store.getters.getSingleRole) {
    console.log('>>', props.userData)
    if (props.userData) {
        console.log(editedItem.value)
        itemId.value = props.userData.id
        defaultItem.value.id = props.userData.id
        defaultItem.value.name = props.userData.name
        defaultItem.value.guard = props.userData.guard_name
        defaultItem.value.status = props.userData.status
    }

    // }





});
const update = async () => {
    const { valid } = await refVForm.value.validate()
    console.log(valid)
    if (valid) {
        try {
            await store.dispatch('updateRole', {
                id: editedItem.value.id,
                name: editedItem.value.name,
                guard: editedItem.value.guard,
                status: editedItem.value.status,
            })


            if (!store.getters.getErrorMsg) {
                emit('addedMessage', 'success')
                editedItem.value.id = null
                editedItem.value.name = null
                editedItem.value.guard = null
                editedItem.value.status = null
                emit('update:isDrawerOpen', false)
            }



        } catch (error) {
            console.error(error)
        }


        close()
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
        <AppDrawerHeaderSection title="Edit Role" @cancel="$emit('update:isDrawerOpen', false)" />
        <VDivider />

        <VCard flat>
            <PerfectScrollbar :options="{ wheelPropagation: false }" class="h-100">
                <VCardText style="block-size: calc(100vh - 5rem);" v-if="getSingleRole">
                    <VForm ref="refVForm" @submit.prevent="">



                        <VRow>
                          <!-- fullName -->
                            <VCol cols="12" md="12">
                                <AppTextField v-model="defaultItem.name" label="Name" :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="12">
                                <AppTextField v-model="defaultItem.guard" label="Guard" :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="12">
                              <AppSelect
                                v-model="defaultItem.status"
                                :rules="[requiredValidator]"
                                label="Status"
                                placeholder="Status"
                                :items="statusList"
                                item-value="value"
                                item-title="title"
                              />
                            </VCol>
                            <VCol cols="12">
                                <div class="d-flex justify-start">
                                    <VBtn type="submit" color="primary" class="me-4" @click="update">
                                        Save
                                    </VBtn>
                                    <VBtn color="error" variant="outlined" @click="resetForm">
                                        Discard
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
