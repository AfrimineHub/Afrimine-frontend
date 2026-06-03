export interface DashboardSummary {
  savedListingsCount: number;
  unreadMessagesCount: number;
  ongoingOrdersCount: number;
}

export interface DashboardNotification {
  id: string;
  title: string | null;
  message: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface ListingCard {
  id: string;
  title: string | null;
  description: string | null;
  location: string | null;
  country: string | null;
  imageUrl: string | null;
  category: string | null;
  createdAt: string;
}

export interface SavedListing {
  savedId: string;
  listing: ListingCard;
  savedAt: string;
}

export interface SavedListingsPage {
  items: SavedListing[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface SavedListingsQueryParams {
  page?: number;
  pageSize?: number;
}
