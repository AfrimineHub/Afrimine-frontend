import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { USER_TYPES } from '@/features/auth/types';
import { SUPPLIER_ONBOARDING_PATH } from '@/features/supplier/constants';

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

  if (authLoading || (isSupplier && statusQuery.isLoading)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
        Loading…
      </div>
    );
  }

  if (!isSupplier) {
    return children ?? <Outlet />;
  }

  const status = normalizeVerificationStatus(statusQuery.data);
  const complete = status === 'pending_verification' || status === 'verified';
  const onOnboarding = location.pathname.startsWith(SUPPLIER_ONBOARDING_PATH);

  if (requireComplete && !complete && !onOnboarding) {
    return <Navigate to={SUPPLIER_ONBOARDING_PATH} replace />;
  }

  return children ?? <Outlet />;
}
