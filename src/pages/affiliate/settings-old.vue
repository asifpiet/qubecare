<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Affiliate Settings View',
  },
});

import { useAffiliateStore } from '@/stores/affiliateStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const { currentUser, currentRole, logout } = useAuth()

const affiliateStore = useAffiliateStore()
const store = useStore();
const router = useRouter();
const userData = currentUser
// Form state
const formRef = ref(null);
const account_number = ref(null);
const routing_number = ref(null);
const ach = ref(null);
const address = ref(null);
await affiliateStore.getAffiliateAccountData(userData.value?.id)
onMounted(async () => {
  account_number.value = affiliateStore.affiliateAccount.account_number;
  routing_number.value = affiliateStore.affiliateAccount.routing_number;
  ach.value = affiliateStore.affiliateAccount.ach;
  address.value = affiliateStore.affiliateAccount?.address;
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
  await affiliateStore.saveAffiliateAccount(
    {
      affiliate_id: userData.value?.id,
      account_number: account_number.value,
      routing_number: routing_number.value,
      ach: ach.value,
      address: address.value,
    }
  )
  // await store.dispatch('saveAffiliateAccount', {
  //   affiliate_id: userData.value?.id,
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
