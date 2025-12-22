import { useApi } from '@/composables/useApi'

interface LoginPayload {
  email: string
  password: string
  remember?: boolean
}

interface RegisterPayload {
  email: string
  password: string
  confirmPassword: string
}

interface RecoveryPayload {
  email: string
}

interface ResetPasswordPayload {
  password: string
  confirmPassword: string
}

interface OtpPayload {
  code: string
}

export const useAuthApi = () => {
  const { request } = useApi()

  return {
    login: (payload: LoginPayload) => request('/auth/login', { body: payload }),
    register: (payload: RegisterPayload) => request('/auth/register', { body: payload }),
    requestRecovery: (payload: RecoveryPayload) => request('/auth/recovery', { body: payload }),
    resetPassword: (payload: ResetPasswordPayload) => request('/auth/reset', { body: payload }),
    verifyOtp: (payload: OtpPayload) => request('/auth/otp/verify', { body: payload }),
    resendOtp: () => request('/auth/otp/resend'),
  }
}
