<template>
  <div class="section">
    <div class="section-title">
      Параметры входа
    </div>

    <div class="block row p-16">
      <div class="row">
        <div class="icon">
          <img src="/assets/images/icons/lock.svg" class="w-32 h-32">
        </div>

        <div class="block-content">
          <div class="block-content__title">
            Пароль от аккаунта
          </div>

          <div class="block-content__description">
            Пароль нужен, чтобы входить в аккаунт по email
          </div>
        </div>
      </div>

      <div class="block-action">
        <button
          type="button"
          class="button button--secondary"
          @click="handlePasswordChange"
        >
          Изменить
        </button>
      </div>
    </div>

    <SocialAuthBlock />
  </div>
</template>

<script setup lang="ts">
import SocialAuthBlock from '@/components/profile/security/SocialAuthBlock.vue'
import { useModal } from '@/composables/useModal'
import { useProfileApi } from '@/composables/useProfileApi'

const { openModal } = useModal()
const { changePassword } = useProfileApi()

const handlePasswordChange = () => {
  openModal({
    title: 'Сменить пароль',
    description: 'Мы отправим ссылку для смены пароля на ваш email.',
    confirmLabel: 'Отправить ссылку',
    onConfirm: async () => {
      await changePassword({ strategy: 'email-link' })
    },
  })
}
</script>
