import { useRuntimeConfig } from '#app'

export type Awaitable<T> = T | Promise<T>

export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: Record<string, unknown>
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public?.apiBase ?? '/api'

  const request = async <T>(path: string, options: ApiRequestOptions = {}) => {
    return await $fetch<T>(`${apiBase}${path}` as `/api${string}`, {
      method: options.method ?? 'POST',
      ...options,
    })
  }

  return {
    request,
  }
}
