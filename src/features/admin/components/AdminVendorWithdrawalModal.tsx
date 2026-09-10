import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { X, CreditCard, Landmark, FileText, Check, PauseCircle, Ban } from 'lucide-react';
import {
  useApproveAdminWithdrawalMutation,
  useHoldAdminWithdrawalMutation,
  useRejectAdminWithdrawalMutation,
} from '@/features/admin/queries';
import type { AdminWithdrawalListItem } from '@/features/admin/types';
import {
  avatarColorClass,
  formatAdminAmount,
  formatAdminDate,
  getInitials,
  titleCaseStatus,
} from '@/features/admin/utils';
import { getApiErrorMessage } from '@/lib/api/errors';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AdminWithdrawalListItem | null;
}

type ActiveAction = 'approve' | 'hold' | 'reject' | null;

const WithdrawalModal = ({ isOpen, onClose, data }: WithdrawalModalProps) => {
  const [actionError, setActionError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<ActiveAction>(null);
  const [reasonInput, setReasonInput] = useState('');
  const [isApproved, setIsApproved] = useState(false);

  const approveMutation = useApproveAdminWithdrawalMutation();
  const holdMutation = useHoldAdminWithdrawalMutation();
  const rejectMutation = useRejectAdminWithdrawalMutation();

  useEffect(() => {
    setActionError(null);
    setActiveAction(null);
    setReasonInput('');
    setIsApproved(false);
  }, [data?.id]);

  if (!isOpen || !data) return null;

  const vendorName = data.vendorName ?? 'Vendor';
  const color = avatarColorClass(vendorName);
  const statusLabel = titleCaseStatus(data.status);
  const isBusy = approveMutation.isPending || holdMutation.isPending || rejectMutation.isPending;
  const isLocked = isBusy || isApproved;

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const openAction = (action: ActiveAction) => {
    setActionError(null);
    setReasonInput('');
    setActiveAction(action);
  };

  const cancelAction = () => {
    setActionError(null);
    setReasonInput('');
    setActiveAction(null);
  };

  const handleApprove = async () => {
    setActionError(null);
    try {
      await approveMutation.mutateAsync(data.id);
      setIsApproved(true);
      setActiveAction(null);
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not approve withdrawal.'));
    }
  };

  const handleHold = async () => {
    setActionError(null);
    try {
      await holdMutation.mutateAsync({ withdrawalId: data.id, reason: reasonInput.trim() || undefined });
      onClose();
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not put withdrawal on hold.'));
    }
  };

  const handleReject = async () => {
    setActionError(null);
    try {
      await rejectMutation.mutateAsync({ withdrawalId: data.id, reason: reasonInput.trim() || undefined });
      onClose();
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not reject withdrawal.'));
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-lg my-6 sm:my-0 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[calc(100vh-3rem)] flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-10"
        >
          <X size={20} />
        </button>

        <div className="p-5 sm:p-8 overflow-y-auto">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-8 sm:mb-10 pr-9 sm:pr-10">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full flex items-center justify-center text-base sm:text-lg font-bold border ${color}`}
              >
                {getInitials(vendorName)}
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-black text-slate-800 leading-tight truncate">
                  {vendorName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-medium truncate">
                  {data.vendorEmail ?? '—'}
                </p>
              </div>
            </div>
            <span className="shrink-0 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-wider border border-emerald-100">
              {isApproved ? 'Approved' : statusLabel}
            </span>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={14} className="text-slate-300 shrink-0" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Withdrawal Amount
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight break-words">
                {formatAdminAmount(data.amount, data.currency)}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Landmark size={14} className="text-slate-300 shrink-0" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Bank Details</span>
              </div>
              <div className="grid grid-cols-1 gap-4 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Bank Name</p>
                  <p className="text-sm font-bold text-slate-700 break-words">{data.bankName ?? '—'}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText size={14} className="text-slate-300 shrink-0" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Request Information
                </span>
              </div>
              <div className="space-y-4 px-1">
                <div className="flex flex-wrap justify-between items-center gap-x-3 gap-y-1 py-2 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Request Date</span>
                  <span className="text-sm font-semibold text-slate-700">{formatAdminDate(data.requestedAt)}</span>
                </div>
                <div className="flex flex-wrap justify-between items-center gap-x-3 gap-y-1 py-2 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Request ID</span>
                  <span className="text-sm font-semibold text-slate-700 break-all">{data.id}</span>
                </div>
              </div>
            </div>
          </div>

          {actionError ? (
            <p className="mt-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
              {actionError}
            </p>
          ) : null}

          <div className="mt-10 sm:mt-12 space-y-3 sm:space-y-4">
            {activeAction === 'approve' ? (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 space-y-3">
                <p className="text-sm text-center text-slate-600 font-medium">
                  Approve this {formatAdminAmount(data.amount, data.currency)} withdrawal for {vendorName}?
                  This can't be undone.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={cancelAction}
                    disabled={isBusy}
                    className="py-3 px-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl transition-all disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={isBusy}
                    className="flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-60"
                  >
                    <Check size={16} strokeWidth={3} />
                    {approveMutation.isPending ? 'Approving…' : 'Confirm Approve'}
                  </button>
                </div>
              </div>
            ) : activeAction === 'hold' || activeAction === 'reject' ? (
              <div
                className={`rounded-xl border p-4 space-y-3 ${
                  activeAction === 'hold' ? 'border-blue-100 bg-blue-50/60' : 'border-rose-100 bg-rose-50/60'
                }`}
              >
                <p className="text-sm text-slate-600 font-medium">
                  {activeAction === 'hold'
                    ? `Put this withdrawal on hold${vendorName ? ` for ${vendorName}` : ''}?`
                    : `Reject this withdrawal${vendorName ? ` for ${vendorName}` : ''}? This can't be undone.`}
                </p>
                <textarea
                  value={reasonInput}
                  onChange={(event) => setReasonInput(event.target.value)}
                  placeholder="Reason (optional)"
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 resize-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={cancelAction}
                    disabled={isBusy}
                    className="py-3 px-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl transition-all disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  {activeAction === 'hold' ? (
                    <button
                      type="button"
                      onClick={handleHold}
                      disabled={isBusy}
                      className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-60"
                    >
                      <PauseCircle size={16} />
                      {holdMutation.isPending ? 'Holding…' : 'Confirm Hold'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleReject}
                      disabled={isBusy}
                      className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-rose-500/20 transition-all active:scale-[0.98] disabled:opacity-60"
                    >
                      <Ban size={16} />
                      {rejectMutation.isPending ? 'Rejecting…' : 'Confirm Reject'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openAction('approve')}
                  disabled={isLocked}
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Check size={18} strokeWidth={3} />
                  {isApproved ? 'Approved' : 'Approve Withdrawal'}
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => openAction('hold')}
                    disabled={isLocked}
                    className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <PauseCircle size={16} />
                    Put on Hold
                  </button>
                  <button
                    type="button"
                    onClick={() => openAction('reject')}
                    disabled={isLocked}
                    className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-black uppercase tracking-widest text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Ban size={16} />
                    Reject Withdrawal
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalModal;