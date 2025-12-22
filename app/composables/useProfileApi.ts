import { useRuntimeConfig } from '#app'

interface ChangePasswordPayload {
  strategy: string
}

interface UpdateProfilePayload {
  field: string
  value: string
}

const request = async <T>(path: string, options: { body?: Record<string, unknown> } = {}) => {
  const config = useRuntimeConfig()
  const apiBase = config.public?.apiBase ?? '/api'

  return await $fetch<T>(`${apiBase}${path}` as `/api${string}`, {
    method: 'POST',
    ...options,
  })
}

export const useProfileApi = () => ({
  changePassword: (payload: ChangePasswordPayload) =>
    request('/auth/password', { body: payload }),
  enableTwoFactor: () => request('/auth/2fa/enable'),
  terminateSession: (sessionId: string) =>
    request('/sessions/terminate', { body: { sessionId } }),
  terminateAllSessions: () => request('/sessions/terminate-all'),
  toggleSocialAccount: (provider: string, active: boolean) =>
    request('/auth/social/link', { body: { provider, active } }),
  updateProfileField: (payload: UpdateProfilePayload) =>
    request('/profile/update', { body: payload }),
})
