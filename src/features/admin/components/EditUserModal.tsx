import { useState } from 'react';
import { X } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/api/errors';
import {
  ACCOUNT_STATUS_OPTIONS,
  ROLE_OPTIONS,
  getAccountStatusNumber,
  getRoleNumber,
} from '@/features/admin/utils/userAccountMapping';
import type { AdminUserListItem, UpdateAdminUserPayload } from '../types';
import type { useUpdateAdminUserMutation } from '@/features/admin/queries';

interface EditUserModalProps {
  user: AdminUserListItem;
  isOpen: boolean;
  onClose: () => void;
  updateMutation: ReturnType<typeof useUpdateAdminUserMutation>;
}

export const EditUserModal = ({ user, isOpen, onClose, updateMutation }: EditUserModalProps) => {
  const [fullName, setFullName] = useState(user.fullName ?? '');
  const [email, setEmail] = useState(user.email ?? '');
  const [role, setRole] = useState<number | ''>(getRoleNumber(user.role) ?? '');
  const [accountStatus, setAccountStatus] = useState<number | ''>(
    getAccountStatusNumber(user.accountStatus) ?? '',
  );
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    if (!updateMutation.isPending) {
      onClose();
    }
  };

  const handleSave = async () => {
    setError(null);

    const payload: UpdateAdminUserPayload = {};

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();

    if (trimmedFullName && trimmedFullName !== (user.fullName ?? '')) {
      payload.fullName = trimmedFullName;
    }

    if (trimmedEmail && trimmedEmail !== (user.email ?? '')) {
      payload.email = trimmedEmail;
    }

    if (role !== '' && role !== getRoleNumber(user.role)) {
      payload.role = role;
    }

    if (accountStatus !== '' && accountStatus !== getAccountStatusNumber(user.accountStatus)) {
      payload.accountStatus = accountStatus;
    }

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    try {
      await updateMutation.mutateAsync({ userId: user.id, payload });
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not update user.'));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-user-title"
    >
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="edit-user-title" className="text-base font-semibold text-slate-900">
              Update User
            </h2>
            <p className="mt-1 text-xs text-slate-500">Update this user's account details.</p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={updateMutation.isPending}
            aria-label="Close update dialog"
            className="cursor-pointer rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div>
            <label htmlFor={`full-name-${user.id}`} className="mb-1.5 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              id={`full-name-${user.id}`}
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              disabled={updateMutation.isPending}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label htmlFor={`email-${user.id}`} className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id={`email-${user.id}`}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={updateMutation.isPending}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label htmlFor={`role-${user.id}`} className="mb-1.5 block text-sm font-medium text-slate-700">
              Role
            </label>
            <select
              id={`role-${user.id}`}
              value={role}
              onChange={(event) => setRole(event.target.value === '' ? '' : Number(event.target.value))}
              disabled={updateMutation.isPending}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:bg-slate-50"
            >
              <option value="">No change</option>
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`account-status-${user.id}`} className="mb-1.5 block text-sm font-medium text-slate-700">
              Account Status
            </label>
            <select
              id={`account-status-${user.id}`}
              value={accountStatus}
              onChange={(event) => setAccountStatus(event.target.value === '' ? '' : Number(event.target.value))}
              disabled={updateMutation.isPending}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:bg-slate-50"
            >
              <option value="">No change</option>
              {ACCOUNT_STATUS_OPTIONS.map((option, index) => (
                <option key={option.value} value={index}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={updateMutation.isPending}
            className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="cursor-pointer rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};