import { useApi } from '@/composables/useApi'

interface ChangePasswordPayload {
  strategy: string
  email?: string
}

interface UpdateProfilePayload {
  field: string
  value: string
}

export const useProfileApi = () => {
  const { request } = useApi()

  return {
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
  }
}
