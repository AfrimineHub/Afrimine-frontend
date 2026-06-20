import { useState } from 'react';
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

const WithdrawalModal = ({ isOpen, onClose, data }: WithdrawalModalProps) => {
  const [actionError, setActionError] = useState<string | null>(null);
  const approveMutation = useApproveAdminWithdrawalMutation();
  const holdMutation = useHoldAdminWithdrawalMutation();
  const rejectMutation = useRejectAdminWithdrawalMutation();

  if (!isOpen || !data) return null;

  const vendorName = data.vendorName ?? 'Vendor';
  const color = avatarColorClass(vendorName);
  const statusLabel = titleCaseStatus(data.status);
  const isBusy = approveMutation.isPending || holdMutation.isPending || rejectMutation.isPending;

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handleApprove = async () => {
    setActionError(null);
    try {
      await approveMutation.mutateAsync(data.id);
      onClose();
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not approve withdrawal.'));
    }
  };

  const handleHold = async () => {
    const reason = window.prompt('Reason for hold (optional):') ?? undefined;
    setActionError(null);
    try {
      await holdMutation.mutateAsync({ withdrawalId: data.id, reason: reason?.trim() || undefined });
      onClose();
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not put withdrawal on hold.'));
    }
  };

  const handleReject = async () => {
    const reason = window.prompt('Reason for rejection (optional):') ?? undefined;
    setActionError(null);
    try {
      await rejectMutation.mutateAsync({ withdrawalId: data.id, reason: reason?.trim() || undefined });
      onClose();
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not reject withdrawal.'));
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex items-center justify-between mb-10 pr-10">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border ${color}`}
              >
                {getInitials(vendorName)}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 leading-tight">{vendorName}</h3>
                <p className="text-sm text-slate-400 font-medium">{data.vendorEmail ?? '—'}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-wider border border-emerald-100">
              {statusLabel}
            </span>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={14} className="text-slate-300" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Withdrawal Amount
                </span>
              </div>
              <p className="text-3xl font-black text-slate-800 tracking-tight">
                {formatAdminAmount(data.amount, data.currency)}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Landmark size={14} className="text-slate-300" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Bank Details</span>
              </div>
              <div className="grid grid-cols-1 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Bank Name</p>
                  <p className="text-sm font-bold text-slate-700">{data.bankName ?? '—'}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText size={14} className="text-slate-300" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Request Information
                </span>
              </div>
              <div className="space-y-4 px-1">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Request Date</span>
                  <span className="text-sm font-semibold text-slate-700">{formatAdminDate(data.requestedAt)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Request ID</span>
                  <span className="text-sm font-semibold text-slate-700">{data.id}</span>
                </div>
              </div>
            </div>
          </div>

          {actionError ? (
            <p className="mt-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
              {actionError}
            </p>
          ) : null}

          <div className="mt-12 space-y-4">
            <button
              type="button"
              onClick={handleApprove}
              disabled={isBusy}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              <Check size={18} strokeWidth={3} />
              {approveMutation.isPending ? 'Approving…' : 'Approve Withdrawal'}
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleHold}
                disabled={isBusy}
                className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-60"
              >
                <PauseCircle size={16} />
                Put on Hold
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={isBusy}
                className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-black uppercase tracking-widest text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-60"
              >
                <Ban size={16} />
                Reject Withdrawal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalModal;
