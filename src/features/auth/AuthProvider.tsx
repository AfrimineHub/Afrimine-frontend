import { createContext, useCallback, useMemo, type ReactNode } from 'react';
import { useLogoutMutation, useSessionQuery } from '@/features/auth/queries';
import type { AuthUser } from '@/features/auth/types';

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading, isFetching } = useSessionQuery();
  const logoutMutation = useLogoutMutation();

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isAuthenticated: Boolean(user),
      isLoading: isLoading || isFetching,
      logout,
    }),
    [user, isLoading, isFetching, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
