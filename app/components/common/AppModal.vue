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
            <label v-for="field in modal.fields" :key="field.name" class="modal__field">
              <span v-if="field.label" class="modal__label">{{ field.label }}</span>
              <input
                :key="field.name"
                v-model="modal.values[field.name]"
                class="input"
                :type="field.type ?? 'text'"
                :placeholder="field.placeholder"
              >
              <p v-if="field.description" class="modal__hint">{{ field.description }}</p>
            </label>
          </div>

          <footer v-if="modal.mode === 'dialog' || modal.confirmLabel" class="modal__footer">
            <button
              type="button"
              class="button button--secondary"
              @click="closeModal"
            >
              {{ modal.cancelLabel || t('modal.cancel') }}
            </button>
            <button
              v-if="modal.mode === 'dialog'"
              type="button"
              class="button button--success"
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
import { useI18n } from '@/composables/useI18n'
import { useModal } from '@/composables/useModal'

const { modal, closeModal, confirmModal } = useModal()
const { t } = useI18n()
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

.modal__field {
  display: grid;
  gap: var(--s-2);
}

.modal__label {
  font-weight: 600;
}

.modal__hint {
  color: var(--muted);
  font-size: var(--fs-12);
  margin: 0;
}
</style>
