<script setup>
const totalPaitent =ref();
const upcomingAppointments =ref();
const missedAppointments =ref();
const totalInvoice =ref();
const totalOrderItem =ref();
const props = defineProps({
  statData: {
    type: Object
  }
})

const data = computed(()=>{
  console.log("statData",props.statData[0]);
  totalPaitent.value = props.statData.totalPaitient;
  missedAppointments.value = props.statData.missedAppointments;
  // upcomingAppointments.value = 0;
  upcomingAppointments.value = props.statData.upcomingAppointmentCount;
  totalInvoice.value = props.statData.totalInvoice;
  
  
})

</script>

<template>
  <div v-if="data"></div>
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
                {{ totalPaitent }}
              </h4>
            </div>
            <div class="text-body-1 mb-1">
              Patients
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
                {{ upcomingAppointments }}
              </h4>
            </div>
            <div class="text-body-1 mb-1">
              Upcoming Appointments
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
                color="error"
                rounded
              >
                <VIcon
                  icon="tabler-calendar"
                  size="28"
                />
              </VAvatar>
              <h4 class="text-h4">
                {{ missedAppointments }}
              </h4>
            </div>
            <div class="text-body-1 mb-1">
              Missed Appointments
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
                {{ totalInvoice }}
              </h4>
            </div>
            <div class="text-body-1 mb-1">
              Invoices
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
