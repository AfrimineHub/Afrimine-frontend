import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/buttons/Button';
import {
  BOOKING_STATUS_STYLES,
  type BookingDetail,
} from '@/features/supplier/bookings/bookingsUtils';
import {
  useBookingDisputesQuery,
  useRaiseBookingDisputeMutation,
} from '@/features/supplier/bookings/bookingsQueries';
import type { BookingDisputeRaisedByRole } from '@/features/supplier/bookings/bookingsApi';
import { getApiErrorMessage } from '@/lib/api/errors';

interface BookingDetailViewProps {
  booking: BookingDetail;
  backTo: string;
  backLabel: string;
  actions?: React.ReactNode;
  counterpartLabel?: string;
  raisedByRole?: BookingDisputeRaisedByRole;
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

const DISPUTE_STATUS_STYLES: Record<string, string> = {
  open: 'bg-red-50 text-red-700',
  underreview: 'bg-amber-50 text-amber-800',
  resolvedbuyer: 'bg-emerald-50 text-emerald-800',
  resolvedvendor: 'bg-emerald-50 text-emerald-800',
  closed: 'bg-slate-100 text-slate-600',
};

function disputeStatusStyle(status: string | null): string {
  const key = (status ?? '').toLowerCase().replace(/\s+/g, '');
  return DISPUTE_STATUS_STYLES[key] ?? 'bg-slate-100 text-slate-600';
}

function formatDisputeDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function BookingDetailView({
  booking,
  backTo,
  backLabel,
  actions,
  counterpartLabel = 'Miner',
  raisedByRole = 'supplier',
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

        <BookingDisputeSection
          bookingId={booking.id}
          raisedByRole={raisedByRole}
          canRaise={booking.status === 'active'}
        />
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

interface BookingDisputeSectionProps {
  bookingId: string;
  raisedByRole: BookingDisputeRaisedByRole;
  /** Hide the "raise a dispute" form when the booking isn't in a disputable state. */
  canRaise: boolean;
}

export function BookingDisputeSection({ bookingId, raisedByRole, canRaise }: BookingDisputeSectionProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const disputesQuery = useBookingDisputesQuery(bookingId);
  const raiseMutation = useRaiseBookingDisputeMutation();

  const disputes = disputesQuery.data ?? [];
  const hasOpenDispute = disputes.some((d) => {
    const s = (d.status ?? '').toLowerCase();
    return s === 'open' || s === 'underreview' || s === 'under review';
  });

  const closeForm = () => {
    setFormOpen(false);
    setError(null);
    setDescription('');
  };

  const handleSubmit = async () => {
    setError(null);
    const trimmed = description.trim();
    if (!trimmed) {
      setError('Please describe the issue before submitting.');
      return;
    }
    try {
      await raiseMutation.mutateAsync({ bookingId, description: trimmed, raisedByRole });
      closeForm();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not raise dispute.'));
    }
  };

  return (
    <div className="mt-6 border-t border-slate-100 pt-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900">Disputes</h2>
        {canRaise && !hasOpenDispute && !formOpen ? (
          <Button type="button" variant="outline" onClick={() => setFormOpen(true)}>
            Raise a dispute
          </Button>
        ) : null}
      </div>

      {disputesQuery.isLoading ? (
        <p className="mt-3 text-sm text-slate-500">Loading dispute history…</p>
      ) : disputes.length === 0 && !formOpen ? (
        <p className="mt-3 text-sm text-slate-500">No disputes have been raised on this booking.</p>
      ) : null}

      {disputes.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {disputes.map((dispute) => (
            <li key={dispute.id} className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${disputeStatusStyle(dispute.status)}`}
                >
                  {dispute.status ?? 'Open'}
                </span>
                <span className="text-xs text-slate-400">{formatDisputeDate(dispute.createdAt)}</span>
              </div>
              {dispute.reason ? <p className="mt-2 text-sm text-slate-700">{dispute.reason}</p> : null}
              {dispute.adminNote ? (
                <p className="mt-2 text-sm text-slate-500">
                  <span className="font-semibold text-slate-600">Admin note: </span>
                  {dispute.adminNote}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {hasOpenDispute && !formOpen ? (
        <p className="mt-3 text-xs text-amber-700">
          This booking already has an open dispute under review — Milestone 2 auto-release is paused until it's
          resolved.
        </p>
      ) : null}

      {formOpen ? (
        <div className="mt-3 space-y-2">
          <textarea
            className="w-full rounded-lg border border-slate-200 p-2 text-sm"
            placeholder="Describe the issue (e.g. equipment breakdown, non-delivery, damage)…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={raiseMutation.isPending}>
              {raiseMutation.isPending ? 'Submitting…' : 'Submit dispute'}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}