<script setup>
import { dateFormat } from '@/plugins/globalFunctions';
import { useMedicationStore } from '@/stores/medicationStore';
import API from '@/utils/apiDatable';
import AddMedican from '@/views/apps/patient/Dashboard/MedSupplement/AddMedican.vue';
import UpdateMedican from '@/views/apps/patient/Dashboard/MedSupplement/UpdateMedican.vue';
import debounce from 'lodash.debounce';
import { useStore } from 'vuex';
const store = useStore()
const medicationStore = useMedicationStore()
const searchQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const isActionDialogVisible = ref(false)
const isEditNewUserDrawerVisible = ref(false)
const isTextMessageUserDrawerVisible = ref(false)
const sortByData = ref([{ 'key': 'drug', 'order': 'desc' }])
const isTaskUserDrawerVisible = ref(false)
const isVitalDrawerVisible = ref(false)
const isLabDiagnosticsDrawerVisible = ref(false)
const isSubmitIntakesDrawerVisible = ref(false)
const isAppointmentsDrawerVisible = ref(false)
const isAddPaymentDrawerVisible = ref(false)
const isAddNewUserDrawerVisible = ref(false)
const isphoneLogDrawerVisible = ref(false)
const isMessageListDrawerVisible = ref(false)
const isDocumentDrawerVisible = ref(false)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const selectedRows = ref([])
const patientToEdit = ref();
const isDisable = ref();
const usersList = ref([]);
const isEmailDrawerVisible = ref(false)
const isLoading = ref(false)
const isDialogVisible = ref(false)
const search = ref('')
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);
const itemsPerPage = ref(10);
const isHideSubjectiveArray = ref(null);
const medData = ref(null);
const isEditDialogVisible = ref(false)
const statusValue = ref()
const isHideSubjectiveEntries = ref()
const isHideDeactivatedMeds = ref(false)
const presherbsrc = ref(null)
const sourceFilters = ref(null)
const emit = defineEmits([
  'update:isDrawerOpen',
])
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  }
})
const headers = [
  {
    title: 'Prescription Formula/Herb',
    key: 'drug',
  },
  {
    title: 'Dosing Detail',
    key: 'refills',

  },
  {
    title: 'started',
    key: 'start_date',

  },
  {
    title: 'Discounted',
    key: 'end_date',

  },
  {
    title: 'Source',
    key: 'presherb_src',
    name: 'presherb_src'
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    searchable: false
  },
]
onMounted(async () => {

  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
  //emailList.value=store.getters.getEmailList
  //console.log('ssdss',emailList.value)
})


const loadItems = debounce(async ({ page, itemsPerPage, sortBy }) => {
  const payload = {
    page,
    itemsPerPage,
    sortBy,
    filters: {
      src: sourceFilters.value ? sourceFilters.value : 'all',
      isHideSubjectiveEntries: isHideSubjectiveArray.value ? isHideSubjectiveArray.value : [],
      status: statusValue.value ? statusValue.value : 'all',

    },
    search: search.value,
  }
  // console.log("sortByData.value==",sortByData.value, sortBy);
  sortByData.value = sortBy
  console.log("records", page, itemsPerPage, sortBy);
  loading.value = true;
  let uuid = store.getters.getPatientPorfile.uuid;
  const data = await API.getDataTableRecord(GET_PATIENT_MEDICAN_DATA + '/' + uuid, payload, headers);
  console.log(data.total)
  serverItems.value = data.items;
  totalItems.value = data.total;

  loading.value = false;
}, 500);



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
const addNewUser = async userData => {
  if (userData.id == null) {
    console.log("userData", userData);
    const res = await $api(REGISTER_PATIENT_API, {
      method: 'POST',
      body: userData,
    });
    console.log('addPatient', res.data);

    await store.dispatch('savePatientPorfile', {
      patientId: res.data.patientId,
      uuid: res.data.uuid,
      firstName: res.data.firstName,
      lastName: res.data.lastName,
      fullName: res.data.firstName + ' ' + res.data.lastName,
      preferredPhone: res.data.preferredPhone,
      address: res.data.address,
      city: res.data.city,
      state: res.data.state,
      zipcode: res.data.zipcode,
    });
  } else {
    updateNewUser(userData);
  }
  if (userData.checkIsFormOpen == "saveClose") {
    isTabEnable();
  }
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
}



const editPatient = async id => {
  isEditNewUserDrawerVisible.value = true;
  await store.dispatch('editPatientProfile', {
    id: id
  })

}

