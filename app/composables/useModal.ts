import { useState } from '#app'
import type { Awaitable } from '@/composables/useApi'

export type ModalField = {
  name: string
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password'
  value?: string
  description?: string
}

type ModalMode = 'dialog' | 'alert'

type ModalOptions = {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: (values: Record<string, string>) => Awaitable<void>
  fields?: ModalField[]
  mode?: ModalMode
}

type ModalState = Required<Omit<ModalOptions, 'onConfirm'>> & {
  isOpen: boolean
  loading: boolean
  onConfirm?: (values: Record<string, string>) => Awaitable<void>
  values: Record<string, string>
  id: number
}

const buildFieldValues = (fields: ModalField[] = []) =>
  fields.reduce<Record<string, string>>((values, field) => {
    values[field.name] = field.value ?? ''
    return values
  }, {})

export const useModal = () => {
  const modal = useState<ModalState>('app-modal', () => ({
    isOpen: false,
    loading: false,
    title: '',
    description: '',
    confirmLabel: 'Подтвердить',
    cancelLabel: 'Отмена',
    fields: [],
    values: {},
    mode: 'dialog',
    id: 0,
  }))

  const openModal = (options: ModalOptions) => {
    modal.value = {
      ...modal.value,
      ...options,
      values: buildFieldValues(options.fields),
      isOpen: true,
      loading: false,
      mode: options.mode ?? 'dialog',
      id: modal.value.id + 1,
    }
  }

  const closeModal = () => {
    modal.value.isOpen = false
    modal.value.loading = false
    modal.value.onConfirm = undefined
    modal.value.fields = []
    modal.value.values = {}
  }

  const confirmModal = async () => {
    if (!modal.value.onConfirm) {
      closeModal()
      return
    }

    const currentModalId = modal.value.id
    modal.value.loading = true

    try {
      await modal.value.onConfirm({ ...modal.value.values })
    } finally {
      if (modal.value.id === currentModalId) {
        closeModal()
      }
    }
  }

  const updateField = (name: string, value: string) => {
    modal.value.values[name] = value
  }

  return {
    modal,
    openModal,
    closeModal,
    confirmModal,
    updateField,
  }
}
