const trimSlash = (path: string) => path.replace(/^\/+|\/+$/g, '');

export const authPaths = {
  login: trimSlash(import.meta.env.VITE_AUTH_LOGIN_PATH ?? 'auth/login'),
  register: trimSlash(import.meta.env.VITE_AUTH_REGISTER_PATH ?? 'auth/register'),
  refresh: trimSlash(import.meta.env.VITE_AUTH_REFRESH_PATH ?? 'auth/refresh-token'),
  logout: trimSlash(import.meta.env.VITE_AUTH_LOGOUT_PATH ?? 'auth/logout'),
  me: trimSlash(import.meta.env.VITE_AUTH_ME_PATH ?? 'auth/me'),
  resetPassword: trimSlash(import.meta.env.VITE_AUTH_RESET_PASSWORD_PATH ?? 'auth/reset-password'),
  forgotPassword: trimSlash(import.meta.env.VITE_AUTH_FORGOT_PASSWORD_PATH ?? 'auth/forgot-password'),
  confirmEmail: trimSlash(import.meta.env.VITE_AUTH_CONFIRM_EMAIL_PATH ?? 'auth/confirm-email'),
  resendOtp: trimSlash(import.meta.env.VITE_AUTH_RESEND_OTP_PATH ?? 'auth/resent-otp'),
} as const;

export const AUTH_SESSION_QUERY_KEY = ['auth', 'session'] as const;
