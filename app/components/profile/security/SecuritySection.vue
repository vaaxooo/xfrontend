<template>
  <AppSection :title="t('security.twoFactor')">
    <div class="block row p-16">
      <div class="row">
        <div class="icon">
          <img src="/assets/images/icons/2fa.svg" class="w-32 h-32">
        </div>

        <div class="block-content">
          <div class="block-content__title">
            {{ t('security.twoFactor') }}
          </div>

          <div class="block-content__description">
            {{ t('security.twoFactorDescription') }}
          </div>
        </div>
      </div>

      <div class="block-action">
        <button
          type="button"
          class="button button--success"
          @click="handleEnableTwoFactor"
        >
          {{ t('security.enable') }}
        </button>
      </div>
    </div>
  </AppSection>
</template>

<script setup lang="ts">
import AppSection from '@/components/common/AppSection.vue'
import { useI18n } from '@/composables/useI18n'
import { useModal } from '@/composables/useModal'
import { useProfileApi } from '@/composables/useProfileApi'

const { t } = useI18n()
const { openModal } = useModal()
const { enableTwoFactor } = useProfileApi()

const handleEnableTwoFactor = () => {
  openModal({
    title: t('security.twoFactor'),
    description: t('security.twoFactorDescription'),
    confirmLabel: t('security.enable'),
    cancelLabel: t('modal.cancel'),
    onConfirm: async () => {
      await enableTwoFactor()
      openModal({
        mode: 'alert',
        title: t('security.twoFactor'),
        description: t('security.twoFactorDescription'),
        cancelLabel: t('modal.close'),
      })
    },
  })
}
</script>
