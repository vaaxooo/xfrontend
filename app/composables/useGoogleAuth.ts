import { useRuntimeConfig } from '#app'

let googleScriptPromise: Promise<void> | null = null

const loadGoogleScript = async () => {
  if (googleScriptPromise) return googleScriptPromise

  googleScriptPromise = new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Google auth is only available in the browser'))
      return
    }

    if ((window as any).google?.accounts?.id) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google auth script'))
    document.head.appendChild(script)
  })

  return googleScriptPromise
}

type CredentialCallback = (credential: string) => void

type PromptNotification = {
  isDismissedMoment?: () => boolean
  isNotDisplayed?: () => boolean
  isSkippedMoment?: () => boolean
}

export const useGoogleAuth = () => {
  const config = useRuntimeConfig()

  const promptGoogleIdToken = async () => {
    if (typeof window === 'undefined') {
      throw new Error('Google auth is only available in the browser')
    }

    const clientId = config.public?.googleClientId
    const allowedOrigin = config.public?.googleOrigin || window.location.origin
    const loginUri =
      config.public?.googleRedirectUri || `${allowedOrigin.replace(/\/$/, '')}/auth/google/callback`

    if (!clientId) {
      throw new Error('Google client ID is not configured')
    }

    await loadGoogleScript()

    const google = (window as any).google

    if (!google?.accounts?.id) {
      throw new Error('Google auth client is unavailable')
    }

    return await new Promise<string>((resolve, reject) => {
      let settled = false

      const finish = (handler: () => void) => {
        if (settled) return
        settled = true
        handler()
      }

      const callback: CredentialCallback = (credential) => {
        if (credential) {
          finish(() => resolve(credential))
        } else {
          finish(() => reject(new Error('Google credential is missing')))
        }
      }

      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential?: string }) => callback(response.credential ?? ''),
        login_uri: loginUri,
        allowed_parent_origins: [allowedOrigin],
        ux_mode: 'popup',
      })

      google.accounts.id.prompt((notification: PromptNotification) => {
        const dismissed = notification.isDismissedMoment?.()
        const skipped = notification.isSkippedMoment?.()
        const notDisplayed = notification.isNotDisplayed?.()

        if (dismissed || skipped || notDisplayed) {
          finish(() => reject(new Error('Google sign-in was cancelled')))
        }
      })
    })
  }

  return { promptGoogleIdToken }
}
