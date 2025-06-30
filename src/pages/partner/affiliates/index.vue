<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Partner Affiliates View',
    },
})

import { useRouter } from 'vue-router';
const router = useRouter()
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);

const headers = [
    { title: 'ID', key: 'id' },
    { title: 'Name', key: 'fullName' },
    { title: 'Email', key: 'email' },
    { title: 'Gender', key: 'gender' },
    { title: 'Phone No', key: 'phone_no' },
    { title: 'DOB', key: 'dob' },
    //   { title: 'Actions', key: 'actions', sortable: false, searchable: false },
]

const reload = () => dataTable.value.reload()
// Fetch users when the component mounts
onMounted(() => {
    reload()
})

const addUser = () => {
    router.push({ name: 'partner-affiliates-add' })
}
</script>



<template>

    <DataTable ref="dataTable" :cardTitle="$t('Affiliate Users')" :btnTitle="$t('Add New Affiliate')" :headers="headers"
        :api="GET_PARTNER_AFFILIATES" :sortBy="sortByData" @onBtnClick="addUser">
        <template #item.fullName="{ item }">
            <div class="d-flex align-center gap-x-4">
                <VAvatar size="34" variant="primary" color="primary">
                    <span>{{ avatarText(item.fullName) }} </span>
                </VAvatar>
                <div class="d-flex flex-column">
                    <h6 class="text-base">


                        {{ item.fullName }}

                    </h6>
                    <div class="text-sm">
                        {{ item.email }}
                    </div>
                </div>
            </div>
        </template>
        <template #item.dob="{ item }">
            {{ dtFormat(item.dob) }}
        </template>
    </DataTable>
</template>
