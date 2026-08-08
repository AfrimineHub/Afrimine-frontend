import { useState } from 'react';
import {
  useBanAdminUserMutation,
  useReactivateAdminUserMutation,
  useSuspendAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
} from '@/features/admin/queries';
import { getApiErrorMessage } from '@/lib/api/errors';
import type { AdminUserListItem } from '../types';
import { UserActionMenu } from './UserActionMenu';
import { EditUserModal } from './EditUserModal';
import { BanUserModal } from './BanUserModal';
import { DeleteUserModal } from './DeleteUserModal';

interface ActionButtonsProps {
  user: AdminUserListItem;
}

type ActiveModal = 'edit' | 'ban' | 'delete' | null;

export const ActionButtons = ({ user }: ActionButtonsProps) => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const suspendMutation = useSuspendAdminUserMutation();
  const banMutation = useBanAdminUserMutation();
  const reactivateMutation = useReactivateAdminUserMutation();
  const updateMutation = useUpdateAdminUserMutation();
  const deleteMutation = useDeleteAdminUserMutation();

  const isBusy =
    suspendMutation.isPending ||
    banMutation.isPending ||
    reactivateMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const isActive = user.accountStatus?.toLowerCase() === 'active';

  const closeModal = () => setActiveModal(null);

  const handleSuspend = async () => {
    setActionError(null);
    try {
      await suspendMutation.mutateAsync({ userId: user.id });
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not suspend user.'));
    }
  };

  const handleReactivate = async () => {
    setActionError(null);
    try {
      await reactivateMutation.mutateAsync(user.id);
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not reactivate user.'));
    }
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <UserActionMenu
            isActive={isActive}
            isBusy={isBusy}
            onEdit={() => setActiveModal('edit')}
            onSuspend={handleSuspend}
            onBan={() => setActiveModal('ban')}
            onReactivate={handleReactivate}
            onDelete={() => setActiveModal('delete')}
          />
        </div>

        {actionError ? <span className="text-[11px] text-red-600">{actionError}</span> : null}
      </div>

      <EditUserModal
        user={user}
        isOpen={activeModal === 'edit'}
        onClose={closeModal}
        updateMutation={updateMutation}
      />

      <BanUserModal
        user={user}
        isOpen={activeModal === 'ban'}
        onClose={closeModal}
        banMutation={banMutation}
      />

      <DeleteUserModal
        user={user}
        isOpen={activeModal === 'delete'}
        onClose={closeModal}
        deleteMutation={deleteMutation}
      />
    </>
  );
};