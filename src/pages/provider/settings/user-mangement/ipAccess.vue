<script setup>
import { useStore } from 'vuex';
const store = useStore()


const isDialogVisible = ref(false);
const userIP = ref('');
const ipDescription = ref('');


// Options for selects  


const emit = defineEmits(['submit'])


const ipRecords = ref();
onMounted(async () => {
  await store.dispatch('getListIpAccess');
  ipRecords.value = store.getters.getIpAccessList
  console.log(store.getters.getIpAccessList)
})



const ipAddress = ref(null);
// Table headers definition
const headers = [
  { title: 'IP', key: 'ip' },
  { title: 'Added By', key: 'addedBy' },
  { title: 'Last Updated', key: 'lastUpdated' },
  { title: 'Description', key: 'description' },
  { title: 'Action', key: 'action', sortable: false },
];

// Methods for handling actions
const openDialog = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    userIP.value = data.ip;
    isDialogVisible.value = true;
  } catch (error) {
    console.error('Error fetching IP:', error);
  }
};

// Close dialog
const closeDialog = () => {
  isDialogVisible.value = false;
  ipDescription.value = '';
};

// Submit IP Whitelist
const submitWhitelist = async () => {

  console.log('Submitting IP Whitelist:', userIP.value, ipDescription.value);
  // Add the logic to whitelist the IP and close the dialog
  await store.dispatch('updateIpAccess', {
    ip: userIP.value,
    description: ipDescription.value,

  });
  closeDialog();

};

const deleteIP = (item) => {
  console.log('Delete IP:', item);
  ipRecords.value = ipRecords.value.filter(ip => ip.id !== item.id);
};

</script>
<template>
  <div>
    <!-- IP Access Record Title -->
    <h3>IP Access Record</h3>

    <!-- Add IP Button -->
    <VBtn prepend-icon="tabler-plus" @click="openDialog" outlined>
      Add my IP
    </VBtn>

    <!-- Data Table for IP Access Records -->
    <VDataTable :headers="headers" :items="ipRecords" item-value="id" no-data-text="No records found" class="mt-4">
      <!-- Slot for Customizing Table Columns -->
      <template v-slot:item.action="{ item }">
        <!-- Actions like Edit or Delete -->

        <VBtn icon @click="deleteIP(item)">
          <VIcon color="red">mdi-delete</VIcon>
        </VBtn>
      </template>
    </VDataTable>

    <VDialog v-model="isDialogVisible" max-width="500">
      <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />
      <VCard>
        <VCardTitle>

          <span>Whitelisting IP address {{ userIP }}</span>
          <VSpacer />

        </VCardTitle>

        <VCardText>
          <VForm ref="whitelistForm">
            <VTextarea v-model="ipDescription" label="Enter a description for it" placeholder="E.g. home or office IP"
              outlined type="textarea" rows="4" />
          </VForm>
        </VCardText>

        <VCardActions>
          <VBtn color="green darken-1" text @click="submitWhitelist">Submit</VBtn>
          <VBtn color="red darken-1" text @click="closeDialog">Cancel</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
<style scoped>
.notes {
  margin-top: 20px;
  font-size: 0.9em;
  color: #555;
  background: #eee;
  padding: 10px;
}
</style>
