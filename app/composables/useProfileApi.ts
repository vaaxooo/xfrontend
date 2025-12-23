import { useApi } from '@/composables/useApi'

export const useProfileApi = () => {
  const { request } = useApi()

  return {
    fetchProfile: () => request('/me', { method: 'GET' }),
    updateProfileField: (payload: Record<string, string>) =>
      request('/me', { method: 'PATCH', body: payload }),
    toggleSocialAccount: (provider: string, active: boolean) =>
      request('/auth/link', { body: { provider, active } }),
    fetchSessions: () => request('/auth/sessions', { method: 'GET' }),
    revokeSession: (sessionId: string) =>
      request('/auth/sessions/revoke', { body: { session_id: sessionId } }),
    revokeOtherSessions: (currentRefreshToken: string) =>
      request('/auth/sessions/revoke-others', { body: { current_refresh_token: currentRefreshToken } }),
  }
}
