import React from 'react';
import { FileText, ShoppingCart, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  displayName?: string;
  unreadMessagesCount?: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  displayName,
  unreadMessagesCount = 0,
}) => {
  const greeting = displayName ? `Welcome back, ${displayName}!` : "Welcome back! Here's your vendor overview.";
  const unreadHint =
    unreadMessagesCount > 0
      ? `${unreadMessagesCount} unread message${unreadMessagesCount === 1 ? '' : 's'}`
      : null;

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between mb-8 gap-4">
      <div className="min-w-0">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-xs md:text-sm text-gray-500">
          {greeting}
          {unreadHint ? (
            <>
              {' '}
              <span className="text-yellow-700 font-medium">· {unreadHint}</span>
            </>
          ) : null}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full lg:w-auto lg:max-w-none shrink-0">
        <Link
          to="/dashboard/my-quotes"
          className="inline-flex items-center justify-center min-h-11 w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          <FileText size={16} className="mr-2 shrink-0" aria-hidden /> View Quote
        </Link>
        <Link
          to="/my-order"
          className="inline-flex items-center justify-center min-h-11 w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          <ShoppingCart size={16} className="mr-2 shrink-0" aria-hidden /> Check Orders
        </Link>
        <Link
          to="/my-ad/new"
          className="inline-flex items-center justify-center min-h-11 w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white transition-colors bg-yellow-600 rounded-md hover:bg-yellow-700 shadow-sm"
        >
          <Plus size={16} className="mr-2 shrink-0" aria-hidden /> Create listings
        </Link>
      </div>
    </div>
  );
};
