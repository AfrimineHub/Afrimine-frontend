import React from 'react';
import { Wallet } from 'lucide-react';

export const DashboardOverviewCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
      {/* Subscription Card */}
      <div className="p-4 sm:p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
        <div className="flex flex-col gap-3 mb-6 min-w-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium text-yellow-800 bg-yellow-100 rounded-md w-fit max-w-full">
            <span className="mr-2 shrink-0" aria-hidden>💎</span>
            <span className="truncate">Diamond Plan</span>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center min-h-10 w-full sm:w-auto px-3 py-2 text-sm font-medium text-white transition-colors bg-slate-900 rounded-md hover:bg-slate-800 shrink-0"
          >
            Upgrade Plan
          </button>
        </div>
        <div className="flex flex-col gap-4 mb-2 min-w-0 sm:flex-row sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-gray-500">Listings Remaining</p>
            <p className="text-xl sm:text-2xl font-bold tabular-nums">
              <span className="text-slate-900">13</span>{' '}
              <span className="text-xs sm:text-sm font-normal text-gray-400">/25 Total</span>
            </p>
          </div>
          <div className="text-left sm:text-right min-w-0">
            <p className="text-sm text-gray-500">Listings Used</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">12</p>
          </div>
        </div>
        <div className="w-full h-2 mt-4 overflow-hidden bg-gray-100 rounded-full">
          <div className="h-full bg-yellow-600 rounded-full" style={{ width: '48%' }} />
        </div>
        <p className="mt-2 text-xs text-gray-400">48% of your plan used</p>
      </div>

      {/* Revenue Card */}
      <div className="p-4 sm:p-6 text-white bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col h-full justify-between gap-4 sm:flex-row sm:gap-0 min-w-0">
          <div className="min-w-0">
            <p className="flex items-center mb-1 text-sm text-yellow-100">
              <Wallet size={16} className="mr-2 shrink-0" aria-hidden /> Total Revenue Inflow
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tabular-nums">₦45,280</h2>
            <p className="mt-1 text-xs text-yellow-200">+12% from previous month</p>
          </div>
          <div className="min-w-0 sm:text-right">
            <p className="mb-1 text-sm text-yellow-100">This Month</p>
            <h3 className="text-xl sm:text-2xl font-bold tabular-nums">₦12,450</h3>
            <p className="mt-1 text-xs text-yellow-200">+5% from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
};