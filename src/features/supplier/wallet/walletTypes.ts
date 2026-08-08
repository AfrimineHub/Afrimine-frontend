export interface WalletBalance {
  availableBalance: number;
  pendingBalance: number;
  currency: string;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference: string;
  currency: string;
  createdAt: string;
}

export interface WithdrawalRequestPayload {
  amount: number;
  currency?: string;
}