<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Affiliate Patients View',
  },
})

import AddNewUserDrawer from '@/pages/affiliate/AddPatient.vue';
import { usePatientStore } from '@/stores/patientStore';
import { dateFormat } from '@/utils/showLoader.js';
import { ref, watch } from 'vue';
const dataTable = ref(null);
const patientStore = usePatientStore()
const { currentUser, currentRole, logout } = useAuth()

const userData = currentUser;
let affiliateId = userData.value?.id
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const emit = defineEmits([
  'update:isDrawerOpen',
])
const headers = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'Patient',
    key: 'full_name',
  },
  {
    title: 'Date of Birth',
    key: 'DOB',
  },
  {
    title: 'Phone',
    key: 'phone_contact',
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    searchable: false
  },
]

const resolveUserRoleVariant = role => {
  const roleLowerCase = role.toLowerCase()
  if (roleLowerCase === 'subscriber')
    return {
      color: 'success',
      icon: 'tabler-user',
    }
  if (roleLowerCase === 'author')
    return {
      color: 'error',
      icon: 'tabler-device-desktop',
    }
  if (roleLowerCase === 'maintainer')
    return {
      color: 'info',
      icon: 'tabler-chart-pie',
    }
  if (roleLowerCase === 'editor')
    return {
      color: 'warning',
      icon: 'tabler-edit',
    }
  if (roleLowerCase === 'admin')
    return {
      color: 'primary',
      icon: 'tabler-crown',
    }

  return {
    color: 'primary',
    icon: 'tabler-user',
  }
}

const resolveUserStatusVariant = stat => {
  const statLowerCase = stat.toLowerCase()
  if (statLowerCase === 'pending')
    return 'warning'
  if (statLowerCase === 'active')
    return 'success'
  if (statLowerCase === 'inactive')
    return 'secondary'

  return 'primary'
}
const reload = () => dataTable.value.reload()
watch(
  () => patientStore.isDrawerOpen,
  (value) => {
    reload();
  }
);
</script>

<template>

  <section>
    <DataTable ref="dataTable" :cardTitle="$t('Patients')" btnTitle="" :headers="headers"
      :api="AFFILIATE_PATIENT_API_DATATABLE + '/' + affiliateId" :sortBy="sortByData">
      <template #item.full_name="{ item }">
        <div class="d-flex align-center gap-x-4">
          <VAvatar size="34" :variant="!item.avatar ? 'primary' : undefined"
            :color="!item.avatar ? 'primary' : undefined">
            <VImg v-if="item.avatar" :src="item.avatar" />
            <span v-else>{{ avatarText(item.fname) }}{{ avatarText(item.lname) }}</span>
          </VAvatar>
          <div class="d-flex flex-column">
            <h6 class="text-base">
              {{ item.fname }} {{ item.lname }}
            </h6>
            <div class="text-sm">
              {{ item.email }}
            </div>
          </div>
        </div>
      </template>

      <template #item.DOB="{ item }">
        <div class="text-body-1 text-high-emphasis text-capitalize">
          {{ item.DOB ? dtFormat(item.DOB) : null }}
        </div>
      </template>

      <template #item.actions="{ item }">
        <IconBtn @click="[patientStore.isDrawerOpen = true, selectedPatient = item]"
          v-if="$can('read', 'Affiliate Patients View')">
          <VIcon icon="tabler-edit" />
        </IconBtn>
      </template>

    </DataTable>

    <AddNewUserDrawer :patient="selectedPatient" v-if="patientStore.isDrawerOpen" />

  </section>
</template>
