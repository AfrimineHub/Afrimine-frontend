/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_AUTH_LOGIN_PATH?: string;
  readonly VITE_AUTH_REGISTER_PATH?: string;
  readonly VITE_AUTH_REFRESH_PATH?: string;
  readonly VITE_AUTH_LOGOUT_PATH?: string;
  readonly VITE_AUTH_ME_PATH?: string;
  readonly VITE_AUTH_FORGOT_PASSWORD_PATH?: string;
  readonly VITE_AUTH_RESET_PASSWORD_PATH?: string;
  readonly VITE_AUTH_CONFIRM_EMAIL_PATH?: string;
  readonly VITE_AUTH_RESEND_OTP_PATH?: string;
  readonly VITE_DASHBOARD_SUMMARY_PATH?: string;
  readonly VITE_DASHBOARD_NOTIFICATIONS_PATH?: string;
  readonly VITE_DASHBOARD_NOTIFICATIONS_READ_PATH?: string;
  readonly VITE_VENDOR_LISTINGS_PATH?: string;
  readonly VITE_LISTINGS_CATEGORIES_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
