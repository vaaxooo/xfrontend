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
import { computed, ref } from 'vue'
import EditableField from '@/components/profile/EditableField.vue'
import AppSection from '@/components/common/AppSection.vue'
import { useI18n } from '@/composables/useI18n'
import { useProfileApi } from '@/composables/useProfileApi'

const rawFields = ref([
  { key: 'first_name', value: 'Никита' },
  { key: 'middle_name', value: 'Александрович' },
  { key: 'last_name', value: 'Печенкин' },
  { key: 'email', value: 'vaaxooo@gmail.com' },
])

const { t } = useI18n()
const { updateProfileField } = useProfileApi()

const fields = computed(() =>
  rawFields.value.map((field) => ({
    ...field,
    label: t(`profile.${field.key}`),
  })),
)

const handleSave = async (key: string, value: string) => {
  await updateProfileField({ [key]: value })
  const target = rawFields.value.find((field) => field.key === key)

  if (target) {
    target.value = value
  }
}
</script>
