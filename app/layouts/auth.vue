<template>
  <div class="app-auth-page">
    <div class="auth-layout">
      <slot />
    </div>
  </div>

  <AppModal />
  <AppAlerts />
</template>

<script setup lang="ts">
import AppModal from '~/components/common/AppModal.vue'
import AppAlerts from '~/components/common/AppAlerts.vue'
</script>
