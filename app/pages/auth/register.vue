<template>
  <AuthCard
    :title="t('auth.registerTitle')"
    :description="t('auth.registerDescription')"
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

      <div class="field">
        <input
          v-model="form.confirmPassword"
          type="password"
          :placeholder="t('auth.repeatPasswordPlaceholder')"
          class="input"
          required
        >
      </div>

      <div class="auth-actions">
        <button type="submit" class="button button--auth w-full center button-md">
          {{ t('auth.createAccount') }}
          <img src="/assets/images/icons/arrow-right-white.svg" alt="arrow" class="w-24 h-24">
        </button>
      </div>

      <div class="auth-footer">
        <span class="center justify-content-center">
          {{ t('auth.haveAccount') }}
          <NuxtLink to="/auth/login" class="link link--primary">{{ t('auth.toLogin') }}</NuxtLink>
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

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const { register } = useAuthApi()
const { openModal } = useModal()

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

const socials = [
  { id: 'telegram', label: 'Telegram', icon: '/assets/images/icons/telegram.svg' },
  { id: 'facebook', label: 'Facebook', icon: '/assets/images/icons/facebook.svg' },
  { id: 'google', label: 'Google', icon: '/assets/images/icons/google.svg' },
  { id: 'apple', label: 'Apple', icon: '/assets/images/icons/apple.svg' },
]

const handleSubmit = async () => {
  await register({ ...form })
  openModal({
    mode: 'alert',
    title: t('auth.registerTitle'),
    description: 'Мы создали ваш аккаунт. Пожалуйста, подтвердите email для завершения регистрации.',
    cancelLabel: t('modal.close'),
  })
}
</script>
