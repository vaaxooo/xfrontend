<template>
  <AppSection title="Безопасность">
    <div class="block row p-16">
      <div class="row">
        <div class="icon">
          <img src="/assets/images/icons/2fa.svg" class="w-32 h-32">
        </div>

        <div class="block-content">
          <div class="block-content__title">
            Двухфакторная аутентификация
          </div>

          <div class="block-content__description">
            Дополнительный способ защиты аккаунта.
          </div>
        </div>
      </div>

      <div class="block-action">
        <button
          type="button"
          class="button button--success"
          @click="handleEnableTwoFactor"
        >
          Включить
        </button>
      </div>
    </div>
  </AppSection>
</template>

<script setup lang="ts">
import AppSection from '@/components/common/AppSection.vue'
import { useModal } from '@/composables/useModal'
import { useProfileApi } from '@/composables/useProfileApi'

const { openModal } = useModal()
const { enableTwoFactor } = useProfileApi()

const handleEnableTwoFactor = () => {
  openModal({
    title: 'Включить двухфакторную аутентификацию',
    description: 'Мы отправим код на ваш email или в подключённый мессенджер.',
    confirmLabel: 'Получить код',
    onConfirm: async () => {
      await enableTwoFactor()
    },
  })
}
</script>
