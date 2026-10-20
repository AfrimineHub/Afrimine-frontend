import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  Circle,
  Lock,
  Unlock,
  Gavel,
  ArrowLeft,
  FileText,
  X,
} from 'lucide-react';
import {
  useAdminDisputeQuery,
  useAdminOrderQuery,
  useFreezeAdminOrderMutation,
  useReleaseAdminOrderFundsMutation,
  useResolveAdminDisputeMutation,
} from '@/features/escrow/queries';
import { RESOLVED_DISPUTE_STATUSES } from '@/features/escrow/types';
import { formatBuyerAmount } from '@/features/buyer/dashboardUtils';
import { getApiErrorMessage } from '@/lib/api/errors';

type Resolution = 'buyer' | 'vendor';

const STATUS_LABELS: Record<string, string> = {
  Open: 'Open',
  UnderReview: 'Under review',
  ResolvedBuyer: 'Resolved · Buyer',
  ResolvedVendor: 'Resolved · Vendor',
  Closed: 'Closed',
};

const RESOLUTION_OPTIONS: { value: Resolution; title: string; description: string }[] = [
  {
    value: 'buyer',
    title: 'Resolve in favour of buyer',
    description: 'Escrow is refunded to the buyer.',
  },
  {
    value: 'vendor',
    title: 'Resolve in favour of vendor',
    description: 'Escrow is released to the vendor.',
  },
];

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
};

const initialsOf = (name: string | null | undefined, fallback: string) => {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
};

type TimelineStep = {
  title: string;
  time: string;
  state: 'completed' | 'current' | 'pending';
};

