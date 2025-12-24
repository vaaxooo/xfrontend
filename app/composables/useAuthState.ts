import { computed } from 'vue'
import { useCookie, useState } from '#imports'

export type AuthProfile = {
  user_id: string
  first_name?: string
  last_name?: string
  middle_name?: string
  display_name?: string
  avatar_url?: string
  email?: string
  login_settings?: {
    two_factor_enabled?: boolean
    email_verified?: boolean
  }
}

export type AuthSession = AuthProfile & {
  access_token: string
  refresh_token: string
}

export type AuthTokens = {
  access_token: string
  refresh_token: string
}

export const useAuthState = () => {
  const accessTokenCookie = useCookie<string | null>('access_token', { sameSite: 'lax' })
  const refreshTokenCookie = useCookie<string | null>('refresh_token', { sameSite: 'lax' })

  const accessToken = useState<string | null>('access_token', () => accessTokenCookie.value ?? null)
  const refreshToken = useState<string | null>('refresh_token', () => refreshTokenCookie.value ?? null)
  const user = useState<AuthProfile | null>('auth-user', () => null)

  if (process.client) {
    if (accessTokenCookie.value && !accessToken.value) {
      accessToken.value = accessTokenCookie.value
    }

    if (refreshTokenCookie.value && !refreshToken.value) {
      refreshToken.value = refreshTokenCookie.value
    }
  }

  const isAuthenticated = computed(() => Boolean(accessToken.value))

  const setSession = (session: AuthSession) => {
    accessToken.value = session.access_token
    refreshToken.value = session.refresh_token

    accessTokenCookie.value = session.access_token
    refreshTokenCookie.value = session.refresh_token

    user.value = {
      user_id: session.user_id,
      first_name: session.first_name,
      last_name: session.last_name,
      middle_name: session.middle_name,
      display_name: session.display_name,
      avatar_url: session.avatar_url,
      email: (session as any).email,
      login_settings: (session as any).login_settings,
    }
  }

  const setTokens = (tokens: AuthTokens) => {
    accessToken.value = tokens.access_token
    refreshToken.value = tokens.refresh_token

    accessTokenCookie.value = tokens.access_token
    refreshTokenCookie.value = tokens.refresh_token
  }

  const setUserProfile = (profile: AuthProfile) => {
    user.value = profile
  }

  const clearSession = () => {
    accessToken.value = null
    refreshToken.value = null

    accessTokenCookie.value = null
    refreshTokenCookie.value = null
    user.value = null
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    setSession,
    setTokens,
    setUserProfile,
    clearSession,
  }
}
