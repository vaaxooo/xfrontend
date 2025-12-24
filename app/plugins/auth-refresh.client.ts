import { defineNuxtPlugin, reloadNuxtApp } from '#app'
import { watch } from 'vue'
import { useAuthApi } from '@/composables/useAuthApi'
import { useAuthState } from '@/composables/useAuthState'

const REFRESH_INTERVAL_MS = 15 * 60 * 1000

const hasTokens = (value: unknown): value is { access_token: string; refresh_token: string } =>
  Boolean(
    value &&
      typeof value === 'object' &&
      'access_token' in value &&
      'refresh_token' in value &&
      (value as any).access_token &&
      (value as any).refresh_token,
  )

export default defineNuxtPlugin(() => {
  const { refreshToken, setTokens, clearSession } = useAuthState()
  const { refresh } = useAuthApi()
  let refreshTimer: ReturnType<typeof setInterval> | null = null
  let isRefreshing = false

  const handleRefresh = async () => {
    if (!refreshToken.value || isRefreshing) {
      return
    }

    isRefreshing = true

    try {
      const response = await refresh({ refresh_token: refreshToken.value })

      if (!hasTokens(response)) {
        throw new Error('refresh_token_invalid')
      }

      setTokens(response)
    } catch (error) {
      clearSession()
      await reloadNuxtApp({ path: '/auth/login' })
      // eslint-disable-next-line no-console
      console.error('Failed to refresh session', error)
    } finally {
      isRefreshing = false
    }
  }

  const scheduleRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }

    if (!refreshToken.value) {
      return
    }

    refreshTimer = setInterval(() => {
      void handleRefresh()
    }, REFRESH_INTERVAL_MS)
  }

  watch(refreshToken, scheduleRefresh, { immediate: true })
})
