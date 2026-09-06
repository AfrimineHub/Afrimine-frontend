import type { ActiveLeaseRow, BookingStatus } from '@/features/supplier/types';

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

/** Map API status strings to normalized BookingStatus (spec filter values). */
export function normalizeBookingStatus(raw: unknown): BookingStatus {
  const s = typeof raw === 'string' ? raw.toLowerCase().replace(/\s+/g, '') : '';
  if (s === 'cancelled' || s === 'canceled') return 'cancelled';
  if (s === 'approved' || s.includes('approved')) return 'approved';
  if (s === 'active' || s.includes('progress') || s.includes('ongoing')) return 'active';
  if (s === 'completed' || s.includes('complete') || s.includes('closed') || s.includes('return')) {
    return 'completed';
  }
  if (s.includes('declin') || s.includes('reject')) return 'declined';
  if (s.includes('disputed') || s.includes('dispute')) return 'disputed';
  if (s === 'pending' || s.includes('pending')) return 'pending';
  return 'pending';
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  active: 'Active',
  completed: 'Completed',
  declined: 'Declined',
  disputed: 'Disputed',
  cancelled: 'Cancelled',
};

export interface BookingMilestone {
  name: string;
  amount: number;
  status: 'Locked' | 'Pending' | 'Released' | string;
  releasedAt?: string | null;
  description?: string;
}

export interface BookingPaymentBreakdown {
  totalEscrow: number;
  platformFee: number;
  supplierShare: number;
  milestone1Amount: number;
  milestone2Amount: number;
  milestone3Amount: number;
  currency: string;
}

function normalizeMilestone(raw: unknown): BookingMilestone | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const name = pickString(r, ['name']);
  if (!name) return null;
  return {
    name,
    amount: pickNumber(r, ['amount']) ?? 0,
    status: pickString(r, ['status']) ?? 'Locked',
    releasedAt: pickString(r, ['releasedAt']) ?? null,
    description: pickString(r, ['description']),
  };
}

export function normalizeMilestonesList(raw: unknown): BookingMilestone[] {
  const items = Array.isArray(raw) ? raw : [];
  return items.map(normalizeMilestone).filter((m): m is BookingMilestone => m !== null);
}

export function normalizePaymentBreakdown(raw: unknown): BookingPaymentBreakdown | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  return {
    totalEscrow: pickNumber(r, ['totalEscrow']) ?? 0,
    platformFee: pickNumber(r, ['platformFee']) ?? 0,
    supplierShare: pickNumber(r, ['supplierShare']) ?? 0,
    milestone1Amount: pickNumber(r, ['milestone1Amount']) ?? 0,
    milestone2Amount: pickNumber(r, ['milestone2Amount']) ?? 0,
    milestone3Amount: pickNumber(r, ['milestone3Amount']) ?? 0,
    currency: pickString(r, ['currency']) ?? 'NGN',
  };
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
  payscrowTransactionNumber?: string;
  paymentStatus?: 'Pending' | 'Paid' | 'Failed';
  milestones?: BookingMilestone[];
  paymentBreakdown?: BookingPaymentBreakdown;
  logisticsStatus?: string;
  gitInsuranceActive?: boolean;
  parInsuranceActive?: boolean;
  insurancePolicyNumber?: string | null;
  insuranceCertificateUrl?: string | null;
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
    (startDate && endDate
      ? `${formatDate(startDate)} – ${formatDate(endDate)}`
      : startDate
        ? formatDate(startDate)
        : '—');

  // Milestone data only exists on the detail endpoint (GET /bookings/{id}), not the list.
  const milestones = [r.milestone1, r.milestone2, r.milestone3]
    .map(normalizeMilestone)
    .filter((m): m is BookingMilestone => m !== null);
  const paymentBreakdown = normalizePaymentBreakdown(r.paymentBreakdown);
  const nextMilestoneFromDetail = milestones.find((m) => m.status !== 'Released')?.name;

  const nextMilestone =
    nextMilestoneFromDetail ?? pickString(r, ['nextMilestone', 'currentMilestone']) ?? '—';

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
    milestones: milestones.length ? milestones : undefined,
    paymentBreakdown: paymentBreakdown ?? undefined,
    logisticsStatus: pickString(r, ['logisticsStatus']),
    gitInsuranceActive:
      typeof r.gitInsuranceActive === 'boolean' ? (r.gitInsuranceActive as boolean) : undefined,
    parInsuranceActive:
      typeof r.parInsuranceActive === 'boolean' ? (r.parInsuranceActive as boolean) : undefined,
    insurancePolicyNumber: pickString(r, ['insurancePolicyNumber']) ?? null,
    insuranceCertificateUrl: pickString(r, ['insuranceCertificateUrl']) ?? null,
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

export const BOOKING_STATUS_STYLES: Record<BookingStatus, string> = {
  pending: 'bg-amber-50 text-amber-800',
  approved: 'bg-sky-50 text-sky-800',
  active: 'bg-emerald-50 text-emerald-800',
  completed: 'bg-slate-100 text-slate-600',
  declined: 'bg-red-50 text-red-700',
  disputed: 'bg-orange-50 text-orange-800',
  cancelled: 'bg-slate-100 text-slate-500',
};

export function normalizeLogisticsStage(raw: unknown): string {
  if (typeof raw !== 'string' || !raw) return 'NotStarted';
  const s = raw.replace(/\s+/g, '');
  if (/notstarted/i.test(s)) return 'NotStarted';
  if (/dispatched/i.test(s)) return 'Dispatched';
  if (/enroute/i.test(s)) return 'EnRoute';
  if (/arrived/i.test(s)) return 'Arrived';
  if (/returned/i.test(s)) return 'Returned';
  return raw;
}
