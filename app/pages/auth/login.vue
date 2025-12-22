<template>
  <AuthCard
    :title="t('auth.loginTitle')"
    :description="t('auth.loginDescription')"
    :socials="socials"
  >
    <form class="auth-form" @submit.prevent="handleSubmit">
      <div class="field">
        <input
          v-model="form.email"
          type="email"
          :placeholder="t('auth.emailPlaceholder')"
          class="input"
          required
        >
      </div>

      <div class="field">
        <input
          v-model="form.password"
          type="password"
          :placeholder="t('auth.passwordPlaceholder')"
          class="input"
          required
        >
      </div>

      <div class="row">
        <label class="checkbox">
          <input v-model="form.remember" type="checkbox" class="checkbox__input">
          <span class="checkbox__box" />
          <span class="checkbox__label">{{ t('auth.rememberMe') }}</span>
        </label>

        <NuxtLink to="/auth/recovery" class="link link--primary">{{ t('auth.forgotPassword') }}</NuxtLink>
      </div>

      <div class="auth-actions">
        <button type="submit" class="button button--auth w-full center button-md">
          {{ t('auth.submitLogin') }}
          <img src="/assets/images/icons/arrow-right-white.svg" alt="arrow" class="w-24 h-24">
        </button>
      </div>

      <div class="auth-footer">
        <span class="center justify-content-center">
          {{ t('auth.noAccount') }}
          <NuxtLink to="/auth/register" class="link link--primary">{{ t('auth.toRegister') }}</NuxtLink>
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
const { login } = useAuthApi()
const { openModal } = useModal()
const { push } = useAlerts()
const router = useRouter()
const { setSession } = useAuthState()

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

const socials = [
  { id: 'telegram', label: 'Telegram', icon: '/assets/images/icons/telegram.svg' },
  { id: 'facebook', label: 'Facebook', icon: '/assets/images/icons/facebook.svg' },
  { id: 'google', label: 'Google', icon: '/assets/images/icons/google.svg' },
  { id: 'apple', label: 'Apple', icon: '/assets/images/icons/apple.svg' },
]

const handleSubmit = async () => {
  try {
    const response = await login({ email: form.email, password: form.password })

    if (response && typeof response === 'object' && 'status' in response && response.status === 'challenge_required') {
      push({
        title: t('auth.otpTitle'),
        description: t('auth.otpDescription'),
        type: 'info',
      })

      await router.push({
        path: '/auth/otp',
        query: {
          challenge_id: (response as any).challenge_id,
          attempts_left: (response as any).attempts_left,
          masked_email: (response as any).masked_email,
        },
      })
      return
    }

    if (response && typeof response === 'object' && 'access_token' in response && 'refresh_token' in response) {
      setSession(response as AuthSession)

      openModal({
        mode: 'alert',
        title: t('auth.loginTitle'),
        description: t('alerts.loginSuccess'),
        cancelLabel: t('modal.close'),
      })

      await router.push('/')
      return
    }

    push({ title: t('alerts.loginErrorTitle'), description: t('alerts.loginErrorDescription'), type: 'error' })
  } catch (error: any) {
    const code = error?.data?.error?.code
    const message = error?.data?.error?.message

    push({
      title: t('alerts.loginErrorTitle'),
      description: message || code || t('alerts.loginErrorDescription'),
      type: 'error',
    })
  }
}
</script>
