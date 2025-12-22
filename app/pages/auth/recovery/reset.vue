<template>
  <AuthCard
    :title="t('auth.recoveryTitle')"
    :description="t('auth.resetDescription')"
  >
    <form class="auth-form" @submit.prevent="handleSubmit">
      <div class="field">
        <input
          v-model="form.password"
          type="password"
          :placeholder="t('auth.passwordPlaceholder')"
          class="input"
          required
        >
      </div>

      <div class="field">
        <input
          v-model="form.confirmPassword"
          type="password"
          :placeholder="t('auth.repeatPasswordPlaceholder')"
          class="input"
          required
        >
      </div>

      <div class="auth-actions">
        <button type="submit" class="button button--auth w-full center button-md">
          {{ t('auth.resetSubmit') }}
          <img src="/assets/images/icons/arrow-right-white.svg" alt="arrow" class="w-24 h-24">
        </button>
      </div>
    </form>
  </AuthCard>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import { useAuthApi } from '@/composables/useAuthApi'
import { useI18n } from '@/composables/useI18n'
import { useModal } from '@/composables/useModal'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const { resetPassword } = useAuthApi()
const { openModal } = useModal()

const form = reactive({
  password: '',
  confirmPassword: '',
})

const handleSubmit = async () => {
  await resetPassword({ ...form })
  openModal({
    mode: 'alert',
    title: t('auth.resetSubmit'),
    description: 'Пароль успешно изменён, теперь можно войти с новыми данными.',
    cancelLabel: t('modal.close'),
  })
}
</script>
