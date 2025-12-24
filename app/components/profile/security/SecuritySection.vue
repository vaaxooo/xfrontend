<template>
  <AppSection :title="t('security.two_factor')">
    <div class="block row p-16">
      <div class="row">
        <div class="icon">
          <img src="/assets/images/icons/2fa.svg" class="w-32 h-32">
        </div>

        <div class="block-content">
          <div class="block-content__title">
            {{ t('security.two_factor') }}
          </div>

          <div class="block-content__description">
            {{ t('security.two_factor_description') }}
          </div>
        </div>
      </div>

      <div class="block-action">
        <button
          type="button"
          :class="twoFactorEnabled ? 'button button--secondary' : 'button button--primary'"
          @click="twoFactorEnabled ? handleDisableTwoFactor() : handleEnableTwoFactor()"
        >
          {{ twoFactorEnabled ? t('security.disable') : t('security.enable') }}
        </button>
      </div>
    </div>
  </AppSection>
</template>

<script setup lang="ts">
import AppSection from '@/components/common/AppSection.vue'
import { useI18n } from '@/composables/useI18n'
import { useModal } from '@/composables/useModal'
import { useAuthApi } from '@/composables/useAuthApi'
import TwoFactorSetupContent from '@/components/profile/security/TwoFactorSetupContent.vue'
import DisableTwoFactorOtp from '@/components/profile/security/DisableTwoFactorOtp.vue'
import { useAlerts } from '@/composables/useAlerts'
import { computed } from 'vue'
import { useAuthState } from '@/composables/useAuthState'
import { getApiErrorMessage, getApiSuccessMessage } from '@/utils/apiMessages'

const { t } = useI18n()
const { openModal } = useModal()
const { startTotpSetup, confirmTotpSetup, disableTotp } = useAuthApi()
const { push } = useAlerts()
const { user, setUserProfile } = useAuthState()

const twoFactorEnabled = computed(() => Boolean(user.value?.login_settings?.two_factor_enabled))

const handleEnableTwoFactor = async () => {
  if (twoFactorEnabled.value) return

  const enrollment = await startTotpSetup()

  openModal({
    title: t('security.two_factor'),
    description: t('security.two_factor_setup_intro'),
    confirmLabel: t('security.enable'),
    cancelLabel: t('modal.cancel'),
    onConfirm: async (values) => {
      const response = await confirmTotpSetup({ code: values.code ?? '' })

      const successMessage = getApiSuccessMessage(response)

      if (user.value) {
        setUserProfile({
          ...user.value,
          login_settings: {
            ...(user.value.login_settings ?? {}),
            two_factor_enabled: true,
          },
        })
      }

      push({
        title: t('alerts.totp_enabled_title'),
        description: successMessage || t('alerts.totp_enabled_body'),
        type: 'success',
      })
    },
    fields: [
      {
        name: 'code',
        label: t('security.totp_placeholder'),
        placeholder: '123456',
        type: 'text',
      },
    ],
    component: TwoFactorSetupContent,
    componentProps: {
      secret: (enrollment as any)?.secret,
      otpauthUri: (enrollment as any)?.uri,
      qr: (enrollment as any)?.qr,
    },
  })
}

const handleDisableTwoFactor = () => {
  openModal({
    title: t('security.two_factor'),
    description: t('security.two_factor_disable_confirmation'),
    confirmLabel: t('security.disable'),
    cancelLabel: t('modal.cancel'),
    component: DisableTwoFactorOtp,
    onConfirm: async (values) => {
      const code = (values.code ?? '').trim()

      if (code.length !== 6) {
        push({ title: t('alerts.error_title'), description: t('alerts.totp_required'), type: 'warning' })
        throw new Error('otp_required')
      }

      try {
        const response = await disableTotp({ code })

        const successMessage = getApiSuccessMessage(response)

        if (user.value) {
          setUserProfile({
            ...user.value,
            login_settings: {
              ...(user.value.login_settings ?? {}),
              two_factor_enabled: false,
            },
          })
        }

        push({
          title: t('alerts.totp_disabled_title'),
          description: successMessage || t('alerts.totp_disabled_body'),
          type: 'success',
        })
      } catch (error: any) {
        const codeError = t('alerts.totp_invalid') || getApiErrorMessage(error, t)
        push({ title: t('alerts.error_title'), description: codeError, type: 'error' })
        throw error
      }
    },
  })
}
</script>
