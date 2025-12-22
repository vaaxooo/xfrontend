<template>
  <AuthCard
    :title="t('auth.recovery_title')"
    :description="t('auth.recovery_description')"
    :socials="socials"
  >
    <form class="auth-form" @submit.prevent="handleSubmit">
      <div class="field">
        <input
          v-model="email"
          type="email"
          :placeholder="t('auth.email_placeholder')"
          class="input"
          :class="{ 'input--error': error }"
        >
        <p v-if="error" class="input-error">{{ error }}</p>
      </div>

      <div class="auth-actions">
        <button type="submit" class="button button--auth w-full center button-md">
          {{ t('auth.recovery_submit') }}
          <img src="/assets/images/icons/arrow-right-white.svg" alt="arrow" class="w-24 h-24">
        </button>
      </div>

      <div class="auth-footer">
        <span class="center justify-content-center">
          {{ t('auth.remember_password') }}
          <NuxtLink to="/auth/login" class="link link--primary">{{ t('auth.to_login') }}</NuxtLink>
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
import { useAlerts } from '@/composables/useAlerts'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const { requestPasswordReset } = useAuthApi()
const { push } = useAlerts()

const email = ref('')
const error = ref('')

const socials = [
  { id: 'telegram', label: 'Telegram', icon: '/assets/images/icons/telegram.svg' },
  { id: 'facebook', label: 'Facebook', icon: '/assets/images/icons/facebook.svg' },
  { id: 'google', label: 'Google', icon: '/assets/images/icons/google.svg' },
  { id: 'apple', label: 'Apple', icon: '/assets/images/icons/apple.svg' },
]

const validate = () => {
  error.value = ''

  if (!email.value) {
    error.value = t('alerts.validation_required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = t('alerts.validation_email')
  }

  return !error.value
}

const handleSubmit = async () => {
  if (!validate()) return

  await requestPasswordReset({ email: email.value })
  push({
    title: t('alerts.recovery_sent_title'),
    description: t('alerts.recovery_sent_body'),
    type: 'info',
  })
}
</script>

<style scoped>
.input--error {
  border-color: #ff4d4f;
}

.input-error {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}
</style>
