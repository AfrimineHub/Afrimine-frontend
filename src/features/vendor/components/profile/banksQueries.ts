import { useQuery } from '@tanstack/react-query';
import { fetchBanks } from './banksApi';

export const BANKS_QUERY_KEY = ['banks'] as const;

export function useBanksQuery() {
  return useQuery({
    queryKey: BANKS_QUERY_KEY,
    queryFn: fetchBanks,
    // Bank list is static reference data — cache generously.
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}