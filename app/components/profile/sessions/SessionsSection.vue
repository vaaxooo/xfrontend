<template>
  <div class="section">
    <div class="section-title">
      {{ t('sessions.history_title') }}

      <div class="section-actions">
        <button
          type="button"
          class="button button--danger"
          @click="handleTerminateAll"
        >
          {{ t('sessions.terminate_all') }}
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
import { onMounted, ref } from 'vue'
import { useModal } from '@/composables/useModal'
import SessionItem from '@/components/profile/sessions/SessionItem.vue'
import { useProfileApi } from '@/composables/useProfileApi'
import { useAlerts } from '@/composables/useAlerts'
import { useAuthState } from '@/composables/useAuthState'
import { getApiErrorMessage, getApiSuccessMessage } from '@/utils/apiMessages'
import { useI18n } from '@/composables/useI18n'

interface ApiSession {
  id: string
  user_agent: string
  ip: string
  created_at: string
  expires_at: string
  current: boolean
}

interface SessionView {
  id: string
  iconSrc: string
  title: string
  description: string
  closable: boolean
}

const sessions = ref<SessionView[]>([])
const { openModal } = useModal()
const { fetchSessions, revokeSession, revokeOtherSessions } = useProfileApi()
const { push } = useAlerts()
const { refreshToken } = useAuthState()
const { t } = useI18n()

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const parseUserAgent = (userAgent: string) => {
  const lower = userAgent.toLowerCase()
  const isMobile = /(iphone|android|mobile|ipad)/i.test(userAgent)
  const os =
    (lower.includes('windows') && 'Windows') ||
    (lower.includes('mac os') && 'macOS') ||
    (lower.includes('android') && 'Android') ||
    (lower.includes('iphone') && 'iPhone') ||
    (lower.includes('ipad') && 'iPad') ||
    (lower.includes('linux') && 'Linux') ||
    t('sessions.unknown_device')

  const browserMatch = userAgent.match(/(Chrome|Safari|Firefox|Edge|Opera)\/([\d.]+)/i)
  const browser = browserMatch && browserMatch[2] ? `${browserMatch[1]} ${browserMatch[2].split('.')[0]}` : ''

  return {
    icon: isMobile ? '/assets/images/icons/phone.svg' : '/assets/images/icons/desktop.svg',
    label: browser ? `${os} • ${browser}` : os,
  }
}

const toSessionView = (session: ApiSession): SessionView => {
  const device = parseUserAgent(session.user_agent || '')

  const details = [
    t('sessions.ip_address', { ip: session.ip }),
    t('sessions.opened_at', { date: formatDate(session.created_at) }),
    session.current ? t('sessions.current_session') : '',
  ]
    .filter(Boolean)
    .join('<br>')

  return {
    id: session.id,
    iconSrc: device.icon,
    title: device.label,
    description: details,
    closable: !session.current,
  }
}

const loadSessions = async () => {
  try {
    const response = await fetchSessions()
    const items = (response as { sessions?: ApiSession[] }).sessions ?? []
    sessions.value = items.map(toSessionView)
  } catch (error) {
    const message = t('alerts.error_title') || getApiErrorMessage(error, t)
    push({ title: t('alerts.error_title'), description: message, type: 'error' })
  }
}

const handleTerminateSession = (sessionId: string) => {
  openModal({
    title: t('sessions.terminate_one'),
    description: t('sessions.terminate_one_description'),
    confirmLabel: t('sessions.terminate_confirm'),
    onConfirm: async () => {
      try {
        const response = await revokeSession(sessionId)
        const message = t('sessions.terminate_one_success') || getApiSuccessMessage(response)
        push({ title: t('sessions.success_title'), description: message, type: 'success' })
        sessions.value = sessions.value.filter((session) => session.id !== sessionId)
      } catch (error) {
        const message = t('alerts.error_title') || getApiErrorMessage(error, t)
        push({ title: t('alerts.error_title'), description: message, type: 'error' })
        throw error
      }
    },
  })
}

const handleTerminateAll = () => {
  openModal({
    title: t('sessions.terminate_all'),
    description: t('sessions.terminate_all_description'),
    confirmLabel: t('sessions.terminate_all_confirm'),
    onConfirm: async () => {
      if (!refreshToken.value) {
        push({ title: t('alerts.error_title'), description: t('alerts.login_error_description'), type: 'error' })
        throw new Error('refresh_token_missing')
      }

      try {
        const response = await revokeOtherSessions(refreshToken.value)
        const message = t('sessions.terminate_all_success') || getApiSuccessMessage(response)
        push({ title: t('sessions.success_title'), description: message, type: 'success' })
        sessions.value = sessions.value.filter((session) => !session.closable)
      } catch (error) {
        const message = t('alerts.error_title') || getApiErrorMessage(error, t)
        push({ title: t('alerts.error_title'), description: message, type: 'error' })
        throw error
      }
    },
  })
}

onMounted(() => {
  loadSessions()
})
</script>
