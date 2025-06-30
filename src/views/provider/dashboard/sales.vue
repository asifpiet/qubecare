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
      <VCardSubtitle> {{ $t('Sales and Order Overview') }} </VCardSubtitle>
    </VCardItem>

    <VCardText>
      <VRow>
        <VCol
          cols="12"
          lg="12"
          class="d-flex flex-column align-self-center pt-9"
        >
          <div class="d-flex align-center gap-2 mb-3 flex-wrap">
            <h2 class="text-h2">
              ${{ providerStore.dashboard.totalOrderPrice }}
            </h2>
            <!-- <VChip
              label
              size="small"
              color="success"
            >
            </VChip> -->
          </div>

          <span class="text-sm text-medium-emphasis mb-9">
            Total Balance
          </span>
        </VCol>

        <!-- <VCol
          cols="12"
          sm="7"
          lg="6"
        >
          <VueApexCharts
            :options="chartOptions"
            :series="series"
            height="161"
          />
        </VCol> -->
      </VRow>

      <div class="border rounded mt-9  pa-5">
        <VRow>
          <VCol
            cols="12"
            sm="6"
          >
            <div class="d-flex align-center">
              <VAvatar
                rounded
                size="26"
                color="primary"
                variant="tonal"
                class="me-2"
              >
                <VIcon
                  size="18"
                  icon="tabler-shopping-cart"
                />
              </VAvatar>

              <h6 class="text-base font-weight-regular">
                Order
              </h6>
            </div>
            <h6 class="text-h4 my-2">
              {{ providerStore.dashboard.totalOrder }}
            </h6>
            <VProgressLinear
              :model-value="progress(providerStore.dashboard.totalOrder)"
              color="primary"
              height="4"
              rounded
              rounded-bar
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <div class="d-flex align-center">
              <VAvatar
                rounded
                size="26"
                color="info"
                variant="tonal"
                class="me-2"
              >
                <VIcon
                  size="18"
                  icon="tabler-shopping-cart"
                />
              </VAvatar>

              <h6 class="text-base font-weight-regular">
                Sale
              </h6>
            </div>
            <h6 class="text-h4 my-2">
              {{ providerStore.dashboard.totalOrderItem }}
            </h6>
            <VProgressLinear
              :model-value="progress(providerStore.dashboard.totalOrderItem)"
              color="primary"
              height="4"
              rounded
              rounded-bar
            />
          </VCol>
          
        </VRow>
      </div>
    </VCardText>
  </VCard>
</template>
