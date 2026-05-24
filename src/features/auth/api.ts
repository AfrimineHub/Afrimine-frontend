import { apiClient, performTokenRefresh } from '@/lib/api/client';
import { extractAccessToken, extractUser } from '@/lib/api/normalize';
import { clearAccessToken, getAccessToken, setAccessToken } from '@/lib/auth/tokenStore';
import { authPaths } from '@/features/auth/config';
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  RequestPasswordResetPayload,
  ResetPasswordPayload,
} from '@/features/auth/types';

async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await apiClient.get(authPaths.me);
  const user = extractUser(data as Record<string, unknown>);
  if (!user) {
    throw new Error('Invalid session response: missing user');
  }
  return user;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post(authPaths.login, payload);
  const record = data as Record<string, unknown>;
  const accessToken = extractAccessToken(record);
  setAccessToken(accessToken);
  const user = extractUser(record) ?? (await fetchCurrentUser());
  return { accessToken, user };
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post(authPaths.register, payload);
  const record = data as Record<string, unknown>;
  const accessToken = extractAccessToken(record);
  setAccessToken(accessToken);
  const user = extractUser(record) ?? (await fetchCurrentUser());
  return { accessToken, user };
}

export async function requestPasswordReset(payload: RequestPasswordResetPayload): Promise<void> {
  await apiClient.post(authPaths.resetPassword, payload);
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  await apiClient.post(authPaths.forgotPassword, payload);
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post(authPaths.logout);
  } finally {
    clearAccessToken();
  }
}

export async function bootstrapSession(): Promise<AuthUser | null> {
  if (!getAccessToken()) {
    try {
      await performTokenRefresh();
    } catch {
      clearAccessToken();
      return null;
    }
  }

  try {
    return await fetchCurrentUser();
  } catch {
    clearAccessToken();
    return null;
  }
}

export { fetchCurrentUser };
