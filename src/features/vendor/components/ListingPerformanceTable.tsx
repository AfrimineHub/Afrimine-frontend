import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, Mail } from 'lucide-react';
import type { ListingPerformanceItem } from '@/features/vendor/dashboardTypes';
import { formatCount } from '@/features/vendor/dashboardUtils';

interface ListingPerformanceTableProps {
  items?: ListingPerformanceItem[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

export const ListingPerformanceTable: React.FC<ListingPerformanceTableProps> = ({
  items = [],
  isLoading,
  isError,
  errorMessage,
}) => {
  return (
    <div className="col-span-1 lg:col-span-2 p-4 sm:p-6 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden min-w-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-900">Listing Performance</h3>
        <Link to="/my-ad" className="text-xs font-medium text-yellow-600 hover:text-yellow-700">
          View All →
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage ?? 'Could not load listing performance.'}
        </p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">No listing performance data yet.</p>
      ) : (
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-6 px-6">
          <table className="w-full text-sm text-left min-w-[500px]">
            <thead className="text-gray-500 border-b border-gray-100">
              <tr>
                <th className="pb-3 font-medium">Listing Name</th>
                <th className="pb-3 font-medium text-center">Views</th>
                <th className="pb-3 font-medium text-center">Saves</th>
                <th className="pb-3 font-medium text-center">Inquiries</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) => (
                <tr key={item.listingId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 font-medium text-slate-900">{item.title ?? 'Untitled listing'}</td>
                  <td className="py-4 text-center text-gray-600">
                    <span className="inline-flex items-center justify-center gap-1">
                      <Eye size={14} aria-hidden />
                      {formatCount(item.viewsCount)}
                    </span>
                  </td>
                  <td className="py-4 text-center text-gray-600">
                    <span className="inline-flex items-center justify-center gap-1">
                      <Heart size={14} aria-hidden />
                      {formatCount(item.savesCount)}
                    </span>
                  </td>
                  <td className="py-4 text-center text-gray-600">
                    <span className="inline-flex items-center justify-center gap-1">
                      <Mail size={14} aria-hidden />
                      {formatCount(item.inquiriesCount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
