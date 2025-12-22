<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="modal.isOpen" class="modal-backdrop">
        <div class="modal">
          <header class="modal__header">
            <div class="modal__title">{{ modal.title }}</div>
            <button type="button" class="modal__close" @click="closeModal">✕</button>
          </header>

          <div v-if="modal.description" class="modal__body" v-html="modal.description" />

          <footer class="modal__footer">
            <button
              type="button"
              class="button button--secondary"
              @click="closeModal"
            >
              {{ modal.cancelLabel }}
            </button>
            <button
              type="button"
              class="button button--success"
              :disabled="modal.loading"
              @click="confirmModal"
            >
              {{ modal.loading ? 'Выполняем...' : modal.confirmLabel }}
            </button>
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useModal } from '@/composables/useModal'

const { modal, closeModal, confirmModal } = useModal()
</script>
