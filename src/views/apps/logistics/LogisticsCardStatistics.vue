<script setup>
const logisticData = ref([
  {
    icon: 'tabler-currency-dollar',
    color: 'primary',
    title: 'Revenue',
    value: 42,
    change: 18.2,
    isHover: false,
    footerText: 'than last month'
  },
  {
    icon: 'tabler-alert-triangle',
    color: 'warning',
    title: 'Refrals',
    value: 8,
    change: -8.7,
    isHover: false,
    footerText: 'than last month'
  },
  {
    icon: 'tabler-git-fork',
    color: 'error',
    title: 'Weekly Refrals',
    value: 27,
    change: 4.3,
    isHover: false,
    footerText: 'than last week'
  },
  {
    icon: 'tabler-cash-banknote',
    color: 'info',
    title: 'Weekly Revenue',
    value: 13,
    change: -2.5,
    isHover: false,
    footerText: 'than last week'
  },
])
</script>

<template>
  <VRow>
    <VCol
      v-for="(data, index) in logisticData"
      :key="index"
      cols="12"
      md="3"
      sm="6"
    >
      <div>
        <VCard
          class="logistics-card-statistics cursor-pointer"
          :style="data.isHover ? `border-block-end-color: rgb(var(--v-theme-${data.color}))` : `border-block-end-color: rgba(var(--v-theme-${data.color}),0.38)`"
          @mouseenter="data.isHover = true"
          @mouseleave="data.isHover = false"
        >
          <VCardText>
            <div class="d-flex align-center gap-x-4 mb-1">
              <VAvatar
                variant="tonal"
                :color="data.color"
                rounded
              >
                <VIcon
                  :icon="data.icon"
                  size="28"
                />
              </VAvatar>
              <h4 class="text-h4">
                {{ data.value }}
              </h4>
            </div>
            <div class="text-body-1 mb-1">
              {{ data.title }}
            </div>
            <div class="d-flex gap-x-2 align-center">
              <h6 class="text-h6">
                {{ (data.change > 0) ? '+' : '' }} {{ data.change }}%
              </h6>
              <div class="text-sm text-disabled">
                {{data.footerText }}
              </div>
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
