import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getHomePathForUser } from '@/features/auth/routes';

/** Redirects authenticated users away from login/register only. */
export function GuestOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] flex-1 items-center justify-center text-sm text-gray-500">
        Loading…
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getHomePathForUser(user)} replace />;
  }

  return <>{children}</>;
}
