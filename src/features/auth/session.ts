import type { QueryClient } from '@tanstack/react-query';
import { AUTH_SESSION_QUERY_KEY } from '@/features/auth/config';
import { bootstrapSession, logout } from '@/features/auth/api';
import type { AuthUser } from '@/features/auth/types';

export async function establishSession(queryClient: QueryClient): Promise<AuthUser | null> {
  const user = await bootstrapSession();
  queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, user);
  return user;
}

export async function endSession(queryClient: QueryClient): Promise<void> {
  await logout();
  queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, null);
  queryClient.removeQueries({ queryKey: AUTH_SESSION_QUERY_KEY });
}

export function setSessionUser(queryClient: QueryClient, user: AuthUser): void {
  queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, user);
}
