import { useApi } from '@/composables/useApi'

export const useProfileApi = () => {
  const { request } = useApi()

  return {
    fetchProfile: () => request('/me', { method: 'GET' }),
    updateProfileField: (payload: Record<string, string>) =>
      request('/me', { method: 'PATCH', body: payload }),
    toggleSocialAccount: (provider: string, active: boolean) =>
      request('/auth/link', { body: { provider, active } }),
  }
}
