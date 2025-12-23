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
  gap: var(--s-2);
  width: min(420px, calc(100% - var(--s-6)));
  transform: translateX(-50%);
  pointer-events: none;
}

.alert {
  background: rgba(255, 255, 255, 0.86);
  border-radius: 22px;
  padding: var(--s-3) var(--s-4);
  box-shadow: 0 22px 50px rgba(15, 23, 42, 0.14);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--s-3);
  border: 1px solid rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(18px);
  pointer-events: auto;
  position: relative;
  overflow: hidden;
}

.alert::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.15);
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
  background: rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  cursor: pointer;
  font-size: var(--fs-16);
  line-height: 1;
  color: rgba(15, 23, 42, 0.7);
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
}

.alert--success {
  border-color: rgba(61, 213, 152, 0.4);
}

.alert--warning {
  border-color: rgba(255, 176, 32, 0.4);
}

.alert--error {
  border-color: rgba(255, 90, 95, 0.4);
}

.alert--info {
  border-color: rgba(47, 128, 237, 0.4);
}

.alert--success::before {
  background: #3dd598;
}

.alert--warning::before {
  background: #ffb020;
}

.alert--error::before {
  background: #ff5a5f;
}

.alert--info::before {
  background: #2f80ed;
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
