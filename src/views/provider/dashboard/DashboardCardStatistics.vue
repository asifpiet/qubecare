<script setup>
import { useProviderStore } from '@/stores/providerStore';
const providerStore = useProviderStore()
const props = defineProps({
  statData: {
    type: Object
  }
})

</script>

<template>
  <VRow>
    <VCol
      cols="12"
      md="3"
      sm="6"
    >
      <div>
        <VCard
          class="logistics-card-statistics cursor-pointer"
          :style="false ? `border-block-end-color: rgb(var(--v-theme-primary))` : `border-block-end-color: rgba(var(--v-theme-primary),0.38)`"
          @mouseenter="false"
          @mouseleave="false"
        >
          <VCardText>
            <div class="d-flex align-center gap-x-4 mb-1">
              <VAvatar
                variant="tonal"
                color="primary"
                rounded
              >
                <VIcon
                  icon="tabler-users"
                  size="28"
                />
              </VAvatar>
              <h4 class="text-h4">
                {{ providerStore.dashboard.totalPaitient }}
              </h4>
            </div>
            <div class="text-body-1 mb-1">
              {{ $t('Patients') }}
            </div>
          </VCardText>
        </VCard>
      </div>
    </VCol>
    <VCol
      cols="12"
      md="3"
      sm="6"
    >
      <div>
        <VCard
          class="logistics-card-statistics cursor-pointer"
          :style="false ? `border-block-end-color: rgb(var(--v-theme-warning))` : `border-block-end-color: rgba(var(--v-theme-warning),0.38)`"
          @mouseenter="false"
          @mouseleave="false"
        >
          <VCardText>
            <div class="d-flex align-center gap-x-4 mb-1">
              <VAvatar
                variant="tonal"
                color="warning"
                rounded
              >
                <VIcon
                  icon="tabler-calendar"
                  size="28"
                />
              </VAvatar>
              <h4 class="text-h4">
                {{ providerStore.dashboard.upcomingAppointmentCount }}
              </h4>
            </div>
            <div class="text-body-1 mb-1">
              {{ $t('Upcoming Appointments') }}
              
            </div>
          </VCardText>
        </VCard>
      </div>
    </VCol>
    <VCol
      cols="12"
      md="3"
      sm="6"
    >
      <div>
        <VCard
          class="logistics-card-statistics cursor-pointer"
          :style="false ? `border-block-end-color: rgb(var(--v-theme-error))` : `border-block-end-color: rgba(var(--v-theme-error),0.38)`"
          @mouseenter="false"
          @mouseleave="false"
        >
          <VCardText>
            <div class="d-flex align-center gap-x-4 mb-1">
              <VAvatar
                variant="tonal"
                color="secondary"
                rounded
              >
                <VIcon
                  icon="tabler-chart-line"
                  size="28"
                />
              </VAvatar>
              <h4 class="text-h4">
                $0
              </h4>
            </div>
            <div class="text-body-1 mb-1">
              {{ $t('Revenue') }}
              
            </div>
          </VCardText>
        </VCard>
      </div>
    </VCol>
    <VCol
      cols="12"
      md="3"
      sm="6"
    >
      <div>
        <VCard
          class="logistics-card-statistics cursor-pointer"
          :style="false ? `border-block-end-color: rgb(var(--v-theme-info))` : `border-block-end-color: rgba(var(--v-theme-info),0.38)`"
          @mouseenter="false"
          @mouseleave="false"
        >
          <VCardText>
            <div class="d-flex align-center gap-x-4 mb-1">
              <VAvatar
                variant="tonal"
                color="info"
                rounded
              >
                <VIcon
                  icon="tabler-file-invoice"
                  size="28"
                />
              </VAvatar>
              <h4 class="text-h4">
                {{ providerStore.dashboard.totalInvoice }}
              </h4>
            </div>
            <div class="text-body-1 mb-1">
              {{ $t('Invoices') }}
              
            </div>
          </VCardText>
        </VCard>
      </div>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
@use "@core/scss/base/mixins" as mixins;

.logistics-card-statistics {
  border-block-end-style: solid;
  border-block-end-width: 2px;

  &:hover {
    border-block-end-width: 3px;
    margin-block-end: -1px;

    @include mixins.elevation(8);

    transition: all 0.1s ease-out;
  }
}

.skin--bordered {
  .logistics-card-statistics {
    border-block-end-width: 2px;

    &:hover {
      border-block-end-width: 3px;
      margin-block-end: -2px;
      transition: all 0.1s ease-out;
    }
  }
}
</style>
