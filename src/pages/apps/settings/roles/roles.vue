<script setup>

import AddRole from '@/pages/apps/settings/roles/AddRole.vue';
import EditRole from '@/pages/apps/settings/roles/EditRole.vue';
import API from '@/utils/apiDatable';
import { format } from 'date-fns';
import debounce from 'lodash.debounce';
import { useStore } from 'vuex';
const router = useRouter();
const isAddCustomerDrawerOpen = ref(false)
const isEditCustomerDrawerOpen = ref(false)
const store = useStore()
const editDialog = ref(false)
const addDialog = ref(false)
const deleteDialog = ref(false)
const search = ref('')
const refVForm = ref(null)
const refVFormAdd = ref(null)
const selectDropdown = ref(false)
const selectdataList = ref(null)
const sortByData = ref([{'key':'id','order':'desc'}])
const defaultItem = ref({
    id: -1,
    title: '',
    slug: '',
    list_one_title: '',
    list_sub_title: '',
    list_two_title: '',
    price: '',
    currency: ""
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



// headers
const headers = [
    {
        title: 'ID',
        key: 'id',


    },
    {
        title: 'Name',
        key: 'name',
    },
    // {
    //   title: 'Slug',
    //   key: 'slug',
    // },
    {
        title: 'Guard',
        key: 'guard_name',
    },
    {
        title: 'Created At',
        key: 'created_at', 
    },
    {
        title: 'Updated At',
        key: 'updated_at',
    },

    {
        title: 'Actions',
        key: 'actions',
        searchable: false
    },
]

const resolveStatusVariant = status => {
    if (status === 1)
        return {
            color: 'primary',
            text: 'Current',
        }
    else if (status === 2)
        return {
            color: 'success',
            text: 'Professional',
        }
    else if (status === 3)
        return {
            color: 'error',
            text: 'Rejected',
        }
    else if (status === 4)
        return {
            color: 'warning',
            text: 'Resigned',
        }
    else
        return {
            color: 'info',
            text: 'Applied',
        }
}

const formatDateTime = (date) => {
    return format(date, 'MM-dd-yyyy');
};

const editItem = async (item) => {
    isEditCustomerDrawerOpen.value = true

    await store.dispatch('getRoleByID', {
        id: item.id,
    })

    editedItem.value = store.getters.getSingleRole
    console.log('here', store.getters.getSingleRole)
    // editDialog.value = true
}
const addItem = item => {
    addDialog.value = true
}
const deleteItem = item => {
    editedIndex.value = medicineList.value.indexOf(item)
    editedItem.value = { ...item }
    deleteDialog.value = true
}
const permissionRole = item => {
    router.push({ name: "admin-role-permission", params: { id: item.id } });

}

const selectfile = (data) => {
    if (data == 'dropdown') {
        selectDropdown.value = true
    } else {
        selectDropdown.value = false
    }

}
const close = () => {
    editDialog.value = false
    editedIndex.value = -1
    editedItem.value = { ...defaultItem.value }
}
const closeAdd = () => {
    addDialog.value = false
}
const closeDelete = () => {
    deleteDialog.value = false
    editedIndex.value = -1
    editedItem.value = { ...defaultItem.value }
}
// const getmedicineList = computed(async () => {
//   store.dispatch('updateIsLoading', true)
//   await store.dispatch('medicineList')
//   console.log('medicineList',store.getters.getMedcineList)
//   let list = store.getters.getMedcineList
//   await store.dispatch('questioneriesListExcel')
//   store.dispatch('updateIsLoading', false)
//   let getQuestioneriesList = store.getters.getQuestioneriesList
//     medicineList.value = list
//     return medicineList.value
// });
const convertImageToBase64 = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        imageBase64.value = reader.result.split(',')[1]
    }
}

const convertExcelToBase64 = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        excelBase64.value = reader.result.split(',')[1]
    }
}

