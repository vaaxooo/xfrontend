<template>
  <AppSection :title="t('profile.personal_data')">
    <div class="block">
      <div class="table-section">
        <EditableField
          v-for="field in fields"
          :key="field.key"
          :label="field.label"
          :model-value="field.value"
          :editable="field.editable ?? true"
          :icon="field.icon"
          :actionable="field.actionable"
          @save="(value) => handleSave(field.key, value)"
          @action="field.onAction?.()"
        />
      </div>
    </div>
  </AppSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import EditableField from '@/components/profile/EditableField.vue'
import AppSection from '@/components/common/AppSection.vue'
import { useI18n } from '@/composables/useI18n'
import { useProfileApi } from '@/composables/useProfileApi'
import { useAuthState } from '@/composables/useAuthState'
import { useModal } from '@/composables/useModal'
import { useAuthApi } from '@/composables/useAuthApi'
import { useAlerts } from '@/composables/useAlerts'

const editableProfile = ref({
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
})

const { t } = useI18n()
const { updateProfileField } = useProfileApi()
const { user, setUserProfile } = useAuthState()
const { openModal } = useModal()
const { requestEmailConfirmation } = useAuthApi()
const { push } = useAlerts()

watch(
  user,
  (value) => {
    editableProfile.value = {
      first_name: value?.first_name ?? '',
      middle_name: value?.middle_name ?? '',
      last_name: value?.last_name ?? '',
      email: (value as any)?.email ?? '',
    }
  },
  { immediate: true },
)

const handleRequestEmailVerification = () => {
  if (!editableProfile.value.email) return

  openModal({
    title: t('profile.verify_email_title'),
    description: t('profile.verify_email_description'),
    confirmLabel: t('profile.verify_email_submit'),
    cancelLabel: t('modal.cancel'),
    onConfirm: async () => {
      await requestEmailConfirmation({ email: editableProfile.value.email })

      push({
        title: t('alerts.email_verification_sent_title'),
        description: t('alerts.email_verification_sent_body'),
        type: 'success',
      })
    },
  })
}

const fields = computed(() =>
  [
    { key: 'first_name', value: editableProfile.value.first_name },
    { key: 'middle_name', value: editableProfile.value.middle_name },
    { key: 'last_name', value: editableProfile.value.last_name },
    {
      key: 'email',
      value: editableProfile.value.email,
      editable: false,
      actionable: !user.value?.login_settings?.email_verified,
      icon: user.value?.login_settings?.email_verified
        ? '/assets/images/icons/green-check.svg'
        : '/assets/images/icons/arrow-right.svg',
      onAction: handleRequestEmailVerification,
    },
  ].map((field) => ({
    ...field,
    label: t(`profile.${field.key}`),
  })),
)

const handleSave = async (key: string, value: string) => {
  await updateProfileField({ [key]: value })
  editableProfile.value = {
    ...editableProfile.value,
    [key]: value,
  }

  if (user.value) {
    setUserProfile({ ...user.value, [key]: value })
  }
}
</script>
