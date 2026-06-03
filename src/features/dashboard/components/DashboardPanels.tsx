import { Link } from 'react-router-dom';
import { formatRelativeTime } from '@/lib/utils/formatRelativeTime';
import type { DashboardNotification } from '@/features/dashboard/types';

const PLACEHOLDER_IMAGE = '/images/listings/gold-ore.png';

interface NotificationFeedProps {
  title?: string;
  notifications?: DashboardNotification[];
  isLoading?: boolean;
  errorMessage?: string;
  limit?: number;
  seeAllPath?: string;
}

export function NotificationFeed({
  title = 'Latest notifications',
  notifications = [],
  isLoading,
  errorMessage,
  limit = 5,
  seeAllPath = '/notification',
}: NotificationFeedProps) {
  const items = notifications.slice(0, limit);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900">{title}</h3>
        <Link
          to={seeAllPath}
          className="text-xs font-bold text-yellow-600 hover:text-yellow-700 uppercase tracking-wider"
        >
          See all →
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">No notifications yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((notification) => {
            const heading = notification.title?.trim() || 'Notification';
            const body = notification.message?.trim();
            return (
              <div
                key={notification.id}
                className="flex justify-between items-start gap-3 py-2 border-b border-gray-50 last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-sm text-gray-700 font-medium break-words">
                    {body ? `${heading}: ${body}` : heading}
                  </p>
                  {!notification.isRead ? (
                    <span className="text-[10px] font-bold text-yellow-600 uppercase">New</span>
                  ) : null}
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {formatRelativeTime(notification.createdAt)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface SavedListingsPanelProps {
  title?: string;
  items?: { savedId: string; title: string; subtitle?: string; imageUrl?: string | null }[];
  isLoading?: boolean;
  errorMessage?: string;
  limit?: number;
  seeAllPath?: string;
}

export function SavedListingsPanel({
  title = 'My saved listings',
  items = [],
  isLoading,
  errorMessage,
  limit = 5,
  seeAllPath = '/marketplace',
}: SavedListingsPanelProps) {
  const visible = items.slice(0, limit);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900">{title}</h3>
        <Link
          to={seeAllPath}
          className="text-xs font-bold text-yellow-600 hover:text-yellow-700 uppercase tracking-wider"
        >
          See all →
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-gray-500">You have not saved any listings yet.</p>
      ) : (
        <div className="space-y-4">
          {visible.map((item) => (
            <div
              key={item.savedId}
              className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
            >
              <img
                src={item.imageUrl ?? PLACEHOLDER_IMAGE}
                alt=""
                className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                {item.subtitle ? (
                  <p className="text-xs text-gray-400 truncate">{item.subtitle}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface RecommendedListingsGridProps {
  title?: string;
  listings?: {
    id: string;
    title: string;
    location: string;
    imageUrl?: string | null;
  }[];
  isLoading?: boolean;
  errorMessage?: string;
  seeAllPath?: string;
}

export function RecommendedListingsGrid({
  title = 'Recommended for you',
  listings = [],
  isLoading,
  errorMessage,
  seeAllPath = '/marketplace',
}: RecommendedListingsGridProps) {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <Link to={seeAllPath} className="text-sm font-semibold text-yellow-600 hover:text-yellow-700">
          View all →
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-video bg-gray-100 rounded-xl" />
          ))}
        </div>
      ) : errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : listings.length === 0 ? (
        <p className="text-sm text-gray-500">No recommendations available right now.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Link key={listing.id} to="/marketplace" className="group">
              <div className="aspect-video w-full rounded-xl overflow-hidden mb-3 bg-gray-100">
                <img
                  src={listing.imageUrl ?? PLACEHOLDER_IMAGE}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-gray-900">{listing.title}</h3>
              <p className="text-sm text-gray-500">{listing.location}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
