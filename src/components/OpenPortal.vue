<script setup>
import { defineProps, onBeforeUnmount, onMounted, ref } from 'vue';
const portalContainer = ref(null)
const { openPortal, closePortal } = usePortal()
const props = defineProps({
  name: {
    type: String,
    required: false
  }
})

onMounted(() => {
  const div = document.createElement("div")
  portalContainer.value.appendChild(div)
  openPortal(props.name, div)
})
onBeforeUnmount(() => {
  closePortal(props.name)
})

</script>
<template>

  <div ref="portalContainer">
  </div>

</template>