const DisputeResolutionPage = () => {
  const { disputeId } = useParams<{ disputeId: string }>();
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Resolve modal state
  const [resolveOpen, setResolveOpen] = useState(false);
  const [resolution, setResolution] = useState<Resolution>('vendor');
  const [adminNote, setAdminNote] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);

  const disputeQuery = useAdminDisputeQuery(disputeId);
  const dispute = disputeQuery.data;

  const orderQuery = useAdminOrderQuery(dispute?.orderId);
  const order = orderQuery.data;

  const freezeMutation = useFreezeAdminOrderMutation();
  const releaseMutation = useReleaseAdminOrderFundsMutation();
  const resolveMutation = useResolveAdminDisputeMutation();

  const loadError =
    disputeQuery.isError &&
    getApiErrorMessage(disputeQuery.error, 'Could not load dispute details.');

  // ---- Derived guards ----
  const isResolved = RESOLVED_DISPUTE_STATUSES.includes(dispute?.status ?? '');
  const hasOrder = Boolean(dispute?.orderId);
  const isBookingDispute = !hasOrder;
  const orderStatus = (order?.status ?? '').toLowerCase();
  const isFrozen = orderStatus === 'frozen';
  const isOrderCompleted = orderStatus === 'completed';
  const anyPending =
    freezeMutation.isPending || releaseMutation.isPending || resolveMutation.isPending;

  const canFreeze = hasOrder && !isResolved && !isFrozen && !anyPending;
  const canRelease = hasOrder && !isResolved && !isOrderCompleted && !anyPending;
  const canResolve = !isResolved && !anyPending;

  const clearMessages = () => {
    setActionError(null);
    setActionSuccess(null);
  };

  // ---- Handlers ----
  const handleFreeze = async () => {
    if (!dispute?.orderId || !canFreeze) return;
    const confirmed = window.confirm(
      'Freeze all funds for this order? Neither buyer nor vendor will be able to access them until the dispute is resolved.',
    );
    if (!confirmed) return;

    clearMessages();
    try {
      await freezeMutation.mutateAsync(dispute.orderId);
      setActionSuccess('Order funds have been frozen.');
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not freeze funds.'));
    }
  };

  const handleRelease = async () => {
    if (!dispute?.orderId || !canRelease) return;
    const confirmed = window.confirm(
      'Manually release escrow funds to the vendor?\n\nThis is an override. If you intend to settle the dispute, use "Resolve Dispute" instead to avoid a double release.',
    );
    if (!confirmed) return;

    clearMessages();
    try {
      await releaseMutation.mutateAsync(dispute.orderId);
      setActionSuccess('Funds released to the vendor.');
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not release funds.'));
    }
  };

  const openResolveModal = () => {
    if (!canResolve) return;
    setModalError(null);
    setResolveOpen(true);
  };

  const closeResolveModal = () => {
    if (resolveMutation.isPending) return;
    setResolveOpen(false);
    setModalError(null);
  };

  const handleResolveSubmit = async () => {
    if (!disputeId) return;
    const note = adminNote.trim();
    if (!note) {
      setModalError('A resolution note is required.');
      return;
    }

    setModalError(null);
    clearMessages();
    try {
      await resolveMutation.mutateAsync({ disputeId, resolution, adminNote: note });
      setResolveOpen(false);
      setAdminNote('');
      setActionSuccess(
        resolution === 'buyer'
          ? 'Dispute resolved in favour of the buyer.'
          : 'Dispute resolved in favour of the vendor.',
      );
    } catch (error) {
      setModalError(getApiErrorMessage(error, 'Could not resolve dispute.'));
    }
  };

  // ---- Participants ----
  const participants = dispute
    ? [
        ...(order?.buyerName
          ? [{ name: order.buyerName, sub: order.buyerEmail, role: 'Buyer', initials: initialsOf(order.buyerName, 'BY') }]
          : []),
        ...(order?.vendorName
          ? [{ name: order.vendorName, sub: order.vendorEmail, role: 'Vendor', initials: initialsOf(order.vendorName, 'VN') }]
          : []),
        ...(dispute.raisedByName
          ? [
              {
                name: dispute.raisedByName,
                sub: null as string | null,
                role: 'Raised dispute',
                initials: initialsOf(dispute.raisedByName, 'RB'),
              },
            ]
          : []),
      ]
    : [];

  // ---- Timeline ----
  const timeline: TimelineStep[] = [];
  if (dispute) {
    for (const step of order?.timeline ?? []) {
      timeline.push({
        title: step.step ?? 'Step',
        time: step.occurredAt ? formatDateTime(step.occurredAt) : '',
        state:
          step.status === 'completed' ? 'completed' : step.status === 'current' ? 'current' : 'pending',
      });
    }
    timeline.push({
      title: 'Dispute opened',
      time: formatDateTime(dispute.createdAt),
      state: 'completed',
    });
    if (isResolved) {
      timeline.push({
        title: STATUS_LABELS[dispute.status ?? ''] ?? 'Resolved',
        time: formatDateTime(dispute.resolvedAt),
        state: 'completed',
      });
    } else {
      timeline.push({
        title: STATUS_LABELS[dispute.status ?? ''] ?? dispute.status ?? 'Awaiting admin review',
        time: 'Current status',
        state: 'current',
      });
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      <main className="flex-1 p-8 max-w-5xl mx-auto">
        <div className="mb-10">
          <Link
            to="/admin/dispute"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest mb-6 transition-all"
          >
            <ArrowLeft size={16} /> Back to Disputes
          </Link>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Dispute Resolution</h1>
          <p className="text-slate-400 font-medium">
            Manage dispute {disputeId ? `#${disputeId}` : ''}
          </p>
        </div>

        {loadError ? (
          <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError}
          </p>
        ) : null}

        {actionSuccess ? (
          <p className="mb-6 text-sm text-green-700 rounded-lg border border-green-100 bg-green-50 px-4 py-3" role="status">
            {actionSuccess}
          </p>
        ) : null}

        {actionError ? (
          <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {actionError}
          </p>
        ) : null}

        {dispute && isBookingDispute ? (
          <p className="mb-6 text-sm text-amber-700 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
            This is a {dispute.source ?? 'booking'} dispute with no linked order. Freeze and release actions are
            unavailable here; booking funds are managed through milestones. You can still resolve the dispute.
          </p>
        ) : null}

        {dispute && hasOrder && orderQuery.isError ? (
          <p className="mb-6 text-sm text-slate-600 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            Order details could not be loaded, so participants and order timeline are unavailable.
          </p>
        ) : null}

        {disputeQuery.isLoading ? (
          <div className="h-64 bg-white rounded-2xl border border-slate-100 animate-pulse" />
        ) : dispute ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                    <ShieldAlert size={20} />
                  </div>
                  <h3 className="font-black text-slate-800 uppercase tracking-tighter">Transaction Summary</h3>
                </div>

                <div className="grid grid-cols-2 gap-y-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Listing</p>
                    <p className="text-sm font-bold text-slate-700">{dispute.listingTitle ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Amount</p>
                    <p className="text-sm font-bold text-blue-600">
                      {formatBuyerAmount(dispute.amount, dispute.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">
                      {isBookingDispute ? 'Booking ID' : 'Order ID'}
                    </p>
                    {/* Plain text: swap for a <Link> once an admin order detail route exists. */}
                    <p className="text-sm font-bold text-slate-700 break-all">
                      {dispute.orderId ?? dispute.bookingId ?? '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Status</p>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        isResolved ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {STATUS_LABELS[dispute.status ?? ''] ?? dispute.status ?? 'In dispute'}
                    </span>
                    {order?.status ? (
                      <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-black uppercase">
                        Order: {order.status}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Opened</p>
                    <p className="text-sm text-slate-700">{formatDateTime(dispute.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Raised by</p>
                    <p className="text-sm text-slate-700">{dispute.raisedByName ?? '—'}</p>
                  </div>
                  {dispute.reason ? (
                    <div className="col-span-2">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Reason</p>
                      <p className="text-sm text-slate-700">{dispute.reason}</p>
                    </div>
                  ) : null}
                  {isResolved && dispute.adminNote ? (
                    <div className="col-span-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                        Admin note
                      </p>
                      <p className="text-sm text-slate-700">{dispute.adminNote}</p>
                    </div>
                  ) : null}
                </div>
              </section>

              <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-6">Timeline</h3>
                <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {timeline.map((step, idx) => (
                    <div key={idx} className="relative pl-10">
                      <div
                        className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                          step.state === 'completed'
                            ? 'bg-emerald-500'
                            : step.state === 'current'
                              ? 'bg-amber-500'
                              : 'bg-slate-300'
                        }`}
                      >
                        {step.state === 'completed' ? (
                          <CheckCircle2 size={12} className="text-white" />
                        ) : step.state === 'current' ? (
                          <Clock size={12} className="text-white" />
                        ) : (
                          <Circle size={10} className="text-white" />
                        )}
                      </div>
                      <p className="text-sm font-black text-slate-800 leading-tight">{step.title}</p>
                      {step.time ? (
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{step.time}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>

              {order?.documents && order.documents.length > 0 ? (
                <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                  <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-6">Documents</h3>
                  <ul className="space-y-3">
                    {order.documents.map((doc, idx) => (
                      <li key={doc.id ?? idx} className="flex items-center gap-3">
                        <FileText size={16} className="text-slate-400 shrink-0" />
                        <div className="min-w-0">
                          {doc.downloadUrl ? (
                            <a
                              href={doc.downloadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-bold text-blue-600 hover:underline truncate block"
                            >
                              {doc.name ?? 'Document'}
                            </a>
                          ) : (
                            <p className="text-sm font-bold text-slate-700 truncate">{doc.name ?? 'Document'}</p>
                          )}
                          {doc.uploadedBy ? (
                            <p className="text-[10px] font-bold text-slate-400 uppercase">
                              Uploaded by {doc.uploadedBy}
                            </p>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            <div className="space-y-8">
              <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-6">Admin Actions</h3>

                {isResolved ? (
                  <p className="mb-4 text-xs text-slate-500">
                    This dispute is {STATUS_LABELS[dispute.status ?? '']?.toLowerCase() ?? 'closed'}. No further
                    actions are available.
                  </p>
                ) : null}

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleFreeze}
                    disabled={!canFreeze}
                    title={
                      isBookingDispute
                        ? 'Not available for booking disputes'
                        : isFrozen
                          ? 'Order is already frozen'
                          : undefined
                    }
                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl transition-all font-bold text-xs text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-50 disabled:hover:text-slate-600"
                  >
                    <Lock size={16} />{' '}
                    {freezeMutation.isPending ? 'Freezing…' : isFrozen ? 'Funds Frozen' : 'Freeze Funds'}
                  </button>
                  <button
                    type="button"
                    onClick={handleRelease}
                    disabled={!canRelease}
                    title={
                      isBookingDispute
                        ? 'Not available for booking disputes'
                        : isOrderCompleted
                          ? 'Order is already completed'
                          : 'Manual override. Use Resolve Dispute to settle the dispute.'
                    }
                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-xl transition-all font-bold text-xs text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-50 disabled:hover:text-slate-600"
                  >
                    <Unlock size={16} /> {releaseMutation.isPending ? 'Releasing…' : 'Release Funds (Override)'}
                  </button>
                  <button
                    type="button"
                    onClick={openResolveModal}
                    disabled={!canResolve}
                    className="w-full mt-4 py-4 bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-900 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    <Gavel size={16} /> {isResolved ? 'Resolved' : 'Resolve Dispute'}
                  </button>
                </div>
              </section>

              <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-6">Participants</h3>
                {orderQuery.isLoading && hasOrder ? (
                  <div className="h-16 bg-slate-100 rounded animate-pulse" />
                ) : participants.length === 0 ? (
                  <p className="text-xs text-slate-400">No participant details available.</p>
                ) : (
                  <div className="space-y-6">
                    {participants.map((person, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0">
                          {person.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-800 truncate">{person.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{person.role}</p>
                          {person.sub ? (
                            <p className="text-[10px] text-slate-400 truncate">{person.sub}</p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        ) : null}
      </main>

      {resolveOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resolve-dialog-title"
          onClick={closeResolveModal}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 id="resolve-dialog-title" className="text-xl font-black text-slate-800">
                  Resolve dispute
                </h2>
                <p className="text-xs text-slate-400 mt-1">This action settles the escrow and cannot be undone.</p>
              </div>
              <button
                type="button"
                onClick={closeResolveModal}
                disabled={resolveMutation.isPending}
                aria-label="Close"
                className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <fieldset className="space-y-3 mb-6">
              <legend className="sr-only">Resolution</legend>
              {RESOLUTION_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    resolution === option.value
                      ? 'border-blue-600 bg-blue-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="resolution"
                    value={option.value}
                    checked={resolution === option.value}
                    onChange={() => setResolution(option.value)}
                    disabled={resolveMutation.isPending}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm font-bold text-slate-800">{option.title}</span>
                    <span className="block text-xs text-slate-500">{option.description}</span>
                  </span>
                </label>
              ))}
            </fieldset>

            <div className="mb-6">
              <label htmlFor="admin-note" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Resolution note <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="admin-note"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                disabled={resolveMutation.isPending}
                rows={4}
                placeholder="Explain the decision, e.g. what evidence was reviewed."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
              />
            </div>

            {modalError ? (
              <p className="mb-4 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
                {modalError}
              </p>
            ) : null}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeResolveModal}
                disabled={resolveMutation.isPending}
                className="px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResolveSubmit}
                disabled={resolveMutation.isPending}
                className="px-5 py-3 text-sm font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-60"
              >
                {resolveMutation.isPending
                  ? 'Resolving…'
                  : resolution === 'buyer'
                    ? 'Refund buyer'
                    : 'Release to vendor'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DisputeResolutionPage;