import React from 'react';
import { FileText, ShoppingCart, Plus } from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between mb-8 gap-4">
      <div className="min-w-0">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-xs md:text-sm text-gray-500">Welcome back! Here's your vendor overview.</p>
      </div>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full lg:w-auto lg:max-w-none shrink-0">
        <button
          type="button"
          className="inline-flex items-center justify-center min-h-11 w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <FileText size={16} className="mr-2 shrink-0" aria-hidden /> View Quote
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center min-h-11 w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <ShoppingCart size={16} className="mr-2 shrink-0" aria-hidden /> Check Orders
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center min-h-11 w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white transition-colors bg-yellow-600 rounded-md hover:bg-yellow-700 shadow-sm cursor-pointer"
        >
          <Plus size={16} className="mr-2 shrink-0" aria-hidden /> Create listings
        </button>
      </div>
    </div>
  );
};