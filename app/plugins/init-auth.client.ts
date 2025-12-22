import { defineNuxtPlugin } from '#app'
import { useAuthApi } from '@/composables/useAuthApi'
import { useAuthState } from '@/composables/useAuthState'

export default defineNuxtPlugin(async () => {
  const { accessToken, user, setUserProfile, clearSession } = useAuthState()
  const { getMe } = useAuthApi()

  if (!accessToken.value || user.value) {
    return
  }

  try {
    const profile = await getMe()
    setUserProfile(profile as any)
  } catch (error) {
    // If the stored token is invalid or expired, clear it to avoid a broken session state.
    clearSession()
    // eslint-disable-next-line no-console
    console.error('Failed to restore session profile', error)
  }
})
