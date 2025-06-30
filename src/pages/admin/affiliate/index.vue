<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Affiliate Users View',
  },
})


const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);
const isUserEditDialogVisible = ref(false)
const isUserAddDialogVisible = ref(false)
const { currentUser, currentRole, logout, authService } = useAuth()
const route = useRoute()
const router = useRouter()
const selectUser = ref(null);
const userFecth = ref([]);
const editUser = ref(null);
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'first_name' },
  { title: 'Email', key: 'email' },
  { title: 'Date Of Birth', key: 'dob' },
  { title: 'Gender', key: 'gender' },
  { title: 'Actions', key: 'actions', sortable: false, searchable: false },
]


const reload = () => dataTable.value.reload()

onMounted(() => {

  reload()
})

const affiliateLogin = async (item) => {
  try {
    showLoader();

    // Open a new tab with a loading state or login processing
    const loginWindow = window.open('/affiliate/login-processing', '_blank');

    // Perform the login in the background (current tab)
    await authService.value.affiliateLogin(item.id);

    hideLoader();

    // After login, resolve the target path
    const targetPath = route.query.to ? String(route.query.to) : '/affiliate/dashboard';
    const resolvedRoute = router.resolve(targetPath);

    // Redirect the new tab to the target path
    if (loginWindow) {
      loginWindow.location.href = resolvedRoute.href;
    } else {
      // Fallback: Redirect in the current tab if popup was blocked
      router.replace(targetPath);
    }
  } catch (err) {
    hideLoader();
    addAlert(err.response?._data?.message ?? err.message, 'error');
    console.error(err);
  }
};



</script>



<template>

  <DataTable ref="dataTable" :cardTitle="$t('Affiliate Users')" btnTitle="" :headers="headers"
    :api="SUPER_ADMIN_AFFILIATE_LIST" :sortBy="sortByData" @onBtnClick="isUserAddDialogVisible = true">
    <!-- Custom slot for the Status column -->
    <template #item.first_name="{ item }">
      <span>{{ item.first_name }} {{ item.last_name }}</span>

    </template>
    <template #item.dob="{ item }">
      {{ dateFormat(item.dob) }}

    </template>
    <!-- Actions slot for edit and delete buttons -->
    <template #item.actions="{ item }">
      <VBtn color="primary" variant="tonal" size="small" @click="affiliateLogin(item)" prepend-icon="tabler-login">
        Login
      </VBtn>

    </template>
  </DataTable>





</template>
