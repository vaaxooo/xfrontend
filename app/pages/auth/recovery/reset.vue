<template>
  <AuthCard
    :title="t('auth.recovery_title')"
    :description="t('auth.reset_description')"
  >
    <form class="auth-form" @submit.prevent="handleSubmit">
      <p v-if="!hasRequiredParams" class="input-error">{{ t('alerts.reset_link_invalid') }}</p>

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
        <button
          type="submit"
          class="button button--auth w-full center button-md"
          :disabled="!hasRequiredParams"
        >
          {{ t('auth.reset_submit') }}
          <img src="/assets/images/icons/arrow-right-white.svg" alt="arrow" class="w-24 h-24">
        </button>
      </div>
    </form>
  </AuthCard>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import { useAuthApi } from '@/composables/useAuthApi'
import { useI18n } from '@/composables/useI18n'
import { useAlerts } from '@/composables/useAlerts'
import { useRoute } from 'vue-router'
import { getApiErrorMessage, getApiSuccessMessage } from '@/utils/apiMessages'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const { confirmPasswordReset } = useAuthApi()
const { push } = useAlerts()
const route = useRoute()

const form = reactive({
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  password: '',
  confirmPassword: '',
})

const email = computed(() => (route.query.email as string) || '')
const token = computed(() => (route.query.token as string) || '')
const hasRequiredParams = computed(() => Boolean(email.value && token.value))

const validate = () => {
  errors.password = ''
  errors.confirmPassword = ''

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

  return !errors.password && !errors.confirmPassword
}

const handleSubmit = async () => {
  if (!validate()) return

  if (!hasRequiredParams.value) {
    push({ title: t('alerts.error_title'), description: t('alerts.reset_link_invalid'), type: 'error' })
    return
  }

  try {
    const response = await confirmPasswordReset({ email: email.value, token: token.value, password: form.password })
    const successMessage = getApiSuccessMessage(response)

    push({
      title: t('auth.reset_submit'),
      description: successMessage || t('alerts.password_reset'),
      type: 'success',
    })
  } catch (error: any) {
    const message = getApiErrorMessage(error, t)

    push({ title: t('alerts.error_title'), description: message || t('alerts.login_error_description'), type: 'error' })
  }
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
