<template>
  <AuthCard
    :title="t('auth.register_title')"
    :description="t('auth.register_description')"
    :socials="socials"
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
          {{ t('auth.create_account') }}
          <img src="/assets/images/icons/arrow-right-white.svg" alt="arrow" class="w-24 h-24">
        </button>
      </div>

      <div class="auth-footer">
        <span class="center justify-content-center">
          {{ t('auth.have_account') }}
          <NuxtLink to="/auth/login" class="link link--primary">{{ t('auth.to_login') }}</NuxtLink>
        </span>
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
import { useAuthState, type AuthSession } from '@/composables/useAuthState'
import { useRouter } from 'vue-router'
import { useAlerts } from '@/composables/useAlerts'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const { register, requestEmailConfirmation, getMe } = useAuthApi()
const { openModal } = useModal()
const router = useRouter()
const { setSession, setUserProfile } = useAuthState()
const { push } = useAlerts()

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

const isAuthSessionResponse = (value: any): value is AuthSession => {
  return (
    value &&
    typeof value === 'object' &&
    'access_token' in value &&
    'refresh_token' in value &&
    Boolean((value as any).access_token)
  )
}

const isVerificationRequiredResponse = (value: any): value is { user_id: string } => {
  return value && typeof value === 'object' && 'user_id' in value && !('access_token' in value)
}

const socials = [
  { id: 'telegram', label: 'Telegram', icon: '/assets/images/icons/telegram.svg' },
  { id: 'facebook', label: 'Facebook', icon: '/assets/images/icons/facebook.svg' },
  { id: 'google', label: 'Google', icon: '/assets/images/icons/google.svg' },
  { id: 'apple', label: 'Apple', icon: '/assets/images/icons/apple.svg' },
]

const validate = () => {
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  if (!form.email) {
    errors.email = t('alerts.validation_required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t('alerts.validation_email')
  }

  if (!form.password) {
    errors.password = t('alerts.validation_required')
  } else if (form.password.length < 8) {
    errors.password = t('alerts.validation_password_length')
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = t('alerts.validation_required')
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = t('alerts.password_mismatch')
  }

  return !errors.email && !errors.password && !errors.confirmPassword
}

const fetchProfile = async () => {
  const profile = await getMe()
  setUserProfile(profile as any)
}

const handleSubmit = async () => {
  if (!validate()) return

  try {
    const response = await register({ ...form })

    if (isAuthSessionResponse(response)) {
      setSession(response)
      await fetchProfile()

      openModal({
        mode: 'alert',
        title: t('auth.register_title'),
        description: t('alerts.login_success'),
        cancelLabel: t('modal.close'),
      })

      await router.push('/')
      return
    }

    if (isVerificationRequiredResponse(response)) {
      openModal({
        mode: 'alert',
        title: t('auth.email_verification_title'),
        description: t('auth.registration_success'),
        cancelLabel: t('modal.close'),
      })

      await requestEmailConfirmation({ email: form.email })
      await router.push({
        path: '/auth/verify-email',
        query: { email: form.email },
      })
      return
    }

    openModal({
      mode: 'alert',
      title: t('alerts.error_title'),
      description: t('alerts.login_error_description'),
      cancelLabel: t('modal.close'),
    })
  } catch (error: any) {
    const code = error?.data?.error?.code

    if (code === 'conflict') {
      errors.email = t('alerts.conflict_error')
      return
    }

    const message = error?.data?.error?.message
    push({
      title: t('alerts.error_title'),
      description: message || code || t('alerts.login_error_description'),
      type: 'error',
    })
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
