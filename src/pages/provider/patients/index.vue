<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Patient View',
  },
})
import { patientService } from '@/services/patientService';
import { usePatientStore } from '@/stores/patientStore';
import AddNewUserDrawer from '@/views/provider/patients/AddPatient.vue';
import actions from '@/views/provider/patients/actions.vue';
import { ref } from 'vue';

const patientStore = usePatientStore()
const selectedPatient = ref(null)
const isActionDialogVisible = ref(false)
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);
const headers = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'Patient',
    key: 'full_name',
    name: 'full_name'
  },
  {
    title: 'Date of Birth',
    key: 'DOB',
  },
  {
    title: 'Phone',
    key: 'preferredPhone',
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

const actionBox = async (item) => {
  console.log('item', item)
  selectedPatient.value = patientService.mapListPatientData(item)
}


const reload = () => dataTable.value.reload()

watch(() => patientStore.isDrawerOpen, (val) => {
  if (!val) {
    reload()
  }
})

const calculateAge = (birthdateStr) => {
  if(!birthdateStr) return null;
  const today = new Date();
  const birthDate = new Date(birthdateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  
  const hasBirthdayPassedThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  
  if (!hasBirthdayPassedThisYear) {
    age--;
  }

  return `${age} years old`;
}
</script>

<template>
  <section>

    <DataTable ref="dataTable" :cardTitle="$t('Patients')" :btnTitle="$t('Add New Patient')" :headers="headers"
      :api="PATIENT_API_DATATABLE" :sortBy="sortByData"
      @onBtnClick="[patientStore.isDrawerOpen = true, selectedPatient = null]">
      <template #item.id="{ item }">
        <div class="text-primary font-weight-medium">
          {{ item.id }}
        </div>
      </template>
      <template #item.full_name="{ item }">
        <div class="d-flex align-center gap-x-4">
          <VAvatar size="34" :variant="!item.avatar ? 'tonal' : undefined"
            :color="!item.avatar ? 'primary' : undefined">
            <VImg v-if="item.avatar" :src="item.avatar" />
            <span v-else>{{ avatarText(item.fname) }}{{ avatarText(item.lname) }}</span>
          </VAvatar>
          <div class="d-flex flex-column">
            <h6 class="text-base">

              <RouterLink :to="{ path: '/provider/patients/dashboard/' + item.id }"
                class="font-weight-medium text-link">
                {{ item.firstName }} {{ item.lastName }}
              </RouterLink>
            </h6>
            <div class="text-sm">
              {{ item.email }}
            </div>
          </div>
        </div>
      </template>

      <template #item.role="{ item }">
        <div class="d-flex align-center gap-x-2">
          <VIcon :size="22" :icon="resolveUserRoleVariant(item.role).icon"
            :color="resolveUserRoleVariant(item.role).color" />

          <div class="text-capitalize text-high-emphasis text-body-1">
            {{ item.role }}
          </div>
        </div>
      </template>


      <template #item.plan="{ item }">
        <div class="text-body-1 text-high-emphasis text-capitalize">
          {{ item.currentPlan }}
        </div>
      </template>

      <template #item.DOB="{ item }">
        <!-- <div class="text-body-1 text-high-emphasis text-capitalize" v-if="item.DOB">
          {{ dateFormat(item.DOB) }}
        </div> -->
        <div class="d-flex flex-column" v-if="item.DOB">
          <p class="text-base mb-0 font-weight-medium">
            {{ dateFormat(item.DOB) }}
          </p>
          <div class="text-xs">
            {{ calculateAge(item.DOB) }}
          </div>
        </div>
        <div class="text-body-1 text-high-emphasis text-capitalize" v-else>

        </div>
      </template>



      <template #item.status="{ item }">
        <VChip :color="resolveUserStatusVariant(item.status)" size="small" label class="text-capitalize">
          {{ item.status }}
        </VChip>
      </template>


      <template #item.actions="{ item }">

        <VBtn icon variant="text" color="medium-emphasis">
          <VIcon icon="tabler-edit" location="top" @click="[patientStore.isDrawerOpen = true, selectedPatient = item]"
            v-if="$can('read', 'Patient Edit')" />
          <VTooltip location="top" transition="scale-transition" activator="parent">
            <span>{{ $t('Edit') }}</span>
          </VTooltip>
        </VBtn>
        <!-- <IconBtn @click="[patientStore.isDrawerOpen = true, selectedPatient = item]"
          >
          <VIcon  />
        </IconBtn> -->


        <VBtn icon variant="text" color="medium-emphasis">
          <VIcon icon="tabler-dots-vertical" location="top" @click="[isActionDialogVisible = true, actionBox(item)]" />
          <VTooltip location="top" transition="scale-transition" activator="parent">
            <span>{{ $t('Actions') }}</span>
          </VTooltip>
        </VBtn>
      </template>
    </DataTable>

    <actions :patient="selectedPatient" v-model:showDialog="isActionDialogVisible" />
    <AddNewUserDrawer :patientId="selectedPatient?.id" v-if="patientStore.isDrawerOpen" />
  </section>
</template>
