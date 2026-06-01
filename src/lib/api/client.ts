import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authPaths } from '@/features/auth/config';
import { clearAccessToken, getAccessToken, setAccessToken } from '@/lib/auth/tokenStore';
import { extractAccessToken } from '@/lib/api/normalize';

const baseURL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');

if (!baseURL && import.meta.env.PROD) {
  console.error(
    '[api] VITE_API_BASE_URL was not set at build time. API calls will hit this site instead of the backend. ' +
      'Set VITE_API_BASE_URL when running `npm run build` or `docker build --build-arg VITE_API_BASE_URL=...`.',
  );
}
/** Refresh calls — no Bearer interceptor; body carries the token per API contract. */
export const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function flushRefreshQueue(error: unknown | null, token: string | null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error || !token) reject(error ?? new Error('Session expired'));
    else resolve(token);
  });
  refreshQueue = [];
}

function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) return false;
  const normalized = url.replace(/^\//, '');
  return (
    normalized.includes(authPaths.refresh) ||
    normalized.includes(authPaths.login) ||
    normalized.includes(authPaths.register) ||
    normalized.includes(authPaths.resetPassword) ||
    normalized.includes(authPaths.forgotPassword)
  );
}

export async function performTokenRefresh(): Promise<string> {
  const currentToken = getAccessToken();
  if (!currentToken) {
    throw new Error('No access token available to refresh');
  }

  const { data } = await refreshClient.post(authPaths.refresh, {
    accessToken: currentToken,
  });
  const token = extractAccessToken(data as Record<string, unknown>);
  setAccessToken(token);
  return token;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const token = await performTokenRefresh();
      flushRefreshQueue(null, token);
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      flushRefreshQueue(refreshError, null);
      clearAccessToken();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
