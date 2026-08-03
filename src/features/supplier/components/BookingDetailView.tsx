import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/buttons/Button';
import {
  BOOKING_STATUS_STYLES,
  type BookingDetail,
} from '@/features/supplier/bookings/bookingsUtils';

interface BookingDetailViewProps {
  booking: BookingDetail;
  backTo: string;
  backLabel: string;
  /** Supplier-only approve/decline UI */
  actions?: React.ReactNode;
  counterpartLabel?: string;
}

function formatMoney(amount: number | undefined, currency = 'NGN'): string {
  if (amount == null) return '—';
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function BookingDetailView({
  booking,
  backTo,
  backLabel,
  actions,
  counterpartLabel = 'Miner',
}: BookingDetailViewProps) {
  return (
    <div>
      <Link
        to={backTo}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#CA8A04]"
      >
        <ArrowLeft size={16} aria-hidden />
        {backLabel}
      </Link>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{booking.machineName}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {counterpartLabel}: {booking.minerName}
          </p>
        </div>
        <span
          className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${BOOKING_STATUS_STYLES[booking.status]}`}
        >
          {booking.status}
        </span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lease period</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-900">{booking.leasePeriod}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Next milestone</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-900">{booking.nextMilestone}</dd>
          </div>
          {booking.siteAddress ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Site address</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">{booking.siteAddress}</dd>
            </div>
          ) : null}
          {booking.minerPhone ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Contact phone</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">{booking.minerPhone}</dd>
            </div>
          ) : null}
          {booking.distanceKm != null ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Distance</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">{booking.distanceKm} km</dd>
            </div>
          ) : null}
          {booking.logisticsType ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Logistics</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">{booking.logisticsType}</dd>
            </div>
          ) : null}
          {booking.totalAmount != null ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Estimated total</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">
                {formatMoney(booking.totalAmount, booking.currency)}
              </dd>
            </div>
          ) : null}
          {booking.declineReason ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Decline reason</dt>
              <dd className="mt-1 text-sm font-semibold text-red-700">{booking.declineReason}</dd>
            </div>
          ) : null}
        </dl>

        {booking.assetId ? (
          <div className="mt-6 border-t border-slate-100 pt-4">
            <Link
              to={`/equipment/${booking.assetId}`}
              className="text-sm font-semibold text-[#CA8A04] hover:underline"
            >
              View equipment listing
            </Link>
          </div>
        ) : null}

        {actions ? <div className="mt-6 border-t border-slate-100 pt-4">{actions}</div> : null}
      </div>
    </div>
  );
}

interface PendingActionsProps {
  onApprove: () => void;
  onStartDecline: () => void;
  approving: boolean;
  declining: boolean;
  declineOpen: boolean;
  declineReason: string;
  onDeclineReasonChange: (value: string) => void;
  onCancelDecline: () => void;
  onConfirmDecline: () => void;
}

export function BookingPendingActions({
  onApprove,
  onStartDecline,
  approving,
  declining,
  declineOpen,
  declineReason,
  onDeclineReasonChange,
  onCancelDecline,
  onConfirmDecline,
}: PendingActionsProps) {
  if (declineOpen) {
    return (
      <div className="space-y-2">
        <textarea
          className="w-full rounded-lg border border-slate-200 p-2 text-sm"
          placeholder="Reason for declining (required)"
          value={declineReason}
          onChange={(e) => onDeclineReasonChange(e.target.value)}
          rows={2}
        />
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancelDecline}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirmDecline} disabled={declining}>
            {declining ? 'Declining…' : 'Confirm decline'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Button type="button" variant="outline" onClick={onStartDecline}>
        Decline
      </Button>
      <Button type="button" onClick={onApprove} disabled={approving}>
        {approving ? 'Approving…' : 'Approve'}
      </Button>
    </div>
  );
}
