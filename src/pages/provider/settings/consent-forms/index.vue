<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Consent View',
  },
})
import { useFormsStore } from '@/stores/formsStore';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const formsStore = useFormsStore();
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const router = useRouter();
const dataTable = ref(null);

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Practitioner', key: 'practationer_name' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false, searchable: false },
];

const reload = () => dataTable.value.reload()

onMounted(async () => {
  reload()
});
const addNewItem = () => {
  router.push({ name: 'provider-settings-consent-forms-add' });
};

const editItem = (item) => {
  router.push({
    name: 'provider-settings-consent-forms-edit-id',
    params: { id: item.id } // Use item.id here
  });
};



const deleteItem = async (item) => {
  await formsStore.deleteConsentForm(item.id)

  reload()
};
</script>

<template>
  <DataTable ref="dataTable" :cardTitle="$t('Consent Form')" :btnTitle="$t('Add New Consent')" :headers="headers"
    :api="GET_CONSENT_FORMS" :sortBy="sortByData" @onBtnClick="addNewItem">
    <!-- Custom slot for the Status column -->
    <template v-slot:[`item.status`]="{ item }">
      <span>{{ item.status == 1 ? 'Active' : 'Deactive' }}</span>

    </template>

    <!-- Actions slot for edit and delete buttons -->
    <template v-slot:[`item.actions`]="{ item }">
      <IconBtn @click="editItem(item)">
        <VIcon icon="tabler-edit" />
      </IconBtn>
      <IconBtn @click="deleteItem(item)" v-if="$can('read', 'Consent Delete')">
        <VIcon icon="tabler-trash" />
      </IconBtn>
    </template>
  </DataTable>
</template>

<style scoped>
.mt-4 {
  margin-top: 16px;
}
</style>
