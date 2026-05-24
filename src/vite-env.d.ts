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
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
