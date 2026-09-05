import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import { supplierBookingsApiPaths } from './bookingsConfig';

/** Query param values for GET /bookings?status= — PascalCase per API docs. */
export type BookingStatusFilter =
  | 'Pending'
  | 'Approved'
  | 'Declined'
  | 'Active'
  | 'Completed'
  | 'Disputed'
  | 'Cancelled';

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

export async function dispatchBooking(bookingId: string): Promise<void> {
  await apiClient.post(supplierBookingsApiPaths.dispatch(bookingId));
}

export async function confirmSiteArrival(bookingId: string): Promise<void> {
  await apiClient.post(supplierBookingsApiPaths.siteArrival(bookingId));
}

export async function confirmReturnClearance(bookingId: string): Promise<void> {
  await apiClient.post(supplierBookingsApiPaths.returnClearance(bookingId));
}

export interface DailyCheckPayload {
  engineOilChecked: boolean;
  hydraulicFluidChecked: boolean;
  coolingSystemChecked: boolean;
  undercarriageChecked: boolean;
  greaseChecked: boolean;
  notes?: string | null;
  checkedByOperatorId: string;
}

export async function submitDailyCheck(bookingId: string, payload: DailyCheckPayload): Promise<void> {
  await apiClient.post(supplierBookingsApiPaths.dailyCheck(bookingId), payload);
}

export type InsuranceType = 'GIT' | 'PAR';

export interface TriggerInsurancePayload {
  type: InsuranceType;
}

export async function triggerBookingInsurance(
  bookingId: string,
  payload: TriggerInsurancePayload,
): Promise<unknown> {
  const { data } = await apiClient.post(supplierBookingsApiPaths.insurance(bookingId), payload);
  return extractApiData<unknown>(data);
}

export interface LogisticsStatusDto {
  status: string | null;
  trackingData: string | null;
  gitInsuranceActive: boolean;
  insuranceCertificateUrl: string | null;
  parInsuranceActive?: boolean;
}

export async function fetchLogisticsStatus(bookingId: string): Promise<LogisticsStatusDto> {
  const { data } = await apiClient.get(supplierBookingsApiPaths.logisticsStatus(bookingId));
  const extracted = extractApiData<LogisticsStatusDto | null>(data);
  return (
    extracted ?? {
      status: null,
      trackingData: null,
      gitInsuranceActive: false,
      insuranceCertificateUrl: null,
    }
  );
}

export interface TrackingDto {
  latitude?: number | null;
  longitude?: number | null;
  lastUpdated?: string | null;
  message?: string | null;
}

export async function fetchBookingTracking(bookingId: string): Promise<TrackingDto | string> {
  const { data } = await apiClient.get(supplierBookingsApiPaths.tracking(bookingId));
  return extractApiData<TrackingDto | string>(data);
}

export async function fetchBookingMilestones(bookingId: string): Promise<unknown[]> {
  const { data } = await apiClient.get(supplierBookingsApiPaths.milestones(bookingId));
  const extracted = extractApiData<unknown[] | null>(data);
  return extracted ?? [];
}

export async function fetchPaymentBreakdown(bookingId: string): Promise<unknown> {
  const { data } = await apiClient.get(supplierBookingsApiPaths.paymentBreakdown(bookingId));
  return extractApiData<unknown>(data);
}

export async function fetchInsuranceCertificate(bookingId: string): Promise<unknown> {
  const { data } = await apiClient.get(supplierBookingsApiPaths.insuranceCertificate(bookingId));
  return extractApiData<unknown>(data);
}

export async function fetchBookingContract(bookingId: string): Promise<unknown> {
  const { data } = await apiClient.get(supplierBookingsApiPaths.contract(bookingId));
  return extractApiData<unknown>(data);
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

export async function fetchSupplierDisputes(): Promise<BookingDispute[]> {
  const { data } = await apiClient.get(supplierBookingsApiPaths.allDisputes);
  const extracted = extractApiData<BookingDispute[] | null>(data);
  return extracted ?? [];
}
