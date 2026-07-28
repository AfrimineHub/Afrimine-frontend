import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import { supplierDashboardApiPaths } from './dashboardConfig';

/** Response shape unconfirmed — no schema in the spec. Normalize at the call site (see SupplierDashboardPage.tsx). */
export async function fetchSupplierStats(): Promise<unknown> {
  const { data } = await apiClient.get(supplierDashboardApiPaths.stats);
  return extractApiData<unknown>(data);
}