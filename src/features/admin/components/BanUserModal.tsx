import { useState } from 'react';
import { Ban, X } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/api/errors';
import type { AdminUserListItem } from '../types';
import type { useBanAdminUserMutation } from '@/features/admin/queries';

interface BanUserModalProps {
  user: AdminUserListItem;
  isOpen: boolean;
  onClose: () => void;
  banMutation: ReturnType<typeof useBanAdminUserMutation>;
}

export const BanUserModal = ({ user, isOpen, onClose, banMutation }: BanUserModalProps) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    if (!banMutation.isPending) {
      setReason('');
      onClose();
    }
  };

  const handleConfirm = async () => {
    try {
      await banMutation.mutateAsync({ userId: user.id, reason: reason.trim() || undefined });
      setReason('');
      onClose();
    } catch {
      // surfaced below via banMutation.isError
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ban-user-title"
        aria-describedby="ban-user-description"
        className="w-full max-w-md rounded-xl bg-white shadow-xl"
      >
        <div className="flex items-start gap-4 px-6 pt-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <Ban className="h-5 w-5 text-red-600" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 id="ban-user-title" className="text-base font-semibold text-slate-900">
              Ban {user.fullName?.trim() || 'this user'}?
            </h2>
            <p id="ban-user-description" className="mt-1 text-sm leading-5 text-slate-600">
              This permanently blocks the user from accessing the platform. You can add a reason
              below — the user won't be shown this, but it's kept on the account for reference.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={banMutation.isPending}
            aria-label="Close ban dialog"
            className="ml-auto shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 pt-4">
          <label htmlFor={`ban-reason-${user.id}`} className="mb-1.5 block text-sm font-medium text-slate-700">
            Reason <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            id={`ban-reason-${user.id}`}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            disabled={banMutation.isPending}
            rows={3}
            placeholder="e.g. Repeated policy violations, fraudulent listings..."
            className="w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:bg-slate-50"
          />
        </div>

        {banMutation.isError && (
          <div className="mx-6 mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {getApiErrorMessage(banMutation.error, 'Could not ban user.')}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={banMutation.isPending}
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={banMutation.isPending}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {banMutation.isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Banning...
              </>
            ) : (
              <>
                <Ban className="h-4 w-4" />
                Ban User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};