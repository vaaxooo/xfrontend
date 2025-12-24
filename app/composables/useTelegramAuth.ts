import { useRuntimeConfig } from '#app'

type TelegramLoginUser = {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
  language_code?: string
  allows_write_to_pm?: boolean
}

const buildInitDataFromUser = (user: TelegramLoginUser) => {
  const params = new URLSearchParams()

  params.set('auth_date', String(user.auth_date))
  params.set('hash', user.hash)
  params.set(
    'user',
    JSON.stringify({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name ?? '',
      username: user.username ?? '',
      language_code: user.language_code ?? '',
      allows_write_to_pm: user.allows_write_to_pm ?? false,
      photo_url: user.photo_url ?? '',
    }),
  )

  return params.toString()
}

export const useTelegramAuth = () => {
  const config = useRuntimeConfig()

  const hasTelegramWebApp = () => {
    if (typeof window === 'undefined') return false
    return Boolean((window as any)?.Telegram?.WebApp?.initData)
  }

  const getTelegramInitData = () => {
    if (typeof window === 'undefined') {
      throw new Error('Telegram auth is only available in the browser')
    }

    const initData = (window as any)?.Telegram?.WebApp?.initData

    if (!initData) {
      throw new Error('Telegram init data is unavailable')
    }

    return initData as string
  }

  const promptTelegramWidget = async (container: HTMLElement | null) => {
    if (typeof window === 'undefined') {
      throw new Error('Telegram auth is only available in the browser')
    }

    if (!container) {
      throw new Error('Telegram widget container is unavailable')
    }

    const botUsername = config.public?.telegramBotUsername

    if (!botUsername) {
      throw new Error('Telegram bot username is not configured')
    }

    return await new Promise<string>((resolve, reject) => {
      const callbackName = `__telegramAuth${Date.now()}`

      const cleanup = () => {
        try {
          delete (window as any)[callbackName]
        } catch {
          ;(window as any)[callbackName] = undefined
        }
      }

      ;(window as any)[callbackName] = (user: TelegramLoginUser) => {
        try {
          resolve(buildInitDataFromUser(user))
        } finally {
          cleanup()
        }
      }

      container.innerHTML = ''

      const script = document.createElement('script')
      script.src = 'https://telegram.org/js/telegram-widget.js?22'
      script.async = true
      script.setAttribute('data-telegram-login', botUsername)
      script.setAttribute('data-size', 'large')
      script.setAttribute('data-userpic', 'false')
      script.setAttribute('data-request-access', 'write')
      script.setAttribute('data-onauth', `${callbackName}(user)`)
      script.onerror = () => {
        cleanup()
        reject(new Error('Failed to load Telegram login widget'))
      }

      container.appendChild(script)
    })
  }

  return {
    hasTelegramWebApp,
    getTelegramInitData,
    promptTelegramWidget,
  }
}
