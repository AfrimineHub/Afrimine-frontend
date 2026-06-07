import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash2, View, EyeOff, Loader2, Send } from 'lucide-react';
import { useDeleteListingMutation, usePublishListingMutation } from '@/features/listings/queries';
import { LISTING_PLACEHOLDER_IMAGE } from '@/features/listings/utils';
import { getApiErrorMessage } from '@/lib/api/errors';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';

type PendingConfirmAction = 'publish' | 'delete' | null;

interface AdItemProps {
  id: string;
  image: string;
  title: string;
  category: string;
  status: 'Active' | 'Draft' | 'Pending' | 'Rejected';
  isDraft: boolean;
  price: string;
  stats: { views: number; inquiries: number };
  date: string;
}

export const AdListItem = ({
  id,
  image,
  title,
  category,
  status,
  isDraft,
  price,
  stats,
  date,
}: AdItemProps) => {
  const navigate = useNavigate();
  const deleteMutation = useDeleteListingMutation();
  const publishMutation = usePublishListingMutation();
  const [showActions, setShowActions] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingConfirmAction>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState(image);

  useEffect(() => {
    setImageSrc(image);
  }, [image]);

  const toggleActions = () => setShowActions(!showActions);

  const statusStyles = {
    Active: 'bg-green-100 text-green-700',
    Draft: 'bg-slate-100 text-slate-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Rejected: 'bg-red-100 text-red-700',
  };

  const isActionPending = deleteMutation.isPending || publishMutation.isPending;

  const handleEdit = () => {
    setActionError(null);
    navigate(`/my-ad/${id}/edit`);
  };

  const handleView = () => {
    setActionError(null);
    navigate(`/my-ad/${id}`);
  };

  const closeConfirmDialog = () => {
    if (!isActionPending) setPendingAction(null);
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;
    setActionError(null);

    try {
      if (pendingAction === 'publish') {
        await publishMutation.mutateAsync(id);
        setShowActions(false);
        setPendingAction(null);
        navigate('/my-ad', { state: { listingPublished: true } });
        return;
      }

      await deleteMutation.mutateAsync(id);
      setShowActions(false);
      setPendingAction(null);
    } catch (error) {
      const fallback =
        pendingAction === 'publish'
          ? 'Could not submit listing for review. Try again.'
          : 'Could not delete listing. Try again.';
      setActionError(getApiErrorMessage(error, fallback));
      setPendingAction(null);
    }
  };

  const confirmDialogConfig =
    pendingAction === 'publish'
      ? {
          title: 'Submit for review?',
          description: `"${title}" will be sent to the Afrimine team for review before it goes live on the marketplace.`,
          confirmLabel: 'Submit for review',
          variant: 'primary' as const,
        }
      : pendingAction === 'delete'
        ? {
            title: 'Delete listing?',
            description: `"${title}" will be archived and removed from your active ads. This action cannot be undone.`,
            confirmLabel: 'Delete listing',
            variant: 'danger' as const,
          }
        : null;

  const statusBadge = (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 w-fit ${statusStyles[status]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'Active'
            ? 'bg-green-500'
            : status === 'Draft'
              ? 'bg-slate-500'
              : 'bg-yellow-500'
        }`}
      />
      {status}
    </span>
  );

  return (
    <>
    <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
      {/* Listing Column */}
      <td className="py-4 pl-3 pr-5 sm:px-4 min-w-[10.5rem]">
        <div className="flex flex-col gap-3 sm:gap-0">
          <div className="flex items-center gap-3.5 sm:gap-3">
            <img
              src={imageSrc}
              alt={title}
              className="w-11 h-9 sm:w-12 sm:h-10 shrink-0 rounded-lg object-cover bg-gray-100"
              onError={() => setImageSrc(LISTING_PLACEHOLDER_IMAGE)}
            />
            <span className="text-sm font-semibold text-slate-800 max-w-[150px] leading-tight">
              {title}
            </span>
          </div>
          <div className="sm:hidden">{statusBadge}</div>
        </div>
      </td>

      {/* Status Column */}
      <td className="hidden sm:table-cell py-4 px-4 min-w-[5.5rem]">
        {statusBadge}
      </td>

      {/* Category Column */}
      <td className="py-4 px-4 text-sm text-gray-500">{category}</td>

      {/* Price Column */}
      <td className="py-4 px-4 text-sm font-bold text-slate-900">{price}</td>

      {/* Performance Column */}
      <td className="py-4 px-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="font-medium">{stats.views} views</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span>{stats.inquiries} inquiries</span>
          </div>
        </div>
      </td>

      {/* Date Created Column */}
      <td className="py-4 px-4 text-sm text-gray-500">{date}</td>

      {/* Actions Column */}
      <td className="py-4 px-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-400">
            <button
              type="button"
              onClick={toggleActions}
              className="p-1 hover:text-blue-600 transition-colors cursor-pointer"
              title={showActions ? 'Hide actions' : 'Show actions'}
              aria-expanded={showActions}
            >
              {showActions ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>

            {showActions && (
              <>
                {isDraft ? (
                  <button
                    type="button"
                    onClick={() => setPendingAction('publish')}
                    className="p-1 hover:text-emerald-600 transition-colors cursor-pointer disabled:opacity-50"
                    title="Submit for review"
                    disabled={isActionPending}
                  >
                    {publishMutation.isPending && publishMutation.variables === id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={handleEdit}
                  className="p-1 hover:text-yellow-600 transition-colors cursor-pointer"
                  title="Edit listing"
                  disabled={isActionPending}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setPendingAction('delete')}
                  className="p-1 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                  title="Delete listing"
                  disabled={isActionPending}
                >
                  {deleteMutation.isPending && deleteMutation.variables === id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleView}
                  className="p-1 hover:text-blue-600 transition-colors cursor-pointer"
                  title="View listing"
                  disabled={isActionPending}
                >
                  <View size={16} />
                </button>
              </>
            )}
          </div>
          {actionError ? <p className="text-[10px] text-red-500 max-w-[140px]">{actionError}</p> : null}
        </div>
      </td>
    </tr>

    {confirmDialogConfig ? (
      <ConfirmDialog
        isOpen
        title={confirmDialogConfig.title}
        description={confirmDialogConfig.description}
        confirmLabel={confirmDialogConfig.confirmLabel}
        variant={confirmDialogConfig.variant}
        isLoading={isActionPending}
        onClose={closeConfirmDialog}
        onConfirm={() => void handleConfirmAction()}
      />
    ) : null}
    </>
  );
};
