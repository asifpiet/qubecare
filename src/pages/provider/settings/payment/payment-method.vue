<script setup>
import { usePaymentStore } from '@/stores/paymentStore';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const paymentStore = usePaymentStore()
const refVForm = ref(null)
const dataForm = ref({
  paymentMethod: 'stripe',
  apiKey: null,
  apiSecret: null
})
const props = defineProps({
  paymentData: {
    type: Object,
    required: false,
    default: {
      paymentMethod: 'stripe',
      apiKey: null,
      apiSecret: null
    }
  }
})


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


const onSubmit = async () => {
  let validate = false
  const { valid } = await refVForm.value.validate()
  console.log(valid)
  if (valid) {


    await paymentStore.savePaymentMethod(dataForm.value)


  }
}

const translatedDelivery = computed(() => {
  return deliveryOptions.map(option => ({
    ...option,
    title: t(option.title),
    desc: t(option.desc)
    
    }));
});
</script>





<template>
  <VForm ref="refVForm" @submit.prevent="">
    <CustomRadiosWithIcon v-model:selected-radio="dataForm.paymentMethod" :radio-content="translatedDelivery"
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
        <AppTextField v-model="dataForm.apiKey" :placeholder="$t('Enter Api Key')" :label="$t('Api Key')"
          :class="{ 'error-border': paymentData.apiKeyValidation }" :rules="[requiredValidator]" />


      </VCol>

      <VCol cols="12" md="6">
        <AppTextField v-model="dataForm.apiSecret" :placeholder="$t('Enter Secret')" :label="$t('Secret')"
          :rules="[requiredValidator]" />

      </VCol>

      <VCol cols="12" md="12">
        <VBtn color="success" @click="onSubmit">
          {{ $t('Save Payment Config') }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
<style scoped>
.error-border .v-input {
  border: 1px solid red;
  /* Adjust thickness or style as needed */
}
</style>
