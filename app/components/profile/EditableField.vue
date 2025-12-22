<template>
  <div class="table-section__row" @click.prevent="!editing && startEditing()">
    <div class="table-section__label">{{ label }}</div>
    <div class="table-section__grouped-value" :class="{ 'table-section__grouped-value--editing': editing }">
      <template v-if="!editing">
        <div class="table-section__value">{{ modelValue }}</div>
        <img src="/assets/images/icons/arrow-right.svg" class="table-section__icon">
      </template>
      <template v-else>
        <input v-model="draft" class="input input--inline input-sm" :placeholder="label">
        <div class="table-section__actions">
          <button type="button" class="button button--success" @click.stop="handleSave">{{ t('profile.save') }}</button>
          <button type="button" class="button button--secondary" @click.stop="handleCancel">{{ t('profile.cancel') }}</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from '@/composables/useI18n'

const props = defineProps<{ label: string; modelValue: string }>()
const emit = defineEmits<{ save: [value: string] }>()

const { t } = useI18n()

const editing = ref(false)
const draft = ref(props.modelValue)

watch(
  () => props.modelValue,
  (value) => {
    if (!editing.value) {
      draft.value = value
    }
  },
)

const startEditing = () => {
  draft.value = props.modelValue
  editing.value = true
}

const handleSave = () => {
  emit('save', draft.value)
  editing.value = false
}

const handleCancel = () => {
  draft.value = props.modelValue
  editing.value = false
}
</script>

<style scoped>
.table-section__grouped-value--editing {
  display: flex;
  gap: var(--s-3);
  align-items: center;
}

.input--inline {
  width: 100%;
}

.table-section__actions {
  display: flex;
  gap: var(--s-2);
}
</style>