const save = async () => {
    const { valid } = await refVFormAdd.value.validate()
    console.log(valid)
    if (valid) {
        try {

            if (editedIndex.value > -1) {
                Object.assign(medicineList.value[editedIndex.value], editedItem.value)



            } else {

                medicineList.value.push(editedItem.value)
                console.log(imageFile.value)
                //const formData = new FormData()
                //formData.append('image', imageBase64.value)


                // formData.append('title', defaultItem.value.title)
                // formData.append('slug', defaultItem.value.slug)
                // formData.append('list_one_title', defaultItem.value.list_one_title)
                // formData.append('list_sub_title', defaultItem.value.list_sub_title)
                // formData.append('list_two_title', defaultItem.value.list_two_title)
                // formData.append('price', defaultItem.value.price)
                // formData.append('currency', currencySign.value)
                let ecelData = ''
                if (selectDropdown.value) {
                    let datexcel = {
                        type: 'string',
                        data: selectdataList.value
                    }
                    console.log(datexcel)
                    ecelData = datexcel
                    //formData.append('excel', datexcel)
                } else {

                    let datexcel = {
                        type: 'file',
                        data: excelBase64.value
                    }
                    ecelData = datexcel
                    // formData.append('excel', datexcel)
                }
                await store.dispatch('medicineAdd', {
                    title: defaultItem.value.title,
                    slug: defaultItem.value.slug,
                    list_one_title: defaultItem.value.list_one_title,
                    list_sub_title: defaultItem.value.list_sub_title,
                    list_two_title: defaultItem.value.list_two_title,
                    price: defaultItem.value.price,
                    currency: currencySign.value,
                    excel: '',//ecelData,
                    image: imageBase64.value
                })

            }



            // Handle the API response
            console.log(response.data)
        } catch (error) {
            console.error(error)
        }
        addDialog.value = false
        await store.dispatch('medicineList')
        let list = store.getters.getMedcineList
        medicineList.value = list
        closeAdd()
    }
}
const update = async () => {
    const { valid } = await refVForm.value.validate()
    console.log(valid)
    if (valid) {
        try {

            if (editedIndex.value > -1) {
                Object.assign(medicineList.value[editedIndex.value], editedItem.value)

                console.log(imageFile.value)

                let ecelData = ''
                if (selectDropdown.value) {
                    let datexcel = {
                        type: 'string',
                        data: selectdataList.value
                    }
                    console.log(datexcel)
                    ecelData = datexcel
                    //formData.append('excel', datexcel)
                } else {

                    let datexcel = {
                        type: 'file',
                        data: excelBase64.value
                    }
                    ecelData = datexcel
                    // formData.append('excel', datexcel)
                }
                await store.dispatch('medicineUpdate', {
                    id: editedItem.value.id,
                    title: editedItem.value.title,
                    slug: editedItem.value.slug,
                    list_one_title: editedItem.value.list_one_title,
                    list_sub_title: editedItem.value.list_sub_title,
                    list_two_title: editedItem.value.list_two_title,
                    price: editedItem.value.price,
                    currency: currencySign.value,
                    excel: '',//ecelData,
                    image: imageBase64.value
                })

            }



            // Handle the API response
            console.log(response.data)
        } catch (error) {
            console.error(error)
        }
        addDialog.value = false
        await store.dispatch('medicineList')
        let list = store.getters.getMedcineList
        medicineList.value = list
        close()
    }
}
const deleteItemConfirm = async () => {

    await store.dispatch('deleteRole', {
        id: editedItem.value.id
    })

    closeDelete()
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
    defaultItem.value.id = null
    defaultItem.value.name = null
    defaultItem.value.guard = null

}

const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);

