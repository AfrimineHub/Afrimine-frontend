// SupplierOnboardingGuard.tsx

import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { USER_TYPES } from '@/features/auth/types';
import { SUPPLIER_ONBOARDING_PATH, SUPPLIER_ACCOUNT_RESTRICTED_PATH } from '@/features/supplier/constants';
import { useSupplierProfileQuery, useSupplierStatusQuery } from '../onboarding/onboardingQueries';
import { isOnboardingSubmitted, isSupplierBlocked } from '../onboarding/onboardingNormalize';

interface SupplierOnboardingGuardProps {
  children?: ReactNode;
  requireComplete?: boolean;
}

export function SupplierOnboardingGuard({
  children,
  requireComplete = true,
}: SupplierOnboardingGuardProps) {
  const { user, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const isSupplier = user?.type === USER_TYPES.supplier;

  const statusQuery = useSupplierStatusQuery({ enabled: isSupplier });
  const profileQuery = useSupplierProfileQuery({ enabled: isSupplier });

  const stillLoading =
    authLoading || (isSupplier && (statusQuery.isLoading || profileQuery.isLoading));

  if (stillLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
        Loading…
      </div>
    );
  }

  if (!isSupplier) {
    return children ?? <Outlet />;
  }

  // Fail-closed: only a positively-confirmed signal from the backend lets a
  // supplier through. Query errors, missing data, and unrecognized states
  // all fall through to "not allowed" — never the reverse.
  const blocked = statusQuery.isSuccess && isSupplierBlocked(statusQuery.data);
  const submitted =
    statusQuery.isSuccess &&
    profileQuery.isSuccess &&
    isOnboardingSubmitted(statusQuery.data, profileQuery.data);

  const onOnboarding = location.pathname.startsWith(SUPPLIER_ONBOARDING_PATH);
  const onRestricted = location.pathname.startsWith(SUPPLIER_ACCOUNT_RESTRICTED_PATH);

  if (blocked && !onRestricted) {
    return <Navigate to={SUPPLIER_ACCOUNT_RESTRICTED_PATH} replace />;
  }

  if (requireComplete && !blocked && !submitted && !onOnboarding) {
    return <Navigate to={SUPPLIER_ONBOARDING_PATH} replace />;
  }

  return children ?? <Outlet />;
}