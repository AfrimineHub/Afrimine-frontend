import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  Gavel,
  ArrowLeft,
} from 'lucide-react';
import {
  useAdminDisputeQuery,
  useFreezeAdminOrderMutation,
  useReleaseAdminOrderFundsMutation,
  useResolveAdminDisputeMutation,
} from '@/features/escrow/queries';
import { formatBuyerAmount } from '@/features/buyer/dashboardUtils';
import { getApiErrorMessage } from '@/lib/api/errors';

const DisputeResolutionPage = () => {
  const { disputeId } = useParams<{ disputeId: string }>();
  const navigate = useNavigate();
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const disputeQuery = useAdminDisputeQuery(disputeId);
  const freezeMutation = useFreezeAdminOrderMutation();
  const releaseMutation = useReleaseAdminOrderFundsMutation();
  const resolveMutation = useResolveAdminDisputeMutation();

  const dispute = disputeQuery.data;

  const loadError =
    disputeQuery.isError &&
    getApiErrorMessage(disputeQuery.error, 'Could not load dispute details.');

  const handleFreeze = async () => {
    if (!dispute?.orderId) return;
    setActionError(null);
    setActionSuccess(null);
    try {
      await freezeMutation.mutateAsync({ orderId: dispute.orderId });
      setActionSuccess('Order funds have been frozen.');
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not freeze funds.'));
    }
  };

  const handleRelease = async () => {
    if (!dispute?.orderId) return;
    const confirmed = window.confirm('Release escrow funds to the vendor?');
    if (!confirmed) return;

    setActionError(null);
    setActionSuccess(null);
    try {
      await releaseMutation.mutateAsync({ orderId: dispute.orderId });
      setActionSuccess('Funds released to the vendor.');
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not release funds.'));
    }
  };

  const handleArbitrate = async () => {
    if (!disputeId) return;
    const notes = window.prompt('Arbitration notes (optional):') ?? undefined;
    setActionError(null);
    setActionSuccess(null);
    try {
      await resolveMutation.mutateAsync({
        disputeId,
        resolution: 'release',
        notes: notes?.trim() || undefined,
      });
      setActionSuccess('Dispute resolved via arbitration.');
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not resolve dispute.'));
    }
  };

  const participants = dispute
    ? [
        { name: dispute.buyerName ?? 'Buyer', role: 'Buyer', initials: 'BY' },
        { name: dispute.vendorName ?? 'Vendor', role: 'Vendor', initials: 'VN' },
        { name: 'Afrimine Admin', role: 'Moderator', initials: 'AA' },
      ]
    : [];

  const timeline = [
    {
      title: 'Dispute Opened',
      time: dispute?.openedAt
        ? new Date(dispute.openedAt).toLocaleString()
        : 'Pending',
      status: 'completed' as const,
    },
    {
      title: dispute?.status ?? 'Awaiting Admin Review',
      time: 'Current status',
      status: 'active' as const,
    },
  ];

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
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Order ID</p>
                    <button
                      type="button"
                      onClick={() => navigate(`/my-order/${dispute.orderId}`)}
                      className="text-sm font-bold text-slate-700 hover:text-blue-600"
                    >
                      {dispute.orderId}
                    </button>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Status</p>
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded text-[10px] font-black uppercase">
                      {dispute.status ?? 'In dispute'}
                    </span>
                  </div>
                  {dispute.reason ? (
                    <div className="col-span-2">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Reason</p>
                      <p className="text-sm text-slate-700">{dispute.reason}</p>
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
                          step.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      >
                        {step.status === 'completed' ? (
                          <CheckCircle2 size={12} className="text-white" />
                        ) : (
                          <Clock size={12} className="text-white" />
                        )}
                      </div>
                      <p className="text-sm font-black text-slate-800 leading-tight">{step.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{step.time}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-6">Admin Actions</h3>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleFreeze}
                    disabled={freezeMutation.isPending}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl transition-all font-bold text-xs text-left disabled:opacity-60"
                  >
                    <Lock size={16} /> {freezeMutation.isPending ? 'Freezing…' : 'Freeze Funds'}
                  </button>
                  <button
                    type="button"
                    onClick={handleRelease}
                    disabled={releaseMutation.isPending}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-xl transition-all font-bold text-xs text-left disabled:opacity-60"
                  >
                    <Unlock size={16} /> {releaseMutation.isPending ? 'Releasing…' : 'Release Funds'}
                  </button>
                  <button
                    type="button"
                    onClick={handleArbitrate}
                    disabled={resolveMutation.isPending}
                    className="w-full mt-4 py-4 bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-900 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <Gavel size={16} /> {resolveMutation.isPending ? 'Resolving…' : 'Resolve Dispute'}
                  </button>
                </div>
              </section>

              <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-6">Participants</h3>
                <div className="space-y-6">
                  {participants.map((person, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                        {person.initials}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800">{person.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{person.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default DisputeResolutionPage;
