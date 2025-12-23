type ApiErrorPayload = {
  error?: {
    code?: string
    message?: string
  }
}

type ApiSuccessPayload = {
  status?: string
  message?: string
}

type TranslateFn = (key: string, params?: Record<string, string | number>) => string

const normalizeErrorCode = (code: string) => {
  return code
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase()
}

export const getApiErrorDetails = (error: unknown) => {
  if (!error || typeof error !== 'object') return undefined

  const payload = error as ApiErrorPayload & { data?: ApiErrorPayload; message?: string }

  const code = payload.error?.code ?? payload.data?.error?.code
  const message = payload.error?.message ?? payload.data?.error?.message ?? payload.message

  return { code, message }
}

export const getApiErrorMessage = (error: unknown, t?: TranslateFn) => {
  const details = getApiErrorDetails(error)
  if (!details) return undefined

  if (t && details.code) {
    const normalized = normalizeErrorCode(details.code)
    const key = `errors.codes.${normalized}`
    const translated = t(key)
    if (translated !== key) {
      return translated
    }
  }

  return details.message ?? details.code ?? undefined
}

export const getApiSuccessMessage = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') return undefined

  const data = payload as ApiSuccessPayload

  return data.message
}
