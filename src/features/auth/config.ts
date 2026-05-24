const trimSlash = (path: string) => path.replace(/^\/+|\/+$/g, '');

export const authPaths = {
  login: trimSlash(import.meta.env.VITE_AUTH_LOGIN_PATH ?? 'auth/login'),
  register: trimSlash(import.meta.env.VITE_AUTH_REGISTER_PATH ?? 'auth/register'),
  refresh: trimSlash(import.meta.env.VITE_AUTH_REFRESH_PATH ?? 'auth/refresh'),
  logout: trimSlash(import.meta.env.VITE_AUTH_LOGOUT_PATH ?? 'auth/logout'),
  me: trimSlash(import.meta.env.VITE_AUTH_ME_PATH ?? 'auth/me'),
} as const;

export const AUTH_SESSION_QUERY_KEY = ['auth', 'session'] as const;
