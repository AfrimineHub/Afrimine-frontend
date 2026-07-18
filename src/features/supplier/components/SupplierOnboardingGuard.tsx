import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { USER_TYPES } from '@/features/auth/types';
import {
  isOnboardingComplete,
  loadOnboardingDraft,
} from '@/features/supplier/onboarding/onboardingStorage';
import { SUPPLIER_ONBOARDING_PATH } from '@/features/supplier/constants';

interface SupplierOnboardingGuardProps {
  children?: ReactNode;
  /** When true, redirect incomplete suppliers away from dashboard into onboarding. */
  requireComplete?: boolean;
}

/**
 * Gates supplier routes: incomplete onboarding → wizard; completed → allow dashboard.
 */
export function SupplierOnboardingGuard({
  children,
  requireComplete = true,
}: SupplierOnboardingGuardProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
        Loading…
      </div>
    );
  }

  if (user?.type !== USER_TYPES.supplier) {
    return children ?? <Outlet />;
  }

  const draft = loadOnboardingDraft(user.id);
  const complete = isOnboardingComplete(draft);
  const onOnboarding = location.pathname.startsWith(SUPPLIER_ONBOARDING_PATH);

  if (requireComplete && !complete && !onOnboarding) {
    return <Navigate to={SUPPLIER_ONBOARDING_PATH} replace />;
  }

  return children ?? <Outlet />;
}
