import { useState, useEffect, useRef } from 'react';
import { MoreVertical, Pencil, Pause, Ban, Trash2, RotateCcw, X, AlertTriangle, } from 'lucide-react';
import {
  useBanAdminUserMutation,
  useReactivateAdminUserMutation,
  useSuspendAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
} from '@/features/admin/queries';
import { getApiErrorMessage } from '@/lib/api/errors';

interface ActionButtonsProps {
  userId: string;
  accountStatus: string;
}

export const ActionButtons = ({ userId, accountStatus }: ActionButtonsProps) => {
  const [actionError, setActionError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false); 
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const suspendMutation = useSuspendAdminUserMutation();
  const banMutation = useBanAdminUserMutation();
  const reactivateMutation = useReactivateAdminUserMutation();
  const updateMutation = useUpdateAdminUserMutation();
  const deleteMutation = useDeleteAdminUserMutation();

  const isActive = accountStatus === 'Active';
  
  const isBusy =
    suspendMutation.isPending || 
    banMutation.isPending || 
    reactivateMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  useEffect(() => { 
    const handleClickOutside = (event: MouseEvent) => { 
      if ( menuRef.current && !menuRef.current.contains(event.target as Node) ) 
        { setMenuOpen(false); 
      } 
    };

    document.addEventListener('mousedown', handleClickOutside); 
    return () => { document.removeEventListener('mousedown', handleClickOutside); 
    }; 
  }, []);

    const handleSuspend = async () => {
      setActionError(null);
      setMenuOpen(false);
      try {
        await suspendMutation.mutateAsync({ userId });
      } catch (error) {
        setActionError(getApiErrorMessage(error, 'Could not suspend user.'));
      }
    };

  const handleBan = async () => {
    const reason = window.prompt('Reason for ban (optional):') ?? undefined;
    setActionError(null);
    setMenuOpen(false);
    try {
      await banMutation.mutateAsync({ userId, reason: reason?.trim() || undefined });
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not ban user.'));
    }
  };

  const handleReactivate = async () => {
    setActionError(null);
    setMenuOpen(false);
    try {
      await reactivateMutation.mutateAsync(userId);
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not reactivate user.'));
    }
  };

  const handleUpdate = async () => {
    setActionError(null);
    setMenuOpen(false);
    try {
      await updateMutation.mutateAsync(userId);
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not update user.'));
    }
  };

  const handleDelete = async () => {
    setActionError(null);
    setShowDeleteConfirmation(false);
    setMenuOpen(false);
    try {
      await deleteMutation.mutateAsync(userId);
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not delete user.'));
    }
  };

  const handleDeleteClick = () => { 
    setMenuOpen(false); 
    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmation = () => { 
    if (!deleteMutation.isPending) { 
      setShowDeleteConfirmation(false);
    } 
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div ref={menuRef} className="relative">
              <button 
                type="button" 
                  onClick={() => setMenuOpen((previous) => !previous)} 
                  disabled={isBusy} 
                  aria-label="Open user actions" 
                  aria-expanded={menuOpen} 
                  className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50" 
              > 
                <MoreVertical className="h-4 w-4" /> 
              </button>

              {menuOpen && ( 
                <div className="absolute right-0 z-30 mt-1 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                  {isActive ? (
                    <>
                      <button 
                        type="button" 
                        onClick={handleUpdate} 
                        disabled={isBusy} 
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50" 
                      > 
                        <Pencil className="h-4 w-4 text-blue-600" /> 
                        <span>Update</span> 
                      </button>
                      <button 
                        type="button" 
                        onClick={handleSuspend} 
                        disabled={isBusy} 
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50" 
                      > 
                        <Pause className="h-4 w-4 text-amber-600" /> 
                        <span>Suspend</span> 
                      </button>
                      <button 
                        type="button" 
                        onClick={handleBan} 
                        disabled={isBusy} 
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-red-50 disabled:opacity-50" 
                      > 
                        <Ban className="h-4 w-4 text-red-600" /> 
                        <span>Ban</span> 
                      </button>

                      <div className="my-1 border-t border-slate-100" />

                      <button 
                        type="button" 
                        onClick={handleDeleteClick} 
                        disabled={isBusy} 
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50" 
                      > 
                        <Trash2 className="h-4 w-4" /> 
                        <span>Delete</span> 
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        type="button" 
                        onClick={handleReactivate} 
                        disabled={isBusy} 
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-emerald-50 disabled:opacity-50" 
                      > 
                        <RotateCcw className="h-4 w-4 text-emerald-600" /> 
                        <span>Reactivate</span> 
                      </button>

                      <div className="my-1 border-t border-slate-100" />

                      <button 
                        type="button" 
                        onClick={handleDeleteClick} 
                        disabled={isBusy} 
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50" 
                      > 
                        <Trash2 className="h-4 w-4" /> 
                        <span>Delete</span> 
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

        {actionError ? (
          <span className="text-[11px] text-red-600">
            {actionError}
          </span>
          ) : null}
      </div>

      {/* Delete confirmation dialog */} 
      {showDeleteConfirmation && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" 
          role="presentation" 
          onMouseDown={(event) => { 
            if (event.target === event.currentTarget) { 
            closeDeleteConfirmation(); 
          } 
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
              <h2 
                id="delete-user-title" 
                className="text-base font-semibold text-slate-900" 
                > 
                  Delete user? 
              </h2>

              <p 
                id="delete-user-description" 
                className="mt-1 text-sm leading-5 text-slate-600" 
                > 
                  This action may permanently remove this user's account and associated data. This cannot be undone. 
              </p> 
            </div>

            <button 
              type="button" 
              onClick={closeDeleteConfirmation} 
              disabled={deleteMutation.isPending} 
              aria-label="Close confirmation dialog" 
              className="ml-auto shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50" 
              > 
                <X className="h-4 w-4" /> 
              </button> 
            </div>

            {deleteMutation.isError && ( 
              <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"> 
                {getApiErrorMessage( 
                  deleteMutation.error, 
                  'Could not delete user.', 
                )} 
              </div> 
            )}

            <div className="mt-6 flex justify-end gap-3"> 
              <button 
                type="button" 
                onClick={closeDeleteConfirmation} 
                disabled={deleteMutation.isPending} 
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50" 
              > 
                Cancel 
              </button>

              <button 
                type="button" 
                onClick={handleDelete} 
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
        )} 
    </>
  );
};
