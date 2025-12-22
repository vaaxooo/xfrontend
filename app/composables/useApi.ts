import { useRuntimeConfig } from '#app'
import { useCookie } from '#imports'

export type Awaitable<T> = T | Promise<T>

export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: Record<string, unknown>
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public?.apiBase || 'https://localhost:8081/api/v1'
  const accessToken = useCookie<string | null>('access_token', { watch: false })

  const request = async <T>(path: string, options: ApiRequestOptions = {}) => {
    const headers = {
      ...(options as any).headers,
      ...(accessToken.value ? { Authorization: `Bearer ${accessToken.value}` } : {}),
    }

    return await $fetch<T>(`${apiBase}${path}` as string, {
      method: options.method ?? 'POST',
      ...options,
      headers,
    })
  }

  return {
    request,
  }
}