const isTabEnable = async () => {
  isDisable.value = true
  await store.dispatch('savePatientPorfile', {
    patientId: null,
    firstName: null,
    lastName: null
  })
}
const actionBox = async (id) => {
  // patientToEdit.value = res;
  await store.dispatch('editPatientProfile', {
    id: id
  })

}
const widgetData = ref([
  {
    title: 'Session',
    value: '21,459',
    change: 29,
    desc: 'Total Users',
    icon: 'tabler-users',
    iconColor: 'primary',
  },
  {
    title: 'Paid Users',
    value: '4,567',
    change: 18,
    desc: 'Last Week Analytics',
    icon: 'tabler-user-plus',
    iconColor: 'error',
  },
  {
    title: 'Active Users',
    value: '19,860',
    change: -14,
    desc: 'Last Week Analytics',
    icon: 'tabler-user-check',
    iconColor: 'success',
  },
  {
    title: 'Pending Users',
    value: '237',
    change: 42,
    desc: 'Last Week Analytics',
    icon: 'tabler-user-search',
    iconColor: 'warning',
  },
])

const onSubmitAddMedican = async (medican) => {
  console.log("medican", medican);
  await store.dispatch('saveMedican', {
    uuid: store.getters.getPatientPorfile.uuid,
    medican
  })
  isDialogVisible.value = false;
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
};

const srcOptions = [
  'All',
  'Medican Only',
  'Supplement Only',
];

const medicanFilter = () => {
  console.log("presherbsrc", presherbsrc.value);
  console.log('xcxccxc', isHideSubjectiveEntries.value);
  isHideSubjectiveArray.value = [];
  if (isHideSubjectiveEntries.value == true) {
    isHideSubjectiveArray.value = ["Supplement-Subjective", "Rx-Subjective"];
    //  isHideSubjectiveArray.value = "['Supplement-Subjective' , 'Supplement-Inventory', 'Supplement-SuperBill',  'Supplement' ]";
  }
  // sourceFilters.value = 'all';
  if (presherbsrc.value == "Supplement Only") {
    sourceFilters.value = ["Supplement-Subjective", "Supplement-Inventory", "Supplement-SuperBill", "Supplement"];
  }
  // sourceFilters.value = 'all';
  if (presherbsrc.value == 'Medican Only') {
    sourceFilters.value = ["Rx-Subjective", "Rx-eRx", "Rx-Manual/Fax"];
  }
  if (presherbsrc.value == 'All') {
    sourceFilters.value = 'all';
  }

  // console.log(isHideDeactivatedMeds.value);

  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
}

// Create a computed object holding the values to be watched
const watchedValues = computed(() => ({
  presherbsrc: presherbsrc.value,
  isHideSubjectiveEntries: isHideSubjectiveEntries.value,
  isHideDeactivatedMeds: isHideDeactivatedMeds.value
}));


watch(watchedValues, (newValues) => {
  const { presherbsrc: newPresherbSrc, isHideSubjectiveEntries: newIsHideSubjectiveEntries, isHideDeactivatedMeds: newIsHideDeactivatedMeds } = newValues;
  presherbsrc.value = newPresherbSrc;
  isHideSubjectiveArray.value = newIsHideSubjectiveEntries;

  if (newIsHideDeactivatedMeds) {
    statusValue.value = 'inactive';
  } else {
    statusValue.value = 'all';
  }

  medicanFilter();
});

const editMed = (item) => {
  console.log("item", item);
  medData.value = item;
  isEditDialogVisible.value = true;
}


const updateMedicine = async (medican) => {
  console.log("medican", medican);
  await store.dispatch('updateMedican', {
    id: store.getters.getPatientPorfile.patientId,
    medican
  })
  isEditDialogVisible.value = false;

  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });

};
const closeNavigationDrawers = () => {
  console.log('closeNavigationDrawers');
  isEditDialogVisible.value = false;
  isDialogVisible.value = false;
}
</script>

