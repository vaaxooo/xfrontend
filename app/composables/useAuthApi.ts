import { useApi } from '@/composables/useApi'

export const useAuthApi = () => {
  const { request } = useApi()

  return {
    login: (payload: { email: string; password: string; otp_code?: string }) =>
      request('/auth/login', { body: payload }),
    register: (payload: { email: string; password: string; confirmPassword: string }) =>
      request('/auth/register', { body: payload }),
    refresh: (payload: { refresh_token: string }) =>
      request('/auth/refresh', { body: payload }),
    requestEmailConfirmation: (payload: { email: string }) =>
      request('/auth/confirm/request', { body: payload }),
    confirmEmail: (payload: { email: string; code: string }) =>
      request('/auth/confirm', { body: payload }),
    challengeStatus: (payload: { challenge_id: string }) =>
      request('/auth/challenge/status', { body: payload }),
    verifyChallengeTotp: (payload: { challenge_id: string; otp_code: string }) =>
      request('/auth/challenge/verify-totp', { body: payload }),
    resendChallengeEmail: (payload: { challenge_id: string }) =>
      request('/auth/challenge/resend-email', { body: payload }),
    confirmChallengeEmail: (payload: { challenge_id: string; token: string }) =>
      request('/auth/challenge/confirm-email', { body: payload }),
    requestPasswordReset: (payload: { email: string }) =>
      request('/auth/password/reset', { body: payload }),
    confirmPasswordReset: (payload: { email: string; code: string; password: string }) =>
      request('/auth/password/confirm', { body: payload }),
    telegramLogin: (payload: Record<string, unknown>) =>
      request('/auth/telegram', { body: payload }),
    linkProvider: (payload: { provider: string }) => request('/auth/link', { body: payload }),
    startTotpSetup: () => request('/auth/2fa/setup'),
    confirmTotpSetup: (payload: { code: string }) => request('/auth/2fa/confirm', { body: payload }),
    disableTotp: (payload: { code: string }) => request('/auth/2fa/disable', { body: payload }),
  }
}
