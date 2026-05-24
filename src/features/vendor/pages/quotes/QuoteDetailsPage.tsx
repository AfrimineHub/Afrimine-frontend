import React from 'react';
import { ChevronDown } from 'lucide-react';
import { RfqDetailsCard } from '../../components/quotes/RfqDetailsCard';
import { QuoteResponseForm } from '../../components/quotes/QuoteResponseForm';

export const QuoteDetailsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header matching Image 2 */}
        <div className="flex justify-between items-start mb-8 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quotes</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and respond to buyer request</p>
          </div>
          <div className="relative">
            <button className="flex items-center justify-between gap-8 px-4 py-2 bg-gray-100/80 hover:bg-gray-200/80 rounded-lg text-sm font-medium text-slate-700 transition-colors w-32 cursor-pointer">
              All <ChevronDown size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Top Half: Details & Context */}
          <RfqDetailsCard />
          
          {/* Bottom Half: Response Form */}
          <QuoteResponseForm />
        </div>

      </div>
    </div>
  );
};