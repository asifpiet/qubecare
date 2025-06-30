<script setup>
const defaultMeta = {
  card: true,
  title: false,
  divider: false,
  editBtn: false,
  addBtn: false,
  backgroundColor: '#FFFFFF'
}
const props = defineProps({
  meta: {
    type: Object,
  },
  title: {
    type: String,
  }

})
const meta = props.meta ?? defaultMeta
const isMobile = ref();
const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};
onMounted(async () => {
  window.addEventListener('resize', checkIfMobile);
})
onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile);
});

</script>

<template>
  <VCard class="mb-6 custom-card pr-0 pl-0" v-if="meta.card" :style="{ backgroundColor: meta.backgroundColor }">
    <div class="py-2" :class="isMobile ? '' : 'd-flex'">
      <VCardTitle v-if="meta.title"><h2 class="text-xl font-bold text-gray-800">{{ props.title }}</h2></VCardTitle>
      <div class="d-flex flex-grow-1 gap-4 justify-content-end align-center">
        <div class="ms-auto"></div>
        <slot name="titleRightPart"></slot>
        <div class="mr-1"></div>
      </div>
    </div>

    <VDivider v-if="meta.divider" />
    <VCardText class="pt-0 pr-0 pl-0">

      <slot v-if="meta.card"></slot>
    </VCardText>

  </VCard>
  <div v-if="!meta.card" :style="{ backgroundColor: meta.backgroundColor }">

    <VCardTitle v-if="!meta.card && meta.title">{{ props.title }}</VCardTitle>
    <VDivider v-if="!meta.card && meta.divider" />
    <slot v-if="!meta.card"></slot>
  </div>
</template>

<style scoped>
.header-title {
  font-size: clamp(3rem, 5vw, 6rem);
  line-height: clamp(3rem, 5vw, 6rem);
}

.custom-card {
  z-index: auto;

}
</style>
