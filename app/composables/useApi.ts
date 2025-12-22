import { reloadNuxtApp, useRuntimeConfig } from '#app'
import { useRoute } from '#imports'
import { useAuthState } from '@/composables/useAuthState'

export type Awaitable<T> = T | Promise<T>

export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: Record<string, unknown>
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public?.apiBase || 'https://localhost:8081/api/v1'
  const { accessToken, clearSession } = useAuthState()
  const route = useRoute()

  const request = async <T>(path: string, options: ApiRequestOptions = {}) => {
    const headers = {
      ...(options as any).headers,
      ...(accessToken.value ? { Authorization: `Bearer ${accessToken.value}` } : {}),
    }

    return await $fetch<T>(`${apiBase}${path}` as string, {
      method: options.method ?? 'POST',
      ...options,
      headers,
      onResponseError: async ({ response }) => {
        if (response.status === 401 || response.status === 403) {
          clearSession()

          await reloadNuxtApp({ path: '/auth/login' })
        }

        throw response._data ?? new Error('Request failed')
      },
    })
  }

  return {
    request,
  }
}
