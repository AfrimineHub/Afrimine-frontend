import type { DashboardNotification, ListingCard } from '@/features/dashboard/types';

export type CurrencyCode = 'NGN' | 'USD';

export interface BuyerDashboardStats {
  savedListingsCount: number;
  unreadMessagesCount: number;
  ongoingOrdersCount: number;
  openRfqsCount: number;
}

/** Matches MarketTrendItemDto */
export interface MarketTrendItem {
  commodity: string;
  price: number;
  currency: string | null;
  unit: string | null;
  changePercent: number | null;
  asOf: string;
}

/** Matches InvestmentInsightItemDto */
export interface InvestmentInsightItem {
  id: string;
  title: string;
  summary: string | null;
  publishedAt: string;
}

export interface MarketplaceListing extends ListingCard {
  price: string | null;
  priceMin: number | null;
  priceMax: number | null;
  currency: string | null;
  spec: string | null;
  subSpec: string | null;
  listingType: string | null;
  isVerified: boolean;
}

export interface MarketplaceListingsQueryParams {
  q?: string;
  location?: string;
  mineral?: string;
  listingType?: string;
  verifiedOnly?: boolean;
  sort?: 'latest' | 'recommended' | 'price';
  page?: number;
  pageSize?: number;
}

export interface MarketplaceListingsPage {
  items: MarketplaceListing[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/** Matches ListingCategoryDto */
export interface ListingCategory {
  id: string;
  name: string;
  slug: string | null;
  imageUrl: string | null;
  listingCount: number;
}

/** Matches BuyerOrderDto */
export interface BuyerOrderListItem {
  id: string;
  listingId: string;
  listingTitle: string | null;
  vendorName: string | null;
  amount: number;
  currency: string | null;
  status: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface BuyerOrdersQueryParams {
  Page?: number;
  PageSize?: number;
  Status?: number;
}

export interface BuyerOrdersPage {
  items: BuyerOrderListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/** Matches BuyerRfqDto */
export interface BuyerRfqListItem {
  id: string;
  title: string;
  description: string;
  mineralType: string;
  quantity: string | null;
  unit: string;
  targetPrice: string | null;
  location: string | null;
  country: string;
  status: string | null;
  buyerName: string;
  expiresAt: string;
  createdAt: string;
}

export interface BuyerRfqsQueryParams {
  title?: string;
  location?: string;
  minQuantity?: string;
  Page?: number;
  PageSize?: number;
  Status?: string;
}

export interface BuyerRfqsPage {
  items: BuyerRfqListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CreateBuyerRfqPayload {
  title: string;
  description: string;
  mineralType: string;
  quantity: string;
  unit: string;
  targetPrice: string;
  location: string;
  country: string;
  expiresAt: string;
}

/** Matches BuyerRfqQuoteDto */
export interface BuyerRfqQuote {
  id: string;
  vendorName: string | null;
  amount: number;
  currency: string | null;
  status: string | null;
  note: string | null;
  expiresAt: string | null;
  createdAt: string;
}

/** Matches ConversationDto */
export interface ConversationListItem {
  id: string;
  participantName: string | null;
  participantAvatarUrl: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface ConversationsQueryParams {
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface ConversationsPage {
  items: ConversationListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/** Matches MessageDto */
export interface MessageItem {
  id: string;
  conversationId: string;
  senderName: string | null;
  body: string;
  sentAt: string;
  isOwn: boolean;
}

export interface MessagesQueryParams {
  page?: number;
  pageSize?: number;
}

export interface MessagesPage {
  items: MessageItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/** Matches ConversationContextDto — listing/order snippet in messages sidebar. */
export interface ConversationContext {
  listingId: string | null;
  orderId: string | null;
  title: string | null;
  location: string | null;
  priceRange: string | null;
  imageUrl: string | null;
  category: string | null;
}

export interface BuyerDashboard {
  stats: BuyerDashboardStats;
  marketTrends: MarketTrendItem[];
  investmentInsights: InvestmentInsightItem[];
  recentNotifications: DashboardNotification[];
}
