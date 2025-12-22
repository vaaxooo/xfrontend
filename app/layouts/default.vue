<template>

    <div class="app">
        <div class="app-grid">

            <Sidebar />
            <main class="content">
                <slot />
            </main>
        </div>
    </div>

</template>
  
<script setup lang="ts">
import Sidebar from '~/components/layout/Sidebar.vue';
</script>