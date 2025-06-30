<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'User Management View',
  },
})

import AddUser from '@/pages/provider/settings/user-mangement/AddUser.vue';
import EditUser from '@/pages/provider/settings/user-mangement/EditUser.vue';
import { usePractitionerStore } from '@/stores/practitionerStore';
import { useUserStore } from '@/stores/userStore';
import { GET_USERS_LIST } from '@/utils/constants';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
const practitionerStore = usePractitionerStore();
const userStore = useUserStore()
const sortByData = ref([{ 'key': 'user_id', 'order': 'desc' }])
const dataTable = ref(null);
const isUserEditDialogVisible = ref(false)
const isUserAddDialogVisible = ref(false)

const selectUser = ref(null);
const userFecth = ref([]);
const editUser = ref(null);
const headers = [
  { title: 'ID', key: 'user_id' },
  { title: 'Name', key: 'fullName' },
  { title: 'Username', key: 'username' },
  { title: 'Actions', key: 'actions', sortable: false, searchable: false },
]

await practitionerStore.practitionersList()
const fetchUsers = async () => {
  try {

    // const { data } = await useApi(createUrl(GET_USERS_LIST));
    // // Commit the fetched user data to Vuex 
    // console.log(data.value)
    // store.commit('setUser', data.value.data);
    const usersFromStore = practitionerStore.practitioners;
    console.log(usersFromStore)
    userFecth.value = usersFromStore.map(user => ({
      ...user,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    }));

  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
const reload = () => dataTable.value.reload()
// Fetch users when the component mounts
onMounted(() => {
  fetchUsers()
  reload()
})

// watch(selectUser, async (newValue) => {
//   console.log("Selected USer:", newValue);
//   showLoader()
//   const res = await $api(`${GET_SINGLE_USER}/` + newValue, {
//     method: 'GET',
//     onResponseError({ response }) {
//       hideLoader()
//     },
//   });
//   console.log('res', res.data);
//   editUser.value = res.data
//   hideLoader()
// });
const openEditDialog = async (item) => {

  await userStore.getUserByID(item.user_id)
  editUser.value = userStore.user
  editUser.value.uuid = item.id

  isUserEditDialogVisible.value = true;


}
const handleUserSubmit = (msg) => {
  // Close the dialog when the AddUser component emits the submit event
  if (msg == 'success') {
    isUserAddDialogVisible.value = false;
    isUserEditDialogVisible.value = false;
    fetchUsers()
    reload()
  }
}
// const updatedstatus = async (msg) => {
//   if (!selectUser.value) {
//     alert('please select user')
//   } else {
//     await store.dispatch('updateUserStatus', {
//       id: selectUser.value.id,
//     });
//   }
// }

</script>



<template>

  <DataTable ref="dataTable" :cardTitle="$t('User Management')"
    :btnTitle="$can('read', 'User Management Add') ? $t('Add New User') : ''" :headers="headers" :api="GET_USERS_LIST"
    :sortBy="sortByData" @onBtnClick="isUserAddDialogVisible = true">
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
    <!-- Actions slot for edit and delete buttons -->
    <template #item.actions="{ item }">
      <IconBtn @click="openEditDialog(item)"
        v-if="$can('read', 'User Management Edit') && $can('read', 'User Management Add')">
        <VIcon icon="tabler-edit" />
      </IconBtn>
      <IconBtn @click="deleteItem(item)" v-if="$can('read', 'Intake Questions Delete')" style="display: none;">
        <VIcon icon="tabler-trash" />
      </IconBtn>
    </template>
  </DataTable>



  <VNavigationDrawer v-model="isUserEditDialogVisible" v-if="editUser" temporary :width="600" location="end"
    class="scrollable-content">
    <AppDrawerHeaderSection :title="$t('Edit User')" @cancel="[isUserEditDialogVisible = false, editUser = null]" />
    <VDivider />
    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <EditUser :user-data="userFecth" @submit="handleUserSubmit" :edit-user="editUser" />
    </PerfectScrollbar>
  </VNavigationDrawer>


  <VNavigationDrawer v-model="isUserAddDialogVisible" temporary :width="600" location="end" class="scrollable-content">
    <AppDrawerHeaderSection :title="$t('Add User')" @cancel="isUserAddDialogVisible = false" />
    <VDivider />
    <PerfectScrollbar :options="{ wheelPropagation: false }">

      <AddUser :user-data="userFecth" @submit="handleUserSubmit" />
    </PerfectScrollbar>
  </VNavigationDrawer>



</template>
