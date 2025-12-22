<template>
  <div class="section">
    <div class="section-title">
      {{ t('security.loginSettings') }}
    </div>

    <div class="block row p-16">
      <div class="row">
        <div class="icon">
          <img src="/assets/images/icons/lock.svg" class="w-32 h-32">
        </div>

        <div class="block-content">
          <div class="block-content__title">
            {{ t('security.passwordTitle') }}
          </div>

          <div class="block-content__description">
            {{ t('security.passwordDescription') }}
          </div>
        </div>
      </div>

      <div class="block-action">
        <button
          type="button"
          class="button button--secondary"
          @click="handlePasswordChange"
        >
          {{ t('security.changePassword') }}
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
import { useProfileApi } from '@/composables/useProfileApi'

const { t } = useI18n()
const { openModal } = useModal()
const { changePassword } = useProfileApi()

const handlePasswordChange = () => {
  openModal({
    title: t('security.changePassword'),
    description: t('security.changePasswordDescription'),
    confirmLabel: t('security.changePasswordSubmit'),
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
      await changePassword({ strategy: 'email-link', email: values.email })

      openModal({
        mode: 'alert',
        title: t('alerts.recoverySentTitle'),
        description: t('alerts.recoverySentBody'),
        cancelLabel: t('modal.close'),
      })
    },
  })
}
</script>
