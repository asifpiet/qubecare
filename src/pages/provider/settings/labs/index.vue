<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Labs View',
  },
})
import { labService } from '@/services/labService';
import { useLabStore } from '@/stores/labStore';
import AddLab from '@/views/provider/labs/add.vue';
// import EditLab from '@/pages/apps/settings/labs/EditLab.vue';
import { format } from 'date-fns';

const labStore = useLabStore()
const router = useRouter();
const isAddCustomerDrawerOpen = ref(false)
const deleteDialog = ref(false)
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const selectedLab = ref(null)


const dataTable = ref(null);
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
  {
    title: 'Phone',
    key: 'phone_number',
  },
  {
    title: 'Fax',
    key: 'fax_number',
  },
  {
    title: 'Status',
    key: 'status',
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

  let temp = labService.mapLabData(item)
  selectedLab.value = temp
  console.log("item", item, temp);
  labStore.isDrawerOpen = true
}

const deleteItem = item => {
  let temp = labService.mapLabData(item)
  selectedLab.value = temp
  deleteDialog.value = true
}
const closeDelete = () => {
  deleteDialog.value = false
}
const deleteItemConfirm = async () => {

  await labStore.deleteLab(selectedLab.value.id)

  closeDelete()
  reload()

}

onMounted(() => {
  reload()
})

watch(() => labStore.isDrawerOpen, (val) => {
  if (!val) {
    reload()
  }
})

const viewTestItem = item => {
  router.push({ name: "provider-settings-tests-id", params: { id: item.id } });

}
</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <DataTable ref="dataTable" :cardTitle="$t('Labs')" :btnTitle="$t('Add New Lab')" :headers="headers"
        :api="ADMIN_GET_LABS_API" :sortBy="sortByData"
        @onBtnClick="[labStore.isDrawerOpen = true, selectedLab = null]">

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
          <div class="demo-space-x">
            <VMenu transition="scale-transition">
              <template #activator="{ props }">
                <VBtn color="primary" v-bind="props">
                  {{ $t('Options') }}
                </VBtn>
              </template>

              <v-list lines="one" style="padding-right: 5px;padding-left: 5px;">
                <v-list-item style="border-bottom: 1px solid #eadfdf;padding-right: 15px;padding-left: 15px;"
                  @click="viewTestItem(item)" v-if="$can('read', 'Lab Test View') && item.guard_name != 'default'">
                  <VIcon icon="tabler-flask" /> {{ $t('Tests') }}
                </v-list-item>
                <v-list-item style="border-bottom: 1px solid #eadfdf;padding-right: 15px;padding-left: 15px;"
                  @click="editItem(item)" v-if="$can('read', 'Labs Edit') && item.guard_name != 'default'">
                  <VIcon icon="tabler-edit" /> {{ $t('Edit') }}
                </v-list-item>
                <v-list-item style="border-bottom: 1px solid #eadfdf;padding-right: 15px;padding-left: 15px;"
                  @click="deleteItem(item)" v-if="$can('read', 'Labs Delete') && item.guard_name != 'default'">
                  <VIcon icon="tabler-trash" /> {{ $t('Delete') }}
                </v-list-item>
              </v-list>
            </VMenu>
          </div>
        </template>
      </DataTable>
    </v-col>

    <AddLab :lab="selectedLab" v-if="labStore.isDrawerOpen" />
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
