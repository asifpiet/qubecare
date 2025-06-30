<script setup>
import { useProviderStore } from '@/stores/providerStore';
const providerStore = useProviderStore()
const props = defineProps({
  statData: {
    type: Object
  }
})
const progress = (value) => {
  return ((value / 100) * 100).toFixed(2);
};
</script>

<template>

  <VCard>
    <VCardItem class="pb-sm-0">
      <VCardTitle>{{ $t('Total Revenue') }}</VCardTitle>
      <VCardSubtitle> {{ $t('Invoice Overview') }}</VCardSubtitle>
    </VCardItem>

    <VCardText>
      <VRow>
        <VCol cols="12" lg="12" class="d-flex flex-column align-self-center pt-9">
          <div class="d-flex align-center gap-2 mb-3 flex-wrap">
            <h2 class="text-h2">
              ${{ providerStore.invocieReport.totalRevenue }}
            </h2>
          </div>

          <span class="text-sm text-medium-emphasis mb-9">
            {{ $t('Total Balance') }}
          </span>
        </VCol>
      </VRow>

      <div class="border rounded pa-5">
        <VRow>
          <VCol cols="12" sm="6">
            <div class="d-flex align-center">
              <VAvatar rounded size="26" color="primary" variant="tonal" class="me-2">
                <VIcon size="18" icon="tabler-chart-bar" />
              </VAvatar>

              <h6 class="text-base font-weight-regular">
                {{ $t('Invoice') }}
              </h6>
            </div>
            <h6 class="text-h4 my-2">
              {{ providerStore.invocieReport.totalInvoice }}
            </h6>
            <VProgressLinear :model-value="progress(providerStore.invocieReport.totalInvoice)" color="primary"
              height="4" rounded rounded-bar />
          </VCol>
          <VCol cols="12" sm="6">
            <div class="d-flex align-center">
              <VAvatar rounded size="26" color="info" variant="tonal" class="me-2">
                <VIcon size="18" icon="tabler-users" />
              </VAvatar>

              <h6 class="text-base font-weight-regular">
                {{ $t('Patients') }}
              </h6>
            </div>
            <h6 class="text-h4 my-2">
              {{ providerStore.invocieReport.totalPatient }}
            </h6>
            <VProgressLinear :model-value="progress(providerStore.invocieReport.totalPatient)" color="primary"
              height="4" rounded rounded-bar />
          </VCol>
          <VCol cols="12" sm="6">
            <div class="d-flex align-center">
              <VAvatar rounded size="26" color="primary" variant="tonal" class="me-2">
                <VIcon size="18" icon="tabler-checks" />
              </VAvatar>

              <h6 class="text-base font-weight-regular">
                {{ $t('Paid') }}
              </h6>
            </div>
            <h6 class="text-h4 my-2">
              {{ providerStore.invocieStats.total_invoices || 0 }}
            </h6>
            <VProgressLinear :model-value="progress(providerStore.invocieStats.total_invoices || 0)" color="primary"
              height="4" rounded rounded-bar />
          </VCol>
          <VCol cols="12" sm="6">
            <div class="d-flex align-center">
              <VAvatar rounded size="26" color="error" variant="tonal" class="me-2">
                <VIcon size="18" icon="tabler-circle-off" />
              </VAvatar>

              <h6 class="text-base font-weight-regular">
                {{ $t('Unpaid') }}
              </h6>
            </div>
            <h6 class="text-h4 my-2">
              {{ providerStore.invocieStats.total_unpaid_invoices || 0 }}
            </h6>
            <VProgressLinear :model-value="progress(providerStore.invocieStats.total_unpaid_invoices || 0)"
              color="primary" height="4" rounded rounded-bar />
          </VCol>

        </VRow>
      </div>
    </VCardText>
  </VCard>
</template>
