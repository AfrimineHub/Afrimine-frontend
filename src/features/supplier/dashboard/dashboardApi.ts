import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import { supplierDashboardApiPaths } from './dashboardConfig';

export async function fetchSupplierStats(): Promise<unknown> {
  const { data } = await apiClient.get(supplierDashboardApiPaths.stats);
  return extractApiData<unknown>(data);
}