<template>
  <Teleport to="body">
    <div class="alerts" role="status" aria-live="polite">
      <transition-group name="slide-fade" tag="div">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          class="alert"
          :class="`alert--${alert.type}`"
        >
          <div class="alert__content">
            <div class="alert__title">{{ alert.title }}</div>
            <p v-if="alert.description" class="alert__description">{{ alert.description }}</p>
          </div>

          <button type="button" class="alert__close" @click="dismiss(alert.id)">
            ✕
          </button>
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useAlerts } from '@/composables/useAlerts'

const { alerts, dismiss } = useAlerts()
</script>

<style scoped>
.alerts {
  position: fixed;
  left: 50%;
  bottom: var(--s-4);
  z-index: 90;
  display: grid;
  gap: var(--s-3);
  width: min(420px, calc(100% - var(--s-6)));
  transform: translateX(-50%);
  pointer-events: none;
}

.alert {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: var(--s-3) var(--s-4);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--s-3);
  border: 1px solid rgba(148, 163, 184, 0.25);
  backdrop-filter: blur(8px);
  pointer-events: auto;
}

.alert__title {
  font-weight: 600;
}

.alert__description {
  margin: 0;
  color: var(--muted);
  font-size: var(--fs-14);
}

.alert__close {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: var(--fs-16);
  line-height: 1;
  color: var(--muted);
}

.alert--success {
  border-color: #3dd598;
}

.alert--warning {
  border-color: #ffb020;
}

.alert--error {
  border-color: #ff5a5f;
}

.alert--info {
  border-color: #2f80ed;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
