import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  approveBooking,
  declineBooking,
  fetchBooking,
  fetchBookings,
  type BookingStatusFilter,
} from './bookingsApi';

export const SUPPLIER_BOOKINGS_QUERY_KEY = ['supplier', 'bookings'] as const;

export function useSupplierBookingsQuery(status?: BookingStatusFilter) {
  return useQuery({
    queryKey: [...SUPPLIER_BOOKINGS_QUERY_KEY, status ?? 'all'],
    queryFn: () => fetchBookings(status),
    staleTime: 30 * 1000,
  });
}

export function useSupplierBookingQuery(bookingId: string | undefined) {
  return useQuery({
    queryKey: [...SUPPLIER_BOOKINGS_QUERY_KEY, bookingId],
    queryFn: () => fetchBooking(bookingId as string),
    enabled: Boolean(bookingId),
  });
}

export function useApproveBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => approveBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIER_BOOKINGS_QUERY_KEY });
    },
  });
}

export function useDeclineBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason: string }) =>
      declineBooking(bookingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIER_BOOKINGS_QUERY_KEY });
    },
  });
}