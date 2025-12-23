<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="modal.isOpen" class="modal-backdrop">
        <div :class="['modal', modal.mode === 'alert' && 'modal--alert']">
          <header class="modal__header">
            <div class="modal__title">{{ modal.title || t('modal.alert_title') }}</div>
            <button type="button" class="modal__close" @click="closeModal">✕</button>
          </header>

          <div v-if="modal.description" class="modal__body" v-html="modal.description" />

          <component
            :is="modal.component"
            v-if="modal.component"
            v-bind="modal.componentProps"
            class="modal__custom"
          />

          <div v-if="modal.fields.length" class="modal__form">
            <p v-if="modal.errors.form" class="modal__error modal__error--general">{{ modal.errors.form }}</p>
            <label v-for="field in modal.fields" :key="field.name" class="modal__field">
              <span v-if="field.label" class="modal__label">{{ field.label }}</span>
              <input
                :key="field.name"
                v-model="modal.values[field.name]"
                class="input"
                :type="field.type ?? 'text'"
                :placeholder="field.placeholder"
              >
              <p v-if="modal.errors[field.name]" class="modal__error">{{ modal.errors[field.name] }}</p>
              <p v-if="field.description" class="modal__hint">{{ field.description }}</p>
            </label>
          </div>

          <footer v-if="modal.mode === 'dialog' || modal.confirmLabel" class="modal__footer">
            <button
              type="button"
              class="button button--secondary center button-md justify-content-center modal__button"
              @click="closeModal"
            >
              {{ modal.cancelLabel || t('modal.cancel') }}
            </button>
            <button
              v-if="modal.mode === 'dialog'"
              type="button"
              class="button button--success center button-md justify-content-center modal__button"
              :disabled="modal.loading"
              @click="confirmModal"
            >
              {{ modal.loading ? t('modal.processing') : modal.confirmLabel || t('modal.confirm') }}
            </button>
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { useModal } from '@/composables/useModal'

const { modal, closeModal, confirmModal } = useModal()
const { t } = useI18n()
const previousOverflow = ref<string | null>(null)

watch(
  () => modal.value.isOpen,
  (isOpen) => {
    if (!process.client) return

    if (isOpen) {
      if (previousOverflow.value === null) {
        previousOverflow.value = document.body.style.overflow
      }
      document.body.style.overflow = 'hidden'
    } else if (previousOverflow.value !== null) {
      document.body.style.overflow = previousOverflow.value
      previousOverflow.value = null
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  if (!process.client) return
  if (previousOverflow.value !== null) {
    document.body.style.overflow = previousOverflow.value
    previousOverflow.value = null
  }
})
</script>

<style scoped>
.modal--alert {
  border: 1px solid var(--primary);
}

.modal__form {
  display: grid;
  gap: var(--s-3);
}

.modal__custom {
  margin: var(--s-4) 0;
}

.modal__footer {
  display: flex;
  gap: var(--s-3);
  margin-top: var(--s-4);
}

.modal__button {
  flex: 1;
  min-height: 48px;
}

.modal__field {
  display: grid;
  gap: var(--s-2);
}

.modal__label {
  font-weight: 600;
}

.modal__error {
  color: var(--danger);
  font-size: var(--fs-12);
  margin: 0;
}

.modal__error--general {
  font-size: var(--fs-14);
}

.modal__hint {
  color: var(--muted);
  font-size: var(--fs-12);
  margin: 0;
}
</style>
