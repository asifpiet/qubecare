<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Partner Providers View',
    },
})

import { useRouter } from 'vue-router';
const router = useRouter()
const sortByData = ref([{ 'key': 'user_id', 'order': 'desc' }])
const dataTable = ref(null);
const isUserAddDialogVisible = ref(false)

const headers = [
    { title: 'ID', key: 'user_id' },
    { title: 'Name', key: 'fullName' },
    { title: 'Username', key: 'username' },
    { title: 'Phone No', key: 'textMessageNumber' },
    { title: 'Commission %', key: 'partner_commission' },
    //   { title: 'Actions', key: 'actions', sortable: false, searchable: false },
]

const reload = () => dataTable.value.reload()
// Fetch users when the component mounts
onMounted(() => {
    reload()
})

const addProvider = () => {
    router.push({ name: 'partner-providers-add' })
}
</script>



<template>

    <DataTable ref="dataTable" :cardTitle="$t('Providers')" :btnTitle="$t('Add New Provider')" :headers="headers"
        :api="GET_PARTNER_PROVIDERS" :sortBy="sortByData" @onBtnClick="addProvider">
        <!-- Custom slot for the Status column -->
        <template #item.status="{ item }">
            <span>{{ item.status == 1 ? 'Active' : 'Deactive' }}</span>

        </template>
        <template #item.fullName="{ item }">
            <div class="d-flex align-center gap-x-4">
                <VAvatar size="34" :variant="!item.avatar ? 'primary' : undefined"
                    :color="!item.profile_picture ? 'primary' : undefined">
                    <VImg v-if="item.profile_picture" :src="item.profile_picture" />
                    <span v-else>{{ avatarText(item.fullName) }} </span>
                </VAvatar>
                <div class="d-flex flex-column">
                    <h6 class="text-base">


                        {{ item.fullName }}

                    </h6>
                    <div class="text-sm">
                        {{ item.emailAddress }}
                    </div>
                </div>
            </div>
        </template>

    </DataTable>
</template>
