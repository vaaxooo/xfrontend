<template>
  <AuthCard
    :title="t('auth.email_verification_title')"
    :description="t('auth.email_verification_description')"
  >
    <div class="auth-content stack">
      <p class="muted">
        {{ maskedEmail ? maskedEmail : '' }}
      </p>

      <div class="auth-actions column gap-12">
        <button type="button" class="button button--auth w-full center button-md" @click="handleCheckStatus">
          {{ t('auth.email_verification_cta') }}
          <img src="/assets/images/icons/arrow-right-white.svg" alt="arrow" class="w-24 h-24">
        </button>

        <button type="button" class="button button--secondary w-full center button-md" @click="handleResend">
          {{ t('auth.resend_email') }}
        </button>
      </div>

      <p v-if="statusMessage" class="status">{{ statusMessage }}</p>
    </div>
  </AuthCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthCard from '@/components/auth/AuthCard.vue'
import { useI18n } from '@/composables/useI18n'
import { useAuthApi } from '@/composables/useAuthApi'
import { useAlerts } from '@/composables/useAlerts'
import { useAuthState, type AuthSession } from '@/composables/useAuthState'

definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { resendChallengeEmail, requestEmailConfirmation, challengeStatus, getMe } = useAuthApi()
const { push } = useAlerts()
const { setSession, setUserProfile } = useAuthState()

const statusMessage = ref('')

const challengeId = computed(() => (route.query.challenge_id as string) || '')
const email = computed(() => (route.query.email as string) || '')
const maskedEmail = computed(() => (route.query.masked_email as string) || email.value)

const handleResend = async () => {
  if (challengeId.value) {
    await resendChallengeEmail({ challenge_id: challengeId.value })
  } else if (email.value) {
    await requestEmailConfirmation({ email: email.value })
  }

  push({ title: t('auth.resend_email'), description: t('auth.otp_resend_description'), type: 'info' })
}

const fetchProfile = async () => {
  const profile = await getMe()
  setUserProfile(profile as any)
}

const handleCheckStatus = async () => {
  statusMessage.value = ''

  if (!challengeId.value) {
    statusMessage.value = t('auth.email_verification_pending')
    return
  }

  try {
    const status = await challengeStatus({ challenge_id: challengeId.value })

    if (status && typeof status === 'object') {
      if ('access_token' in status && 'refresh_token' in status) {
        setSession(status as AuthSession)
        await fetchProfile()
        await router.push('/')
        return
      }

      const requiredSteps = (status as any).required_steps as string[] | undefined
      const completedSteps = (status as any).completed_steps as string[] | undefined

      if (requiredSteps?.includes('totp') && completedSteps?.includes('email_verification')) {
        await router.push({
          path: '/auth/otp',
          query: {
            challenge_id: challengeId.value,
            masked_email: (status as any).masked_email || maskedEmail.value,
            required_steps: requiredSteps.join(','),
          },
        })
        return
      }
    }

    statusMessage.value = t('auth.email_verification_pending')
  } catch (error: any) {
    const code = error?.data?.error?.code
    const message = error?.data?.error?.message
    push({
      title: t('alerts.error_title'),
      description: t('alerts.login_error_description') || message || code,
      type: 'error',
    })
  }
}
</script>

<style scoped>
.stack {
  display: grid;
  gap: var(--s-3);
}

.muted {
  color: var(--muted);
  margin: 0;
}

.status {
  margin: 0;
  color: var(--muted);
}

.column {
  display: grid;
}

.gap-12 {
  gap: var(--s-3);
}
</style>
