import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  approveBooking,
  confirmReturnClearance,
  confirmSiteArrival,
  declineBooking,
  dispatchBooking,
  fetchBooking,
  fetchBookingDisputes,
  fetchBookingMilestones,
  fetchBookingTracking,
  fetchBookings,
  fetchLogisticsStatus,
  fetchPaymentBreakdown,
  fetchSupplierDisputes,
  raiseBookingDispute,
  submitDailyCheck,
  triggerBookingInsurance,
  type BookingStatusFilter,
  type DailyCheckPayload,
  type InsuranceType,
  type RaiseBookingDisputePayload,
} from './bookingsApi';

/** Shared with buyer + supplier — GET bookings is role-scoped on the backend. */
export const BOOKINGS_QUERY_KEY = ['bookings'] as const;

/** @deprecated Use BOOKINGS_QUERY_KEY */
export const SUPPLIER_BOOKINGS_QUERY_KEY = BOOKINGS_QUERY_KEY;

function invalidateBookingQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  bookingId?: string,
) {
  queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
  if (bookingId) {
    queryClient.invalidateQueries({ queryKey: [...BOOKINGS_QUERY_KEY, 'detail', bookingId] });
    queryClient.invalidateQueries({ queryKey: [...BOOKINGS_QUERY_KEY, 'logistics', bookingId] });
    queryClient.invalidateQueries({ queryKey: [...BOOKINGS_QUERY_KEY, 'milestones', bookingId] });
    queryClient.invalidateQueries({ queryKey: [...BOOKINGS_QUERY_KEY, 'payment-breakdown', bookingId] });
    queryClient.invalidateQueries({ queryKey: [...BOOKINGS_QUERY_KEY, 'tracking', bookingId] });
    queryClient.invalidateQueries({ queryKey: [...BOOKINGS_QUERY_KEY, 'disputes', bookingId] });
  }
}

export function useBookingsQuery(status?: BookingStatusFilter) {
  return useQuery({
    queryKey: [...BOOKINGS_QUERY_KEY, status ?? 'all'],
    queryFn: () => fetchBookings(status),
    staleTime: 30 * 1000,
  });
}

/** @deprecated Use useBookingsQuery */
export const useSupplierBookingsQuery = useBookingsQuery;

export function useBookingQuery(bookingId: string | undefined) {
  return useQuery({
    queryKey: [...BOOKINGS_QUERY_KEY, 'detail', bookingId],
    queryFn: () => fetchBooking(bookingId as string),
    enabled: Boolean(bookingId),
    refetchOnWindowFocus: true,
    refetchInterval: (query) => {
      const raw = query.state.data as Record<string, unknown> | undefined;
      const paymentLink = raw?.paymentLink;
      const paymentStatus = raw?.paymentStatus;
      const transactionNumber = raw?.payscrowTransactionNumber;
      const awaitingPayment =
        paymentStatus !== 'Paid' &&
        typeof paymentLink === 'string' &&
        Boolean(paymentLink) &&
        !transactionNumber;
      return awaitingPayment ? 8000 : false;
    },
  });
}

/** @deprecated Use useBookingQuery */
export const useSupplierBookingQuery = useBookingQuery;

export function useLogisticsStatusQuery(bookingId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: [...BOOKINGS_QUERY_KEY, 'logistics', bookingId],
    queryFn: () => fetchLogisticsStatus(bookingId as string),
    enabled: Boolean(bookingId) && enabled,
    staleTime: 15 * 1000,
  });
}

export function useBookingMilestonesQuery(bookingId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: [...BOOKINGS_QUERY_KEY, 'milestones', bookingId],
    queryFn: () => fetchBookingMilestones(bookingId as string),
    enabled: Boolean(bookingId) && enabled,
    staleTime: 30 * 1000,
  });
}

export function usePaymentBreakdownQuery(bookingId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: [...BOOKINGS_QUERY_KEY, 'payment-breakdown', bookingId],
    queryFn: () => fetchPaymentBreakdown(bookingId as string),
    enabled: Boolean(bookingId) && enabled,
    staleTime: 60 * 1000,
  });
}

export function useBookingTrackingQuery(bookingId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: [...BOOKINGS_QUERY_KEY, 'tracking', bookingId],
    queryFn: () => fetchBookingTracking(bookingId as string),
    enabled: Boolean(bookingId) && enabled,
    staleTime: 10 * 1000,
    refetchInterval: enabled ? 20_000 : false,
  });
}

export function useApproveBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => approveBooking(bookingId),
    onSuccess: (_data, bookingId) => {
      invalidateBookingQueries(queryClient, bookingId);
    },
  });
}

export function useDeclineBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason: string }) =>
      declineBooking(bookingId, reason),
    onSuccess: (_data, variables) => {
      invalidateBookingQueries(queryClient, variables.bookingId);
    },
  });
}

export function useDispatchBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => dispatchBooking(bookingId),
    onSuccess: (_data, bookingId) => {
      invalidateBookingQueries(queryClient, bookingId);
    },
  });
}

export function useSiteArrivalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => confirmSiteArrival(bookingId),
    onSuccess: (_data, bookingId) => {
      invalidateBookingQueries(queryClient, bookingId);
    },
  });
}

export function useReturnClearanceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => confirmReturnClearance(bookingId),
    onSuccess: (_data, bookingId) => {
      invalidateBookingQueries(queryClient, bookingId);
    },
  });
}

export function useDailyCheckMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      ...payload
    }: DailyCheckPayload & { bookingId: string }) => submitDailyCheck(bookingId, payload),
    onSuccess: (_data, variables) => {
      invalidateBookingQueries(queryClient, variables.bookingId);
    },
  });
}

export function useTriggerInsuranceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, type }: { bookingId: string; type: InsuranceType }) =>
      triggerBookingInsurance(bookingId, { type }),
    onSuccess: (_data, variables) => {
      invalidateBookingQueries(queryClient, variables.bookingId);
    },
  });
}

export function useBookingDisputesQuery(bookingId: string | undefined) {
  return useQuery({
    queryKey: [...BOOKINGS_QUERY_KEY, 'disputes', bookingId],
    queryFn: () => fetchBookingDisputes(bookingId as string),
    enabled: Boolean(bookingId),
    staleTime: 30 * 1000,
  });
}

export function useSupplierDisputesQuery(enabled = true) {
  return useQuery({
    queryKey: [...BOOKINGS_QUERY_KEY, 'supplier-disputes'],
    queryFn: () => fetchSupplierDisputes(),
    enabled,
    staleTime: 30 * 1000,
  });
}

export function useRaiseBookingDisputeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      ...payload
    }: RaiseBookingDisputePayload & { bookingId: string }) => raiseBookingDispute(bookingId, payload),
    onSuccess: (_, variables) => {
      invalidateBookingQueries(queryClient, variables.bookingId);
      queryClient.invalidateQueries({ queryKey: [...BOOKINGS_QUERY_KEY, 'supplier-disputes'] });
    },
  });
}
