<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Providers List View',
  },
})
import { usePractitionerStore } from '@/stores/practitionerStore';
import { useUserStore } from '@/stores/userStore';
const practitionerStore = usePractitionerStore();
const { currentUser, currentRole, logout, authService } = useAuth()
const userStore = useUserStore()
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const dataTable = ref(null);
const isUserEditDialogVisible = ref(false)
const isUserAddDialogVisible = ref(false)
const route = useRoute()
const router = useRouter()
const selectUser = ref(null);
const userFecth = ref([]);
const editUser = ref(null);
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'fname' },
  { title: 'Username', key: 'username' },
  { title: 'Actions', key: 'actions', sortable: false, searchable: false },
]


const reload = () => dataTable.value.reload()

onMounted(() => {

  reload()
})


const providerLogin = async (item) => {
  try {
    showLoader();

    // Open a new tab with a loading state or login processing
    const loginWindow = window.open('/provider/login-processing', '_blank');

    // Perform the login in the background (current tab)
    await authService.value.providerLogin(item.id);
    hideLoader();

    // After login, resolve the target path
    const targetPath = route.query.to ? String(route.query.to) : '/provider/calendar';
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

  <DataTable ref="dataTable" :cardTitle="$t('Providers')" btnTitle="" :headers="headers"
    :api="SUPER_ADMIN_PROVIDER_LIST" :sortBy="sortByData" @onBtnClick="isUserAddDialogVisible = true">
    <!-- Custom slot for the Status column -->
    <template #item.status="{ item }">
      <span>{{ item.status == 1 ? 'Active' : 'Deactive' }}</span>

    </template>

    <!-- Actions slot for edit and delete buttons -->
    <template #item.actions="{ item }">
      <VBtn color="primary" variant="tonal" size="small" @click="providerLogin(item)" prepend-icon="tabler-login">
        Login
      </VBtn>

    </template>
  </DataTable>





</template>
