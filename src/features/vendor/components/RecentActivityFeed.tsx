import React from 'react';
import {
  Bell,
  FileText,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  type LucideIcon,
} from 'lucide-react';
import type { DashboardNotification } from '@/features/dashboard/types';
import { formatRelativeTime } from '@/lib/utils/formatRelativeTime';
interface RecentActivityFeedProps {
  notifications?: DashboardNotification[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

function pickActivityIcon(title: string, message: string): { icon: LucideIcon; color: string; bg: string } {
  const text = `${title} ${message}`.toLowerCase();

  if (text.includes('quote') || text.includes('rfq')) {
    return { icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' };
  }
  if (text.includes('message')) {
    return { icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' };
  }
  if (text.includes('escrow') || text.includes('order')) {
    return { icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' };
  }
  if (text.includes('accept')) {
    return { icon: CheckCircle, color: 'text-purple-500', bg: 'bg-purple-50' };
  }
  if (text.includes('payment') || text.includes('payout')) {
    return { icon: CreditCard, color: 'text-yellow-600', bg: 'bg-yellow-50' };
  }

  return { icon: Bell, color: 'text-slate-500', bg: 'bg-slate-50' };
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  notifications = [],
  isLoading,
  isError,
  errorMessage,
}) => {
  return (
    <div className="col-span-1 p-4 sm:p-6 bg-white border border-gray-100 rounded-xl shadow-sm min-w-0">
      <h3 className="mb-4 text-lg font-bold text-slate-900">Recent Activity</h3>

      {isLoading ? (
        <div className="space-y-6" aria-busy="true" aria-label="Loading activity">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3 sm:gap-4 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage ?? 'Could not load recent activity.'}
        </p>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-gray-500">No recent activity yet.</p>
      ) : (
        <div className="space-y-6">
          {notifications.map((notification) => {
            const title = notification.title?.trim() || 'Notification';
            const body = notification.message?.trim() ?? '';
            const displayTitle = body ? `${title}: ${body}` : title;
            const { icon: Icon, color, bg } = pickActivityIcon(title, body);

            return (
              <div key={notification.id} className="flex gap-3 sm:gap-4 min-w-0">
                <div className={`mt-1 p-2 rounded-full h-fit shrink-0 ${bg} ${color}`}>
                  <Icon size={16} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 break-words">{displayTitle}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