// Method to load items
const loadItems = debounce(async ({ page, itemsPerPage, sortBy }) => {
    const payload = {
        page,
        itemsPerPage,
        sortBy,
        filters: {

        },
        search: search.value,
    }
    sortByData.value=sortBy
    console.log("records", page, itemsPerPage, sortBy);
    loading.value = true;
    const data = await API.getDataTableRecord(ADMIN_GET_ROLES_API, payload, headers);
    serverItems.value = data.items;
    totalItems.value = data.total;
    loading.value = false;
}, 500);
const itemsPerPage = ref(5);
onMounted(() => {
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
})
const handleParentAdded = async (msg) => {
    if (msg == 'success') {
        store.dispatch('updateIsLoading', true)
        loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
        store.dispatch('updateIsLoading', false)
    }
    // You can also trigger a toast or snackbar here to show the message
    // For example, if using Vuetify:
    // showSnackbar(msg)
}
</script>

<template>
    <v-row>
        <v-col cols="12" md="12">
            <VCard :title="$t('Roles')" class="mb-6">

               
                <VDivider />

                    <VCardText class="d-flex flex-wrap gap-4">
                      <VSpacer />

                      <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
                      
                        <div style="inline-size: 15.625rem;">
                          <AppTextField
                            v-model="search"
                            :placeholder="$t('Search')"
                          />
                        </div>

                      
                        <VBtn
                          prepend-icon="tabler-plus"
                          @click="isAddCustomerDrawerOpen = !isAddCustomerDrawerOpen" v-if="$can('read', 'Roles Add')">
                          {{ $t('New Role') }}
                        </VBtn>
                      </div>
                    </VCardText>

                    <VDivider />
      
      <VDataTableServer
                v-model:model-value="selectedRows"
                v-model:items-per-page="itemsPerPage"
                :headers="headers"
                :items="serverItems"
                :items-length="totalItems"
                :loading="loading"
                :search="search"
                item-value="id"
                :sort-by="sortByData"
                @update:options="loadItems"
                  class="text-no-wrap"
            >
                    <!-- full name -->
                    <template #item.title="{ item }">
                        <div class="d-flex align-center">
                            <!-- avatar -->
                            <VAvatar size="32" :color="item.image_url ? '' : 'primary'"
                                :class="item.image_url ? '' : 'v-avatar-light-bg primary--text'"
                                :variant="!item.image_url ? 'tonal' : undefined">
                                <VImg v-if="item.image_url" :src="item.image_url" />
                                <span v-else class="text-sm">{{ avatarText(item.name) }}</span>
                            </VAvatar>

                            <div class="d-flex flex-column ms-3">
                                <span class="d-block font-weight-medium text-high-emphasis text-truncate">{{ item.title
                                    }}</span>

                            </div>
                        </div>
                    </template>

                    <!-- status -->
                    <template #item.status="{ item }">
                        <VChip :color="resolveStatusVariant(item.status).color" density="comfortable">
                            {{ resolveStatusVariant(item.status).text }}
                        </VChip>
                    </template>

                    <template #item.created_at="{ item }">
                        <span>{{ formatDateTime(item.created_at) }}</span>
                    </template>

                    <template #item.updated_at="{ item }">
                        <span>{{ formatDateTime(item.updated_at) }}</span>
                    </template>

                    <!-- Actions -->
                    <template #item.actions="{ item }">
                        <!-- <div class="d-flex gap-1">
                            <IconBtn size="small" @click="editItem(item)">
                                <VIcon icon="ri-pencil-line" />
                            </IconBtn>
                            <IconBtn size="small" @click="deleteItem(item)">
                                <VIcon icon="ri-delete-bin-line" />
                            </IconBtn>
                        </div> -->
                        <div class="demo-space-x" >
                            <VMenu transition="scale-transition">
                                <template #activator="{ props }">
                                    <VBtn color="primary" v-bind="props">
                                        Options
                                    </VBtn>
                                </template>

                                <v-list lines="one" style="padding-right: 5px;padding-left: 5px;" v-if="item.guard_name!='default'">
                                    <v-list-item
                                        style="border-bottom: 1px solid #eadfdf;padding-right: 15px;padding-left: 15px;"
                                        @click="editItem(item)"  v-if="$can('read', 'Roles Edit')">
                                        <VIcon icon="tabler-edit" /> Edit
                                    </v-list-item>
                                    <v-list-item
                                        style="border-bottom: 1px solid #eadfdf;padding-right: 15px;padding-left: 15px;"
                                        @click="deleteItem(item)" v-if="$can('read', 'Roles Delete')" >
                                        <VIcon icon="tabler-trash" /> Delete
                                    </v-list-item>
                                    <v-list-item
                                        style="border-bottom: 1px solid #eadfdf;padding-right: 15px;padding-left: 15px;"
                                        @click="permissionRole(item)" v-if="$can('read', 'Roles Permissions')" >
                                        <VIcon icon="tabler-shield-half" /> Permissions
                                    </v-list-item>
                                </v-list>
                            </VMenu>
                        </div>
                    </template>
                  </VDataTableServer>
                <!-- </VDataTable> -->
            </VCard>
        </v-col>

        <AddRole v-model:is-drawer-open="isAddCustomerDrawerOpen" @addedMessage="handleParentAdded" />
        <EditRole v-model:is-drawer-open="isEditCustomerDrawerOpen" :user-data="store.getters.getSingleRole"
            @addedMessage="handleParentAdded" />
    </v-row>
    <!-- 👉 Edit Dialog  -->
    <VDialog v-model="editDialog" max-width="600px">
        <VForm ref="refVForm">
            <VCard>
                <VCardTitle>
                    <span class="headline">Edit Role</span>
                </VCardTitle>

                <VCardText>
                    <VContainer>

                        <VRow>
                            <!-- fullName -->
                            <VCol cols="12" md="12">
                                <VTextField v-model="editedItem.name" label="Name" :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="12">
                                <VTextField v-model="editedItem.guard" label="Guard" :rules="[requiredValidator]" />
                            </VCol>

                        </VRow>
                    </VContainer>
                </VCardText>

                <VCardActions>
                    <VSpacer />

                    <VBtn color="error" variant="outlined" @click="close">
                        Cancel
                    </VBtn>

                    <VBtn color="success" variant="elevated" @click="update">
                        Save
                    </VBtn>

                </VCardActions>
            </VCard>
        </VForm>
    </VDialog>

    <!-- 👉 Delete Dialog  -->
    <VDialog v-model="deleteDialog" max-width="500px">
        <VCard>
            <VCardTitle>
                Are you sure you want to delete this item?
            </VCardTitle>

            <VCardActions>
                <VSpacer />

                <VBtn color="error" variant="outlined" @click="closeDelete">
                    Cancel
                </VBtn>

                <VBtn color="success" variant="elevated" @click="deleteItemConfirm">
                    OK
                </VBtn>

                <VSpacer />
            </VCardActions>
        </VCard>
    </VDialog>


    <!-- 👉 Add Dialog  -->
    <VDialog v-model="addDialog" max-width="600px">
        <VForm ref="refVFormAdd">
            <VCard>
                <VCardTitle>
                    <span class="headline">Add Role</span>
                </VCardTitle>

                <VCardText>
                    <VContainer>

                        <VRow>
                            <!-- fullName -->
                            <VCol cols="12" md="12">
                                <VTextField v-model="defaultItem.name" label="Name" :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="12">
                                <VTextField v-model="defaultItem.guard" label="Guard" :rules="[requiredValidator]" />
                            </VCol>

                        </VRow>
                    </VContainer>
                </VCardText>

                <VCardActions>
                    <VSpacer />

                    <VBtn color="error" variant="outlined" @click="closeAdd">
                        Cancel
                    </VBtn>

                    <VBtn color="success" variant="elevated" @click="save">
                        Save
                    </VBtn>

                </VCardActions>
            </VCard>
        </VForm>
    </VDialog>
</template>
<style scoped>
.custom-button {
    width: 100%;
    height: 48px;
    /* This value should match the height of your input fields */
}
</style>
