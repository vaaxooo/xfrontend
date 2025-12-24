<template>
  <AuthCard
    :title="t('auth.login_title')"
    :description="t('auth.login_description')"
    :socials="socials"
    @social="handleSocialClick"
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
        <button type="submit" class="button button--auth w-full center">
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

    <div v-if="showTelegramWidget" class="auth-telegram-widget">
      <p class="auth-telegram-widget__hint">{{ t('auth.telegram_widget_hint') }}</p>
      <div ref="telegramWidgetRef" class="auth-telegram-widget__container" />
    </div>
  </AuthCard>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import { useAuthApi } from '@/composables/useAuthApi'
import { useI18n } from '@/composables/useI18n'
import { useModal } from '@/composables/useModal'
import { useAlerts } from '@/composables/useAlerts'
import { useRouter } from 'vue-router'
import { useAuthState, type AuthSession } from '@/composables/useAuthState'
import { useGoogleAuth } from '@/composables/useGoogleAuth'
import { useTelegramAuth } from '@/composables/useTelegramAuth'
import { getApiErrorMessage } from '@/utils/apiMessages'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const { login, getMe, googleLogin, telegramLogin } = useAuthApi()
const { openModal } = useModal()
const { push } = useAlerts()
const router = useRouter()
const { setSession, setUserProfile } = useAuthState()
const { promptGoogleIdToken } = useGoogleAuth()
const { hasTelegramWebApp, getTelegramInitData, promptTelegramWidget } = useTelegramAuth()

const showTelegramWidget = ref(false)
const telegramWidgetRef = ref<HTMLDivElement | null>(null)

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

const isChallengeRequired = (value: any): value is { status: string; required_steps?: string[] } => {
  return value && typeof value === 'object' && 'status' in value && (value as any).status === 'challenge_required'
}

const isAuthSessionResponse = (value: any): value is AuthSession => {
  return (
    value &&
    typeof value === 'object' &&
    'access_token' in value &&
    'refresh_token' in value &&
    Boolean((value as any).access_token)
  )
}

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

const completeAuthentication = async (session: AuthSession) => {
  setSession(session)

  await fetchProfile()

  openModal({
    mode: 'alert',
    title: t('auth.login_title'),
    description: t('alerts.login_success'),
    cancelLabel: t('modal.close'),
  })

  await router.push('/')
}

const handleAuthResponse = async (response: any) => {
  if (isChallengeRequired(response)) {
    const requiredSteps = response.required_steps as string[] | undefined
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
        required_steps: response.required_steps?.join(',') ?? (hasTotp ? 'totp' : ''),
      },
    })
    return
  }

  if (isAuthSessionResponse(response)) {
    await completeAuthentication(response)
    return
  }

  push({ title: t('alerts.login_error_title'), description: t('alerts.login_error_description'), type: 'error' })
}

const handleSubmit = async () => {
  if (!validate()) return

  try {
    const response = await login({ email: form.email, password: form.password })

    await handleAuthResponse(response)
  } catch (error: any) {
    const message = getApiErrorMessage(error, t)

    push({
      title: t('alerts.login_error_title'),
      description: t('alerts.login_error_description') || message,
      type: 'error',
    })
  }
}

const handleGoogleLogin = async () => {
  try {
    const idToken = await promptGoogleIdToken()
    const response = await googleLogin({ id_token: idToken })

    await handleAuthResponse(response)
  } catch (error: any) {
    const message = getApiErrorMessage(error, t)

    push({
      title: t('alerts.login_error_title'),
      description: t('alerts.login_error_description') || message,
      type: 'error',
    })
  }
}

const handleTelegramLogin = async () => {
  try {
    let initData: string

    if (hasTelegramWebApp()) {
      initData = getTelegramInitData()
    } else {
      showTelegramWidget.value = true
      await nextTick()
      initData = await promptTelegramWidget(telegramWidgetRef.value)
    }

    const response = await telegramLogin({ init_data: initData })

    await handleAuthResponse(response)
  } catch (error: any) {
    const message = getApiErrorMessage(error, t)

    push({
      title: t('alerts.login_error_title'),
      description: t('alerts.login_error_description') || message,
      type: 'error',
    })
  }
}

const handleSocialClick = async (providerId: string) => {
  if (providerId === 'google') {
    await handleGoogleLogin()
  }

  if (providerId === 'telegram') {
    await handleTelegramLogin()
  }
}
</script>

<style scoped>
.input--error {
  border: 1px solid #ff4d4f;
}

.input-error {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

.auth-telegram-widget {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.auth-telegram-widget__hint {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}
</style>
