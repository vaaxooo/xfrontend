<template>
  <AuthCard
    :title="t('auth.recovery_title')"
    :description="t('auth.recovery_description')"
    :socials="socials"
    @social="handleSocialClick"
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
import { useAuthState, type AuthSession } from '@/composables/useAuthState'
import { useGoogleAuth } from '@/composables/useGoogleAuth'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const { requestPasswordReset, googleLogin, getMe } = useAuthApi()
const { push } = useAlerts()
const { setSession, setUserProfile } = useAuthState()
const { promptGoogleIdToken } = useGoogleAuth()
const router = useRouter()

const email = ref('')
const error = ref('')

const socials = [
  { id: 'telegram', label: 'Telegram', icon: '/assets/images/icons/telegram.svg' },
  { id: 'facebook', label: 'Facebook', icon: '/assets/images/icons/facebook.svg' },
  { id: 'google', label: 'Google', icon: '/assets/images/icons/google.svg' },
  { id: 'apple', label: 'Apple', icon: '/assets/images/icons/apple.svg' },
]

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

  try {
    await requestPasswordReset({ email: email.value })
    push({
      title: t('alerts.recovery_sent_title'),
      description: t('alerts.recovery_sent_body'),
      type: 'info',
    })
  } catch (error: any) {
    const message = error?.error?.message || error?.message || error?.data?.error?.message || error?.data?.error?.code

    push({
      title: t('alerts.error_title'),
      description: message || t('alerts.login_error_description'),
      type: 'error',
    })
  }
}

const fetchProfile = async () => {
  const profile = await getMe()
  setUserProfile(profile as any)
}

const completeAuthentication = async (session: AuthSession) => {
  setSession(session)
  await fetchProfile()

  push({
    title: t('auth.login_title'),
    description: t('alerts.login_success'),
    type: 'info',
  })

  await router.push('/')
}

const handleGoogleLogin = async () => {
  try {
    const idToken = await promptGoogleIdToken()
    const response = await googleLogin({ id_token: idToken })

    if (isAuthSessionResponse(response)) {
      await completeAuthentication(response)
      return
    }

    push({ title: t('alerts.error_title'), description: t('alerts.login_error_description'), type: 'error' })
  } catch (error: any) {
    const message = error?.message ?? error?.data?.error?.message ?? error?.data?.error?.code

    push({
      title: t('alerts.error_title'),
      description: message || t('alerts.login_error_description'),
      type: 'error',
    })
  }
}

const handleSocialClick = async (providerId: string) => {
  if (providerId === 'google') {
    await handleGoogleLogin()
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
