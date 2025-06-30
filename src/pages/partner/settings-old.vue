<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Partner Settings View',
  },
});

import { usePartnerStore } from '@/stores/partnerStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const { currentUser, currentRole, logout } = useAuth()
const partnerStore = usePartnerStore()
const store = useStore();
const router = useRouter();
const userData = currentUser
// Form state
const formRef = ref(null);
const account_number = ref(null);
const routing_number = ref(null);
const ach = ref(null);
const address = ref(null);

onMounted(async () => {
  await partnerStore.getPartnerAccountData(userData.value?.id)
  // await store.dispatch('getPartnerAccountData',{id: userData.value?.id});
  account_number.value = partnerStore.partnerAccount.account_number;
  routing_number.value = partnerStore.partnerAccount.routing_number;
  ach.value = partnerStore.partnerAccount.ach;
  address.value = partnerStore.partnerAccount?.address;
});

// Submit handler
const handleSubmit = async () => {
  if (formRef.value?.validate()) {
    // console.log('Form data:', formData.value);
    // Perform submission logic, e.g., API call
    await saveAccountSetting()
  }
};

const saveAccountSetting = async () => {
  await partnerStore.savePartnerAccount(
    {
      partner_id: userData.value?.id,
      account_number: account_number.value,
      routing_number: routing_number.value,
      ach: ach.value,
      address: address.value,
    }
  )
  // await store.dispatch('savePartnerAccount', {
  //   partner_id: userData.value?.id,
  //   account_number: account_number.value,
  //   routing_number: routing_number.value,
  //   ach: ach.value,
  //   address: address.value,
  // });
};
// Validation rules
const required = (v) => !!v || 'Field is required';
</script>

<template>
  <v-container>
    <v-form ref="formRef">
      <v-row>
        <v-col cols="12" sm="12">
          <h3>Bank Account Information</h3>
        </v-col>
        <!-- Account Name Field -->
        <v-col cols="12" sm="12">
          <v-text-field v-model="ach" label="Account Name" :rules="[required]" outlined />
        </v-col>

        <!-- Account Number Field -->
        <v-col cols="12" sm="12">
          <v-text-field v-model="account_number" label="Account Number" :rules="[required]" outlined />
        </v-col>



        <!-- Routing Number Field -->
        <v-col cols="12" sm="12">
          <v-text-field v-model="routing_number" label="Routing Number" :rules="[required]" outlined />
        </v-col>



        <v-col cols="12" sm="12">
          <v-text-field v-model="address" label="Address" :rules="[required]" outlined />
        </v-col>
      </v-row>

      <v-btn color="primary" class="mt-4" @click="handleSubmit">
        Submit
      </v-btn>
    </v-form>
  </v-container>
</template>
