import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ADMIN_DASHBOARD_QUERY_KEY,
  ADMIN_ESCROW_QUERY_KEY,
  ADMIN_KYC_DETAIL_QUERY_KEY,
  ADMIN_KYC_QUEUE_QUERY_KEY,
  ADMIN_LISTING_COUNTS_QUERY_KEY,
  ADMIN_LISTINGS_QUERY_KEY,
  ADMIN_MILESTONES_QUERY_KEY,
  ADMIN_ORDER_QUERY_KEY,
  ADMIN_ORDERS_QUERY_KEY,
  ADMIN_ORDERS_SUMMARY_QUERY_KEY,
  ADMIN_QUOTES_QUERY_KEY,
  ADMIN_REVENUE_SUMMARY_QUERY_KEY,
  ADMIN_REVENUE_TRANSACTIONS_QUERY_KEY,
  ADMIN_USERS_QUERY_KEY,
  ADMIN_USERS_STATS_QUERY_KEY,
  ADMIN_WITHDRAWALS_QUERY_KEY,
} from '@/features/admin/config';
import {
  approveAdminKyc,
  approveAdminListing,
  approveAdminWithdrawal,
  archiveAdminListing,
  banAdminUser,
  fetchAdminDashboard,
  fetchAdminKycDetail,
  fetchAdminKycQueue,
  fetchAdminListingCounts,
  fetchAdminListings,
  fetchAdminOrder,
  fetchAdminOrders,
  fetchAdminOrdersSummary,
  fetchAdminQuotes,
  fetchAdminRevenueSummary,
  fetchAdminRevenueTransactions,
  fetchAdminUsers,
  fetchAdminUsersStats,
  fetchAdminWithdrawals,
  flagAdminListing,
  holdAdminWithdrawal,
  reactivateAdminUser,
  rejectAdminKyc,
  rejectAdminListing,
  rejectAdminWithdrawal,
  suspendAdminUser,
  updateAdminUser,
  deleteAdminUser,
  fetchAdminEscrow,
  fetchAdminMilestones,
  releaseAdminMilestone,
} from '@/features/admin/api';
import type {
  AdminEscrowQueryParams,
  AdminKycQueueQueryParams,
  AdminListingsQueryParams,
  AdminMilestonesQueryParams,
  AdminOrdersQueryParams,
  AdminQuotesQueryParams,
  AdminRejectPayload,
  AdminRevenueTransactionsQueryParams,
  AdminUsersQueryParams,
  AdminWithdrawalsQueryParams,
  UpdateAdminUserPayload,
} from '@/features/admin/types';

const STALE_TIME = 60 * 1000;

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEY,
    queryFn: fetchAdminDashboard,
    staleTime: STALE_TIME,
  });
}

export function useAdminUsersQuery(params: AdminUsersQueryParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, params],
    queryFn: () => fetchAdminUsers(params),
    staleTime: STALE_TIME,
  });
}

export function useAdminUsersStatsQuery() {
  return useQuery({
    queryKey: ADMIN_USERS_STATS_QUERY_KEY,
    queryFn: fetchAdminUsersStats,
    staleTime: STALE_TIME,
  });
}

export function useSuspendAdminUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, ...payload }: AdminRejectPayload & { userId: string }) =>
      suspendAdminUser(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_STATS_QUERY_KEY });
    },
  });
}

export function useBanAdminUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, ...payload }: AdminRejectPayload & { userId: string }) =>
      banAdminUser(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_STATS_QUERY_KEY });
    },
  });
}

export function useReactivateAdminUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => reactivateAdminUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_STATS_QUERY_KEY });
    },
  });
}

export function useUpdateAdminUserMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }:{
      userId: string;
      payload: UpdateAdminUserPayload;
    }) => updateAdminUser(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_STATS_QUERY_KEY });
    },
  });
}

export function useDeleteAdminUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => deleteAdminUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_STATS_QUERY_KEY });
    },
  });
}

export function useAdminListingsQuery(params: AdminListingsQueryParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_LISTINGS_QUERY_KEY, params],
    queryFn: () => fetchAdminListings(params),
    staleTime: STALE_TIME,
  });
}

export function useAdminListingCountsQuery() {
  return useQuery({
    queryKey: ADMIN_LISTING_COUNTS_QUERY_KEY,
    queryFn: fetchAdminListingCounts,
    staleTime: STALE_TIME,
  });
}

export function useApproveAdminListingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listingId: string) => approveAdminListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_LISTINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_LISTING_COUNTS_QUERY_KEY });
    },
  });
}

export function useRejectAdminListingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, ...payload }: AdminRejectPayload & { listingId: string }) =>
      rejectAdminListing(listingId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_LISTINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_LISTING_COUNTS_QUERY_KEY });
    },
  });
}

