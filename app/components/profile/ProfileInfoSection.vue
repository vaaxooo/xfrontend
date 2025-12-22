<template>
  <AppSection :title="t('profile.personal_data')">
    <div class="block">
      <div class="table-section">
        <EditableField
          v-for="field in fields"
          :key="field.key"
          :label="field.label"
          :model-value="field.value"
          @save="(value) => handleSave(field.key, value)"
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

const editableProfile = ref({
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
})

const { t } = useI18n()
const { updateProfileField } = useProfileApi()
const { user, setUserProfile } = useAuthState()

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

const fields = computed(() =>
  [
    { key: 'first_name', value: editableProfile.value.first_name },
    { key: 'middle_name', value: editableProfile.value.middle_name },
    { key: 'last_name', value: editableProfile.value.last_name },
    { key: 'email', value: editableProfile.value.email },
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
