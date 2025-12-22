<template>
  <div class="app-auth-page">
    <div class="auth-layout">
      <slot />
    </div>
  </div>

  <AppModal />
</template>

<script setup lang="ts">
import AppModal from '~/components/common/AppModal.vue'
</script>
