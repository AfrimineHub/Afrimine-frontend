import type { DashboardSummary } from '@/features/dashboard/types';
import type { Order, OrderStatus } from '@/features/marketplace/myOrders/types';
import type { Transaction } from '@/features/vendor/components/payouts/TransactionTable';
import type { QuoteItem } from '@/features/vendor/components/quotes/QuoteListItem';
import type {
  VendorDashboardStats,
  VendorOrderListItem,
  VendorPayoutItem,
  VendorPayoutSummary,
  VendorQuoteListItem,
} from '@/features/vendor/dashboardTypes';
import { formatRelativeTime } from '@/lib/utils/formatRelativeTime';

export function formatVendorAmount(amount: number, currency?: string | null): string {
  const isUsd = currency?.trim().toUpperCase() === 'USD';
  const symbol = isUsd ? '$' : '₦';
  return `${symbol}${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function formatPercentChange(
  value: number | null | undefined,
  label = 'from previous month',
): string | null {
  if (value == null || Number.isNaN(value)) return null;
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}% ${label}`;
}

export function formatCount(value: number): string {
  return value.toLocaleString();
}

export function buildVendorStatsFromSummary(
  summary: DashboardSummary,
  payout?: VendorPayoutSummary,
): VendorDashboardStats {
  return {
    totalListingsCount: summary.totalListingsCount ?? 0,
    activeQuotesCount: summary.activeQuotesCount ?? 0,
    ongoingOrdersCount: summary.ongoingOrdersCount,
    unreadMessagesCount: summary.unreadMessagesCount,
    pendingPayoutAmount: summary.pendingPayoutAmount ?? payout?.pendingAmount ?? 0,
    successfulOrdersCount: summary.successfulOrdersCount ?? 0,
  };
}

export function mapQuoteStatus(status: string | null): QuoteItem['status'] {
  const value = (status ?? 'pending').toLowerCase();

  if (value.includes('accept')) return 'Accepted';
  if (value.includes('reject')) return 'Rejected';
  if (value.includes('flag')) return 'Flagged';
  if (value.includes('sent') || value.includes('submit')) return 'Sent';
  return 'Pending';
}

export function mapVendorQuoteToQuoteItem(quote: VendorQuoteListItem): QuoteItem {
  const status = mapQuoteStatus(quote.status);
  const requestSummary =
    quote.note?.trim() ||
    (quote.amount > 0
      ? `Quote for ${formatVendorAmount(quote.amount, quote.currency)}`
      : 'Buyer quote request');

  return {
    id: quote.id,
    company: quote.buyerName?.trim() || 'Buyer',
    listing: quote.listingTitle?.trim() || 'Listing',
    requestSummary,
    timeAgo: formatRelativeTime(quote.createdAt) || 'Recently',
    status,
    isNew: status === 'Pending',
  };
}

export function mapOrderStatus(status: string | null): OrderStatus {
  const value = (status ?? 'pending').toLowerCase();

  if (value.includes('paid')) return 'paid';
  if (value.includes('deliver')) return 'delivered';
  if (value.includes('complete')) return 'completed';
  if (value.includes('dispute')) return 'disputed';
  if (value.includes('frozen') || value.includes('cancel')) return 'frozen';
  return 'pending';
}

export function mapVendorOrderToOrder(order: VendorOrderListItem): Order {
  const date = new Date(order.createdAt);
  const formattedDate = Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return {
    id: order.id,
    counterparty: order.buyerName?.trim() || 'Buyer',
    listing: order.listingTitle?.trim() || 'Listing',
    amount: 0,
    status: mapOrderStatus(order.status),
    date: formattedDate,
  };
}

export function mapPayoutStatus(status: string | null): Transaction['status'] {
  const value = (status ?? 'pending').toLowerCase();
  if (value.includes('complete') || value.includes('paid') || value.includes('success')) {
    return 'completed';
  }
  return 'pending';
}

export function mapPayoutItemToTransaction(payout: VendorPayoutItem): Transaction {
  const date = new Date(payout.processedAt ?? payout.createdAt);
  const formattedDate = Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' });

  return {
    id: payout.reference?.trim() || payout.id,
    date: formattedDate,
    method: 'Payout',
    amount: formatVendorAmount(payout.amount, payout.currency),
    status: mapPayoutStatus(payout.status),
  };
}
