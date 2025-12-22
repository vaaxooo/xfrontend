<template>
  <AuthCard
    :title="t('auth.login_title')"
    :description="t('auth.login_description')"
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

      <div class="row">
        <label class="checkbox">
          <input v-model="form.remember" type="checkbox" class="checkbox__input">
          <span class="checkbox__box" />
          <span class="checkbox__label">{{ t('auth.remember_me') }}</span>
        </label>

        <NuxtLink to="/auth/recovery" class="link link--primary">{{ t('auth.forgot_password') }}</NuxtLink>
      </div>

      <div class="auth-actions">
        <button type="submit" class="button button--auth w-full center button-md">
          {{ t('auth.submit_login') }}
          <img src="/assets/images/icons/arrow-right-white.svg" alt="arrow" class="w-24 h-24">
        </button>
      </div>

      <div class="auth-footer">
        <span class="center justify-content-center">
          {{ t('auth.no_account') }}
          <NuxtLink to="/auth/register" class="link link--primary">{{ t('auth.to_register') }}</NuxtLink>
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
import { useAlerts } from '@/composables/useAlerts'
import { useRouter } from 'vue-router'
import { useAuthState, type AuthSession } from '@/composables/useAuthState'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const { login, getMe } = useAuthApi()
const { openModal } = useModal()
const { push } = useAlerts()
const router = useRouter()
const { setSession, setUserProfile } = useAuthState()

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

const errors = reactive({
  email: '',
  password: '',
})

const socials = [
  { id: 'telegram', label: 'Telegram', icon: '/assets/images/icons/telegram.svg' },
  { id: 'facebook', label: 'Facebook', icon: '/assets/images/icons/facebook.svg' },
  { id: 'google', label: 'Google', icon: '/assets/images/icons/google.svg' },
  { id: 'apple', label: 'Apple', icon: '/assets/images/icons/apple.svg' },
]

const validate = () => {
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = t('alerts.validation_required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t('alerts.validation_email')
  }

  if (!form.password) {
    errors.password = t('alerts.validation_required')
  }

  return !errors.email && !errors.password
}

const fetchProfile = async () => {
  const profile = await getMe()
  setUserProfile(profile as any)
}

const handleSubmit = async () => {
  if (!validate()) return

  try {
    const response = await login({ email: form.email, password: form.password })

    if (response && typeof response === 'object' && 'status' in response && response.status === 'challenge_required') {
      const requiredSteps = (response as any).required_steps as string[] | undefined
      const hasEmailStep = requiredSteps?.includes('email_verification')
      const hasTotp = requiredSteps?.includes('totp')

      push({
        title: hasEmailStep ? t('auth.email_verification_title') : t('auth.otp_title'),
        description: hasEmailStep
          ? t('auth.email_verification_description')
          : t('alerts.totp_required'),
        type: 'info',
      })

      const target = hasEmailStep ? '/auth/verify-email' : '/auth/otp'

      await router.push({
        path: target,
        query: {
          challenge_id: (response as any).challenge_id,
          masked_email: hasEmailStep ? (response as any).masked_email : undefined,
          required_steps: (response as any).required_steps?.join(',') ?? (hasTotp ? 'totp' : ''),
        },
      })
      return
    }

    if (response && typeof response === 'object' && 'access_token' in response && 'refresh_token' in response) {
      setSession(response as AuthSession)

      await fetchProfile()

      openModal({
        mode: 'alert',
        title: t('auth.login_title'),
        description: t('alerts.login_success'),
        cancelLabel: t('modal.close'),
      })

      await router.push('/')
      return
    }

    push({ title: t('alerts.login_error_title'), description: t('alerts.login_error_description'), type: 'error' })
  } catch (error: any) {
    const code = error?.data?.error?.code
    const message = error?.data?.error?.message

    push({
      title: t('alerts.login_error_title'),
      description: t('alerts.login_error_description') || message || code,
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
