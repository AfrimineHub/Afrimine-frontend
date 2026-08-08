import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import { adminApiPaths } from '@/features/admin/config';
import type {
  AdminDashboard,
  AdminKycDetail,
  AdminKycQueueItem,
  AdminKycQueueQueryParams,
  AdminListingCounts,
  AdminListingListItem,
  AdminListingsQueryParams,
  AdminOrderDetail,
  AdminOrderListItem,
  AdminOrderSummary,
  AdminOrdersQueryParams,
  AdminPagedQueryParams,
  AdminPagedResult,
  AdminQuoteListItem,
  AdminQuotesQueryParams,
  AdminRejectPayload,
  AdminRevenueSummary,
  AdminRevenueTransaction,
  AdminRevenueTransactionsQueryParams,
  AdminUserListItem,
  AdminUsersQueryParams,
  AdminUsersStats,
  AdminWithdrawalListItem,
  AdminWithdrawalsQueryParams,
} from '@/features/admin/types';

type RawPagedResult<T> = {
  items?: T[];
  page?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
};

function normalizePagedResult<T>(
  extracted: RawPagedResult<T> | T[],
  params: AdminPagedQueryParams,
): AdminPagedResult<T> {
  if (Array.isArray(extracted)) {
    return {
      items: extracted,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
      totalCount: extracted.length,
      totalPages: 1,
    };
  }

  const items = extracted.items ?? [];
  return {
    items,
    page: extracted.page ?? params.page ?? 1,
    pageSize: extracted.pageSize ?? params.pageSize ?? 10,
    totalCount: extracted.totalCount ?? items.length,
    totalPages: extracted.totalPages ?? 1,
  };
}

export async function fetchAdminDashboard(): Promise<AdminDashboard> {
  const { data } = await apiClient.get(adminApiPaths.dashboard);
  const extracted = extractApiData<AdminDashboard>(data);
  return {
    stats: extracted.stats ?? [],
    priorityAlerts: extracted.priorityAlerts ?? [],
    recentActivity: extracted.recentActivity ?? [],
    ongoingTransactions: extracted.ongoingTransactions ?? [],
  };
}

export async function fetchAdminUsers(params: AdminUsersQueryParams = {}): Promise<AdminPagedResult<AdminUserListItem>> {
  const { data } = await apiClient.get(adminApiPaths.users, { params });
  const extracted = extractApiData<RawPagedResult<AdminUserListItem> | AdminUserListItem[]>(data);
  return normalizePagedResult(extracted, params);
}

export async function fetchAdminUsersStats(): Promise<AdminUsersStats> {
  const { data } = await apiClient.get(`${adminApiPaths.users}/stats`);
  return extractApiData<AdminUsersStats>(data);
}

export async function suspendAdminUser(userId: string, payload: AdminRejectPayload = {}): Promise<void> {
  await apiClient.post(`${adminApiPaths.users}/${userId}/suspend`, payload);
}

export async function banAdminUser(userId: string, payload: AdminRejectPayload = {}): Promise<void> {
  await apiClient.post(`${adminApiPaths.users}/${userId}/ban`, payload);
}

export async function reactivateAdminUser(userId: string): Promise<void> {
  await apiClient.post(`${adminApiPaths.users}/${userId}/reactivate`);
}

export async function updateAdminUser(userId: string): Promise<void> {
  await apiClient.put(`${adminApiPaths.users}/${userId}`);
}

export async function deleteAdminUser(userId: string): Promise<void> {
  await apiClient.delete(`${adminApiPaths.users}/${userId}`);
}

export async function fetchAdminListings(
  params: AdminListingsQueryParams = {},
): Promise<AdminPagedResult<AdminListingListItem>> {
  const { data } = await apiClient.get(adminApiPaths.listings, { params });
  const extracted = extractApiData<RawPagedResult<AdminListingListItem> | AdminListingListItem[]>(data);
  return normalizePagedResult(extracted, params);
}

export async function fetchAdminListingCounts(): Promise<AdminListingCounts> {
  const { data } = await apiClient.get(`${adminApiPaths.listings}/counts`);
  return extractApiData<AdminListingCounts>(data);
}

export async function approveAdminListing(listingId: string): Promise<AdminListingListItem> {
  const { data } = await apiClient.post(`${adminApiPaths.listings}/${listingId}/approve`);
  return extractApiData<AdminListingListItem>(data);
}

export async function rejectAdminListing(
  listingId: string,
  payload: AdminRejectPayload = {},
): Promise<AdminListingListItem> {
  const { data } = await apiClient.post(`${adminApiPaths.listings}/${listingId}/reject`, payload);
  return extractApiData<AdminListingListItem>(data);
}

export async function flagAdminListing(
  listingId: string,
  payload: AdminRejectPayload = {},
): Promise<AdminListingListItem> {
  const { data } = await apiClient.post(`${adminApiPaths.listings}/${listingId}/flag`, payload);
  return extractApiData<AdminListingListItem>(data);
}

