import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash2, View, EyeOff, Loader2 } from 'lucide-react';
import { useDeleteListingMutation } from '@/features/listings/queries';
import { LISTING_PLACEHOLDER_IMAGE } from '@/features/listings/utils';
import { getApiErrorMessage } from '@/lib/api/errors';

interface AdItemProps {
  id: string;
  image: string;
  title: string;
  category: string;
  status: 'Active' | 'Pending' | 'Rejected';
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
  price,
  stats,
  date,
}: AdItemProps) => {
  const navigate = useNavigate();
  const deleteMutation = useDeleteListingMutation();
  const [showActions, setShowActions] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState(image);

  useEffect(() => {
    setImageSrc(image);
  }, [image]);

  const toggleActions = () => setShowActions(!showActions);

  const statusStyles = {
    Active: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Rejected: 'bg-red-100 text-red-700',
  };

  const handleEdit = () => {
    setActionError(null);
    navigate(`/my-ad/${id}/edit`);
  };

  const handleView = () => {
    setActionError(null);
    navigate(`/my-ad/${id}`);
  };

  const handleDelete = async () => {
    setActionError(null);
    const confirmed = window.confirm(
      `Delete "${title}"? This will archive the listing and remove it from your active ads.`,
    );
    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(id);
      setShowActions(false);
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not delete listing. Try again.'));
    }
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
      {/* Listing Column */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <img
            src={imageSrc}
            alt={title}
            className="w-12 h-10 rounded-lg object-cover bg-gray-100"
            onError={() => setImageSrc(LISTING_PLACEHOLDER_IMAGE)}
          />
          <span className="text-sm font-semibold text-slate-800 max-w-[150px] leading-tight">
            {title}
          </span>
        </div>
      </td>

      {/* Status Column */}
      <td className="py-4 px-4">
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${statusStyles[status]}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}
          />
          {status}
        </span>
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
                <button
                  type="button"
                  onClick={handleEdit}
                  className="p-1 hover:text-yellow-600 transition-colors cursor-pointer"
                  title="Edit listing"
                  disabled={deleteMutation.isPending}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete()}
                  className="p-1 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                  title="Delete listing"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
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
                  disabled={deleteMutation.isPending}
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
  );
};
