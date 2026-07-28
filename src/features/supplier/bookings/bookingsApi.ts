import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import { supplierBookingsApiPaths } from './bookingsConfig';

/**
 * The GET /bookings `status` query param is typed as a plain string in the
 * spec (no enum), so these values are a guess based on ActiveLeaseRow's
 * existing status union — confirm the real accepted values with backend.
 */
export type BookingStatusFilter = 'pending' | 'active' | 'completed' | 'declined';

export async function fetchBookings(status?: BookingStatusFilter): Promise<unknown> {
  const { data } = await apiClient.get(supplierBookingsApiPaths.bookings, {
    params: status ? { status } : undefined,
  });
  return extractApiData<unknown>(data);
}

export async function fetchBooking(bookingId: string): Promise<unknown> {
  const { data } = await apiClient.get(supplierBookingsApiPaths.booking(bookingId));
  return extractApiData<unknown>(data);
}

export async function approveBooking(bookingId: string): Promise<void> {
  await apiClient.put(supplierBookingsApiPaths.approve(bookingId));
}

export interface DeclineBookingPayload {
  reason: string;
}

export async function declineBooking(bookingId: string, reason: string): Promise<void> {
  const payload: DeclineBookingPayload = { reason };
  await apiClient.put(supplierBookingsApiPaths.decline(bookingId), payload);
}