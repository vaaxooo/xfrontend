<template>
  <AuthCard
    :title="t('auth.otpTitle')"
    :description="t('auth.otpDescription')"
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
          {{ t('auth.otpSubmit') }}
          <img src="/assets/images/icons/arrow-right-white.svg" alt="arrow" class="w-24 h-24">
        </button>
      </div>

      <div class="auth-footer">
        <span class="center justify-content-center">
          {{ t('auth.otpHelp') }}
          <button type="button" class="link link--primary" @click="handleResend">{{ t('auth.otpResend') }}</button>
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

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const { verifyChallengeTotp, resendChallengeEmail } = useAuthApi()
const { openModal } = useModal()
const { push } = useAlerts()
const route = useRoute()

const code = ref(Array(6).fill(''))
const inputRefs = ref<HTMLInputElement[]>([])
const challengeId = ref<string | null>(null)

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
  if (!challengeId.value) {
    push({ title: t('auth.otpMissing'), description: t('auth.otpMissingDescription'), type: 'warning' })
    return
  }

  await verifyChallengeTotp({ challenge_id: challengeId.value, otp_code: code.value.join('') })
  openModal({
    mode: 'alert',
    title: t('auth.otpTitle'),
    description: t('auth.otpConfirmed'),
    cancelLabel: t('modal.close'),
  })
}

const handleResend = async () => {
  if (!challengeId.value) return

  await resendChallengeEmail({ challenge_id: challengeId.value })
  push({ title: t('auth.otpResend'), description: t('auth.otpResendDescription'), type: 'info' })
}

onMounted(() => {
  inputRefs.value[0]?.focus()
  challengeId.value = (route.query.challenge_id as string) || null
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
</style>
