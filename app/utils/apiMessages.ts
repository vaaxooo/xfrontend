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

export const getApiErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object') return undefined

  const payload = error as ApiErrorPayload & { data?: ApiErrorPayload; message?: string }

  return (
    payload.error?.message ??
    payload.data?.error?.message ??
    payload.message ??
    undefined
  )
}

export const getApiSuccessMessage = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') return undefined

  const data = payload as ApiSuccessPayload

  return data.message
}