export async function archiveAdminListing(listingId: string): Promise<void> {
  await apiClient.delete(`${adminApiPaths.listings}/${listingId}`);
}

export async function fetchAdminQuotes(
  params: AdminQuotesQueryParams = {},
): Promise<AdminPagedResult<AdminQuoteListItem>> {
  const { data } = await apiClient.get(adminApiPaths.quotes, { params });
  const extracted = extractApiData<RawPagedResult<AdminQuoteListItem> | AdminQuoteListItem[]>(data);
  return normalizePagedResult(extracted, params);
}

export async function fetchAdminOrders(
  params: AdminOrdersQueryParams = {},
): Promise<AdminPagedResult<AdminOrderListItem>> {
  const { data } = await apiClient.get(adminApiPaths.orders, { params });
  const extracted = extractApiData<RawPagedResult<AdminOrderListItem> | AdminOrderListItem[]>(data);
  return normalizePagedResult(extracted, params);
}

export async function fetchAdminOrdersSummary(params: AdminOrdersQueryParams = {}): Promise<AdminOrderSummary> {
  const { data } = await apiClient.get(`${adminApiPaths.orders}/summary`, { params });
  return extractApiData<AdminOrderSummary>(data);
}

export async function fetchAdminOrder(orderId: string): Promise<AdminOrderDetail> {
  const { data } = await apiClient.get(`${adminApiPaths.orders}/${orderId}`);
  return extractApiData<AdminOrderDetail>(data);
}

export async function fetchAdminRevenueSummary(): Promise<AdminRevenueSummary> {
  const { data } = await apiClient.get(adminApiPaths.revenue);
  return extractApiData<AdminRevenueSummary>(data);
}

export async function fetchAdminRevenueTransactions(
  params: AdminRevenueTransactionsQueryParams = {},
): Promise<AdminPagedResult<AdminRevenueTransaction>> {
  const { data } = await apiClient.get(adminApiPaths.revenueTransactions, { params });
  const extracted = extractApiData<RawPagedResult<AdminRevenueTransaction> | AdminRevenueTransaction[]>(data);
  return normalizePagedResult(extracted, params);
}

export async function fetchAdminWithdrawals(
  params: AdminWithdrawalsQueryParams = {},
): Promise<AdminPagedResult<AdminWithdrawalListItem>> {
  const { data } = await apiClient.get(adminApiPaths.withdrawals, { params });
  const extracted = extractApiData<RawPagedResult<AdminWithdrawalListItem> | AdminWithdrawalListItem[]>(data);
  return normalizePagedResult(extracted, params);
}

export async function approveAdminWithdrawal(withdrawalId: string): Promise<AdminWithdrawalListItem> {
  const { data } = await apiClient.post(`${adminApiPaths.withdrawals}/${withdrawalId}/approve`);
  return extractApiData<AdminWithdrawalListItem>(data);
}

export async function holdAdminWithdrawal(
  withdrawalId: string,
  payload: AdminRejectPayload = {},
): Promise<AdminWithdrawalListItem> {
  const { data } = await apiClient.post(`${adminApiPaths.withdrawals}/${withdrawalId}/hold`, payload);
  return extractApiData<AdminWithdrawalListItem>(data);
}

export async function rejectAdminWithdrawal(
  withdrawalId: string,
  payload: AdminRejectPayload = {},
): Promise<AdminWithdrawalListItem> {
  const { data } = await apiClient.post(`${adminApiPaths.withdrawals}/${withdrawalId}/reject`, payload);
  return extractApiData<AdminWithdrawalListItem>(data);
}

export async function fetchAdminKycQueue(
  params: AdminKycQueueQueryParams = {},
): Promise<AdminPagedResult<AdminKycQueueItem>> {
  const { data } = await apiClient.get(`${adminApiPaths.kyc}/queue`, { params });
  const extracted = extractApiData<RawPagedResult<AdminKycQueueItem> | AdminKycQueueItem[]>(data);
  return normalizePagedResult(extracted, params);
}

export async function fetchAdminKycDetail(submissionId: string): Promise<AdminKycDetail> {
  const { data } = await apiClient.get(`${adminApiPaths.kyc}/${submissionId}`);
  return extractApiData<AdminKycDetail>(data);
}

export async function approveAdminKyc(submissionId: string): Promise<AdminKycDetail> {
  const { data } = await apiClient.post(`${adminApiPaths.kyc}/${submissionId}/approve`);
  return extractApiData<AdminKycDetail>(data);
}

export async function rejectAdminKyc(
  submissionId: string,
  payload: AdminRejectPayload = {},
): Promise<AdminKycDetail> {
  const { data } = await apiClient.post(`${adminApiPaths.kyc}/${submissionId}/reject`, payload);
  return extractApiData<AdminKycDetail>(data);
}
