import { useState } from 'react';
import {
  useBanAdminUserMutation,
  useReactivateAdminUserMutation,
  useSuspendAdminUserMutation,
} from '@/features/admin/queries';
import { getApiErrorMessage } from '@/lib/api/errors';

interface ActionButtonsProps {
  userId: string;
  accountStatus: string;
}

export const ActionButtons = ({ userId, accountStatus }: ActionButtonsProps) => {
  const [actionError, setActionError] = useState<string | null>(null);
  const suspendMutation = useSuspendAdminUserMutation();
  const banMutation = useBanAdminUserMutation();
  const reactivateMutation = useReactivateAdminUserMutation();

  const isActive = accountStatus === 'Active';
  const isBusy =
    suspendMutation.isPending || banMutation.isPending || reactivateMutation.isPending;

  const handleSuspend = async () => {
    setActionError(null);
    try {
      await suspendMutation.mutateAsync({ userId });
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not suspend user.'));
    }
  };

  const handleBan = async () => {
    const reason = window.prompt('Reason for ban (optional):') ?? undefined;
    setActionError(null);
    try {
      await banMutation.mutateAsync({ userId, reason: reason?.trim() || undefined });
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not ban user.'));
    }
  };

  const handleReactivate = async () => {
    setActionError(null);
    try {
      await reactivateMutation.mutateAsync(userId);
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not reactivate user.'));
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        {isActive ? (
          <>
            <button
              type="button"
              onClick={handleSuspend}
              disabled={isBusy}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              Suspend
            </button>
            <button
              type="button"
              onClick={handleBan}
              disabled={isBusy}
              className="bg-[#EF4444] hover:bg-red-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wide transition-colors disabled:opacity-50"
            >
              Ban
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleReactivate}
            disabled={isBusy}
            className="bg-[#1E293B] hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wide transition-colors disabled:opacity-50"
          >
            Reactivate
          </button>
        )}
      </div>
      {actionError ? <span className="text-[11px] text-red-600">{actionError}</span> : null}
    </div>
  );
};
