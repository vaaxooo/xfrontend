export const useTelegramAuth = () => {
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

  return { getTelegramInitData }
}
