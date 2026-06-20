import type { DashboardSummary } from '@/features/dashboard/types';
import type { ListingCardData } from '@/features/marketplace/components/ListingCard';
import type { Order, OrderStatus } from '@/features/marketplace/myOrders/types';
import type {
  BuyerDashboardStats,
  BuyerOrderListItem,
  BuyerRfqListItem,
  ConversationListItem,
  InvestmentInsightItem,
  MarketplaceListing,
  MarketTrendItem,
  MessageItem,
} from '@/features/buyer/dashboardTypes';
import { formatRelativeTime } from '@/lib/utils/formatRelativeTime';

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  mineral: 'bg-teal-600',
  equipment: 'bg-emerald-500',
  investment: 'bg-blue-600',
};

export function formatBuyerAmount(amount: number, currency?: string | null): string {
  const isUsd = currency?.trim().toUpperCase() === 'USD';
  const symbol = isUsd ? '$' : '₦';
  return `${symbol}${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function buildBuyerStatsFromSummary(summary: DashboardSummary): BuyerDashboardStats {
  return {
    savedListingsCount: summary.savedListingsCount,
    unreadMessagesCount: summary.unreadMessagesCount,
    ongoingOrdersCount: summary.ongoingOrdersCount,
    openRfqsCount: summary.openRfqsCount ?? 0,
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

export function mapBuyerOrderToOrder(order: BuyerOrderListItem): Order {
  const date = new Date(order.createdAt);
  const formattedDate = Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return {
    id: order.id,
    counterparty: order.vendorName?.trim() || 'Vendor',
    listing: order.listingTitle?.trim() || 'Listing',
    amount: order.amount,
    currency: order.currency,
    status: mapOrderStatus(order.status),
    date: formattedDate,
  };
}

export function mapBuyerRfqToCard(rfq: BuyerRfqListItem) {
  const targetPrice =
    rfq.targetPrice?.trim() ||
    (rfq.targetPrice != null && Number(rfq.targetPrice) > 0
      ? formatBuyerAmount(Number(rfq.targetPrice))
      : '—');

  const status = (rfq.status ?? 'open').toLowerCase();

  return {
    id: rfq.id,
    title: rfq.title,
    quantity: rfq.quantity?.trim() || '—',
    location: rfq.location?.trim() || '—',
    targetPrice,
    buyerName: rfq.buyerName?.trim() || '—',
    posted: formatRelativeTime(rfq.createdAt) || 'Recently',
    status,
    statusLabel: status.includes('close') ? 'Closed' : status.includes('respond') ? 'Responded' : 'Open',
    responseCount: rfq.unit ?? 0,
    notes: rfq.description?.trim() || null,
  };
}

export type BuyerRfqCardData = ReturnType<typeof mapBuyerRfqToCard>;

function resolveCategoryBadge(category: string | null): string {
  const key = (category ?? '').toLowerCase();
  if (key.includes('invest')) return CATEGORY_BADGE_COLORS.investment;
  if (key.includes('equip')) return CATEGORY_BADGE_COLORS.equipment;
  if (key.includes('mineral')) return CATEGORY_BADGE_COLORS.mineral;
  return 'bg-gray-600';
}

function formatListingPrice(listing: MarketplaceListing): string {
  if (listing.price?.trim()) return listing.price;

  const currency = listing.currency?.trim().toUpperCase() === 'USD' ? '$' : '₦';
  if (listing.priceMin != null && listing.priceMax != null) {
    return `${currency}${listing.priceMin.toLocaleString()} - ${currency}${listing.priceMax.toLocaleString()}`;
  }
  if (listing.priceMin != null) {
    return `${currency}${listing.priceMin.toLocaleString()}`;
  }
  return '—';
}

export function mapMarketplaceListingToCard(listing: MarketplaceListing): ListingCardData {
  return {
    id: listing.id,
    title: listing.title?.trim() || 'Untitled listing',
    category: listing.category?.trim() || listing.listingType?.trim() || 'Listing',
    badgeColor: resolveCategoryBadge(listing.category ?? listing.listingType),
    location: [listing.location, listing.country].filter(Boolean).join(', ') || 'Africa',
    spec: listing.spec?.trim() || '—',
    subSpec: listing.subSpec?.trim() || '',
    price: formatListingPrice(listing),
    imageUrl: listing.imageUrl?.trim() || '/images/gold-mine.svg',
  };
}

export function mapMarketTrendToRow(trend: MarketTrendItem) {
  const currency = trend.currency?.trim().toUpperCase() === 'USD' ? '$' : '₦';
  const unit = trend.unit?.trim() ? `/${trend.unit}` : '';
  const change = trend.changePercent;
  const changeLabel =
    change == null
      ? null
      : `${change > 0 ? '▲' : '▼'} ${Math.abs(change)}% Today`;

  return {
    label: trend.commodity,
    price: `${currency}${trend.price.toLocaleString()}${unit}`,
    changeLabel,
    isPositive: change != null && change > 0,
  };
}

export function mapInvestmentInsightToRow(insight: InvestmentInsightItem) {
  return {
    id: insight.id,
    title: insight.title,
    summary: insight.summary,
    timeAgo: formatRelativeTime(insight.publishedAt) || 'Recently',
  };
}

export function mapConversationToSidebarItem(conversation: ConversationListItem) {
  return {
    id: conversation.id,
    name: conversation.participantName?.trim() || 'Contact',
    avatarUrl: '/images/categories/buyer.png',
    preview:
      conversation.lastMessage?.trim() ||
      conversation.listingTitle?.trim() ||
      '',
    subtitle: conversation.listingTitle?.trim() || undefined,
    timeAgo: conversation.lastMessageAt
      ? formatRelativeTime(conversation.lastMessageAt) || ''
      : '',
    unreadCount: conversation.unreadCount,
  };
}

export function mapMessageToChat(message: MessageItem, currentUserId?: string | null) {
  const isOwn = Boolean(
    currentUserId && message.senderId && message.senderId === currentUserId,
  );

  return {
    id: message.id,
    body: message.content?.trim() || '',
    sentAt: message.createdAt,
    isOwn,
    senderName: message.senderName,
  };
}
