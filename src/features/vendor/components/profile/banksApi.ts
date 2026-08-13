import { apiClient } from '@/lib/api/client';
import type { PayscrowBank } from './bankTypes';

export async function fetchBanks(): Promise<PayscrowBank[]> {
  const res = await apiClient.get('/banks');
  const data = res.data?.data ?? res.data;
  return Array.isArray(data) ? data : [];
}