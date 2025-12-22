<template>
  <div class="section">
    <div class="section-title">
      {{ t('security.login_settings') }}
    </div>

    <div class="block row p-16">
      <div class="row">
        <div class="icon">
          <img src="/assets/images/icons/lock.svg" class="w-32 h-32">
        </div>

        <div class="block-content">
          <div class="block-content__title">
            {{ t('security.password_title') }}
          </div>

          <div class="block-content__description">
            {{ t('security.password_description') }}
          </div>
        </div>
      </div>

      <div class="block-action">
        <button
          type="button"
          class="button button--secondary"
          @click="handlePasswordChange"
        >
          {{ t('security.change_password') }}
        </button>
      </div>
    </div>

    <SocialAuthBlock />
  </div>
</template>

<script setup lang="ts">
import SocialAuthBlock from '@/components/profile/security/SocialAuthBlock.vue'
import { useI18n } from '@/composables/useI18n'
import { useModal } from '@/composables/useModal'
import { useAuthApi } from '@/composables/useAuthApi'

const { t } = useI18n()
const { openModal } = useModal()
const { requestPasswordReset } = useAuthApi()

const handlePasswordChange = () => {
  openModal({
    title: t('security.change_password'),
    description: t('security.change_password_description'),
    confirmLabel: t('security.change_password_submit'),
    cancelLabel: t('modal.cancel'),
    fields: [
      {
        name: 'email',
        label: t('profile.email'),
        placeholder: 'you@example.com',
        type: 'email',
      },
    ],
    onConfirm: async (values) => {
      if (values.email) {
        await requestPasswordReset({ email: values.email })
      } else {
        openModal({
          mode: 'alert',
          title: t('alerts.error_title'),
          description: t('alerts.invalid_email'),
          cancelLabel: t('modal.close'),
      })
    }

    openModal({
      mode: 'alert',
      title: t('alerts.recovery_sent_title'),
      description: t('alerts.recovery_sent_body'),
      cancelLabel: t('modal.close'),
    })
  },
})
}
</script>
