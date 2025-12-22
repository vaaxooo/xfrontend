import { useState } from '#app'

type Awaitable<T> = T | Promise<T>

type ModalOptions = {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => Awaitable<void>
}

type ModalState = Required<Omit<ModalOptions, 'onConfirm'>> & {
  isOpen: boolean
  loading: boolean
  onConfirm?: () => Awaitable<void>
}

export const useModal = () => {
  const modal = useState<ModalState>('app-modal', () => ({
    isOpen: false,
    loading: false,
    title: '',
    description: '',
    confirmLabel: 'Подтвердить',
    cancelLabel: 'Отмена',
  }))

  const openModal = (options: ModalOptions) => {
    modal.value = {
      ...modal.value,
      ...options,
      isOpen: true,
      loading: false,
    }
  }

  const closeModal = () => {
    modal.value.isOpen = false
    modal.value.loading = false
    modal.value.onConfirm = undefined
  }

  const confirmModal = async () => {
    if (!modal.value.onConfirm) {
      closeModal()
      return
    }

    modal.value.loading = true

    try {
      await modal.value.onConfirm()
    } finally {
      closeModal()
    }
  }

  return {
    modal,
    openModal,
    closeModal,
    confirmModal,
  }
}
