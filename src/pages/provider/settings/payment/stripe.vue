<script setup>
import girlWithLaptop from '@images/illustrations/laptop-girl.png'
const { currentUser, currentRole, logout } = useAuth()
import { usePaymentStore } from '@/stores/paymentStore';
const paymentStore = usePaymentStore()
const refVForm = ref(null)


await paymentStore.getStatusConnection()
console.log(paymentStore.statusConnection)
const OnConnect = async () => {

  console.log(currentUser.value)

  await paymentStore.stripeConnect(currentUser.value.id)


  console.log(paymentStore.conectStripe)
  console.log('responseRedirect', paymentStore.conectStripe)
  if (paymentStore.conectStripe.success) {
    window.open(paymentStore.conectStripe.url, '_blank');
  }

}
</script>





<template>

  <VForm ref="refVForm" @submit.prevent="">
    <VRow class="mt-6">
      <VCol cols="12" md="12" class="d-flex align-center">
        <VCard>
          <VCardText>
            <div class="d-flex justify-center  align-start pb-0 px-3 pt-3 mb-4 bg-light-primary rounded">
              <VImg :src="girlWithLaptop" width="145" height="140" />
            </div>
            <div>
              <h5 class="text-h5 mb-2">
                {{ $t('Stripe') }}
              </h5>
              <div class="text-body-2">
                {{ $t(`Secure transactions with Stripe's advanced fraud prevention.`) }}
              </div>

              <VBtn block @click="OnConnect" v-if="!paymentStore.statusConnection.isConfigured">
                {{ $t('Connect Stripe') }}
              </VBtn>
              <VBtn block v-if="paymentStore.statusConnection.isConfigured" :disabled="true">
                {{ $t('Connected') }}
              </VBtn>
            </div>
          </VCardText>
        </VCard>

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