export function useFlagAdminListingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, ...payload }: AdminRejectPayload & { listingId: string }) =>
      flagAdminListing(listingId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_LISTINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_LISTING_COUNTS_QUERY_KEY });
    },
  });
}

export function useArchiveAdminListingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listingId: string) => archiveAdminListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_LISTINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_LISTING_COUNTS_QUERY_KEY });
    },
  });
}

export function useAdminQuotesQuery(params: AdminQuotesQueryParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_QUOTES_QUERY_KEY, params],
    queryFn: () => fetchAdminQuotes(params),
    staleTime: STALE_TIME,
  });
}

export function useAdminOrdersQuery(params: AdminOrdersQueryParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_ORDERS_QUERY_KEY, params],
    queryFn: () => fetchAdminOrders(params),
    staleTime: STALE_TIME,
  });
}

export function useAdminOrdersSummaryQuery(params: AdminOrdersQueryParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_ORDERS_SUMMARY_QUERY_KEY, params],
    queryFn: () => fetchAdminOrdersSummary(params),
    staleTime: STALE_TIME,
  });
}

export function useAdminOrderQuery(orderId: string | undefined) {
  return useQuery({
    queryKey: [...ADMIN_ORDER_QUERY_KEY, orderId],
    queryFn: () => fetchAdminOrder(orderId!),
    enabled: Boolean(orderId),
    staleTime: STALE_TIME,
  });
}

export function useAdminRevenueSummaryQuery() {
  return useQuery({
    queryKey: ADMIN_REVENUE_SUMMARY_QUERY_KEY,
    queryFn: fetchAdminRevenueSummary,
    staleTime: STALE_TIME,
  });
}

export function useAdminRevenueTransactionsQuery(params: AdminRevenueTransactionsQueryParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_REVENUE_TRANSACTIONS_QUERY_KEY, params],
    queryFn: () => fetchAdminRevenueTransactions(params),
    staleTime: STALE_TIME,
  });
}

export function useAdminWithdrawalsQuery(params: AdminWithdrawalsQueryParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_WITHDRAWALS_QUERY_KEY, params],
    queryFn: () => fetchAdminWithdrawals(params),
    staleTime: STALE_TIME,
  });
}

export function useApproveAdminWithdrawalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (withdrawalId: string) => approveAdminWithdrawal(withdrawalId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_WITHDRAWALS_QUERY_KEY }),
  });
}

export function useHoldAdminWithdrawalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ withdrawalId, ...payload }: AdminRejectPayload & { withdrawalId: string }) =>
      holdAdminWithdrawal(withdrawalId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_WITHDRAWALS_QUERY_KEY }),
  });
}

export function useRejectAdminWithdrawalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ withdrawalId, ...payload }: AdminRejectPayload & { withdrawalId: string }) =>
      rejectAdminWithdrawal(withdrawalId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_WITHDRAWALS_QUERY_KEY }),
  });
}

export function useAdminKycQueueQuery(params: AdminKycQueueQueryParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_KYC_QUEUE_QUERY_KEY, params],
    queryFn: () => fetchAdminKycQueue(params),
    staleTime: STALE_TIME,
  });
}

export function useAdminKycDetailQuery(submissionId: string | undefined) {
  return useQuery({
    queryKey: [...ADMIN_KYC_DETAIL_QUERY_KEY, submissionId],
    queryFn: () => fetchAdminKycDetail(submissionId!),
    enabled: Boolean(submissionId),
    staleTime: STALE_TIME,
  });
}

export function useApproveAdminKycMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (submissionId: string) => approveAdminKyc(submissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KYC_QUEUE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_KYC_DETAIL_QUERY_KEY });
    },
  });
}

export function useRejectAdminKycMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ submissionId, ...payload }: AdminRejectPayload & { submissionId: string }) =>
      rejectAdminKyc(submissionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KYC_QUEUE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_KYC_DETAIL_QUERY_KEY });
    },
  });
}

export function useAdminEscrowQuery(params: AdminEscrowQueryParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_ESCROW_QUERY_KEY, params],
    queryFn: () => fetchAdminEscrow(params),
    staleTime: STALE_TIME,
  });
}
 
export function useAdminMilestonesQuery(params: AdminMilestonesQueryParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_MILESTONES_QUERY_KEY, params],
    queryFn: () => fetchAdminMilestones(params),
    staleTime: STALE_TIME,
  });
}
 
export function useReleaseAdminMilestoneMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, milestoneNumber }: { bookingId: string; milestoneNumber: number }) =>
      releaseAdminMilestone(bookingId, milestoneNumber),
    onSuccess: () => {
      // Milestone releases can also move a booking's escrow/status, so refresh both lists
      queryClient.invalidateQueries({ queryKey: ADMIN_MILESTONES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_ESCROW_QUERY_KEY });
    },
  });
}
 
