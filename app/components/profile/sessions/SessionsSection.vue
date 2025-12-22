<template>
  <div class="section">
    <div class="section-title">
      История активности

      <div class="section-actions">
        <button
          type="button"
          class="button button--danger"
          @click="handleTerminateAll"
        >
          Завершить все сеансы
        </button>
      </div>
    </div>

    <div class="block">
      <div class="sessions">
        <SessionItem
          v-for="session in sessions"
          :key="session.id"
          :session-id="session.id"
          :icon-src="session.iconSrc"
          :title="session.title"
          :description="session.description"
          :closable="session.closable"
          @end-session="handleTerminateSession"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useModal } from '@/composables/useModal'
import SessionItem from '@/components/profile/sessions/SessionItem.vue'
import { useProfileApi } from '@/composables/useProfileApi'

interface Session {
  id: string
  iconSrc: string
  title: string
  description: string
  closable: boolean
}

const sessions = ref<Session[]>([
  {
    id: 'desktop-1',
    iconSrc: '/assets/images/icons/desktop.svg',
    title: 'Windows 10 • Chrome 141',
    description: 'Latvia IP-адрес: 94.140.114.195<br>Дата открытия текущей сессии: 10 октября 2025 г.',
    closable: true,
  },
  {
    id: 'mobile-1',
    iconSrc: '/assets/images/icons/phone.svg',
    title: 'Apple iPhone • Mobile Safari 11.4',
    description: 'Germany IP-адрес: 188.241.241.36<br>Дата открытия текущей сессии: 1 декабря 2025 г.',
    closable: true,
  },
  {
    id: 'desktop-2',
    iconSrc: '/assets/images/icons/desktop.svg',
    title: 'Windows 10 • Chrome 141',
    description: 'Latvia IP-адрес: 94.140.114.195<br>Дата открытия текущей сессии: 10 октября 2025 г.',
    closable: false,
  },
])

const { openModal } = useModal()
// const { terminateSession, terminateAllSessions } = useProfileApi()

const handleTerminateSession = (sessionId: string) => {
  openModal({
    title: 'Завершить сеанс',
    description: 'Подтвердите завершение выбранного сеанса.',
    confirmLabel: 'Завершить',
    onConfirm: async () => {
      //await terminateSession(sessionId)
      sessions.value = sessions.value.filter((session) => session.id !== sessionId)
    },
  })
}

const handleTerminateAll = () => {
  openModal({
    title: 'Завершить все сеансы',
    description: 'Вы будете разлогинены на всех устройствах кроме текущего.',
    confirmLabel: 'Завершить все',
    onConfirm: async () => {
      //await terminateAllSessions()
      sessions.value = sessions.value.filter((session) => !session.closable)
    },
  })
}
</script>
