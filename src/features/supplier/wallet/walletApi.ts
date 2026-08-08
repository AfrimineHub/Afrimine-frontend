import { apiClient } from '@/lib/api/client';
import type { WithdrawalRequestPayload } from './walletTypes';

const WALLET_BASE = '/wallet';

export async function fetchWalletBalance(): Promise<unknown> {
  const res = await apiClient.get(`${WALLET_BASE}/balance`);
  return res.data?.data ?? res.data;
}

export async function fetchWalletTransactions(): Promise<unknown> {
  const res = await apiClient.get(`${WALLET_BASE}/transactions`);
  return res.data?.data ?? res.data;
}

export async function requestWithdrawal(payload: WithdrawalRequestPayload): Promise<string> {
  const res = await apiClient.post(`${WALLET_BASE}/withdrawal`, payload);
  return res.data?.data ?? res.data?.message ?? 'Withdrawal request submitted.';
}