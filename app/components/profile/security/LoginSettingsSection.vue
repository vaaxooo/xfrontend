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
const { openModal, setModalErrors } = useModal()
const { changePassword } = useAuthApi()

const getPasswordChangeErrors = (values: Record<string, string>) => {
  const errors: Record<string, string> = {}

  if (!values.current_password) {
    errors.current_password = t('alerts.validation_required')
  }

  if (!values.new_password) {
    errors.new_password = t('alerts.validation_required')
  } else if (values.new_password.length < 8) {
    errors.new_password = t('alerts.validation_password_length')
  }

  if (!values.confirm_new_password) {
    errors.confirm_new_password = t('alerts.validation_required')
  } else if (values.confirm_new_password !== values.new_password) {
    errors.confirm_new_password = t('alerts.password_mismatch')
  }

  return errors
}

const handlePasswordChange = () => {
  openModal({
    title: t('security.change_password'),
    description: t('security.change_password_description'),
    confirmLabel: t('security.change_password_submit'),
    cancelLabel: t('modal.cancel'),
    fields: [
      {
        name: 'current_password',
        label: t('security.current_password'),
        placeholder: t('security.current_password_placeholder'),
        type: 'password',
      },
      {
        name: 'new_password',
        label: t('security.new_password'),
        placeholder: t('security.new_password_placeholder'),
        type: 'password',
      },
      {
        name: 'confirm_new_password',
        label: t('security.confirm_new_password'),
        placeholder: t('security.confirm_new_password_placeholder'),
        type: 'password',
      },
    ],
    onConfirm: async (values) => {
      const errors = getPasswordChangeErrors(values)

      if (Object.keys(errors).length) {
        setModalErrors(errors)
        throw new Error('Validation failed')
      }

      try {
        await changePassword({
          current_password: values.current_password,
          new_password: values.new_password,
        })

        openModal({
          mode: 'alert',
          title: t('security.change_password'),
          description: t('alerts.password_changed'),
          cancelLabel: t('modal.close'),
        })
      } catch (error) {
        const message =
          typeof error === 'object' && error && 'message' in error
            ? (error as { message?: string }).message
            : undefined

        setModalErrors({
          form: message || t('alerts.error_title'),
        })

        throw error
      }
    },
  })
}
</script>
