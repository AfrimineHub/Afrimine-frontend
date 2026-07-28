import { useQuery } from '@tanstack/react-query';
import { fetchSupplierStats } from './dashboardApi';

export const SUPPLIER_DASHBOARD_STATS_QUERY_KEY = ['supplier', 'dashboard', 'stats'] as const;

export function useSupplierStatsQuery() {
  return useQuery({
    queryKey: SUPPLIER_DASHBOARD_STATS_QUERY_KEY,
    queryFn: fetchSupplierStats,
    staleTime: 60 * 1000,
  });
}