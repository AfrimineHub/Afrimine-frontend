function pickString(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === 'string' && v) return v;
  }
  return undefined;
}

function pickNumber(obj: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === 'number' && !Number.isNaN(v)) return v;
  }
  return undefined;
}

import type { WalletBalance, WalletTransaction } from './walletTypes';

export function normalizeWalletBalance(raw: unknown): WalletBalance {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    availableBalance: pickNumber(r, ['availableBalance', 'available']) ?? 0,
    pendingBalance: pickNumber(r, ['pendingBalance', 'pending']) ?? 0,
    currency: pickString(r, ['currency']) ?? 'NGN',
  };
}

function normalizeWalletTransaction(raw: unknown): WalletTransaction | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const id = pickString(r, ['id']);
  if (!id) return null;
  const typeRaw = pickString(r, ['type'])?.toLowerCase();
  const type: WalletTransaction['type'] = typeRaw === 'debit' ? 'debit' : 'credit';
  return {
    id,
    type,
    amount: pickNumber(r, ['amount']) ?? 0,
    description: pickString(r, ['description']) ?? '—',
    reference: pickString(r, ['reference']) ?? '—',
    currency: pickString(r, ['currency']) ?? 'NGN',
    createdAt: pickString(r, ['createdAt']) ?? '',
  };
}

export function normalizeWalletTransactionsList(raw: unknown): WalletTransaction[] {
  const items = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' && Array.isArray((raw as Record<string, unknown>).items)
      ? ((raw as Record<string, unknown>).items as unknown[])
      : [];
  return items.map(normalizeWalletTransaction).filter((t): t is WalletTransaction => t !== null);
}

export function formatWalletAmount(amount: number, currency?: string | null): string {
  const symbol = currency?.trim().toUpperCase() === 'USD' ? '$' : '₦';
  return `${symbol}${amount.toLocaleString()}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso || '—';
  return d.toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });
}

export interface WalletTransactionRow {
  id: string;
  date: string;
  description: string;
  reference: string;
  amount: string;
  type: 'credit' | 'debit';
}

export function mapWalletTransactionToRow(tx: WalletTransaction): WalletTransactionRow {
  const sign = tx.type === 'debit' ? '-' : '+';
  return {
    id: tx.id,
    date: formatDate(tx.createdAt),
    description: tx.description,
    reference: tx.reference,
    amount: `${sign}${formatWalletAmount(tx.amount, tx.currency)}`,
    type: tx.type,
  };
}

export const WALLET_TRANSACTION_TYPE_STYLES: Record<'credit' | 'debit', string> = {
  credit: 'bg-emerald-50 text-emerald-800',
  debit: 'bg-red-50 text-red-700',
};