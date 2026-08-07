import type { ActiveLeaseRow } from '@/features/supplier/types';

function pickString(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === 'string' && v) return v;
  }
  return undefined;
}

function pickNumber(obj: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === 'number' && !Number.isNaN(v)) return v;
  }
  return undefined;
}

function normalizeBookingStatus(raw: unknown): ActiveLeaseRow['status'] {
  const s = typeof raw === 'string' ? raw.toLowerCase() : '';
  if (s.includes('active') || s.includes('progress') || s.includes('ongoing') || s.includes('approved')) {
    return 'active';
  }
  if (s.includes('complete') || s.includes('closed') || s.includes('return')) return 'completed';
  if (s.includes('declin') || s.includes('reject') || s.includes('cancel')) return 'declined';
  return 'pending';
}

export interface BookingDetail extends ActiveLeaseRow {
  assetId?: string;
  siteAddress?: string;
  minerPhone?: string;
  declineReason?: string;
  startDate?: string;
  endDate?: string;
  distanceKm?: number;
  totalAmount?: number;
  currency?: string;
  logisticsType?: string;
  paymentLink?: string;
  payscrowTransactionNumber?: string
  paymentStatus?: 'Pending' | 'Paid' | 'Failed';
}

export function normalizeBooking(raw: unknown): BookingDetail | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;

  const id = pickString(r, ['id', 'bookingId']);
  if (!id) return null;

  const machineName =
    pickString(r, ['machineName', 'assetName', 'assetTitle', 'listingTitle']) ?? 'Machine';
  const minerName =
    pickString(r, ['minerName', 'buyerName', 'customerName', 'clientName']) ?? 'Miner';
  const startDate = pickString(r, ['startDate', 'leaseStart']);
  const endDate = pickString(r, ['endDate', 'leaseEnd']);
  const leasePeriod =
    pickString(r, ['leasePeriod']) ??
    (startDate && endDate ? `${formatDate(startDate)} – ${formatDate(endDate)}` : startDate ? formatDate(startDate) : '—');
  const nextMilestone = pickString(r, ['nextMilestone', 'currentMilestone']) ?? '—';
  const status = normalizeBookingStatus(r.status);
  const paymentLink = pickString(r, ['paymentLink']);
  const payscrowTransactionNumber = pickString(r, ['payscrowTransactionNumber']);

  const logisticsRaw = r.logisticsType;
  let logisticsType: string | undefined;
  if (typeof logisticsRaw === 'string') logisticsType = logisticsRaw;
  else if (logisticsRaw === 0) logisticsType = 'Supplier-owned logistics';
  else if (logisticsRaw === 1) logisticsType = 'Third-party logistics';

  return {
    id,
    machineName,
    minerName,
    leasePeriod,
    nextMilestone,
    status,
    assetId: pickString(r, ['assetId', 'machineId']),
    siteAddress: pickString(r, ['siteAddress', 'deliveryAddress', 'address']),
    minerPhone: pickString(r, ['minerPhone', 'buyerPhone', 'phone', 'contactPhone']),
    declineReason: pickString(r, ['declineReason', 'rejectionReason', 'reason']),
    startDate,
    endDate,
    distanceKm: pickNumber(r, ['distanceKm', 'distance']),
    totalAmount: pickNumber(r, ['totalAmount', 'estimatedTotal', 'amount']),
    currency: pickString(r, ['currency']) ?? 'NGN',
    logisticsType,
    paymentLink,
    payscrowTransactionNumber,
    paymentStatus: pickString(r, ['paymentStatus']) as
  | 'Pending'
  | 'Paid'
  | 'Failed'
  | undefined,
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function normalizeBookingsList(raw: unknown): BookingDetail[] {
  const items = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' && Array.isArray((raw as Record<string, unknown>).items)
      ? ((raw as Record<string, unknown>).items as unknown[])
      : [];
  return items.map(normalizeBooking).filter((b): b is BookingDetail => b !== null);
}

export const BOOKING_STATUS_STYLES: Record<ActiveLeaseRow['status'], string> = {
  pending: 'bg-amber-50 text-amber-800',
  active: 'bg-emerald-50 text-emerald-800',
  completed: 'bg-slate-100 text-slate-600',
  declined: 'bg-red-50 text-red-700',
};
