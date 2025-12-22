<template>
  <div class="app">
    <div class="app-grid">
      <Sidebar />
      <main class="content">
        <slot />
      </main>
    </div>
  </div>

  <AppModal />
  <AppAlerts />
</template>

<script setup lang="ts">
import AppModal from '~/components/common/AppModal.vue'
import AppAlerts from '~/components/common/AppAlerts.vue'
import Sidebar from '~/components/layout/Sidebar.vue'
</script>
