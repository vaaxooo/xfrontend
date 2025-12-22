<template>
  <AuthCard
    :title="t('auth.otp_title')"
    :description="t('auth.otp_description')"
  >
    <form class="auth-form" @submit.prevent="handleSubmit">
      <div class="otp-inputs">
        <input
          v-for="(_, index) in code"
          :key="index"
          :ref="(el) => setInputRef(el as HTMLInputElement | null, index)"
          v-model="code[index]"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="1"
          class="input otp-input"
          @input="(event) => handleInput(event as InputEvent, index)"
          @keydown.backspace.prevent="(event) => handleBackspace(event as KeyboardEvent, index)"
        >
      </div>

      <div class="auth-actions">
        <button type="submit" class="button button--auth w-full center button-md">
          {{ t('auth.otp_submit') }}
          <img src="/assets/images/icons/arrow-right-white.svg" alt="arrow" class="w-24 h-24">
        </button>
      </div>

      <p v-if="otpError" class="input-error">{{ otpError }}</p>

      <div v-if="hasEmailStep" class="auth-footer">
        <span class="center justify-content-center">
          {{ t('auth.otp_help') }}
          <button type="button" class="link link--primary" @click="handleResend">{{ t('auth.otp_resend') }}</button>
        </span>
      </div>
    </form>
  </AuthCard>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import { useAuthApi } from '@/composables/useAuthApi'
import { useI18n } from '@/composables/useI18n'
import { useModal } from '@/composables/useModal'
import { useRoute } from 'vue-router'
import { useAlerts } from '@/composables/useAlerts'
import { useAuthState, type AuthSession } from '@/composables/useAuthState'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const { verifyChallengeTotp, resendChallengeEmail, challengeStatus, getMe } = useAuthApi()
const { openModal } = useModal()
const { push } = useAlerts()
const route = useRoute()
const router = useRouter()
const { setSession, setUserProfile } = useAuthState()

const code = ref(Array(6).fill(''))
const inputRefs = ref<HTMLInputElement[]>([])
const challengeId = ref<string | null>(null)
const otpError = ref('')
const requiredSteps = ref<string[]>([])

const setInputRef = (el: HTMLInputElement | null, index: number) => {
  if (el) {
    inputRefs.value[index] = el
  }
}

const handleInput = (event: InputEvent, index: number) => {
  const target = event.target as HTMLInputElement
  const value = target.value.slice(-1)
  code.value[index] = value

  if (value && index < inputRefs.value.length - 1) {
    inputRefs.value[index + 1]?.focus()
  }
}

const handleBackspace = (event: KeyboardEvent, index: number) => {
  if (code.value[index]) {
    code.value[index] = ''
    return
  }

  if (index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

const hasEmailStep = computed(() => requiredSteps.value.includes('email_verification'))

const handleSubmit = async () => {
  otpError.value = ''

  if (!challengeId.value) {
    push({ title: t('auth.otp_missing'), description: t('auth.otp_missing_description'), type: 'warning' })
    return
  }

  const codeValue = code.value.join('')
  if (codeValue.length < 6) {
    otpError.value = t('alerts.otp_required')
    return
  }

  try {
    const response = await verifyChallengeTotp({ challenge_id: challengeId.value, otp_code: codeValue })

    if (response && typeof response === 'object') {
      if ('access_token' in response && 'refresh_token' in response) {
        setSession(response as AuthSession)

        const profile = await getMe()
        setUserProfile(profile as any)

        openModal({
          mode: 'alert',
          title: t('auth.otp_title'),
          description: t('auth.otp_confirmed'),
          cancelLabel: t('modal.close'),
        })

        await router.push('/')
        return
      }

      if ('status' in response && (response as any).status === 'challenge_required') {
        const attemptsLeft = (response as any).attempts_left
        otpError.value =
          attemptsLeft !== undefined
            ? t('alerts.totp_invalid_attempts', { attempts: attemptsLeft })
            : t('alerts.totp_invalid')
        challengeId.value = (response as any).challenge_id ?? challengeId.value
        return
      }
    }

    otpError.value = t('alerts.login_error_description')
  } catch (error: any) {
    const code = error?.data?.error?.code
    const message = error?.data?.error?.message
    otpError.value = t('alerts.totp_invalid') || message || code || ''
    push({
      title: t('alerts.login_error_title'),
      description: t('alerts.login_error_description') || message || code,
      type: 'error',
    })
  }
}

const handleResend = async () => {
  if (!challengeId.value || !hasEmailStep.value) return

  await resendChallengeEmail({ challenge_id: challengeId.value })
  push({ title: t('auth.otp_resend'), description: t('auth.otp_resend_description'), type: 'info' })
}

const ensureChallengeReady = async () => {
  if (!challengeId.value) return

  const status = await challengeStatus({ challenge_id: challengeId.value })

  if (status && typeof status === 'object') {
    const steps = (status as any).required_steps as string[] | undefined
    const completedSteps = (status as any).completed_steps as string[] | undefined
    if (steps) {
      requiredSteps.value = steps
    }

    if (steps?.includes('email_verification') && !completedSteps?.includes('email_verification')) {
      await router.push({
        path: '/auth/verify-email',
        query: {
          challenge_id: challengeId.value,
          masked_email: (status as any).masked_email || (route.query.masked_email as string),
          required_steps: steps.join(','),
        },
      })
      return
    }

    if ('access_token' in status && 'refresh_token' in status) {
      setSession(status as AuthSession)
      const profile = await getMe()
      setUserProfile(profile as any)
      await router.push('/')
    }
  }
}

onMounted(() => {
  inputRefs.value[0]?.focus()
  challengeId.value = (route.query.challenge_id as string) || null
  const rawSteps = (route.query.required_steps as string) || ''
  if (rawSteps) {
    requiredSteps.value = rawSteps.split(',').filter(Boolean)
  }
  ensureChallengeReady()
})
</script>

<style scoped>
.otp-inputs {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: var(--s-3);
}

.otp-input {
  text-align: center;
  font-size: var(--fs-20);
}

.link {
  background: transparent;
  border: 0;
  cursor: pointer;
}

.input-error {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 8px;
}
</style>
