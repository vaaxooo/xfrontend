import { computed } from 'vue'
import { useCookie, useState } from '#imports'

export type AuthSession = {
  user_id: string
  first_name?: string
  last_name?: string
  middle_name?: string
  display_name?: string
  avatar_url?: string
  access_token: string
  refresh_token: string
}

export const useAuthState = () => {
  const accessToken = useCookie<string | null>('access_token')
  const refreshToken = useCookie<string | null>('refresh_token')
  const user = useState<AuthSession | null>('auth-user', () => null)

  const isAuthenticated = computed(() => Boolean(accessToken.value))

  const setSession = (session: AuthSession) => {
    accessToken.value = session.access_token
    refreshToken.value = session.refresh_token
    user.value = session
  }

  const clearSession = () => {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    setSession,
    clearSession,
  }
}
