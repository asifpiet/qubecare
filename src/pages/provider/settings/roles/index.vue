<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Roles View',
  },
})
import { roleService } from '@/services/roleService';
import { useRoleStore } from '@/stores/roleStore';
import AddRole from '@/views/provider/roles/AddRole.vue';
// import EditRole from '@/pages/apps/settings/roles/EditRole.vue';
import { format } from 'date-fns';

const roleStore = useRoleStore()
const router = useRouter();
const isAddCustomerDrawerOpen = ref(false)
const deleteDialog = ref(false)
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const selectedRole = ref(null)


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

const reload = () => dataTable.value.reload()

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

  let temp = roleService.mapRoleData(item)
  selectedRole.value = temp
  console.log("item", item, temp);
  roleStore.isDrawerOpen = true
}

const deleteItem = item => {
  let temp = roleService.mapRoleData(item)
  selectedRole.value = temp
  deleteDialog.value = true
}
const permissionRole = item => {
  router.push({ name: "provider-settings-roles-assign-permission-id", params: { id: item.id } });

}
const closeDelete = () => {
  deleteDialog.value = false
}
const deleteItemConfirm = async () => {

  await roleStore.deleteRole(selectedRole.value.id)

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

watch(() => roleStore.isDrawerOpen, (val) => {
  if (!val) {
    reload()
  }
})
</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <DataTable ref="dataTable" :cardTitle="$t('Roles')" :btnTitle="$t('Add New Role')" :headers="headers"
        :api="ADMIN_GET_ROLES_API" :sortBy="sortByData"
        @onBtnClick="[roleStore.isDrawerOpen = true, selectedRole = null]">
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
          <div class="demo-space-x">
            <VMenu transition="scale-transition">
              <template #activator="{ props }">
                <VBtn color="primary" v-bind="props">
                  {{ $t('Options') }}
                </VBtn>
              </template>

              <v-list lines="one" style="padding-right: 5px;padding-left: 5px;">
                <v-list-item style="border-bottom: 1px solid #eadfdf;padding-right: 15px;padding-left: 15px;"
                  @click="editItem(item)" v-if="$can('read', 'Roles Edit') && item.guard_name != 'default'">
                  <VIcon icon="tabler-edit" /> {{ $t('Edit') }}
                </v-list-item>
                <v-list-item style="border-bottom: 1px solid #eadfdf;padding-right: 15px;padding-left: 15px;"
                  @click="deleteItem(item)" v-if="$can('read', 'Roles Delete') && item.guard_name != 'default'">
                  <VIcon icon="tabler-trash" /> {{ $t('Delete') }}
                </v-list-item>
                <v-list-item style="border-bottom: 1px solid #eadfdf;padding-right: 15px;padding-left: 15px;"
                  @click="permissionRole(item)" v-if="$can('read', 'Roles Permissions')">
                  <VIcon icon="tabler-shield-half" /> {{ $t('Permissions') }}
                </v-list-item>
              </v-list>
            </VMenu>
          </div>
        </template>
      </DataTable>
    </v-col>

    <AddRole :role="selectedRole" v-if="roleStore.isDrawerOpen" />
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
