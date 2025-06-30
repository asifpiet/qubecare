<script setup>
const { currentUser, currentRole, logout } = useAuth()

onMounted(() => {
  console.log("UserProfile3333", currentUser.value, currentRole.value);
})
</script>
<template>
  <div class="h-100 d-flex align-center justify-md-space-between justify-center">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center text-medium-emphasis">
      &copy;
      {{ new Date().getFullYear() }}
      {{ currentUser?.company?.name || $t('QubeCare') }}. {{ $t('All rights reserved.') }}

    </span>
    <!-- 👉 Footer: right content -->
    <!-- <span class="d-md-flex gap-x-4 text-primary d-none">
      <a
         href="#"
        target="noopener noreferrer"
      >License</a>
      <a
         href="#"
        target="noopener noreferrer"
      >More Themes</a>
      <a
         href="#"
        target="noopener noreferrer"
      >Documentation</a>
      <a
         href="#"
        target="noopener noreferrer"
      >Support</a>
    </span> -->
  </div>
</template>
