<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const props = defineProps({
  paymentData: {
    type: Object,
    required: true,
  }
})

const paymentMethod = ref()
const apiKey = ref()
const apiSecret = ref()
const deliveryOptions = [
  {
    icon: 'tabler-brand-stripe',
    title: 'Stripe',
    desc: 'Select Payment Method For setup.',
    value: 'stripe',
    color: 'primary'
  },
  {
    icon: 'tabler-brand-paypal',
    title: 'Paypal',
    desc: 'Setup for Paypal Payment Method',
    value: 'paypal',
    color: 'primary'
  },

]

const translatedDelivery = computed(() => {
  return deliveryOptions.map(option => ({
    ...option,
    title: t(option.title),
    desc: t(option.desc)
    
    }));
});
const resolveDeliveryBadgeData = {
  free: {
    color: 'success',
    price: 'Free',
  },
  express: {
    color: 'secondary',
    price: 10,
  },
  overnight: {
    color: 'secondary',
    price: 15,
  },
}
const validationFunc = () => {

  if (!props.paymentData.apiKey && !props.paymentData.apiSecret) {
    props.paymentData.apiKeyValidation = true
    props.paymentData.apiSecretValidation = true
  }
  if (props.paymentData.apiKey) {
    props.paymentData.apiKeyValidation = false
  }
  if (props.paymentData.apiSecret) {
    props.paymentData.apiSecretValidation = false
  }

}

</script>





<template>

  <CustomRadiosWithIcon v-model:selected-radio="paymentData.paymentMethod" :radio-content="translatedDelivery"
    :grid-column="{ cols: '12', sm: '6' }">
    <template #default="{ item }">
      <div class="d-flex flex-column align-center gap-2 w-100">

        <VIcon size="28" :icon="item.icon" class="text-high-emphasis" />

        <h6 class="text-h6">
          {{ item.title }}
        </h6>
        <p class="text-body-2 mb-0">
          {{ item.desc }}
        </p>
      </div>
    </template>
  </CustomRadiosWithIcon>
  <VRow class="mt-6">

    <VCol cols="12" md="6">
      <AppTextField v-model="paymentData.apiKey" :placeholder="$t('Enter Api Key')" :label="$t('Api Key')"
        @input="validationFunc" :class="{ 'error-border': paymentData.apiKeyValidation }" />
      <div v-if="paymentData.apiKeyValidation" style="color: red;">{{ $t('Api Key field is required.') }}</div>

    </VCol>

    <VCol cols="12" md="6">
      <AppTextField v-model="paymentData.apiSecret" :placeholder="$t('Enter Secret')" :label="$t('Secret')"
        @input="validationFunc" />
      <div v-if="paymentData.apiSecretValidation" style="color: red;">{{ $t('Api Secret field is required.') }}</div>
    </VCol>


  </VRow>
</template>
<style scoped>
.error-border .v-input {
  border: 1px solid red;
  /* Adjust thickness or style as needed */
}
</style>
