<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Partner Withdrawal View',
  },
})
import { usePartnerStore } from '@/stores/partnerStore';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const { currentUser, currentRole, logout } = useAuth()
const partnerStore = usePartnerStore()

const userData = currentUser
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const serverItems = ref([]);
const store = useStore();
const withdrawModal = ref(false)
const amount = ref(null)
const accountNumber = ref(null)
const routingNumber = ref(null)
const ach = ref(null)
const address = ref(null)
const refWithdrawForm = ref()
const balance = ref(0.00)
const isMobile = ref();
const dataTable = ref(null);
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Amount', key: 'amount' },
  { title: 'Date', key: 'created_at' },
  { title: 'Status', key: 'status' },
];

const reload = () => dataTable.value.reload()

await partnerStore.getPartnerAccountData(userData.value?.id)

let dataTableURL = GET_PARTNER_WITHDRAWLS + '/' + userData.value?.id
onMounted(async () => {
  isMobile.value = window.innerWidth <= 768;
  let balRes = await $api(GET_PARTNER_BALANCE + '/' + userData.value?.id, {
    method: 'GET',
    onResponseError({ response }) {
      console.error('Error in API:', response);
    }
  });
  balance.value = balRes.data;

  accountNumber.value = partnerStore.partnerAccount.account_number;
  routingNumber.value = partnerStore.partnerAccount.routing_number;
  ach.value = partnerStore.partnerAccount.ach;
  address.value = partnerStore.partnerAccount.address;
  reload()
});
const addNewItem = () => {
  withdrawModal.value = true;
};

const closeModal = () => {
  withdrawModal.value = false;
};

const onSubmit = async () => {

  refWithdrawForm.value?.validate().then(async ({ valid: isValid }) => {
    console.log('isValid ', isValid)
    if (isValid) {
      await processWithdraw()
      if (partnerStore.paymentProcessed) {
        withdrawModal.value = false;
        reload()
      }
    }

  })
}
const processWithdraw = async () => {
  await partnerStore.perocessPartnerWithdaw(
    {
      partner_id: userData.value?.id,
      amount: amount.value,
      account_number: accountNumber.value,
      routing_number: routingNumber.value,
      ach: ach.value,
      address: address.value
    }
  )
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
};

const amountValidator = (value) => {
  if (!value || isNaN(value)) return 'Amount is required.';
  if (value > balance.value) return `Amount cannot exceed your balance of $${balance.value}.`;
  return true;
};
const remainingBalance = computed(() => {
  if (amount.value && !isNaN(amount.value)) {
    const updatedBalance = balance.value - parseFloat(amount.value);
    return updatedBalance >= 0 ? updatedBalance : 0; // Ensure balance doesn't go negative
  }
  return balance.value;
});

const formatAmount = (amount) => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>

<template>
  <DataTable ref="dataTable" :cardTitle="$t('Withdraws')" :btnTitle="$t('Request Withdraw')" :headers="headers" :api="dataTableURL"
    :sortBy="sortByData" @onBtnClick="addNewItem">
    <!-- Custom slot for the Status column -->
    <template v-slot:[`item.created_at`]="{ item }">
      <span>{{ formatDate(item.created_at) }}</span>

    </template>
  </DataTable>
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 600" :model-value="withdrawModal" persistent>
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeModal" />

    <VCard class="pa-2 pa-sm-10">
      <!-- 👉 Title -->
      <VCardItem class="text-center">
        <VCardTitle>
          <h4 class="text-h4 mb-2">
            {{ $t('Request Withdrawal') }}
          </h4>
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-6">
        <VForm ref="refWithdrawForm" @submit.prevent="onSubmit">
          <VRow>
            <VCol cols="12">
              <AppTextField v-model="amount" label="Amount" placeholder="" type="number"
                :rules="[requiredValidator, amountValidator]" :max="balance" />
              <span class="text-primary">{{ $t('Balance:') }} ${{ formatAmount(remainingBalance) }}</span>
            </VCol>

            <!-- Account Name -->
            <VCol cols="12" md="12">
              <AppTextField v-model="ach" :label="$t('Account Name')" placeholder="" :rules="[requiredValidator]" readonly />
            </VCol>

            <!-- Accounts Number -->
            <VCol cols="12">
              <AppTextField v-model="accountNumber" :label="$t('Account Number')" placeholder="" :rules="[requiredValidator]"
                readonly />
            </VCol>



            <!-- 👉 Card Name -->
            <VCol cols="12" md="12">
              <AppTextField v-model="routingNumber" :label="$t('Routing Number')" placeholder="" :rules="[requiredValidator]"
                readonly />
            </VCol>



            <VCol cols="12" md="12">
              <AppTextField v-model="address" :label="$t('Address')" placeholder="" :rules="[requiredValidator]" readonly />
            </VCol>

            <!-- 👉 Card Primary Set -->
            <!-- <VCol cols="12">
              <VSwitch
                v-model="cardDetails.isPrimary"
                label="Save Card for future billing?"
              />
            </VCol> -->

            <!-- 👉 Card actions -->
            <VCol cols="12" class="text-center">
              <VBtn class="me-4" type="submit">
                {{ $t('Submit') }}
              </VBtn>
              <VBtn color="secondary" variant="tonal" @click="closeModal">
                {{ $t('Cancel') }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped>
.mt-4 {
  margin-top: 16px;
}
</style>
