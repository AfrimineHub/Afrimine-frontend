import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWalletBalance, fetchWalletTransactions, requestWithdrawal } from './walletApi';
import { normalizeWalletBalance, normalizeWalletTransactionsList } from './walletUtils';
import type { WithdrawalRequestPayload } from './walletTypes';

export const WALLET_BALANCE_QUERY_KEY = ['wallet', 'balance'] as const;
export const WALLET_TRANSACTIONS_QUERY_KEY = ['wallet', 'transactions'] as const;

export function useWalletBalanceQuery() {
  return useQuery({
    queryKey: WALLET_BALANCE_QUERY_KEY,
    queryFn: async () => normalizeWalletBalance(await fetchWalletBalance()),
    staleTime: 30 * 1000,
  });
}

export function useWalletTransactionsQuery() {
  return useQuery({
    queryKey: WALLET_TRANSACTIONS_QUERY_KEY,
    queryFn: async () => normalizeWalletTransactionsList(await fetchWalletTransactions()),
    staleTime: 30 * 1000,
  });
}

export function useRequestWithdrawalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WithdrawalRequestPayload) => requestWithdrawal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_BALANCE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WALLET_TRANSACTIONS_QUERY_KEY });
    },
  });
}