<template>
  <div class="session p-16">
    <div class="session-device">
      <div class="icon">
        <img
          :src="iconSrc"
          class="w-32 h-32"
        >
      </div>

      <div class="session-details">
        <div class="session-details__title">
          {{ title }}
        </div>

        <div class="session-details__description">
          <span v-html="description" />
        </div>
      </div>
    </div>

    <div class="session-actions">
      <button
        v-if="closable"
        type="button"
        class="button button--secondary"
        @click="$emit('end-session', sessionId)"
      >
        Завершить сеанс
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  sessionId: {
    type: String,
    required: true,
  },
  iconSrc: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  closable: {
    type: Boolean,
    default: true,
  },
})

defineEmits<{ (e: 'end-session', sessionId: string): void }>()
</script>
