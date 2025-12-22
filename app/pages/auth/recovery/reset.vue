<template>
  <AuthCard
    :title="t('auth.recovery_title')"
    :description="t('auth.reset_description')"
  >
    <form class="auth-form" @submit.prevent="handleSubmit">
      <div class="field">
        <input
          v-model="form.email"
          type="email"
          :placeholder="t('auth.email_placeholder')"
          class="input"
          :class="{ 'input--error': errors.email }"
        >
        <p v-if="errors.email" class="input-error">{{ errors.email }}</p>
      </div>

      <div class="field">
        <input
          v-model="form.code"
          type="text"
          :placeholder="t('auth.reset_code_placeholder')"
          class="input"
          :class="{ 'input--error': errors.code }"
        >
        <p v-if="errors.code" class="input-error">{{ errors.code }}</p>
      </div>

      <div class="field">
        <input
          v-model="form.password"
          type="password"
          :placeholder="t('auth.password_placeholder')"
          class="input"
          :class="{ 'input--error': errors.password }"
        >
        <p v-if="errors.password" class="input-error">{{ errors.password }}</p>
      </div>

      <div class="field">
        <input
          v-model="form.confirmPassword"
          type="password"
          :placeholder="t('auth.repeat_password_placeholder')"
          class="input"
          :class="{ 'input--error': errors.confirmPassword }"
        >
        <p v-if="errors.confirmPassword" class="input-error">{{ errors.confirmPassword }}</p>
      </div>

      <div class="auth-actions">
        <button type="submit" class="button button--auth w-full center button-md">
          {{ t('auth.reset_submit') }}
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
import { useAlerts } from '@/composables/useAlerts'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const { confirmPasswordReset } = useAuthApi()
const { push } = useAlerts()

const form = reactive({
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
})

const validate = () => {
  errors.email = ''
  errors.code = ''
  errors.password = ''
  errors.confirmPassword = ''

  if (!form.email) {
    errors.email = t('alerts.validation_required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t('alerts.validation_email')
  }

  if (!form.code) {
    errors.code = t('alerts.validation_required')
  }

  if (!form.password) {
    errors.password = t('alerts.validation_required')
  } else if (form.password.length < 8) {
    errors.password = t('alerts.validation_password_length')
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = t('alerts.validation_required')
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = t('alerts.password_mismatch')
  }

  return !errors.email && !errors.code && !errors.password && !errors.confirmPassword
}

const handleSubmit = async () => {
  if (!validate()) return

  await confirmPasswordReset({ email: form.email, code: form.code, password: form.password })

  push({
    title: t('auth.reset_submit'),
    description: t('alerts.password_reset'),
    type: 'success',
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
