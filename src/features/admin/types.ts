export interface AdminPagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface AdminPagedQueryParams {
  page?: number;
  pageSize?: number;
  q?: string;
}

export interface AdminStatCard {
  id: string;
  title: string;
  value: string | number;
  trend?: string | null;
  isPositive?: boolean | null;
  isNeutral?: boolean | null;
}

export interface AdminPriorityAlert {
  id: string;
  type: 'danger' | 'warning' | 'info' | string;
  title: string;
  description: string;
  time: string;
  actionText?: string | null;
  actionUrl?: string | null;
}

export interface AdminActivityItem {
  id: string;
  type: 'info' | 'success' | 'primary' | 'danger' | 'warning' | string;
  title: string;
  description: string;
  createdAt: string;
}

export interface AdminOngoingTransaction {
  id: string;
  orderId: string;
  buyerName: string | null;
  vendorName: string | null;
  amount: number;
  currency: string | null;
  status: string | null;
}

export interface AdminDashboard {
  stats: AdminStatCard[];
  priorityAlerts: AdminPriorityAlert[];
  recentActivity: AdminActivityItem[];
  ongoingTransactions: AdminOngoingTransaction[];
}

export interface AdminUserListItem {
  id: string;
  fullName: string | null;
  email: string | null;
  role: string | null;
  kycStatus: string | null;
  accountStatus: string | null;
  createdAt: string;
}

export interface AdminUsersQueryParams extends AdminPagedQueryParams {
  role?: string;
  kycStatus?: string;
  accountStatus?: string;
}

export interface AdminUsersStats {
  totalUsers: number;
  activeUsers: number;
  kycVerified: number;
  vendors: number;
}

export interface AdminListingListItem {
  id: string;
  title: string | null;
  category: string | null;
  location: string | null;
  sellerName: string | null;
  price: string | null;
  priceAmount: number | null;
  currency: string | null;
  status: string | null;
  createdAt: string;
}

export interface AdminListingsQueryParams extends AdminPagedQueryParams {
  status?: string;
}

export interface AdminListingCounts {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
  flagged: number;
}

export interface AdminRejectPayload {
  reason?: string;
}

export interface AdminQuoteListItem {
  id: string;
  clientName: string | null;
  companyName: string | null;
  productName: string | null;
  quantity: string | null;
  status: string | null;
  createdAt: string;
  isUnread?: boolean;
}

export interface AdminQuotesQueryParams extends AdminPagedQueryParams {
  status?: string;
}

export interface AdminOrderListItem {
  id: string;
  listingTitle: string | null;
  description: string | null;
  buyerName: string | null;
  buyerEmail: string | null;
  vendorName: string | null;
  vendorEmail: string | null;
  amount: number;
  currency: string | null;
  status: string | null;
  createdAt: string;
}

export interface AdminOrdersQueryParams extends AdminPagedQueryParams {
  status?: string;
}

export interface AdminOrderSummary {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  failedOrCanceled: number;
}

export interface AdminOrderTimelineStep {
  step: string;
  occurredAt: string;
  status: 'completed' | 'current' | 'pending' | string;
}

export interface AdminOrderDocument {
  id: string;
  name: string;
  sizeBytes: number | null;
  uploadedBy: string | null;
  uploadedAt: string;
  downloadUrl: string | null;
}

export interface AdminOrderDetail extends AdminOrderListItem {
  timeline: AdminOrderTimelineStep[];
  documents: AdminOrderDocument[];
}

export interface AdminRevenueSummary {
  totalPlatformRevenue: number;
  totalPlatformRevenueChangePercent: number | null;
  vendorPayouts: number;
  vendorPayoutsChangePercent: number | null;
  pendingPayments: number;
  pendingPaymentsChangePercent: number | null;
  currency: string | null;
}

export interface AdminRevenueTransaction {
  id: string;
  vendorName: string | null;
  productName: string | null;
  amount: number;
  currency: string | null;
  status: string | null;
  createdAt: string;
}

export interface AdminRevenueTransactionsQueryParams extends AdminPagedQueryParams {
  status?: string;
}

export interface AdminWithdrawalListItem {
  id: string;
  vendorId: string;
  vendorName: string | null;
  vendorEmail: string | null;
  amount: number;
  currency: string | null;
  bankName: string | null;
  status: string | null;
  requestedAt: string;
}

export interface AdminWithdrawalsQueryParams extends AdminPagedQueryParams {
  status?: string;
}

export interface AdminKycQueueItem {
  id: string;
  userId: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  documentType: string | null;
  country: string | null;
  submittedAt: string;
}

export interface AdminKycDocument {
  fileName: string;
  downloadUrl: string;
  fileSizeBytes: number | null;
  documentType: string;
}

export interface AdminKycDetail {
  id: string;
  userId: string;
  fullName: string | null;
  dateOfBirth: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  documentType: string | null;
  documentIdNumber: string | null;
  country: string | null;
  submittedAt: string;
  profilePhotoUrl: string | null;
  documentFileName: string | null;
  documentFileSizeBytes: number | null;
  documentDownloadUrl: string | null;
  documents: AdminKycDocument[] | null;
  status: string | null;
}

export interface AdminKycQueueQueryParams extends AdminPagedQueryParams {
  status?: string;
}
