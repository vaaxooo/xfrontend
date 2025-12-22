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
          @keydown.backspace="() => focusPrevious(index)"
        >
      </div>

      <div class="auth-actions">
        <button type="submit" class="button button--auth w-full center button-md">
          {{ t('auth.otp_submit') }}
          <img src="/assets/images/icons/arrow-right-white.svg" alt="arrow" class="w-24 h-24">
        </button>
      </div>

      <p v-if="otpError" class="input-error">{{ otpError }}</p>

      <div class="auth-footer">
        <span class="center justify-content-center">
          {{ t('auth.otp_help') }}
          <button type="button" class="link link--primary" @click="handleResend">{{ t('auth.otp_resend') }}</button>
        </span>
      </div>
    </form>
  </AuthCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
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

const setInputRef = (el: HTMLInputElement | null, index: number) => {
  if (el) {
    inputRefs.value[index] = el
  }
}

const focusPrevious = (index: number) => {
  if (index > 0) {
    inputRefs.value[index - 1]?.focus()
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

    if (response && typeof response === 'object' && 'access_token' in response && 'refresh_token' in response) {
      setSession(response as AuthSession)

      const profile = await getMe()
      setUserProfile(profile as any)
    }

    openModal({
      mode: 'alert',
      title: t('auth.otp_title'),
      description: t('auth.otp_confirmed'),
      cancelLabel: t('modal.close'),
    })

    await router.push('/')
  } catch (error: any) {
    const code = error?.data?.error?.code
    const message = error?.data?.error?.message
    push({
      title: t('alerts.login_error_title'),
      description: message || code || t('alerts.login_error_description'),
      type: 'error',
    })
  }
}

const handleResend = async () => {
  if (!challengeId.value) return

  await resendChallengeEmail({ challenge_id: challengeId.value })
  push({ title: t('auth.otp_resend'), description: t('auth.otp_resend_description'), type: 'info' })
}

const ensureChallengeReady = async () => {
  if (!challengeId.value) return

  const status = await challengeStatus({ challenge_id: challengeId.value })

  if (status && typeof status === 'object') {
    const requiredSteps = (status as any).required_steps as string[] | undefined
    const completedSteps = (status as any).completed_steps as string[] | undefined

    if (requiredSteps?.includes('email_verification') && !completedSteps?.includes('email_verification')) {
      await router.push({
        path: '/auth/verify-email',
        query: {
          challenge_id: challengeId.value,
          masked_email: (status as any).masked_email || (route.query.masked_email as string),
          required_steps: requiredSteps.join(','),
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
