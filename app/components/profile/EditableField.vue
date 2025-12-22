<template>
  <div class="editable-row" :class="{ 'editable-row--editing': editing }">
    <label class="editable-row__field">
      <span class="editable-row__label">{{ label }}</span>
      <input
        v-model="draft"
        class="editable-row__input"
        :readonly="!editing"
        :placeholder="label"
      >
    </label>

    <div class="editable-row__actions">
      <template v-if="editing">
        <button type="button" class="button button--success button-sm" @click.stop="handleSave">{{ t('profile.save') }}</button>
        <button type="button" class="button button--secondary button-sm" @click.stop="handleCancel">{{ t('profile.cancel') }}</button>
      </template>
      <template v-else>
        <button type="button" class="button button--secondary button-sm" @click.prevent="startEditing">
          {{ t('profile.edit') }}
        </button>
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
.editable-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--s-3);
  align-items: center;
  padding: var(--s-3) 0;
  border-bottom: 1px solid var(--muted-100);
}

.editable-row:last-child {
  border-bottom: none;
}

.editable-row__field {
  display: grid;
  gap: var(--s-1);
  width: 100%;
}

.editable-row__label {
  font-size: var(--fs-12);
  color: var(--muted);
}

.editable-row__input {
  width: 100%;
  border: 1px solid var(--muted-100);
  border-radius: var(--radius-md);
  padding: var(--s-2) var(--s-3);
  background: var(--muted-50);
  transition: border-color 0.2s ease, background 0.2s ease;
}

.editable-row--editing .editable-row__input {
  background: #fff;
  border-color: var(--primary);
}

.editable-row__actions {
  display: flex;
  gap: var(--s-2);
}

@media (max-width: 640px) {
  .editable-row {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }

  .editable-row__actions {
    justify-content: flex-end;
  }
}
</style>
