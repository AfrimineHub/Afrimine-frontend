import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { USER_TYPES } from '@/features/auth/types';
import { VendorDashboardPage } from '@/features/vendor/pages/VendorDashboardPage';
import { SUPPLIER_DASHBOARD_PATH } from '@/features/supplier/constants';

/** Vendors stay on the vendor dashboard; suppliers are redirected to the supplier home. */
export function VendorDashboardEntry() {
  const { user } = useAuth();
  if (user?.type === USER_TYPES.supplier) {
    return <Navigate to={SUPPLIER_DASHBOARD_PATH} replace />;
  }
  return <VendorDashboardPage />;
}
