<template>
  <button
    type="button"
    class="button button--secondary button-social gap-20"
    @click="$emit('click')"
  >
    <div class="row">
      <img
        :src="icon"
        class="w-32 h-32"
      >
      {{ title }}
    </div>

    <img
      :src="statusIcon"
      class="w-24 h-24"
    >
  </button>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  statusIcon: {
    type: String,
    required: true,
  },
})

defineEmits<{ (e: 'click'): void }>()
</script>
