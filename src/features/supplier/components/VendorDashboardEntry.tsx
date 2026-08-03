import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { isSellerRole } from '@/features/auth/types';
import { VendorDashboardPage } from '@/features/vendor/pages/VendorDashboardPage';
import { SUPPLIER_DASHBOARD_PATH } from '@/features/supplier/constants';

/** Type-1 sellers always use the supplier dashboard (vendor alias shares the same enum value). */
export function VendorDashboardEntry() {
  const { user } = useAuth();
  if (isSellerRole(user?.type)) {
    return <Navigate to={SUPPLIER_DASHBOARD_PATH} replace />;
  }
  return <VendorDashboardPage />;
}
