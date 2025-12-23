<template>
  <div class="otp-modal">
    <p class="otp-hint">{{ t('security.disable_code_label') }}</p>
    <div class="otp-inputs">
      <input
        v-for="(_, index) in code"
        :key="index"
        :ref="(el) => setInputRef(el as HTMLInputElement | null, index)"
        v-model="code[index]"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        maxlength="1"
        class="input otp-input"
        @input="(event) => handleInput(event as InputEvent, index)"
        @keydown.backspace.prevent="(event) => handleBackspace(event as KeyboardEvent, index)"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useModal } from '@/composables/useModal'
import { useI18n } from '@/composables/useI18n'

const { modal, updateField } = useModal()
const { t } = useI18n()

const code = ref(Array(6).fill(''))
const inputRefs = ref<HTMLInputElement[]>([])

const setInputRef = (el: HTMLInputElement | null, index: number) => {
  if (el) {
    inputRefs.value[index] = el
  }
}

const syncCodeValue = () => {
  updateField('code', code.value.join(''))
}

const handleInput = (event: InputEvent, index: number) => {
  const target = event.target as HTMLInputElement
  const value = target.value.slice(-1)
  code.value[index] = value

  if (value && index < inputRefs.value.length - 1) {
    inputRefs.value[index + 1]?.focus()
  }
}

const handleBackspace = (_event: KeyboardEvent, index: number) => {
  if (code.value[index]) {
    code.value[index] = ''
    return
  }

  if (index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

watch(
  code,
  () => {
    syncCodeValue()
  },
  { deep: true },
)

onMounted(() => {
  const existing = modal.value.values?.code ?? ''
  existing
    .split('')
    .slice(0, 6)
    .forEach((char, index) => {
      code.value[index] = char
    })

  syncCodeValue()
  inputRefs.value[0]?.focus()
})
</script>

<style scoped>
.otp-inputs {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: var(--s-3);
}

.otp-hint {
  margin: 0 0 var(--s-3);
  color: var(--muted);
  text-align: center;
}

.otp-input {
  text-align: center;
  font-size: var(--fs-20);
}
</style>
