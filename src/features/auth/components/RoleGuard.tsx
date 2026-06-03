import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getHomePathForUser, userHasRole } from '@/features/auth/routes';
import type { UserType } from '@/features/auth/types';

interface RoleGuardProps {
  allowed: UserType[];
  children?: ReactNode;
}

export function RoleGuard({ allowed, children }: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] flex-1 items-center justify-center text-sm text-gray-500">
        Loading…
      </div>
    );
  }

  if (!userHasRole(user, allowed)) {
    return <Navigate to={getHomePathForUser(user)} replace state={{ from: location.pathname }} />;
  }

  return children ?? <Outlet />;
}
