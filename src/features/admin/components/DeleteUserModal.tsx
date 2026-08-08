import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/api/errors';
import type { AdminUserListItem } from '../types';
import type { useDeleteAdminUserMutation } from '@/features/admin/queries';

interface DeleteUserModalProps {
  user: AdminUserListItem;
  isOpen: boolean;
  onClose: () => void;
  deleteMutation: ReturnType<typeof useDeleteAdminUserMutation>;
}

export const DeleteUserModal = ({ user, isOpen, onClose, deleteMutation }: DeleteUserModalProps) => {
  if (!isOpen) return null;

  const handleClose = () => {
    if (!deleteMutation.isPending) onClose();
  };

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(user.id);
      onClose();
    } catch {
      // surfaced below via deleteMutation.isError
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
        aria-labelledby="delete-user-title"
        aria-describedby="delete-user-description"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>

          <div className="min-w-0">
            <h2 id="delete-user-title" className="text-base font-semibold text-slate-900">
              Delete user?
            </h2>
            <p id="delete-user-description" className="mt-1 text-sm leading-5 text-slate-600">
              This action may permanently remove this user's account and associated data. This
              cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={deleteMutation.isPending}
            aria-label="Close confirmation dialog"
            className="ml-auto shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {deleteMutation.isError && (
          <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {getApiErrorMessage(deleteMutation.error, 'Could not delete user.')}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={deleteMutation.isPending}
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleteMutation.isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};