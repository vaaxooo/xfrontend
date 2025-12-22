<template>
  <AuthCard
    :title="t('auth.recoveryTitle')"
    :description="t('auth.recoveryDescription')"
    :socials="socials"
  >
    <form class="auth-form" @submit.prevent="handleSubmit">
      <div class="field">
        <input
          v-model="email"
          type="email"
          :placeholder="t('auth.emailPlaceholder')"
          class="input"
          required
        >
      </div>

      <div class="auth-actions">
        <button type="submit" class="button button--auth w-full center button-md">
          {{ t('auth.recoverySubmit') }}
          <img src="/assets/images/icons/arrow-right-white.svg" alt="arrow" class="w-24 h-24">
        </button>
      </div>

      <div class="auth-footer">
        <span class="center justify-content-center">
          {{ t('auth.rememberPassword') }}
          <NuxtLink to="/auth/login" class="link link--primary">{{ t('auth.toLogin') }}</NuxtLink>
        </span>
      </div>
    </form>
  </AuthCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import { useAuthApi } from '@/composables/useAuthApi'
import { useI18n } from '@/composables/useI18n'
import { useModal } from '@/composables/useModal'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const { requestRecovery } = useAuthApi()
const { openModal } = useModal()

const email = ref('')

const socials = [
  { id: 'telegram', label: 'Telegram', icon: '/assets/images/icons/telegram.svg' },
  { id: 'facebook', label: 'Facebook', icon: '/assets/images/icons/facebook.svg' },
  { id: 'google', label: 'Google', icon: '/assets/images/icons/google.svg' },
  { id: 'apple', label: 'Apple', icon: '/assets/images/icons/apple.svg' },
]

const handleSubmit = async () => {
  await requestRecovery({ email: email.value })
  openModal({
    mode: 'alert',
    title: t('alerts.recoverySentTitle'),
    description: t('alerts.recoverySentBody'),
    cancelLabel: t('modal.close'),
  })
}
</script>