<template>
  <section>

    <div class="d-flex mb-6" v-if="users">
      <VRow>
        <template v-for="(data, id) in widgetData" :key="id">
          <VCol cols="12" md="3" sm="6">
            <VCard>
              <VCardText>
                <div class="d-flex justify-space-between">
                  <div class="d-flex flex-column gap-y-1">
                    <div class="text-body-1 text-high-emphasis">
                      {{ data.title }}
                    </div>
                    <div class="d-flex gap-x-2 align-center">
                      <h4 class="text-h4">
                        {{ data.value }}
                      </h4>
                      <div class="text-base" :class="data.change > 0 ? 'text-success' : 'text-error'">
                        ({{ prefixWithPlus(data.change) }}%)
                      </div>
                    </div>
                    <div class="text-sm">
                      {{ data.desc }}
                    </div>
                  </div>
                  <VAvatar :color="data.iconColor" variant="tonal" rounded size="42">
                    <VIcon :icon="data.icon" size="26" />
                  </VAvatar>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </template>
      </VRow>
    </div>


    <VDivider />

    <VCardText class="d-flex flex-wrap gap-4">

      <VCheckbox v-model="isHideSubjectiveEntries" label="Hide Subjective Entries"></VCheckbox>
      <VCheckbox v-model="isHideDeactivatedMeds" label="Hide Deactivated Meds" @click="medicanFilter"></VCheckbox>

      <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
        <div style="inline-size: 15.625rem;">
          <v-select v-model="presherbsrc" :items="srcOptions" label="Filter" placeholder="Select Source"></v-select>
        </div>
        <div style="inline-size: 15.625rem;">
          <AppTextField v-model="search" placeholder="Search Drug" />
        </div>
        <!-- <div style="inline-size: 15.625rem;"> -->
        <!-- <AppSelect
                  v-model="occupation"
                  placeholder="More Options"
                  :items="['View Pdf']"
                />
          </div> -->

        <VBtn prepend-icon="tabler-plus" @click="[isDialogVisible = true]"
          v-if="$can('read', 'All Meds/Supplements Add')">
          Add New Entry
        </VBtn>

      </div>
    </VCardText>

    <VDivider />


    <!-- <VDataTableServer

        v-model:model-value="selectedRows"
        v-model:page="page"
        class="text-no-wrap"
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        :search="search"
        item-value="id"
        @update:options="loadItems"

     
      > -->
    <DataTable ref="dataTable" cardTitle="Medication" btnTitle="Add New Medication" :headers="headers"
      :api="GET_PATIENT_MEDICAN_DATA + '/' + props.patient.id" :sortBy="sortByData"
      @onBtnClick="[medicationStore.isDrawerOpen = true, selectedPatient = null]">
      <template #item.start_date="{ item }">
        <div class="text-body-1 text-high-emphasis text-capitalize">
          {{ dateFormat(item.start_date) }}
        </div>
      </template>
      <template #item.end_date="{ item }">
        <div class="text-body-1 text-high-emphasis text-capitalize">
          {{ dateFormat(item.end_date) }}
        </div>
      </template>
      <template #item.refills="{ item }">
        <VRow style="width:250px; padding:10px 3px">
          <VCol cols="4">
            <AppTextField v-model="item.BB" label="BB" width="70" readOnly />
          </VCol>
          <VCol cols="4">
            <AppTextField v-model="item.B" label="B" width="70" readOnly />
          </VCol>
          <VCol cols="4">
            <AppTextField v-model="item.BL" label="BL" width="70" placeholder="BB" readOnly />
          </VCol>
          <VCol cols="4">
            <AppTextField v-model="item.L" label="L" width="70" readOnly />
          </VCol>
          <VCol cols="4">
            <AppTextField v-model="item.BD" label="BD" width="70" readOnly />
          </VCol>
          <VCol cols="4">
            <AppTextField v-model="item.D" label="D" width="70" placeholder="BB" readOnly />
          </VCol>
        </VRow>

      </template>


      <template #item.actions="{ item }">
        <IconBtn @click="editMed(item)">
          <VIcon icon="tabler-edit" />
        </IconBtn>
        <!-- <IconBtn @click="deleteUser(item.id)">
            <VIcon icon="tabler-trash" />
          </IconBtn> -->

      </template>
    </DataTable>
  </section>

  <VDialog v-model="isDialogVisible" max-width="1300">
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />
    <VCard title="Add Medication">
      <VCardText>
        <AddMedican @addMedican="onSubmitAddMedican" @customEvent="closeNavigationDrawers" />
      </VCardText>
    </VCard>
  </VDialog>


  <VDialog v-model="isEditDialogVisible" max-width="1300">
    <DialogCloseBtn @click="isEditDialogVisible = !isEditDialogVisible" />
    <VCard title="Edit Medication">
      <VCardText>
        <UpdateMedican :medSupplementData="medData" @updateMedican="updateMedicine"
          @customEvent="closeNavigationDrawers" />
      </VCardText>
    </VCard>
  </VDialog>

</template>
<style scope>
/* .v-table__wrapper {
  overflow: hidden !important;
} */
</style>
