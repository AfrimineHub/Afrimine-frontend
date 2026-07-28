import type { ActiveLeaseRow } from '@/features/supplier/types';

function pickString(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === 'string' && v) return v;
  }
  return undefined;
}

function normalizeBookingStatus(raw: unknown): ActiveLeaseRow['status'] {
  const s = typeof raw === 'string' ? raw.toLowerCase() : '';
  if (s.includes('active') || s.includes('progress') || s.includes('ongoing')) return 'active';
  if (s.includes('complete') || s.includes('closed') || s.includes('return')) return 'completed';
  if (s.includes('declin') || s.includes('reject') || s.includes('cancel')) return 'declined';
  return 'pending';
}

export function normalizeBooking(raw: unknown): ActiveLeaseRow | null {
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
    (startDate && endDate ? `${startDate} – ${endDate}` : startDate ?? '—');
  const nextMilestone = pickString(r, ['nextMilestone', 'currentMilestone']) ?? '—';
  const status = normalizeBookingStatus(r.status);

  return { id, machineName, minerName, leasePeriod, nextMilestone, status };
}

export function normalizeBookingsList(raw: unknown): ActiveLeaseRow[] {
  const items = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' && Array.isArray((raw as Record<string, unknown>).items)
      ? ((raw as Record<string, unknown>).items as unknown[])
      : [];
  return items.map(normalizeBooking).filter((b): b is ActiveLeaseRow => b !== null);
}