import { computed } from 'vue'
import { useState } from '#imports'

export type AuthProfile = {
  user_id: string
  first_name?: string
  last_name?: string
  middle_name?: string
  display_name?: string
  avatar_url?: string
}

export type AuthSession = AuthProfile & {
  access_token: string
  refresh_token: string
}

const readToken = (key: string) => (process.client ? localStorage.getItem(key) : null)

const persistToken = (key: string, value: string | null) => {
  if (!process.client) return

  if (value) {
    localStorage.setItem(key, value)
  } else {
    localStorage.removeItem(key)
  }
}

export const useAuthState = () => {
  const accessToken = useState<string | null>('access_token', () => readToken('access_token'))
  const refreshToken = useState<string | null>('refresh_token', () => readToken('refresh_token'))
  const user = useState<AuthProfile | null>('auth-user', () => null)

  const isAuthenticated = computed(() => Boolean(accessToken.value))

  const setSession = (session: AuthSession) => {
    accessToken.value = session.access_token
    refreshToken.value = session.refresh_token
    persistToken('access_token', session.access_token)
    persistToken('refresh_token', session.refresh_token)

    user.value = {
      user_id: session.user_id,
      first_name: session.first_name,
      last_name: session.last_name,
      middle_name: session.middle_name,
      display_name: session.display_name,
      avatar_url: session.avatar_url,
    }
  }

  const setUserProfile = (profile: AuthProfile) => {
    user.value = profile
  }

  const clearSession = () => {
    accessToken.value = null
    refreshToken.value = null
    persistToken('access_token', null)
    persistToken('refresh_token', null)
    user.value = null
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    setSession,
    setUserProfile,
    clearSession,
  }
}
