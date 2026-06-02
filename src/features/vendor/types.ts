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
