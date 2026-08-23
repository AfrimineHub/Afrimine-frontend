import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import { supplierBookingsApiPaths } from './bookingsConfig';

export type BookingStatusFilter = 'pending' | 'active' | 'completed' | 'declined';
export type LogisticsType = 0 | 1;

export interface CreateBookingPayload {
  assetId: string; // uuid
  startDate: string; // ISO date-time
  endDate: string; // ISO date-time
  siteAddress: string;
  siteLatitude?: number | null;
  siteLongitude?: number | null;
  distanceKm?: number;
  currency?: string | null;
  minerPhone: string;
  logisticsType?: LogisticsType;
}


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

export async function createBooking(payload: CreateBookingPayload): Promise<unknown> {
  const { data } = await apiClient.post(supplierBookingsApiPaths.bookings, payload);
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

export type BookingDisputeRaisedByRole = 'miner' | 'supplier';

export interface RaiseBookingDisputePayload {
  description: string;
  raisedByRole: BookingDisputeRaisedByRole;
}

export interface BookingDispute {
  id: string;
  orderId: string;
  raisedByName: string | null;
  reason: string | null;
  status: string | null;
  adminNote: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

export async function fetchBookingDisputes(bookingId: string): Promise<BookingDispute[]> {
  const { data } = await apiClient.get(supplierBookingsApiPaths.disputes(bookingId));
  const extracted = extractApiData<BookingDispute[] | null>(data);
  return extracted ?? [];
}
 
export async function raiseBookingDispute(
  bookingId: string,
  payload: RaiseBookingDisputePayload,
): Promise<void> {
  await apiClient.post(supplierBookingsApiPaths.disputes(bookingId), payload);
}
