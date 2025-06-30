<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Lab Test View',
  },
})
import { labtestService } from '@/services/labtestService';
import { useLabtestStore } from '@/stores/labtestStore';
import AddLab from '@/views/provider/labtests/add.vue';
// import EditLab from '@/pages/apps/settings/labtests/EditLab.vue';
import { format } from 'date-fns';

const labtestStore = useLabtestStore()
const router = useRouter();
const route = useRoute();
const isAddCustomerDrawerOpen = ref(false)
const deleteDialog = ref(false)
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const selectedLab = ref(null)
const id = route.params.id

const dataTable = ref(null);
// headers
const headers = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'Test Name',
    key: 'test_name',
  },
  {
    title: 'Lab Name',
    key: 'lab_name',
  },
  {
    title: 'Status',
    key: 'status',
  },
  {
    title: 'Actions',
    key: 'actions',
    searchable: false
  },
]

const reload = () => dataTable.value.reload()

const resolveStatusVariant = status => {
  if (status === 'active')
    return {
      color: 'primary',
      text: 'Active',
    }
  else
    return {
        color: 'error',
        text: 'Inactive',
    }
}

const formatDateTime = (date) => {
  return format(date, 'MM-dd-yyyy');
};

const editItem = async (item) => {

  let temp = labtestService.mapLabtestData(item)
  selectedLab.value = temp
  console.log("item", item, temp);
  labtestStore.isDrawerOpen = true
}

const deleteItem = item => {
  let temp = labtestService.mapLabtestData(item)
  selectedLab.value = temp
  deleteDialog.value = true
}
const closeDelete = () => {
  deleteDialog.value = false
}
const deleteItemConfirm = async () => {

  await labtestStore.deleteLabtest(selectedLab.value.id)

  closeDelete()
  reload()

}

onMounted(() => {
  reload()
})
const handleParentAdded = async (msg) => {
  if (msg == 'success') {
    reload()
  }

}

watch(() => labtestStore.isDrawerOpen, (val) => {
  if (!val) {
    reload()
  }
})
</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <DataTable ref="dataTable" :cardTitle="$t('Lab Tests')" :btnTitle="$t('Add New Lab Test')" :headers="headers"
        :api="ADMIN_GET_LABTESTS_API+'/'+id" :sortBy="sortByData"
        @onBtnClick="[labtestStore.isDrawerOpen = true, selectedLab = null]">
        

        <!-- status -->
        <template #item.status="{ item }">
          <VChip :color="resolveStatusVariant(item.status).color" density="comfortable">
            {{ resolveStatusVariant(item.status).text }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="demo-space-x">
            <VMenu transition="scale-transition">
              <template #activator="{ props }">
                <VBtn color="primary" v-bind="props">
                  {{ $t('Options') }}
                </VBtn>
              </template>

              <v-list lines="one" style="padding-right: 5px;padding-left: 5px;">
                <v-list-item style="border-bottom: 1px solid #eadfdf;padding-right: 15px;padding-left: 15px;"
                  @click="editItem(item)" v-if="$can('read', 'Lab Test Edit') && item.guard_name != 'default'">
                  <VIcon icon="tabler-edit" /> {{ $t('Edit') }}
                </v-list-item>
                <v-list-item style="border-bottom: 1px solid #eadfdf;padding-right: 15px;padding-left: 15px;"
                  @click="deleteItem(item)" v-if="$can('read', 'Lab Test Delete') && item.guard_name != 'default'">
                  <VIcon icon="tabler-trash" /> {{ $t('Delete') }}
                </v-list-item>
              </v-list>
            </VMenu>
          </div>
        </template>
      </DataTable>
    </v-col>

    <AddLab :labtest="selectedLab" v-if="labtestStore.isDrawerOpen" />
  </v-row>

  <!-- 👉 Delete Dialog  -->
  <VDialog v-model="deleteDialog" max-width="500px">
    <VCard>
      <VCardTitle>
        {{ $t('Are you sure you want to delete this item?') }}
      </VCardTitle>

      <VCardActions>
        <VSpacer />

        <VBtn color="error" variant="outlined" @click="closeDelete">
          {{ $t('Cancel') }}
        </VBtn>

        <VBtn color="success" variant="elevated" @click="deleteItemConfirm">
          {{ $t('Ok') }}
        </VBtn>

        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>

</template>
<style scoped>
.custom-button {
  width: 100%;
  height: 48px;
  /* This value should match the height of your input fields */
}
</style>
