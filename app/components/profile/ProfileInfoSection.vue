<template>
  <AppSection title="Персональные данные">
    <div class="block">
      <div class="table-section">
        <a
          v-for="field in profileFields"
          :key="field.key"
          href="#"
          class="table-section__row"
          @click.prevent="handleEdit(field)"
        >
          <div class="table-section__label">{{ field.label }}</div>
          <div class="table-section__grouped-value">
            <div class="table-section__value">{{ field.value }}</div>
            <img src="/assets/images/icons/arrow-right.svg" class="table-section__icon">
          </div>
        </a>
      </div>
    </div>
  </AppSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppSection from '@/components/common/AppSection.vue'
import { useModal } from '@/composables/useModal'
import { useProfileApi } from '@/composables/useProfileApi'

const profileFields = ref([
  { key: 'firstName', label: 'Имя', value: 'Никита' },
  { key: 'middleName', label: 'Отчество', value: 'Александрович' },
  { key: 'lastName', label: 'Фамилия', value: 'Печенкин' },
  { key: 'email', label: 'E-mail', value: 'vaaxooo@gmail.com' },
])

const { openModal } = useModal()
const { updateProfileField } = useProfileApi()

const handleEdit = (field: { key: string; label: string; value: string }) => {
  openModal({
    title: `Изменить «${field.label}»`,
    description: `Текущее значение: <strong>${field.value}</strong>`,
    confirmLabel: 'Сохранить',
    onConfirm: async () => {
      await updateProfileField({ field: field.key, value: field.value })
    },
  })
}
</script>
