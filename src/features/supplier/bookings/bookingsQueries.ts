import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  approveBooking,
  declineBooking,
  fetchBooking,
  fetchBookings,
  type BookingStatusFilter,
  fetchBookingDisputes,
  type RaiseBookingDisputePayload,
  raiseBookingDispute,
} from './bookingsApi';

/** Shared with buyer + supplier — GET bookings is role-scoped on the backend. */
export const BOOKINGS_QUERY_KEY = ['bookings'] as const;

/** @deprecated Use BOOKINGS_QUERY_KEY */
export const SUPPLIER_BOOKINGS_QUERY_KEY = BOOKINGS_QUERY_KEY;

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
      const transactionNumber = raw?.payscrowTransactionNumber;
      const awaitingPayment = typeof paymentLink === 'string' && paymentLink && !transactionNumber;
      return awaitingPayment ? 8000 : false;
    },
  });
}

/** @deprecated Use useBookingQuery */
export const useSupplierBookingQuery = useBookingQuery;

export function useApproveBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => approveBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
    },
  });
}

export function useDeclineBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason: string }) =>
      declineBooking(bookingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
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
 
export function useRaiseBookingDisputeMutation() {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: ({
      bookingId,
      ...payload
    }: RaiseBookingDisputePayload & { bookingId: string }) => raiseBookingDispute(bookingId, payload),
    onSuccess: (_, variables) => {
      // A dispute changes the booking's own state (Active -> Disputed) and pauses
      // milestone auto-release, so refresh both the detail view and the dispute list.
      queryClient.invalidateQueries({ queryKey: [...BOOKINGS_QUERY_KEY, 'detail', variables.bookingId] });
      queryClient.invalidateQueries({ queryKey: [...BOOKINGS_QUERY_KEY, 'disputes', variables.bookingId] });
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
    },
  });
}
